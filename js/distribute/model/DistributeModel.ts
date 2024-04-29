// Copyright 2022-2024, University of Colorado Boulder

/**
 * Model for the Distribute Screen which includes people, candy bars, visual mean snackType, and a numerical
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
import Plate, { PLATE_WIDTH } from '../../common/model/Plate.js';
import CandyBar from './CandyBar.js';
import SharingModel, { SharingModelOptions } from '../../common/model/SharingModel.js';
import GroupSortInteractionModel from '../../../../scenery-phet/js/accessibility/group-sort/model/GroupSortInteractionModel.js';
import Range from '../../../../dot/js/Range.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import { SnackOptions } from '../../common/model/Snack.js';
import SnackStacker from '../../common/SnackStacker.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

type SelfOptions = EmptySelfOptions;
type DistributeModelOptions = SelfOptions & PickRequired<SharingModelOptions, 'tandem'>;

const INITIAL_PLATE_VALUES = [ 3, 1, 5, 3, 8, 10, 5 ];

//TODO: Does this now need to extend PhetioObject to work with GroupSortInteractionModel?, see: https://github.com/phetsims/mean-share-and-balance/issues/137
export default class DistributeModel extends SharingModel<CandyBar> {

  public readonly groupSortInteractionModel: GroupSortInteractionModel<CandyBar>;
  public readonly sortingRangeProperty: TReadOnlyProperty<Range>;
  public readonly predictMeanVisibleProperty: Property<boolean>;
  public readonly meanPredictionProperty: Property<number>;
  public readonly predictMeanDragRange = new Range( 0, MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE );

  public constructor( providedOptions?: DistributeModelOptions ) {

    const createCandyBar = ( options: SnackOptions ) => new CandyBar( options );

    const options = optionize<DistributeModelOptions, SelfOptions, SharingModelOptions>()( {
      initialPlateValues: INITIAL_PLATE_VALUES
    }, providedOptions );

    super( createCandyBar, SnackStacker.getStackedCandyBarPosition, _.noop, options );

    /**
     * Create and define the keyboard interaction for candy bars.
     */
    this.groupSortInteractionModel = new GroupSortInteractionModel<CandyBar>( {
      getGroupItemValue: candyBar => {
        const plate = this.getPlateForSnack( candyBar );
        return plate ? plate.linePlacement : null;
      },
      tandem: options.tandem.createTandem( 'groupSortInteractionModel' )
    } );
    this.sortingRangeProperty = new DerivedProperty(
      [ this.numberOfPlatesProperty ],
      numberOfPlates => new Range( 0, numberOfPlates - 1 )
    );

    this.predictMeanVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'predictMeanVisibleProperty' )
    } );

    this.meanPredictionProperty = new NumberProperty( MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE / 2, {
      range: this.predictMeanDragRange,
      tandem: options.tandem.createTandem( 'meanPredictionProperty' )
    } );

    // This emitter is used to update the keyboard focus when stack changes on a plate.  It is meant to be fired each
    // time something changes about the way things are stacked, since this could affect the selected item in the group.
    const stackChangedEmitter = new Emitter();

    // Update the selected item when the stack changes, since the previously selected one could now be gone or buried.
    const selectedCandyBarProperty = this.groupSortInteractionModel.selectedGroupItemProperty;
    stackChangedEmitter.addListener( () => {
      const selectedCandyBar = selectedCandyBarProperty.value;

      // If the selected candy bar is not active, default back to the first top candy bar or null if there are no candy
      // bars on any plate.
      if ( selectedCandyBar !== null && !selectedCandyBar.isActiveProperty.value ) {
        const platesWithSnacks = this.getPlatesWithSnacks();
        selectedCandyBarProperty.value = platesWithSnacks[ 0 ].getTopSnack();
      }
      else if ( selectedCandyBar !== null ) {
        const parentPlate = this.getPlateForSnack( selectedCandyBar );
        assert && assert( parentPlate, 'selectedCandyBar has no parent plate, but it should' );
        selectedCandyBarProperty.value = parentPlate!.getTopSnack();
      }
    } );

    // Fire the stackChangedEmitter when the number of plates changes since this could cause the selected item to disappear.
    this.numberOfPlatesProperty.lazyLink( () => stackChangedEmitter.emit() );

    // Initialize the plates and set up plate-related behavior that is specific to the Distribute screen.
    this.plates.forEach( plate => {

      plate.snacksOnNotepadPlate.addItemAddedListener( snack => {
        snack.isActiveProperty.value = true;
        const index = plate.snacksOnNotepadPlate.indexOf( snack );
        snack.moveTo( plate.getPositionForStackedItem( index ), this.animateAddedSnacks );
      } );

      // Start off with the table and notepad quantities in sync.
      plate.syncNotepadToTable();

      // Monitor the number of snacks on each table plate and add or remove candy bars from the notepad plate in
      // response.  In some situations this is straightforward, but in others it is not.  See the code for details.
      plate.tableSnackNumberProperty.lazyLink( ( candyBarNumber, oldCandyBarNumber ) => {

        const delta = candyBarNumber - oldCandyBarNumber;

        if ( isSettingPhetioStateProperty.value ) {

          // When setting PhET-iO state, we don't want to add or remove snacks from the notepad, since that will be
          // handled by the observable arrays.
          return;
        }
        if ( delta > 0 ) {

          // Add notepad snacks to this plate, or to another if this plate is already full.
          _.times( delta, () => {
            if ( plate.getNumberOfNotepadSnacks() < MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE ) {
              plate.addASnack();
            }
            else {
              const plateWithFewestSnacks = this.getPlateWithFewestSnacks();
              assert && assert( plateWithFewestSnacks, 'when here there should always be space for snacks' );

              plateWithFewestSnacks!.addASnack();
            }
          } );
        }
        else {

          // Remove notepad snacks from this plate, or from another if this plate is empty.
          _.times( Math.abs( delta ), () => {

            // REVIEW: We should probably be checking the min number of snacks on a plate, not hard coding 0.
            if ( plate.getNumberOfNotepadSnacks() > 0 ) {
              plate.removeTopSnack();
            }
            else {
              const plateWithMostSnacks = this.getPlateWithMostSnacks();
              assert && assert( plateWithMostSnacks, 'when here there should always be plates with snacks' );
              plateWithMostSnacks!.removeTopSnack();
            }
          } );
        }
      } );

      // Monitor the isActiveProperty for each plate and do any redistribution of candy bars that is necessary when
      // changes occur.
      plate.isActiveProperty.link( isActive => {

        if ( !isActive ) {

          // Handle the situation where this plate went inactive and had excess candy bars on it.  The inverse
          // situation, i.e. when goes inactive with a deficit, is handled elsewhere.
          // REVIEW QUESTION: Where is that handled?
          const excess = Math.max( plate.getNumberOfNotepadSnacks() - plate.tableSnackNumberProperty.value, 0 );
          if ( excess > 0 ) {

            // Remove snacks from this plate and add them to another.
            _.times( excess, () => {
              plate.removeTopSnack();
              const plateWithFewestSnacks = this.getPlateWithFewestSnacks();

              // REVIEW: Should we confirm that there are indeed plates with space before adding a snack?
              plateWithFewestSnacks!.addASnack();
            } );
          }
        }

        // Set this plate's number of table snacks to zero so that it will release the snacks it has.  This must be done
        // after the redistribution above.
        plate.tableSnackNumberProperty.value = isActive ? plate.startingNumberOfSnacks : 0;
      } );
    } );
  }

  /**
   * This function returns an array of all active plates that have not reached full capacity.
   */
  public getPlatesWithSpace(): Array<Plate<CandyBar>> {
    return this.plates.filter( plate =>
      plate.isActiveProperty.value &&
      plate.getNumberOfNotepadSnacks() < MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE
    );
  }

  /**
   * This function returns an array of active plates that have at least one candy bar on them.
   */
  public getPlatesWithSnacks(): Array<Plate<CandyBar>> {
    return this.plates.filter( plate => plate.isActiveProperty.value && plate.getNumberOfNotepadSnacks() > 0 );
  }


  /**
   * Get the plate with the most snacks, null if no plates have any.
   */
  public getPlateWithMostSnacks(): Plate<CandyBar> | null {
    const sortedPlatesWithSnacks = this.getPlatesWithSnacks().sort(
      ( plateA, plateB ) => plateB.getNumberOfNotepadSnacks() - plateA.getNumberOfNotepadSnacks()
    );
    return sortedPlatesWithSnacks.length > 0 ? sortedPlatesWithSnacks[ 0 ] : null;
  }

  /**
   * Get the plate with the fewest snacks, null if all plates are full.
   */
  private getPlateWithFewestSnacks(): Plate<CandyBar> | null {
    const sortedPlatesWithSpace = this.getPlatesWithSpace().sort(
      ( plateA, plateB ) => plateA.getNumberOfNotepadSnacks() - plateB.getNumberOfNotepadSnacks()
    );
    return sortedPlatesWithSpace.length > 0 ? sortedPlatesWithSpace[ 0 ] : null;
  }

  public override reset(): void {
    this.predictMeanVisibleProperty.reset();

    // Make sure that the number of snacks on the table and the notepad are in sync.
    this.syncData();

    super.reset();
    this.groupSortInteractionModel.reset();
  }

  public static readonly NOTEPAD_PLATE_BOTTOM_Y = 330;
  public static readonly CANDY_BAR_WIDTH = PLATE_WIDTH;
  public static readonly CANDY_BAR_HEIGHT = 12;
}

meanShareAndBalance.register( 'DistributeModel', DistributeModel );