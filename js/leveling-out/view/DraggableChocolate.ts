// Copyright 2022, University of Colorado Boulder


/**
 * TODO: describe file
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { DragListener, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import ChocolateBar from '../model/ChocolateBar.js';
import LevelingOutModel from '../model/LevelingOutModel.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';

type SelfOptions = EmptySelfOptions;
type DraggableChocolateNodeOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class DraggableChocolate extends Node {

  public readonly chocolateBarDragListener: DragListener;
  public readonly chocolateBarModel: ChocolateBar;

  public constructor( model: Pick<LevelingOutModel, 'dropChocolates'>,
                      chocolateBarModel: ChocolateBar, notebookPaperBoundsProperty: TReadOnlyProperty<Bounds2>,
                      chocolateBarDropped: ( chocolateBar: DraggableChocolate ) => void, providedOptions: DraggableChocolateNodeOptions ) {

    const options = providedOptions;

    const chocolateBar = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CHOCOLATE_WIDTH, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT, {
      fill: MeanShareAndBalanceColors.chocolateColorProperty,
      stroke: 'black'
    } );

    const combinedOptions = combineOptions<NodeOptions>( {
      children: [ chocolateBar ],
      cursor: 'pointer'
    }, options );
    super( combinedOptions );

    this.chocolateBarModel = chocolateBarModel;

    this.chocolateBarDragListener = new DragListener( {
      positionProperty: this.chocolateBarModel.positionProperty,

      // The origin of the chocolate bar is the top left, so we must erode just on the right and bottom edge to keep
      // the chocolate fully in the paper region
      dragBoundsProperty: new DerivedProperty( [ notebookPaperBoundsProperty ], bounds =>
        new Bounds2( bounds.minX, bounds.minY, bounds.maxX - chocolateBar.width, bounds.maxY - chocolateBar.height )
      ),
      start: () => {
        chocolateBarModel.stateProperty.set( 'dragging' );
        model.dropChocolates( chocolateBarModel.parentPlateProperty.value );
        this.moveToFront();
      },
      end: () => {
        chocolateBarDropped( this );
        chocolateBarModel.stateProperty.set( 'plate' );
      },
      tandem: options.tandem.createTandem( 'chocolateBarDragListener' )
    } );

    this.addInputListener( this.chocolateBarDragListener );

    this.chocolateBarModel.positionProperty.link( position => {
      this.x = position.x;
      this.y = position.y;
    } );
  }

  public reset(): void {
    this.chocolateBarModel.reset();
  }
}

meanShareAndBalance.register( 'DraggableChocolate', DraggableChocolate );