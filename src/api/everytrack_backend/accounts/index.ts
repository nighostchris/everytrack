import { AxiosError } from 'axios';

import {
  ProviderType,
  DeleteAccountRequest,
  UpdateAccountRequest,
  DeleteAccountResponse,
  UpdateAccountResponse,
  GetAllAccountsResponse,
  CreateNewAccountRequest,
  CreateNewAccountResponse,
  TransferBetweenAccountsRequest,
  TransferBetweenAccountsResponse,
} from '../types';
import { client } from '../client';

export async function getAllAccounts(type: ProviderType) {
  try {
    const { data } = await client.get('/v1/accounts', { params: { type } });
    return data as GetAllAccountsResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as GetAllAccountsResponse).error);
  }
}

export async function createNewAccount(params: CreateNewAccountRequest) {
  const { name, currencyId, assetProviderId } = params;
  try {
    const { data } = await client.post('/v1/accounts', { name, currencyId, assetProviderId });
    return data as CreateNewAccountResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as CreateNewAccountResponse).error);
  }
}

export async function transferBetweenAccounts(params: TransferBetweenAccountsRequest) {
  const { amount, sourceAccountId, targetAccountId } = params;
  try {
    const { data } = await client.post('/v1/accounts/transfer', { amount, sourceAccountId, targetAccountId });
    return data as TransferBetweenAccountsResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as TransferBetweenAccountsResponse).error);
  }
}

export async function updateAccount(params: UpdateAccountRequest) {
  const { balance, currencyId, accountTypeId } = params;
  try {
    const { data } = await client.put('/v1/accounts', { balance, currencyId, accountTypeId });
    return data as UpdateAccountResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as UpdateAccountResponse).error);
  }
}

export async function deleteAccount(params: DeleteAccountRequest) {
  const { accountId: id, providerType: type } = params;
  try {
    const { data } = await client.delete('/v1/accounts', { params: { id, type } });
    return data as DeleteAccountResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as DeleteAccountResponse).error);
  }
}
