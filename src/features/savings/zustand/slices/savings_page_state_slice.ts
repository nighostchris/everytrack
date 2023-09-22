import { StateCreator } from 'zustand';

import { SavingsPageStateSlice, SavingsState } from '../types';

export const createSavingsPageStateSlice: StateCreator<
  SavingsState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  SavingsPageStateSlice
> = (set) => ({
  bankDetails: undefined,
  updateBankDetails: (newBankDetails) =>
    set((state) => {
      state.bankDetails = newBankDetails;
    }),
});
