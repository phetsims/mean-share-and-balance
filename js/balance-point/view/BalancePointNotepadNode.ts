// Copyright 2024, University of Colorado Boulder

/**
 * The BalancePointNotepadNode adds a mean readout and check button to the notepad node for the balance point screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */
import NotepadNode, { NotepadNodeOptions } from '../../common/view/NotepadNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { AlignBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import BalancePointSceneModel from '../model/BalancePointSceneModel.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import createValueReadoutStringProperty from '../../../../soccer-common/js/model/createValueReadoutStringProperty.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import BalanceBeamNode from './BalanceBeamNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';

type SelfOptions = EmptySelfOptions;

type BalancePointNotepadNodeOptions = SelfOptions &
  StrictOmit<NotepadNodeOptions, 'readoutPatternStringProperty'> &
  PickRequired<NotepadNodeOptions, 'tandem'>;

export default class BalancePointNotepadNode extends NotepadNode {

  private readonly balanceBeamNode: BalanceBeamNode;
  public readonly notepadPDOMOrder: Node[];

  public constructor(
    sceneModel: BalancePointSceneModel,
    playAreaNumberLineNode: NumberLineNode,
    areTickMarksVisibleProperty: TReadOnlyProperty<boolean>,
    isMeanVisibleProperty: TReadOnlyProperty<boolean>,
    isMeanFulcrumFixedProperty: TReadOnlyProperty<boolean>,
    providedOptions: BalancePointNotepadNodeOptions
  ) {

    const totalDistancePatternStringProperty = new PatternStringProperty(
      MeanShareAndBalanceStrings.totalDistancePatternStringProperty,
      { total: sceneModel.totalKickDistanceProperty } );

    const options = optionize<BalancePointNotepadNodeOptions, SelfOptions, NotepadNodeOptions>()( {
      readoutPatternStringProperty: totalDistancePatternStringProperty
    }, providedOptions );
    super( options );

    // Create the mean readout text.
    const meanReadoutStringProperty = createValueReadoutStringProperty(
      sceneModel.meanValueProperty,
      MeanShareAndBalanceStrings.meanEqualsPatternStringProperty,
      MeanShareAndBalanceStrings.meanEqualsUnknownStringProperty,
      1
    );
    const meanReadoutText = new Text( meanReadoutStringProperty, {
      font: new PhetFont( 16 ),
      fill: MeanShareAndBalanceColors.meanColorProperty,
      visibleProperty: isMeanVisibleProperty
    } );

    // Create the check push button. The color and text switches depending on if the supports are present or not.
    const buttonTextMaxWidth = 80;
    const checkText = new Text( MeanShareAndBalanceStrings.checkStringProperty, {
      font: new PhetFont( 16 ),
      visibleProperty: sceneModel.beamSupportsPresentProperty,
      maxWidth: buttonTextMaxWidth
    } );
    const resetText = new Text( MeanShareAndBalanceStrings.resetStringProperty, {
      font: new PhetFont( 16 ),
      visibleProperty: DerivedProperty.not( sceneModel.beamSupportsPresentProperty ),
      maxWidth: buttonTextMaxWidth
    } );
    const checkButton = new RectangularPushButton( {

      // The check button is not visible when the fulcrum is fixed.
      visibleProperty: DerivedProperty.not( isMeanFulcrumFixedProperty ),
      content: new Node( { children: [ checkText, resetText ] } ),
      listener: () => {
        sceneModel.beamSupportsPresentProperty.toggle();
      },
      touchAreaXDilation: MeanShareAndBalanceConstants.TOUCH_AREA_DILATION,
      touchAreaYDilation: MeanShareAndBalanceConstants.TOUCH_AREA_DILATION,
      tandem: options.tandem.createTandem( 'checkButton' )
    } );
    sceneModel.beamSupportsPresentProperty.link( supportsPresent => {
      checkButton.baseColor = supportsPresent ? MeanShareAndBalanceColors.checkButtonColorProperty : 'white';
    } );

    const vBoxSpacing = 30;

    const vBox = new VBox( {
      children: [ meanReadoutText, checkButton ],
      excludeInvisibleChildrenFromBounds: false,
      align: 'right',
      spacing: vBoxSpacing
    } );

    // The meanReadoutText should be vertically centered in the notepad node.
    const alignBounds = this.paperStackBounds.withOffsets( 0, -( vBoxSpacing + meanReadoutText.bounds.height ), 0, 0 );
    const alignBox = new AlignBox( vBox, {
      alignBounds: alignBounds,
      xAlign: 'right',
      xMargin: 10
    } );
    this.addChild( alignBox );

    // The columns that support the beam are not visible when the fulcrum is fixed.
    const columnsVisibleProperty = new DerivedProperty(
      [ isMeanFulcrumFixedProperty, sceneModel.beamSupportsPresentProperty ],
      ( isMeanFulcrumFixed, beamSupportsPresent ) => !isMeanFulcrumFixed && beamSupportsPresent
    );

    // Create the node that depicts the balance beam, including the balls that are stacked on it.
    this.balanceBeamNode = new BalanceBeamNode(
      sceneModel,
      playAreaNumberLineNode,
      this.paperStackBounds,
      sceneModel.fulcrumValueProperty,
      sceneModel.meanValueProperty,
      columnsVisibleProperty,
      areTickMarksVisibleProperty,
      isMeanFulcrumFixedProperty,
      { tandem: options.tandem.createTandem( 'balanceBeamNode' ) }
    );
    this.addChild( this.balanceBeamNode );

    // Pull the notepad rings and readout to the front of the z-order so that the balance beam line will appear
    // to go behind them.
    this.moveChildToFront( this.ringsNode );
    this.readoutNode && this.moveChildToFront( this.readoutNode );

    this.notepadPDOMOrder = [ this.balanceBeamNode, checkButton ];
  }

  public reset(): void {
    this.balanceBeamNode.reset();
  }
}

meanShareAndBalance.register( 'BalancePointNotepadNode', BalancePointNotepadNode );