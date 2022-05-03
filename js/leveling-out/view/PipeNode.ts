// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 2D pipe and valve between each water cup.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { FireListener, Node, NodeOptions, Path, Rectangle } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import PipeModel from '../model/PipeModel.js';
import { Shape } from '../../../../kite/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

type SelfOptions = {};

type PipeNodeOptions = SelfOptions & NodeOptions;

//TODO add accessibility for screen reader.
export default class PipeNode extends Node {

  constructor( pipeModel: PipeModel, modelViewTransform: ModelViewTransform2, providedOptions?: PipeNodeOptions ) {
    const options = optionize<PipeNodeOptions, SelfOptions, NodeOptions>()( {
      //TODO add default values for options
    }, providedOptions );

    super( options );

    const dilation = 10;
    const strokeWidth = 1;
    const pipeLength = 50;
    const pipeWidth = 5;
    const pipeCenter = new Vector2( pipeLength / 2, pipeWidth / 2 );
    const pipeRectangle = new Rectangle( 0, 0, pipeLength, pipeWidth, { stroke: 'black', fill: '#51CEF4' } );

    //Valve drawing
    const valveRadius = 10;
    const innerValve = new Path( this.createCircle( valveRadius, pipeWidth + strokeWidth * 2 ), { fill: 'grey' } );
    const outerValve = new Path( this.createCircle( valveRadius + strokeWidth, pipeWidth ), { fill: 'black' } );
    const valveNode = new Node( { children: [ outerValve, innerValve ], cursor: 'pointer' } );
    valveNode.center = pipeCenter;
    // To turn off set clipArea to null
    // Change valve node rotation to Math.PI/2
    const pipeClipArea = this.pipeClipArea( pipeRectangle.localBounds, valveRadius );
    pipeRectangle.clipArea = pipeClipArea;

    valveNode.mouseArea = valveNode.localBounds.dilated( dilation );
    valveNode.touchArea = valveNode.localBounds.dilated( dilation );

    //Valve rotation event listener
    valveNode.addInputListener( new FireListener( {
      fire: () => {
        pipeModel.isOpenProperty.set( !pipeModel.isOpenProperty.value );
      },
      tandem: options.tandem.createTandem( 'fireListener' )
    } ) );

    pipeModel.isOpenProperty.link( isOpen => {
      if ( isOpen ) {
        valveNode.rotation = Math.PI / 2;
        pipeRectangle.clipArea = null;
      }
      else {
        valveNode.rotation = 0;
        pipeRectangle.clipArea = pipeClipArea;
      }
    } );

    this.addChild( pipeRectangle );
    this.addChild( valveNode );
    //TODO grab cupWidth from global Constant
    this.x = pipeModel.xProperty.value + 50;
    this.y = modelViewTransform.modelToViewY( 0 ) - pipeWidth;
  }

  private createCircle( radius: number, rectangleWidth: number ): Shape {
    const circle = Shape.circle( radius );
    const rectangle = Shape.rectangle( -rectangleWidth / 2, -radius - 5, rectangleWidth, ( radius + 5 ) * 2 );

    return circle.shapeDifference( rectangle );
  }

  private pipeClipArea( bounds: Bounds2, radius: number ): Shape {
    const clipAreaRectangle = Shape.bounds( bounds );
    const clipAreaCircle = Shape.circle( bounds.center, radius );

    return clipAreaRectangle.shapeDifference( clipAreaCircle );
  }

}

meanShareAndBalance.register( 'PipeNode', PipeNode );