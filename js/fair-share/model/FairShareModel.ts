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
const APPLES_PER_COLLECTION_GROUP = 10;

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

    const handleModeChange = ( notepadMode: NotepadMode, previousNotepadMode: NotepadMode | null ): void => {

      if ( previousNotepadMode === NotepadMode.SHARE ) {

        // Any time we leave the SHARE mode we should make sure we don't have fractional apples anywhere.
        this.snacks.forEach( snack => { snack.fractionProperty.reset(); } );
      }

      if ( notepadMode === NotepadMode.SYNC && previousNotepadMode === NotepadMode.COLLECT ) {

        // Animate the movement of the whole apples from the collection area to the individual plates.
        this.plates.forEach( plate => {
          const sortedApples = sortApplesByStackingOrder( this.getSnacksAssignedToPlate( plate ) );
          let stackPosition = 0;
          sortedApples.forEach( apple => {
            if ( apple.isActiveProperty.value ) {
              apple.travelTo( SnackStacker.getStackedApplePosition( plate, stackPosition++ ) );
            }
          } );
        } );
      }
      else if ( notepadMode === NotepadMode.COLLECT && previousNotepadMode === NotepadMode.SYNC ) {

        // Animate the movement of the whole apples the individual plates to the collection area.
        let collectionIndex = 0;
        this.plates.forEach( plate => {
          const sortedApples = sortApplesByStackingOrder( this.getSnacksAssignedToPlate( plate ) );
          sortedApples.forEach( apple => {
            if ( apple.isActiveProperty.value ) {
              apple.travelTo( getCollectionPosition( collectionIndex++ ) );
            }
          } );
        } );
      }
      else if ( notepadMode === NotepadMode.SYNC ) {

        // In this mode the positions of the apples shown on the notepad match those shown on the plates on the table.

        this.plates.forEach( plate => {

          const apples = this.getSnacksAssignedToPlate( plate );
          if ( plate.isActiveProperty.value ) {

            // Sort the list by position on the plate.
            const applesInStackedOrder = sortApplesByStackingOrder( apples );

            // Set the appropriate number of apples on this plate to active.
            applesInStackedOrder.forEach( ( apple, index ) => {
              apple.fractionProperty.set( Fraction.ONE );
              apple.isActiveProperty.value = plate.snackNumberProperty.value > index;
            } );
          }
          else {

            // Deactivate all apples on this plate.
            apples.forEach( apple => {
              apple.isActiveProperty.value = false;
              apple.fractionProperty.value = Fraction.ONE;
            } );
          }
        } );
      }
      else if ( notepadMode === NotepadMode.SHARE ) {

        // TODO: Resetting all the snacks is temporary while details of animation and such are worked out, see https://github.com/phetsims/mean-share-and-balance/issues/149.
        this.snacks.forEach( snack => { snack.reset(); } );

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
      else if ( notepadMode === NotepadMode.COLLECT ) {

        // In this mode, the active apples are collected into stacks in the collection area.

        // Activate the number of apples on each plate to match the number of the corresponding table plate.
        this.plates.forEach( plate => {
          const applesInStackedOrder = sortApplesByStackingOrder( this.getSnacksAssignedToPlate( plate ) );
          applesInStackedOrder.forEach( ( apple, i ) => {
            const appleIsActive = plate.isActiveProperty.value && i < plate.snackNumberProperty.value;
            apple.isActiveProperty.value = appleIsActive;
            if ( appleIsActive ) {
              apple.fractionProperty.value = Fraction.ONE;
            }
          } );
        } );

        // Move all active apples to stacks in the collection area.
        const activeApples = this.snacks.filter( apple => apple.isActiveProperty.value );
        activeApples.forEach( ( apple, i ) => {
          apple.positionProperty.value = getCollectionPosition( i );
        } );
      }
      else {
        assert && assert( false, 'Unexpected mode' );
      }

      // Trigger an emitter that indicates some rearrangement has occurred.  This can be used by the view to finalize
      // any updates that are needed.
      // eslint-disable-next-line bad-sim-text
      setTimeout( () => { this.snacksAdjusted.emit(); }, 1 );
      // this.snacksAdjusted.emit();
    };

    const handleNumberOfActiveSnacksChanged = () => {
      const notepadMode = this.notepadModeProperty.value;
      if ( notepadMode === NotepadMode.SYNC || notepadMode === NotepadMode.SHARE ) {

        // Activate the appropriate number of apples on each plate.
        this.plates.forEach( plate => {
          const applesOnPlate = this.getSnacksAssignedToPlate( plate );
          if ( plate.isActiveProperty.value ) {
            const sortedApples = sortApplesByStackingOrder( applesOnPlate );
            const numberOfApplesOnThisPlate = notepadMode === NotepadMode.SHARE ?
                                              this.meanProperty.value :
                                              plate.snackNumberProperty.value;
            const wholePart = Math.floor( numberOfApplesOnThisPlate );
            const fractionalPart = numberOfApplesOnThisPlate - wholePart;
            sortedApples.forEach( ( apple, i ) => {
              if ( i < wholePart ) {
                apple.fractionProperty.value = Fraction.ONE;
                apple.isActiveProperty.value = true;
              }
              else if ( i === wholePart && fractionalPart !== 0 ) {
                apple.fractionProperty.value = Fraction.fromDecimal( fractionalPart );
                apple.isActiveProperty.value = true;
              }
              else {
                apple.isActiveProperty.value = false;
              }
            } );
          }
          else {

            // This plate is inactive, so deactivate all apples associated with it.
            applesOnPlate.forEach( apple => { apple.isActiveProperty.value = false; } );
          }
        } );
      }
      else {

        // The model is in Collection mode.  Activate the appropriate apples and move them to the necessary places
        // within the collection.
        let collectionItemIndex = 0;
        this.plates.forEach( plate => {
          const sortedApples = sortApplesByStackingOrder( this.getSnacksAssignedToPlate( plate ) );
          sortedApples.forEach( ( apple, i ) => {
            const appleIsActive = plate.isActiveProperty.value && i < plate.snackNumberProperty.value;
            apple.isActiveProperty.value = appleIsActive;
            if ( appleIsActive ) {

              // Move this to the appropriate place in the collection.
              const group = Math.floor( collectionItemIndex / APPLES_PER_COLLECTION_GROUP );
              const column = collectionItemIndex % 2;
              const row = Math.floor( ( collectionItemIndex % APPLES_PER_COLLECTION_GROUP ) / 2 );

              // Set the position.  The offsets in these calculations were empirically determined.
              const x = group * 55 + column * 20;
              const y = MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y + 60 - row * 20;
              apple.positionProperty.set( new Vector2( x, y ) );
              collectionItemIndex++;
            }
            else {

              // Inactive apples should be in their default positions.
              apple.positionProperty.reset();
            }
          } );
        } );
        this.snacksAdjusted.emit();
      }
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
    } );

    // Update the view when the presentation mode changes.
    this.notepadModeProperty.link( handleModeChange );

    // Update the view when the number of active apples changes.
    this.totalSnacksProperty.link( handleNumberOfActiveSnacksChanged );
  }

  public override reset(): void {
    this.notepadModeProperty.reset();
    super.reset();
  }

  public static readonly NOTEPAD_PLATE_CENTER_Y = 300;
  public static readonly COLLECTION_AREA_SIZE = COLLECTION_AREA_SIZE;
}

/**
 * Given a set of apples, sort them in the order in which they are stacked on the plate.  The 0th apple will be the
 * lower left, then the lower right, then the left one on next row up, and so forth.
 */
const sortApplesByStackingOrder = ( apples: Apple[] ) => {
  return apples.sort( ( a: Apple, b: Apple ) => {
    if ( a.positionProperty.value.x === b.positionProperty.value.x ) {
      return a.positionProperty.value.x - b.positionProperty.value.x;
    }
    else {
      return b.positionProperty.value.y - a.positionProperty.value.y;
    }
  } );
};

/**
 * Get a position for an apple in the "Collect" mode based on its index.
 */
const getCollectionPosition = ( positionIndex: number ) => {
  const group = Math.floor( positionIndex / APPLES_PER_COLLECTION_GROUP );
  const column = positionIndex % 2;
  const row = Math.floor( ( positionIndex % APPLES_PER_COLLECTION_GROUP ) / 2 );
  const x = group * 55 + column * 20;
  const y = MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y + 60 - row * 20;
  return new Vector2( x, y );
};

meanShareAndBalance.register( 'FairShareModel', FairShareModel );