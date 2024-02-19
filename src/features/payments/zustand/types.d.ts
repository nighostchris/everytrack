/* eslint-disable no-unused-vars */
export type ModalStateSlice = {
  futurePaymentId?: string;
  openAddNewFuturePaymentModal: boolean;
  openUpdateFuturePaymentModal: boolean;
  openDeleteFuturePaymentModal: boolean;
  resetDeleteFuturePaymentModalState: () => void;
  updateOpenAddNewFuturePaymentModal: (newModalState: boolean) => void;
  updateOpenUpdateFuturePaymentModal: (newModalState: boolean) => void;
  updateOpenDeleteFuturePaymentModal: (newModalState: boolean) => void;
  populateDeleteFuturePaymentModalState: (futurePaymentId: string) => void;
};

export type FuturePaymentsState = ModalStateSlice;
