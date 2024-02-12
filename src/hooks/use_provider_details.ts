import { useQuery } from '@tanstack/react-query';

import { getAllProviders } from '@api/everytrack_backend';

export const useBankDetails = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ['providers', 'savings'], queryFn: async () => getAllProviders('savings') });
  return { bankDetails: data?.data, isLoading, error: !error ? undefined : error };
};

export const useBrokerDetails = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ['providers', 'broker'], queryFn: async () => getAllProviders('broker') });
  return { brokerDetails: data?.data, isLoading, error: !error ? undefined : error };
};
