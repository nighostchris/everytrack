import { AxiosError } from 'axios';

import { client } from '../client';
import { CreateNewExpenseRequest, GetAllExpensesResponse, CreateNewExpenseResponse } from '../types';

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
