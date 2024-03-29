// Copyright 2024, University of Colorado Boulder

/**
 * An individual candy bar node. These candy bars are draggable, and must stay within the notepad bounds.
 * Each candy bar snaps to the closest plate when dropped, which updates the parentPlate in the model.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { DragListener, InteractiveHighlighting, Line, Node, NodeOptions, Pattern, Rectangle, Text } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import LevelingOutModel from '../model/LevelingOutModel.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import CandyBar from '../model/CandyBar.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import graphiteTexture_png from '../../../images/graphiteTexture_png.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';

type SelfOptions = EmptySelfOptions;
type NotepadCandyBarNodeOptions = SelfOptions & StrictOmit<WithRequired<NodeOptions, 'tandem'>, 'children'>;

export default class NotepadCandyBarNode extends InteractiveHighlighting( Node ) {

  public readonly dragListener: DragListener;
  public readonly candyBar: CandyBar;

  public constructor( model: Pick<LevelingOutModel, 'reorganizeSnacks'>,
                      candyBar: CandyBar,
                      modelViewTransform: ModelViewTransform2,
                      notebookPaperBoundsProperty: TReadOnlyProperty<Bounds2>,
                      candyBarDropped: ( candyBarNode: NotepadCandyBarNode ) => void,
                      providedOptions: NotepadCandyBarNodeOptions ) {

    const candyBarRectangle = new Rectangle( 0, 0, LevelingOutModel.CANDY_BAR_WIDTH, LevelingOutModel.CANDY_BAR_HEIGHT, {
      fill: MeanShareAndBalanceColors.candyBarColorProperty,
      children: NotepadCandyBarNode.getSketchOutline()
    } );

    const shadowVisibleProperty = new DerivedProperty( [ candyBar.stateProperty ], state => state === 'dragging' || state === 'animating' );
    const candyBarShadowRectangle = new Rectangle( candyBarRectangle.rectBounds, {
      fill: 'black',
      opacity: 0.2,
      cornerRadius: 1,
      visibleProperty: shadowVisibleProperty,
      x: 4,
      y: 4
    } );

    const children: Array<Node> = [ candyBarShadowRectangle, candyBarRectangle ];

    // In ?dev mode, show the index of the candy bar to help understand how things are organized and how they
    // redistribute.
    if ( phet.chipper.queryParameters.dev ) {
      children.push( new Text( candyBar.instanceID, { fill: 'white', top: 0, left: 0 } ) );
    }

    const options = optionize<NotepadCandyBarNodeOptions, SelfOptions, NodeOptions>()( {
      children: children,
      cursor: 'pointer'
    }, providedOptions );

    super( options );

    // Prevent this from being pickable while animating.
    candyBar.stateProperty.link( state => {
      candyBarRectangle.pickable = state !== 'animating';
    } );

    this.candyBar = candyBar;

    this.dragListener = new DragListener( {
      transform: modelViewTransform,
      positionProperty: this.candyBar.positionProperty,
      offsetPosition: ( viewPoint, dragListener ) => {
        return dragListener.pointer.isTouchLike() ? new Vector2( 6, -30 ) : new Vector2( 6, -2 );
      },

      // The origin of the candy bar is the top left, so we must erode just on the right and bottom edge to keep
      // the candy bar fully in the paper region.
      dragBoundsProperty: new DerivedProperty( [ notebookPaperBoundsProperty ], bounds =>
        new Bounds2( bounds.minX, bounds.minY, bounds.maxX - candyBarRectangle.width, bounds.maxY - candyBarRectangle.height )
      ),
      start: () => {
        candyBar.stateProperty.set( 'dragging' );
        model.reorganizeSnacks( candyBar.parentPlateProperty.value! );
        this.moveToFront();
      },
      end: () => {
        candyBarDropped( this );
      },
      tandem: options.tandem.createTandem( 'dragListener' )
    } );

    this.addInputListener( this.dragListener );

    this.candyBar.positionProperty.link( position =>
      this.setTranslation( modelViewTransform.modelToViewPosition( position ) )
    );
  }

  /**
   * A pattern is used for the outline of the candy bar. Because of this, the pattern must be rotated and translated to
   * match the bounds of the rectangle. This method returns the nodes that make up the outline of the candy bar.
   *
   * When creating partial candy bars the width and rightYTranslation may need to adjust accordingly.
   */
  public static getSketchOutline( candyBarWidth = LevelingOutModel.CANDY_BAR_WIDTH, rightYTranslation = 0.975 ): Node[] {
    const horizontalStrokePattern = new Pattern( graphiteTexture_png ).setTransformMatrix(
      Matrix3.affine( 0.15, 0, 0, 0, 0.15, 0.9 )
    );
    const leftStrokePattern = new Pattern( graphiteTexture_png ).setTransformMatrix(
      Matrix3.affine(
        0.15 * Math.cos( Math.PI / 2 ),
        -0.15 * Math.sin( Math.PI / 2 ),
        0.975,
        0.15 * Math.sin( Math.PI / 2 ),
        0.15 * Math.cos( Math.PI / 2 ),
        0
      ) );
    const rightStrokePattern = new Pattern( graphiteTexture_png ).setTransformMatrix(
      Matrix3.affine(
        0.15 * Math.cos( Math.PI / 2 ),
        -0.15 * Math.sin( Math.PI / 2 ),
        rightYTranslation,
        0.15 * Math.sin( Math.PI / 2 ),
        0.15 * Math.cos( Math.PI / 2 ),
        0
      ) );

    const candyBarStrokeLeft = new Line(
      0, 0, 0, LevelingOutModel.CANDY_BAR_HEIGHT,
      {
        lineWidth: 1.95,
        stroke: leftStrokePattern
      } );
    const candyBarStrokeRight = new Line(
      candyBarWidth, 0, candyBarWidth, LevelingOutModel.CANDY_BAR_HEIGHT,
      {
        lineWidth: 1.95,
        stroke: rightStrokePattern
      } );
    const candyBarStrokeTop = new Line(
      0, 0, candyBarWidth, 0,
      {
        lineWidth: 1.95,
        stroke: horizontalStrokePattern
      } );
    const candyBarStrokeBottom = new Line(
      0, LevelingOutModel.CANDY_BAR_HEIGHT, candyBarWidth, LevelingOutModel.CANDY_BAR_HEIGHT,
      {
        lineWidth: 1.95,
        stroke: horizontalStrokePattern
      } );

    return [ candyBarStrokeLeft, candyBarStrokeRight, candyBarStrokeTop, candyBarStrokeBottom ];
  }
}

meanShareAndBalance.register( 'NotepadCandyBarNode', NotepadCandyBarNode );