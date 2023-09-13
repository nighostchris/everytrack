import { StateCreator } from 'zustand';

import { AddNewAccountModalStateSlice, SavingsState } from '../types';

export const createAddNewAccountModalStateSlice: StateCreator<
  SavingsState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  AddNewAccountModalStateSlice
> = (set) => ({
  providerName: undefined,
  updateProviderName: (newProviderName) =>
    set((state) => {
      state.providerName = newProviderName;
    }),
});
