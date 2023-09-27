import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';

import { store as globalStore } from '@lib/zustand';
import { Currency, getAllExpenses } from '@api/everytrack_backend';

export interface ExpensesTableRow {
  amount: string;
  remarks: string;
  // TODO: tighten category type later
  category: string;
  spentDate: string;
}

export const useExpensesState = () => {
  const { expenses, currencies, updateExpenses } = globalStore();

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const initExpenses = React.useCallback(async () => {
    try {
      const { success, data } = await getAllExpenses();
      if (success) {
        updateExpenses(data);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  const expensesTableRows = React.useMemo(() => {
    const result: ExpensesTableRow[] = [];
    const currenciesMap = new Map<string, Currency>();
    if (expenses && currencies) {
      // Generate a currency map
      currencies.forEach((currency) => currenciesMap.set(currency.id, currency));
      // Populate result
      expenses.forEach(({ amount, accountId, currencyId, executedAt, remarks, category }) => {
        const currency = (currenciesMap.get(currencyId) as Currency).symbol;
        result.push({
          remarks,
          category,
          spentDate: dayjs.unix(executedAt).format('MMM DD'),
          amount: `${currency} ${new BigNumber(amount).toFormat(2)}`,
        });
      });
    }
    return result.sort((a, b) => (dayjs(a.spentDate).isAfter(dayjs(b.spentDate)) ? 1 : -1));
  }, [expenses, currencies]);

  React.useEffect(() => {
    setIsLoading(true);
    initExpenses();
    setIsLoading(false);
  }, [initExpenses]);

  return { isLoading, expensesTableRows };
};

export default useExpensesState;
