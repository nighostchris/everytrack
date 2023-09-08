import { AxiosError } from 'axios';

import { client } from './client';

interface AuthVerifyResponse {
  success: boolean;
}

export async function verify() {
  const { data } = await client.post('/v1/auth/verify');
  return data as AuthVerifyResponse;
}

interface AuthLoginRequest {
  email: string;
  password: string;
}

interface AuthLoginResponse {
  success: boolean;
  error?: string;
}

export async function login(params: AuthLoginRequest) {
  const { email, password } = params;
  try {
    const { data } = await client.post('/v1/auth/login', { email, password });
    return data as AuthLoginResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as AuthLoginResponse).error);
  }
}
