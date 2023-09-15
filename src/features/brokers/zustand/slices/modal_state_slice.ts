import { StateCreator } from 'zustand';

import { ModalStateSlice, BrokersState } from '../types';

export const createModalStateSlice: StateCreator<
  BrokersState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  ModalStateSlice
> = (set) => ({
  openAddNewBrokerModal: false,
  updateOpenAddNewBrokerModal: (newModalState) =>
    set((state) => {
      state.openAddNewBrokerModal = newModalState;
    }),
});
