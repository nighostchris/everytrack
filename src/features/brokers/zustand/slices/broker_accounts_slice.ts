import { StateCreator } from 'zustand';

import { BrokerAccountsSlice, BrokersState } from '../types';

export const createBrokerAccountsSlice: StateCreator<
  BrokersState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  BrokerAccountsSlice
> = (set) => ({
  brokerAccounts: undefined,
  updateBrokerAccounts: (newBrokerAccounts) =>
    set((state) => {
      state.brokerAccounts = newBrokerAccounts;
    }),
});
