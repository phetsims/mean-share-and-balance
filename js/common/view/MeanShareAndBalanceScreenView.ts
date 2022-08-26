// Copyright 2022, University of Colorado Boulder

/**
 * Parent ScreenView that contains components shared across screens such as: QuestionBar, Controls Layout,
 * SyncDataButton, and ResetAll
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceModel from '../model/MeanShareAndBalanceModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { AlignBox, GridBox, TColor, Text, VBox } from '../../../../scenery/js/imports.js';
import QuestionBar from '../../../../scenery-phet/js/QuestionBar.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import meanShareAndBalanceStrings from '../../meanShareAndBalanceStrings.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
// import SyncButton from './SyncButton.js';

export type MeanShareAndBalanceScreenViewOptions = PickRequired<ScreenViewOptions, 'tandem'>;

export default class MeanShareAndBalanceScreenView extends ScreenView {
  public readonly resetAllButton: ResetAllButton;
  // Syncs the two representations on each screen. ie. in intro, syncs the 3D and 2D cups.
  public readonly controlsVBox: VBox;
  public readonly numberSpinnerVBox: VBox;
  public readonly questionBar: QuestionBar;
  private readonly controlsAlignBox: AlignBox;
  public readonly dataStateVBox: VBox;

  // public readonly syncButton: SyncButton;

  protected constructor( model: MeanShareAndBalanceModel, questionBarText: TReadOnlyProperty<string>, questionBarColor: TColor, numberSpinnerProperty: Property<number>, providedOptions: MeanShareAndBalanceScreenViewOptions ) {
    const options = providedOptions;

    super( options );

    this.questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, {
      labelText: questionBarText.value,
      barFill: questionBarColor,

      // phet-io
      tandem: options.tandem.createTandem( 'questionBar' )
    } );

    const playAreaBounds = new Bounds2( this.layoutBounds.minX, this.layoutBounds.minY + this.questionBar.height,
      this.layoutBounds.maxX, this.layoutBounds.maxY );

    //TODO: Do we need sync button for future screens?

    // this.syncButton = new SyncButton( this.layoutBounds, {
    //   listener: () => {
    //     this.interruptSubtreeInput(); // cancel interactions that may be in progress
    //     model.syncData();
    //   },
    //   tandem: options.tandem.createTandem( 'syncRepresentationsButton' )
    // } );

    const numberOfCupsText = new Text( meanShareAndBalanceStrings.numberOfCupsProperty, {
      fontSize: 15,
      maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
    } );

    //Number Picker
    const numberSpinner = new NumberSpinner(
      numberSpinnerProperty,
      new Property( MeanShareAndBalanceConstants.NUMBER_SPINNER_RANGE ),
      {
        arrowsPosition: 'leftRight',
        layoutOptions: {
          align: 'left'
        },
        accessibleName: meanShareAndBalanceStrings.numberOfCupsProperty,

        // phet-io
        tandem: options.tandem.createTandem( 'numberSpinner' )
      }
    );

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - MeanShareAndBalanceConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - MeanShareAndBalanceConstants.SCREEN_VIEW_Y_MARGIN,

      // phet-io
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    this.controlsVBox = new VBox( {
      align: 'left',
      layoutOptions: { column: 1, row: 0 }
    } );

    this.dataStateVBox = new VBox( {
      align: 'left',
      layoutOptions: { column: 1, row: 1, minContentHeight: 140, yAlign: 'top' }
    } );

    this.numberSpinnerVBox = new VBox( {
      align: 'left',
      justify: 'bottom',
      spacing: 10,
      layoutOptions: { column: 1, row: 2 },
      children: [ numberOfCupsText, numberSpinner ]
    } );

    const controlsGridBox = new GridBox( {
      children: [
        this.controlsVBox,
        this.dataStateVBox,
        this.numberSpinnerVBox
      ],
      minContentWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + 25,
      spacing: 20
    } );

    this.controlsAlignBox = new AlignBox( controlsGridBox, {
      alignBounds: playAreaBounds,
      xAlign: 'right',
      yAlign: 'top',
      rightMargin: MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN,
      topMargin: MeanShareAndBalanceConstants.CONTROLS_VERTICAL_MARGIN
    } );

    // refactoring this to use children is inefficient. Too many of the elements rely on the layoutBounds of the class instance
    this.addChild( this.questionBar );
    this.addChild( this.resetAllButton );
    this.addChild( this.controlsAlignBox );
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    // May be used for future screens
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceScreenView', MeanShareAndBalanceScreenView );