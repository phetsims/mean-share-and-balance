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
    'titleProperty': TReadOnlyProperty<string>;
  };
  'screen': {
    'intro': string;
    'introProperty': TReadOnlyProperty<string>;
    'levelingOut': string;
    'levelingOutProperty': TReadOnlyProperty<string>;
  };
  'predictMean': string;
  'predictMeanProperty': TReadOnlyProperty<string>;
  'mean': string;
  'meanProperty': TReadOnlyProperty<string>;
  'tickMarks': string;
  'tickMarksProperty': TReadOnlyProperty<string>;
  'sync': string;
  'syncProperty': TReadOnlyProperty<string>;
  'numberOfCups': string;
  'numberOfCupsProperty': TReadOnlyProperty<string>;
  'introQuestion': string;
  'introQuestionProperty': TReadOnlyProperty<string>;
  'levelingOutQuestion': string;
  'levelingOutQuestionProperty': TReadOnlyProperty<string>;
};

const meanShareAndBalanceStrings = getStringModule( 'MEAN_SHARE_AND_BALANCE' ) as StringsType;

meanShareAndBalance.register( 'meanShareAndBalanceStrings', meanShareAndBalanceStrings );

export default meanShareAndBalanceStrings;
