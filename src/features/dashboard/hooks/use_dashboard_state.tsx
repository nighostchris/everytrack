import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import { Feed } from '@components';
import { store as globalStore } from '@lib/zustand';
import { Currency, Expense, Stock } from '@api/everytrack_backend';
import { calculateDisplayAmount, calculateInterpolateColor } from '@utils';
import { useBankAccounts, useBrokerAccounts, useCurrencies, useExchangeRates, useExpenses, useStockHoldings, useStocks } from '@hooks';
import { EXPENSE_CATEGORY_ICONS, EXPENSE_CATEGORY_ICON_BACKGROUND_COLORS, EXPENSE_CATEGORY_ICON_COLORS } from '@consts';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export interface AssetDistributionData {
  name: string;
  color: string;
  amount: string;
  percentage: number;
}

export interface ExpenseSnapshot {
  x: number;
  y: number;
}

export interface RecentTwoMonthsExpenseSnapshot {
  id: string;
  data: ExpenseSnapshot[];
}

export const useDashboardState = () => {
  const { currencyId } = globalStore();

  const { stocks, error: fetchStocksError } = useStocks();
  const { expenses, error: fetchExpensesError } = useExpenses();
  const { currencies, error: fetchCurrenciesError } = useCurrencies();
  const { bankAccounts, error: fetchBankAccountsError } = useBankAccounts();
  const { stockHoldings, error: fetchStockHoldingsError } = useStockHoldings();
  const { exchangeRates, error: fetchExchangeRatesError } = useExchangeRates();
  const { brokerAccounts, error: fetchBrokerAccountsError } = useBrokerAccounts();

  const error = React.useMemo(
    () =>
      fetchStocksError?.message ??
      fetchExpensesError?.message ??
      fetchCurrenciesError?.message ??
      fetchBankAccountsError?.message ??
      fetchStockHoldingsError?.message ??
      fetchExchangeRatesError?.message ??
      fetchBrokerAccountsError?.message,
    [
      fetchStocksError,
      fetchExpensesError,
      fetchCurrenciesError,
      fetchBankAccountsError,
      fetchStockHoldingsError,
      fetchExchangeRatesError,
      fetchBrokerAccountsError,
    ],
  );

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
    if (bankAccounts && brokerAccounts && exchangeRates && currencyId && stockHoldings && stocks) {
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
      stockHoldings.forEach(({ holdings }) => {
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
  }, [stocks, stockHoldings, currencyId, bankAccounts, brokerAccounts, exchangeRates]);

  // TODO: abstract this function into utils / hooks to reduce code duplication with expenses state
  const { spentThisMonth } = React.useMemo(() => {
    let spentThisMonth = new BigNumber(0);
    if (currencyId && expenses && exchangeRates) {
      const expensesInThisMonth = expenses.filter(({ executedAt }) => dayjs.unix(executedAt).isSameOrAfter(dayjs().startOf('month')));
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
          date: dayjs.unix(executedAt).format('MMM DD, YYYY'),
          icon: {
            svg: EXPENSE_CATEGORY_ICONS[category],
            background: EXPENSE_CATEGORY_ICON_BACKGROUND_COLORS[category],
            className: EXPENSE_CATEGORY_ICON_COLORS[category],
          },
        });
      });
    }
    return feeds.sort((a, b) => (dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1));
  }, [currencies, expenses]);

  const recentTwoMonthsExpenses = React.useMemo(() => {
    const snapshots: RecentTwoMonthsExpenseSnapshot[] = [];
    if (currencies && expenses && currencyId && exchangeRates) {
      const expensesMap: Map<number, Expense> = new Map();
      expenses.forEach((expense) => expensesMap.set(dayjs.unix(expense.executedAt).startOf('day').unix(), expense));
      const thisMonthExpenseSnapshots: RecentTwoMonthsExpenseSnapshot = { id: 'This Month', data: [{ x: 0, y: 0 }] };
      const lastMonthExpenseSnapshots: RecentTwoMonthsExpenseSnapshot = { id: 'Last Month', data: [{ x: 0, y: 0 }] };
      let lastValueCache = new BigNumber(0);
      // Calculate expense snapshot of current month
      for (
        let startDate = dayjs().startOf('month');
        startDate.isSameOrBefore(dayjs().endOf('month'));
        startDate = startDate.add(1, 'day')
      ) {
        const x = startDate.date();
        const expense = expensesMap.get(startDate.unix());
        if (expense) {
          const { amount, currencyId: expenseCurrencyId } = expense;
          const expenseValueInDisplayCurrency = calculateDisplayAmount(amount, currencyId, expenseCurrencyId, exchangeRates);
          lastValueCache = expenseValueInDisplayCurrency.plus(lastValueCache);
        }
        thisMonthExpenseSnapshots.data.push({ x, y: Number(lastValueCache.toFixed(0)) });
      }
      snapshots.push(thisMonthExpenseSnapshots);
      lastValueCache = new BigNumber(0);
      // Calculate expense snapshot of last month
      for (
        let startDate = dayjs().add(-1, 'month').startOf('month');
        startDate.isSameOrBefore(dayjs().add(-1, 'month').endOf('month'));
        startDate = startDate.add(1, 'day')
      ) {
        const x = startDate.date();
        const expense = expensesMap.get(startDate.unix());
        if (expense) {
          const { amount, currencyId: expenseCurrencyId } = expense;
          const expenseValueInDisplayCurrency = calculateDisplayAmount(amount, currencyId, expenseCurrencyId, exchangeRates);
          lastValueCache = expenseValueInDisplayCurrency.plus(lastValueCache);
        }
        lastMonthExpenseSnapshots.data.push({ x, y: Number(lastValueCache.toFixed(0)) });
      }
      snapshots.push(lastMonthExpenseSnapshots);
    }
    return snapshots;
  }, [currencies, expenses, currencyId, exchangeRates]);

  return {
    error,
    lockedFund,
    totalBalance,
    recentExpenses,
    spentThisMonth,
    assetDistribution,
    recentTwoMonthsExpenses,
    instantAccessibleBalance,
  };
};

export default useDashboardState;
