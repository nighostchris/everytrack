import dayjs from 'dayjs';

import { calculateDisplayAmount } from '@utils';
import { ExchangeRate, Transaction } from '@api/everytrack_backend';

export function calculateMonthlyIOChartData(currencyId: string, transactions: Transaction[], exchangeRates: ExchangeRate[]) {
  // Construct a monthly transactions map
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
  const lastSixMonthTransactionsMap = new Map<number, { [category: string]: number; income: number; expense: number }>();
  lastSixMonths.forEach((unix) => lastSixMonthTransactionsMap.set(unix, { income: 0, expense: 0 }));

  // Populate the monthly transactions map by traversing transactions array
  transactions.forEach(({ amount, income, category, currencyId: expenseCurrencyId, executedAt }) => {
    const executionDateInMonth = dayjs.unix(executedAt).startOf('month').unix();
    const transactionRecords = lastSixMonthTransactionsMap.get(executionDateInMonth);
    // TO REVIEW: not sure if need to capitalize after changing metrics chart library
    const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    if (transactionRecords) {
      const { income: totalIncome, expense: totalExpense } = transactionRecords;
      const originalCategorySum = transactionRecords[capitalizedCategory];
      const amountToAdd = calculateDisplayAmount(amount, currencyId, expenseCurrencyId, exchangeRates);
      const newCategorySum = originalCategorySum ? amountToAdd.plus(originalCategorySum) : amountToAdd;
      const newRecord: any = {
        ...transactionRecords,
        income: income ? amountToAdd.plus(totalIncome).decimalPlaces(2).toNumber() : totalIncome,
        expense: !income ? amountToAdd.plus(totalExpense).decimalPlaces(2).toNumber() : totalExpense,
      };
      if (!income) {
        newRecord[capitalizedCategory] = newCategorySum.decimalPlaces(2).toNumber();
      }
      lastSixMonthTransactionsMap.set(executionDateInMonth, newRecord);
    }
  });

  return Array.from(lastSixMonthTransactionsMap.entries()).map(([key, value]) => {
    const processedData: any = { month: key, ...value };
    if (value.income === 0) {
      delete processedData.income;
    }
    if (value.expense === 0) {
      delete processedData.expense;
    } else {
      processedData.expense = -processedData.expense;
    }
    return processedData;
  });
}
