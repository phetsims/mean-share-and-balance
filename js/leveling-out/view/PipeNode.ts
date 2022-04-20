// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 2D pipe and valve between each water cup.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Circle, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import PipeModel from '../model/PipeModel.js';

type SelfOptions = {};

type PipeNodeOptions = SelfOptions & NodeOptions;

class PipeNode extends Node {

  // TODO: It's conventional in our project to x before y, width before height, etc.
  constructor( pipeModel: PipeModel, modelViewTransform: ModelViewTransform2, providedOptions?: PipeNodeOptions ) {
    const options = optionize<PipeNodeOptions, SelfOptions, NodeOptions>()( {
      //TODO add default values for options
    }, providedOptions );

    super( options );

    const pipeLength = 50;
    const pipeHeight = 5;
    const pipeCenter = new Vector2( pipeLength / 2, pipeHeight / 2 );
    const pipeRectangle = new Rectangle( 0, 0, pipeLength, pipeHeight, { stroke: 'black', fill: '#51CEF4' } );

    const valveRadius = 10;
    const valveCircle = new Circle( valveRadius, { stroke: 'black', fill: 'grey' } );
    const valveRectangle = new Rectangle( 0, 0, pipeHeight, valveRadius * 2, { fill: 'white' } );

    valveRectangle.center = pipeCenter;
    valveCircle.center = pipeCenter;

    this.addChild( pipeRectangle );
    this.addChild( valveCircle );
    this.addChild( valveRectangle );
    //Pass in cup width?
    this.x = pipeModel.xProperty.value + 50;
    this.y = modelViewTransform.modelToViewY( 0 ) - pipeHeight;
  }

}

meanShareAndBalance.register( 'PipeNode', PipeNode );
export default PipeNode;