// Copyright 2022-2024, University of Colorado Boulder

/**
 * Individual candy bars in the notepad representation.
 * These candy bars are draggable therefore their position, and parentPlate are important.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Plate from './Plate.js';

type CandyBarOptions = {
  isActive: boolean;
  plate: Plate;
  position: Vector2;
} & PickRequired<PhetioObjectOptions, 'tandem'>;

type StateType = 'plate' | 'dragging' | 'animating';

// constants

const TRAVEL_SPEED = 300; // in screen coordinates per second, empirically determined to look decent

// Total number of candy bars allocated, for debugging.
let instanceCount = 0;

export default class CandyBar {

  public readonly isActiveProperty: Property<boolean>;
  public readonly parentPlateProperty: Property<Plate>;
  public readonly positionProperty: Property<Vector2>;
  public readonly stateProperty: Property<StateType>;

  // An animation for moving this candy bar from one location to another in a continuous fashion.
  private travelAnimation: Animation | null = null;

  // For debugging
  public readonly instanceID = instanceCount++;

  public constructor( providedOptions: CandyBarOptions ) {

    this.isActiveProperty = new BooleanProperty( providedOptions.isActive, {

      // phet-io
      tandem: providedOptions.tandem.createTandem( 'isActiveProperty' ),
      phetioReadOnly: true,
      phetioState: false
    } );

    this.parentPlateProperty = new Property( providedOptions.plate, {

      // phet-io
      tandem: providedOptions.tandem.createTandem( 'parentPlateProperty' ),
      phetioReadOnly: true,
      phetioValueType: ReferenceIO( IOType.ObjectIO )
    } );

    // REVIEW: These may need phetioState: true
    this.positionProperty = new Property( providedOptions.position );
    this.stateProperty = new Property<StateType>( 'plate' );
  }

  /**
   * Travel to the specified destination in a continuous manner instead of all at once.  This is used to animate the
   * motion of a candy bar from one place to another.  It is okay to call this when an animation is in progress - it
   * will cause a new animation from the current location to the new destination.
   */
  public travelTo( destination: Vector2 ): void {

    // If there is already an animation in progress, take steps to redirect it to the (presumably) new destination.
    if ( this.travelAnimation ) {

      const currentPosition = this.positionProperty.value.copy();

      // Stop the existing animation.
      this.travelAnimation.stop();

      // Stopping the animation will cause the candy bar to be immediately moved to the originally specified
      // destination, but we don't want that in this case, so restore the position when this was called.
      this.positionProperty.set( currentPosition );
    }

    this.stateProperty.set( 'animating' );

    // Calculate the animation time based on the distance and speed.
    const animationTime = this.positionProperty.value.distance( destination ) / TRAVEL_SPEED;

    // Create the animation.
    this.travelAnimation = new Animation( {
      property: this.positionProperty,
      to: destination,
      duration: animationTime,
      easing: Easing.CUBIC_OUT
    } );

    const finish = () => {
      this.travelAnimation = null;
      this.stateProperty.set( 'plate' );
    };

    // handlers for when the animation completes
    this.travelAnimation.endedEmitter.addListener( finish );
    this.travelAnimation.endedEmitter.addListener( () => {
      this.positionProperty.set( destination );
      finish();
    } );

    // Kick off the animation.
    this.travelAnimation.start();
  }

  /**
   * If there is an in-progress animation, force it to finish immediately.
   * Force any in-progress animation to immediately finish.  If there is no in-progress animation, this is ignored.
   * This is primarily intended to be used in conditions like a reset or a change in conditions where having a moving
   * candy bar could be problematic.
   */
  public forceAnimationToFinish(): void {
    if ( this.travelAnimation ) {
      this.travelAnimation.stop();
    }
  }

  public reset(): void {
    this.positionProperty.reset();
    this.stateProperty.reset();
    this.parentPlateProperty.reset();
    this.isActiveProperty.reset();
  }
}

meanShareAndBalance.register( 'CandyBar', CandyBar );