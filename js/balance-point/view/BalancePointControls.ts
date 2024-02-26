// Copyright 2024, University of Colorado Boulder
/**
 * The BalancePointControls is a VBox that lays out and renders the various controls needed for the
 * BalancePointScreen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { RectangularRadioButtonGroup, VerticalCheckboxGroup } from '../../../../sun/js/imports.js';
import BalancePointModel from '../model/BalancePointModel.js';
import TriangleNode from '../../../../scenery-phet/js/TriangleNode.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import NumberSpinnerVBox from '../../common/view/NumberSpinnerVBox.js';
import InfoBooleanStickyToggleButton from '../../common/view/InfoBooleanStickyToggleButton.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';

type SelfOptions = EmptySelfOptions;
type BalancePointControlsOptions = SelfOptions & StrictOmit<VBoxOptions, 'children'> & PickRequired<VBoxOptions, 'tandem'>;

export default class BalancePointControls extends VBox {

  public constructor( model: BalancePointModel, providedOptions: BalancePointControlsOptions ) {

    const meanFulcrumRadioButtonGroup = new RectangularRadioButtonGroup( model.isMeanFulcrumFixedProperty, [
      {
        createNode: () => new TriangleNode( {
          triangleHeight: 24,
          triangleWidth: 28,
          fill: 'white',
          stroke: MeanShareAndBalanceColors.meanColorProperty
        } ),
        value: false,
        tandemName: 'movableMeanFulcrumRadioButton'
      },
      {
        createNode: () => new TriangleNode( {
          triangleHeight: 24,
          triangleWidth: 28,
          fill: MeanShareAndBalanceColors.meanColorProperty,
          stroke: MeanShareAndBalanceColors.meanColorProperty
        } ),
        value: true,
        tandemName: 'fixedMeanFulcrumRadioButton'
      }
    ], {
      tandem: providedOptions.tandem.createTandem( 'meanFulcrumRadioButtonGroup' ),
      orientation: 'horizontal',
      radioButtonOptions: {
        baseColor: 'white'
      }
    } );

    const checkboxGroup = new VerticalCheckboxGroup( [
      {
        createNode: () => new Text( MeanShareAndBalanceStrings.tickMarksStringProperty, {
          fontSize: MeanShareAndBalanceConstants.CHECKBOX_FONT_SIZE,
          maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
        } ),
        property: model.areTickMarksVisibleProperty,
        tandemName: 'tickMarksCheckbox'
      },
      {
        createNode: () => new Text( MeanShareAndBalanceStrings.meanStringProperty, {
          fontSize: MeanShareAndBalanceConstants.CHECKBOX_FONT_SIZE,
          maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
        } ),
        property: model.isMeanVisibleProperty,
        tandemName: 'meanCheckbox'
      }
    ], {
      checkboxOptions: MeanShareAndBalanceConstants.CHECKBOX_OPTIONS,
      tandem: providedOptions.tandem.createTandem( 'checkboxGroup' )
    } );

    const infoButton = new InfoBooleanStickyToggleButton(
      model.isMeanInfoDialogVisibleProperty,
      providedOptions.tandem.createTandem( 'infoButton' ),
      {
        layoutOptions: {
          minContentHeight: 140
        }
      }
    );

    super( {
      children: [
        meanFulcrumRadioButtonGroup,
        checkboxGroup,
        infoButton
      ],
      spacing: 20,
      align: 'left',
      preferredWidth: MeanShareAndBalanceConstants.CONTROLS_PREFERRED_WIDTH
    } );

    const numberOfDataPointsProperty = model.selectedSceneModelProperty.value.targetNumberOfBallsProperty;
    const numberSpinner = new NumberSpinnerVBox(
      numberOfDataPointsProperty,
      MeanShareAndBalanceConstants.NUMBER_SPINNER_KICK_RANGE,
      MeanShareAndBalanceStrings.numberOfBallsStringProperty,
      {
        numberSpinnerOptions: {
          decrementFunction: value => {
            this.interruptSubtreeInput();
            return value - 1;
          }
        },
        tandem: providedOptions.tandem.createTandem( 'numberSpinner' )
      }
    );

    this.addChild( numberSpinner );
  }
}

meanShareAndBalance.register( 'BalancePointControls', BalancePointControls );