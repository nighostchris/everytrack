/* eslint-disable no-unused-vars */
export type ModalStateSlice = {
  transactionId?: string;
  openAddNewTransactionModal: boolean;
  openDeleteTransactionModal: boolean;
  resetDeleteTransactionModalState: () => void;
  updateOpenAddNewTransactionModal: (newModalState: boolean) => void;
  updateOpenDeleteTransactionModal: (newModalState: boolean) => void;
  populateDeleteTransactionModalState: (transactionId: string) => void;
};

export type TransactionsState = ModalStateSlice;
