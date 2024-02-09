// Copyright 2022-2024, University of Colorado Boulder

/**
 * A snackType of a plate with a stack of candy bars on it.  The number of candy bars that are stacked on the
 * plate can vary.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import { Image, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Plate from '../../common/model/Plate.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import greenApple_png from '../../../images/greenApple_png.js';
import chocolateBar_png from '../../../images/chocolateBar_png.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import plate_png from '../../../images/plate_png.js';
import { SnackType } from '../../common/view/SharingScreenView.js';
import SnackStacker from '../../common/SnackStacker.js';

type SelfOptions = {
  snackType: SnackType;
};

type PersonNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

// constants
const APPLE_IMAGE_WIDTH = 25; // in screen coords

export default class TablePlateNode extends Node {

  public constructor( plate: Plate, providedOptions: PersonNodeOptions ) {

    const options = providedOptions;

    const plateImage = new Image( plate_png, {
      scale: 0.1,
      centerY: MeanShareAndBalanceConstants.TABLE_PLATE_CENTER_Y
    } );

    const numberPickerRange = new Range(
      MeanShareAndBalanceConstants.MIN_NUMBER_OF_SNACKS_PER_PLATE,
      MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE
    );
    const numberPicker = new NumberPicker(
      plate.snackNumberProperty,
      new Property( numberPickerRange ),
      {
        centerTop: new Vector2( plateImage.centerBottom.x, MeanShareAndBalanceConstants.TABLE_PLATE_CENTER_Y + 20 ),
        tandem: options.tandem.createTandem( 'numberPicker' )
      }
    );

    const candyBarScale = 0.04;

    // Create and position the Nodes representing the individual snacks that are on this plate.
    const snacks = _.times(
      MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE,
      index => {
        if ( options.snackType === 'candyBars' ) {
          const candyBarNode = new Image( chocolateBar_png, { scale: candyBarScale } );
          SnackStacker.setSnackImageNodePosition( candyBarNode, 'candyBars', index );
          return candyBarNode;
        }
        else {
          const appleNode = new Image( greenApple_png, { maxWidth: APPLE_IMAGE_WIDTH } );
          SnackStacker.setSnackImageNodePosition( appleNode, 'apples', index );
          return appleNode;
        }
      }
    );

    // Control the visibility of the snack Nodes based on the snack number value.
    plate.snackNumberProperty.link( snackNumber => {
      assert && assert( snackNumber <= snacks.length, 'snack number exceeded number of snacks' );
      snacks.forEach( ( snack, i ) => {
        snack.visibleProperty.value = i < snackNumber;
      } );
    } );

    // Create a parent Node to contain the individual snack Nodes.
    const snacksNode = new Node( {
      children: snacks,
      centerBottom: new Vector2( plateImage.centerX, plateImage.centerY )
    } );

    // Put the plate and snacks together in a Node.
    const plateAndSnacksNode = new Node( {
      children: [ plateImage, snacksNode ],
      layoutOptions: {
        minContentHeight: ( 265 * candyBarScale ) * 10
      }
    } );

    super( {
      children: [ plateAndSnacksNode, numberPicker ],
      x: plate.xPosition,
      visibleProperty: plate.isActiveProperty
    } );
  }
}

meanShareAndBalance.register( 'TablePlateNode', TablePlateNode );