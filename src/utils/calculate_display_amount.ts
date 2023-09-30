import BigNumber from 'bignumber.js';

import { ExchangeRate } from '@api/everytrack_backend';

export function calculateDisplayAmount(amount: string, displayCurrencyId: string, sourceCurrencyId: string, exchangeRates: ExchangeRate[]) {
  if (sourceCurrencyId === displayCurrencyId) {
    return new BigNumber(amount);
  } else {
    const exchangeRate = exchangeRates.filter(
      ({ baseCurrencyId, targetCurrencyId }) => baseCurrencyId === sourceCurrencyId && targetCurrencyId === displayCurrencyId,
    )[0];
    const convertedBalance = new BigNumber(amount).multipliedBy(exchangeRate.rate);
    return new BigNumber(convertedBalance);
  }
}
