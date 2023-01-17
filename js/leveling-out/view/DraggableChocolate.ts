// Copyright 2022-2023, University of Colorado Boulder

/**
 * An individual chocolate bar node. These chocolate bars are draggable, and must stay within the notebook paper bounds.
 * Each chocolate bar snaps to the closest plate when dropped, which updates the parentPlate in the model.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { DragListener, InteractiveHighlighting, Node, NodeOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import ChocolateBar from '../model/ChocolateBar.js';
import LevelingOutModel from '../model/LevelingOutModel.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;
type DraggableChocolateNodeOptions = SelfOptions & StrictOmit<WithRequired<NodeOptions, 'tandem'>, 'children'>;

// TODO: Should this be renamed ChocolateBarNode? https://github.com/phetsims/mean-share-and-balance/issues/131
export default class DraggableChocolate extends InteractiveHighlighting( Node ) {

  public readonly dragListener: DragListener;
  public readonly chocolateBar: ChocolateBar;

  public constructor( model: Pick<LevelingOutModel, 'reorganizeChocolates'>,
                      chocolateBar: ChocolateBar,
                      notebookPaperBoundsProperty: TReadOnlyProperty<Bounds2>,
                      chocolateBarDropped: ( chocolateBar: DraggableChocolate ) => void,
                      providedOptions: DraggableChocolateNodeOptions ) {

    const chocolateBarRectangle = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CHOCOLATE_WIDTH, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT, {
      fill: MeanShareAndBalanceColors.chocolateColorProperty,
      stroke: 'black'
    } );

    const children: Array<Node> = [ chocolateBarRectangle ];

    // In ?dev mode, show the index of the chocolate to help understand how things are organized and how they redistribute
    if ( phet.chipper.queryParameters.dev ) {
      children.push( new Text( chocolateBar.index, { fill: 'white', top: 0, left: 0 } ) );
    }

    const options = optionize<DraggableChocolateNodeOptions, SelfOptions, NodeOptions>()( {
      children: children,
      cursor: 'pointer'
    }, providedOptions );

    super( options );

    this.chocolateBar = chocolateBar;

    this.dragListener = new DragListener( {
      positionProperty: this.chocolateBar.positionProperty,

      // The origin of the chocolate bar is the top left, so we must erode just on the right and bottom edge to keep
      // the chocolate fully in the paper region
      dragBoundsProperty: new DerivedProperty( [ notebookPaperBoundsProperty ], bounds =>
        new Bounds2( bounds.minX, bounds.minY, bounds.maxX - chocolateBarRectangle.width, bounds.maxY - chocolateBarRectangle.height )
      ),
      start: () => {
        chocolateBar.stateProperty.set( 'dragging' );
        model.reorganizeChocolates( chocolateBar.parentPlateProperty.value );
        this.moveToFront();
      },
      end: () => {
        chocolateBarDropped( this );
        chocolateBar.stateProperty.set( 'plate' );
      },
      tandem: options.tandem.createTandem( 'dragListener' )
    } );

    this.addInputListener( this.dragListener );

    this.chocolateBar.positionProperty.link( position => this.setTranslation( position ) );
  }
}

meanShareAndBalance.register( 'DraggableChocolate', DraggableChocolate );