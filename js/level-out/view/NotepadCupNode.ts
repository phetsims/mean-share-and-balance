// Copyright 2022-2025, University of Colorado Boulder

/**
 * Representation for the notepad water cup including dynamic water level.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions, NodeTransformOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Pattern from '../../../../scenery/js/util/Pattern.js';
import graphiteTexture_png from '../../../images/graphiteTexture_png.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Cup from '../model/Cup.js';
import NotepadCupTickMarksNode from './NotepadCupTickMarksNode.js';

type SelfOptions = EmptySelfOptions;

type NotepadCupNodeOptions = SelfOptions & StrictOmit<NodeOptions, keyof NodeTransformOptions | 'children'>;

export default class NotepadCupNode extends Node {

  public constructor( notepadCup: Cup, notepadMVT: ModelViewTransform2,
                      showingTickMarksProperty: Property<boolean>, providedOptions?: NotepadCupNodeOptions ) {
    const options = optionize<NotepadCupNodeOptions, SelfOptions, NodeOptions>()( {
      bottom: notepadMVT.modelToViewY( 0 ),
      visibleProperty: notepadCup.isActiveProperty,
      isDisposable: false
    }, providedOptions );

    const tickMarks = new NotepadCupTickMarksNode(
      MeanShareAndBalanceConstants.CUP_HEIGHT,
      { visibleProperty: showingTickMarksProperty }
    );

    // 0 is empty, 1 is full
    const y = Utils.linear( 0, 1, MeanShareAndBalanceConstants.CUP_HEIGHT, 0, notepadCup.waterLevelProperty.value );

    // Create the outline of the notepad cup with a pattern.
    const verticalLinePattern = new Pattern( graphiteTexture_png )
      .setTransformMatrix( MeanShareAndBalanceConstants.VERTICAL_PATTERN_MATRIX );
    const topStrokePattern = new Pattern( graphiteTexture_png )
      .setTransformMatrix( MeanShareAndBalanceConstants.HORIZONTAL_PATTERN_MATRIX );
    const bottomStrokePattern = new Pattern( graphiteTexture_png )
      .setTransformMatrix( Matrix3.affine( 0.15, 0, 0, 0, 0.15, 0 ) );
    const cupStrokeLeft = new Line( 0, 0, 0, MeanShareAndBalanceConstants.CUP_HEIGHT, {
      lineWidth: 1.95,
      stroke: verticalLinePattern
    } );
    const cupStrokeRight = new Line( MeanShareAndBalanceConstants.CUP_WIDTH, 0, MeanShareAndBalanceConstants.CUP_WIDTH, MeanShareAndBalanceConstants.CUP_HEIGHT, {
      lineWidth: 1.95,
      stroke: verticalLinePattern
    } );
    const cupStrokeTop = new Line( 0, 0, MeanShareAndBalanceConstants.CUP_WIDTH, 0, {
      lineWidth: 1.95,
      stroke: topStrokePattern
    } );
    const cupStrokeBottom = new Line( 0, MeanShareAndBalanceConstants.CUP_HEIGHT, MeanShareAndBalanceConstants.CUP_WIDTH, MeanShareAndBalanceConstants.CUP_HEIGHT, {
      lineWidth: 1.95,
      stroke: bottomStrokePattern
    } );

    const waterCupBackgroundRectangle = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CUP_WIDTH, MeanShareAndBalanceConstants.CUP_HEIGHT, { fill: 'white' } );
    const waterLevelRectangle = new Rectangle( 0, y, MeanShareAndBalanceConstants.CUP_WIDTH,
      MeanShareAndBalanceConstants.CUP_HEIGHT * notepadCup.waterLevelProperty.value,
      { fill: MeanShareAndBalanceColors.waterFillColorProperty }
    );

    const waterLevelListener = ( waterLevel: number ) => {
      waterLevelRectangle.setRectHeightFromBottom( MeanShareAndBalanceConstants.CUP_HEIGHT * waterLevel );
    };
    notepadCup.waterLevelProperty.link( waterLevelListener );

    const combinedOptions = combineOptions<NodeOptions>( {
      children: [ waterCupBackgroundRectangle, waterLevelRectangle,
        cupStrokeLeft, cupStrokeRight, cupStrokeTop, cupStrokeBottom, tickMarks ]
    }, options );
    super( combinedOptions );

    // Set position
    notepadCup.xPositionProperty.link( xPosition => {
      this.left = notepadMVT.transformX( xPosition );
    } );
  }
}

meanShareAndBalance.register( 'NotepadCupNode', NotepadCupNode );