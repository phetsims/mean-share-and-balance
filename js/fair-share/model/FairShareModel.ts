// Copyright 2024, University of Colorado Boulder

/**
 * Model for the "Fair Share" Screen which includes people, cookies, visual mean snackType, and a numerical
 * mean snackType.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import SharingModel, { SharingModelOptions } from '../../common/model/SharingModel.js';
import Apple from './Apple.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';

type SelfOptions = EmptySelfOptions;
type FairShareModelOptions = SelfOptions & PickRequired<SharingModelOptions, 'tandem'>;

class NotepadOrganizationMode extends EnumerationValue {

  // The information is displayed such that it is in sync with what is on the plates on the table.
  public static readonly SYNC = new NotepadOrganizationMode();

  // The snacks are collected into a single display that doesn't show the plates.
  public static readonly COLLECT = new NotepadOrganizationMode();

  // The total amount of snacks on the table are shared evenly between the plates in the notepad.
  public static readonly SHARE = new NotepadOrganizationMode();

  // Gets a list of keys, values and mapping between them.  For use in EnumerationProperty and PhET-iO
  public static readonly enumeration = new Enumeration( NotepadOrganizationMode, {
    phetioDocumentation: 'Describes the way in which the information in the notepad is displayed.'
  } );
}

export default class FairShareModel extends SharingModel<Apple> {

  // An enumeration property that controls the way in which the quantity of snacks on the table are displayed on the
  // notepad.  See the enumeration for more information on the possible modes.
  public readonly notepadOrganizationModeProperty: EnumerationProperty<NotepadOrganizationMode>;

  public constructor( providedOptions: FairShareModelOptions ) {
    const options = optionize<FairShareModelOptions, SelfOptions, SharingModelOptions>()( {}, providedOptions );
    super( options );
    this.notepadOrganizationModeProperty = new EnumerationProperty( NotepadOrganizationMode.SYNC, {
      tandem: providedOptions.tandem.createTandem( 'notepadOrganizationModeProperty' ),
      phetioFeatured: true
    } );
  }
}

meanShareAndBalance.register( 'FairShareModel', FairShareModel );