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
import MeanShareAndBalanceModel from '../common/model/MeanShareAndBalanceModel.js';
import optionize from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import { HBox, VBox } from '../../../scenery/js/imports.js';
import { Text } from '../../../scenery/js/imports.js';

type SelfOptions = {

}

type MeanShareAndBalanceScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem'>;

class LevelingOutScreenView extends MeanShareAndBalanceScreenView {
  constructor( model: MeanShareAndBalanceModel, providedOptions: MeanShareAndBalanceScreenViewOptions ) {

    const options = optionize<MeanShareAndBalanceScreenViewOptions, SelfOptions, ScreenViewOptions>( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions );

    super( model, options );

    const predictMeanString = new Text( 'Predict Mean' );
    const showMeanString = new Text( 'Show Mean' );
    const tickMarksString = new Text( 'Tick Marks' );

    const levelingOutOptionsCheckboxGroup = new VerticalCheckboxGroup( [ {
      node: new HBox( { children: [ predictMeanString ] } ),
      property: model.predictMean
      },
      {
        node: new HBox( { children: [ showMeanString ] } ),
        property: model.showMean
      },
      {
        node: new HBox( { children: [ tickMarksString ] } ),
        property: model.tickMarks
      } ]
    );

    const levelingOutOptionsVBox = new VBox( {
      children: [
        levelingOutOptionsCheckboxGroup
      ],
      align: 'left'
    } );

    this.addChild( levelingOutOptionsVBox );
  }
}

export default LevelingOutScreenView;