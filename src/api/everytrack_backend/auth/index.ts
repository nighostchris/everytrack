import { AxiosError } from 'axios';

import { client } from '../client';
import { LoginRequest, LoginResponse, RefreshResponse, VerifyResponse } from '../types';

export async function verify() {
  const { data } = await client.post('/v1/auth/verify');
  return data as VerifyResponse;
}

export async function refresh() {
  const { data } = await client.post('/v1/auth/refresh');
  return data as RefreshResponse;
}

export async function login(params: LoginRequest) {
  const { email, password } = params;
  try {
    const { data } = await client.post('/v1/auth/login', { email, password });
    return data as LoginResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as LoginResponse).error);
  }
}
