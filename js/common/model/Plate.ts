// Copyright 2022-2024, University of Colorado Boulder

/**
 * The model element that represents the container for candy bars or apples.  This keeps track of the number of snacks
 * on the table plates as well as the specific snacks that are on the notepad plates.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Snack from './Snack.js';
import createObservableArray, { ObservableArray, ObservableArrayIO } from '../../../../axon/js/createObservableArray.js';
import SnackStacker from '../SnackStacker.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions<T extends Snack> = {
  initiallyActive?: boolean;
  initialXPosition?: number;
  linePlacement: number;
  startingNumberOfSnacks?: number;

  // The function used to position the snacks on the snack stack.
  snackStackingFunction?: ( plateXPosition: number, index: number ) => Vector2;

  // Plates that have a snack type that supports a fraction value need to know how to handle it.
  handleFraction?: ( plate: Plate<T>, fraction: Fraction ) => void;
};

type PlateOptions<T extends Snack> = SelfOptions<T> & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Plate<T extends Snack> extends PhetioObject {

  // Whether the plate is enabled in the view and the data calculations.
  public readonly isActiveProperty: Property<boolean>;

  // The X position of the center of this plate relative to the center of the table.
  public readonly xPositionProperty: TProperty<number>;

  // The number of snacks (candy bars or apples) on the table representation of this plate.
  public readonly tableSnackNumberProperty: Property<number>;

  // The list of snacks that are on this plate in the notepad.  Depending on what the user has done, this may or may not
  // be in sync with the number on the table.  DO NOT MODIFY THE CONTENTS OF THIS ARRAY OUTSIDE OF THIS CLASS.  It's
  // only public so that clients can get to the length and lengthProperty.
  public readonly snacksOnNotepadPlate: ObservableArray<T>;

  // Whether the number of snacks on the table and in the notepad are in sync.
  public readonly snacksInSyncProperty: TReadOnlyProperty<boolean>;

  // The plate's index, 0-indexed.  This is primarily used for debugging.
  public readonly linePlacement: number;

  // The number of snacks this plate should have on it when it becomes active.
  public readonly startingNumberOfSnacks: number;

  // The function used to set the positions of the snacks on this plate to form what looks like a stack.
  private readonly snackStackingFunction: ( plateXPosition: number, index: number ) => Vector2;

  // Functions needed for obtaining and releasing snacks.
  private readonly getAvailableSnack: () => T | null;
  private readonly releaseSnack: ( snack: T ) => void;
  private readonly handleFraction: ( plate: Plate<T>, fraction: Fraction ) => void;

  /**
   * @param getAvailableSnack - a function that can be used to get an available snack from the parent model
   * @param releaseSnack - a function for releasing a snack that is no longer needed by this plate to the parent model
   * @param providedOptions
   */
  public constructor( getAvailableSnack: () => T | null,
                      releaseSnack: ( snack: T ) => void,
                      providedOptions: PlateOptions<T> ) {

    const options = optionize<PlateOptions<T>, SelfOptions<T>, PhetioObjectOptions>()( {
      initiallyActive: false,
      initialXPosition: 0,
      phetioState: false,
      startingNumberOfSnacks: 1,
      snackStackingFunction: SnackStacker.getStackedCandyBarPosition,
      handleFraction: _.noop, // By default plates _.noop snack fraction values.
      isDisposable: false
    }, providedOptions );

    super( options );

    this.getAvailableSnack = getAvailableSnack;
    this.releaseSnack = releaseSnack;
    this.startingNumberOfSnacks = options.startingNumberOfSnacks;
    this.snackStackingFunction = options.snackStackingFunction;

    this.isActiveProperty = new BooleanProperty( options.initiallyActive, {

      // phet-io
      // Takes its value from DistributeModel.numberOfPeopleProperty, so cannot be independently adjusted.
      phetioReadOnly: true,
      tandem: options.tandem.createTandem( 'isActiveProperty' )
    } );

    this.xPositionProperty = new NumberProperty( options.initialXPosition );

    // So that reset of isActiveProperty and reset of tableSnackNumberProperty are in agreement, make sure their initial
    // states are compatible.
    const initialTableSnackNumber = options.initiallyActive ? options.startingNumberOfSnacks : 0;
    this.tableSnackNumberProperty = new NumberProperty( initialTableSnackNumber, {
      range: new Range( 0, 10 ),
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'tableSnackNumberProperty' )
    } );

    // Create the observable array that tracks the snacks a notepad plate has.
    this.snacksOnNotepadPlate = createObservableArray( {
      phetioType: ObservableArrayIO( ReferenceIO( IOType.ObjectIO ) ),
      tandem: options.tandem.createTandem( 'snacksOnNotepadPlate' )
    } );

    // When snacks are added, make sure they are in the right state and the right place.
    this.snacksOnNotepadPlate.addItemAddedListener( snack => {

      // Add a listener that updates the stack when a resident snack starts being dragged.  This is done because, by
      // design, snacks stay in a plate's array when dragging.  See #193 for more information on this.
      const updateStackWhenDragging = ( dragging: boolean ) => {
        if ( dragging ) {
          this.updateSnackPositions();
        }
      };
      snack.draggingProperty.lazyLink( updateStackWhenDragging );
      const snackRemovedListener = ( removedSnack: T ) => {
        if ( removedSnack === snack ) {
          snack.draggingProperty.unlink( updateStackWhenDragging );
          this.snacksOnNotepadPlate.removeItemRemovedListener( snackRemovedListener );
        }
      };
      this.snacksOnNotepadPlate.addItemRemovedListener( snackRemovedListener );
    } );

    this.snacksInSyncProperty = new DerivedProperty(
      [ this.tableSnackNumberProperty, this.snacksOnNotepadPlate.lengthProperty ],
      ( tableSnackNumber, notepadSnackNumber ) => tableSnackNumber === notepadSnackNumber );

    this.linePlacement = options.linePlacement;

    // Monitor the X position and update the positions of any snacks that are on this plate when changes occur.
    this.xPositionProperty.link( this.updateSnackPositions.bind( this ) );
    this.handleFraction = options.handleFraction;

    // At start up we make sure that our notepad plate is in sync with our table plate.
    this.syncNotepadToTable();
    this.snacksOnNotepadPlate.forEach( snack => {
      snack.isActiveProperty.value = true;
      snack.positionProperty.value = options.snackStackingFunction( this.xPositionProperty.value, 0 );
    } );
  }

  /**
   * Get the position where the provided snack would go on the stack if added to this plate.
   */
  public getStackingPositionForSnack( snack: T ): Vector2 {

    // Count the number of items on this plate excluding snacks that are dragging and the provided snack, since it is
    // possible that it is already assigned to this plate.
    const numberOfStackedSnacks = this.snacksOnNotepadPlate.filter(
      snackOnList => !snackOnList.draggingProperty.value && snackOnList !== snack
    ).length;
    return this.getPositionForStackedItem( numberOfStackedSnacks );
  }

  /**
   * Get the position for the snack at the provided index position in the stack.
   */
  public getPositionForStackedItem( stackIndex: number ): Vector2 {
    return this.snackStackingFunction( this.xPositionProperty.value, stackIndex );
  }

  /**
   * Update the positions of the snacks stacked atop this plate.
   */
  public updateSnackPositions(): void {

    // By design, a snack that is dragging remains on the plate but is excluded from the stacking order.  This works
    // better for conveying state via phet-io, where dragging state information isn't included.  An ordered list of the
    // snacks is needed here, excluding any that are dragging.  For more information on this, see
    // https://github.com/phetsims/mean-share-and-balance/issues/193.
    const stackableSnacks = this.snacksOnNotepadPlate.filter( snack => !snack.draggingProperty.value );

    // Update the positions of the snacks.
    stackableSnacks.forEach( ( snack, i ) => {
      const position = this.getPositionForStackedItem( i );
      snack.moveTo( position );
    } );
  }

  /**
   * Return true if the provided snack is on this plate in the notepad.
   * @param snack
   */
  public hasSnack( snack: T ): boolean {
    return this.snacksOnNotepadPlate.includes( snack );
  }

  /**
   * Set the number of snacks on this plate to the provided value.
   * @param targetValue - The number of snacks to have on the notepad plate. This can be a whole, fractional, or mixed
   *                      number, e.g. 2, 3/2, or 15/7.
   */
  public setNotepadSnacksToValue( targetValue: Fraction ): void {

    const numberOfWholeSnacks = Math.floor( targetValue.numerator / targetValue.denominator );
    const snackFractionValue = new Fraction( targetValue.numerator % targetValue.denominator, targetValue.denominator );
    const numberOfSnacksOnPlate = numberOfWholeSnacks + ( snackFractionValue.value > 0 ? 1 : 0 );

    // Determine the fractional value of the top snack.
    let topSnackFractionValue;
    if ( targetValue.value > 0 ) {
      topSnackFractionValue = snackFractionValue.value > 0 ? snackFractionValue : Fraction.ONE;
    }
    else {
      topSnackFractionValue = Fraction.ZERO;
    }

    // Add or remove snacks as needed to match the target.
    if ( numberOfSnacksOnPlate > this.snacksOnNotepadPlate.length ) {

      // Add snacks to the notepad list.
      while ( numberOfSnacksOnPlate > this.snacksOnNotepadPlate.length ) {

        const snackToAdd = this.getAvailableSnack();
        assert && assert( snackToAdd, 'no snacks are available to add' );
        this.snacksOnNotepadPlate.push( snackToAdd! );
      }
    }
    else if ( numberOfSnacksOnPlate < this.snacksOnNotepadPlate.length ) {

      // Remove snacks from the notepad snack list.
      while ( this.snacksOnNotepadPlate.length > numberOfSnacksOnPlate ) {
        const snackToRelease = this.snacksOnNotepadPlate.pop();
        if ( snackToRelease ) {
          this.releaseSnack( snackToRelease );
        }
      }
    }

    // If there is at least one snack on this plate, set the top one to the appropriate fractional value, which may be 1.
    targetValue.value > 0 && this.handleFraction( this, topSnackFractionValue );

    this.updateSnackPositions();
  }

  /**
   * Synchronize the number of snacks on the notepad to the number on the table.
   */
  public syncNotepadToTable(): void {
    this.setNotepadSnacksToValue( new Fraction( this.tableSnackNumberProperty.value, 1 ) );
  }

  /**
   * Get a snack from the set of those available and add it to the top of this plate's stack.  This can be thought of
   * as incrementing the number of snacks on the notepad plate by one.
   */
  public addASnack(): void {
    const snackToAdd = this.getAvailableSnack();
    assert && assert( snackToAdd, 'no snacks available to add, this shouldn\'t happen' );
    this.snacksOnNotepadPlate.push( snackToAdd! );
  }

  /**
   * Add a particular snack instance to the top of this plate's stack.
   */
  public addSnackToTop( snack: T ): void {
    assert && assert( this.snacksOnNotepadPlate.length < MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE );
    this.snacksOnNotepadPlate.push( snack );
  }

  /**
   * Get the snack that is currently on the top of the stack.  This does NOT remove the snack from the plate.  It also
   * excludes dragging snacks.
   */
  public getTopSnack(): T | null {

    // Exclude any snacks that are currently being dragged or are animating.
    const snacksFullyOnPlate = this.snacksOnNotepadPlate.filter(
      snack => !snack.draggingProperty.value && !snack.travelAnimationProperty.value
    );

    return snacksFullyOnPlate[ snacksFullyOnPlate.length - 1 ] || null;
  }

  /**
   * Get the top snack item and remove it from this plate, but DON'T release it back to the list of unused ones or move
   * it.  It becomes the responsibility of the caller to make sure it doesn't get lost.
   */
  public getTopSnackForTransfer(): T | null {
    let snack = null;

    if ( this.snacksOnNotepadPlate.length > 0 ) {

      // Force any in-progress animations to finish so that the stack order doesn't get messed up.
      this.snacksOnNotepadPlate.forEach( snack => snack.forceAnimationToFinish() );

      // Remove the snack at the top of the stack.
      snack = this.snacksOnNotepadPlate.pop() || null;

      // Even though it's the top item that is being removed, the stacking positions may still need to be updated since
      // animations and dragging could affect things.
      this.updateSnackPositions();
    }
    return snack;
  }

  /**
   * Remove the snack at top of this plate's stack and add it back to the list of available ones.  This can be thought
   * of as decrementing the number of snacks on the notepad plate by one.
   */
  public removeTopSnack(): T | null {
    let removedSnack = null;

    if ( this.snacksOnNotepadPlate.length > 0 ) {

      // Force any in-progress animations to finish so that the stack order doesn't get messed up.
      this.snacksOnNotepadPlate.forEach( snack => snack.forceAnimationToFinish() );

      // Remove the snack at the top of the stack.  Note that this could include ones that are being dragged (in
      // multitouch scenarios).  This is intentional - otherwise it gets too complicated.
      removedSnack = this.snacksOnNotepadPlate.pop();

      if ( removedSnack ) {
        this.releaseSnack( removedSnack );
      }
      else {
        removedSnack = null;
      }

      // Even though it's the top item that is being removed, the stacking positions may still need to be updated since
      // animations and dragging could affect things.
      this.updateSnackPositions();
    }
    return removedSnack;
  }

  /**
   * Remove all the snacks from this plate. Has no effect if there are none.
   */
  public removeAllSnacks(): void {
    while ( this.getNumberOfNotepadSnacks() > 0 ) {
      this.removeTopSnack();
    }
  }

  /**
   * Remove the specified snack from those that are stacked on this plate.
   */
  public removeSnack( snack: T ): void {
    assert && assert( this.hasSnack( snack ), 'the snack being removed is not on this plate' );
    this.snacksOnNotepadPlate.remove( snack );
    this.updateSnackPositions();
  }

  /**
   * Get an array containing the snacks that are on currently stacked on this plate, indexed by stacking order.
   */
  public getSnackStack(): T[] {
    return this.snacksOnNotepadPlate.getArrayCopy();
  }

  /**
   * Get the number of snacks currently on this plate.
   */
  public getNumberOfNotepadSnacks(): number {
    return this.snacksOnNotepadPlate.length;
  }

  /**
   * Restore initial state.
   */
  public reset(): void {
    this.tableSnackNumberProperty.reset();
    this.syncNotepadToTable();
  }
}

meanShareAndBalance.register( 'Plate', Plate );