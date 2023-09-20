import { StateCreator } from 'zustand';

import { BrokersState, DeleteStockHoldingModalStateSlice } from '../types';

export const createDeleteStockHoldingModalStateSlice: StateCreator<
  BrokersState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  DeleteStockHoldingModalStateSlice
> = (set) => ({
  accountStockId: undefined,
  resetDeleteStockHoldingModalState: () =>
    set((state) => {
      state.accountStockId = undefined;
    }),
  updateAccountStockId: (newAccountStockId) =>
    set((state) => {
      state.accountStockId = newAccountStockId;
    }),
});
