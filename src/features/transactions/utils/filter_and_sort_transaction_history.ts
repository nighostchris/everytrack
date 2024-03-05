import { ADVANCED_SEARCH_SORTING_OPTIONS } from '@consts';
import { TransactionHistoryDailyRecord } from '../hooks/use_transactions_state';
import { Currency, Transaction, TransactionCategory } from '@api/everytrack_backend';

interface FilterAndSortOptions {
  search: string;
  categories: TransactionCategory[];
  sorting: (typeof ADVANCED_SEARCH_SORTING_OPTIONS)[number];
}

export function filterAndSortTransactions(transactions: Transaction[], currencies: Currency[], options: FilterAndSortOptions) {
  const { search, sorting, categories } = options;

  // Generate a currency map
  const currenciesMap = new Map<string, string>();
  currencies.forEach(({ id, symbol }) => currenciesMap.set(id, symbol));

  // Generate transaction history
  const transactionHistory = Array.from(
    transactions.reduce<Map<number, TransactionHistoryDailyRecord[]>>(
      (acc, { id, name, amount, currencyId, category, income, remarks, executedAt }) => {
        const existingData = acc.get(executedAt);
        // Just return original accumulated records if
        // 1. the transaction does not match search string
        // 2. the transaction does not match focused categories
        const searchString = search.toLowerCase();
        if (!name.toLowerCase().includes(searchString) && !remarks.toLowerCase().includes(searchString)) {
          return acc;
        }
        if (categories.length > 0 && !categories.includes(category)) {
          return acc;
        }
        const newRecord: TransactionHistoryDailyRecord = {
          id,
          name,
          amount,
          income,
          remarks,
          category,
          symbol: currenciesMap.get(currencyId)!,
        };
        if (existingData) {
          acc.set(executedAt, [...existingData, newRecord]);
        } else {
          acc.set(executedAt, [newRecord]);
        }
        return acc;
      },
      new Map(),
    ),
    ([executedAt, records]) => ({ date: executedAt, records: records }),
  );

  // Perform sorting
  return transactionHistory.sort((a, b) => (sorting === 'date-latest-first' ? (a.date < b.date ? 1 : -1) : a.date > b.date ? 1 : -1));
}
