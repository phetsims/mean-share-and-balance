// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 3D water cup including draggable water level.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import WaterCupModel from '../model/WaterCupModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import WaterLevelTriangleNode from './WaterLevelTriangleNode.js';
import optionize from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import BeakerNode from '../../../../scenery-phet/js/BeakerNode.js';

type SelfOptions = {};
type WaterCup3DNodeOptions = SelfOptions & NodeOptions

export default class WaterCup3DNode extends Node {
  private readonly waterLevelTriangle: WaterLevelTriangleNode;

  constructor( cup3DModel: WaterCupModel, modelViewTransform: ModelViewTransform2,
               providedOptions?: WaterCup3DNodeOptions ) {

    const options = optionize<WaterCup3DNodeOptions, SelfOptions, NodeOptions>()( {
      y: modelViewTransform.modelToViewY( 0 ) - MeanShareAndBalanceConstants.CUP_HEIGHT,
      left: cup3DModel.xProperty.value,
      phetioDynamicElement: true
    }, providedOptions );
    super();

    const waterCup = new BeakerNode( cup3DModel.waterLevelProperty, { lineWidth: 2 } );
    this.waterLevelTriangle = new WaterLevelTriangleNode( cup3DModel.waterLevelProperty, cup3DModel.waterHeightRange, {
      tandem: options.tandem.createTandem( 'waterLevelTriangle' ),
      y: MeanShareAndBalanceConstants.CUP_HEIGHT / 2,
      left: 30
    } );
    this.addChild( waterCup );
    this.addChild( this.waterLevelTriangle );

    this.mutate( options );
  }

  override dispose(): void {
    super.dispose();
    this.waterLevelTriangle.dispose();
  }
}

meanShareAndBalance.register( 'WaterCup3DNode', WaterCup3DNode );