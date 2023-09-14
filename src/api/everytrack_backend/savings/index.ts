import { AxiosError } from 'axios';

import {
  UpdateAccountRequest,
  UpdateAccountResponse,
  CreateNewAccountRequest,
  CreateNewAccountResponse,
  GetAllBankAccountsResponse,
} from '../types';
import { client } from '../client';

export async function getAllBankAccounts() {
  try {
    const { data } = await client.get('/v1/savings/account');
    return data as GetAllBankAccountsResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as GetAllBankAccountsResponse).error);
  }
}

export async function createNewAccount(params: CreateNewAccountRequest) {
  const { currencyId, accountTypeId } = params;
  try {
    const { data } = await client.post('/v1/savings/account', { currencyId, accountTypeId });
    return data as CreateNewAccountResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as CreateNewAccountResponse).error);
  }
}

export async function updateAccount(params: UpdateAccountRequest) {
  const { balance, currencyId, accountTypeId } = params;
  try {
    const { data } = await client.put('/v1/savings/account', { balance, currencyId, accountTypeId });
    return data as UpdateAccountResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as UpdateAccountResponse).error);
  }
}
