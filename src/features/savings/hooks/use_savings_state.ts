import React from 'react';

import { store } from '../zustand';

export const useSavingsState = () => {
  const { updateBankDetails, updateCurrencies } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const initBankDetails = React.useCallback(async () => {
    // try {

    // } catch (error: any) {

    // }
    updateBankDetails({
      // TODO: change all fields to camelCase from backend
      'Chase Bank UK': [
        {
          id: '4f7fd94e-c85d-4a0c-b29c-a700c0355390',
          name: 'Current Account',
        },
        {
          id: 'f6064c3a-eba1-4311-ba8e-0570cf704598',
          name: 'Savings Account',
        },
      ],
    });
  }, []);

  const initCurrencies = React.useCallback(async () => {
    // try {

    // } catch (error: any) {

    // }
    updateCurrencies([
      { id: '29209fa0-ad67-44d1-b0a7-7f52638ef67b', ticker: 'HKD', symbol: 'HKD$' },
      { id: '4aaa0934-9df4-4f3a-b354-8681fcc6e209', ticker: 'USD', symbol: 'USD$' },
      { id: '1636d052-2a53-4155-a55e-857021777fbd', ticker: 'GBP', symbol: '£' },
    ]);
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
