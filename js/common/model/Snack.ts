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
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import optionize from '../../../../phet-core/js/optionize.js';

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

  public readonly parentPlateProperty: Property<Plate | null>;

  // This Property controls the snack's visibility and participation in data calculations in the sim.
  // Subclass handles reset.
  public readonly isActiveProperty: Property<boolean>;

  // For the Leveling Out screen the positionProperty is set by the parentPlateProperty and the drag handler.
  // Subclass handles reset.
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
      phetioReadOnly: true
    } );

    this.parentPlateProperty = new Property<Plate | null>( providedOptions.plate, {

      // phet-io
      tandem: providedOptions.tandem.createTandem( 'parentPlateProperty' ),
      phetioReadOnly: true,
      phetioValueType: NullableIO( ReferenceIO( IOType.ObjectIO ) )
    } );

    this.positionProperty = new Property( providedOptions.position, {

      // phet-io
      tandem: providedOptions.tandem.createTandem( 'positionProperty' ),
      phetioReadOnly: true,
      phetioValueType: Vector2.Vector2IO
    } );
  }

  /**
   * Travel to the specified destination in a continuous manner instead of instantaneously.  This is used to animate the
   * motion of a snack from one place to another.  It is okay to call this when an animation is in progress - it
   * will cause a new animation from the current location to the new destination.
   */
  public moveTo( destination: Vector2, animate = false ): void {

    // If there is already an animation in progress, take steps to redirect it to the (presumably) new destination.
    if ( this.travelAnimation ) {

      const currentPosition = this.positionProperty.value.copy();

      // Stop the existing animation.
      this.travelAnimation.stop();

      // Stopping the animation will cause the candy bar to be immediately moved to the originally specified
      // destination, but we don't want that in this case, so restore the position when this was called.
      this.positionProperty.set( currentPosition );

      this.travelAnimation = null;
    }

    if ( animate ) {

      // Calculate the animation time based on the distance and speed.
      const animationTime = this.positionProperty.value.distance( destination ) / TRAVEL_SPEED;

      // Create the animation.
      this.travelAnimation = new Animation( {
        property: this.positionProperty,
        to: destination,
        duration: animationTime,
        easing: Easing.CUBIC_OUT
      } );

      // handlers for when the animation completes or is stopped
      this.travelAnimation.finishEmitter.addListener( () => {
        this.positionProperty.set( destination );
        this.finishAnimation();
      } );
      this.travelAnimation.stopEmitter.addListener( () => {
        this.positionProperty.set( destination );
        this.finishAnimation();
      } );

      // Kick off the animation.
      this.travelAnimation.start();
    }
    else {

      // Go immediately to the destination.
      this.positionProperty.value = destination;
    }
  }

  protected finishAnimation(): void {
    this.travelAnimation = null;
  }

  /**
   * If there is an in-progress animation, force it to finish immediately.  If there is no in-progress animation, this
   * does nothing.  This is primarily intended to be used in conditions like a reset or a change in conditions where
   * having a moving snack could be problematic.
   */
  public forceAnimationToFinish(): void {
    if ( this.travelAnimation ) {
      this.travelAnimation.stop();
    }
  }

  public reset(): void {
    this.forceAnimationToFinish();
    this.isActiveProperty.reset();
    this.positionProperty.reset();
    this.parentPlateProperty.reset();
  }
}

meanShareAndBalance.register( 'Snack', Snack );