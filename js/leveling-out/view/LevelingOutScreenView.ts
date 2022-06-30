// Copyright 2022, University of Colorado Boulder

/**
 * TODO
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import MeanShareAndBalanceScreenView, { MeanShareAndBalanceScreenViewOptions } from '../../common/view/MeanShareAndBalanceScreenView.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import LevelingOutModel from '../model/LevelingOutModel.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import { Color, Rectangle, Text } from '../../../../scenery/js/imports.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import Property from '../../../../axon/js/Property.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';

type SelfOptions = EmptyObjectType;

type LevelingOutScreenViewOptions = SelfOptions & MeanShareAndBalanceScreenViewOptions;

export default class LevelingOutScreenView extends MeanShareAndBalanceScreenView {

  public constructor( levelingOutModel: LevelingOutModel, providedOptions?: LevelingOutScreenViewOptions ) {

    const options = optionize<LevelingOutScreenViewOptions, SelfOptions, MeanShareAndBalanceScreenViewOptions>()( {}, providedOptions );

    super( levelingOutModel, options );

    MeanShareAndBalanceColors.questionBarColorProperty.set( new Color( '#F97A69' ) );

    const meanNode = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CHOCOLATE_WIDTH, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT,
      { fill: MeanShareAndBalanceColors.chocolateColorProperty } );

    const meanAccordionBox = new AccordionBox( meanNode, {
      titleNode: new Text( 'Mean', { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } ),
      expandedProperty: levelingOutModel.isMeanAccordionExpandedProperty,
      tandem: options.tandem.createTandem( 'meanAccordionBox' )
    } );

    const numberOfPeopleText = new Text( 'Number of People', { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } );

    const numberOfPeopleNumberSpinner = new NumberSpinner(
      levelingOutModel.numberOfPeopleProperty,
      new Property( levelingOutModel.numberOfPeopleRange ), {
        arrowsPosition: 'leftRight',
        tandem: options.tandem.createTandem( 'numberOfPeopleNumberSpinner' )
      } );


    this.controlsVBox.addChild( meanAccordionBox );
    this.numberSpinnerVBox.addChild( numberOfPeopleText );
    this.numberSpinnerVBox.addChild( numberOfPeopleNumberSpinner );
  }

}

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );