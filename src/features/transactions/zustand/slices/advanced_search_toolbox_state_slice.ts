import { StateCreator } from 'zustand';

import { AdvancedSearchToolboxStateSlice, TransactionsState } from '../types';

export const createAdvancedSearchToolboxStateSlice: StateCreator<
  TransactionsState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  AdvancedSearchToolboxStateSlice
> = (set) => ({
  categories: [],
  search: undefined,
  sorting: 'date-latest-first',
  updateAdvancedSearchToolboxState: ({ search, sorting, categories }) =>
    set((state) => ({ ...state, sorting, categories, search: search && search.length > 0 ? search : undefined })),
  resetAdvancedSearchToolboxState: () => set((state) => ({ ...state, search: undefined, sorting: 'date-latest-first', categories: [] })),
});
