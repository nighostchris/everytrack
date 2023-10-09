import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';

import { Feed } from '@components';
import { store as globalStore } from '@lib/zustand';
import { Currency, Stock } from '@api/everytrack_backend';
import { calculateDisplayAmount, calculateInterpolateColor } from '@utils';
import { EXPENSE_CATEGORY_ICONS, EXPENSE_CATEGORY_ICON_BACKGROUND_COLORS, EXPENSE_CATEGORY_ICON_COLORS } from '@consts';

export interface AssetDistributionData {
  name: string;
  color: string;
  amount: string;
  percentage: number;
}

export const useDashboardState = () => {
  const { bankAccounts, brokerAccounts, accountStockHoldings, expenses, stocks, currencies, currencyId, exchangeRates } = globalStore();

  const stocksMap = React.useMemo(() => {
    const map: Map<string, Stock> = new Map();
    (stocks ?? []).forEach((stock) => map.set(stock.id, stock));
    return map;
  }, [stocks]);

  const currenciesMap = React.useMemo(() => {
    const map: Map<string, Currency> = new Map();
    (currencies ?? []).forEach((currency) => map.set(currency.id, currency));
    return map;
  }, [currencies]);

  const { lockedFund, totalBalance, instantAccessibleBalance, assetDistribution } = React.useMemo(() => {
    let lockedFund = new BigNumber(0);
    let instantAccessibleBalance = new BigNumber(0);
    if (bankAccounts && brokerAccounts && exchangeRates && currencyId && accountStockHoldings && stocks) {
      // Calculate instant accessible balance
      bankAccounts.forEach(({ balance, currencyId: accountCurrencyId }) => {
        instantAccessibleBalance = instantAccessibleBalance.plus(
          calculateDisplayAmount(balance, currencyId, accountCurrencyId, exchangeRates),
        );
      });
      brokerAccounts.forEach(({ balance, currencyId: accountCurrencyId }) => {
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
    const totalBalance = lockedFund.plus(instantAccessibleBalance);
    return {
      lockedFund: lockedFund.toFormat(2),
      totalBalance: totalBalance.toFormat(2),
      instantAccessibleBalance: instantAccessibleBalance.toFormat(2),
      assetDistribution: [
        {
          name: 'Cash',
          amount: instantAccessibleBalance.toFormat(2),
          percentage: Number(instantAccessibleBalance.dividedBy(totalBalance).multipliedBy(100).toFormat(2)),
          color: calculateInterpolateColor('#C0DEF7', '#0F2C4A', instantAccessibleBalance.dividedBy(totalBalance).toNumber()),
        },
        {
          name: 'Equities',
          amount: lockedFund.toFormat(2),
          percentage: Number(lockedFund.dividedBy(totalBalance).multipliedBy(100).toFormat(2)),
          color: calculateInterpolateColor('#C0DEF7', '#0F2C4A', lockedFund.dividedBy(totalBalance).toNumber()),
        },
      ] as AssetDistributionData[],
    };
  }, [stocks, accountStockHoldings, currencyId, bankAccounts, brokerAccounts, exchangeRates]);

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

  const recentExpenses = React.useMemo(() => {
    const feeds: Feed[] = [];
    if (currencies && expenses) {
      expenses.forEach(({ name, amount, category, currencyId: expenseCurrencyId, executedAt }) => {
        feeds.push({
          content: (
            <p className="text-sm text-gray-500">
              {`Spent `}
              <span className="font-medium text-gray-800">{`${currenciesMap.get(expenseCurrencyId)?.symbol}${amount}`}</span>
              {` on ${name}`}
            </p>
          ),
          date: dayjs.unix(executedAt).format('MMM DD'),
          icon: {
            svg: EXPENSE_CATEGORY_ICONS[category],
            background: EXPENSE_CATEGORY_ICON_BACKGROUND_COLORS[category],
            className: EXPENSE_CATEGORY_ICON_COLORS[category],
          },
        });
      });
    }
    return feeds;
  }, [currencies, expenses]);

  return { lockedFund, totalBalance, recentExpenses, spentThisMonth, assetDistribution, instantAccessibleBalance };
};

export default useDashboardState;
