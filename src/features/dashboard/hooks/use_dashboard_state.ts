import React from 'react';
import BigNumber from 'bignumber.js';

import { Stock } from '@api/everytrack_backend';
import { store as globalStore } from '@lib/zustand';

export const useDashboardState = () => {
  const { bankAccounts, accountStockHoldings, stocks, currencyId, exchangeRates } = globalStore();

  const stocksMap = React.useMemo(() => {
    const map: Map<string, Stock> = new Map();
    (stocks ?? []).forEach((stock) => map.set(stock.id, stock));
    return map;
  }, [stocks]);

  const { lockedFund, totalBalance, instantAccessibleBalance } = React.useMemo(() => {
    let lockedFund = new BigNumber(0);
    let instantAccessibleBalance = new BigNumber(0);
    if (bankAccounts && exchangeRates && currencyId && accountStockHoldings && stocks) {
      // Calculate instant accessible balance
      bankAccounts.forEach(({ balance, currencyId: accountCurrencyId }) => {
        if (accountCurrencyId === currencyId) {
          instantAccessibleBalance = instantAccessibleBalance.plus(balance);
        } else {
          const exchangeRate = exchangeRates.filter(
            ({ baseCurrencyId, targetCurrencyId }) => baseCurrencyId === accountCurrencyId && targetCurrencyId === currencyId,
          )[0];
          const convertedBalance = new BigNumber(balance).multipliedBy(exchangeRate.rate);
          instantAccessibleBalance = instantAccessibleBalance.plus(convertedBalance);
        }
      });
      // Calculate locked funds
      accountStockHoldings.forEach(({ holdings }) => {
        holdings.forEach(({ unit, stockId }) => {
          const { currentPrice, currencyId: stockCurrencyId } = stocksMap.get(stockId) as Stock;
          const holdingBalance = new BigNumber(currentPrice).multipliedBy(unit);
          if (stockCurrencyId === currencyId) {
            lockedFund = lockedFund.plus(holdingBalance);
          } else {
            const exchangeRate = exchangeRates.filter(
              ({ baseCurrencyId, targetCurrencyId }) => baseCurrencyId === stockCurrencyId && targetCurrencyId === currencyId,
            )[0];
            const convertedBalance = holdingBalance.multipliedBy(exchangeRate.rate);
            lockedFund = lockedFund.plus(convertedBalance);
          }
        });
      });
    }
    return {
      lockedFund: lockedFund.toFormat(2),
      instantAccessibleBalance: instantAccessibleBalance.toFormat(2),
      totalBalance: lockedFund.plus(instantAccessibleBalance).toFormat(2),
    };
  }, [currencyId, bankAccounts, exchangeRates]);

  return { lockedFund, totalBalance, instantAccessibleBalance };
};

export default useDashboardState;
