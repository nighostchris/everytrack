import { AxiosError } from 'axios';

import { client } from '../client';
import { GetAllExchangeRatesResponse } from '../types';

export async function getAllExchangeRates() {
  try {
    const { data } = await client.get('/v1/exrate/');
    return data as GetAllExchangeRatesResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as GetAllExchangeRatesResponse).error);
  }
}
