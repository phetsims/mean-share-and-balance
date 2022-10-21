// Copyright 2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import LinkableProperty from '../../axon/js/LinkableProperty.js';
import meanShareAndBalance from './meanShareAndBalance.js';

type StringsType = {
  'mean-share-and-balance': {
    'title': string;
    'titleStringProperty': LinkableProperty<string>;
  };
  'screen': {
    'intro': string;
    'introStringProperty': LinkableProperty<string>;
    'levelingOut': string;
    'levelingOutStringProperty': LinkableProperty<string>;
  };
  'predictMean': string;
  'predictMeanStringProperty': LinkableProperty<string>;
  'mean': string;
  'meanStringProperty': LinkableProperty<string>;
  'tickMarks': string;
  'tickMarksStringProperty': LinkableProperty<string>;
  'cupWaterLevel': string;
  'cupWaterLevelStringProperty': LinkableProperty<string>;
  'sync': string;
  'syncStringProperty': LinkableProperty<string>;
  'numberOfCups': string;
  'numberOfCupsStringProperty': LinkableProperty<string>;
  'introQuestion': string;
  'introQuestionStringProperty': LinkableProperty<string>;
  'levelingOutQuestion': string;
  'levelingOutQuestionStringProperty': LinkableProperty<string>;
  'numberOfPeople': string;
  'numberOfPeopleStringProperty': LinkableProperty<string>;
  'meanEquals': string;
  'meanEqualsStringProperty': LinkableProperty<string>;
};

const MeanShareAndBalanceStrings = getStringModule( 'MEAN_SHARE_AND_BALANCE' ) as StringsType;

meanShareAndBalance.register( 'MeanShareAndBalanceStrings', MeanShareAndBalanceStrings );

export default MeanShareAndBalanceStrings;
