import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';

import { Stock } from '@api/everytrack_backend';
import { store as globalStore } from '@lib/zustand';

export const useDashboardState = () => {
  const { bankAccounts, accountStockHoldings, expenses, stocks, currencyId, exchangeRates } = globalStore();

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
  }, [stocks, accountStockHoldings, currencyId, bankAccounts, exchangeRates]);

  const { spentThisMonth } = React.useMemo(() => {
    let spentThisMonth = new BigNumber(0);
    if (currencyId && expenses && exchangeRates) {
      const expensesInThisMonth = expenses.filter(({ executedAt }) => dayjs.unix(executedAt).isBefore(dayjs().endOf('month')));
      expensesInThisMonth.forEach(({ amount, currencyId: expenseCurrencyId }) => {
        if (expenseCurrencyId === currencyId) {
          spentThisMonth = spentThisMonth.plus(amount);
        } else {
          const exchangeRate = exchangeRates.filter(
            ({ baseCurrencyId, targetCurrencyId }) => baseCurrencyId === expenseCurrencyId && targetCurrencyId === currencyId,
          )[0];
          const convertedBalance = new BigNumber(amount).multipliedBy(exchangeRate.rate);
          spentThisMonth = spentThisMonth.plus(convertedBalance);
        }
      });
    }
    return { spentThisMonth: spentThisMonth.toFormat(2) };
  }, [currencyId, expenses, exchangeRates]);

  return { lockedFund, totalBalance, spentThisMonth, instantAccessibleBalance };
};

export default useDashboardState;
