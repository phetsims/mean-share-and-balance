// Copyright 2022, University of Colorado Boulder

//REVIEW This is an incomplete description of MeanShareAndBalanceScreen, and resetAll isn't really significant.
/**
 * Representation for the MeanShareAndBalanceScreen, contains resetAll button
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceModel from '../model/MeanShareAndBalanceModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { AlignBox, GridBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import meanShareAndBalanceStrings from '../../meanShareAndBalanceStrings.js';
import QuestionBar from '../../../../scenery-phet/js/QuestionBar.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import SyncIcon from './SyncIcon.js';

type SelfOptions = EmptyObjectType;

export type MeanShareAndBalanceScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem'>;

export default class MeanShareAndBalanceScreenView extends ScreenView {
  public readonly resetAllButton: ResetAllButton;
  public readonly syncDataButton: RectangularPushButton;
  public readonly controlsVBox: VBox;
  public readonly numberSpinnerVBox: VBox;
  public readonly questionBar: QuestionBar;

  private readonly controlsAlignBox: AlignBox;

  //REVIEW If you don't intend MeanShareAndBalanceScreenView to be instantiated directly, then constructor should be protected.
  public constructor( model: MeanShareAndBalanceModel, providedOptions: MeanShareAndBalanceScreenViewOptions ) {
    const options = optionize<MeanShareAndBalanceScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    super( options );

    // TODO: Can QuestionBar be built in a way that allows changing barFill and labelText after construction?
    // see: https://github.com/phetsims/scenery-phet/issues/751
     this.questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, {
      tandem: options.tandem.createTandem( 'questionBar' ),
      labelText: meanShareAndBalanceStrings.introQuestion,
      barFill: '#2496D6'
    } );

    const playAreaBounds = new Bounds2( this.layoutBounds.minX, this.layoutBounds.minY + this.questionBar.height,
      this.layoutBounds.maxX, this.layoutBounds.maxY );

    //REVIEW Factor everything related to this.syncDataButton (next 26 lines) into 'class SyncButton extends RectangularPushButton'.
    const syncRadius = 15;
    const syncIcon = new SyncIcon( syncRadius );
    const syncContent = new Node( {
      children: [
        syncIcon,
        new Text( meanShareAndBalanceStrings.sync, {
          left: syncIcon.right + 5,
          centerY: syncIcon.centerY,
          fontSize: 12,
          maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH - syncRadius
        } )
      ]
    } );

    this.syncDataButton = new RectangularPushButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.syncData();
      },
      content: syncContent,
      accessibleName: meanShareAndBalanceStrings.sync,
      right: this.layoutBounds.maxX - MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN,
      baseColor: 'white',
      //REVIEW tandem name does not match this.syncDataButton
      tandem: options.tandem.createTandem( 'syncRepresentationsButton' ),
      layoutOptions: { column: 1, row: 1, xAlign: 'left', minContentHeight: 140, yAlign: 'top' }
    } );

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      tandem: options.tandem.createTandem( 'resetAllButton' ),
      right: this.layoutBounds.maxX - MeanShareAndBalanceConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - MeanShareAndBalanceConstants.SCREEN_VIEW_Y_MARGIN
    } );

    this.controlsVBox = new VBox( {
      align: 'left',
      layoutOptions: { column: 1, row: 0 }
    } );

    this.numberSpinnerVBox = new VBox( {
      align: 'left',
      justify: 'bottom',
      spacing: 10,
      layoutOptions: { column: 1, row: 2 }
    } );

    const controlsGridBox = new GridBox( {
      children: [
        this.controlsVBox,
        this.syncDataButton,
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

    this.addChild( this.questionBar );
    this.addChild( this.resetAllButton );
    this.addChild( this.controlsAlignBox );
  }

  //REVIEW Since this does nothing, I would delete it until it's actually needed by a future screen.
  /**
   * Resets the view.
   */
  public reset(): void {
    // May be used for future screens
  }

  //REVIEW This is not necessary. ScreenView already has an identical (do nothing) implementation. Add this if/when ScreenView does something different.
  //REVIEW It's also dangerous to override without calling super.step().  If ScreenView implementation actually does something in the future, it won't get done.
  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    // See subclass for implementation
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceScreenView', MeanShareAndBalanceScreenView );