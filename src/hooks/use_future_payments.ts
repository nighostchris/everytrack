import { useQuery } from '@tanstack/react-query';

import { getAllFuturePayments } from '@api/everytrack_backend';

export const useFuturePayments = () => {
  const query = useQuery({ queryKey: ['fpayments'], queryFn: getAllFuturePayments, select: ({ data }) => data });
  const { data: futurePayments, error } = query;
  return { ...query, futurePayments, error: !error ? undefined : error };
};
