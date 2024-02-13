import { StateCreator } from 'zustand';

import { GlobalState, GlobalStateSlice } from '../types';

export const createGlobalStateSlice: StateCreator<
  GlobalState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  GlobalStateSlice
> = (set) => ({
  username: undefined,
  currencyId: undefined,
  updateUsername: (newUsername) => set((state) => ({ ...state, username: newUsername })),
  updateCurrencyId: (newCurrencyId) => set((state) => ({ ...state, currencyId: newCurrencyId })),
  updateClientSettings: ({ username, currencyId }) => set((state) => ({ ...state, username, currencyId })),
});
