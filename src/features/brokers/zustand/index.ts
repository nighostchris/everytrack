import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { BrokersState } from './types';
import { createModalStateSlice } from './slices/modal_state_slice';
import { createBrokerDetailsSlice } from './slices/broker_details_slice';
import { createBrokerAccountsSlice } from './slices/broker_accounts_slice';

export const store = create<BrokersState, [['zustand/devtools', never], ['zustand/immer', never]]>(
  devtools(
    immer((...a) => ({
      ...createModalStateSlice(...a),
      ...createBrokerDetailsSlice(...a),
      ...createBrokerAccountsSlice(...a),
    })),
  ),
);
