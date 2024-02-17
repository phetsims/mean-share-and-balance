// Copyright 2024, University of Colorado Boulder
/**
 * Displays the soccer balls and data points for at scene in the balance point screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import SoccerSceneView from '../../../../soccer-common/js/view/SoccerSceneView.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import BalancePointSceneModel from '../model/BalancePointSceneModel.js';
import BalancePointModel from '../model/BalancePointModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Node } from '../../../../scenery/js/imports.js';
import { KickerImageSet } from '../../../../soccer-common/js/view/KickerPortrayal.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';


export default class BalancePointSceneView extends SoccerSceneView<BalancePointSceneModel> {

  public constructor(
    model: Pick<BalancePointModel, 'soccerBallsEnabledProperty' | 'groupSortInteractionModel' | 'selectedSceneModelProperty'>,
    sceneModel: BalancePointSceneModel,
    kickerImageSet: KickerImageSet[],
    modelViewTransform: ModelViewTransform2,
    tandem: Tandem
  ) {

    const keyboardSortCueNode = new Node();
    const getKickerImageSet = () => kickerImageSet;
    const physicalRange = MeanShareAndBalanceConstants.SOCCER_BALL_RANGE;

   super( model, sceneModel, keyboardSortCueNode, getKickerImageSet, modelViewTransform, physicalRange, tandem );
  }
}

meanShareAndBalance.register( 'BalancePointSceneView', BalancePointSceneView );