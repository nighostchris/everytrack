import { StateCreator } from 'zustand';

import { BrokersPageStateSlice, BrokersState } from '../types';

export const createBrokersPageStateSlice: StateCreator<
  BrokersState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  BrokersPageStateSlice
> = (set) => ({
  stocks: undefined,
  brokerDetails: undefined,
  brokerAccounts: undefined,
  accountStockHoldings: undefined,
  updateStocks: (newStocks) =>
    set((state) => {
      state.stocks = newStocks;
    }),
  updateBrokerDetails: (newBrokerDetails) =>
    set((state) => {
      state.brokerDetails = newBrokerDetails;
    }),
  updateBrokerAccounts: (newBrokerAccounts) =>
    set((state) => {
      state.brokerAccounts = newBrokerAccounts;
    }),
  updateAccountStockHoldings: (newAccountStockHoldings) =>
    set((state) => {
      state.accountStockHoldings = newAccountStockHoldings;
    }),
});
