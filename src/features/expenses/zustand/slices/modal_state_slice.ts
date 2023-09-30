import { StateCreator } from 'zustand';

import { ModalStateSlice, ExpensesState } from '../types';

export const createModalStateSlice: StateCreator<
  ExpensesState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  ModalStateSlice
> = (set) => ({
  expenseId: undefined,
  openAddNewExpenseModal: false,
  openDeleteExpenseModal: false,
  resetDeleteExpenseModalState: () => set((state) => ({ ...state, expenseId: undefined })),
  populateDeleteExpenseModalState: (expenseId) => set((state) => ({ ...state, expenseId })),
  updateOpenAddNewExpenseModal: (newModalState) => set((state) => ({ ...state, openAddNewExpenseModal: newModalState })),
  updateOpenDeleteExpenseModal: (newModalState) => set((state) => ({ ...state, openDeleteExpenseModal: newModalState })),
});
