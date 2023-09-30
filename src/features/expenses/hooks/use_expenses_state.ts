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

export const useExpensesState = () => {
  const { expenses, currencies } = globalStore();

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

  React.useEffect(() => {
    setIsLoading(true);
    setIsLoading(false);
  }, []);

  return { isLoading, expensesTableRows };
};

export default useExpensesState;
