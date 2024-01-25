// Copyright 2022-2024, University of Colorado Boulder

/**
 * In the upper (notepad) representation, contains all the candy bars on a plate. Each plate in the model has one
 * NotepadPlateNode.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */


import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { Line, Node, NodeOptions, NodeTranslationOptions, VBoxOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import NotepadCandyBarNode from './NotepadCandyBarNode.js';
import Plate from '../model/Plate.js';

type NotepadPlateNodeOptions = StrictOmit<VBoxOptions, keyof NodeTranslationOptions | 'children'> & PickRequired<NodeOptions, 'tandem'>;

export default class NotepadPlateNode extends Node {
  public constructor( plate: Plate,
                      candyBarDropped: ( candyBar: NotepadCandyBarNode ) => void,
                      providedOptions: NotepadPlateNodeOptions ) {

    const options = optionize<NotepadPlateNodeOptions, EmptySelfOptions, NodeOptions>()( {
      x: plate.xPosition,
      y: MeanShareAndBalanceConstants.NOTEPAD_PLATE_CENTER_Y,
      visibleProperty: plate.isActiveProperty,
      children: [ new Line( 0, 0, MeanShareAndBalanceConstants.CANDY_BAR_WIDTH, 0, { stroke: 'black' } ) ]
    }, providedOptions );

    super( options );
  }
}

meanShareAndBalance.register( 'NotepadPlateNode', NotepadPlateNode );