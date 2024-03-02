import { useQuery } from '@tanstack/react-query';

import { getAllTransactions } from '@api/everytrack_backend';

export const useTransactions = () => {
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['transactions'], queryFn: getAllTransactions });
  return { transactions: data?.data, isLoading, error: !error ? undefined : error, refetch };
};
