import { StateCreator } from 'zustand';

import { ModalStateSlice, SavingsState } from '../types';

export const createModalStateSlice: StateCreator<
  SavingsState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  ModalStateSlice
> = (set) => ({
  openAddNewProviderModal: false,
  openEditAccountBalanceModal: false,
  updateOpenAddNewProviderModal: (newModalState) =>
    set((state) => {
      state.openAddNewProviderModal = newModalState;
    }),
  updateOpenEditAccountBalanceModal: (newModalState) =>
    set((state) => {
      state.openEditAccountBalanceModal = newModalState;
    }),
});
