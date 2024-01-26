// Copyright 2024, University of Colorado Boulder

/**
 * An individual candy bar node. These candy bars are draggable, and must stay within the notepad bounds.
 * Each candy bar snaps to the closest plate when dropped, which updates the parentPlate in the model.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { DragListener, InteractiveHighlighting, Node, NodeOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import LevelingOutModel from '../model/LevelingOutModel.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import CandyBar from '../model/CandyBar.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type SelfOptions = EmptySelfOptions;
type NotepadCandyBarNodeOptions = SelfOptions & StrictOmit<WithRequired<NodeOptions, 'tandem'>, 'children'>;

export default class NotepadCandyBarNode extends InteractiveHighlighting( Node ) {

  public readonly dragListener: DragListener;
  public readonly candyBar: CandyBar;

  public constructor( model: Pick<LevelingOutModel, 'reorganizeCandyBars'>,
                      candyBar: CandyBar,
                      notebookPaperBoundsProperty: TReadOnlyProperty<Bounds2>,
                      candyBarDropped: ( candyBarNode: NotepadCandyBarNode ) => void,
                      providedOptions: NotepadCandyBarNodeOptions ) {

    const candyBarRectangle = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CANDY_BAR_WIDTH, MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT, {
      fill: MeanShareAndBalanceColors.candyBarColorProperty,
      stroke: 'black'
    } );

    const children: Array<Node> = [ candyBarRectangle ];

    // In ?dev mode, show the index of the candy bar to help understand how things are organized and how they
    // redistribute.
    if ( phet.chipper.queryParameters.dev ) {
      children.push( new Text( candyBar.index, { fill: 'white', top: 0, left: 0 } ) );
    }

    const options = optionize<NotepadCandyBarNodeOptions, SelfOptions, NodeOptions>()( {
      children: children,
      cursor: 'pointer'
    }, providedOptions );

    super( options );

    this.candyBar = candyBar;

    this.dragListener = new DragListener( {
      positionProperty: this.candyBar.positionProperty,
      offsetPosition: ( viewPoint, dragListener ) => {
        return dragListener.pointer.isTouchLike() ? new Vector2( 6, -30 ) : new Vector2( 6, -2 );
      },

      // The origin of the candy bar is the top left, so we must erode just on the right and bottom edge to keep
      // the candy bar fully in the paper region
      dragBoundsProperty: new DerivedProperty( [ notebookPaperBoundsProperty ], bounds =>
        new Bounds2( bounds.minX, bounds.minY, bounds.maxX - candyBarRectangle.width, bounds.maxY - candyBarRectangle.height )
      ),
      start: () => {
        candyBar.stateProperty.set( 'dragging' );
        model.reorganizeCandyBars( candyBar.parentPlateProperty.value );
        this.moveToFront();
      },
      end: () => {
        candyBarDropped( this );
        candyBar.stateProperty.set( 'plate' );
      },
      tandem: options.tandem.createTandem( 'dragListener' )
    } );

    this.addInputListener( this.dragListener );

    this.candyBar.positionProperty.link( position => this.setTranslation( position ) );
  }
}

meanShareAndBalance.register( 'NotepadCandyBarNode', NotepadCandyBarNode );