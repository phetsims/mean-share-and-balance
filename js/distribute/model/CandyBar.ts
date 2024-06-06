// Copyright 2022-2024, University of Colorado Boulder

/**
 * Individual candy bars in the notepad snackType.
 * These candy bars are draggable.
 *
 * TODO: JB, do we just need this for clarity? It doesn't seem to add any functionality. https://github.com/phetsims/mean-share-and-balance/issues/258
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Snack, { SnackOptions } from '../../common/model/Snack.js';

type SelfOptions = EmptySelfOptions;
type CandyBarOptions = SelfOptions & SnackOptions;

export default class CandyBar extends Snack {

  public constructor( providedOptions: CandyBarOptions ) {
    const options = optionize<CandyBarOptions, SelfOptions, SnackOptions>()( {}, providedOptions );
    super( options );
  }
}

meanShareAndBalance.register( 'CandyBar', CandyBar );