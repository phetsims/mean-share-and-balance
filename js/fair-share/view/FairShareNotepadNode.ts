// Copyright 2024, University of Colorado Boulder

/**
 * Adds a RectangularRadioButtonGroup and other visual decorations to the NotepadNode for the Fair Share screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import NotepadNode, { NotepadNodeOptions } from '../../common/view/NotepadNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import FairShareModel, { ApplesAnimationState, DistributionMode } from '../model/FairShareModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import { AlignBox, Image, Text } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import collectionArea_svg from '../../../images/collectionArea_svg.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import AllocationModeSoundGenerator from './AllocationModeSoundGenerator.js';
import nullSoundPlayer from '../../../../tambo/js/shared-sound-players/nullSoundPlayer.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import TEmitter from '../../../../axon/js/TEmitter.js';

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
        labelContent: 'Apple Actions',
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