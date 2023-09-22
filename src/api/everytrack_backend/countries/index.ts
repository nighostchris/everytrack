import { AxiosError } from 'axios';

import { client } from '../client';
import { GetAllCountriesResponse } from '../types';

export async function getAllCountries() {
  try {
    const { data } = await client.get('/v1/countries');
    return data as GetAllCountriesResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as GetAllCountriesResponse).error);
  }
}
