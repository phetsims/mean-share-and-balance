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
import { Bounds2, Dimension2, Vector2 } from '../../../../dot/js/imports.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import { Emitter } from '../../../../axon/js/imports.js';

type SelfOptions = EmptySelfOptions;
type FairShareModelOptions = SelfOptions & PickRequired<SharingModelOptions, 'tandem'>;

// constants
const COLLECTION_AREA_SIZE = new Dimension2( 350, 120 );

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

  // The area in coordinate space where the Apple instances will be placed and organized when in Collection mode.
  public readonly collectionArea: Bounds2;

  public readonly snacksAdjusted = new Emitter();

  public constructor( providedOptions: FairShareModelOptions ) {

    const options = optionize<FairShareModelOptions, SelfOptions, SharingModelOptions>()( {
      numberOfSnacksOnFirstPlate: 2
    }, providedOptions );
    super( options );

    this.notepadModeProperty = new EnumerationProperty( NotepadMode.SYNC, {
      tandem: providedOptions.tandem.createTandem( 'notepadModeProperty' ),
      phetioFeatured: true
    } );

    // Define the area where the apples will be collected when in Collection mode.
    this.collectionArea = new Bounds2(
      0,
      MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y - 100,
      100,
      MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y + 100
    );

    const applesParentTandem = options.tandem.createTandem( 'notepadApples' );
    let totalApplesCount = 1; // start at 1 for more user friendly phet-io IDs

    // Define a function that will update the state of all apples based on things like the selected display mode, the
    // number of active plates, and the number of apples on each plate.
    const updateApples = () => {

      // TODO: It seems a bit excessive to have to reset these all each time.  Should this be kept?  See https://github.com/phetsims/mean-share-and-balance/issues/149.
      this.snacks.forEach( snack => { snack.reset(); } );

      if ( this.notepadModeProperty.value === NotepadMode.SYNC ) {

        // In this mode the positions of the apples shown on the notepad match those shown on the plates on the table.

        this.plates.forEach( plate => {

          const apples = this.getSnacksAssignedToPlate( plate );
          if ( plate.isActiveProperty.value ) {

            // Sort the list by position on the plate.
            const applesInStackedOrder = apples.sort( ( a, b ) => {
              if ( a.positionProperty.value.x === b.positionProperty.value.x ) {
                return a.positionProperty.value.x - b.positionProperty.value.x;
              }
              else {
                return b.positionProperty.value.y - a.positionProperty.value.y;
              }
            } );

            // Set the appropriate number of apples on this plate to active.
            applesInStackedOrder.forEach( ( apple, index ) => {
              apple.fractionProperty.set( Fraction.ONE );
              apple.isActiveProperty.value = plate.snackNumberProperty.value > index;
            } );
          }
          else {

            // Deactivate all apples on this plate.
            apples.forEach( apple => { apple.isActiveProperty.value = false; } );
          }
        } );
      }
      else if ( this.notepadModeProperty.value === NotepadMode.SHARE ) {

        // In this mode the total number of apples is split up evenly over all active plates, so each one ends up with
        // the mean value.

        const numberOfWholeApplesPerActivePlate = Math.floor( this.meanProperty.value );
        const fractionalApplePerActivePlate = this.meanProperty.value - numberOfWholeApplesPerActivePlate;

        this.plates.forEach( plate => {

          const apples = this.getSnacksAssignedToPlate( plate );
          if ( plate.isActiveProperty.value ) {

            // Sort the list by position on the plate.
            // TODO: Make the sorted apples available and consolidate this repeated code, see https://github.com/phetsims/mean-share-and-balance/issues/149.
            const applesInStackedOrder = apples.sort( ( a, b ) => {
              if ( a.positionProperty.value.x === b.positionProperty.value.x ) {
                return a.positionProperty.value.x - b.positionProperty.value.x;
              }
              else {
                return b.positionProperty.value.y - a.positionProperty.value.y;
              }
            } );

            // Activate and set fractional values for this plate.
            applesInStackedOrder.forEach( ( apple, i ) => {
              if ( i < numberOfWholeApplesPerActivePlate ) {
                apple.isActiveProperty.set( true );
                apple.fractionProperty.set( Fraction.ONE );
              }
              else if ( i === numberOfWholeApplesPerActivePlate ) {
                if ( fractionalApplePerActivePlate > 0 ) {
                  apple.isActiveProperty.set( true );
                  apple.fractionProperty.set( Fraction.fromDecimal( fractionalApplePerActivePlate ) );
                }
                else {
                  apple.isActiveProperty.set( false );
                }
              }
              else {
                apple.isActiveProperty.set( false );
              }
            } );
          }
          else {

            // Deactivate all apples on this plate.
            apples.forEach( apple => { apple.isActiveProperty.value = false; } );
          }
        } );
      }
      else if ( this.notepadModeProperty.value === NotepadMode.COLLECT ) {

        // In this mode, the active apples are collected into stacks in the collection area.

        // Activate the number of apples on each plate to match the number of the corresponding table plate.
        this.plates.forEach( plate => {
          const apples = this.getSnacksAssignedToPlate( plate );
          const applesInStackedOrder = apples.sort( ( a, b ) => {
            if ( a.positionProperty.value.x === b.positionProperty.value.x ) {
              return a.positionProperty.value.x - b.positionProperty.value.x;
            }
            else {
              return b.positionProperty.value.y - a.positionProperty.value.y;
            }
          } );
          applesInStackedOrder.forEach( ( apple, i ) => {
            apple.isActiveProperty.value = plate.isActiveProperty.value &&
                                           ( i < plate.snackNumberProperty.value );
          } );
        } );

        // Move all active apples to stacks in the collection area.
        const activeApples = this.snacks.filter( apple => apple.isActiveProperty.value );
        activeApples.forEach( ( apple, i ) => {

          // TODO: This is a rough prototype for positioning, see https://github.com/phetsims/mean-share-and-balance/issues/149.
          //       It should be generalized to not use hard-coded values and could potentially be consolidated with the
          //       other snack stacking code.
          const group = Math.floor( i / 10 );
          const column = i % 2;
          const row = Math.floor( ( i % 10 ) / 2 );
          const x = group * 55 + column * 20;
          const y = MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y + 60 - row * 20;
          apple.positionProperty.set( new Vector2( x, y ) );
        } );
      }
      else {
        assert && assert( false, 'Unexpected mode' );
      }

      // Trigger an emitter that indicates some rearrangement has occurred.  This can be used by the view to finalize
      // any updates that are needed.
      this.snacksAdjusted.emit();
    };

    // Set up the initial states for the plates and the apples that go on them.
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

      // Update the apple states when the active state of the plates change.
      plate.isActiveProperty.lazyLink( updateApples );

      // Activate or deactivate apples on the plate to match the snack number.
      plate.snackNumberProperty.lazyLink( updateApples );
    } );

    // Update the states of the apples when the mode changes.
    this.notepadModeProperty.link( updateApples );
  }

  public override reset(): void {
    this.notepadModeProperty.reset();
    super.reset();
  }

  public static readonly NOTEPAD_PLATE_CENTER_Y = 300;
  public static readonly COLLECTION_AREA_SIZE = COLLECTION_AREA_SIZE;
}

meanShareAndBalance.register( 'FairShareModel', FairShareModel );