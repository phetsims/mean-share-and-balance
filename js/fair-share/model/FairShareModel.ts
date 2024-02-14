// Copyright 2024, University of Colorado Boulder

/**
 * Model for the "Fair Share" Screen which includes people, cookies, visual mean snackType, and a numerical
 * mean snackType.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import SharingModel, { SharingModelOptions } from '../../common/model/SharingModel.js';
import Apple from './Apple.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import SnackStacker from '../../common/SnackStacker.js';

type SelfOptions = EmptySelfOptions;
type FairShareModelOptions = SelfOptions & PickRequired<SharingModelOptions, 'tandem'>;

export class NotepadMode extends EnumerationValue {

  // The information is displayed such that it is in sync with what is on the plates on the table.
  public static readonly SYNC = new NotepadMode( MeanShareAndBalanceStrings.syncStringProperty );

  // The snacks are collected into a single display that doesn't show the plates.
  public static readonly COLLECT = new NotepadMode( MeanShareAndBalanceStrings.collectStringProperty );

  // The total amount of snacks on the table are shared evenly between the plates in the notepad.
  public static readonly SHARE = new NotepadMode( MeanShareAndBalanceStrings.shareStringProperty );

  // Gets a list of keys, values and mapping between them.  For use in EnumerationProperty and PhET-iO
  public static readonly enumeration = new Enumeration( NotepadMode, {
    phetioDocumentation: 'Describes the way in which the information in the notepad is displayed.'
  } );

  public constructor( public readonly stringProperty: LocalizedStringProperty ) {
    super();
  }
}

export default class FairShareModel extends SharingModel<Apple> {

  // An enumeration property that controls the way in which the quantity of snacks on the table are displayed on the
  // notepad.  See the enumeration for more information on the possible modes.
  public readonly notepadModeProperty: EnumerationProperty<NotepadMode>;

  public constructor( providedOptions: FairShareModelOptions ) {
    const options = optionize<FairShareModelOptions, SelfOptions, SharingModelOptions>()( {}, providedOptions );
    super( options );

    this.notepadModeProperty = new EnumerationProperty( NotepadMode.SYNC, {
      tandem: providedOptions.tandem.createTandem( 'notepadModeProperty' ),
      phetioFeatured: true
    } );

    /////////////////////////////////////////////
    const applesParentTandem = options.tandem.createTandem( 'notepadApples' );
    let totalApplesCount = 1; // start at 1 for more user friendly phet-io IDs

    this.plates.forEach( plate => {

      // Create and initialize all the apples.
      _.times( MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE, appleIndex => {
        const isActive = plate.isActiveProperty.value && appleIndex < plate.snackNumberProperty.value;

        const apple = new Apple( {
          isActive: isActive,
          plate: plate,
          position: SnackStacker.getStackedApplePosition( plate, appleIndex ),

          // phet-io
          tandem: applesParentTandem.createTandem( `notepadApple${totalApplesCount++}` )
        } );

        this.snacks.push( apple );
      } );

      // Update the apple active states as the active state of the plates change.
      plate.isActiveProperty.lazyLink( isActive => {

        // TODO: Currently prototyped, implement full handling for this case, see https://github.com/phetsims/mean-share-and-balance/issues/149
        const apples = this.getSnacksAssignedToPlate( plate );
        if ( isActive ) {

          // Sort the list by position on the plate.
          const applesInStackedOrder = apples.sort( ( a, b ) => b.positionProperty.value.x - a.positionProperty.value.x );

          // Set the appropriate number of apples on this plate to active.
          applesInStackedOrder.forEach( ( apple, index ) => {
            apple.isActiveProperty.value = plate.snackNumberProperty.value > index;
          } );
        }
        else {

          // Deactivate all apples on this plate.
          apples.forEach( apple => { apple.isActiveProperty.value = false; } );
        }
      } );

      // Activate or deactivate apples on the plate to match the snack number.
      plate.snackNumberProperty.lazyLink( numberOfApples => {
        if ( plate.isActiveProperty.value ) {
          const apples = this.getSnacksAssignedToPlate( plate );
          const applesInStackedOrder = apples.sort( ( a, b ) => {
            if ( a.positionProperty.value.x === b.positionProperty.value.x ) {
              return a.positionProperty.value.x - b.positionProperty.value.x;
            }
            else {
              return b.positionProperty.value.y - a.positionProperty.value.y;
            }
          } );
          applesInStackedOrder.forEach( ( apple, index ) => {
            apple.isActiveProperty.value = numberOfApples > index;
          } );
        }
      } );
    } );
  }

  public override reset(): void {
    this.notepadModeProperty.reset();
    super.reset();
  }

  public static readonly NOTEPAD_PLATE_CENTER_Y = 300;
}

meanShareAndBalance.register( 'FairShareModel', FairShareModel );