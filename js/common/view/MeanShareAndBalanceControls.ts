// Copyright 2024, University of Colorado Boulder

/**
 * MeanShareAndBalanceControls is the base class for all controls across all four screens in Mean Share and Balance.
 * All screens have a number spinner that should be displayed in the same location on each screen. Controls are aligned
 * horizontally.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import { AlignGroup, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import NumberSpinnerControl from './NumberSpinnerControl.js';
import Property from '../../../../axon/js/Property.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { NumberSpinnerOptions } from '../../../../sun/js/NumberSpinner.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import Range from '../../../../dot/js/Range.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import generalOpenSoundPlayer from '../../../../tambo/js/shared-sound-players/generalOpenSoundPlayer.js';
import generalCloseSoundPlayer from '../../../../tambo/js/shared-sound-players/generalCloseSoundPlayer.js';
import TSoundPlayer from '../../../../tambo/js/TSoundPlayer.js';
import MeanShareAndBalanceColors from '../MeanShareAndBalanceColors.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';

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

    const numberSpinnerOptions = combineOptions<NumberSpinnerOptions>( {
      decrementFunction: value => {

        // A user's interaction with an interactive component should be interrupted in case it
        // is being removed from the screen in multitouch scenarios.
        this.interruptSubtreeInput();
        return value - 1;
      }
    }, options.numberSpinnerOptions );
    const numberSpinnerVBoxOptions = {
      tandem: options.tandem.createTandem( 'numberSpinnerControl' ),
      numberSpinnerOptions: numberSpinnerOptions
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
  public constructor( private readonly dialogVisibleProperty: Property<boolean> ) {
  }

  public play(): void {
    if ( this.dialogVisibleProperty.value ) {
      generalCloseSoundPlayer.play();
    }
    else {
      generalOpenSoundPlayer.play();
    }
  }

  public stop(): void {
    generalOpenSoundPlayer.stop();
    generalCloseSoundPlayer.stop();
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceControls', MeanShareAndBalanceControls );