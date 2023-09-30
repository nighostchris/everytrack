import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';

import { Stock } from '@api/everytrack_backend';
import { store as globalStore } from '@lib/zustand';
import { calculateDisplayAmount } from '@utils';

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
        instantAccessibleBalance = instantAccessibleBalance.plus(
          calculateDisplayAmount(balance, currencyId, accountCurrencyId, exchangeRates),
        );
      });
      // Calculate locked funds
      accountStockHoldings.forEach(({ holdings }) => {
        holdings.forEach(({ unit, stockId }) => {
          const { currentPrice, currencyId: stockCurrencyId } = stocksMap.get(stockId) as Stock;
          const holdingBalance = new BigNumber(currentPrice).multipliedBy(unit);
          lockedFund = lockedFund.plus(calculateDisplayAmount(holdingBalance.toString(), currencyId, stockCurrencyId, exchangeRates));
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
      const expensesInThisMonth = expenses.filter(({ executedAt }) => dayjs.unix(executedAt).isAfter(dayjs().startOf('month')));
      expensesInThisMonth.forEach(({ amount, currencyId: expenseCurrencyId }) => {
        spentThisMonth = spentThisMonth.plus(calculateDisplayAmount(amount, currencyId, expenseCurrencyId, exchangeRates));
      });
    }
    return { spentThisMonth: spentThisMonth.toFormat(2) };
  }, [currencyId, expenses, exchangeRates]);

  return { lockedFund, totalBalance, spentThisMonth, instantAccessibleBalance };
};

export default useDashboardState;
