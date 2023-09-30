import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';

import { store as globalStore } from '@lib/zustand';
import { Currency, ExpenseCategory } from '@api/everytrack_backend';

export interface ExpensesTableRow {
  id: string;
  name: string;
  amount: string;
  remarks: string;
  spentDate: string;
  category: ExpenseCategory;
}

export interface ExpenseBarChartData {
  spentDate: number;
  [category: string]: number;
}

export const useExpensesState = () => {
  const { expenses, currencies, currencyId, exchangeRates } = globalStore();

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const expensesTableRows = React.useMemo(() => {
    const result: ExpensesTableRow[] = [];
    const currenciesMap = new Map<string, Currency>();
    if (expenses && currencies) {
      // Generate a currency map
      currencies.forEach((currency) => currenciesMap.set(currency.id, currency));
      // Populate result
      expenses.forEach(({ id, name, amount, accountId, currencyId, executedAt, remarks, category }) => {
        const currency = (currenciesMap.get(currencyId) as Currency).symbol;
        result.push({
          id,
          name,
          remarks,
          category,
          spentDate: dayjs.unix(executedAt).format('MMM DD'),
          amount: `${currency} ${new BigNumber(amount).toFormat(2)}`,
        });
      });
    }
    return result.sort((a, b) => (dayjs(a.spentDate).isBefore(dayjs(b.spentDate)) ? 1 : -1));
  }, [expenses, currencies]);

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

  const { monthlyExpenseChartData } = React.useMemo(() => {
    let monthlyExpenseChartData: ExpenseBarChartData[] = [];
    if (currencyId && expenses && exchangeRates) {
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
      // Populate the monthly expense map by traversing expenses array
      expenses.forEach(({ amount, category, currencyId: expenseCurrencyId, executedAt }) => {
        const spentDateInMonth = dayjs.unix(executedAt).startOf('month').unix();
        const monthExpenseRecords = lastSixMonthMap.get(spentDateInMonth);
        const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        if (monthExpenseRecords) {
          let accumulatedExpense: BigNumber;
          const originalExpense = monthExpenseRecords[capitalizedCategory];
          if (expenseCurrencyId === currencyId) {
            accumulatedExpense = originalExpense ? new BigNumber(amount).plus(originalExpense) : new BigNumber(amount);
          } else {
            const exchangeRate = exchangeRates.filter(
              ({ baseCurrencyId, targetCurrencyId }) => baseCurrencyId === expenseCurrencyId && targetCurrencyId === currencyId,
            )[0];
            const convertedBalance = new BigNumber(amount).multipliedBy(exchangeRate.rate);
            accumulatedExpense = originalExpense ? new BigNumber(convertedBalance).plus(originalExpense) : new BigNumber(convertedBalance);
          }
          lastSixMonthMap.set(spentDateInMonth, {
            ...monthExpenseRecords,
            [capitalizedCategory]: accumulatedExpense.decimalPlaces(2).toNumber(),
          });
        }
      });
      monthlyExpenseChartData = Array.from(lastSixMonthMap.entries()).map(([key, value]) => ({ spentDate: key, ...value }));
    }
    return { monthlyExpenseChartData: monthlyExpenseChartData.sort((a, b) => (a.spentDate > b.spentDate ? 1 : -1)) };
  }, [currencyId, expenses, exchangeRates]);

  React.useEffect(() => {
    setIsLoading(true);
    setIsLoading(false);
  }, []);

  return { isLoading, expensesTableRows, spentThisMonth, monthlyExpenseChartData };
};

export default useExpensesState;
