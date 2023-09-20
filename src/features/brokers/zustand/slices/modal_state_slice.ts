import { StateCreator } from 'zustand';

import { ModalStateSlice, BrokersState } from '../types';

export const createModalStateSlice: StateCreator<
  BrokersState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  ModalStateSlice
> = (set) => ({
  openAddNewBrokerModal: false,
  openAddNewStockHoldingModal: false,
  openEditStockHoldingCostModal: false,
  updateOpenAddNewBrokerModal: (newModalState) =>
    set((state) => {
      state.openAddNewBrokerModal = newModalState;
    }),
  updateOpenAddNewStockHoldingModal: (newModalState) =>
    set((state) => {
      state.openAddNewStockHoldingModal = newModalState;
    }),
  updateOpenEditStockHoldingCostModal: (newModalState) =>
    set((state) => {
      state.openEditStockHoldingCostModal = newModalState;
    }),
});
