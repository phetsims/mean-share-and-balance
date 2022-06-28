// Copyright 2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import meanShareAndBalance from './meanShareAndBalance.js';

type StringsType = {
  'mean-share-and-balance': {
    'title': string;
  };
  'screen': {
    'intro': string;
    'levelingOut': string;
  };
  'predictMean': string;
  'showMean': string;
  'tickMarks': string;
  'autoShare': string;
  'sync': string;
  'numberOfCups': string;
  'introQuestion': string;
};

const meanShareAndBalanceStrings = getStringModule( 'MEAN_SHARE_AND_BALANCE' ) as StringsType;

meanShareAndBalance.register( 'meanShareAndBalanceStrings', meanShareAndBalanceStrings );

export default meanShareAndBalanceStrings;
