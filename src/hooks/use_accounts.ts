import { useQuery } from '@tanstack/react-query';

import { getAllAccounts } from '@api/everytrack_backend';

export const useBankAccounts = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['accounts', 'savings'],
    queryFn: async () => getAllAccounts('savings'),
  });
  return { bankAccounts: data?.data, isLoading, error: !error ? undefined : error, refetch };
};

export const useBrokerAccounts = () => {
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['accounts', 'broker'], queryFn: async () => getAllAccounts('broker') });
  return { brokerAccounts: data?.data, isLoading, error: !error ? undefined : error, refetch };
};
