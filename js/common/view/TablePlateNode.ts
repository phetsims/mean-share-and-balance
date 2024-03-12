// Copyright 2022-2024, University of Colorado Boulder

/**
 * TablePlateNode is a graphical representation of a plate upon which items - generally called "snacks" in this sim -
 * can be stacked.  This also includes a number spinner that controls the number of items stacked on the plate.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import { Image, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Plate from '../model/Plate.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import plate_svg from '../../../images/plate_svg.js';
import { SnackType } from './SharingScreenView.js';
import SnackStacker from '../SnackStacker.js';
import candyBar_svg from '../../../images/candyBar_svg.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import greenApple_svg from '../../../images/greenApple_svg.js';
import MeanShareAndBalanceColors from '../MeanShareAndBalanceColors.js';

type SelfOptions = {
  snackType: SnackType;
};

type PersonNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

// constants
const APPLE_IMAGE_WIDTH = 25; // in screen coords
const CANDY_BAR_IMAGE_HEIGHT = 25; // in screen coords

export default class TablePlateNode extends Node {

  public constructor( plate: Plate, tableCenter: Vector2, providedOptions: PersonNodeOptions ) {

    const options = providedOptions;

    const plateImage = new Image( plate_svg, {
      maxWidth: Plate.WIDTH * 1.3 // Tweaked a little for a better look, adjust as needed.
    } );

    // Create the number picker and position it relative to the plate image.
    const numberPickerRange = new Range(
      MeanShareAndBalanceConstants.MIN_NUMBER_OF_SNACKS_PER_PLATE,
      MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE
    );
    const numberPicker = new NumberPicker(
      plate.tableSnackNumberProperty,
      new Property( numberPickerRange ),
      {
        centerTop: new Vector2( plateImage.centerBottom.x, 30 ),
        color: MeanShareAndBalanceColors.numberPickerColorProperty,
        tandem: options.tandem.createTandem( 'numberPicker' )
      }
    );

    // Create and position the Nodes representing the individual snacks that are on this plate.
    const snacks = _.times(
      MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE,
      index => {
        if ( options.snackType === 'candyBars' ) {
          const candyBarNode = new Image( candyBar_svg, { maxHeight: CANDY_BAR_IMAGE_HEIGHT } );
          SnackStacker.setSnackImageNodePosition( candyBarNode, 'candyBars', index );
          return candyBarNode;
        }
        else {
          const appleNode = new Image( greenApple_svg, { maxWidth: APPLE_IMAGE_WIDTH } );
          SnackStacker.setSnackImageNodePosition( appleNode, 'apples', index );
          return appleNode;
        }
      }
    );

    // Control the visibility of the snack Nodes based on the snack number value.
    plate.tableSnackNumberProperty.link( snackNumber => {
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
        minContentHeight: CANDY_BAR_IMAGE_HEIGHT * 10
      }
    } );

    super( {
      children: [ plateAndSnacksNode, numberPicker ],
      centerX: plate.xPositionProperty.value,
      visibleProperty: plate.isActiveProperty
    } );

    // Create the model-view transform for positioning the plates on the table.
    const modelToTableTopTransform = ModelViewTransform2.createOffsetScaleMapping( tableCenter, 1 );

    // Set they Y position, which does not change after construction.
    this.y = modelToTableTopTransform.transformY( 0 );

    // Position this node as the plate's x position changes.
    plate.xPositionProperty.link( xPosition => {
      this.centerX = modelToTableTopTransform.transformX( xPosition );
    } );
  }
}

meanShareAndBalance.register( 'TablePlateNode', TablePlateNode );