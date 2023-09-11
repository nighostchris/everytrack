import React from 'react';

import { store } from '../zustand';
import { getAllBankDetails } from '@api/everytrack_backend';
import { getAllCurrencies } from '@api/everytrack_backend/currency';

export const useSavingsState = () => {
  const { updateBankDetails, updateCurrencies } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const initBankDetails = React.useCallback(async () => {
    try {
      const { success, data } = await getAllBankDetails();
      if (success) {
        updateBankDetails(data);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  const initCurrencies = React.useCallback(async () => {
    try {
      const { success, data } = await getAllCurrencies();
      if (success) {
        updateCurrencies(data);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  React.useEffect(() => {
    setIsLoading(true);
    initBankDetails();
    initCurrencies();
    setIsLoading(false);
  }, [initBankDetails, initCurrencies]);

  return { isLoading, openModal, setOpenModal };
};

export default useSavingsState;
