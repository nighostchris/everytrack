import { StateCreator } from 'zustand';

import { AuthSlice, AuthState } from '../types';

export const createAuthSlice: StateCreator<AuthState, [['zustand/devtools', never], ['zustand/immer', never]], [], AuthSlice> = (set) => ({
  accessToken: undefined,
  updateAccessToken: (newAccessToken: string) =>
    set((state) => {
      state.accessToken = newAccessToken;
    }),
});
