import { StateCreator } from 'zustand';

import { BankDetailsSlice, SavingsState } from '../types';

export const createBankDetailsSlice: StateCreator<
  SavingsState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  BankDetailsSlice
> = (set) => ({
  bankDetails: undefined,
  // TODO: enhance types later
  updateBankDetails: (newBankDetails) =>
    set((state) => {
      state.bankDetails = newBankDetails;
    }),
});
