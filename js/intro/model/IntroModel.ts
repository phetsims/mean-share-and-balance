// Copyright 2022, University of Colorado Boulder

/**
 * Model for the Leveling Out screen, which includes 2d cups, 3d cups, connecting pipes, and view options.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import MeanShareAndBalanceModel, { MeanShareAndBalanceModelOptions } from '../../common/model/MeanShareAndBalanceModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import PipeModel from './PipeModel.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import WaterCupModel from './WaterCupModel.js';
import Utils from '../../../../dot/js/Utils.js';

type SelfOptions = EmptyObjectType;

type IntroModelOptions = SelfOptions & PickRequired<MeanShareAndBalanceModelOptions, 'tandem'>;

export default class IntroModel extends MeanShareAndBalanceModel {

  // TODO: Should this be able to go to 0 for PhET-iO? https://github.com/phetsims/mean-share-and-balance/issues/18
  public readonly numberOfCupsRange = new Range( 1, 7 );
  public readonly dragRange = new Range( MeanShareAndBalanceConstants.CUP_RANGE_MIN, MeanShareAndBalanceConstants.CUP_RANGE_MAX );
  public readonly cupRange = new Range( MeanShareAndBalanceConstants.CUP_RANGE_MIN, MeanShareAndBalanceConstants.CUP_RANGE_MAX );

  public readonly isShowingPredictMeanProperty: BooleanProperty;
  public readonly isShowingMeanProperty: BooleanProperty;
  public readonly isShowingTickMarksProperty: BooleanProperty;
  public readonly isAutoSharingProperty: BooleanProperty;
  public readonly numberOfCupsProperty: NumberProperty;
  public readonly meanPredictionProperty: NumberProperty;
  public readonly meanProperty: NumberProperty;

  public readonly waterCup3DGroup: PhetioGroup<WaterCupModel, [ x: number ]>;
  public readonly waterCup2DGroup: PhetioGroup<WaterCupModel, [ x: number ]>;

  public readonly pipeGroup: PhetioGroup<PipeModel, [ x: number, y: number, isOpen?: boolean ]>;

  public constructor( providedOptions?: IntroModelOptions ) {

    const options = optionize<IntroModelOptions, SelfOptions, MeanShareAndBalanceModelOptions>()( {}, providedOptions );
    super( options );

    this.isShowingPredictMeanProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingPredictMeanProperty' )
    } );
    this.isShowingMeanProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingMeanProperty' )
    } );
    this.isShowingTickMarksProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingTickMarksProperty' )
    } );
    this.isAutoSharingProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isAutoSharingProperty' )
    } );
    this.meanPredictionProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'meanPredictionProperty' ),
      phetioDocumentation: 'Indicates where the user predicted the mean would be, or the default value at startup',
      range: new Range( MeanShareAndBalanceConstants.CUP_RANGE_MIN, MeanShareAndBalanceConstants.CUP_RANGE_MAX )
    } );

    this.numberOfCupsProperty = new NumberProperty( MeanShareAndBalanceConstants.INITIAL_NUMBER_OF_CUPS, {
      tandem: options.tandem.createTandem( 'numberOfCupsProperty' ),
      numberType: 'Integer',
      range: this.numberOfCupsRange
    } );

    // The 3D cups are the "ground truth" and the 2D cups mirror them
    this.waterCup3DGroup = new PhetioGroup( ( tandem: Tandem, x: number ) => {

      return new WaterCupModel( {
        tandem: tandem,
        x: x,
        y: MeanShareAndBalanceConstants.CUPS_3D_Y_VALUE
      } );
    }, [ 0 ], {
      phetioType: PhetioGroup.PhetioGroupIO( WaterCupModel.WaterCupModelIO ),
      phetioDocumentation: 'Holds the models for the 3D water cups.',
      tandem: options.tandem.createTandem( 'waterCup3DGroup' )
    } );

    this.waterCup2DGroup = new PhetioGroup( ( tandem: Tandem, x: number ) => {
      return new WaterCupModel( {
        tandem: tandem,
        x: x,
        y: MeanShareAndBalanceConstants.CUPS_2D_Y_VALUE,
        waterLevelPropertyOptions: {
          phetioReadOnly: true
        }
      } );
    }, [ 0 ], {
      phetioType: PhetioGroup.PhetioGroupIO( WaterCupModel.WaterCupModelIO ),
      phetioDocumentation: 'Holds the models for the 2D water cups.',
      tandem: options.tandem.createTandem( 'waterCup2DGroup' )
    } );

    this.pipeGroup = new PhetioGroup( ( tandem: Tandem, x: number, y: number, isOpen?: boolean ) => {
      return new PipeModel( { x: x, y: y, isOpen: isOpen, tandem: tandem } );
    }, [ 0, 0, false ], {
      phetioType: PhetioGroup.PhetioGroupIO( PipeModel.PipeModelIO ),
      phetioDocumentation: 'Holds the connecting pipes for the 2D water cups.',
      tandem: options.tandem.createTandem( 'pipeGroup' )
    } );

    // This value is derived from the water levels in all the cups, but cannot be modeled as a DerivedProperty since
    // the number of cups varies
    this.meanProperty = new NumberProperty( MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT, {
      tandem: options.tandem.createTandem( 'meanProperty' ),
      phetioDocumentation: 'The ground truth water level mean.',
      phetioReadOnly: true,
      range: new Range( MeanShareAndBalanceConstants.CUP_RANGE_MIN, MeanShareAndBalanceConstants.CUP_RANGE_MAX )
    } );

    // add/remove water cups and pipes according to number spinner
    const numberOfCupsListener = ( numberOfCups: number ) => {
      while ( numberOfCups > this.waterCup3DGroup.count ) {

        const lastWaterCup: WaterCupModel | null = this.waterCup3DGroup.count > 0 ? this.waterCup3DGroup.getLastElement() : null;
        const x = lastWaterCup ?
                  lastWaterCup.x + ( MeanShareAndBalanceConstants.CUP_WIDTH + MeanShareAndBalanceConstants.PIPE_LENGTH ) :
                  0;
        this.waterCup3DGroup.createNextElement( x );
        const new2DCup = this.waterCup2DGroup.createNextElement( x );

        lastWaterCup && this.pipeGroup.createNextElement( lastWaterCup.x, new2DCup.y, this.isAutoSharingProperty.value );
      }
      while ( numberOfCups < this.waterCup3DGroup.count ) {
        this.waterCup3DGroup.disposeElement( this.waterCup3DGroup.getLastElement() );
        this.waterCup2DGroup.disposeElement( this.waterCup2DGroup.getLastElement() );
        if ( numberOfCups > 0 ) {
          this.pipeGroup.disposeElement( this.pipeGroup.getLastElement() );
        }
        this.matchCupWaterLevels();
      }
      this.updateMeanFrom3DCups();

      this.assertConsistentState();
    };
    this.numberOfCupsProperty.link( numberOfCupsListener );

    // Opens pipes when auto share is enabled
    this.isAutoSharingProperty.link( isAutoSharing => {

      // When a user checks auto-share it should open all the pipes, when a user unchecks auto-share
      // it closes all the pipes, but when a user opens a pipe and auto-share is checked
      // only the clicked pipe should close and auto-share unchecks.
      // isCurrentlyClickedProperty tracks the pipe's state to allow us to determine which pipes should open.
      const clickedPipe = this.pipeGroup.find( pipe => pipe.isCurrentlyClickedProperty.value );
      !clickedPipe && this.pipeGroup.forEach( pipe => pipe.isOpenProperty.set( isAutoSharing ) );
    } );

    assert && phet.joist.sim.isSettingPhetioStateProperty.link( () => {

      // In https://github.com/phetsims/mean-share-and-balance/issues/37, we found that after state set in some cases
      // the number of cups wasn't being updated to match the numberOfCupsProperty. We are not sure why. But calling
      // update manually here seems to work around the problem.
      numberOfCupsListener( this.numberOfCupsProperty.value );
    } );
  }

  /**
   * The 3D cups define the ground truth of the amount of water, this updates the mean from those values.
   */
  private updateMeanFrom3DCups(): void {
    this.meanProperty.set( calculateMean( this.waterCup3DGroup.map( waterCup3D => waterCup3D.waterLevelProperty.value ) ) );
  }

  /**
   * Return array of sets of cups connected by open pipes
   */
  private getSetsOfConnectedCups(): Array<Set<WaterCupModel>> {
    const setsOfConnectedCups: Array<Set<WaterCupModel>> = [];
    let currentSet = new Set<WaterCupModel>();
    let index = 0;

    // organize into sets of connected cups
    this.waterCup2DGroup.forEach( cup => {
      currentSet.add( cup );
      if ( this.pipeGroup.count > index ) {
        if ( !this.pipeGroup.getElement( index ).isOpenProperty.value ) {
          setsOfConnectedCups.push( currentSet );
          currentSet = new Set<WaterCupModel>();
        }
        index += 1;
      }
      else if ( this.waterCup2DGroup.getLastElement() === cup ) {
        setsOfConnectedCups.push( currentSet );
      }
    } );

    return setsOfConnectedCups;
  }

  /**
   * Called during step(), levels out the water levels for the connected cups.
   * @param dt - time elapsed since last frame in seconds
   */
  private stepWaterLevels( dt: number ): void {
    const setsOfConnectedCups = this.getSetsOfConnectedCups();

    // calculate and set mean
    setsOfConnectedCups.forEach( cupsSet => {
      const waterMean = calculateMean( Array.from( cupsSet ).map( cup => cup.waterLevelProperty.value ) );
      cupsSet.forEach( cup => {
        const currentWaterLevel = cup.waterLevelProperty.value;
        const delta = waterMean - currentWaterLevel;

        let discrepancy = 5;

        // Adjusts discrepancy so that water flows faster between cups when the mean is very low or very high.
        if ( waterMean >= 0.9 ) {
          discrepancy = Utils.linear( 0.9, 1, 5, 50, waterMean );
        }
        else if ( waterMean <= 0.1 ) {
          discrepancy = Utils.linear( 0.1, 0, 5, 50, waterMean );
        }

        // Animate water non-linearly. Higher discrepancy means the water will flow faster.
        // When the water levels are closer, it will slow down.
        let newWaterLevel = Math.max( 0, currentWaterLevel + delta * dt * discrepancy );

        // Clamp newWaterLevel to ensure it is not outside the currentWaterLevel and waterMean range.
        if ( waterMean > currentWaterLevel ) {
          newWaterLevel = Utils.clamp( newWaterLevel, currentWaterLevel, waterMean );
        }
        else {
          newWaterLevel = Utils.clamp( newWaterLevel, waterMean, currentWaterLevel );
        }

        cup.waterLevelProperty.set( newWaterLevel );
      } );
    } );
  }

  /**
   * Reset 2D waterLevelProperty to 3D waterLevelProperty.
   */
  private matchCupWaterLevels(): void {
    this.iterateCups( ( cup2D, cup3D ) => {
      cup2D.waterLevelProperty.set( cup3D.waterLevelProperty.value );
    } );
  }

  /**
   * Matches the 2D cup water level representations to their respective 3D cup water level
   * Will close all open pipe valves
   * Called when the syncDataRectangularButton is pressed.
   */
  public override syncData(): void {
    super.syncData();
    this.assertConsistentState();
    this.isAutoSharingProperty.set( false );
    this.pipeGroup.forEach( pipe => pipe.isOpenProperty.set( false ) );
    this.matchCupWaterLevels();
  }

  /**
   * Visit pairs of 2D/3D cups
   */
  private iterateCups( callback: ( cup2D: WaterCupModel, cup3D: WaterCupModel ) => void ): void {
    for ( let i = 0; i < this.numberOfCupsProperty.value; i++ ) {
      callback( this.waterCup2DGroup.getElement( i ), this.waterCup3DGroup.getElement( i ) );
    }
  }

  /**
   * @param dt - in seconds
   */
  public override step( dt: number ): void {

    this.assertConsistentState();

    super.step( dt );
    this.stepWaterLevels( dt );

    assert && assert( !phet.joist.sim.isSettingPhetioStateProperty.value, 'Cannot step while setting state' );

    this.iterateCups( ( cup2D, cup3D ) => {

      // Whichever cup (2D or 3D) has more determines how high the user can drag that value.
      // If the 3D cup has more, the user can drag to 1.
      const max = Math.min( 1 - cup2D.waterLevelProperty.value + cup3D.waterLevelProperty.value, 1 );

      // Whichever cup (2d or 3d cup) has less determines how low the user can drag that value.
      // If the 3d cup has less, the user can drag all the way to 0.
      const min = Math.max( cup3D.waterLevelProperty.value - cup2D.waterLevelProperty.value, 0 );

      // Constrain range based on remaining space in cups.
      cup3D.enabledRangeProperty.set( new Range( min, max ) );
    } );
  }

  private assertConsistentState(): void {
    const numberOfCups = this.numberOfCupsProperty.value;
    assert && assert( numberOfCups === this.waterCup3DGroup.count, `Expected ${numberOfCups} cups, but found: ${this.waterCup3DGroup.count}.` );
    assert && assert( numberOfCups === this.waterCup2DGroup.count, `Expected ${numberOfCups} cups, but found: ${this.waterCup2DGroup.count}.` );
    assert && assert( numberOfCups > 0, 'There should always be at least 1 cup' );
    assert && assert( this.waterCup3DGroup.count - 1 === this.pipeGroup.count, `The length of pipes is: ${this.pipeGroup.count}, but should be one less the length of water cups or: ${this.waterCup3DGroup.count - 1}.` );
  }

  public override reset(): void {
    super.reset();
    this.isShowingPredictMeanProperty.reset();
    this.isShowingMeanProperty.reset();
    this.isShowingTickMarksProperty.reset();
    this.isAutoSharingProperty.reset();
    this.numberOfCupsProperty.reset();
    this.meanPredictionProperty.reset();

    // NOTE: This will auto-delete the corresponding 2d cups, since those are synchronized above
    while ( this.waterCup3DGroup.count > MeanShareAndBalanceConstants.INITIAL_NUMBER_OF_CUPS ) {
      this.waterCup3DGroup.disposeElement( this.waterCup3DGroup.getLastElement() );
      this.pipeGroup.dispose();
    }
    this.waterCup3DGroup.forEach( waterCup3D => waterCup3D.reset() );
    this.waterCup2DGroup.forEach( waterCup2D => waterCup2D.reset() );

    this.meanProperty.reset();
    this.assertConsistentState();
  }

  /**
   * Constrains water level deltas within cup range.
   * @param delta - the number value between the oldWaterLevel and the newWaterLevel
   * @param range - the allowed waterLevelProperty range in each cup
   * @param waterLevelProperty - The property tracking the water level in each cup's model.
   */
  private static constrainDelta( delta: number, range: Range, waterLevelProperty: NumberProperty ): number {
    const newWaterLevel = waterLevelProperty.value + delta;
    const constrainedWaterLevel = range.constrainValue( newWaterLevel );
    return constrainedWaterLevel - waterLevelProperty.value;
  }

  /**
   * @param cup3DModel - The model for the affected 3D cup
   * @param adapterProperty - allows us to confirm water levels and their deltas are within range before setting each cup's own waterLevelProperty.
   *  Without an adapter property waterLevels become disconnected, and our visual representations do not match the data set.
   * @param waterLevel - The current waterLevel
   * @param oldWaterLevel - The previous waterLevel
   */
  public changeWaterLevel( cup3DModel: WaterCupModel, adapterProperty: NumberProperty, waterLevel: number, oldWaterLevel: number ): void {

    const index = this.waterCup3DGroup.indexOf( cup3DModel );
    const new2DCup = this.waterCup2DGroup.getElement( index );

    const proposedDelta = waterLevel - oldWaterLevel;

    const constrained2DDelta = IntroModel.constrainDelta( proposedDelta, this.cupRange, new2DCup.waterLevelProperty );
    const constrained3DDelta = IntroModel.constrainDelta( proposedDelta, this.cupRange, cup3DModel.waterLevelProperty );

    // Use whichever delta is more limiting
    const actualDelta = Math.abs( constrained2DDelta ) < Math.abs( constrained3DDelta ) ? constrained2DDelta : constrained3DDelta;

    cup3DModel.waterLevelProperty.set( cup3DModel.waterLevelProperty.value + actualDelta );
    new2DCup.waterLevelProperty.set( new2DCup.waterLevelProperty.value + actualDelta );

    // Whichever cup (2D or 3D) has more determines how high the user can drag that value.
    // If the 3D cup has more, the user can drag to 1.
    const max = Math.min( 1 - new2DCup.waterLevelProperty.value + cup3DModel.waterLevelProperty.value, 1 );

    // Whichever cup (2d or 3d cup) has less determines how low the user can drag that value.
    // If the 3d cup has less, the user can drag all the way to 0.
    const min = Math.max( cup3DModel.waterLevelProperty.value - new2DCup.waterLevelProperty.value, 0 );

    // Constrain range based on remaining space in cups.
    cup3DModel.enabledRangeProperty.set( new Range( min, max ) );
    this.updateMeanFrom3DCups();

    const total2DWater = _.sum( this.waterCup2DGroup.map( cup => cup.waterLevelProperty.value ) );
    const total3DWater = _.sum( this.waterCup3DGroup.map( cup => cup.waterLevelProperty.value ) );
    const totalWaterThreshold = Math.abs( total2DWater - total3DWater );
    assert && assert( totalWaterThreshold <= 1E-8, `Total 2D and 3D water should be equal. 2D Water: ${total2DWater} 3D Water: ${total3DWater}` );
  }
}

function calculateMean( values: number[] ): number {
  assert && assert( values.length > 0, 'calculateMean requires at least one value' );
  return _.mean( values );
}

meanShareAndBalance.register( 'IntroModel', IntroModel );