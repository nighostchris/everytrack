import { client } from './client';

export async function verify() {
  const { data } = await client.get('/v1/auth/verify');
  return data.result;
}
