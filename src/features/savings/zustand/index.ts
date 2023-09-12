import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { SavingsState } from './types';
import { createCurrenciesSlice } from './slices/currencies_slice';
import { createModalStateSlice } from './slices/modal_state_slice';
import { createBankDetailsSlice } from './slices/bank_details_slice';
import { createBankAccountsSlice } from './slices/bank_accounts_slice';
import { createEditAccountBalanceModalStateSlice } from './slices/edit_account_balance_modal_state_slice';

export const store = create<SavingsState, [['zustand/devtools', never], ['zustand/immer', never]]>(
  devtools(
    immer((...a) => ({
      ...createModalStateSlice(...a),
      ...createCurrenciesSlice(...a),
      ...createBankDetailsSlice(...a),
      ...createBankAccountsSlice(...a),
      ...createEditAccountBalanceModalStateSlice(...a),
    })),
  ),
);
