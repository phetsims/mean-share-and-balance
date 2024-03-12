// Copyright 2022-2024, University of Colorado Boulder

/**
 * Model for the Leveling Out Screen which includes people, candy bars, visual mean snackType, and a numerical
 * mean snackType.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Plate from '../../common/model/Plate.js';
import CandyBar from './CandyBar.js';
import SharingModel, { SharingModelOptions } from '../../common/model/SharingModel.js';
import GroupSortInteractionModel from '../../../../scenery-phet/js/accessibility/group-sort/model/GroupSortInteractionModel.js';
import Range from '../../../../dot/js/Range.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import SnackStacker from '../../common/SnackStacker.js';
import Utils from '../../../../dot/js/Utils.js';

type SelfOptions = EmptySelfOptions;
type LevelingOutModelOptions = SelfOptions & PickRequired<SharingModelOptions, 'tandem'>;

//TODO: Does this now need to extend PhetioObject to work with GroupSortInteractionModel?, see: https://github.com/phetsims/mean-share-and-balance/issues/137
export default class LevelingOutModel extends SharingModel<CandyBar> {

  public groupSortInteractionModel: GroupSortInteractionModel<CandyBar>;
  public sortingRangeProperty: TReadOnlyProperty<Range>;

  // This emitter is used to update the keyboard focus when stack changes on a plate.
  private stackChangedEmitter: Emitter;

  public constructor( providedOptions?: LevelingOutModelOptions ) {

    const options = optionize<LevelingOutModelOptions, SelfOptions, SharingModelOptions>()( {}, providedOptions );
    super( options );

    const candyBarsParentTandem = options.tandem.createTandem( 'notepadCandyBars' );

    /**
     * Create and define the keyboard interaction for candy bars.
     */
    this.groupSortInteractionModel = new GroupSortInteractionModel<CandyBar>( {
      getGroupItemValue: candyBar => {
        assert && assert( candyBar.parentPlateProperty.value, 'candyBar is not assigned to a plate' );
        return candyBar.parentPlateProperty.value!.linePlacement;
      },
      tandem: options.tandem.createTandem( 'groupSortInteractionModel' )
    } );
    this.sortingRangeProperty = new DerivedProperty( [ this.numberOfPlatesProperty ],
      numberOfPlates => new Range( 0, numberOfPlates - 1 ) );
    const selectedCandyBarProperty = this.groupSortInteractionModel.selectedGroupItemProperty;

    this.stackChangedEmitter = new Emitter();
    this.stackChangedEmitter.addListener( () => {
      const selectedCandyBar = selectedCandyBarProperty.value;

      // If the selected candy bar is not active, default back to the first top active candy bar or null if there are
      // no active candy bars.
      if ( selectedCandyBar !== null && !selectedCandyBar.isActiveProperty.value ) {
        const platesWithSnacks = this.getPlatesWithSnacks();
        selectedCandyBarProperty.value = this.getTopActiveCandyBarAssignedToPlate( platesWithSnacks[ 0 ] );
      }
      else if ( selectedCandyBar !== null ) {
        const parentPlate = selectedCandyBar?.parentPlateProperty.value;
        assert && assert( parentPlate, 'selectedCandyBar has no parent plate, but it should' );
        selectedCandyBarProperty.value = this.getTopActiveCandyBarAssignedToPlate( parentPlate! );
      }
    } );

    /**
     * Create and initialize the candy bars.
     */
    let totalCandyBarCount = 1;

    this.plates.forEach( plate => {

      // Create and initialize all the candy bars.
      _.times( MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE, candyBarIndex => {
        const position = SnackStacker.getStackedCandyBarPosition( plate, candyBarIndex );
        const isActive = plate.isActiveProperty.value && candyBarIndex < plate.notepadSnackNumberProperty.value;

        const candyBar = new CandyBar( {
          isActive: isActive,
          plate: plate,
          position: position,

          // phet-io
          tandem: candyBarsParentTandem.createTandem( `notepadCandyBar${totalCandyBarCount++}` )
        } );

        candyBar.parentPlateProperty.link( plate => {
          if ( plate ) {

            // We do not want to use plate.notepadSnackNumberProperty.value here because it may not be updated yet.
            const numberOfCandyBarsOnPlate = this.getActiveCandyBarsAssignedToPlate( plate ).length - 1;
            const endPosition = SnackStacker.getStackedCandyBarPosition( plate, numberOfCandyBarsOnPlate );

            // Keyboard interaction should not animate the candy bar.
            if ( candyBar.stateProperty.value !== 'dragging' ) {
              candyBar.forceAnimationToFinish();
              candyBar.positionProperty.set( endPosition );
            }
            else {
              candyBar.moveTo( endPosition, true );
            }
            this.reorganizeSnacks( plate );
            this.stackChangedEmitter.emit();
          }
        } );

        this.snacks.push( candyBar );
      } );

      // Monitor the X position of each plate and move the candy bars that are on it when changes occur.
      plate.xPositionProperty.link( () => {
        this.getSnacksAssignedToPlate( plate ).forEach( ( candyBar, i ) => {
          candyBar.forceAnimationToFinish();
          candyBar.positionProperty.value = SnackStacker.getStackedCandyBarPosition( plate, i );
        } );
      } );

      /**
       * The following three links must be lazy since they rely on an accurate delta of snack numbers.
       * This information is not available at startup.
       */

      // Connect draggable candy bar visibility to plate isActive and the number of items on the plate.
      plate.isActiveProperty.lazyLink( isActive => {

        // If a plate became inactive, we need to account for the extra or missing candy bars.
        if ( !isActive && !this.resetInProgress ) {
          this.reconcileSnacks( plate );
          plate.tableSnackNumberProperty.set( 0 );
        }
        else {
          plate.tableSnackNumberProperty.reset();
        }

        this.handleCandyBarActivation( plate );
      } );

      // Add/remove candy bars to/from the notepad plates as the number of them on the table plates changes.
      plate.tableSnackNumberProperty.lazyLink( ( candyBarNumber, oldCandyBarNumber ) => {

        if ( !this.resetInProgress ) {
          const originalNotepadSnackNumber = plate.notepadSnackNumberProperty.value;
          const tableDelta = candyBarNumber - oldCandyBarNumber;

          plate.notepadSnackNumberProperty.value = Utils.clamp( originalNotepadSnackNumber + tableDelta,
            MeanShareAndBalanceConstants.MIN_NUMBER_OF_SNACKS_PER_PLATE,
            MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE );
          const remaining = tableDelta + originalNotepadSnackNumber - plate.notepadSnackNumberProperty.value;

          // If remaining is not 0, we maxed out the space of the notepad plate and need to allocate the remaining candy
          // bar delta to other plates.
          remaining !== 0 && this.handleCandyBarRemainder( remaining );
        }

      } );

      plate.notepadSnackNumberProperty.lazyLink( () => {
        this.handleCandyBarActivation( plate );
      } );
    } );
  }

  /**
   * There are various scenarios where a candy bar may have to be activated or deactivated. This function
   * handles the activation of candy bars on a plate according to the notepadSnackNumberProperty.
   */
  private handleCandyBarActivation( plate: Plate ): void {
    this.getSnacksAssignedToPlate( plate ).forEach( ( candyBar, i ) => {
      candyBar.isActiveProperty.value = i < plate.notepadSnackNumberProperty.value && plate.isActiveProperty.value;
    } );
    this.reorganizeSnacks( plate );
    this.stackChangedEmitter.emit();
  }

  /**
   * This function returns an array of active candy bars assigned to a specific plate.
   */
  private getActiveCandyBarsAssignedToPlate( plate: Plate ): Array<CandyBar> {
    return this.snacks.filter( candyBar => candyBar.parentPlateProperty.value === plate && candyBar.isActiveProperty.value );
  }

  /**
   * Candy bars are stacked with active candy bars on the bottom and inactive candy bars on top. This function retrieves
   * the top active candy bar on a plate.
   */
  public getTopActiveCandyBarAssignedToPlate( plate: Plate ): CandyBar | null {
    const activeCandyBarsOnPlate = this.getActiveCandyBarsAssignedToPlate( plate );
    const topCandyBar = _.minBy( activeCandyBarsOnPlate, candyBar => candyBar.positionProperty.value.y );
    return topCandyBar || null;
  }

  /**
   * Candy bars are stacked with active candy bars on the bottom and inactive candy bars on top. This function retrieves
   * the bottom inactive candy bar on a plate.
   */
  public getBottomInactiveCandyBarAssignedToPlate( plate: Plate ): CandyBar | null {
    const inactiveCandyBarsOnPlate = this.getInactiveSnacksAssignedToPlate( plate );
    const bottomCandyBar = _.maxBy( inactiveCandyBarsOnPlate, candyBar => candyBar.positionProperty.value.y );
    return bottomCandyBar || null;
  }

  /**
   * This function returns an array of all active candy bars associated with a plate that are not dragging or animating.
   */
  private getActiveCandyBarsOnPlate( plate: Plate ): Array<CandyBar> {
    const candyBars = this.getActiveCandyBarsAssignedToPlate( plate );
    return candyBars.filter( candyBar => candyBar.stateProperty.value === 'plate' );
  }

  /**
   * This function returns an array of all active candy bars associated with a plate that are animating. A candy bar
   * will only animate towards its parent plate.
   */
  private getActiveCandyBarsAnimatingToPlate( plate: Plate ): Array<CandyBar> {
    const candyBars = this.getActiveCandyBarsAssignedToPlate( plate );
    return candyBars.filter( candyBar => {
      return candyBar.stateProperty.value === 'animating';
    } );
  }

  /**
   * This function returns an array of all active plates that have not reached full capacity.
   */
  public getPlatesWithSpace( plates: Array<Plate> ): Array<Plate> {
    return plates.filter( plate => {
      const numberOfCandyBars = plate.notepadSnackNumberProperty.value;
      return plate.isActiveProperty.value &&
             numberOfCandyBars < MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE;
    } );
  }

  /**
   * When candyBars are added to a plate in the notepad they may appear in random positions or be overlapping. Re-stack
   * them such that the active ones are on the bottom and inactive ones (which are invisible) are on top.
   */
  public override reorganizeSnacks( plate: Plate ): void {
    super.reorganizeSnacks( plate );
    const nonAnimatingActiveCandyBars = this.getActiveCandyBarsOnPlate( plate );
    const animatingCandyBars = this.getActiveCandyBarsAnimatingToPlate( plate );

    // The non-animating candy bars should be at the bottom of the stack (any animating candy bars will go on top).
    nonAnimatingActiveCandyBars.forEach( ( candyBar, i ) => {
      candyBar.positionProperty.set( SnackStacker.getStackedCandyBarPosition( plate, i ) );
    } );

    // Set a potentially new destination for any animating candy bars.
    animatingCandyBars.forEach( ( candyBar, i ) => {
      candyBar.moveTo( SnackStacker.getStackedCandyBarPosition( plate, i + nonAnimatingActiveCandyBars.length ), true );
    } );
  }

  /**
   * When a plate becomes inactive, we need to account for the extra or missing candy bars.
   */
  private reconcileSnacks( plate: Plate ): void {
    const numberOfTablePlateSnacks = plate.tableSnackNumberProperty.value;
    const numberOfNotepadPlateSnacks = plate.notepadSnackNumberProperty.value;
    const remaining = numberOfNotepadPlateSnacks - numberOfTablePlateSnacks;

    // Update the number of notepad snacks by the amount that need to be relocated.
    remaining !== 0 && this.handleCandyBarRemainder( remaining );
    plate.notepadSnackNumberProperty.value -= remaining;
    assert && assert( plate.notepadSnackNumberProperty.value === plate.tableSnackNumberProperty.value,
      'The number of candy bars on the table and notepad plates should be the same.' );
  }

  /**
   * This function handles the remainder of candy bars that need to be added or removed from plates due to stack
   * discrepancies between the table and notepad. This occurs as users drag and drop candy bars in the notepad area.
   */
  private handleCandyBarRemainder( remaining: number ): void {
    _.times( Math.abs( remaining ), () => {
      if ( remaining > 0 ) {
        const minPlate = this.getPlateWithLeastCandyBars();
        assert && assert( minPlate.notepadSnackNumberProperty.value < 10,
          `There are no inactive candy bars.
          The number of total candy bars on the table is: ${this.totalSnacksProperty.value}, and
          the number of active plates is: ${this.numberOfPlatesProperty.value}.` );
        minPlate.notepadSnackNumberProperty.value++;
      }
      else {
        const maxPlate = this.getPlateWithMostActiveCandyBars();
        assert && assert( maxPlate.notepadSnackNumberProperty.value > 0,
          `There are no inactive candy bars.
          The number of total candy bars on the table is: ${this.totalSnacksProperty.value}, and
          the number of active plates is: ${this.numberOfPlatesProperty.value}.` );
        maxPlate.notepadSnackNumberProperty.value--;
      }
    } );
  }

  private getPlateWithMostActiveCandyBars(): Plate {
    const maxPlate = _.maxBy( this.getActivePlates(), ( plate => plate.notepadSnackNumberProperty.value ) );

    // _.maxBy can return undefined if all the elements in the array are null, undefined, or NAN.
    // The notepadSnackNumberProperty.value will always be a number.
    return maxPlate!;
  }

  private getPlateWithLeastCandyBars(): Plate {
    const minPlate = _.minBy( this.getActivePlates(), ( plate => plate.notepadSnackNumberProperty.value ) );

    // _.minBy can return undefined if all the elements in the array are null, undefined, or NAN.
    // The notepadSnackNumberProperty.value will always be a number.
    return minPlate!;
  }

  /**
   * This function returns an array of active plates that have at least one candy bar on them.
   */
  public getPlatesWithSnacks(): Array<Plate> {
    return this.plates.filter( plate => plate.isActiveProperty.value && plate.notepadSnackNumberProperty.value > 0 );
  }

  public override reset(): void {
    this.resetInProgress = true;
    super.reset();
    this.groupSortInteractionModel.reset();
    this.resetInProgress = false;
  }

  public static readonly NOTEPAD_PLATE_CENTER_Y = 330;
  public static readonly CANDY_BAR_WIDTH = Plate.WIDTH;
  public static readonly CANDY_BAR_HEIGHT = 12;
}

meanShareAndBalance.register( 'LevelingOutModel', LevelingOutModel );