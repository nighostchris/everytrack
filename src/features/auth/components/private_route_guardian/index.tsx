import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

import { store } from '@lib/zustand';
import { Spinner } from '@components';
import { verify, getAllClientSettings } from '@api/everytrack_backend';

export const PrivateRouteGuardian: React.FC = () => {
  const navigate = useNavigate();
  const { updateUsername, updateCurrencyId } = store();

  const [isLoading, setIsLoading] = React.useState(true);

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
        // Navigate user to HomePage for log in since his auth token is invalid
        if (!success) {
          navigate('/');
        }
      } catch (error: any) {
        navigate('/');
      }
      setIsLoading(false);
    };

    verifyAccessToken();
    initClientSettings();
  }, [initClientSettings]);

  return isLoading ? (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner isLoading={isLoading} size="lg" />
    </div>
  ) : (
    <Outlet />
  );
};

export default PrivateRouteGuardian;
