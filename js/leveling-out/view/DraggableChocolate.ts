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
import Plate from '../model/Plate.js';
import ChocolateBar from '../model/ChocolateBar.js';
import LevelingOutModel from '../model/LevelingOutModel.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = EmptySelfOptions;
type DraggableChocolateNodeOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class DraggableChocolate extends Node {

  public readonly chocolateBarDragListener: DragListener;
  public readonly chocolateBarModel: ChocolateBar;

  public constructor( model: Pick<LevelingOutModel, 'dropChocolates' | 'syncNumberOfChocolatesOnPlates'>,
                      chocolateBarModel: ChocolateBar, notebookPaperBoundsProperty: TReadOnlyProperty<Bounds2>,
                      chocolateBarDropped: ( chocolateBar: DraggableChocolate ) => Plate, providedOptions: DraggableChocolateNodeOptions ) {

    const options = providedOptions;

    const chocolateBar = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CHOCOLATE_WIDTH, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT, {
      fill: 'saddleBrown',
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
      dragBoundsProperty: notebookPaperBoundsProperty,
      start: () => {
        chocolateBarModel.stateProperty.set( 'dragging' );
        model.dropChocolates( chocolateBarModel );
      },
      end: () => {
        chocolateBarModel.parentPlateProperty.set( chocolateBarDropped( this ) );
        chocolateBarModel.stateProperty.set( 'plate' );
        model.syncNumberOfChocolatesOnPlates();
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