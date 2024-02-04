// Copyright 2022-2024, University of Colorado Boulder

/**
 * A snackType of a plate with a stack of candy bars on it.  The number of candy bars that are stacked on the
 * plate can vary.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import { Circle, Image, Node, NodeOptions, VBox } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Plate from '../../common/model/Plate.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import chocolateBar_png from '../../../images/chocolateBar_png.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import plate_png from '../../../images/plate_png.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import { SnackType } from '../../common/view/SharingScreenView.js';

type SelfOptions = {
  snackType: SnackType;
};

type PersonNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class TablePlateNode extends Node {

  public constructor( plate: Plate, providedOptions: PersonNodeOptions ) {

    const options = providedOptions;

    const plateImage = new Image( plate_png, {
      scale: 0.1,
      centerY: MeanShareAndBalanceConstants.TABLE_PLATE_CENTER_Y
    } );

    const numberPickerRange = new Range(
      MeanShareAndBalanceConstants.MIN_NUMBER_OF_CANDY_BARS,
      MeanShareAndBalanceConstants.MAX_NUMBER_OF_CANDY_BARS_PER_PERSON
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

    // create the snacks each person brought
    const snacks = _.times(
      MeanShareAndBalanceConstants.MAX_NUMBER_OF_CANDY_BARS_PER_PERSON,
      () => {
        if ( options.snackType === 'candyBars' ) {
          return new Image( chocolateBar_png, { scale: candyBarScale } );
        }
        else {
          return new Circle( 10, {
            fill: MeanShareAndBalanceColors.appleColorProperty
          } );
        }
      }
    );

    plate.snackNumberProperty.link( snackNumber => {
      snacks.forEach( ( snack, i ) => {
        snack.visibleProperty.value = i < snackNumber;
      } );
    } );

    // TODO: We want the apples to stack side by side and currently they stack 5 and then another 5. https://github.com/phetsims/mean-share-and-balance/issues/149
    const snacksVbox = new VBox( {
      children: snacks.slice().reverse(), // reverse the order so that the snacks are stacked from the bottom up
      spacing: 1.5,
      wrap: true,
      preferredHeight: 120,
      justify: 'bottom',
      excludeInvisibleChildrenFromBounds: false,
      centerBottom: new Vector2( plateImage.centerX, plateImage.centerY )
    } );

    const candyBarsNode = new Node( {
      children: [ plateImage, snacksVbox ],
      layoutOptions: {
        minContentHeight: ( 265 * candyBarScale ) * 10
      }
    } );

    super( {
      children: [ candyBarsNode, numberPicker ],
      x: plate.xPosition,
      visibleProperty: plate.isActiveProperty
    } );
  }
}

meanShareAndBalance.register( 'TablePlateNode', TablePlateNode );