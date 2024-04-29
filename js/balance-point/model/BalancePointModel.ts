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

type SelfOptions = EmptySelfOptions;
type BalancePointModelOptions = SelfOptions & WithRequired<SoccerModelOptions<BalancePointSceneModel>, 'tandem'>;

export default class BalancePointModel extends SoccerModel<BalancePointSceneModel> {
  public readonly isMeanFulcrumFixedProperty: Property<boolean>;
  public readonly areTickMarksVisibleProperty: Property<boolean>;
  public readonly isMeanInfoDialogVisibleProperty: Property<boolean>;
  public readonly isTotalVisibleProperty: Property<boolean>;

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

    const isMeanFulcrumFixedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isMeanFulcrumFixedProperty' )
    } );
    const sceneModel = new BalancePointSceneModel( isMeanFulcrumFixedProperty, {
      tandem: options.tandem.createTandem( 'sceneModel' )
    } );

    super( [ sceneModel ], options );

    this.isMeanFulcrumFixedProperty = isMeanFulcrumFixedProperty;
    this.fulcrumWasDraggedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'fulcrumWasDraggedProperty' ),
      phetioReadOnly: true
    } );
    this.areTickMarksVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'areTickMarksVisibleProperty' )
    } );
    this.isMeanInfoDialogVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isMeanInfoDialogVisibleProperty' )
    } );

    this.isTotalVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isTotalVisibleProperty' )
    } );

    sceneModel.targetNumberOfBallsProperty.link( ( ) => {
      this.groupSortInteractionModel.updateSelectedGroupItem( sceneModel );
    } );
  }

  public override reset(): void {
    super.reset();
    this.isMeanFulcrumFixedProperty.reset();
    this.isTotalVisibleProperty.reset();
    this.areTickMarksVisibleProperty.reset();
    this.isMeanInfoDialogVisibleProperty.reset();
    this.fulcrumWasDraggedProperty.reset();
  }
}

meanShareAndBalance.register( 'BalancePointModel', BalancePointModel );