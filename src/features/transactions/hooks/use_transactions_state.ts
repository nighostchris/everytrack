import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import { calculateDisplayAmount } from '@utils';
import { store as globalStore } from '@lib/zustand';
import { Currency, TransactionCategory } from '@api/everytrack_backend';
import { useCurrencies, useExchangeRates, useTransactions } from '@hooks';

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

  const { monthlyExpenseChartData } = React.useMemo(() => {
    let monthlyExpenseChartData: ExpenseBarChartData[] = [];
    if (currencyId && transactions && exchangeRates) {
      // Construct a monthly expense map
      const lastSixMonths: number[] = Array(6)
        .fill(true)
        .reduce(
          (acc, _, index) =>
            index === 0
              ? [dayjs().startOf('month').unix()]
              : [
                  ...acc,
                  dayjs
                    .unix(acc[index - 1])
                    .subtract(1, 'month')
                    .startOf('month')
                    .unix(),
                ],
          [],
        );
      const lastSixMonthMap = new Map<number, { [category: string]: number }>();
      lastSixMonths.forEach((unix) => lastSixMonthMap.set(unix, {}));
      // Populate the monthly expense map by traversing transactions array
      transactions.forEach(({ amount, income, category, currencyId: expenseCurrencyId, executedAt }) => {
        const spentDateInMonth = dayjs.unix(executedAt).startOf('month').unix();
        const monthExpenseRecords = lastSixMonthMap.get(spentDateInMonth);
        const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        if (monthExpenseRecords && !income) {
          const originalExpense = monthExpenseRecords[capitalizedCategory];
          const expense = calculateDisplayAmount(amount, currencyId, expenseCurrencyId, exchangeRates);
          const accumulatedExpense = originalExpense ? expense.plus(originalExpense) : expense;
          lastSixMonthMap.set(spentDateInMonth, {
            ...monthExpenseRecords,
            [capitalizedCategory]: accumulatedExpense.decimalPlaces(2).toNumber(),
          });
        }
      });
      monthlyExpenseChartData = Array.from(lastSixMonthMap.entries()).map(([key, value]) => ({ spentDate: key, ...value }));
    }
    return { monthlyExpenseChartData: monthlyExpenseChartData.sort((a, b) => (a.spentDate > b.spentDate ? 1 : -1)) };
  }, [currencyId, transactions, exchangeRates]);

  return { error, transactionsTableRows, spentThisMonth, spentThisYear, monthlyExpenseChartData };
};

export default useTransactionsState;
