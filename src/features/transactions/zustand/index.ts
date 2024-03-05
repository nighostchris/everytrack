import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { TransactionsState } from './types';
import { createModalStateSlice } from './slices/modal_state_slice';
import { createAdvancedSearchToolboxStateSlice } from './slices/advanced_search_toolbox_state_slice';

export const store = create<TransactionsState, [['zustand/devtools', never], ['zustand/immer', never]]>(
  devtools(
    immer((...a) => ({
      ...createModalStateSlice(...a),
      ...createAdvancedSearchToolboxStateSlice(...a),
    })),
  ),
);
