import { StateCreator } from 'zustand';

import { ModalStateSlice, TransactionsState } from '../types';

export const createModalStateSlice: StateCreator<
  TransactionsState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  ModalStateSlice
> = (set) => ({
  transactionId: undefined,
  openAddNewTransactionModal: false,
  openDeleteTransactionModal: false,
  resetDeleteTransactionModalState: () => set((state) => ({ ...state, transactionId: undefined })),
  populateDeleteTransactionModalState: (transactionId) => set((state) => ({ ...state, transactionId })),
  updateOpenAddNewTransactionModal: (newModalState) => set((state) => ({ ...state, openAddNewTransactionModal: newModalState })),
  updateOpenDeleteTransactionModal: (newModalState) => set((state) => ({ ...state, openDeleteTransactionModal: newModalState })),
});
