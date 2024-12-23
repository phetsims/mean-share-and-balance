// Copyright 2022-2024, University of Colorado Boulder

/**
 * Snack defines attributes of an item that can be shared between people.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = {
  initiallyActive?: boolean;
  initialPosition?: Vector2;
};
export type SnackOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

// constants
const TRAVEL_SPEED = 300; // In screen coordinates per second, empirically determined to look decent.

let instanceCount = 0; // Total number of snack allocated, for debugging.

export default class Snack extends PhetioObject {

  // This Property controls the snack's visibility and participation in data calculations in the sim.
  // The subclass handles reset.
  public readonly isActiveProperty: Property<boolean>;

  // For the Distribute screen the positionProperty is set by the parentPlateProperty and the drag handler.
  // The subclass handles reset.
  public readonly positionProperty: Property<Vector2>;

  // An animation for moving this snack from one location to another in a continuous fashion.
  public travelAnimationProperty: Property<Animation | null> = new Property<Animation | null>( null );

  public draggingProperty = new BooleanProperty( false );

  // for debugging
  public readonly instanceID = instanceCount++;

  public constructor( providedOptions: SnackOptions ) {

    const options = optionize<SnackOptions, SelfOptions, PhetioObjectOptions>()( {
      initiallyActive: false,
      initialPosition: Vector2.ZERO,
      isDisposable: false,
      phetioState: false
    }, providedOptions );

    super( options );

    this.isActiveProperty = new BooleanProperty( options.initiallyActive, {

      // phet-io
      tandem: providedOptions.tandem.createTandem( 'isActiveProperty' ),
      phetioReadOnly: true,
      phetioState: false
    } );

    this.positionProperty = new Property( options.initialPosition, {

      // phet-io
      tandem: providedOptions.tandem.createTandem( 'positionProperty' ),
      phetioReadOnly: true,
      phetioValueType: Vector2.Vector2IO,
      phetioState: false // We do not want to track the position of the snack while it is animating or dragging.
    } );
  }

  /**
   * Travel to the specified destination in a continuous manner instead of instantaneously.  This is used to animate the
   * motion of a snack from one place to another.  It is okay to call this when an animation is in progress - it
   * will cause a new animation from the current location to the new destination.
   */
  public moveTo( destination: Vector2, animate = false ): void {

    // If there is already an animation in progress, take steps to redirect it to the (presumably) new destination.
    if ( this.travelAnimationProperty.value ) {

      const currentPosition = this.positionProperty.value.copy();

      // Stop the existing animation.
      this.travelAnimationProperty.value.stop();

      // Stopping the animation will cause the candy bar to be immediately moved to the originally specified
      // destination, but we don't want that in this case, so restore the position when this was called.
      this.positionProperty.set( currentPosition );

      this.travelAnimationProperty.value = null;
    }

    if ( animate ) {

      // Calculate the animation time based on the distance and speed.
      const animationTime = this.positionProperty.value.distance( destination ) / TRAVEL_SPEED;

      // Create the animation.
      const travelAnimation = new Animation( {
        property: this.positionProperty,
        to: destination,
        duration: animationTime,
        easing: Easing.CUBIC_OUT
      } );

      // handlers for when the animation completes or is stopped
      travelAnimation.endedEmitter.addListener( () => {
        this.positionProperty.set( destination );
        this.finishAnimation();
      } );

      this.travelAnimationProperty.value = travelAnimation;

      // Kick off the animation.
      this.travelAnimationProperty.value.start();
    }
    else {

      // Go immediately to the destination.
      this.positionProperty.value = destination;
    }
  }

  protected finishAnimation(): void {
    this.travelAnimationProperty.value = null;
  }

  /**
   * If there is an in-progress animation, force it to finish immediately.  If there is no in-progress animation, this
   * does nothing. This is primarily intended to be used in conditions like a reset or a change in conditions where
   * having a moving snack could be problematic.
   */
  public forceAnimationToFinish(): void {
    if ( this.travelAnimationProperty.value ) {
      this.travelAnimationProperty.value.stop();
    }
  }
}

meanShareAndBalance.register( 'Snack', Snack );