import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';

import { calculateDisplayAmount } from '@utils';
import { ExchangeRate, Transaction } from '@api/everytrack_backend';

export function calculateWeeklyIOChartData(currencyId: string, transactions: Transaction[], exchangeRates: ExchangeRate[]) {
  // Construct a daily transactions map for current month
  const allDaysInCurrentMonth: number[] = Array(dayjs().daysInMonth())
    .fill(true)
    .reduce(
      (acc, _, index) =>
        index === 0
          ? [dayjs().startOf('month').unix()]
          : [
              ...acc,
              dayjs
                .unix(acc[index - 1])
                .add(1, 'day')
                .unix(),
            ],
      [],
    );
  const currentMonthTransactionsMap = new Map<number, { income: number; expense: number }>();
  allDaysInCurrentMonth.forEach((unix) => currentMonthTransactionsMap.set(unix, { income: 0, expense: 0 }));

  // Populate the daily transactions map by traversing transactions array
  transactions.forEach(({ amount, income, currencyId: expenseCurrencyId, executedAt }) => {
    const executionDateInDay = dayjs.unix(executedAt).startOf('day').unix();
    const transactionRecord = currentMonthTransactionsMap.get(executionDateInDay);
    if (transactionRecord) {
      const { income: totalIncome, expense: totalExpense } = transactionRecord;
      const amountToAdd = calculateDisplayAmount(amount, currencyId, expenseCurrencyId, exchangeRates);
      currentMonthTransactionsMap.set(executionDateInDay, {
        ...transactionRecord,
        income: income ? amountToAdd.plus(totalIncome).decimalPlaces(2).toNumber() : totalIncome,
        expense: !income ? amountToAdd.plus(totalExpense).decimalPlaces(2).toNumber() : totalExpense,
      });
    }
  });

  // Construct weekly IO chart data
  let weekCounter = 1;
  let currentWeekIO: any = {};
  let endDayInCurrentMonth = dayjs().endOf('month').startOf('day');
  const weeklyIOChartData: { week: string; income: number; expense: number }[] = [];
  for (let date = dayjs().startOf('month'); date.isSameOrBefore(endDayInCurrentMonth); date = date.add(1, 'day')) {
    if (weekCounter === 1) {
      currentWeekIO.week = date.date();
    }
    const transaction = currentMonthTransactionsMap.get(date.unix());
    if (transaction) {
      currentWeekIO.income = currentWeekIO.income
        ? new BigNumber(currentWeekIO.income).plus(transaction.income).decimalPlaces(2).toNumber()
        : transaction.income;
      currentWeekIO.expense = currentWeekIO.expense
        ? new BigNumber(currentWeekIO.expense).plus(transaction.expense).decimalPlaces(2).toNumber()
        : transaction.expense;
    }
    if (weekCounter === 7 || date.isSame(endDayInCurrentMonth)) {
      currentWeekIO.week = `${currentWeekIO.week}-${date.date()}`;
      weeklyIOChartData.push(currentWeekIO);
      currentWeekIO = {};
      weekCounter = 1;
    } else {
      weekCounter += 1;
    }
  }

  return weeklyIOChartData.map((data) => {
    const processedData: any = data;
    if (processedData.income === 0) {
      delete processedData.income;
    }
    if (processedData.expense == 0) {
      delete processedData.expense;
    } else {
      processedData.expense = -processedData.expense;
    }
    return processedData;
  });
}
