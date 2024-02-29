// Copyright 2023, University of Colorado Boulder
/**
 * The fulcrum of the balance beam is a slider that can move along the x-axis in increments of a tenth.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */
import { HSlider, HSliderOptions } from '../../../../sun/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import TriangleNode from '../../../../scenery-phet/js/TriangleNode.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import { EmptySelfOptions, optionize } from '../../../../phet-core/js/imports.js';
import { Property } from '../../../../axon/js/imports.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import { Dimension2 } from '../../../../dot/js/imports.js';
import { BALANCE_BEAM_TRANSFORM } from './BalanceBeamNode.js';
import Utils from '../../../../dot/js/Utils.js';

type BalanceBeamFulcrumOptions = WithRequired<HSliderOptions, 'tandem'>;
export default class FulcrumSlider extends HSlider {

  public constructor( fulcrumValueProperty: Property<number>, providedOptions: BalanceBeamFulcrumOptions ) {

    const triangleHeight = BALANCE_BEAM_TRANSFORM.modelToViewDeltaY( -0.6 ); // the transform is inverted.
    const triangleWidth = BALANCE_BEAM_TRANSFORM.modelToViewDeltaX( 0.8 );
    const thumbNode = new TriangleNode( {
      triangleHeight: triangleHeight,
      triangleWidth: triangleWidth,
      fill: MeanShareAndBalanceColors.meanColorProperty,
      tandem: providedOptions.tandem.createTandem( 'thumbNode' )
    } );

    const options = optionize<BalanceBeamFulcrumOptions, EmptySelfOptions, HSliderOptions>()( {
      thumbNode: thumbNode,
      thumbYOffset: triangleHeight / 2,
      trackFillEnabled: null,
      trackFillDisabled: null,
      trackStroke: null,
      trackPickable: false,
      constrainValue: value => Utils.roundToInterval( value, 0.1 ),
      trackSize: new Dimension2( MeanShareAndBalanceConstants.CHART_VIEW_WIDTH, 0 )
    }, providedOptions );
    super( fulcrumValueProperty, MeanShareAndBalanceConstants.SOCCER_BALL_RANGE, options );
  }
}

meanShareAndBalance.register( 'FulcrumSlider', FulcrumSlider );