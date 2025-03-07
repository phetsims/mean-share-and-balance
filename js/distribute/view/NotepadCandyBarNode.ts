// Copyright 2024-2025, University of Colorado Boulder

/**
 * An individual candy bar node. These candy bars are draggable, and must stay within the notepad bounds.
 * Each candy bar snaps to the closest plate when dropped, which updates the parentPlate in the model.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import GroupSelectModel from '../../../../scenery-phet/js/accessibility/group-sort/model/GroupSelectModel.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Pattern from '../../../../scenery/js/util/Pattern.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import graphiteTexture_png from '../../../images/graphiteTexture_png.js';
import sketchedCandyBarFill_svg from '../../../images/sketchedCandyBarFill_svg.js';
import grabCandyBarV2_mp3 from '../../../sounds/grabCandyBarV2_mp3.js';
import releaseCandyBarV2_mp3 from '../../../sounds/releaseCandyBarV2_mp3.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Snack from '../../common/model/Snack.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = EmptySelfOptions;
type NotepadCandyBarNodeOptions = SelfOptions & StrictOmit<WithRequired<NodeOptions, 'tandem'>, 'children'>;

export default class NotepadCandyBarNode extends InteractiveHighlighting( Node ) {

  public readonly dragListener: DragListener;
  public readonly candyBar: Snack;

  public constructor( candyBar: Snack,
                      groupSortInteractionModel: GroupSelectModel<Snack>,
                      modelViewTransform: ModelViewTransform2,
                      notebookPaperBoundsProperty: TReadOnlyProperty<Bounds2>,
                      candyBarDropped: ( candyBarNode: NotepadCandyBarNode ) => void,
                      providedOptions: NotepadCandyBarNodeOptions ) {


    const candyBarNode = new Image( sketchedCandyBarFill_svg, {
      maxWidth: MeanShareAndBalanceConstants.CANDY_BAR_WIDTH,
      children: NotepadCandyBarNode.getSketchOutline()
    } );

    const candyBarShadowRectangle = new Rectangle( 0, 0,
      MeanShareAndBalanceConstants.CANDY_BAR_WIDTH, MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT,
      {
        fill: 'black',
        opacity: 0.2,
        cornerRadius: 1,
        visibleProperty: candyBar.draggingProperty,
        left: candyBarNode.left + 5,
        top: candyBarNode.top + 6
      } );

    const children: Array<Node> = [ candyBarShadowRectangle, candyBarNode ];

    // In ?dev mode, show the index of the candy bar to help understand how things are organized and how they
    // redistribute.
    if ( phet.chipper.queryParameters.dev ) {
      children.push( new Text( candyBar.instanceID, { fill: 'white', top: 0, left: 0 } ) );
    }

    const options = optionize<NotepadCandyBarNodeOptions, SelfOptions, NodeOptions>()( {
      children: children,
      cursor: 'pointer',
      isDisposable: false
    }, providedOptions );

    super( options );

    this.candyBar = candyBar;

    // Prevent this from being pickable while animating or dragging.
    Multilink.multilink(
      [ candyBar.draggingProperty, candyBar.travelAnimationProperty ],
      ( isDragging, travelAnimation ) => {
        candyBarNode.pickable = !isDragging && !travelAnimation;
      }
    );

    const soundClipOptions = { initialOutputLevel: MeanShareAndBalanceConstants.GRAB_RELEASE_SOUND_LEVEL };
    const grabSoundPlayer = new SoundClip( grabCandyBarV2_mp3, soundClipOptions );
    const releaseSoundPlayer = new SoundClip( releaseCandyBarV2_mp3, soundClipOptions );
    soundManager.addSoundGenerator( grabSoundPlayer );
    soundManager.addSoundGenerator( releaseSoundPlayer );

    this.dragListener = new SoundDragListener( {
      grabSoundPlayer: grabSoundPlayer,
      releaseSoundPlayer: releaseSoundPlayer,
      transform: modelViewTransform,
      positionProperty: this.candyBar.positionProperty,
      offsetPosition: ( viewPoint, dragListener ) => {
        return dragListener.pointer.isTouchLike() ? new Vector2( 6, -30 ) : new Vector2( 6, -2 );
      },

      // The origin of the candy bar is the top left, so we must erode just on the right and bottom edge to keep
      // the candy bar fully in the paper region.
      dragBoundsProperty: new DerivedProperty( [ notebookPaperBoundsProperty ], bounds =>
        new Bounds2( bounds.minX, bounds.minY, bounds.maxX - candyBarNode.width, bounds.maxY - candyBarNode.height )
      ),
      start: () => {

        // When the candy bar is grabbed with the mouse, set the mouseSortedGroupItem property to true.
        groupSortInteractionModel.setMouseSortedGroupItem( true );
        groupSortInteractionModel.interrupt();
        candyBar.draggingProperty.value = true;
        this.moveToFront();
      },
      end: () => {
        candyBar.draggingProperty.value = false;
        candyBarDropped( this );
      },
      tandem: options.tandem.createTandem( 'dragListener' )
    } );

    this.addInputListener( this.dragListener );

    groupSortInteractionModel.isKeyboardFocusedProperty.lazyLink( isKeyboardFocused => isKeyboardFocused && this.dragListener.interrupt() );

    this.candyBar.positionProperty.link( position =>
      this.setTranslation( modelViewTransform.modelToViewPosition( position ) )
    );
  }

  /**
   * A pattern is used for the outline of the candy bar. Because of this, the pattern must be rotated and translated to
   * match the bounds of the rectangle. This method returns the nodes that make up the outline of the candy bar.
   */
  public static getSketchOutline(): Node[ ] {
    const verticalStrokePattern = new Pattern( graphiteTexture_png )
      .setTransformMatrix( MeanShareAndBalanceConstants.VERTICAL_PATTERN_MATRIX );
    const horizontalStrokePattern = new Pattern( graphiteTexture_png )
      .setTransformMatrix( MeanShareAndBalanceConstants.HORIZONTAL_PATTERN_MATRIX );
    const candyBarWidth = MeanShareAndBalanceConstants.CANDY_BAR_WIDTH;
    const candyBarHeight = MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT;
    const candyBarStrokeLeft = new Line(
      0, 0, 0, candyBarHeight,
      {
        lineWidth: 1.95,
        stroke: verticalStrokePattern
      } );
    const candyBarStrokeRight = new Line(
      candyBarWidth, 0, candyBarWidth, candyBarHeight,
      {
        lineWidth: 1.95,
        stroke: verticalStrokePattern
      } );
    const candyBarStrokeTop = new Line(
      0, 0, candyBarWidth, 0,
      {
        lineWidth: 1.95,
        stroke: horizontalStrokePattern
      } );
    const candyBarStrokeBottom = new Line(
      0, candyBarHeight, candyBarWidth, candyBarHeight,
      {
        lineWidth: 1.95,
        stroke: horizontalStrokePattern
      } );

    return [ candyBarStrokeLeft, candyBarStrokeRight, candyBarStrokeTop, candyBarStrokeBottom ];
  }
}

meanShareAndBalance.register( 'NotepadCandyBarNode', NotepadCandyBarNode );