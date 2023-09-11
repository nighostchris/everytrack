import { AxiosError } from 'axios';

import { client } from '../client';
import { CreateNewAccountRequest, CreateNewAccountResponse, GetAllBankDetailsResponse } from '../types';

export async function getAllBankDetails() {
  try {
    const { data } = await client.get('/v1/savings/');
    return data as GetAllBankDetailsResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as GetAllBankDetailsResponse).error);
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
