// Copyright 2024, University of Colorado Boulder
/**
 * Displays the soccer balls and data points for at scene in the balance point screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import SoccerSceneView, { SoccerSceneViewOptions } from '../../../../soccer-common/js/view/SoccerSceneView.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import BalancePointSceneModel from '../model/BalancePointSceneModel.js';
import BalancePointModel from '../model/BalancePointModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Node } from '../../../../scenery/js/imports.js';
import { KickerImageSet } from '../../../../soccer-common/js/view/KickerPortrayal.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import { SoccerBallPhase } from '../../../../soccer-common/js/model/SoccerBallPhase.js';
import Kicker from '../../../../soccer-common/js/model/Kicker.js';


export default class BalancePointSceneView extends SoccerSceneView<BalancePointSceneModel> {

  public constructor(
    model: Pick<BalancePointModel, 'soccerBallsEnabledProperty' | 'groupSortInteractionModel' | 'selectedSceneModelProperty'>,
    sceneModel: BalancePointSceneModel,
    keyboardSortCueNode: Node,
    kickerImageSets: KickerImageSet[][],
    modelViewTransform: ModelViewTransform2,
    tandem: Tandem
  ) {

    const getKickerImageSet = ( kicker: Kicker ) => kickerImageSets[ kicker.initialPlaceInLine ];
    const physicalRange = MeanShareAndBalanceConstants.SOCCER_BALL_RANGE;

    const options: SoccerSceneViewOptions = {
      soccerBallDerivedVisibilityCallback: ( phase: SoccerBallPhase ) =>
        phase !== SoccerBallPhase.INACTIVE && phase !== SoccerBallPhase.READY,
      tandem: tandem
    };

    super( model, sceneModel, keyboardSortCueNode, getKickerImageSet, modelViewTransform, physicalRange, options );
  }
}

meanShareAndBalance.register( 'BalancePointSceneView', BalancePointSceneView );