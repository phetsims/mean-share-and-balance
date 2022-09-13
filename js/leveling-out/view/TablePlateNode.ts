// Copyright 2022, University of Colorado Boulder

/**
 * TODO: describe file
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { Image, Node, NodeOptions, VBox } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Person from '../model/Person.js';
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

  public constructor( person: Person, providedOptions: PersonNodeOptions ) {

    const options = providedOptions;

    const plate = new Image( plate_png, {
      scale: 0.1,
      centerY: person.position.y
    } );


    const numberPickerRange = new Range( MeanShareAndBalanceConstants.MIN_NUMBER_OF_CHOCOLATES, MeanShareAndBalanceConstants.MAX_NUMBER_OF_CHOCOLATES );
    const numberPicker = new NumberPicker( person.chocolateNumberProperty, new Property( numberPickerRange ),
      { centerTop: new Vector2( plate.centerBottom.x, plate.centerBottom.y + 55 ), tandem: options.tandem.createTandem( 'numberPicker' ) } );

    const chocolateScale = 0.04;
    // create chocolate person brought
    const chocolatesArray: Array<Image> = [];
    for ( let i = 0; i < MeanShareAndBalanceConstants.MAX_NUMBER_OF_CHOCOLATES; i++ ) {
      const chocolate = new Image( chocolateBar_png, { scale: chocolateScale } );
      chocolatesArray.push( chocolate );
    }

    const chocolatesVBox = new VBox( {
      children: chocolatesArray,
      spacing: 1.5
    } );

    person.chocolateNumberProperty.link( chocolateNumber => {
      chocolatesArray.forEach( ( chocolate, i ) => {
        chocolate.visibleProperty.value = i < chocolateNumber;
        chocolatesVBox.centerBottom = new Vector2( plate.centerX, plate.centerY );
      } );
    } );

    const chocolatesNode = new Node( {
      children: [ plate, chocolatesVBox ],
      layoutOptions: {
        minContentHeight: ( 265 * chocolateScale ) * 10
      }
    } );

    super( {
      children: [ chocolatesNode, numberPicker ],
      x: person.position.x,
      visibleProperty: person.isActiveProperty
    } );
  }
}

meanShareAndBalance.register( 'TablePlateNode', TablePlateNode );