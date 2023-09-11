import React from 'react';

import { store } from '../zustand';
import { getAllBankAccounts, getAllBankDetails, getAllCurrencies } from '@api/everytrack_backend';

export const useSavingsState = () => {
  const { updateBankAccounts, updateBankDetails, updateCurrencies } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const initBankAccounts = React.useCallback(async () => {
    try {
      const { success, data } = await getAllBankAccounts();
      if (success) {
        updateBankAccounts(data);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, []);

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
    initBankAccounts();
    initBankDetails();
    initCurrencies();
    setIsLoading(false);
  }, [initBankAccounts, initBankDetails, initCurrencies]);

  return { isLoading, openModal, setOpenModal };
};

export default useSavingsState;
