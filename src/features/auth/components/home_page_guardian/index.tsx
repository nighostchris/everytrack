import React from 'react';
import { Navigate, Outlet, redirect } from 'react-router-dom';

import { store } from '../../zustand';
import { Spinner } from '@components';
import { verify } from 'src/api/everytrack_backend';

export const HomePageGuardian: React.FC = () => {
  const { accessToken } = store();

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const verifyAccessToken = async () => {
      // make remote call to verify endpoint
      // if verify success => redirect to dashboard page
      // const result = await verify();
      // redirect('/dashboard');
      setIsLoading(false);
    };

    if (accessToken) {
      verifyAccessToken();
    }
    setIsLoading(false);
  }, []);

  return isLoading ? (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner isLoading={isLoading} size="lg" />
    </div>
  ) : accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

export default HomePageGuardian;
