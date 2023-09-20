import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { BrokersState } from './types';
import { createModalStateSlice } from './slices/modal_state_slice';
import { createBrokersPageStateSlice } from './slices/brokers_page_state_slice';
import { createAddNewStockHoldingModalStateSlice } from './slices/add_new_stock_holding_modal_state_slice';
import { createEditStockHoldingModalStateSlice } from './slices/edit_stock_holding_modal_state_slice';

export const store = create<BrokersState, [['zustand/devtools', never], ['zustand/immer', never]]>(
  devtools(
    immer((...a) => ({
      ...createModalStateSlice(...a),
      ...createBrokersPageStateSlice(...a),
      ...createAddNewStockHoldingModalStateSlice(...a),
      ...createEditStockHoldingModalStateSlice(...a),
    })),
  ),
);
