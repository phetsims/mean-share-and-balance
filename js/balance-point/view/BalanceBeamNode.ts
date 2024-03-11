// Copyright 2024, University of Colorado Boulder

/**
 * The Balance Beam in the notepad representation plots data points along the x-axis and allows users to move the balance
 * point in order to find the mean.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import { Circle, Line, MatrixBetweenProperty, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import FulcrumSlider from './FulcrumSlider.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import LevelSupportColumnNode from '../../../../scenery-phet/js/LevelSupportColumnNode.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import BalancePointSceneModel, { FULCRUM_HEIGHT } from '../model/BalancePointSceneModel.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import Multilink from '../../../../axon/js/Multilink.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';

const BALANCE_BEAM_GROUND_Y = 220;
const TRANSFORM_SCALE = MeanShareAndBalanceConstants.CHART_VIEW_WIDTH / MeanShareAndBalanceConstants.SOCCER_BALL_RANGE.getLength();
const BEAM_DOT_RADIUS = 3;
const BALL_GRAPHIC_RADIUS = 10;

export const BALANCE_BEAM_TRANSFORM = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
  new Vector2( MeanShareAndBalanceConstants.SOCCER_BALL_RANGE.min, 0 ),
  new Vector2( 0, BALANCE_BEAM_GROUND_Y ),
  TRANSFORM_SCALE
);

type BalanceBeamNodeOptions = EmptySelfOptions & WithRequired<NodeOptions, 'tandem'>;
export default class BalanceBeamNode extends Node {

  public constructor(
    sceneModel: BalancePointSceneModel,
    playAreaNumberLineNode: NumberLineNode,
    paperStackBounds: Bounds2,
    fulcrumValueProperty: Property<number>,
    meanValueProperty: TReadOnlyProperty<number | null>,
    beamSupportsPresentProperty: TReadOnlyProperty<boolean>,
    areTickMarksVisibleProperty: TReadOnlyProperty<boolean>,
    isMeanFulcrumFixedProperty: TReadOnlyProperty<boolean>,
    providedOptions: BalanceBeamNodeOptions
  ) {

    const options = optionize<BalanceBeamNodeOptions, EmptySelfOptions, NodeOptions>()( {}, providedOptions );

    const notepadNumberLineNode = new NumberLineNode(
      MeanShareAndBalanceConstants.CHART_VIEW_WIDTH,
      MeanShareAndBalanceConstants.SOCCER_BALL_RANGE, {
        includeXAxis: false,
        color: 'black',
        showTickMarks: false,
        visibleProperty: areTickMarksVisibleProperty,
        bottom: paperStackBounds.bottom - 15,
        excludeInvisibleChildrenFromBounds: true
      }
    );

    // Calculate view coordinate values for a number of fixed values from the model.
    const lineStartX = BALANCE_BEAM_TRANSFORM.modelToViewX( sceneModel.leftBalanceBeamXValue );
    const lineEndX = BALANCE_BEAM_TRANSFORM.modelToViewX( sceneModel.rightBalanceBeamXValue );
    const groundY = BALANCE_BEAM_TRANSFORM.modelToViewY( 0 );
    const lineWidth = 1;
    const groundLineCenterY = groundY - lineWidth / 2;
    const groundLine = new Line( lineStartX, groundLineCenterY, lineEndX, groundLineCenterY, {
      stroke: 'grey'
    } );

    const fulcrumWidth = 0.85;
    const fulcrumSlider = new FulcrumSlider( fulcrumValueProperty, meanValueProperty,
      isMeanFulcrumFixedProperty, {
        fulcrumHeight: FULCRUM_HEIGHT,
        fulcrumWidth: fulcrumWidth,
        bottom: groundY,
        tandem: options.tandem?.createTandem( 'fulcrumSlider' )
      } );

    const columnWidth = 15; // empirically determined
    const columnHeight = Math.abs( BALANCE_BEAM_TRANSFORM.modelToViewDeltaY( FULCRUM_HEIGHT ) );
    const supportColumns = _.times( 2, i => {
      return new LevelSupportColumnNode( {
        columnWidth: columnWidth,
        columnHeight: columnHeight,
        bottom: groundY,
        centerX: BALANCE_BEAM_TRANSFORM.modelToViewX( i === 0 ? -0.5 : 10.5 ),
        visibleProperty: beamSupportsPresentProperty
      } );
    } );

    const transformedLeftYValue = BALANCE_BEAM_TRANSFORM.modelToViewY( sceneModel.leftBalanceBeamYValueProperty.value );
    const transformedRightYValue = BALANCE_BEAM_TRANSFORM.modelToViewY( sceneModel.rightBalanceBeamYValueProperty.value );
    const beamLine = new Line( lineStartX, transformedLeftYValue, lineEndX, transformedRightYValue, {
      stroke: MeanShareAndBalanceColors.meanColorProperty,
      lineWidth: 2
    } );

    // Define the dots that appear on the beam when tick marks are enabled.
    const numberOfBeamDots = MeanShareAndBalanceConstants.SOCCER_BALL_RANGE.getLength() + 1;
    assert && assert( Number.isInteger( numberOfBeamDots ), 'number of dots should be an integer' );
    const beamDots: Circle[] = [];
    _.times( numberOfBeamDots, () => {
      const dot = new Circle( BEAM_DOT_RADIUS, {
        fill: MeanShareAndBalanceColors.meanColorProperty,
        visibleProperty: areTickMarksVisibleProperty
      } );
      beamDots.push( dot );
    } );

    // Add the graphical representation of the soccer balls.  These are circles that will appear to be stacked on the
    // balance beam.
    const soccerBallGraphics = _.times( sceneModel.soccerBalls.length, () => new Circle( BALL_GRAPHIC_RADIUS, {
      fill: MeanShareAndBalanceColors.balanceBeamBallsColorProperty
    } ) );

    const superOptions = combineOptions<NodeOptions>( {
      children: [
        notepadNumberLineNode,
        groundLine,
        ...soccerBallGraphics,
        ...beamDots,
        beamLine,
        ...supportColumns,
        fulcrumSlider
      ]
    }, options );
    super( superOptions );

    // Align with the play area number line node, based on the tick mark values.
    const matrixBetweenProperty = new MatrixBetweenProperty( playAreaNumberLineNode.tickMarkSet, notepadNumberLineNode.tickMarkSet );

    matrixBetweenProperty.link( matrix => {

      if ( matrix ) {

        const deltaX = matrix.getTranslation().x;
        if ( deltaX !== 0 ) {

          // Convert to the this.parent coordinate frame
          const localDeltaX = notepadNumberLineNode.tickMarkSet.getUniqueTrailTo( this ).getTransform().transformDeltaX( deltaX );
          this.x += localDeltaX;
        }
      }
    } );

    // Update the position of the balance beam and the balls that may be sitting on it when anything changes in the
    // model that could require an update.
    Multilink.multilinkAny(
      [
        sceneModel.leftBalanceBeamYValueProperty,
        sceneModel.rightBalanceBeamYValueProperty,
        ...sceneModel.soccerBalls.map( soccerBall => soccerBall.valueProperty )
      ],
      () => {

        // Calculate the start and end points of the balance beam line in view coordinates.
        const startPoint = new Vector2(
          lineStartX,
          BALANCE_BEAM_TRANSFORM.modelToViewY( sceneModel.leftBalanceBeamYValueProperty.value )
        );
        const endPoint = new Vector2(
          lineEndX,
          BALANCE_BEAM_TRANSFORM.modelToViewY( sceneModel.rightBalanceBeamYValueProperty.value )
        );

        // Update the balance beam line.
        beamLine.setPoint1( startPoint );
        beamLine.setPoint2( endPoint );

        // Update the tick mark dot positions.
        const startToEndVector = endPoint.minus( startPoint );
        const pointToPointVector = startToEndVector.withMagnitude( startToEndVector.getMagnitude() / ( beamDots.length + 1 ) );
        beamDots.forEach( ( beamDot, i ) => {
          beamDot.translation = startPoint.plus( pointToPointVector.times( i + 1 ) );
        } );

        // Create a function that will map a model X value to a Y value on the beam.
        const beamLineFunction = new LinearFunction(
          sceneModel.leftBalanceBeamXValue,
          sceneModel.rightBalanceBeamXValue,
          sceneModel.leftBalanceBeamYValueProperty.value,
          sceneModel.rightBalanceBeamYValueProperty.value
        );

        // Go through the soccer balls in the model and update the position and visibility of the corresponding graphic
        // representation.
        const ballsAtEachLocation: number[] = [];
        sceneModel.soccerBalls.forEach( ( modelSoccerBall, i ) => {
          if ( modelSoccerBall.valueProperty.value === null ) {

            // This ball is not on the field, so just set the graphic to be invisible.
            soccerBallGraphics[ i ].visible = false;
          }
          else {

            // This ball is on the field, so put the corresponding graphic on the appropriate position on the beam or
            // stacked atop other balls and make it visible.
            const ballGraphic = soccerBallGraphics[ i ];
            ballGraphic.visible = true;
            const ballModelXPosition = modelSoccerBall.valueProperty.value;
            assert && assert( Number.isInteger( ballModelXPosition ), 'balls must be at integer positions' );
            const ballsAlreadyAtThisLocation = ballsAtEachLocation[ ballModelXPosition ] === undefined ?
                                               0 :
                                               ballsAtEachLocation[ ballModelXPosition ];

            // Set the ball graphic's position.
            const beamModelYPosition = beamLineFunction.evaluate( modelSoccerBall.positionProperty.value.x );
            ballGraphic.x = BALANCE_BEAM_TRANSFORM.modelToViewX( modelSoccerBall.valueProperty.value );
            ballGraphic.y = BALANCE_BEAM_TRANSFORM.modelToViewY( beamModelYPosition ) -
                            BALL_GRAPHIC_RADIUS -
                            ballsAlreadyAtThisLocation * BALL_GRAPHIC_RADIUS * 2;

            // Update the count of balls at this position on the beam.
            ballsAtEachLocation[ ballModelXPosition ] = ballsAlreadyAtThisLocation + 1;
          }
        } );
      }
    );
  }
}

meanShareAndBalance.register( 'BalanceBeamNode', BalanceBeamNode );