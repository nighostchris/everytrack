import { AxiosError } from 'axios';

import { client } from '../client';

export interface AccountType {
  id: string;
  name: string;
}

interface SavingsGetAllBankDetailsResponse {
  success: boolean;
  data: Record<string, AccountType[]>;
  error?: string;
}

export async function getAllBankDetails() {
  try {
    const { data } = await client.get('/v1/savings/');
    return data as SavingsGetAllBankDetailsResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as SavingsGetAllBankDetailsResponse).error);
  }
}
