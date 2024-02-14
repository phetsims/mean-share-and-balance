// Copyright 2023, University of Colorado Boulder
/**
 * The BalancePointControls is a VBox that lays out and renders the various controls needed for the
 * BalancePointScreen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { NumberSpinner, RectangularRadioButtonGroup, VerticalCheckboxGroup } from '../../../../sun/js/imports.js';
import BalancePointModel from '../model/BalancePointModel.js';
import TriangleNode from '../../../../scenery-phet/js/TriangleNode.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import { Property } from '../../../../axon/js/imports.js';

type SelfOptions = EmptySelfOptions;
type BalancePointControlsOptions = SelfOptions & StrictOmit<VBoxOptions, 'children'> & PickRequired<VBoxOptions, 'tandem'>;
export default class BalancePointControls extends VBox {

  public constructor( model: BalancePointModel, providedOptions: BalancePointControlsOptions ) {

    const meanFulcrumRadioButtonGroup = new RectangularRadioButtonGroup( model.isMeanFulcrumFixedProperty, [
      {
        createNode: () => new TriangleNode( { fill: 'white', stroke: 'purple' } ),
        value: false,
        tandemName: 'movableMeanFulcrumRadioButton'
      },
      {
        createNode: () => new TriangleNode( { fill: 'purple', stroke: 'purple' } ),
        value: true,
        tandemName: 'fixedMeanFulcrumRadioButton'
      }
    ], {
      tandem: providedOptions.tandem.createTandem( 'meanFulcrumRadioButtonGroup' ),
      orientation: 'horizontal'
    } );

    const checkboxGroup = new VerticalCheckboxGroup( [
      {
        createNode: () => new Text( MeanShareAndBalanceStrings.tickMarksStringProperty ),
        property: model.areTickMarksVisibleProperty,
        tandemName: 'tickMarksCheckbox'
      },
      {
        createNode: () => new Text( MeanShareAndBalanceStrings.meanStringProperty ),
        property: model.isMeanVisibleProperty,
        tandemName: 'meanCheckbox'
      }
    ], {
      tandem: providedOptions.tandem.createTandem( 'checkboxGroup' )
    } );

    const infoButton = new InfoButton( {
      iconFill: '#286AA1',
      tandem: providedOptions.tandem.createTandem( 'infoButton' )
    } );

    const rangeProperty = new Property( MeanShareAndBalanceConstants.NUMBER_SPINNER_KICK_RANGE );
    const numberSpinner = new NumberSpinner(
      model.selectedSceneModelProperty.value.numberOfDataPointsProperty,
      rangeProperty,
      {
        arrowsPosition: 'leftRight',
        tandem: providedOptions.tandem.createTandem( 'numberSpinner' )
      }
    );

    super( {
      children: [
        meanFulcrumRadioButtonGroup,
        checkboxGroup,
        infoButton,
        numberSpinner
      ],
      spacing: 20,
      align: 'left',
      preferredWidth: 180
    } );
  }
}

meanShareAndBalance.register( 'BalancePointControls', BalancePointControls );