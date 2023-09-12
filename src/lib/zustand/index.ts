import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { GlobalState } from './types';
import { createGlobalStateSlice } from './slices/global_state_slice';

export const store = create<GlobalState, [['zustand/devtools', never], ['zustand/immer', never]]>(
  devtools(
    immer((...a) => ({
      ...createGlobalStateSlice(...a),
    })),
  ),
);
