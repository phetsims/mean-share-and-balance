// Copyright 2022-2025, University of Colorado Boulder

/**
 * TablePlateNode is a graphical representation of a plate upon which items - generally called "snacks" in this sim -
 * can be stacked.  This also includes a number spinner that controls the number of items stacked on the plate.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { PDOMValueType } from '../../../../scenery/js/accessibility/pdom/ParallelDOM.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import SceneryConstants from '../../../../scenery/js/SceneryConstants.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import candyBar_svg from '../../../images/candyBar_svg.js';
import greenApple_svg from '../../../images/greenApple_svg.js';
import plate_svg from '../../../images/plate_svg.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceColors from '../MeanShareAndBalanceColors.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import Plate from '../model/Plate.js';
import Snack from '../model/Snack.js';
import SnackStacker from '../SnackStacker.js';
import { SnackType } from './SharingScreenView.js';
import SnackQuantitySoundPlayer, { SnackQuantitySoundPlayerOptions } from './SnackQuantitySoundPlayer.js';

type SelfOptions = {
  snackType: SnackType;
  snackQuantitySoundPlayerOptions?: SnackQuantitySoundPlayerOptions;
  numberPickerAccessibleName: PDOMValueType;

  // A function that can be optionally supplied and that can be used to interrupt interactions that become problematic
  // if the number of items on the plate are changed, such as dragging of one or more of those items.
  interruptIncompatibleInteractions?: () => void;
};

type PersonNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

// constants
const APPLE_IMAGE_WIDTH = 25; // in screen coords
const CANDY_BAR_IMAGE_HEIGHT = 25; // in screen coords

export default class TablePlateNode<T extends Snack> extends Node {

  public constructor( plate: Plate<T>, tableCenter: Vector2, providedOptions: PersonNodeOptions ) {

    const options = optionize<PersonNodeOptions, SelfOptions, NodeOptions>()( {
      snackQuantitySoundPlayerOptions: {
        initialOutputLevel: 0.2
      },
      interruptIncompatibleInteractions: _.noop,
      isDisposable: false
    }, providedOptions );

    const plateImage = new Image( plate_svg, {
      maxWidth: MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.width * 1.3 // Tweaked a little for a better look, adjust as needed.
    } );

    // Create the sound generator for the quantity of snacks on the plate.
    const snackQuantitySoundPlayer = new SnackQuantitySoundPlayer(
      options.snackType,
      plate.tableSnackNumberProperty,
      options.snackQuantitySoundPlayerOptions
    );
    soundManager.addSoundGenerator( snackQuantitySoundPlayer );

    // Create the number picker and position it relative to the plate image.
    const numberPickerRange = new Range(
      MeanShareAndBalanceConstants.MIN_NUMBER_OF_SNACKS_PER_PLATE,
      MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE
    );
    const numberPicker = new NumberPicker(
      plate.tableSnackNumberProperty,
      new Property( numberPickerRange ),
      {
        centerTop: new Vector2( plateImage.centerBottom.x, 30 ),
        color: MeanShareAndBalanceColors.numberPickerColorProperty,
        valueChangedSoundPlayer: snackQuantitySoundPlayer,
        boundarySoundPlayer: snackQuantitySoundPlayer,

        // Provide functions for increment and decrement that, in addition to providing the changed value, also
        // interrupt any user interactions that could be messed up by the value change.
        incrementFunction: ( value: number ) => {
          options.interruptIncompatibleInteractions();
          return value + 1;
        },
        decrementFunction: ( value: number ) => {
          options.interruptIncompatibleInteractions();
          return value - 1;
        },

        // These 3 options implement a "displayMode" for the NumberPicker when it is disabled.
        disabledOpacity: 1,
        arrowDisabledOpacity: SceneryConstants.DISABLED_OPACITY,
        backgroundStrokeDisabledOpacity: SceneryConstants.DISABLED_OPACITY,

        accessibleName: options.numberPickerAccessibleName,

        // phet-io
        tandem: options.tandem.createTandem( 'numberPicker' )
      }
    );

    // Create and position the Nodes representing the individual snacks that are on this plate.
    const snacks = _.times(
      MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE,
      index => {
        if ( options.snackType === 'candyBars' ) {
          const candyBarNode = new Image( candyBar_svg, { maxHeight: CANDY_BAR_IMAGE_HEIGHT } );
          SnackStacker.setSnackImageNodePosition( candyBarNode, 'candyBars', index );
          return candyBarNode;
        }
        else {
          const appleNode = new Image( greenApple_svg, { maxWidth: APPLE_IMAGE_WIDTH } );
          SnackStacker.setSnackImageNodePosition( appleNode, 'apples', index );
          return appleNode;
        }
      }
    );

    // Control the visibility of the snack Nodes based on the snack number value.
    plate.tableSnackNumberProperty.link( snackNumber => {
      assert && assert( snackNumber <= snacks.length, 'snack number exceeded number of snacks' );
      snacks.forEach( ( snack, i ) => {
        snack.visibleProperty.value = i < snackNumber;
      } );
    } );

    // Create a parent Node to contain the individual snack Nodes.
    const snacksNode = new Node( {
      children: snacks,
      centerBottom: new Vector2( plateImage.centerX, plateImage.centerY )
    } );

    // Put the plate and snacks together in a Node.
    const plateAndSnacksNode = new Node( {
      children: [ plateImage, snacksNode ],
      layoutOptions: {
        minContentHeight: CANDY_BAR_IMAGE_HEIGHT * 10
      }
    } );

    super( {
      children: [ plateAndSnacksNode, numberPicker ],
      centerX: plate.xPositionProperty.value,
      visibleProperty: plate.isActiveProperty
    } );

    // Create the model-view transform for positioning the plates on the table.
    const modelToTableTopTransform = ModelViewTransform2.createOffsetScaleMapping( tableCenter, 1 );

    // Set they Y position, which does not change after construction.
    this.y = modelToTableTopTransform.transformY( 0 );

    // Position this node as the plate's x position changes.
    plate.xPositionProperty.link( xPosition => {
      this.centerX = modelToTableTopTransform.transformX( xPosition );
    } );
  }
}

meanShareAndBalance.register( 'TablePlateNode', TablePlateNode );