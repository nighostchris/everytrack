import { StateCreator } from 'zustand';

import { BrokerDetailsSlice, BrokersState } from '../types';

export const createBrokerDetailsSlice: StateCreator<
  BrokersState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  BrokerDetailsSlice
> = (set) => ({
  brokerDetails: undefined,
  updateBrokerDetails: (newBrokerDetails) =>
    set((state) => {
      state.brokerDetails = newBrokerDetails;
    }),
});
