import { StateCreator } from 'zustand';

import { AccountsState, ModalStateSlice } from '../types';

export const createModalStateSlice: StateCreator<
  AccountsState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  ModalStateSlice
> = (set) => ({
  openTransferBetweenAccountModal: false,
  updateOpenTransferBetweenAccountModal: (newModalState) => set((state) => ({ ...state, openTransferBetweenAccountModal: newModalState })),
});
