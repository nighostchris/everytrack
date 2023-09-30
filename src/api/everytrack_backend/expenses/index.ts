import { AxiosError } from 'axios';

import {
  DeleteExpenseRequest,
  DeleteExpenseResponse,
  GetAllExpensesResponse,
  CreateNewExpenseRequest,
  CreateNewExpenseResponse,
} from '../types';
import { client } from '../client';

export async function getAllExpenses() {
  try {
    const { data } = await client.get('/v1/expenses');
    return data as GetAllExpensesResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as GetAllExpensesResponse).error);
  }
}

export async function createNewExpense(params: CreateNewExpenseRequest) {
  const { name, amount, category, executedAt, currencyId, remarks, accountId } = params;
  try {
    const { data } = await client.post('/v1/expenses', { name, amount, category, executedAt, currencyId, remarks, accountId });
    return data as CreateNewExpenseResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as CreateNewExpenseResponse).error);
  }
}

export async function deleteExpense(params: DeleteExpenseRequest) {
  const { expenseId: id, revertBalance } = params;
  try {
    const { data } = await client.delete('/v1/expenses', { params: { id, revertBalance } });
    return data as DeleteExpenseResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as DeleteExpenseResponse).error);
  }
}
