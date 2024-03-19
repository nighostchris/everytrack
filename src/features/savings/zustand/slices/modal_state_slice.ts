import { StateCreator } from 'zustand';

import { ModalStateSlice, SavingsState } from '../types';

export const createModalStateSlice: StateCreator<
  SavingsState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  ModalStateSlice
> = (set) => ({
  amount: undefined,
  cashId: undefined,
  balance: undefined,
  accountId: undefined,
  currencyId: undefined,
  accountTypeId: undefined,
  assetProviderId: undefined,
  openEditCashModal: false,
  openAddNewCashModal: false,
  openDeleteCashModal: false,
  openAddNewAccountModal: false,
  openDeleteAccountModal: false,
  openAddNewProviderModal: false,
  openEditAccountBalanceModal: false,
  openTransferBetweenAccountModal: false,
  populateEditAccountBalanceModalState: ({ balance, currencyId, accountTypeId }) =>
    set((state) => ({ ...state, balance, currencyId, accountTypeId })),
  resetDeleteCashModalState: () => set((state) => ({ ...state, cashId: undefined })),
  populateDeleteCashModalState: (cashId: string) => set((state) => ({ ...state, cashId })),
  resetDeleteAccountModalState: () => set((state) => ({ ...state, accountId: undefined })),
  populateDeleteAccountModalState: (accountId) => set((state) => ({ ...state, accountId })),
  resetAddNewAccountModalState: () => set((state) => ({ ...state, assetProviderId: undefined })),
  resetEditAccountBalanceModalState: () =>
    set((state) => ({ ...state, balance: undefined, currencyId: undefined, accountTypeId: undefined })),
  updateOpenEditCashModal: (newModalState) => set((state) => ({ ...state, openEditCashModal: newModalState })),
  populateAddNewAccountModalState: (assetProviderId: string) => set((state) => ({ ...state, assetProviderId })),
  updateOpenAddNewCashModal: (newModalState) => set((state) => ({ ...state, openAddNewCashModal: newModalState })),
  updateOpenDeleteCashModal: (newModalState) => set((state) => ({ ...state, openDeleteCashModal: newModalState })),
  updateOpenAddNewAccountModal: (newModalState) => set((state) => ({ ...state, openAddNewAccountModal: newModalState })),
  updateOpenDeleteAccountModal: (newModalState) => set((state) => ({ ...state, openDeleteAccountModal: newModalState })),
  updateOpenAddNewProviderModal: (newModalState) => set((state) => ({ ...state, openAddNewProviderModal: newModalState })),
  resetEditCashModalState: () => set((state) => ({ ...state, cashId: undefined, amount: undefined, currencyId: undefined })),
  populateEditCashModalState: ({ id, amount, currencyId }) => set((state) => ({ ...state, cashId: id, amount, currencyId })),
  updateOpenEditAccountBalanceModal: (newModalState) => set((state) => ({ ...state, openEditAccountBalanceModal: newModalState })),
  updateOpenTransferBetweenAccountModal: (newModalState) => set((state) => ({ ...state, openTransferBetweenAccountModal: newModalState })),
});
