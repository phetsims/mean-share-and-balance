// Copyright 2024, University of Colorado Boulder

/**
 * BalancePointModel contains the scene model for the balance point screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SoccerModel, { SoccerModelOptions } from '../../../../soccer-common/js/model/SoccerModel.js';
import BalancePointSceneModel from './BalancePointSceneModel.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import SoccerCommonGroupSortInteractionModel from '../../../../soccer-common/js/model/SoccerCommonGroupSortInteractionModel.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';

type SelfOptions = EmptySelfOptions;
type BalancePointModelOptions = SelfOptions & WithRequired<SoccerModelOptions<BalancePointSceneModel>, 'tandem'>;

export default class BalancePointModel extends SoccerModel<BalancePointSceneModel> {
  public readonly meanFulcrumFixedProperty: Property<boolean>;
  public readonly tickMarksVisibleProperty: Property<boolean>;
  public readonly meanInfoPanelVisibleProperty: Property<boolean>;
  public readonly totalVisibleProperty: Property<boolean>;

  // A Property that tracks whether the fulcrum has been dragged.
  public readonly fulcrumWasDraggedProperty: Property<boolean>;

  public constructor( providedOptions: BalancePointModelOptions ) {

    const options = optionize<BalancePointModelOptions, SelfOptions, SoccerModelOptions<BalancePointSceneModel>>()( {
      createGroupSortInteractionModel: ( soccerModel, tandem ) => {
        return new SoccerCommonGroupSortInteractionModel(
          soccerModel.selectedSceneModelProperty,
          soccerModel.selectedSceneStackedSoccerBallCountProperty,
          soccerModel.selectedSceneMaxKicksProperty,
          soccerModel.sceneModels, {
            getGroupItemValue: soccerBall => soccerBall.valueProperty.value,
            enabledProperty: soccerModel.soccerBallsEnabledProperty,
            tandem: tandem
          }
        );
      },
      phetioState: false
    }, providedOptions );

    const meanFulcrumFixedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'meanFulcrumFixedProperty' )
    } );

    // Allows PhET-iO clients to modify the max number of kicks.
    const maxKicksProperty = new NumberProperty( MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS, {
      range: MeanShareAndBalanceConstants.NUMBER_OF_KICKS_RANGE_PROPERTY.value,
      tandem: options.tandem.createTandem( 'maxKicksProperty' )
    } );

    const sceneModel = new BalancePointSceneModel( meanFulcrumFixedProperty, maxKicksProperty, {
      tandem: options.tandem.createTandem( 'sceneModel' )
    } );

    super( [ sceneModel ], options );

    this.meanFulcrumFixedProperty = meanFulcrumFixedProperty;
    this.fulcrumWasDraggedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'fulcrumWasDraggedProperty' ),
      phetioReadOnly: true
    } );
    this.tickMarksVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'tickMarksVisibleProperty' )
    } );
    this.meanInfoPanelVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'meanInfoPanelVisibleProperty' )
    } );

    this.totalVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'totalVisibleProperty' )
    } );

    sceneModel.targetNumberOfBallsProperty.link( () => {
      this.groupSortInteractionModel.updateSelectedGroupItem( sceneModel );
    } );
  }

  public override reset(): void {
    super.reset();
    this.meanFulcrumFixedProperty.reset();
    this.totalVisibleProperty.reset();
    this.tickMarksVisibleProperty.reset();
    this.meanInfoPanelVisibleProperty.reset();
    this.fulcrumWasDraggedProperty.reset();
  }
}

meanShareAndBalance.register( 'BalancePointModel', BalancePointModel );