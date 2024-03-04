import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import { calculateDisplayAmount } from '@utils';
import { store as globalStore } from '@lib/zustand';
import { TRANSACTION_CATEGORY_CHART_COLORS } from '@consts';
import { Currency, TransactionCategory } from '@api/everytrack_backend';
import { useCurrencies, useExchangeRates, useTransactions } from '@hooks';
import { calculateMonthlyIOChartData, calculateWeeklyIOChartData } from '../utils';

dayjs.extend(isSameOrAfter);

export interface TransactionsTableRow {
  id: string;
  name: string;
  amount: string;
  income: boolean;
  remarks: string;
  executionDate: string;
  category: TransactionCategory;
}

export interface ExpenseBarChartData {
  spentDate: number;
  [category: string]: number;
}

interface TransactionIOChartData {
  income?: number;
  expense?: number;
}

export interface WeeklyIOChartData extends TransactionIOChartData {
  week: string;
}

export interface MonthlyIOChartData extends TransactionIOChartData {
  month: string;
}

export interface MonthlyExpenseDistributionData {
  name: string;
  color: string;
  amount: string;
  percentage: number;
}

export interface MonthlyExpenseDistribution {
  month: number;
  data: MonthlyExpenseDistributionData[];
}

export const useTransactionsState = () => {
  const { currencyId } = globalStore();

  const { currencies, error: fetchCurrenciesError } = useCurrencies();
  const { transactions, error: fetchTransactionsError } = useTransactions();
  const { exchangeRates, error: fetchExchangeRatesError } = useExchangeRates();

  const error = React.useMemo(
    () => fetchTransactionsError?.message ?? fetchCurrenciesError?.message ?? fetchExchangeRatesError?.message,
    [fetchTransactionsError, fetchCurrenciesError, fetchExchangeRatesError],
  );

  const transactionsTableRows = React.useMemo(() => {
    const result: TransactionsTableRow[] = [];
    const currenciesMap = new Map<string, Currency>();
    if (transactions && currencies) {
      // Generate a currency map
      currencies.forEach((currency) => currenciesMap.set(currency.id, currency));
      // Populate result
      transactions.forEach(({ id, name, amount, income, accountId, currencyId, executedAt, remarks, category }) => {
        const currency = (currenciesMap.get(currencyId) as Currency).symbol;
        result.push({
          id,
          name,
          income,
          remarks,
          category,
          amount: `${currency} ${new BigNumber(amount).toFormat(2)}`,
          executionDate: dayjs.unix(executedAt).format('MMM DD, YYYY'),
        });
      });
    }
    return result.sort((a, b) => (dayjs(a.executionDate).isBefore(dayjs(b.executionDate)) ? 1 : -1));
  }, [currencies, transactions]);

  const { spentThisMonth, spentThisYear } = React.useMemo(() => {
    let spentThisYear = new BigNumber(0);
    let spentThisMonth = new BigNumber(0);
    if (currencyId && transactions && exchangeRates) {
      const expensesInThisYear = transactions.filter(
        ({ income, executedAt }) => !income && dayjs.unix(executedAt).isSameOrAfter(dayjs().startOf('year')),
      );
      const expensesInThisMonth = transactions.filter(
        ({ income, executedAt }) => !income && dayjs.unix(executedAt).isSameOrAfter(dayjs().startOf('month')),
      );
      expensesInThisMonth.forEach(({ amount, currencyId: expenseCurrencyId }) => {
        spentThisMonth = spentThisMonth.plus(calculateDisplayAmount(amount, currencyId, expenseCurrencyId, exchangeRates));
      });
      expensesInThisYear.forEach(({ amount, currencyId: expenseCurrencyId }) => {
        spentThisYear = spentThisYear.plus(calculateDisplayAmount(amount, currencyId, expenseCurrencyId, exchangeRates));
      });
    }
    return { spentThisMonth: spentThisMonth.toFormat(2), spentThisYear: spentThisYear.toFormat(2) };
  }, [currencyId, transactions, exchangeRates]);

  const { weeklyIOChartData, monthlyIOChartData, monthlyExpenseDistributions } = React.useMemo(() => {
    if (currencyId && transactions && exchangeRates) {
      const weeklyIOChartData = calculateWeeklyIOChartData(currencyId, transactions, exchangeRates);
      const rawMonthlyIOChartData = calculateMonthlyIOChartData(currencyId, transactions, exchangeRates);
      const monthlyIOChartData: MonthlyIOChartData[] = rawMonthlyIOChartData
        .sort((a, b) => (a.month > b.month ? 1 : -1))
        .map((record) => {
          const processedRecord: MonthlyIOChartData = { month: dayjs.unix(record.month).format('MMM YY') };
          if (record.income) {
            processedRecord.income = record.income;
          }
          if (record.expense) {
            processedRecord.expense = record.expense;
          }
          return processedRecord;
        });
      const monthlyExpenseDistributions: MonthlyExpenseDistribution[] = rawMonthlyIOChartData
        .sort((a, b) => (a.month > b.month ? 1 : -1))
        .map((record) => {
          const data: MonthlyExpenseDistributionData[] = [];
          if (record.expense) {
            Object.entries(record).forEach(([key, value]) => {
              if (!['month', 'income', 'expense'].includes(key)) {
                data.push({
                  name: key,
                  color: TRANSACTION_CATEGORY_CHART_COLORS[key.toLowerCase()],
                  amount: BigNumber(value as number).toFormat(2),
                  percentage: Number(
                    BigNumber(value as number)
                      .dividedBy(Math.abs(record.expense))
                      .multipliedBy(100)
                      .toFormat(2),
                  ),
                });
              }
            });
          }
          return { month: record.month, data };
        });
      return { weeklyIOChartData, monthlyIOChartData, monthlyExpenseDistributions };
    }
    return { weeklyIOChartData: [], monthlyIOChartData: [], monthlyExpenseDistributions: [] };
  }, [currencyId, transactions, exchangeRates]);

  return {
    error,
    spentThisYear,
    spentThisMonth,
    weeklyIOChartData,
    monthlyIOChartData,
    transactionsTableRows,
    monthlyExpenseDistributions,
  };
};

export default useTransactionsState;
