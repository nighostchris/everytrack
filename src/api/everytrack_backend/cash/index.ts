import { AxiosError } from 'axios';

import {
  UpdateCashRequest,
  DeleteCashRequest,
  DeleteCashResponse,
  UpdateCashResponse,
  GetAllCashResponse,
  CreateNewCashRequest,
  CreateNewCashResponse,
} from '../types';
import { client } from '../client';

export async function getAllCash() {
  try {
    const { data } = await client.get('/v1/cash');
    return data as GetAllCashResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as GetAllCashResponse).error);
  }
}

export async function createNewCash(params: CreateNewCashRequest) {
  const { amount, currencyId } = params;
  try {
    const { data } = await client.post('/v1/cash', { amount, currencyId });
    return data as CreateNewCashResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as CreateNewCashResponse).error);
  }
}

export async function updateCash(params: UpdateCashRequest) {
  const { id, amount, currencyId } = params;
  try {
    const { data } = await client.put('/v1/cash', { id, amount, currencyId });
    return data as UpdateCashResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as UpdateCashResponse).error);
  }
}

export async function deleteCash(params: DeleteCashRequest) {
  const { cashId: id } = params;
  try {
    const { data } = await client.delete('/v1/cash', { params: { id } });
    return data as DeleteCashResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as DeleteCashResponse).error);
  }
}
