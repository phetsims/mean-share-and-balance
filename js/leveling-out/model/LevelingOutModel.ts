// Copyright 2022, University of Colorado Boulder

/**
 * Base class for LevelingOut view
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import MeanShareAndBalanceModel from '../../common/model/MeanShareAndBalanceModel.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import WaterCup2DModel from './WaterCup2DModel.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = {
  //TODO add options that are specific to MeanShareAndBalanceModel here
};

type LevelingOutModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class LevelingOutModel extends MeanShareAndBalanceModel {
  readonly predictMeanProperty: BooleanProperty;
  readonly showMeanProperty: BooleanProperty;
  readonly tickMarksProperty: BooleanProperty;
  readonly numberOfCupsProperty: NumberProperty;
  readonly levelingOutRange: Range;
  waterCups: Array<WaterCup2DModel>;

  constructor( providedOptions: LevelingOutModelOptions ) {
    super( providedOptions );

    this.predictMeanProperty = new BooleanProperty( false );
    this.showMeanProperty = new BooleanProperty( false );
    this.tickMarksProperty = new BooleanProperty( false );
    this.numberOfCupsProperty = new NumberProperty( 1 );
    this.levelingOutRange = new Range( 1, 7 );
    this.waterCups = [ new WaterCup2DModel() ];

  this.numberOfCupsProperty.link( value => {
    if ( value > this.waterCups.length ) {
      this.waterCups.push( new WaterCup2DModel() );
    }
    else if ( value < this.waterCups.length ) {
      this.waterCups.pop();
    }

    // console.log( this.waterCups );
  } );
  }

  public override reset(): void {
    super.reset();
    this.predictMeanProperty.reset();
    this.showMeanProperty.reset();
    this.tickMarksProperty.reset();
    this.numberOfCupsProperty.reset();
    this.waterCups = this.waterCups.slice( 0, 1 );
  }

  public handleIncrement( value: number ): void {

  }


}

meanShareAndBalance.register( 'LevelingOutModel', LevelingOutModel );
export default LevelingOutModel;