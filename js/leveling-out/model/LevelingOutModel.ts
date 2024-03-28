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
import { SnackOptions } from '../../common/model/Snack.js';

type SelfOptions = EmptySelfOptions;
type LevelingOutModelOptions = SelfOptions & PickRequired<SharingModelOptions, 'tandem'>;

//TODO: Does this now need to extend PhetioObject to work with GroupSortInteractionModel?, see: https://github.com/phetsims/mean-share-and-balance/issues/137
export default class LevelingOutModel extends SharingModel<CandyBar> {

  public groupSortInteractionModel: GroupSortInteractionModel<CandyBar>;
  public sortingRangeProperty: TReadOnlyProperty<Range>;

  // This emitter is used to update the keyboard focus when stack changes on a plate.
  private stackChangedEmitter: Emitter;

  public constructor( providedOptions?: LevelingOutModelOptions ) {

    const createCandyBar = ( options: SnackOptions ) => new CandyBar( options );

    const options = optionize<LevelingOutModelOptions, SelfOptions, SharingModelOptions>()( {}, providedOptions );
    super( createCandyBar, options );

    /**
     * Create and define the keyboard interaction for candy bars.
     */
    this.groupSortInteractionModel = new GroupSortInteractionModel<CandyBar>( {
      getGroupItemValue: candyBar => {
        const plate = this.getPlateForSnack( candyBar );
        assert && assert( plate, 'candyBar is not assigned to a plate' );
        return plate!.linePlacement;
      },
      tandem: options.tandem.createTandem( 'groupSortInteractionModel' )
    } );
    this.sortingRangeProperty = new DerivedProperty(
      [ this.numberOfPlatesProperty ],
      numberOfPlates => new Range( 0, numberOfPlates - 1 )
    );

    this.stackChangedEmitter = new Emitter();

    const selectedCandyBarProperty = this.groupSortInteractionModel.selectedGroupItemProperty;
    this.stackChangedEmitter.addListener( () => {
      const selectedCandyBar = selectedCandyBarProperty.value;

      // If the selected candy bar is not active, default back to the first top candy bar or null if there are no candy
      // bars on any plate.
      if ( selectedCandyBar !== null && !selectedCandyBar.isActiveProperty.value ) {
        const platesWithSnacks = this.getPlatesWithSnacks();
        selectedCandyBarProperty.value = platesWithSnacks[ 0 ].getTopSnack() as CandyBar;
      }
      else if ( selectedCandyBar !== null ) {
        const parentPlate = this.getPlateForSnack( selectedCandyBar );
        assert && assert( parentPlate, 'selectedCandyBar has no parent plate, but it should' );
        selectedCandyBarProperty.value = parentPlate!.getTopSnack() as CandyBar;
      }
    } );

    // Initialize the plates and set up plate-related behavior that is specific to the Leveling Out screen.
    this.plates.forEach( plate => {

      // Start off with the table and notepad quantities in sync.
      plate.syncNotepadToTable();

      // Monitor the number of snacks on the table plate and add or remove candy bars from the notepad plate in
      // response.  In some situations this is easy, but in others it is not.  See the code for details.
      plate.tableSnackNumberProperty.lazyLink( ( candyBarNumber, oldCandyBarNumber ) => {

        const delta = candyBarNumber - oldCandyBarNumber;
        if ( delta > 0 ) {
          _.times( delta, () => { plate.addASnack(); } );
        }
        else {
          _.times( -delta, () => { plate.removeTopSnack(); } );
        }
      } );
    } );
  }

  /**
   * This function returns an array of all active plates that have not reached full capacity.
   */
  public getPlatesWithSpace(): Array<Plate> {
    return this.plates.filter( plate =>
      plate.isActiveProperty.value &&
      plate.getNumberOfHeldSnacks() < MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE
    );
  }

  /**
   * This function returns an array of active plates that have at least one candy bar on them.
   */
  public getPlatesWithSnacks(): Array<Plate> {
    return this.plates.filter( plate => plate.isActiveProperty.value && plate.getNumberOfHeldSnacks() > 0 );
  }

  public override reset(): void {
    super.reset();
    this.groupSortInteractionModel.reset();
  }

  public static readonly NOTEPAD_PLATE_BOTTOM_Y = 330;
  public static readonly CANDY_BAR_WIDTH = Plate.WIDTH;
  public static readonly CANDY_BAR_HEIGHT = 12;
}

meanShareAndBalance.register( 'LevelingOutModel', LevelingOutModel );