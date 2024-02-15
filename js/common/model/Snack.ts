// Copyright 2022-2024, University of Colorado Boulder

/**
 * Base class for snacks, which, in this sim, are items that can be shared between people.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
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
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Plate from './Plate.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import { optionize } from '../../../../phet-core/js/imports.js';

type SelfOptions = {
  isActive: boolean;
  plate: Plate;
  position: Vector2;
};
export type SnackOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

// constants
const TRAVEL_SPEED = 300; // in screen coordinates per second, empirically determined to look decent

// Total number of snack allocated, for debugging.
let instanceCount = 0;

export default class Snack extends PhetioObject {

  public readonly isActiveProperty: Property<boolean>;
  public readonly parentPlateProperty: Property<Plate>;
  public readonly positionProperty: Property<Vector2>;

  // An animation for moving this snack from one location to another in a continuous fashion.
  protected travelAnimation: Animation | null = null;

  // for debugging
  public readonly instanceID = instanceCount++;

  public constructor( providedOptions: SnackOptions ) {

    const options = optionize<SnackOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioState: false
    }, providedOptions );

    super( options );

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
  }

  /**
   * Travel to the specified destination in a continuous manner instead of instantaneously.  This is used to animate the
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

    // Calculate the animation time based on the distance and speed.
    const animationTime = this.positionProperty.value.distance( destination ) / TRAVEL_SPEED;

    // Create the animation.
    this.travelAnimation = new Animation( {
      property: this.positionProperty,
      to: destination,
      duration: animationTime,
      easing: Easing.CUBIC_OUT
    } );

    // handlers for when the animation completes
    this.travelAnimation.finishEmitter.addListener( this.finishAnimation.bind( this ) );
    this.travelAnimation.stopEmitter.addListener( () => {
      this.positionProperty.set( destination );
      this.finishAnimation();
    } );

    // Kick off the animation.
    this.travelAnimation.start();
  }

  /**
   * Take any steps that are necessary when an animation finishes, whether because it made it to the end or was stopped.
   * This can be overridden to provide unique behavior in subclasses if needed.
   */
  protected finishAnimation(): void {
    this.travelAnimation = null;
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
    this.forceAnimationToFinish();
    this.positionProperty.reset();
    this.parentPlateProperty.reset();
    this.isActiveProperty.reset();
  }
}

meanShareAndBalance.register( 'Snack', Snack );