// Copyright 2022-2024, University of Colorado Boulder

/**
 * The model element that represents the container for candy bars or cookies.
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
import CandyBar from '../../leveling-out/model/CandyBar.js';
import SnackStacker from '../SnackStacker.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type SelfOptions = {
  isInitiallyActive?: boolean;
  initialXPosition?: number;
  linePlacement: number;
  startingNumberOfSnacks?: number;
};

type PlateOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Plate extends PhetioObject {

  // Whether the cup is enabled in view and data calculations
  public readonly isActiveProperty: Property<boolean>;

  // The X position of the center of this plate relative to the center of the table.
  public readonly xPositionProperty: TProperty<number>;

  // The number of snacks (candy bars or apples) on this plate.
  public readonly tableSnackNumberProperty: Property<number>;

  // The list of snacks that are on this plate in the notepad.  Depending on what the user has done, this may or may not
  // be in sync with the number on the table.
  private readonly snacksOnPlateInNotepad: ObservableArray<Snack>;

  // The plate's index, 0-indexed.  This is primarily used for debugging.
  public readonly linePlacement: number;

  // The number of snacks this plate should have on it when it becomes active.
  private readonly startingNumberOfSnacks: number;

  // Functions needed for obtaining and releasing snacks.
  private readonly getAvailableSnack: () => Snack | null;
  private readonly releaseSnack: ( snack: Snack ) => void;

  /**
   * @param getAvailableSnack - a function that can be used to get an available snack from the parent model
   * @param releaseSnack - a function for releasing a snack that is no longer needed by this plate to the parent model
   * @param providedOptions
   */
  public constructor( getAvailableSnack: () => Snack | null,
                      releaseSnack: ( snack: Snack ) => void,
                      providedOptions: PlateOptions ) {

    const options = optionize<PlateOptions, SelfOptions, PhetioObjectOptions>()( {
      isInitiallyActive: false,
      initialXPosition: 0,
      phetioState: false,
      startingNumberOfSnacks: 1
    }, providedOptions );

    super( options );

    this.getAvailableSnack = getAvailableSnack;
    this.releaseSnack = releaseSnack;
    this.startingNumberOfSnacks = options.startingNumberOfSnacks;

    this.isActiveProperty = new BooleanProperty( options.isInitiallyActive, {

      // phet-io
      tandem: options.tandem.createTandem( 'isActiveProperty' ),

      // Takes its value from LevelingOutModel.numberOfPeopleProperty, so cannot be independently adjusted.
      phetioReadOnly: true
    } );

    this.xPositionProperty = new NumberProperty( options.initialXPosition );

    this.tableSnackNumberProperty = new NumberProperty( options.startingNumberOfSnacks, {
      range: new Range( 0, 10 ),

      // phet-io
      tandem: options.tandem.createTandem( 'tableSnackNumberProperty' )
    } );

    this.snacksOnPlateInNotepad = createObservableArray( {
      phetioType: ObservableArrayIO( ReferenceIO( IOType.ObjectIO ) ),
      tandem: options.tandem.createTandem( 'snacksOnPlateInNotepad' )
    } );

    // When snacks are added, make sure they are in the right state and the right place.
    this.snacksOnPlateInNotepad.addItemAddedListener( snack => {
      snack.isActiveProperty.value = true;

      // Add a listener that updates the stack when a resident candy bar starts being dragged.  This is done because,
      // by design, snacks stay on a plate when dragging.  See #193 for more information on this.
      const updateStackWhenDragging = ( isDragging: boolean ) => {
        if ( isDragging ) {
          this.updateSnackPositions();
        }
      };
      snack.isDraggingProperty.lazyLink( updateStackWhenDragging );
      const snackRemovedListener = ( removedSnack: Snack ) => {
        if ( removedSnack === snack ) {
          snack.isDraggingProperty.unlink( updateStackWhenDragging );
          this.snacksOnPlateInNotepad.removeItemRemovedListener( snackRemovedListener );
        }
      };
      this.snacksOnPlateInNotepad.addItemRemovedListener( snackRemovedListener );
    } );

    this.linePlacement = options.linePlacement;

    // Monitor the X position and update the positions of any snacks that are on this plate when changes occur.
    this.xPositionProperty.link( this.updateSnackPositions.bind( this ) );

    this.syncNotepadToTable();

    // Monitor the active state and add or release snacks as changes occur.
    this.isActiveProperty.link( isActive => {
      if ( isActive ) {
        this.tableSnackNumberProperty.value = this.startingNumberOfSnacks;
      }
      else {
        this.tableSnackNumberProperty.value = 0;
      }
    } );
  }

  /**
   * Get the position where the provided snack would go on the stack if added to this plate.
   */
  public getStackingPositionForSnack( snack: Snack ): Vector2 {

    // Count the number of items on this plate excluding snacks that are dragging and the provided snack, since it is
    // possible that it is already assigned to this plate.
    const numberOfStackedSnacks = this.snacksOnPlateInNotepad.filter(
      snackOnList => !snackOnList.isDraggingProperty.value && snackOnList !== snack
    ).length;

    return this.getPositionForStackedItem( numberOfStackedSnacks );
  }

  /**
   * Get the position for the snack at the provided index position in the stack.
   */
  private getPositionForStackedItem( stackIndex: number ): Vector2 {

    // TODO: This is awkward and won't work in all cases, so come back to it.  See https://github.com/phetsims/mean-share-and-balance/issues/185.
    const snackStackMethod = this.snacksOnPlateInNotepad.length === 0 || this.snacksOnPlateInNotepad[ 0 ] instanceof CandyBar ?
                             SnackStacker.getStackedCandyBarPosition :
                             SnackStacker.getStackedApplePosition;

    // Get the position.
    return snackStackMethod( this, stackIndex );
  }

  /**
   * Update the positions of the snacks stacked atop this plate.
   */
  private updateSnackPositions(): void {

    // By design, a snack that is dragging remains on the plate but is excluded from the stacking order.  This works
    // better for conveying state via phet-io, where dragging state information isn't included.  So, and ordered list
    // of the snacks is needed here, excluding any that are dragging.  For more information on this, see
    // https://github.com/phetsims/mean-share-and-balance/issues/193.
    const stackableSnacks = this.snacksOnPlateInNotepad.filter( snack => !snack.isDraggingProperty.value );

    // Update the positions of the snacks.
    stackableSnacks.forEach( ( snack, i ) => {
      snack.positionProperty.value = this.getPositionForStackedItem( i );
    } );
  }

  /**
   * Return true if the provided snack is on this plate in the notepad.
   * @param snack
   */
  public hasSnack( snack: Snack ): boolean {
    return this.snacksOnPlateInNotepad.includes( snack );
  }

  /**
   * Synchronize the number of snacks on the notepad to the number on the table.
   */
  public syncNotepadToTable(): void {
    if ( this.tableSnackNumberProperty.value > this.snacksOnPlateInNotepad.length ) {

      // Add snacks to the notepad list.
      while ( this.tableSnackNumberProperty.value > this.snacksOnPlateInNotepad.length ) {

        const snackToAdd = this.getAvailableSnack();
        assert && assert( snackToAdd, 'no snacks are available to add' );
        this.snacksOnPlateInNotepad.push( snackToAdd! );
      }
    }
    else if ( this.tableSnackNumberProperty.value < this.snacksOnPlateInNotepad.length ) {

      // Remove snacks from the notepad snack list.
      while ( this.snacksOnPlateInNotepad.length > this.tableSnackNumberProperty.value ) {
        const snackToRelease = this.snacksOnPlateInNotepad.pop();
        if ( snackToRelease ) {
          snackToRelease.isActiveProperty.value = false;
          snackToRelease.positionProperty.value = MeanShareAndBalanceConstants.UNUSED_SNACK_POSITION;
          this.releaseSnack( snackToRelease );
        }
      }
    }
    this.updateSnackPositions();
  }

  /**
   * Get a snack from the set of those available and add it to the top of this plate's stack.  This can be thought of
   * as incrementing the number of snacks on the notepad plate by one.
   */
  public addASnack(): void {
    const snackToAdd = this.getAvailableSnack();
    assert && assert( snackToAdd, 'no snacks available to add, this shouldn\'t happen' );
    snackToAdd!.moveTo( this.getStackingPositionForSnack( snackToAdd! ) );
    this.snacksOnPlateInNotepad.push( snackToAdd! );
  }

  /**
   * Add a particular snack instance to the top of this plate's stack.
   */
  public addSnackToTop( snack: Snack, animate = false ): void {
    assert && assert( this.snacksOnPlateInNotepad.length < MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE );
    snack.moveTo( this.getStackingPositionForSnack( snack ), animate );
    this.snacksOnPlateInNotepad.push( snack );
  }

  /**
   * Get the snack that is currently on the top of the stack.  This does NOT remove the snack.
   */
  public getTopSnack(): Snack | null {
    let highestSnackSoFar: Snack | null = null;
    this.snacksOnPlateInNotepad.forEach( snack => {

      // Note that Y is in the graphic coordinate frame in this model, so lower values are higher on the screen.
      if ( highestSnackSoFar === null || snack.positionProperty.value.y < highestSnackSoFar.positionProperty.value.y ) {
        highestSnackSoFar = snack;
      }
    } );
    return highestSnackSoFar;
  }

  /**
   * Remove the snack at top of this plate's stack and add it back to the list of available ones.  This can be thought
   * of as decrementing the number of snacks on the notepad plate by one.
   */
  public removeTopSnack(): Snack | null {
    let removedSnack = null;
    if ( this.snacksOnPlateInNotepad.length > 0 ) {
      const topSnack = this.getTopSnack();
      removedSnack = this.snacksOnPlateInNotepad.pop();
      if ( removedSnack ) {
        assert && assert( removedSnack === topSnack, 'the removed snack should be the top snack, if not, something is wrong' );
        removedSnack.isActiveProperty.value = false;
        removedSnack.positionProperty.value = MeanShareAndBalanceConstants.UNUSED_SNACK_POSITION;
        this.releaseSnack( removedSnack );
      }
      else {
        removedSnack = null;
      }
    }
    return removedSnack;
  }

  /**
   * Remove the specified snack from those that are stacked on this plate.
   */
  public removeSnack( snack: Snack ): void {
    assert && assert( this.hasSnack( snack ), 'the snack being removed is not on this plate' );
    this.snacksOnPlateInNotepad.remove( snack );
  }

  /**
   * Get an array containing the snacks that are on currently stacked on this plate, indexed by stacking order.
   */
  public getSnackStack(): Snack[] {
    return this.snacksOnPlateInNotepad.getArrayCopy();
  }

  /**
   * Get the number of snacks currently on this plate.
   */
  public getNumberOfHeldSnacks(): number {
    return this.snacksOnPlateInNotepad.length;
  }

  /**
   * Release all snacks that are currently on this plate.
   */
  public releaseAllSnacks(): Snack[] {
    const snacksToRelease = this.snacksOnPlateInNotepad.getArrayCopy();
    snacksToRelease.forEach( snack => {

      // Remove this snack from the plate's list.
      this.snacksOnPlateInNotepad.remove( snack );

      // Release this snack to the model so that it can be used elsewhere.
      this.releaseSnack( snack );
    } );
    return snacksToRelease;
  }

  /**
   * Restore initial state.
   */
  public reset(): void {
    this.tableSnackNumberProperty.reset();
    this.syncNotepadToTable();
  }

  // Width of the plate (aka diameter) in screen coordinates.
  public static readonly WIDTH = 45;
}

meanShareAndBalance.register( 'Plate', Plate );