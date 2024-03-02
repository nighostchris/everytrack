/* eslint-disable no-unused-vars */
export type ModalStateSlice = {
  income?: boolean;
  transactionId?: string;
  openAddNewTransactionModal: boolean;
  openDeleteTransactionModal: boolean;
  resetDeleteTransactionModalState: () => void;
  updateOpenAddNewTransactionModal: (newModalState: boolean) => void;
  updateOpenDeleteTransactionModal: (newModalState: boolean) => void;
  populateDeleteTransactionModalState: ({ income, transactionId }: { income: boolean; transactionId: string }) => void;
};

export type TransactionsState = ModalStateSlice;
