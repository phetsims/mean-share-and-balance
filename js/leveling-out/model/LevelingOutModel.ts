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

    this.groupSortInteractionModel = new GroupSortInteractionModel<CandyBar>( {
      getGroupItemValue: candyBar => candyBar.parentPlateProperty.value.linePlacement,
      tandem: options.tandem.createTandem( 'groupSortInteractionModel' )
    } );
    this.sortingRangeProperty = new DerivedProperty( [ this.numberOfPlatesProperty ],
      numberOfPlates => new Range( 0, numberOfPlates - 1 ) );
    this.stackChangedEmitter = new Emitter();

    const selectedCandyBarProperty = this.groupSortInteractionModel.selectedGroupItemProperty;
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
        selectedCandyBarProperty.value = this.getTopActiveCandyBarAssignedToPlate( parentPlate );
      }
    } );

    // In Mean Share and Balance, we decided arrays start counting at 1 for phet-io.
    let totalCandyBarCount = 1;

    this.plates.forEach( plate => {

      // Create and initialize all the candy bars.
      _.times( MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE, candyBarIndex => {
        const isActive = plate.isActiveProperty.value && candyBarIndex < plate.snackNumberProperty.value;

        const candyBar = new CandyBar( {
          isActive: isActive,
          plate: plate,
          position: SnackStacker.getStackedCandyBarPosition( plate, candyBarIndex ),

          // phet-io
          tandem: candyBarsParentTandem.createTandem( `notepadCandyBar${totalCandyBarCount++}` )
        } );

        candyBar.parentPlateProperty.link( plate => {
          const numberOfCandyBarsOnPlate = this.getNumberOfCandyBarsStackedOnPlate( plate );
          const endPosition = SnackStacker.getStackedCandyBarPosition( plate, numberOfCandyBarsOnPlate );

          // Keyboard interaction should not animate the candy bar.
          if ( this.groupSortInteractionModel.isKeyboardFocusedProperty.value ) {
            candyBar.forceAnimationToFinish();
            candyBar.positionProperty.set( endPosition );
          }
          else {
            candyBar.travelTo( endPosition );
          }
          this.reorganizeSnacks( plate );
          this.stackChangedEmitter.emit();
        } );

        this.snacks.push( candyBar );
      } );

      // Connect draggable candy bar visibility to plate isActive and the number of items on the plate.
      plate.isActiveProperty.lazyLink( isActive => {
        const candyBars = this.getSnacksAssignedToPlate( plate );

        // If a plate became inactive, we need to account for the extra or missing candy bars.
        if ( !isActive ) {
          this.reconcileSnacks( plate );
          assert && assert( plate.snackNumberProperty.value === this.getActiveCandyBarsAssignedToPlate( plate ).length,
            'The number of candy bars on the table plate should match the number of candy bars on the notepad plate.' );
        }

        // After reconciling the snacks set the snackNumberProperty for the removed plate to 0.
        plate.snackNumberProperty.set( isActive ? 1 : 0 );
        candyBars.forEach( ( candyBar, i ) => {
          candyBar.isActiveProperty.value = isActive && i < plate.snackNumberProperty.value;
          this.reorganizeSnacks( plate );
        } );
      } );

      // Add/remove candy bars to/from the notepad plates as the number of them on the table plates changes.
      plate.snackNumberProperty.lazyLink( ( candyBarNumber, oldCandyBarNumber ) => {
        if ( plate.isActiveProperty.value ) {
          if ( candyBarNumber > oldCandyBarNumber ) {
            this.tablePlateCandyBarAmountIncrease( plate, candyBarNumber - oldCandyBarNumber );
          }
          else if ( candyBarNumber < oldCandyBarNumber ) {
            this.tablePlateCandyBarAmountDecrease( plate, oldCandyBarNumber - candyBarNumber );
          }
          this.stackChangedEmitter.emit();
        }
      } );
    } );
  }

  public getActiveCandyBars(): Array<CandyBar> {
    return this.snacks.filter( candyBar => candyBar.isActiveProperty.value );
  }

  public getActiveCandyBarsAssignedToPlate( plate: Plate ): Array<CandyBar> {
    return this.snacks.filter( candyBar => candyBar.parentPlateProperty.value === plate && candyBar.isActiveProperty.value );
  }

  public getTopActiveCandyBarAssignedToPlate( plate: Plate ): CandyBar | null {
    const activeCandyBarsOnPlate = this.getActiveCandyBarsAssignedToPlate( plate );
    const topCandyBar = _.minBy( activeCandyBarsOnPlate, candyBar => candyBar.positionProperty.value.y );
    return topCandyBar || null;
  }

  public getBottomInactiveCandyBarAssignedToPlate( plate: Plate ): CandyBar | null {
    const inactiveCandyBarsOnPlate = this.getInactiveSnacksAssignedToPlate( plate );
    const bottomCandyBar = _.maxBy( inactiveCandyBarsOnPlate, candyBar => candyBar.positionProperty.value.y );
    return bottomCandyBar || null;
  }

  /**
   * Get all active candy bars associated with a plate that are not dragging or animating.
   */
  public getActiveCandyBarsOnPlate( plate: Plate ): Array<CandyBar> {
    const candyBars = this.getActiveCandyBarsAssignedToPlate( plate );
    return candyBars.filter( candyBar => candyBar.stateProperty.value === 'plate' );
  }

  public getActiveCandyBarsAnimatingToPlate( plate: Plate ): Array<CandyBar> {
    const candyBars = this.getActiveCandyBarsAssignedToPlate( plate );
    return candyBars.filter( candyBar => candyBar.stateProperty.value === 'animating' );
  }

  public getPlatesWithSpace( plates: Array<Plate> ): Array<Plate> {
    return plates.filter( plate => {
      const numberOfCandyBars = this.getNumberOfCandyBarsStackedOnPlate( plate );
      return numberOfCandyBars < MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE;
    } );
  }

  /**
   * Get the number of candy bars that are currently stacked on a plate in the notepad.
   * This includes candy bars that are animating since they need to be factored into stacking logic.
   */
  public getNumberOfCandyBarsStackedOnPlate( plate: Plate ): number {
    return this.getActiveCandyBarsOnPlate( plate ).length + this.getActiveCandyBarsAnimatingToPlate( plate ).length;
  }

  /**
   * When candyBars are added to a plate in the notepad they may appear in random positions or be overlapping. Re-stack
   * them.
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
      candyBar.travelTo( SnackStacker.getStackedCandyBarPosition( plate, i + nonAnimatingActiveCandyBars.length ) );
    } );
  }

  /**
   * When a plate becomes inactive, we need to account for the extra or missing candy bars.
   */
  private reconcileSnacks( plate: Plate ): void {
    const numberOfTablePlateSnacks = plate.snackNumberProperty.value;
    const numberOfNotepadPlateSnacks = this.getActiveCandyBarsAssignedToPlate( plate ).length;

    if ( numberOfTablePlateSnacks > numberOfNotepadPlateSnacks ) {
      const delta = numberOfTablePlateSnacks - numberOfNotepadPlateSnacks;
      for ( let i = 0; i < delta; i++ ) {
        const maxPlate = this.getPlateWithMostActiveCandyBars();
        const topCandyBar = this.getTopActiveCandyBarAssignedToPlate( maxPlate );
        assert && assert( topCandyBar,
          `There are no plates with active candy bars, but we are still trying to reconcile our number of
          tablePlateSnacks: ${numberOfTablePlateSnacks} and our number of
          notepadPlateSnacks: ${numberOfNotepadPlateSnacks}.` );
        topCandyBar!.isActiveProperty.set( false );
        this.reorganizeSnacks( maxPlate );
      }
    }
    else if ( numberOfTablePlateSnacks < numberOfNotepadPlateSnacks ) {
      const delta = numberOfNotepadPlateSnacks - numberOfTablePlateSnacks;
      for ( let i = 0; i < delta; i++ ) {
        const minPlate = this.getPlateWithLeastCandyBars();
        const bottomInactiveCandyBar = this.getBottomInactiveCandyBarAssignedToPlate( minPlate );
        assert && assert( bottomInactiveCandyBar,
          `There are no plates with inactive candy bars, but we are still trying to reconcile our number of
          tablePlateSnacks: ${numberOfTablePlateSnacks} and our number of
          notepadPlateSnacks: ${numberOfNotepadPlateSnacks}.` );
        bottomInactiveCandyBar!.isActiveProperty.set( true );
        this.reorganizeSnacks( minPlate );
      }
    }

    const snacksOnNotepadPlate = this.getSnacksAssignedToPlate( plate );
    snacksOnNotepadPlate.forEach( ( snack, i ) => {
      snack.isActiveProperty.value = i < plate.snackNumberProperty.value;
    } );
  }

  /**
   * Handle the situation where a candy bar was added to a plate on the table.  This may simply add one to the
   * corresponding plate in the notepad, but if that plate is already full, some redistribution is necessary.
   */
  private tablePlateCandyBarAmountIncrease( plate: Plate, numberOfCandyBarsAdded: number ): void {
    for ( let i = 0; i < numberOfCandyBarsAdded; i++ ) {
      const numberOfCandyBarsOnPlate = this.getNumberOfCandyBarsStackedOnPlate( plate );
      if ( numberOfCandyBarsOnPlate === MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE ) {
        const minPlate = this.getPlateWithLeastCandyBars();
        assert && assert(
          minPlate !== plate,
          `minPlate ${minPlate.linePlacement} should not be the same as affected plate: ${plate.linePlacement}`
        );
        const bottomInactiveCandyBar = this.getBottomInactiveCandyBarAssignedToPlate( minPlate );
        assert && assert( bottomInactiveCandyBar,
          `There are no inactive candy bars.
          The number of total candy bars on the table is: ${this.totalSnacksProperty.value}, and
          the number of active plates is: ${this.numberOfPlatesProperty.value}.` );
        bottomInactiveCandyBar!.isActiveProperty.set( true );
        this.reorganizeSnacks( minPlate );
      }
      else {
        const bottomInactiveCandyBar = this.getBottomInactiveCandyBarAssignedToPlate( plate );
        assert && assert( bottomInactiveCandyBar,
          `The plate has no inactive candy bars.
          The number of active candy bars on the plate is: ${numberOfCandyBarsOnPlate}` );
        bottomInactiveCandyBar!.isActiveProperty.set( true );
      }
      this.reorganizeSnacks( plate );
    }
  }

  /**
   * When an active tablePlate removes a candyBar and there is no corresponding candyBar available on the notepad
   * snackType, a candyBar will be removed off of the plate on the notepad with the most candyBars.
   */
  private tablePlateCandyBarAmountDecrease( plate: Plate, numberOfCandyBarsRemoved: number ): void {
    for ( let i = 0; i < numberOfCandyBarsRemoved; i++ ) {
      const numberOfCandyBarsOnPlate = this.getNumberOfCandyBarsStackedOnPlate( plate );
      if ( numberOfCandyBarsOnPlate === 0 ) {
        const maxPlate = this.getPlateWithMostActiveCandyBars();
        const topCandyBar = this.getTopActiveCandyBarAssignedToPlate( maxPlate );
        assert && assert( topCandyBar,
          `There are no plates with active candy bars.
          The current number of total candy bars on the table is: ${this.totalSnacksProperty.value}.` );
        topCandyBar!.isActiveProperty.set( false );
        this.reorganizeSnacks( maxPlate );
      }
      else {
        const topCandyBar = this.getTopActiveCandyBarAssignedToPlate( plate );
        assert && assert( topCandyBar,
          `This plate has no active candy bars. The numberOfCandyBarsOnPlate is: ${numberOfCandyBarsOnPlate}.` );
        topCandyBar!.isActiveProperty.set( false );
      }
      this.reorganizeSnacks( plate );
    }
  }

  public getPlateWithMostActiveCandyBars(): Plate {
    const maxPlate = _.maxBy( this.getActivePlates(), ( plate => this.getActiveCandyBarsAssignedToPlate( plate ).length ) );

    // _.maxBy can return undefined if all the elements in the array are null, undefined, or NAN.
    // The length of the active candy bars array will always be a number.
    return maxPlate!;
  }

  public getPlateWithLeastCandyBars(): Plate {
    const minPlate = _.minBy( this.getActivePlates(), ( plate => this.getActiveCandyBarsAssignedToPlate( plate ).length ) );

    // _.minBy can return undefined if all the elements in the array are null, undefined, or NAN.
    // The length of the active candy bars array will always be a number.
    return minPlate!;
  }

  /**
   * Get all the plates that have at least one candy bar on them.
   */
  public getPlatesWithSnacks(): Array<Plate> {
    return this.plates.filter( plate => this.getActiveCandyBarsAssignedToPlate( plate ).length > 0 );
  }

  public override reset(): void {
    super.reset();
    this.groupSortInteractionModel.reset();
    this.snacks.forEach( candyBar => { candyBar.reset(); } );
  }
}

meanShareAndBalance.register( 'LevelingOutModel', LevelingOutModel );