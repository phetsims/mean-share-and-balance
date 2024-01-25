// Copyright 2022-2024, University of Colorado Boulder

/**
 * The container notepadPlate (in the bottom representation) that holds all of the candy bars a person has brought.
 * Each notepadPlate is associated with a tablePlate.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { Image, Node, NodeOptions, VBox } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Plate from '../model/Plate.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import chocolateBar_png from '../../../images/chocolateBar_png.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import plate_png from '../../../images/plate_png.js';

type PersonNodeOptions = PickRequired<NodeOptions, 'tandem'>;

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
        centerTop: new Vector2( plateImage.centerBottom.x, plateImage.centerBottom.y + 55 ),
        tandem: options.tandem.createTandem( 'numberPicker' )
      }
    );

    const candyBarScale = 0.04;

    // create candy bars each person brought
    // REVIEW: See if it would be appropriate to use _.times elsewhere
    const candyBars = _.times( MeanShareAndBalanceConstants.MAX_NUMBER_OF_CANDY_BARS_PER_PERSON, () => new Image( chocolateBar_png, {
      scale: candyBarScale
    } ) );

    const candyBarsVBox = new VBox( {
      children: candyBars,
      spacing: 1.5
    } );

    plate.snackNumberProperty.link( candyBarNumber => {
      candyBars.forEach( ( chocolate, i ) => {
        chocolate.visibleProperty.value = i < candyBarNumber;
        candyBarsVBox.centerBottom = new Vector2( plateImage.centerX, plateImage.centerY );
      } );
    } );

    const candyBarsNode = new Node( {
      children: [ plateImage, candyBarsVBox ],
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