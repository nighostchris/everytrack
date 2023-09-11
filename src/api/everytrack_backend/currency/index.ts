import { AxiosError } from 'axios';

import { client } from '../client';
import { GetAllCurrenciesResponse } from '../types';

export async function getAllCurrencies() {
  try {
    const { data } = await client.get('/v1/currency/');
    return data as GetAllCurrenciesResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as GetAllCurrenciesResponse).error);
  }
}
