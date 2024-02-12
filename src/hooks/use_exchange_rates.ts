import { useQuery } from '@tanstack/react-query';

import { getAllExchangeRates } from '@api/everytrack_backend';

export const useExchangeRates = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ['exchangeRates'], queryFn: getAllExchangeRates });
  return { exchangeRates: data?.data, isLoading, error: !error ? undefined : error };
};
