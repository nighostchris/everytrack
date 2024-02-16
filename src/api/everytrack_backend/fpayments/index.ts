import { AxiosError } from 'axios';

import {
  DeleteFuturePaymentRequest,
  UpdateFuturePaymentRequest,
  DeleteFuturePaymentResponse,
  UpdateFuturePaymentResponse,
  GetAllFuturePaymentsResponse,
  CreateNewFuturePaymentRequest,
  CreateNewFuturePaymentResponse,
} from '../types';
import { client } from '../client';

export async function getAllFuturePayments() {
  try {
    const { data } = await client.get('/v1/fpayments');
    return data as GetAllFuturePaymentsResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as GetAllFuturePaymentsResponse).error);
  }
}

export async function createNewFuturePayment(params: CreateNewFuturePaymentRequest) {
  const { name, amount, income, rolling, frequency, remarks, accountId, currencyId, scheduledAt } = params;
  try {
    const { data } = await client.post('/v1/fpayments', {
      name,
      amount,
      income,
      rolling,
      frequency,
      remarks,
      accountId,
      currencyId,
      scheduledAt,
    });
    return data as CreateNewFuturePaymentResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as CreateNewFuturePaymentResponse).error);
  }
}

export async function updateFuturePayment(params: UpdateFuturePaymentRequest) {
  const { id, name, amount, income, rolling, frequency, remarks, accountId, currencyId, scheduledAt } = params;
  try {
    const { data } = await client.put('/v1/fpayments', {
      id,
      name,
      amount,
      income,
      rolling,
      frequency,
      remarks,
      accountId,
      currencyId,
      scheduledAt,
    });
    return data as UpdateFuturePaymentResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as UpdateFuturePaymentResponse).error);
  }
}

export async function deleteFuturePayment(params: DeleteFuturePaymentRequest) {
  const { futurePaymentId: id } = params;
  try {
    const { data } = await client.delete('/v1/fpayments', { params: { id } });
    return data as DeleteFuturePaymentResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as DeleteFuturePaymentResponse).error);
  }
}
