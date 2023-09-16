import { StateCreator } from 'zustand';

import { ModalStateSlice, SavingsState } from '../types';

export const createModalStateSlice: StateCreator<
  SavingsState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  ModalStateSlice
> = (set) => ({
  openAddNewAccountModal: false,
  openDeleteAccountModal: false,
  openAddNewProviderModal: false,
  openEditAccountBalanceModal: false,
  updateOpenAddNewAccountModal: (newModalState) =>
    set((state) => {
      state.openAddNewAccountModal = newModalState;
    }),
  updateOpenDeleteAccountModal: (newModalState) =>
    set((state) => {
      state.openDeleteAccountModal = newModalState;
    }),
  updateOpenAddNewProviderModal: (newModalState) =>
    set((state) => {
      state.openAddNewProviderModal = newModalState;
    }),
  updateOpenEditAccountBalanceModal: (newModalState) =>
    set((state) => {
      state.openEditAccountBalanceModal = newModalState;
    }),
});
