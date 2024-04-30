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
import shareFractionalizeSound_mp3 from '../../../sounds/shareFractionalizeSound_mp3.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TinyEmitter from '../../../../axon/js/TinyEmitter.js';
import shareCompleteLargeAmount_mp3 from '../../../sounds/shareCompleteLargeAmount_mp3.js';
import shareCompleteMediumAmount_mp3 from '../../../sounds/shareCompleteMediumAmount_mp3.js';
import shareCompleteSmallAmount_mp3 from '../../../sounds/shareCompleteSmallAmount_mp3.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import { TimerListener } from '../../../../axon/js/Timer.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';

type SelfOptions = EmptySelfOptions;
type DistributionModeSoundPlayerOptions = SoundGeneratorOptions & SelfOptions;

// constants
const MAX_APPLES = MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS *
                   MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE;

// This linear function is used when transitioning into SHARE mode to determine the amount of time between the playing
// of the "break into fractions" sound and the "share complete" sound.  It maps the number of active plates to a time
// value in milliseconds.  It is needed because using an emitter for the end of the share animations felt late, see
// https://github.com/phetsims/mean-share-and-balance/issues/206#issuecomment-2086595364.  The time values were
// empirically determined.
const SHARE_COMPLETE_DELAY_FUNCTION = new LinearFunction(
  MeanShareAndBalanceConstants.NUMBER_SPINNER_CONTAINERS_RANGE.min,
  MeanShareAndBalanceConstants.NUMBER_SPINNER_CONTAINERS_RANGE.max,
  180,
  500
);

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
    const shareCompleteLargeAmountSoundClip = new SoundClip( shareCompleteLargeAmount_mp3 );
    shareCompleteLargeAmountSoundClip.connect( this.mainGainNode );
    const shareCompleteMediumAmountSoundClip = new SoundClip( shareCompleteMediumAmount_mp3 );
    shareCompleteMediumAmountSoundClip.connect( this.mainGainNode );
    const shareCompleteSmallAmoungSoundClip = new SoundClip( shareCompleteSmallAmount_mp3 );
    shareCompleteSmallAmoungSoundClip.connect( this.mainGainNode );
    const shareFractionalizeSoundClip = new SoundClip( shareFractionalizeSound_mp3 );
    shareFractionalizeSoundClip.connect( this.mainGainNode );

    let shareCompletedSoundTimer: TimerListener | null = null;

    // Create a function for playing the "share complete" sound.  We use a different sound depending upon how many
    // apples are being shared.
    const playShareCompleteSound = () => {


      if ( totalApplesProperty.value < MAX_APPLES / 3 ) {
        shareCompleteSmallAmoungSoundClip.play();
      }
      else if ( totalApplesProperty.value < 2 * MAX_APPLES / 3 ) {
        shareCompleteMediumAmountSoundClip.play();
      }
      else {
        shareCompleteLargeAmountSoundClip.play();
      }
    };

    // Play the sounds that occur immediately upon a mode change.
    distributionModeProperty.lazyLink( ( mode, previousMode ) => {

      // If a timer was running when the mode changed, cancel it.
      if ( shareCompletedSoundTimer ) {
        stepTimer.clearTimeout( shareCompletedSoundTimer );
        shareCompletedSoundTimer = null;
      }

      if ( !ResetAllButton.isResettingAllProperty.value ) {
        if ( mode === NotepadMode.SYNC ) {
          syncSoundClip.play();
        }
        else if ( mode === NotepadMode.COLLECT ) {
          collectSoundClip.play();
        }
        else if ( mode === NotepadMode.SHARE ) {
          if ( previousMode === NotepadMode.SYNC ) {
            playShareCompleteSound();
          }
          else {

            // If the number of apples divides evenly over the number of plates, the 'complete' sound is played.
            // Otherwise, an initial sound is played and other sounds are played as the animation progresses.
            if ( totalApplesProperty.value % numberOfActivePlatesProperty.value === 0 ) {
              playShareCompleteSound();
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
      if ( applesAnimationState === 'split' ) {
        shareFractionalizeSoundClip.play();
        shareCompletedSoundTimer = stepTimer.setTimeout(
          () => playShareCompleteSound(),
          SHARE_COMPLETE_DELAY_FUNCTION.evaluate( numberOfActivePlatesProperty.value )
        );
      }
    } );
  }
}

meanShareAndBalance.register( 'DistributionModeSoundGenerator', DistributionModeSoundGenerator );

export default DistributionModeSoundGenerator;