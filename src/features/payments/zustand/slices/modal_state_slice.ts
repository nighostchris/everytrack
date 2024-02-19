import { StateCreator } from 'zustand';

import { ModalStateSlice, FuturePaymentsState } from '../types';

export const createModalStateSlice: StateCreator<
  FuturePaymentsState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  ModalStateSlice
> = (set) => ({
  futurePaymentId: undefined,
  openAddNewFuturePaymentModal: false,
  openUpdateFuturePaymentModal: false,
  openDeleteFuturePaymentModal: false,
  resetDeleteFuturePaymentModalState: () => set((state) => ({ ...state, futurePaymentId: undefined })),
  populateDeleteFuturePaymentModalState: (futurePaymentId) => set((state) => ({ ...state, futurePaymentId })),
  updateOpenAddNewFuturePaymentModal: (newModalState) => set((state) => ({ ...state, openAddNewFuturePaymentModal: newModalState })),
  updateOpenUpdateFuturePaymentModal: (newModalState) => set((state) => ({ ...state, openUpdateFuturePaymentModal: newModalState })),
  updateOpenDeleteFuturePaymentModal: (newModalState) => set((state) => ({ ...state, openDeleteFuturePaymentModal: newModalState })),
});
