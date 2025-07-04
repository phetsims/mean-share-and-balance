// Copyright 2024-2025, University of Colorado Boulder

/**
 * The BalancePointNotepadNode adds a mean readout and check button to the notepad node for the balance point screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import GatedVisibleProperty from '../../../../axon/js/GatedVisibleProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import BooleanRectangularToggleButton from '../../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import TSoundPlayer from '../../../../tambo/js/TSoundPlayer.js';
import pillarsAdded_mp3 from '../../../sounds/pillarsAdded_mp3.js';
import pillarsRemoved_mp3 from '../../../sounds/pillarsRemoved_mp3.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import NotepadNode, { NotepadNodeOptions } from '../../common/view/NotepadNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import BalancePointSceneModel from '../model/BalancePointSceneModel.js';
import BalanceBeamNode from './BalanceBeamNode.js';

type SelfOptions = EmptySelfOptions;

type BalancePointNotepadNodeOptions = SelfOptions &
  StrictOmit<NotepadNodeOptions, 'readoutPatternStringProperty'> &
  PickRequired<NotepadNodeOptions, 'tandem'>;

export default class BalancePointNotepadNode extends NotepadNode {

  private readonly balanceBeamNode: BalanceBeamNode;
  public readonly notepadPDOMOrder: Node[];

  public constructor(
    sceneModel: BalancePointSceneModel,
    playAreaNumberLineNode: NumberLineNode,
    fulcrumWasDraggedProperty: Property<boolean>,
    tickMarksVisibleProperty: TReadOnlyProperty<boolean>,
    meanFulcrumFixedProperty: TReadOnlyProperty<boolean>,
    providedOptions: BalancePointNotepadNodeOptions
  ) {

    const totalDistancePatternStringProperty = new PatternStringProperty(
      MeanShareAndBalanceStrings.totalDistancePatternStringProperty,
      { total: sceneModel.totalKickDistanceProperty } );

    const options = optionize<BalancePointNotepadNodeOptions, SelfOptions, NotepadNodeOptions>()( {
      readoutPatternStringProperty: totalDistancePatternStringProperty
    }, providedOptions );
    super( options );

    // Create the check push button. The color and text switches depending on if the supports are present or not.
    const buttonTextMaxWidth = 80;
    const checkText = new Text( MeanShareAndBalanceStrings.checkStringProperty, {
      font: MeanShareAndBalanceConstants.DEFAULT_FONT,
      maxWidth: buttonTextMaxWidth
    } );
    const resetText = new Text( MeanShareAndBalanceStrings.resetStringProperty, {
      font: MeanShareAndBalanceConstants.DEFAULT_FONT,
      maxWidth: buttonTextMaxWidth
    } );

    const checkAndResetButtonTandem = options.tandem.createTandem( 'checkAndResetButton' );
    const gatedVisibleProperty = new GatedVisibleProperty( DerivedProperty.not( meanFulcrumFixedProperty ),
      checkAndResetButtonTandem );

    const pillarsRemovedSoundPlayer = new PillarsRemovedSoundPlayer( sceneModel.targetNumberOfBallsProperty );
    const pillarsAddedSoundClip = new SoundClip( pillarsAdded_mp3, { initialOutputLevel: 0.1 } );
    soundManager.addSoundGenerator( pillarsAddedSoundClip );

    const checkAndResetButton = new BooleanRectangularToggleButton( sceneModel.beamSupportsPresentProperty, checkText, resetText, {

      // The check button is not visible when the fulcrum is fixed.
      visibleProperty: gatedVisibleProperty,
      valueOnSoundPlayer: pillarsAddedSoundClip,
      valueOffSoundPlayer: pillarsRemovedSoundPlayer,
      touchAreaXDilation: MeanShareAndBalanceConstants.TOUCH_AREA_DILATION,
      touchAreaYDilation: MeanShareAndBalanceConstants.TOUCH_AREA_DILATION,
      tandem: checkAndResetButtonTandem
    } );
    sceneModel.beamSupportsPresentProperty.link( supportsPresent => {
      checkAndResetButton.baseColor = supportsPresent ? MeanShareAndBalanceColors.checkButtonColorProperty : 'white';
      checkAndResetButton.accessibleName = supportsPresent ?
                                           MeanShareAndBalanceStrings.a11y.checkBalanceStringProperty :
                                           MeanShareAndBalanceStrings.a11y.resetPillarsStringProperty;
    } );

    // The meanReadoutText should be vertically centered in the notepad node.
    const alignBox = new AlignBox( checkAndResetButton, {
      alignBounds: this.paperStackBounds,
      xAlign: 'right',
      yAlign: 'bottom',
      xMargin: 10,
      bottomMargin: 50
    } );
    this.addChild( alignBox );

    // The columns that support the beam are not visible when the fulcrum is fixed.
    const columnsVisibleProperty = new DerivedProperty(
      [ meanFulcrumFixedProperty, sceneModel.beamSupportsPresentProperty ],
      ( isMeanFulcrumFixed, beamSupportsPresent ) => !isMeanFulcrumFixed && beamSupportsPresent
    );

    // Create the node that depicts the balance beam, including the balls that are stacked on it.
    this.balanceBeamNode = new BalanceBeamNode(
      sceneModel,
      playAreaNumberLineNode,
      this.paperStackBounds,
      columnsVisibleProperty,
      fulcrumWasDraggedProperty,
      tickMarksVisibleProperty,
      meanFulcrumFixedProperty,
      { tandem: options.tandem.createTandem( 'balanceBeamNode' ) }
    );
    this.addChild( this.balanceBeamNode );

    // Pull the notepad rings and readout to the front of the z-order so that the balance beam line will appear
    // to go behind them.
    this.moveChildToFront( this.ringsNode );
    this.readoutNode && this.moveChildToFront( this.readoutNode );

    this.notepadPDOMOrder = [ this.balanceBeamNode, checkAndResetButton ];
  }

  public reset(): void {
    this.balanceBeamNode.reset();
  }
}

class PillarsRemovedSoundPlayer implements TSoundPlayer {

  private readonly pillarsRemovedSoundClip = new SoundClip( pillarsRemoved_mp3, { initialOutputLevel: 0.1 } );

  public constructor( private readonly numberOfBallsKickedProperty: TReadOnlyProperty<number> ) {
    soundManager.addSoundGenerator( this.pillarsRemovedSoundClip );
  }

  public play(): void {
    if ( this.numberOfBallsKickedProperty.value === 0 ) {

      // Play the sound that is associated with the check button.
      this.pillarsRemovedSoundClip.play();
    }
  }

  public stop(): void {
    this.pillarsRemovedSoundClip.stop();
  }
}

meanShareAndBalance.register( 'BalancePointNotepadNode', BalancePointNotepadNode );