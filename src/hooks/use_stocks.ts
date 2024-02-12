import { useQuery } from '@tanstack/react-query';

import { getAllStocks } from '@api/everytrack_backend';

export const useStocks = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ['stocks'], queryFn: getAllStocks });
  return { stocks: data?.data, isLoading, error: !error ? undefined : error };
};
