import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { SavingsState } from './types';
import { createModalStateSlice } from './slices/modal_state_slice';

export const store = create<SavingsState, [['zustand/devtools', never], ['zustand/immer', never]]>(
  devtools(
    immer((...a) => ({
      ...createModalStateSlice(...a),
    })),
  ),
);
