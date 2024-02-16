// Copyright 2024, University of Colorado Boulder

/**
 * BalancePointModel contains the scene model for the balance point screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SoccerModel, { SoccerModelOptions } from '../../../../soccer-common/js/model/SoccerModel.js';
import BalancePointSceneModel from './BalancePointSceneModel.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import { optionize } from '../../../../phet-core/js/imports.js';
import { BooleanProperty, Property } from '../../../../axon/js/imports.js';
import RegionAndCulturePortrayal from '../../../../joist/js/preferences/RegionAndCulturePortrayal.js';

type SelfOptions = EmptySelfOptions;
type BalancePointModelOptions = SelfOptions & WithRequired<SoccerModelOptions<BalancePointSceneModel>, 'tandem'>;

export default class BalancePointModel extends SoccerModel<BalancePointSceneModel> {
  public readonly isMeanFulcrumFixedProperty: Property<boolean>;
  public readonly areTickMarksVisibleProperty: Property<boolean>;
  public readonly isMeanVisibleProperty: Property<boolean>;

  public constructor( regionAndCulturePortrayalProperty: Property<RegionAndCulturePortrayal>, providedOptions: BalancePointModelOptions ) {

    const options = optionize<BalancePointModelOptions, SelfOptions, SoccerModelOptions<BalancePointSceneModel>>()( {
      phetioState: false
    }, providedOptions );

    const sceneModel = new BalancePointSceneModel(
      regionAndCulturePortrayalProperty,
      {
      tandem: options.tandem.createTandem( 'sceneModel' )
    } );
    super( [ sceneModel ], options );

    this.isMeanFulcrumFixedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isMeanFulcrumFixedProperty' )
    } );
    this.areTickMarksVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'areTickMarksVisibleProperty' )
    } );
    this.isMeanVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isMeanVisibleProperty' )
    } );
  }
}

meanShareAndBalance.register( 'BalancePointModel', BalancePointModel );