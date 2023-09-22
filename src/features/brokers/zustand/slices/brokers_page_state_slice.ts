import { StateCreator } from 'zustand';

import { BrokersPageStateSlice, BrokersState } from '../types';

export const createBrokersPageStateSlice: StateCreator<
  BrokersState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  BrokersPageStateSlice
> = (set) => ({
  brokerDetails: undefined,
  updateBrokerDetails: (newBrokerDetails) =>
    set((state) => {
      state.brokerDetails = newBrokerDetails;
    }),
});
