/* eslint-disable no-unused-vars */
import { ADVANCED_SEARCH_SORTING_OPTIONS } from '@consts';
import { TransactionCategory } from '@api/everytrack_backend';

export type ModalStateSlice = {
  income?: boolean;
  transactionId?: string;
  openAddNewTransactionModal: boolean;
  openDeleteTransactionModal: boolean;
  resetDeleteTransactionModalState: () => void;
  updateOpenAddNewTransactionModal: (newModalState: boolean) => void;
  updateOpenDeleteTransactionModal: (newModalState: boolean) => void;
  populateDeleteTransactionModalState: ({ income, transactionId }: { income: boolean; transactionId: string }) => void;
};

type AdvancedSearchSorting = (typeof ADVANCED_SEARCH_SORTING_OPTIONS)[number];

export type AdvancedSearchToolboxStateSlice = {
  search?: string;
  sorting: AdvancedSearchSorting;
  categories: TransactionCategory[];
  updateAdvancedSearchToolboxState: ({
    search,
    sorting,
    categories,
  }: {
    search: string;
    categories: string[];
    sorting: AdvancedSearchSorting;
  }) => void;
  resetAdvancedSearchToolboxState: () => void;
};

export type TransactionsState = ModalStateSlice & AdvancedSearchToolboxStateSlice;
