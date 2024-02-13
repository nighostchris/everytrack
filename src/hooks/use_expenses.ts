import { useQuery } from '@tanstack/react-query';

import { getAllExpenses } from '@api/everytrack_backend';

export const useExpenses = () => {
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['expenses'], queryFn: getAllExpenses });
  return { expenses: data?.data, isLoading, error: !error ? undefined : error, refetch };
};
