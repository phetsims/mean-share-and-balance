// Copyright 2022, University of Colorado Boulder

/**
 * TODO: describe file
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { AlignBox, Circle, GridBox, Image, Node, Path, VBox } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import smileSolidShape from '../../../../sherpa/js/fontawesome-5/smileSolidShape.js';
import Person from '../model/Person.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import chocolateBar_png from '../../../images/chocolateBar_png.js';

export default class PersonNode extends GridBox {

  public constructor( person: Person ) {
    const personImage = new Path( smileSolidShape, {
      fill: 'black', scale: 0.1, layoutOptions: {
        column: 1,
        row: 0
      }
    } );

    const plateHeight = 25;

    const plate = new Circle( plateHeight, {
      fill: 'white',
      stroke: 'black'
    } );

    const numberSpinnerRange = new Range( MeanShareAndBalanceConstants.MIN_NUMBER_OF_CHOCOLATES, MeanShareAndBalanceConstants.MAX_NUMBER_OF_CHOCOLATES );
    const numberSpinner = new NumberPicker( person.chocolateNumberProperty, new Property( numberSpinnerRange ) );
    const numberSpinnerAlignBox = new AlignBox( numberSpinner, { layoutOptions: { column: 0, row: 2 } } );

    const chocolateScale = 0.05;
    // create chocolate person brought
    const chocolatesArray: Array<Image> = [];
    for ( let i = 0; i < MeanShareAndBalanceConstants.MAX_NUMBER_OF_CHOCOLATES; i++ ) {
      const chocolate = new Image( chocolateBar_png, { scale: chocolateScale } );
      chocolatesArray.push( chocolate );
    }

    person.chocolateNumberProperty.link( chocolateNumber => {
      chocolatesArray.forEach( ( chocolate, i ) => {
        chocolate.visibleProperty.value = i < chocolateNumber;
      } );
    } );

    const chocolatesVBox = new VBox( {
      children: chocolatesArray,
      centerBottom: plate.center
    } );

    const chocolatesNode = new Node( {
      children: [ plate, chocolatesVBox ],
      layoutOptions: {
        column: 0,
        row: 1,
        align: 'bottom',
        minContentHeight: ( 265 * chocolateScale ) * 10 + plateHeight
      }
    } );

    super( {
      children: [ personImage, chocolatesNode, numberSpinnerAlignBox ],
      x: person.position.x,
      centerY: person.position.y
    } );
  }
}

meanShareAndBalance.register( 'PersonNode', PersonNode );