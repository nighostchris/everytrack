import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

import { store } from '@lib/zustand';
import { Spinner } from '@components';
import { getAllClientSettings, getAllCurrencies, getAllExchangeRates, verify } from '@api/everytrack_backend';

export const PrivateRouteGuardian: React.FC = () => {
  const navigate = useNavigate();
  const { updateUsername, updateCurrencyId, updateCurrencies, updateExchangeRates } = store();

  const [isLoading, setIsLoading] = React.useState(true);

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

  const initExchangeRates = React.useCallback(async () => {
    try {
      const { success, data } = await getAllExchangeRates();
      if (success) {
        updateExchangeRates(data);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  const initClientSettings = React.useCallback(async () => {
    try {
      const { success, data } = await getAllClientSettings();
      if (success) {
        updateUsername(data.username);
        updateCurrencyId(data.currencyId);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  React.useEffect(() => {
    const verifyAccessToken = async () => {
      try {
        const { success } = await verify();
        if (!success) {
          // Navigate user to DashboardPage since his auth token is valid
          navigate('/');
        }
      } catch (error: any) {
        console.log(error);
        navigate('/');
      }
      setIsLoading(false);
    };

    verifyAccessToken();
    initCurrencies();
    initExchangeRates();
    initClientSettings();
  }, [initCurrencies, initClientSettings, initExchangeRates]);

  return isLoading ? (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner isLoading={isLoading} size="lg" />
    </div>
  ) : (
    <Outlet />
  );
};

export default PrivateRouteGuardian;
