import { AxiosError } from 'axios';

import {
  DeleteTransactionRequest,
  DeleteTransactionResponse,
  GetAllTransactionsResponse,
  CreateNewTransactionRequest,
  CreateNewTransactionResponse,
} from '../types';
import { client } from '../client';

export async function getAllTransactions() {
  try {
    const { data } = await client.get('/v1/transactions');
    return data as GetAllTransactionsResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as GetAllTransactionsResponse).error);
  }
}

export async function createNewTransaction(params: CreateNewTransactionRequest) {
  const { name, income, amount, category, executedAt, currencyId, remarks, accountId } = params;
  try {
    const { data } = await client.post('/v1/transactions', { name, income, amount, category, executedAt, currencyId, remarks, accountId });
    return data as CreateNewTransactionResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as CreateNewTransactionResponse).error);
  }
}

export async function deleteTransaction(params: DeleteTransactionRequest) {
  const { transactionId: id } = params;
  try {
    const { data } = await client.delete('/v1/transactions', { params: { id } });
    return data as DeleteTransactionResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as DeleteTransactionResponse).error);
  }
}
