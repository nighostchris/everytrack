import { AxiosError } from 'axios';

import { client } from '../client';
import { GetAllStocksResponse, GetAllStockHoldingsResponse, CreateNewStockHoldingRequest, CreateNewStockHoldingResponse } from '../types';

export async function getAllStocks() {
  try {
    const { data } = await client.get('/v1/stocks');
    return data as GetAllStocksResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as GetAllStocksResponse).error);
  }
}

export async function getAllStockHoldings() {
  try {
    const { data } = await client.get('/v1/stocks/holdings');
    return data as GetAllStockHoldingsResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as GetAllStockHoldingsResponse).error);
  }
}

export async function createNewStockHolding(params: CreateNewStockHoldingRequest) {
  const { accountId, stockId, unit, cost } = params;
  try {
    const { data } = await client.post('/v1/stocks/holdings', { accountId, stockId, unit, cost });
    return data as CreateNewStockHoldingResponse;
  } catch (error) {
    const { response } = error as AxiosError;
    if (!response) {
      throw new Error('Unexpected error. Please try again.');
    }
    throw new Error((response.data as CreateNewStockHoldingResponse).error);
  }
}
