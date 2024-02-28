// Copyright 2024, University of Colorado Boulder

/**
 * The BalancePointNotepadNode adds a mean readout and check button to the notepad node for the balance point screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */
import NotepadNode, { NotepadNodeOptions } from '../../common/view/NotepadNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { DerivedProperty, PatternStringProperty, TReadOnlyProperty } from '../../../../axon/js/imports.js';
import { AlignBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import BalancePointSceneModel from '../model/BalancePointSceneModel.js';
import { EmptySelfOptions, optionize } from '../../../../phet-core/js/imports.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import { RectangularPushButton } from '../../../../sun/js/imports.js';
import createValueReadoutStringProperty from '../../../../soccer-common/js/model/createValueReadoutStringProperty.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import BalanceBeamNode from './BalanceBeamNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

type SelfOptions = EmptySelfOptions;

type BalancePointNotepadNodeOptions = SelfOptions &
  StrictOmit<NotepadNodeOptions, 'readoutPatternStringProperty'> &
  PickRequired<NotepadNodeOptions, 'tandem'>;

export default class BalancePointNotepadNode extends NotepadNode {

  public constructor(
    sceneModel: BalancePointSceneModel,
    modelViewTransform: ModelViewTransform2,
    playAreaNumberLineNode: NumberLineNode,
    areTickMarksVisibleProperty: TReadOnlyProperty<boolean>,
    isMeanVisibleProperty: TReadOnlyProperty<boolean>,
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
    const checkText = new Text( MeanShareAndBalanceStrings.checkStringProperty, {
      font: new PhetFont( 16 ),
      visibleProperty: sceneModel.beamSupportsPresentProperty
    } );
    const resetText = new Text( MeanShareAndBalanceStrings.resetStringProperty, {
      font: new PhetFont( 16 ),
      visibleProperty: DerivedProperty.not( sceneModel.beamSupportsPresentProperty )
    } );
    const checkButton = new RectangularPushButton( {
      content: new Node( { children: [ checkText, resetText ] } ),
      listener: () => {
        sceneModel.beamSupportsPresentProperty.toggle();
      },
      tandem: options.tandem.createTandem( 'checkButton' )
    } );
    sceneModel.beamSupportsPresentProperty.link( supportsPresent => {
      checkButton.baseColor = supportsPresent ? MeanShareAndBalanceColors.checkButtonColorProperty : 'white';
    } );

    const vBoxSpacing = 30;

    const vBox = new VBox( {
      children: [ meanReadoutText, checkButton ],
      excludeInvisibleChildrenFromBounds: false,
      align: 'left',
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

    const balanceBeamNode = new BalanceBeamNode( modelViewTransform, playAreaNumberLineNode,
      this.paperStackBounds, areTickMarksVisibleProperty );
    this.addChild( balanceBeamNode );
  }
}

meanShareAndBalance.register( 'BalancePointNotepadNode', BalancePointNotepadNode );