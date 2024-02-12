import { useQuery } from '@tanstack/react-query';

import { getAllCurrencies } from '@api/everytrack_backend';

export const useCurrencies = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ['currencies'], queryFn: getAllCurrencies });
  return { currencies: data?.data, isLoading, error: !error ? undefined : error };
};
