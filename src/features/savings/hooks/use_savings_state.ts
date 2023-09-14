import React from 'react';

import { store } from '../zustand';
import { getAllAccounts, getAllProviders } from '@api/everytrack_backend';

export const useSavingsState = () => {
  const { updateBankAccounts, updateBankDetails } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const initBankAccounts = React.useCallback(async () => {
    try {
      const { success, data } = await getAllAccounts('savings');
      if (success) {
        updateBankAccounts(data);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  const initBankDetails = React.useCallback(async () => {
    try {
      const { success, data } = await getAllProviders('savings');
      if (success) {
        updateBankDetails(data);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  React.useEffect(() => {
    setIsLoading(true);
    initBankAccounts();
    initBankDetails();
    setIsLoading(false);
  }, [initBankAccounts, initBankDetails]);

  return { isLoading };
};

export default useSavingsState;
