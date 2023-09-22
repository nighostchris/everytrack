import { StateCreator } from 'zustand';

import { ModalStateSlice, SavingsState } from '../types';

export const createModalStateSlice: StateCreator<
  SavingsState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  ModalStateSlice
> = (set) => ({
  balance: undefined,
  accountId: undefined,
  currencyId: undefined,
  accountTypeId: undefined,
  assetProviderId: undefined,
  openAddNewAccountModal: false,
  openDeleteAccountModal: false,
  openAddNewProviderModal: false,
  openEditAccountBalanceModal: false,
  populateEditAccountBalanceModalState: ({ balance, currencyId, accountTypeId }) =>
    set((state) => ({ ...state, balance, currencyId, accountTypeId })),
  resetDeleteAccountModalState: () => set((state) => ({ ...state, accountId: undefined })),
  populateDeleteAccountModalState: (accountId) => set((state) => ({ ...state, accountId })),
  resetAddNewAccountModalState: () => set((state) => ({ ...state, assetProviderId: undefined })),
  resetEditAccountBalanceModalState: () =>
    set((state) => ({ ...state, balance: undefined, currencyId: undefined, accountTypeId: undefined })),
  populateAddNewAccountModalState: (assetProviderId: string) => set((state) => ({ ...state, assetProviderId })),
  updateOpenAddNewAccountModal: (newModalState) => set((state) => ({ ...state, openAddNewAccountModal: newModalState })),
  updateOpenDeleteAccountModal: (newModalState) => set((state) => ({ ...state, openDeleteAccountModal: newModalState })),
  updateOpenAddNewProviderModal: (newModalState) => set((state) => ({ ...state, openAddNewProviderModal: newModalState })),
  updateOpenEditAccountBalanceModal: (newModalState) => set((state) => ({ ...state, openEditAccountBalanceModal: newModalState })),
});
