import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

import {
  verify,
  getAllStocks,
  getAllAccounts,
  getAllCountries,
  getAllCurrencies,
  getAllExchangeRates,
  getAllStockHoldings,
  getAllClientSettings,
} from '@api/everytrack_backend';
import { store } from '@lib/zustand';
import { Spinner } from '@components';

export const PrivateRouteGuardian: React.FC = () => {
  const navigate = useNavigate();
  const {
    currencies,
    currencyId,
    updateStocks,
    updateUsername,
    updateCountries,
    updateCurrencyId,
    updateCurrencies,
    updateBankAccounts,
    updateExchangeRates,
    updateBrokerAccounts,
    updateAccountStockHoldings,
  } = store();

  const [isLoading, setIsLoading] = React.useState(true);

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

  const initCountries = React.useCallback(async () => {
    try {
      const { success, data } = await getAllCountries();
      if (success) {
        updateCountries(data);
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

  const displayCurrency = React.useMemo(
    () => (currencies && currencyId ? currencies.filter(({ id }) => id === currencyId)[0].symbol : ''),
    [currencyId, currencies],
  );

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
    initStocks();
    initCountries();
    initCurrencies();
    initBankAccounts();
    initExchangeRates();
    initClientSettings();
    initBrokerAccounts();
    initAccountStockHoldings();
  }, [
    initStocks,
    initCountries,
    initCurrencies,
    initBankAccounts,
    initExchangeRates,
    initBrokerAccounts,
    initClientSettings,
    initAccountStockHoldings,
  ]);

  return isLoading ? (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner isLoading={isLoading} size="lg" />
    </div>
  ) : (
    <Outlet context={{ displayCurrency }} />
  );
};

export default PrivateRouteGuardian;
