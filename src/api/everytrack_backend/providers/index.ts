import { AxiosError } from 'axios';

import { client } from '../client';
import { ProviderType, GetAllProvidersResponse } from '../types';

export async function getAllProviders(type: ProviderType) {
  try {
    const { data } = await client.get('/v1/providers', { params: { type } });
    return data as GetAllProvidersResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as GetAllProvidersResponse).error);
  }
}
