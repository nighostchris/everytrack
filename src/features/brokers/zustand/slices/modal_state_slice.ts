import { StateCreator } from 'zustand';

import { ModalStateSlice, BrokersState } from '../types';

export const createModalStateSlice: StateCreator<
  BrokersState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  ModalStateSlice
> = (set) => ({
  unit: undefined,
  cost: undefined,
  balance: undefined,
  stockId: undefined,
  accountId: undefined,
  currencyId: undefined,
  accountTypeId: undefined,
  accountStockId: undefined,
  assetProviderId: undefined,
  openAddNewBrokerModal: false,
  openAddNewAccountModal: false,
  openDeleteAccountModal: false,
  openEditCashHoldingModal: false,
  openEditStockHoldingModal: false,
  openAddNewStockHoldingModal: false,
  openDeleteStockHoldingModal: false,
  populateEditStockHoldingModalState: ({ unit, cost, stockId, accountId }) =>
    set((state) => ({ ...state, unit, cost, stockId, accountId })),
  populateEditCashHoldingModalState: ({ balance, currencyId, accountTypeId }) =>
    set((state) => ({ ...state, balance, currencyId, accountTypeId })),
  resetDeleteAccountModalState: () => set((state) => ({ ...state, accountId: undefined })),
  populateDeleteAccountModalState: (accountId) => set((state) => ({ ...state, accountId })),
  resetAddNewStockHoldingModalState: () => set((state) => ({ ...state, accountId: undefined })),
  populateAddNewStockHoldingModalState: (accountId) => set((state) => ({ ...state, accountId })),
  resetAddNewAccountModalState: () => set((state) => ({ ...state, assetProviderId: undefined })),
  populateAddNewAccountModalState: (assetProviderId) => set((state) => ({ ...state, assetProviderId })),
  resetEditStockHoldingModalState: () =>
    set((state) => ({ ...state, unit: undefined, cost: undefined, stockId: undefined, accountId: undefined })),
  updateOpenAddNewBrokerModal: (newModalState) => set((state) => ({ ...state, openAddNewBrokerModal: newModalState })),
  resetDeleteStockHoldingModalState: () => set((state) => ({ ...state, stockId: undefined, accountStockId: undefined })),
  updateOpenAddNewAccountModal: (newModalState) => set((state) => ({ ...state, openAddNewAccountModal: newModalState })),
  updateOpenDeleteAccountModal: (newModalState) => set((state) => ({ ...state, openDeleteAccountModal: newModalState })),
  updateOpenEditStockHoldingModal: (newModalState) => set((state) => ({ ...state, openEditStockHoldingModal: newModalState })),
  populateDeleteStockHoldingModalState: ({ stockId, accountStockId }) => set((state) => ({ ...state, stockId, accountStockId })),
  updateOpenEditCashHoldingModalState: (newModalState) => set((state) => ({ ...state, openEditCashHoldingModal: newModalState })),
  updateOpenAddNewStockHoldingModal: (newModalState) => set((state) => ({ ...state, openAddNewStockHoldingModal: newModalState })),
  updateOpenDeleteStockHoldingModal: (newModalState) => set((state) => ({ ...state, openDeleteStockHoldingModal: newModalState })),
  resetEditCashHoldingModalState: () => set((state) => ({ ...state, balance: undefined, currencyId: undefined, accountTypeId: undefined })),
});
