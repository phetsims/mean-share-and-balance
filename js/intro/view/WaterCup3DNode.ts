// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 3D water cup including draggable water level.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import WaterCup from '../model/WaterCup.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import WaterLevelTriangleNode from './WaterLevelTriangleNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import BeakerNode from '../../../../scenery-phet/js/BeakerNode.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = EmptySelfOptions;

//REVIEW is there a reason to include all NodeOptions? If a client provides any translation options, this Node won't sync with waterCupModel.
type WaterCup3DNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'y' | 'x' | 'left' | 'right' | 'top' | 'bottom'>;

export default class WaterCup3DNode extends Node {
  private readonly waterLevelTriangle: Node;
  private readonly waterCup: WaterCup;
  private readonly adapterProperty: Property<number>;
  private readonly tickMarksVisibleProperty: Property<boolean>;
  private readonly isShowingTickMarksListener: ( isShowingTickMarks: boolean ) => void;

  public constructor( tickMarksVisibleProperty: Property<boolean>,
                      changeWaterLevel: ( cup3DModel: WaterCup, adapterProperty: Property<number>, waterLevel: number, oldWaterLevel: number ) => void,
                      waterCup: WaterCup, modelViewTransform: ModelViewTransform2,
                      providedOptions?: WaterCup3DNodeOptions ) {

    const options = optionize<WaterCup3DNodeOptions, SelfOptions, NodeOptions>()( {
      y: modelViewTransform.modelToViewY( 0 ) - MeanShareAndBalanceConstants.CUP_HEIGHT,
      left: waterCup.position.x,
      visibleProperty: waterCup.isActiveProperty
    }, providedOptions );
    super();

    this.waterCup = waterCup;

    // The CUP_HEIGHT is the height of the 2d cups.  The 3D cups have to be adjusted accordingly because of the top and bottom ellipses,
    // so they don't seem disproportionately tall
    const beakerHeight = MeanShareAndBalanceConstants.CUP_HEIGHT - 10;

    const beakerLineWidth = 2;
    const waterCupNode = new BeakerNode( waterCup.waterLevelProperty.asRanged(), {
      lineWidth: beakerLineWidth,
      beakerWidth: MeanShareAndBalanceConstants.CUP_WIDTH,
      beakerHeight: beakerHeight,
      solutionFill: MeanShareAndBalanceColors.waterFillColorProperty,
      solutionGlareFill: MeanShareAndBalanceColors.water3DCrescentFillColorProperty,
      solutionShadowFill: MeanShareAndBalanceColors.waterShadowFillColorProperty,
      beakerGlareFill: MeanShareAndBalanceColors.waterCup3DGlareFillColorProperty
    } );

    this.isShowingTickMarksListener = ( isShowingTickMarks: boolean ) => waterCupNode.setTicksVisible( isShowingTickMarks );

    tickMarksVisibleProperty.link( this.isShowingTickMarksListener );

    // adapterProperty double-checks the constraints and deltas in the water levels between the 2D and 3D cups.
    // when the adapterProperty values change a method in the introModel compares delta between current and past value
    // ensures it's within each cup's range, and then sets the water level for each cup accordingly.
    this.adapterProperty = new NumberProperty( waterCup.waterLevelProperty.value, {
      range: new Range( MeanShareAndBalanceConstants.CUP_RANGE_MIN, MeanShareAndBalanceConstants.CUP_RANGE_MAX ),

      // When the slider is changed it triggers a value change in the adapter property
      // This value then updates the 2D & 3D waterLevels which may trigger a change in the slider enabledRangeProperty
      // If the range shrinks and the adapterProperty is out of range then it will be constrained requiring a reentrant: true
      reentrant: true,
      tandem: options.tandem?.createTandem( 'adapterProperty' ),
      phetioReadOnly: true
    } );

    this.adapterProperty.lazyLink( ( waterLevel, oldWaterLevel ) => {
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        changeWaterLevel( waterCup, this.adapterProperty, waterLevel, oldWaterLevel );
      }
    } );

    waterCup.resetEmitter.addListener( () => this.adapterProperty.reset() );

    this.waterLevelTriangle = new WaterLevelTriangleNode( this.adapterProperty, waterCup.enabledRangeProperty, beakerHeight, {
      tandem: options.tandem.createTandem( 'waterLevelTriangle' ),
      left: MeanShareAndBalanceConstants.CUP_WIDTH * MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT,
      top: waterCupNode.top + waterCupNode.yRadiusOfEnds + beakerLineWidth / 2
    } );

    this.addChild( waterCupNode );
    this.addChild( this.waterLevelTriangle );
    this.mutate( options );

    this.tickMarksVisibleProperty = tickMarksVisibleProperty;
  }
}

meanShareAndBalance.register( 'WaterCup3DNode', WaterCup3DNode );