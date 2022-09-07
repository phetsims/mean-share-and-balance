// Copyright 2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import meanShareAndBalance from './meanShareAndBalance.js';

type StringsType = {
  'mean-share-and-balance': {
    'title': string;
    'titleStringProperty': TReadOnlyProperty<string>;
  };
  'screen': {
    'intro': string;
    'introStringProperty': TReadOnlyProperty<string>;
    'levelingOut': string;
    'levelingOutStringProperty': TReadOnlyProperty<string>;
  };
  'predictMean': string;
  'predictMeanStringProperty': TReadOnlyProperty<string>;
  'mean': string;
  'meanStringProperty': TReadOnlyProperty<string>;
  'tickMarks': string;
  'tickMarksStringProperty': TReadOnlyProperty<string>;
  'cupWaterLevel': string;
  'cupWaterLevelStringProperty': TReadOnlyProperty<string>;
  'sync': string;
  'syncStringProperty': TReadOnlyProperty<string>;
  'numberOfCups': string;
  'numberOfCupsStringProperty': TReadOnlyProperty<string>;
  'introQuestion': string;
  'introQuestionStringProperty': TReadOnlyProperty<string>;
  'levelingOutQuestion': string;
  'levelingOutQuestionStringProperty': TReadOnlyProperty<string>;
  'numberOfPeople': string;
  'numberOfPeopleStringProperty': TReadOnlyProperty<string>;
};

const MeanShareAndBalanceStrings = getStringModule( 'MEAN_SHARE_AND_BALANCE' ) as StringsType;

meanShareAndBalance.register( 'MeanShareAndBalanceStrings', MeanShareAndBalanceStrings );

export default MeanShareAndBalanceStrings;
