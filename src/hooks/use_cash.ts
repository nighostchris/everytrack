import { useQuery } from '@tanstack/react-query';

import { getAllCash } from '@api/everytrack_backend';

export const useCash = () => {
  const query = useQuery({ queryKey: ['cash'], queryFn: getAllCash });
  const { data, error } = query;
  return { ...query, cash: data?.data, error: !error ? undefined : error };
};
