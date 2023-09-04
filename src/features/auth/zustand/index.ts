import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { AuthState } from './types';
import { createAuthSlice } from './slices/auth_slice';

export const store = create<AuthState, [['zustand/devtools', never], ['zustand/immer', never]]>(
  devtools(
    immer((...a) => ({
      ...createAuthSlice(...a),
    })),
  ),
);
