// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../joist/js/ScreenView.js';
import MeanShareAndBalanceScreenView from '../common/view/MeanShareAndBalanceScreenView.js';
import VerticalCheckboxGroup from '../../../sun/js/VerticalCheckboxGroup.js';
import optionize from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import { HBox, VBox } from '../../../scenery/js/imports.js';
import { Text } from '../../../scenery/js/imports.js';
import NumberPicker from '../../../scenery-phet/js/NumberPicker.js';
import LevelingOutModel from './LevelingOutModel.js';
import meanShareAndBalanceStrings from '../meanShareAndBalanceStrings.js';

type SelfOptions = {

}

type MeanShareAndBalanceScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem'>;

class LevelingOutScreenView extends MeanShareAndBalanceScreenView {
  constructor( model: LevelingOutModel, providedOptions: MeanShareAndBalanceScreenViewOptions ) {

    const options = optionize<MeanShareAndBalanceScreenViewOptions, SelfOptions, ScreenViewOptions>( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions );

    super( model, options );

    // REVIEW: Change suffix to Text instead of String
    const predictMeanString = new Text( meanShareAndBalanceStrings.predictMean );
    const showMeanString = new Text( meanShareAndBalanceStrings.showMean );
    const tickMarksString = new Text( meanShareAndBalanceStrings.tickMarks );
    const numberOfCupsString = new Text( meanShareAndBalanceStrings.numberOfCups );

    const levelingOutOptionsCheckboxGroup = new VerticalCheckboxGroup( [ {
      node: new HBox( { children: [ predictMeanString ] } ),
      property: model.predictMeanProperty
      },
      {
        node: new HBox( { children: [ showMeanString ] } ),
        property: model.showMeanProperty
      },
      {
        node: new HBox( { children: [ tickMarksString ] } ),
        property: model.tickMarksProperty
      } ]
    );

    // REVIEW: Name variable numberOfCupsNumberPicker
    const levelingOutNumberPicker = new NumberPicker(
      model.initialValueProperty, model.levelingOutRangeProperty,
      {
        yMargin: 10,
        xMargin: 10,
        arrowHeight: 10
      }
    );

    // REVIEW: Unnecessary VBox, delete it and just use levelingOutOptionsCheckboxGroup directly
    const levelingOutOptionsVBox = new VBox( {
      children: [
        levelingOutOptionsCheckboxGroup
      ],
      align: 'left'

    } );

    const levelingOutNumberPickerVBox = new VBox( {
      children: [
        numberOfCupsString,
        levelingOutNumberPicker
      ],
      align: 'center',
      right: this.layoutBounds.right
    } );

    this.addChild( levelingOutOptionsVBox );
    this.addChild( levelingOutNumberPickerVBox );
  }

}

export default LevelingOutScreenView;