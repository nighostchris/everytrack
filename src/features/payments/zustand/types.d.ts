/* eslint-disable no-unused-vars */
export type ModalStateSlice = {
  name?: string;
  amount?: string;
  income?: boolean;
  remarks?: string;
  rolling?: boolean;
  category?: string;
  frequency?: number;
  accountId?: string;
  currencyId?: string;
  scheduledAt?: number;
  futurePaymentId?: string;
  openEditFuturePaymentModal: boolean;
  openAddNewFuturePaymentModal: boolean;
  openDeleteFuturePaymentModal: boolean;
  populateEditFuturePaymentModalState: ({
    name,
    amount,
    income,
    remarks,
    rolling,
    category,
    frequency,
    accountId,
    currencyId,
    scheduledAt,
    futurePaymentId,
  }: {
    name: string;
    amount: string;
    remarks: string;
    income: boolean;
    rolling: boolean;
    category: string;
    frequency: number;
    accountId: string;
    currencyId: string;
    scheduledAt: number;
    futurePaymentId: string;
  }) => void;
  resetEditFuturePaymentModalState: () => void;
  resetDeleteFuturePaymentModalState: () => void;
  updateOpenEditFuturePaymentModal: (newModalState: boolean) => void;
  updateOpenAddNewFuturePaymentModal: (newModalState: boolean) => void;
  updateOpenDeleteFuturePaymentModal: (newModalState: boolean) => void;
  populateDeleteFuturePaymentModalState: (futurePaymentId: string) => void;
};

export type FuturePaymentsState = ModalStateSlice;
