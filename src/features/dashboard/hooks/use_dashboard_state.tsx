import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import {
  useCash,
  useStocks,
  useCurrencies,
  useTransactions,
  useBankAccounts,
  useStockHoldings,
  useExchangeRates,
  useBrokerAccounts,
} from '@hooks';
import { store as globalStore } from '@lib/zustand';
import { calculateDisplayAmount, calculateInterpolateColor } from '@utils';
import { ExchangeRate, Transaction, Stock, TransactionCategory } from '@api/everytrack_backend';

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

export interface RecentExpenseRecord {
  date: number;
  name: string;
  amount: string;
  category: TransactionCategory;
}

export const useDashboardState = () => {
  const { currencyId } = globalStore();

  const { cash, error: fetchCashError } = useCash();
  const { stocks, error: fetchStocksError } = useStocks();
  const { currencies, error: fetchCurrenciesError } = useCurrencies();
  const { transactions, error: fetchTransactionsError } = useTransactions();
  const { bankAccounts, error: fetchBankAccountsError } = useBankAccounts();
  const { stockHoldings, error: fetchStockHoldingsError } = useStockHoldings();
  const { exchangeRates, error: fetchExchangeRatesError } = useExchangeRates();
  const { brokerAccounts, error: fetchBrokerAccountsError } = useBrokerAccounts();

  const error = React.useMemo(
    () =>
      fetchCashError?.message ??
      fetchStocksError?.message ??
      fetchCurrenciesError?.message ??
      fetchBankAccountsError?.message ??
      fetchTransactionsError?.message ??
      fetchStockHoldingsError?.message ??
      fetchExchangeRatesError?.message ??
      fetchBrokerAccountsError?.message,
    [
      fetchCashError,
      fetchStocksError,
      fetchCurrenciesError,
      fetchTransactionsError,
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

  const { lockedFund, totalBalance, instantAccessibleBalance, assetDistribution } = React.useMemo(() => {
    let lockedFund = new BigNumber(0);
    let cashHoldings = new BigNumber(0);
    let instantAccessibleBalance = new BigNumber(0);
    if (bankAccounts && brokerAccounts && exchangeRates && currencyId && stockHoldings && stocks && cash) {
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
      cash.forEach(({ amount, currencyId: cashCurrencyId }) => {
        cashHoldings = cashHoldings.plus(calculateDisplayAmount(amount, currencyId, cashCurrencyId, exchangeRates));
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
    const totalBalance = lockedFund.plus(instantAccessibleBalance).plus(cashHoldings);
    return {
      lockedFund: lockedFund.toFormat(2),
      totalBalance: totalBalance.toFormat(2),
      instantAccessibleBalance: instantAccessibleBalance.plus(cashHoldings).toFormat(2),
      assetDistribution: [
        {
          name: 'Cash',
          amount: cashHoldings.toFormat(2),
          percentage: Number(cashHoldings.dividedBy(totalBalance).multipliedBy(100).toFormat(2)),
          color: calculateInterpolateColor('#C0DEF7', '#0F2C4A', cashHoldings.dividedBy(totalBalance).toNumber()),
        },
        {
          name: 'Bank Savings',
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
  }, [cash, stocks, stockHoldings, currencyId, bankAccounts, brokerAccounts, exchangeRates]);

  const recentExpenses = React.useMemo(() => {
    const records: RecentExpenseRecord[] = [];
    if (currencies && transactions && currencyId && exchangeRates) {
      transactions.forEach(({ name, amount, category, currencyId: expenseCurrencyId, executedAt: date }) => {
        records.push({
          name,
          amount: calculateDisplayAmount(amount, currencyId, expenseCurrencyId, exchangeRates).toFormat(2),
          category,
          date,
        });
      });
    }
    return records.sort((a, b) => (dayjs.unix(a.date).isBefore(dayjs.unix(b.date)) ? 1 : -1)).slice(0, 5);
  }, [currencies, transactions, currencyId, exchangeRates]);

  const calculateExpenseSnapshotsByMonth = (
    id: string,
    start: dayjs.Dayjs,
    end: dayjs.Dayjs,
    currencyId: string,
    expensesMap: Map<number, Transaction>,
    exchangeRates: ExchangeRate[],
  ) => {
    let lastValueCache = new BigNumber(0);
    const snapshots: ExpenseSnapshot[] = [{ x: 0, y: 0 }];
    for (let startDate = start; startDate.isSameOrBefore(end); startDate = startDate.add(1, 'day')) {
      const x = startDate.date();
      const expense = expensesMap.get(startDate.unix());
      if (expense) {
        const { amount, currencyId: expenseCurrencyId } = expense;
        const expenseValueInDisplayCurrency = calculateDisplayAmount(amount, currencyId, expenseCurrencyId, exchangeRates);
        lastValueCache = expenseValueInDisplayCurrency.plus(lastValueCache);
      }
      snapshots.push({ x, y: Number(lastValueCache.toFixed(0)) });
    }
    return { id, data: snapshots };
  };

  const recentTwoMonthsExpenses = React.useMemo(() => {
    const snapshots: RecentTwoMonthsExpenseSnapshot[] = [];
    if (currencies && transactions && currencyId && exchangeRates) {
      const expensesMap: Map<number, Transaction> = new Map();
      transactions.forEach((transaction) => {
        if (!transaction.income) {
          expensesMap.set(dayjs.unix(transaction.executedAt).startOf('day').unix(), transaction);
        }
      });
      // Expense snapshots of current month
      snapshots.push(
        calculateExpenseSnapshotsByMonth(
          'This Month',
          dayjs().startOf('month'),
          dayjs().endOf('month'),
          currencyId,
          expensesMap,
          exchangeRates,
        ),
      );
      // Expense snapshots of last month
      snapshots.push(
        calculateExpenseSnapshotsByMonth(
          'Last Month',
          dayjs().add(-1, 'month').startOf('month'),
          dayjs().add(-1, 'month').endOf('month'),
          currencyId,
          expensesMap,
          exchangeRates,
        ),
      );
    }
    return snapshots;
  }, [currencies, transactions, currencyId, exchangeRates]);

  return {
    error,
    lockedFund,
    totalBalance,
    recentExpenses,
    assetDistribution,
    recentTwoMonthsExpenses,
    instantAccessibleBalance,
  };
};

export default useDashboardState;
