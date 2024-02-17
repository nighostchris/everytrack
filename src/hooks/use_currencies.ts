import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { Currency, getAllCurrencies } from '@api/everytrack_backend';

export const useCurrencies = () => {
  const query = useQuery({ queryKey: ['currencies'], queryFn: getAllCurrencies, select: ({ data }) => data });
  const { data: currencies, error } = query;
  const currenciesMap = React.useMemo(() => {
    const map: Map<string, Currency> = new Map();
    (currencies ?? []).forEach((currency) => map.set(currency.id, currency));
    return map;
  }, [currencies]);
  return { ...query, currencies, currenciesMap, error: !error ? undefined : error };
};
