// Copyright 2022-2025, University of Colorado Boulder

/**
 * The node containing the image of each sim person.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import LocalizedImageProperty from '../../../../joist/js/i18n/LocalizedImageProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Image, { ImageOptions } from '../../../../scenery/js/nodes/Image.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Snack from '../../common/model/Snack.js';
import TablePlateNode from '../../common/view/TablePlateNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = EmptySelfOptions;
type PersonImageOptions = SelfOptions & ImageOptions;

const MAX_IMAGE_WIDTH = 160;

export default class PersonImage<T extends Snack> extends Image {

  public constructor( image: LocalizedImageProperty, tablePlateNode: TablePlateNode<T>, providedOptions: PersonImageOptions ) {
    const options = optionize<PersonImageOptions, SelfOptions, ImageOptions>()( {
      maxWidth: MAX_IMAGE_WIDTH,
      centerX: tablePlateNode.centerX,
      bottom: MeanShareAndBalanceConstants.PARTY_TABLE_Y + 95,
      isDisposable: false
    }, providedOptions );

    super( image, options );
  }
}

meanShareAndBalance.register( 'PersonImage', PersonImage );