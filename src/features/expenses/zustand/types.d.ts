/* eslint-disable no-unused-vars */
export type ModalStateSlice = {
  expenseId?: string;
  openAddNewExpenseModal: boolean;
  openDeleteExpenseModal: boolean;
  resetDeleteExpenseModalState: () => void;
  populateDeleteExpenseModalState: (expenseId: string) => void;
  updateOpenAddNewExpenseModal: (newModalState: boolean) => void;
  updateOpenDeleteExpenseModal: (newModalState: boolean) => void;
};

export type ExpensesState = ModalStateSlice;
