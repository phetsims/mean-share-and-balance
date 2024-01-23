// Copyright 2023, University of Colorado Boulder

/**
 * A Notepad with a text readout of the total number of items to measure by (candy bars, cookies, or meters) at the top.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { AlignBox, Node, Text } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import NotepadNode from './NotepadNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

export default class NotepadWithReadoutNode extends Node {

  public constructor(
    totalProperty: TReadOnlyProperty<number>,
    patternStringProperty: LocalizedStringProperty,
    singularStringProperty: LocalizedStringProperty,
    pluralStringProperty: LocalizedStringProperty
  ) {
    const notepad = new NotepadNode();
    const measurementStringProperty = new DerivedProperty( [ totalProperty,
        singularStringProperty,
        pluralStringProperty ],
      ( total, singular, plural ) => total === 1 ? singular : plural );
    const totalCandyBarsPatternStringProperty = new PatternStringProperty( patternStringProperty, {
      total: totalProperty,
      measurement: measurementStringProperty
    } );

    const totalCandyBarsText = new Text( totalCandyBarsPatternStringProperty, {
      font: new PhetFont( 16 ),
      maxWidth: 200,
      fill: 'black'
    } );

    const totalCandyBarsAlignBox = new AlignBox( totalCandyBarsText, {
      alignBounds: notepad.bounds,
      xAlign: 'center',
      yAlign: 'top',
      yMargin: 65
    } );
    super( {
      children: [ notepad, totalCandyBarsAlignBox ]
    } );
  }
}

meanShareAndBalance.register( 'NotepadWithReadoutNode', NotepadWithReadoutNode );