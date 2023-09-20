import { StateCreator } from 'zustand';

import { BrokersState, EditStockHoldingModalStateSlice } from '../types';

export const createEditStockHoldingModalStateSlice: StateCreator<
  BrokersState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  EditStockHoldingModalStateSlice
> = (set) => ({
  unit: undefined,
  cost: undefined,
  stockId: undefined,
  updateUnit: (newUnit) =>
    set((state) => {
      state.unit = newUnit;
    }),
  updateCost: (newCost) =>
    set((state) => {
      state.cost = newCost;
    }),
  updateStockId: (newStockId) =>
    set((state) => {
      state.stockId = newStockId;
    }),
});
