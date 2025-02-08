// Copyright 2024-2025, University of Colorado Boulder

/**
 * Displays the soccer balls and data points for at scene in the balance point screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import { SoccerBallPhase } from '../../../../soccer-common/js/model/SoccerBallPhase.js';
import KickerImageSets from '../../../../soccer-common/js/view/KickerImageSets.js';
import SoccerSceneView, { SoccerSceneViewOptions } from '../../../../soccer-common/js/view/SoccerSceneView.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import BalancePointModel from '../model/BalancePointModel.js';
import BalancePointSceneModel from '../model/BalancePointSceneModel.js';


export default class BalancePointSceneView extends SoccerSceneView<BalancePointSceneModel> {

  public constructor(
    model: Pick<BalancePointModel, 'soccerBallsEnabledProperty' | 'groupSortInteractionModel' | 'selectedSceneModelProperty'>,
    sceneModel: BalancePointSceneModel,
    keyboardSortCueNode: Node,
    modelViewTransform: ModelViewTransform2,
    tandem: Tandem
  ) {

    const physicalRange = MeanShareAndBalanceConstants.SOCCER_BALL_RANGE;

    const options: SoccerSceneViewOptions = {
      soccerBallDerivedVisibilityCallback: ( phase: SoccerBallPhase ) =>
        phase !== SoccerBallPhase.INACTIVE && phase !== SoccerBallPhase.READY,
      tandem: tandem
    };

    super( model, sceneModel, keyboardSortCueNode, modelViewTransform, physicalRange, KickerImageSets, options );
  }
}

meanShareAndBalance.register( 'BalancePointSceneView', BalancePointSceneView );