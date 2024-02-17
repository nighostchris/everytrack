import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { Stock, getAllStocks } from '@api/everytrack_backend';

export const useStocks = () => {
  const query = useQuery({ queryKey: ['stocks'], queryFn: getAllStocks, select: ({ data }) => data });
  const { data: stocks, error } = query;
  const stocksMap = React.useMemo(() => {
    const map: Map<string, Stock> = new Map();
    (stocks ?? []).forEach((stock) => map.set(stock.id, stock));
    return map;
  }, [stocks]);
  return { ...query, stocks, stocksMap, error: !error ? undefined : error };
};
