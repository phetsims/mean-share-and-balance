// Copyright 2024, University of Colorado Boulder

/**
 * MeanShareAndBalanceControls is the base class for all controls across all four screens in Mean Share and Balance.
 * All screens have a number spinner that should be displayed in the same location on each screen. Controls are aligned
 * horizontally.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { AlignGroup, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import NumberSpinnerVBox from './NumberSpinnerVBox.js';
import Property from '../../../../axon/js/Property.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { NumberSpinnerOptions } from '../../../../sun/js/NumberSpinner.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  numberSpinnerOptions?: NumberSpinnerOptions;
  controlsPDOMOrder: Node[];
  isSoccerContext?: boolean;
};

export type MeanShareAndBalanceControlsOptions = SelfOptions & StrictOmit<NodeOptions, 'children'> & PickRequired<NodeOptions, 'tandem'>;
export default class MeanShareAndBalanceControls extends Node {

  protected readonly controlsAlignGroup: AlignGroup;
  public readonly controlsPDOMOrder: Node[];
  public readonly numberSpinner: Node;

  public constructor(
    controlsVBox: Node,
    numberOfObjectsProperty: Property<number>,
    numberOfObjectsStringProperty: LocalizedStringProperty,
    providedOptions: MeanShareAndBalanceControlsOptions
  ) {

    const options = optionize<MeanShareAndBalanceControlsOptions, SelfOptions, NodeOptions>()( {
      isSoccerContext: false,
      numberSpinnerOptions: {}
    }, providedOptions );
    const controlsAlignGroup = new AlignGroup( { matchVertical: false } );

    const vBoxAlignBox = controlsAlignGroup.createBox( controlsVBox, { xAlign: 'left' } );

    super( { children: [ vBoxAlignBox ] } );

    const numberSpinnerOptions = combineOptions<NumberSpinnerOptions>( {
      decrementFunction: value => {
        this.interruptSubtreeInput();
        return value - 1;
      }
    }, options.numberSpinnerOptions );
    const numberSpinnerVBoxOptions = {
      tandem: options.tandem,
      numberSpinnerOptions: numberSpinnerOptions
    };

    const range = options.isSoccerContext ? MeanShareAndBalanceConstants.NUMBER_SPINNER_KICK_RANGE :
                  MeanShareAndBalanceConstants.NUMBER_SPINNER_CONTAINERS_RANGE;
    const numberSpinner = new NumberSpinnerVBox(
      numberOfObjectsProperty,
      range,
      numberOfObjectsStringProperty,
      numberSpinnerVBoxOptions );

    this.numberSpinner = controlsAlignGroup.createBox( numberSpinner, {
      top: 350,
      xAlign: 'left'
    } );
    this.addChild( this.numberSpinner );

    this.controlsAlignGroup = controlsAlignGroup;
    this.controlsPDOMOrder = options.controlsPDOMOrder;
    this.numberSpinner = numberSpinner;
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceControls', MeanShareAndBalanceControls );