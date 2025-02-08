// Copyright 2024-2025, University of Colorado Boulder

/**
 * MeanShareAndBalanceControls is the base class for all controls across all four screens in Mean Share and Balance.
 * All screens have a number spinner that should be displayed in the same location on each screen. Controls are aligned
 * horizontally.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import LocalizedStringProperty from '../../../../chipper/js/browser/LocalizedStringProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import { NumberSpinnerOptions } from '../../../../sun/js/NumberSpinner.js';
import sharedSoundPlayers from '../../../../tambo/js/sharedSoundPlayers.js';
import TSoundPlayer from '../../../../tambo/js/TSoundPlayer.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import MeanShareAndBalanceColors from '../MeanShareAndBalanceColors.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import NumberSpinnerControl from './NumberSpinnerControl.js';

type SelfOptions = {
  numberSpinnerOptions: NumberSpinnerOptions;

  // Define the traversal order of controls.
  controlsPDOMOrder: Node[];

  // When provided the info button will be displayed and will toggle the visibility of the info panel.
  infoPanelVisibleProperty?: Property<boolean> | null;

  // Additional work that is done when the info button is pressed.
  onInfoButtonPressed?: () => void;
};

export type MeanShareAndBalanceControlsOptions =
  SelfOptions
  & StrictOmit<NodeOptions, 'children'>
  & PickRequired<NodeOptions, 'tandem'>;
export default class MeanShareAndBalanceControls extends Node {

  protected readonly controlsAlignGroup: AlignGroup;
  public readonly controlsPDOMOrder: Node[];
  public readonly numberSpinner: Node;

  // Button that opens the info panel. Public for focus management.
  public readonly infoButton: InfoButton | null = null;

  public constructor(
    controlsVBox: Node,
    numberOfObjectsProperty: Property<number>,
    numberOfObjectsRangeProperty: Property<Range>,
    numberOfObjectsStringProperty: LocalizedStringProperty,
    notepadNodeBottom: number,
    providedOptions: MeanShareAndBalanceControlsOptions
  ) {

    const options = optionize<MeanShareAndBalanceControlsOptions, SelfOptions, NodeOptions>()( {
      infoPanelVisibleProperty: null,
      onInfoButtonPressed: _.noop,
      isDisposable: false
    }, providedOptions );
    const controlsAlignGroup = new AlignGroup( { matchVertical: false } );

    const vBoxAlignBox = controlsAlignGroup.createBox( controlsVBox, { xAlign: 'left' } );

    const superOptions = combineOptions<NodeOptions>( {
      children: [ vBoxAlignBox ],
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, options );
    super( superOptions );

    if ( options.infoPanelVisibleProperty ) {

      // We need to account for the vertical margin above the controls AlignBox, as well as the height of the question bar
      // to properly align the info button to the bottom of the notepad.
      const infoButtonBottom = notepadNodeBottom - MeanShareAndBalanceConstants.CONTROLS_VERTICAL_MARGIN
                               - MeanShareAndBalanceConstants.QUESTION_BAR_HEIGHT;
      const infoButtonSoundPlayer = new InfoButtonSoundPlayer( options.infoPanelVisibleProperty );
      this.infoButton = new InfoButton( {
        listener: () => {
          options.infoPanelVisibleProperty!.value = !options.infoPanelVisibleProperty!.value;
          options.onInfoButtonPressed();
        },
        bottom: infoButtonBottom,
        scale: 0.6,
        left: vBoxAlignBox.left,
        iconFill: MeanShareAndBalanceColors.infoIconFillColorProperty,
        soundPlayer: infoButtonSoundPlayer,
        accessibleName: MeanShareAndBalanceStrings.a11y.infoStringProperty,
        tandem: options.tandem.createTandem( 'infoButton' )
      } );
      this.addChild( this.infoButton );
      options.controlsPDOMOrder.push( this.infoButton );
    }

    const numberSpinnerVBoxOptions = {
      tandem: options.tandem.createTandem( 'numberSpinnerControl' ),
      numberSpinnerOptions: options.numberSpinnerOptions
    };

    const numberSpinner = new NumberSpinnerControl(
      numberOfObjectsProperty,
      numberOfObjectsRangeProperty,
      numberOfObjectsStringProperty,
      numberSpinnerVBoxOptions
    );

    this.numberSpinner = controlsAlignGroup.createBox( numberSpinner, {
      top: 350, // empirically determined to appear next to the "real world" representation
      xAlign: 'left'
    } );
    this.addChild( this.numberSpinner );

    this.controlsAlignGroup = controlsAlignGroup;
    this.controlsPDOMOrder = options.controlsPDOMOrder;
    this.numberSpinner = numberSpinner;
  }
}

/**
 * We are overriding the sound player for the info button to play the dialog open and close sounds.
 */
class InfoButtonSoundPlayer implements TSoundPlayer {

  // Sound generators, created at construction to avoid any lag when playing.
  private readonly generalCloseSoundPlayer = sharedSoundPlayers.get( 'generalClose' );
  private readonly generalOpenSoundPlayer = sharedSoundPlayers.get( 'generalOpen' );

  public constructor( private readonly dialogVisibleProperty: Property<boolean> ) {
  }

  public play(): void {
    if ( this.dialogVisibleProperty.value ) {
      this.generalCloseSoundPlayer.play();
    }
    else {
      this.generalOpenSoundPlayer.play();
    }
  }

  public stop(): void {
    this.generalOpenSoundPlayer.stop();
    this.generalCloseSoundPlayer.stop();
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceControls', MeanShareAndBalanceControls );