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
import { ExchangeRate, Transaction, TransactionCategory } from '@api/everytrack_backend';
import { calculateDisplayAmount, calculateTotalAssetValue, calculateInterpolateColor } from '@utils';

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

export interface RecentTransactionRecord {
  date: number;
  name: string;
  amount: string;
  income: boolean;
  category: TransactionCategory;
}

export const useDashboardState = () => {
  const { currencyId } = globalStore();

  const { cash, error: fetchCashError } = useCash();
  const { stocks, stocksMap, error: fetchStocksError } = useStocks();
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

  const { lockedFund, totalBalance, instantAccessibleBalance, assetDistribution } = React.useMemo(() => {
    let lockedFund = new BigNumber(0);
    let cashHoldings = new BigNumber(0);
    let instantAccessibleBalance = new BigNumber(0);
    if (bankAccounts && brokerAccounts && exchangeRates && currencyId && stockHoldings && stocks && cash) {
      const totalAssetValue = calculateTotalAssetValue(
        currencyId,
        cash,
        bankAccounts,
        brokerAccounts,
        exchangeRates,
        stocksMap,
        stockHoldings,
      );
      lockedFund = totalAssetValue.lockedFund;
      cashHoldings = totalAssetValue.cashHoldings;
      instantAccessibleBalance = totalAssetValue.instantAccessibleBalance;
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

  const recentTransactions = React.useMemo(() => {
    const records: RecentTransactionRecord[] = [];
    if (currencies && transactions && currencyId && exchangeRates) {
      transactions.forEach(({ name, amount, income, category, currencyId: expenseCurrencyId, executedAt: date }) => {
        records.push({
          name,
          date,
          income,
          category,
          amount: calculateDisplayAmount(amount, currencyId, expenseCurrencyId, exchangeRates).toFormat(2),
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
    assetDistribution,
    recentTransactions,
    recentTwoMonthsExpenses,
    instantAccessibleBalance,
  };
};

export default useDashboardState;
