import React from 'react';

import { store } from '../zustand';
import { getAllAccounts, getAllProviders, getAllStocks, getAllStockHoldings } from '@api/everytrack_backend';

export const useBrokersState = () => {
  const { updateStocks, updateBrokerAccounts, updateBrokerDetails, updateAccountStockHoldings } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const initBrokerAccounts = React.useCallback(async () => {
    try {
      const { success, data } = await getAllAccounts('broker');
      if (success) {
        updateBrokerAccounts(data);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  const initBrokerDetails = React.useCallback(async () => {
    try {
      const { success, data } = await getAllProviders('broker');
      if (success) {
        updateBrokerDetails(data);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  const initStocks = React.useCallback(async () => {
    try {
      const { success, data } = await getAllStocks();
      if (success) {
        updateStocks(data);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  const initAccountStockHoldings = React.useCallback(async () => {
    try {
      const { success, data } = await getAllStockHoldings();
      if (success) {
        updateAccountStockHoldings(data);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  React.useEffect(() => {
    setIsLoading(true);
    initAccountStockHoldings();
    initBrokerAccounts();
    initBrokerDetails();
    initStocks();
    setIsLoading(false);
  }, [initStocks, initBrokerAccounts, initBrokerDetails, initAccountStockHoldings]);

  return { isLoading };
};

export default useBrokersState;
