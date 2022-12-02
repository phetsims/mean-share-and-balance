// Copyright 2022, University of Colorado Boulder

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

type SelfOptions = EmptySelfOptions;
type PersonImageOptions = SelfOptions & PickRequired<ImageOptions, 'tandem'> & ImageOptions;

export default class PersonImage extends Image {

  public constructor( image: HTMLImageElement, plate: TablePlateNode, providedOptions: PersonImageOptions ) {
    const options = optionize<PersonImageOptions, SelfOptions, ImageOptions>()( {
      scale: 0.3,
      centerX: plate.centerX,
      bottom: plate.bottom - 55
    }, providedOptions );

    super( image, options );
  }
}

meanShareAndBalance.register( 'PersonImage', PersonImage );