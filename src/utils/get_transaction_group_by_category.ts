import { TRANSACTION_GROUPS } from '@consts';
import { TransactionCategory } from '@api/everytrack_backend';

export const getTransactionGroupByCategory = (category: TransactionCategory) =>
  TRANSACTION_GROUPS.filter(({ categories }) => categories.includes(category))[0].key;
