// Copyright 2024-2025, University of Colorado Boulder

/**
 * Adds a RectangularRadioButtonGroup and other visual decorations to the NotepadNode for the Fair Share screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import nullSoundPlayer from '../../../../tambo/js/nullSoundPlayer.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import collectionArea_svg from '../../../images/collectionArea_svg.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import NotepadNode, { NotepadNodeOptions } from '../../common/view/NotepadNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import FairShareModel, { ApplesAnimationState, DistributionMode } from '../model/FairShareModel.js';
import AllocationModeSoundGenerator from './AllocationModeSoundGenerator.js';

type FairShareNotepadNodeOptions = EmptySelfOptions & WithRequired<NotepadNodeOptions, 'tandem'>;
export default class FairShareNotepadNode extends NotepadNode {

  public constructor( appleDistributionModeProperty: Property<DistributionMode>,
                      applesAnimationStateEmitter: TEmitter<[ ApplesAnimationState ]>,
                      totalApplesProperty: TReadOnlyProperty<number>,
                      numberOfActivePlatesProperty: TReadOnlyProperty<number>,
                      providedOptions: FairShareNotepadNodeOptions ) {

    super( providedOptions );

    // Add the box that will depict the collection area, which is only shown in 'Collect' mode.
    const collectionAreaVisibleProperty = new DerivedProperty(
      [ appleDistributionModeProperty ],
      mode => mode === DistributionMode.COLLECT
    );
    const collectionAreaNode = new Image( collectionArea_svg, {
      initialWidth: FairShareModel.COLLECTION_AREA_SIZE.width,
      initialHeight: FairShareModel.COLLECTION_AREA_SIZE.height,
      centerX: this.paperStackBounds.centerX,
      centerY: this.paperStackBounds.centerY + 5, // tweaked a bit due to be perfectly centered around the collection
      visibleProperty: collectionAreaVisibleProperty
    } );
    this.addChild( collectionAreaNode );

    // Add the radio buttons for selecting the different modes.
    const distributionModes = [ DistributionMode.SYNC, DistributionMode.COLLECT, DistributionMode.SHARE ];
    const distributionModeItems = distributionModes.map( choice => ( {
      createNode: () => new Text( choice.stringProperty, { font: MeanShareAndBalanceConstants.DEFAULT_FONT, maxWidth: 120 } ),
      value: choice,
      tandemName: `${choice.name.toLowerCase()}RadioButton`,
      options: { minWidth: 80 }
    } ) );

    const distributionModeRadioButtonGroup = new RectangularRadioButtonGroup<DistributionMode>(
      appleDistributionModeProperty,
      distributionModeItems,
      {
        orientation: 'horizontal',
        spacing: 5,
        touchAreaYDilation: 8,
        soundPlayers: distributionModeItems.map( () => nullSoundPlayer ), // sound generation handled below
        accessibleName: MeanShareAndBalanceStrings.a11y.appleActionsStringProperty,
        tandem: providedOptions.tandem.createTandem( 'distributionModeRadioButtonGroup' )
      } );
    const radioButtonGroupAlignBox = new AlignBox( distributionModeRadioButtonGroup, {
      alignBounds: this.localBounds,
      xAlign: 'center',
      yAlign: 'bottom',
      yMargin: 18
    } );
    this.addChild( radioButtonGroupAlignBox );

    // Add sound generator for the movement of the apples as the notepad mode changes.
    soundManager.addSoundGenerator( new AllocationModeSoundGenerator(
      appleDistributionModeProperty,
      applesAnimationStateEmitter,
      totalApplesProperty,
      numberOfActivePlatesProperty,
      {
        initialOutputLevel: 0.2
      }
    ) );
  }
}

meanShareAndBalance.register( 'FairShareNotepadNode', FairShareNotepadNode );