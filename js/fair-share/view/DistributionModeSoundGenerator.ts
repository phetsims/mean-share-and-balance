// Copyright 2024, University of Colorado Boulder

/**
 * DistributionModeSoundPlayer is a sound generator that produces sounds when the distribution mode of the Fair Share
 * notepad changes.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { ApplesAnimationState, NotepadMode } from '../model/FairShareModel.js';
import collectSound_mp3 from '../../../sounds/collectSound_mp3.js';
import erase_mp3 from '../../../../scenery-phet/sounds/erase_mp3.js';
import shareWhooshSound_mp3 from '../../../sounds/shareWhooshSound_mp3.js';
import shareCompleteSound_mp3 from '../../../sounds/shareCompleteSound_mp3.js';
import shareFractionalizeSound_mp3 from '../../../sounds/shareFractionalizeSound_mp3.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TinyEmitter from '../../../../axon/js/TinyEmitter.js';

type SelfOptions = EmptySelfOptions;
type DistributionModeSoundPlayerOptions = SoundGeneratorOptions & SelfOptions;

class DistributionModeSoundGenerator extends SoundGenerator {

  public constructor( distributionModeProperty: TReadOnlyProperty<NotepadMode>,
                      applesAnimationStateEmitter: TinyEmitter<ApplesAnimationState>,
                      totalApplesProperty: TReadOnlyProperty<number>,
                      numberOfActivePlatesProperty: TReadOnlyProperty<number>,
                      providedOptions?: DistributionModeSoundPlayerOptions ) {

    const options = optionize<DistributionModeSoundPlayerOptions, SelfOptions, SoundGeneratorOptions>()(
      {},
      providedOptions
    );

    super( options );

    const collectSoundClip = new SoundClip( collectSound_mp3 );
    collectSoundClip.connect( this.mainGainNode );
    const syncSoundClip = new SoundClip( erase_mp3 );
    syncSoundClip.connect( this.mainGainNode );
    const whooshSoundClip = new SoundClip( shareWhooshSound_mp3 );
    whooshSoundClip.connect( this.mainGainNode );
    const shareCompleteSoundClip = new SoundClip( shareCompleteSound_mp3 );
    shareCompleteSoundClip.connect( this.mainGainNode );
    const shareFractionalizeSoundClip = new SoundClip( shareFractionalizeSound_mp3 );
    shareFractionalizeSoundClip.connect( this.mainGainNode );

    // Play the sounds that occur immediately upon a mode change.
    distributionModeProperty.lazyLink( ( mode, previousMode ) => {
      if ( !ResetAllButton.isResettingAllProperty.value ) {
        if ( mode === NotepadMode.SYNC ) {
          syncSoundClip.play();
        }
        else if ( mode === NotepadMode.COLLECT ) {
          collectSoundClip.play();
        }
        else if ( mode === NotepadMode.SHARE ) {
          if ( previousMode === NotepadMode.SYNC ) {
            shareCompleteSoundClip.play();
          }
          else {
            // If the number of apples divides evenly over the number of plates, the 'complete' sound is played.
            // Otherwise, an initial sound is played and other sounds are played as the animation progresses.
            if ( totalApplesProperty.value % numberOfActivePlatesProperty.value === 0 ) {
              shareCompleteSoundClip.play();
            }
            else {
              whooshSoundClip.play();
            }
          }
        }
      }
    } );

    // Play the appropriate sounds as the apples animate to their different positions when going into the SHARE state.
    applesAnimationStateEmitter.addListener( applesAnimationState => {
      applesAnimationState === 'split' && shareFractionalizeSoundClip.play();
      applesAnimationState === 'land' && shareCompleteSoundClip.play();
    } );
  }
}

meanShareAndBalance.register( 'DistributionModeSoundGenerator', DistributionModeSoundGenerator );

export default DistributionModeSoundGenerator;