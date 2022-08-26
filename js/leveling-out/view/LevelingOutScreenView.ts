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
import { GridBox, Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import Property from '../../../../axon/js/Property.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import meanShareAndBalanceStrings from '../../meanShareAndBalanceStrings.js';
import ChocolateBarsContainerNode from './ChocolateBarsContainerNode.js';
import Chocolate from '../model/Chocolate.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = EmptySelfOptions;

type LevelingOutScreenViewOptions = SelfOptions & MeanShareAndBalanceScreenViewOptions;

export default class LevelingOutScreenView extends MeanShareAndBalanceScreenView {

  public constructor( model: LevelingOutModel, providedOptions?: LevelingOutScreenViewOptions ) {

    const options = optionize<LevelingOutScreenViewOptions, SelfOptions, MeanShareAndBalanceScreenViewOptions>()( {}, providedOptions );
    super( model, meanShareAndBalanceStrings.levelingOutQuestionProperty, MeanShareAndBalanceColors.levelingOutQuestionBarColorProperty, model.numberOfPeopleProperty, options );

    const meanNode = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CHOCOLATE_WIDTH, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT,
      { fill: MeanShareAndBalanceColors.chocolateColorProperty } );

    const meanAccordionBox = new AccordionBox( meanNode, {
      titleNode: new Text( 'Mean', { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } ),
      expandedProperty: model.isMeanAccordionExpandedProperty,

      // phet-io
      tandem: options.tandem.createTandem( 'meanAccordionBox' )
    } );

    const numberOfPeopleText = new Text( 'Number of People', { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } );

    const numberOfPeopleNumberSpinner = new NumberSpinner(
      model.numberOfPeopleProperty,
      new Property( model.numberOfPeopleRange ), {
        arrowsPosition: 'leftRight',

        // phet-io
        tandem: options.tandem.createTandem( 'numberOfPeopleNumberSpinner' )
      } );

    const controlsGridBox = new GridBox( {
      children: [
        meanAccordionBox,
        numberOfPeopleText,
        numberOfPeopleNumberSpinner
      ],
      minContentWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + 25,
      spacing: 20
    } );

    const plateLayerNode = new Node( {
      x: 50,
      y: 100,
      children: [ new ChocolateBarsContainerNode( new Chocolate( { x: 50, y: 100, tandem: Tandem.OPT_OUT } ) ) ]
    } );

    this.addChild( plateLayerNode );
    this.addChild( controlsGridBox );
  }

}

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );