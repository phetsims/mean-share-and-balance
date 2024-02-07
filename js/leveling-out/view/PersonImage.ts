// Copyright 2022-2024, University of Colorado Boulder

/**
 * The node containing the image of each sim person.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Image, ImageOptions } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TablePlateNode from './TablePlateNode.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';

type SelfOptions = EmptySelfOptions;
type PersonImageOptions = SelfOptions & PickRequired<ImageOptions, 'tandem'> & ImageOptions;

// PersonImage is reliant on the scale of the artwork being consistent from image to image. When creating new artwork
// this should be taken into account.
const PEOPLE_SCALE = 0.3;

export default class PersonImage extends Image {

  public constructor( image: HTMLImageElement, tablePlateNode: TablePlateNode, providedOptions: PersonImageOptions ) {
    const options = optionize<PersonImageOptions, SelfOptions, ImageOptions>()( {
      scale: PEOPLE_SCALE,
      centerX: tablePlateNode.centerX,
      bottom: MeanShareAndBalanceConstants.PARTY_TABLE_Y + 80
    }, providedOptions );

    super( image, options );
  }
}

meanShareAndBalance.register( 'PersonImage', PersonImage );