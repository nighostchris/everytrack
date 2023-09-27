/* eslint-disable no-unused-vars */
export type ModalStateSlice = {
  openAddNewExpenseModal: boolean;
  updateOpenAddNewExpenseModal: (newModalState: boolean) => void;
};

export type ExpensesState = ModalStateSlice;
