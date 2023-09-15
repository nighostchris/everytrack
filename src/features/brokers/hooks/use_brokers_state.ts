import React from 'react';

import { store } from '../zustand';
import { getAllAccounts, getAllProviders } from '@api/everytrack_backend';

export const useBrokersState = () => {
  const { updateBrokerAccounts, updateBrokerDetails } = store();

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

  React.useEffect(() => {
    setIsLoading(true);
    initBrokerAccounts();
    initBrokerDetails();
    setIsLoading(false);
  }, [initBrokerAccounts, initBrokerDetails]);

  return { isLoading };
};

export default useBrokersState;
