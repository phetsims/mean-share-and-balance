// Copyright 2022-2024, University of Colorado Boulder

/**
 * Individual candy bars in the notepad snackType.
 * These candy bars are draggable therefore their position and parentPlate are important.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Snack, { SnackOptions } from '../../common/model/Snack.js';

type SelfOptions = EmptySelfOptions;
type CandyBarOptions = SelfOptions & SnackOptions;

type StateType = 'plate' | 'dragging' | 'animating';

export default class CandyBar extends Snack {

  public readonly stateProperty: Property<StateType>;

  public constructor( providedOptions: CandyBarOptions ) {
    const options = optionize<CandyBarOptions, SelfOptions, SnackOptions>()( {}, providedOptions );
    super( options );

    this.stateProperty = new Property<StateType>( 'plate' );
  }

  /**
   * Override to add state-setting, see parent class for additional info.
   */
  public override moveTo( destination: Vector2, animate = false ): void {
    super.moveTo( destination, animate );
    this.travelAnimation !== null && this.stateProperty.set( 'animating' );
  }

  /**
   * Override to provide state setting, see parent class for additional information.
   */
  protected override finishAnimation(): void {
    super.finishAnimation();
    this.stateProperty.set( 'plate' );
  }

  public override forceAnimationToFinish(): void {
    this.stateProperty.set( 'plate' );
    super.forceAnimationToFinish();
  }

  public override reset(): void {
    super.reset();
    this.stateProperty.reset();
  }
}

meanShareAndBalance.register( 'CandyBar', CandyBar );