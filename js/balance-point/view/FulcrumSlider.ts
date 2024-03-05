// Copyright 2024, University of Colorado Boulder
/**
 * The fulcrum of the balance beam is a slider that can move along the x-axis in increments of a tenth.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */
import meanShareAndBalance from '../../meanShareAndBalance.js';
import TriangleNode from '../../../../scenery-phet/js/TriangleNode.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import { BALANCE_BEAM_TRANSFORM } from './BalanceBeamNode.js';
import Utils from '../../../../dot/js/Utils.js';
import HSlider, { HSliderOptions } from '../../../../sun/js/HSlider.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';

type SelfOptions = {
  fulcrumHeight: number; // in meters
  fulcrumWidth: number; // in meters
};

type BalanceBeamFulcrumOptions = SelfOptions & WithRequired<HSliderOptions, 'tandem'>;
export default class FulcrumSlider extends HSlider {

  public constructor(
    fulcrumValueProperty: Property<number>,
    meanValueProperty: TReadOnlyProperty<number | null>,
    isMeanFulcrumFixedProperty: TReadOnlyProperty<boolean>,
    providedOptions: BalanceBeamFulcrumOptions
  ) {

    const triangleHeight = BALANCE_BEAM_TRANSFORM.modelToViewDeltaY( providedOptions.fulcrumHeight );
    const triangleWidth = BALANCE_BEAM_TRANSFORM.modelToViewDeltaX( providedOptions.fulcrumWidth );
    const thumbNode = new TriangleNode( {
      triangleHeight: triangleHeight,
      triangleWidth: triangleWidth,
      fill: MeanShareAndBalanceColors.meanColorProperty,
      stroke: MeanShareAndBalanceColors.meanColorProperty,
      lineWidth: 1.5,
      tandem: providedOptions.tandem.createTandem( 'thumbNode' )
    } );

    const options = optionize<BalanceBeamFulcrumOptions, SelfOptions, HSliderOptions>()( {
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

    isMeanFulcrumFixedProperty.link( isMeanFulcrumFixed => {
      this.pickable = !isMeanFulcrumFixed; // JB is this the right way to do this?
      thumbNode.fill = isMeanFulcrumFixed ? MeanShareAndBalanceColors.meanColorProperty : 'white';
      thumbNode.lineDash = isMeanFulcrumFixed ? [] : [ 2, 2 ];
    } );

    Multilink.multilink( [ meanValueProperty, isMeanFulcrumFixedProperty ], ( meanValue, isFixed ) => {
      if ( isFixed ) {
        fulcrumValueProperty.value = meanValue === null ? 5 : meanValue;
      }
    } );
  }
}

meanShareAndBalance.register( 'FulcrumSlider', FulcrumSlider );