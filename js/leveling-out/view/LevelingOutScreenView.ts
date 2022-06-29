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

type SelfOptions = EmptyObjectType;

type LevelingOutScreenViewOptions = SelfOptions & MeanShareAndBalanceScreenViewOptions;

export default class LevelingOutScreenView extends MeanShareAndBalanceScreenView {

  public constructor( levelingOutModel: LevelingOutModel, providedOptions?: LevelingOutScreenViewOptions ) {

    const options = optionize<LevelingOutScreenViewOptions, SelfOptions, MeanShareAndBalanceScreenViewOptions>()( {

    }, providedOptions );

    super( levelingOutModel, options );
  }

}

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );