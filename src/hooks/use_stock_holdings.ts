import { useQuery } from '@tanstack/react-query';

import { getAllStockHoldings } from '@api/everytrack_backend';

export const useStockHoldings = () => {
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['stockHoldings'], queryFn: getAllStockHoldings });
  return { stockHoldings: data?.data, isLoading, error: !error ? undefined : error, refetch };
};
