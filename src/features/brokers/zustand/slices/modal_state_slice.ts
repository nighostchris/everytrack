import { StateCreator } from 'zustand';

import { ModalStateSlice, BrokersState } from '../types';

export const createModalStateSlice: StateCreator<
  BrokersState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  ModalStateSlice
> = (set) => ({
  openAddNewBrokerModal: false,
  openEditStockHoldingModal: false,
  openAddNewStockHoldingModal: false,
  openDeleteStockHoldingModal: false,
  updateOpenAddNewBrokerModal: (newModalState) =>
    set((state) => {
      state.openAddNewBrokerModal = newModalState;
    }),
  updateOpenEditStockHoldingModal: (newModalState) =>
    set((state) => {
      state.openEditStockHoldingModal = newModalState;
    }),
  updateOpenAddNewStockHoldingModal: (newModalState) =>
    set((state) => {
      state.openAddNewStockHoldingModal = newModalState;
    }),
  updateOpenDeleteStockHoldingModal: (newModalState) =>
    set((state) => {
      state.openDeleteStockHoldingModal = newModalState;
    }),
});
