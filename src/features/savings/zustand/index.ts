import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { SavingsState } from './types';
import { createModalStateSlice } from './slices/modal_state_slice';
import { createBankAccountsSlice } from './slices/bank_accounts_slice';
import { createSavingsPageStateSlice } from './slices/savings_page_state_slice';
import { createAddNewAccountModalStateSlice } from './slices/add_new_account_modal_state_slice';

export const store = create<SavingsState, [['zustand/devtools', never], ['zustand/immer', never]]>(
  devtools(
    immer((...a) => ({
      ...createModalStateSlice(...a),
      ...createBankAccountsSlice(...a),
      ...createSavingsPageStateSlice(...a),
      ...createAddNewAccountModalStateSlice(...a),
    })),
  ),
);
