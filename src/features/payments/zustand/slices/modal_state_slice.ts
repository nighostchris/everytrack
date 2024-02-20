import { StateCreator } from 'zustand';

import { ModalStateSlice, FuturePaymentsState } from '../types';

export const createModalStateSlice: StateCreator<
  FuturePaymentsState,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  ModalStateSlice
> = (set) => ({
  name: undefined,
  income: undefined,
  amount: undefined,
  rolling: undefined,
  remarks: undefined,
  frequency: undefined,
  accountId: undefined,
  currencyId: undefined,
  scheduledAt: undefined,
  futurePaymentId: undefined,
  openEditFuturePaymentModal: false,
  openAddNewFuturePaymentModal: false,
  openDeleteFuturePaymentModal: false,
  resetEditFuturePaymentModalState: () =>
    set((state) => ({
      ...state,
      name: undefined,
      income: undefined,
      amount: undefined,
      rolling: undefined,
      remarks: undefined,
      frequency: undefined,
      accountId: undefined,
      currencyId: undefined,
      scheduledAt: undefined,
      futurePaymentId: undefined,
    })),
  resetDeleteFuturePaymentModalState: () => set((state) => ({ ...state, futurePaymentId: undefined })),
  populateDeleteFuturePaymentModalState: (futurePaymentId) => set((state) => ({ ...state, futurePaymentId })),
  updateOpenEditFuturePaymentModal: (newModalState) => set((state) => ({ ...state, openEditFuturePaymentModal: newModalState })),
  updateOpenAddNewFuturePaymentModal: (newModalState) => set((state) => ({ ...state, openAddNewFuturePaymentModal: newModalState })),
  updateOpenDeleteFuturePaymentModal: (newModalState) => set((state) => ({ ...state, openDeleteFuturePaymentModal: newModalState })),
  populateEditFuturePaymentModalState: ({
    name,
    amount,
    income,
    rolling,
    remarks,
    frequency,
    accountId,
    currencyId,
    scheduledAt,
    futurePaymentId,
  }) =>
    set((state) => ({ ...state, name, amount, remarks, income, rolling, frequency, accountId, currencyId, scheduledAt, futurePaymentId })),
});
