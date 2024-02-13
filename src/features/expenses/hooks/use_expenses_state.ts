import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import { calculateDisplayAmount } from '@utils';
import { store as globalStore } from '@lib/zustand';
import { Currency, ExpenseCategory } from '@api/everytrack_backend';

dayjs.extend(isSameOrAfter);

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
          spentDate: dayjs.unix(executedAt).format('MMM DD, YYYY'),
          amount: `${currency} ${new BigNumber(amount).toFormat(2)}`,
        });
      });
    }
    return result.sort((a, b) => (dayjs(a.spentDate).isBefore(dayjs(b.spentDate)) ? 1 : -1));
  }, [expenses, currencies]);

  const { spentThisMonth, spentThisYear } = React.useMemo(() => {
    let spentThisYear = new BigNumber(0);
    let spentThisMonth = new BigNumber(0);
    if (currencyId && expenses && exchangeRates) {
      const expensesInThisYear = expenses.filter(({ executedAt }) => dayjs.unix(executedAt).isSameOrAfter(dayjs().startOf('year')));
      const expensesInThisMonth = expenses.filter(({ executedAt }) => dayjs.unix(executedAt).isSameOrAfter(dayjs().startOf('month')));
      expensesInThisMonth.forEach(({ amount, currencyId: expenseCurrencyId }) => {
        spentThisMonth = spentThisMonth.plus(calculateDisplayAmount(amount, currencyId, expenseCurrencyId, exchangeRates));
      });
      expensesInThisYear.forEach(({ amount, currencyId: expenseCurrencyId }) => {
        spentThisYear = spentThisYear.plus(calculateDisplayAmount(amount, currencyId, expenseCurrencyId, exchangeRates));
      });
    }
    return { spentThisMonth: spentThisMonth.toFormat(2), spentThisYear: spentThisYear.toFormat(2) };
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
  }, [currencyId, expenses, exchangeRates]);

  React.useEffect(() => {
    setIsLoading(true);
    setIsLoading(false);
  }, []);

  return { isLoading, expensesTableRows, spentThisMonth, spentThisYear, monthlyExpenseChartData };
};

export default useExpensesState;
