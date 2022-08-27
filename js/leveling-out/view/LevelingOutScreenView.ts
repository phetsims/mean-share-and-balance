// Copyright 2022, University of Colorado Boulder

/**
 * TODO
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceScreenView, { MeanShareAndBalanceScreenViewOptions } from '../../common/view/MeanShareAndBalanceScreenView.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import LevelingOutModel from '../model/LevelingOutModel.js';
import { AlignBox, Node } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import meanShareAndBalanceStrings from '../../meanShareAndBalanceStrings.js';
import ChocolateBarsContainerNode from './ChocolateBarsContainerNode.js';
import Chocolate from '../model/Chocolate.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LevelingOutControlPanel from './LevelingOutControlPanel.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';

type SelfOptions = EmptySelfOptions;

type LevelingOutScreenViewOptions = SelfOptions & MeanShareAndBalanceScreenViewOptions;

export default class LevelingOutScreenView extends MeanShareAndBalanceScreenView {

  public constructor( model: LevelingOutModel, providedOptions: LevelingOutScreenViewOptions ) {

    const options = providedOptions;

    const controlPanel = new LevelingOutControlPanel( model.isMeanAccordionExpandedProperty, model.numberOfPeopleProperty,
      { minContentWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + 25, spacing: 20, tandem: options.tandem.createTandem( 'controlPanel' ) } );

    const plateLayerNode = new Node( {
      x: 50,
      y: 100,
      children: [ new ChocolateBarsContainerNode( new Chocolate( { x: 50, y: 100, tandem: Tandem.OPT_OUT } ) ) ]
    } );

    const combinedOptions = combineOptions<ScreenViewOptions>( { children: [ plateLayerNode ] }, options );

    super( model, meanShareAndBalanceStrings.levelingOutQuestionProperty, MeanShareAndBalanceColors.levelingOutQuestionBarColorProperty, combinedOptions );

    const playAreaBounds = new Bounds2( this.layoutBounds.minX, this.layoutBounds.minY + this.questionBar.height,
      this.layoutBounds.maxX, this.layoutBounds.maxY );

    const controlsAlignBox = new AlignBox( controlPanel, {
      alignBounds: playAreaBounds,
      xAlign: 'right',
      yAlign: 'top',
      rightMargin: MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN,
      topMargin: MeanShareAndBalanceConstants.CONTROLS_VERTICAL_MARGIN
    } );

    this.addChild( controlsAlignBox );
  }

}

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );