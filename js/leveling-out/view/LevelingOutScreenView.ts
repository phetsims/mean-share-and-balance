// Copyright 2022, University of Colorado Boulder

/**
 * TODO
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceScreenView, { MeanShareAndBalanceScreenViewOptions } from '../../common/view/MeanShareAndBalanceScreenView.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import LevelingOutModel from '../model/LevelingOutModel.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import { Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import Property from '../../../../axon/js/Property.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import meanShareAndBalanceStrings from '../../meanShareAndBalanceStrings.js';
import ChocolateBarRectangle from './ChocolateBarRectangle.js';

type SelfOptions = EmptySelfOptions;

type LevelingOutScreenViewOptions = SelfOptions & MeanShareAndBalanceScreenViewOptions;

export default class LevelingOutScreenView extends MeanShareAndBalanceScreenView {

  public constructor( model: LevelingOutModel, providedOptions?: LevelingOutScreenViewOptions ) {

    const options = optionize<LevelingOutScreenViewOptions, SelfOptions, MeanShareAndBalanceScreenViewOptions>()( {}, providedOptions );
    super( model, meanShareAndBalanceStrings.levelingOutQuestion, MeanShareAndBalanceColors.levelingOutQuestionBarColorProperty, options );

    const meanNode = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CHOCOLATE_WIDTH, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT,
      { fill: MeanShareAndBalanceColors.chocolateColorProperty } );

    const meanAccordionBox = new AccordionBox( meanNode, {
      titleNode: new Text( 'Mean', { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } ),
      expandedProperty: model.isMeanAccordionExpandedProperty,
      tandem: options.tandem.createTandem( 'meanAccordionBox' )
    } );

    const numberOfPeopleText = new Text( 'Number of People', { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } );

    const numberOfPeopleNumberSpinner = new NumberSpinner(
      model.numberOfPeopleProperty,
      new Property( model.numberOfPeopleRange ), {
        arrowsPosition: 'leftRight',
        tandem: options.tandem.createTandem( 'numberOfPeopleNumberSpinner' )
      } );

    const plateLayerNode = new Node( { x: 50, y: 100, children: [ new ChocolateBarRectangle() ] } );


    this.controlsVBox.addChild( meanAccordionBox );
    this.numberSpinnerVBox.addChild( numberOfPeopleText );
    this.numberSpinnerVBox.addChild( numberOfPeopleNumberSpinner );
    this.addChild( plateLayerNode );
  }

}

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );