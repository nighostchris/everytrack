import { StateCreator } from 'zustand';

import { ModalStateSlice, ExpensesState } from '../types';

export const createModalStateSlice: StateCreator<
  ExpensesState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  ModalStateSlice
> = (set) => ({
  openAddNewExpenseModal: false,
  updateOpenAddNewExpenseModal: (newModalState) => set((state) => ({ ...state, openAddNewExpenseModal: newModalState })),
});
