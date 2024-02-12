import { useQuery } from '@tanstack/react-query';

import { getAllCountries } from '@api/everytrack_backend';

export const useCountries = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ['countries'], queryFn: getAllCountries });
  return { countries: data?.data, isLoading, error: !error ? undefined : error };
};
