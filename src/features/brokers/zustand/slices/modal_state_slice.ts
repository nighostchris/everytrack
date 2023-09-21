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
  stockId: undefined,
  accountId: undefined,
  accountStockId: undefined,
  openAddNewBrokerModal: false,
  openEditStockHoldingModal: false,
  openAddNewStockHoldingModal: false,
  openDeleteStockHoldingModal: false,
  populateEditStockHoldingModalState: ({ unit, cost, stockId, accountId }) =>
    set((state) => ({ ...state, unit, cost, stockId, accountId })),
  resetAddNewStockHoldingModalState: () => set((state) => ({ ...state, accountId: undefined })),
  populateAddNewStockHoldingModalState: (accountId) => set((state) => ({ ...state, accountId })),
  resetEditStockHoldingModalState: () =>
    set((state) => ({ ...state, unit: undefined, cost: undefined, stockId: undefined, accountId: undefined })),
  updateOpenAddNewBrokerModal: (newModalState) => set((state) => ({ ...state, openAddNewBrokerModal: newModalState })),
  resetDeleteStockHoldingModalState: () => set((state) => ({ ...state, stockId: undefined, accountStockId: undefined })),
  updateOpenEditStockHoldingModal: (newModalState) => set((state) => ({ ...state, openEditStockHoldingModal: newModalState })),
  populateDeleteStockHoldingModalState: ({ stockId, accountStockId }) => set((state) => ({ ...state, stockId, accountStockId })),
  updateOpenAddNewStockHoldingModal: (newModalState) => set((state) => ({ ...state, openAddNewStockHoldingModal: newModalState })),
  updateOpenDeleteStockHoldingModal: (newModalState) => set((state) => ({ ...state, openDeleteStockHoldingModal: newModalState })),
});
