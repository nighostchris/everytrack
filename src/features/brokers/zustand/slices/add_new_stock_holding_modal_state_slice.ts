import { StateCreator } from 'zustand';

import { AddNewStockHoldingModalStateSlice, BrokersState } from '../types';

export const createAddNewStockHoldingModalStateSlice: StateCreator<
  BrokersState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  AddNewStockHoldingModalStateSlice
> = (set) => ({
  accountId: undefined,
  updateAccountId: (newAccountId) =>
    set((state) => {
      state.accountId = newAccountId;
    }),
});
