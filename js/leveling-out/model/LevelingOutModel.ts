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
import Vector2 from '../../../../dot/js/Vector2.js';
import CandyBar from './CandyBar.js';
import SharingModel, { SharingModelOptions } from '../../common/model/SharingModel.js';

type SelfOptions = EmptySelfOptions;
type LevelingOutModelOptions = SelfOptions & PickRequired<SharingModelOptions, 'tandem'>;

export default class LevelingOutModel extends SharingModel<CandyBar> {

  public constructor( providedOptions?: LevelingOutModelOptions ) {

    const options = optionize<LevelingOutModelOptions, SelfOptions, SharingModelOptions>()( {}, providedOptions );
    super( options );

    const candyBarsParentTandem = options.tandem.createTandem( 'notepadCandyBars' );

    // In Mean Share and Balance, we decided arrays start counting at 1 for phet-io.
    let totalCandyBarCount = 1;

    this.plates.forEach( plate => {

      // Create and initialize all the candy bars.
      for ( let candyBarIndex = 0;
            candyBarIndex < MeanShareAndBalanceConstants.MAX_NUMBER_OF_CANDY_BARS_PER_PERSON;
            candyBarIndex++ ) {

        const x = plate.xPosition;
        const y = getCandyBarYPosition( candyBarIndex );
        const isActive = plate.isActiveProperty.value && candyBarIndex < plate.snackNumberProperty.value;

        const candyBar = new CandyBar( {
          isActive: isActive,
          plate: plate,
          position: new Vector2( x, y ),

          // phet-io
          tandem: candyBarsParentTandem.createTandem( `notepadCandyBar${totalCandyBarCount++}` )
        } );

        this.snacks.push( candyBar );
      }

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

  public getTopActiveCandyBarAssignedToPlate( plate: Plate ): CandyBar {
    const activeCandyBarsOnPlate = this.getActiveCandyBarsAssignedToPlate( plate );
    assert && assert( activeCandyBarsOnPlate.length > 0, `There is no top candy bar on plate since active candyBars is: ${activeCandyBarsOnPlate.length}` );
    const topCandyBar = _.minBy( activeCandyBarsOnPlate, candyBar => candyBar.positionProperty.value.y );
    return topCandyBar!;
  }

  public getBottomInactiveCandyBarAssignedToPlate( plate: Plate ): CandyBar {
    const inactiveCandyBarsOnPlate = this.getInactiveSnacksAssignedToPlate( plate );
    assert && assert(
      inactiveCandyBarsOnPlate.length > 0,
      `There is no inactive bottom candy bar on plate since inactive candyBars is: ${inactiveCandyBarsOnPlate.length}`
    );
    const bottomCandyBar = _.maxBy( inactiveCandyBarsOnPlate, candyBar => candyBar.positionProperty.value.y );
    return bottomCandyBar!;
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
      return numberOfCandyBars < MeanShareAndBalanceConstants.MAX_NUMBER_OF_CANDY_BARS_PER_PERSON;
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

    // The non-animating candy bars should be at the bottom of the stack. Animating candy bars will go on top.
    // This is needed primarily for handling multitouch and race conditions.
    nonAnimatingActiveCandyBars.forEach( ( candyBar, i ) => {
      candyBar.positionProperty.set( new Vector2( plate.xPosition, getCandyBarYPosition( i ) ) );
    } );

    // Set a potentially new destination for any animating candy bars.
    animatingCandyBars.forEach( ( candyBar, i ) => {
      candyBar.travelTo( new Vector2(
        plate.xPosition,
        getCandyBarYPosition( i + nonAnimatingActiveCandyBars.length )
      ) );
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
        this.getTopActiveCandyBarAssignedToPlate( maxPlate ).isActiveProperty.set( false );
        this.reorganizeSnacks( maxPlate );
      }
    }
    else if ( numberOfTablePlateSnacks < numberOfNotepadPlateSnacks ) {
      const delta = numberOfNotepadPlateSnacks - numberOfTablePlateSnacks;
      for ( let i = 0; i < delta; i++ ) {
        const minPlate = this.getPlateWithLeastCandyBars();
        this.getBottomInactiveCandyBarAssignedToPlate( minPlate ).isActiveProperty.set( true );
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
      if ( numberOfCandyBarsOnPlate === MeanShareAndBalanceConstants.MAX_NUMBER_OF_CANDY_BARS_PER_PERSON ) {
        const minPlate = this.getPlateWithLeastCandyBars();
        assert && assert(
          minPlate !== plate,
          `minPlate ${minPlate.linePlacement} should not be the same as affected plate: ${plate.linePlacement}`
        );
        this.getBottomInactiveCandyBarAssignedToPlate( minPlate ).isActiveProperty.set( true );
        this.reorganizeSnacks( minPlate );
      }
      else {
        this.getBottomInactiveCandyBarAssignedToPlate( plate ).isActiveProperty.set( true );
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
        this.getTopActiveCandyBarAssignedToPlate( maxPlate ).isActiveProperty.set( false );
        this.reorganizeSnacks( maxPlate );
      }
      else {
        this.getTopActiveCandyBarAssignedToPlate( plate ).isActiveProperty.set( false );
      }
      this.reorganizeSnacks( plate );
    }
  }

  public getPlateWithMostActiveCandyBars(): Plate {
    const maxPlate = _.maxBy( this.getActivePlates(), ( plate => this.getActiveCandyBarsAssignedToPlate( plate ).length ) );

    // _.maxBy can return undefined if all the elements in the array are null, undefined, or NAN.
    // candyBarsNumberProperty will always be a number.
    return maxPlate!;
  }

  public getPlateWithLeastCandyBars(): Plate {
    const minPlate = _.minBy( this.getActivePlates(), ( plate => this.getActiveCandyBarsAssignedToPlate( plate ).length ) );

    // _.minBy can return undefined if all the elements in the array are null, undefined, or NAN.
    // candyBarsNumberProperty will always be a number.
    return minPlate!;
  }

  public override reset(): void {

    super.reset();

    this.snacks.forEach( candyBar => { candyBar.reset(); } );
  }
}

/**
 * Helper function to get the Y position of a candy bar stacked on a plate in the notepad based on its position in the
 * stack.  Zero is the bottom-most position in the stack.  The Y position is for the top of the candy bar.
 */
const getCandyBarYPosition = ( stackPosition: number ) => {
  return MeanShareAndBalanceConstants.NOTEPAD_PLATE_CENTER_Y -
         ( ( MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT +
             MeanShareAndBalanceConstants.NOTEPAD_CANDY_BAR_VERTICAL_SPACING ) * ( stackPosition + 1 ) );
};

meanShareAndBalance.register( 'LevelingOutModel', LevelingOutModel );