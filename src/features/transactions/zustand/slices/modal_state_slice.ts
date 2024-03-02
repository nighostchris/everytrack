import { StateCreator } from 'zustand';

import { ModalStateSlice, TransactionsState } from '../types';

export const createModalStateSlice: StateCreator<
  TransactionsState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  ModalStateSlice
> = (set) => ({
  income: undefined,
  transactionId: undefined,
  openAddNewTransactionModal: false,
  openDeleteTransactionModal: false,
  resetDeleteTransactionModalState: () => set((state) => ({ ...state, transactionId: undefined })),
  populateDeleteTransactionModalState: ({ income, transactionId }) => set((state) => ({ ...state, income, transactionId })),
  updateOpenAddNewTransactionModal: (newModalState) => set((state) => ({ ...state, openAddNewTransactionModal: newModalState })),
  updateOpenDeleteTransactionModal: (newModalState) => set((state) => ({ ...state, openDeleteTransactionModal: newModalState })),
});
