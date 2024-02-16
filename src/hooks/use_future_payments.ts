import { useQuery } from '@tanstack/react-query';

import { getAllFuturePayments } from '@api/everytrack_backend';

export const useFuturePayments = () => {
  const query = useQuery({ queryKey: ['fpayments'], queryFn: getAllFuturePayments });
  const { data, error } = query;
  return { ...query, futurePayments: data?.data, error: !error ? undefined : error };
};
