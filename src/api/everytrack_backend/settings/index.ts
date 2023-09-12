import { AxiosError } from 'axios';

import { client } from '../client';
import { GetAllClientSettingsResponse, UpdateSettingsRequest, UpdateSettingsResponse } from '../types';

export async function getAllClientSettings() {
  try {
    const { data } = await client.get('/v1/settings/');
    return data as GetAllClientSettingsResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as GetAllClientSettingsResponse).error);
  }
}

export async function updateSettings(params: UpdateSettingsRequest) {
  const { username, currencyId } = params;
  try {
    const { data } = await client.put('/v1/settings/', { username, currencyId });
    return data as UpdateSettingsResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as UpdateSettingsResponse).error);
  }
}
