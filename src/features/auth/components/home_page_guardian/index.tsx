import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

import { Spinner } from '@components';
import { verify } from '@api/everytrack_backend';

export const HomePageGuardian: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const verifyAccessToken = async () => {
      try {
        const { success } = await verify();
        if (success) {
          // Navigate user to DashboardPage since his auth token is valid
          navigate('/dashboard');
        }
      } catch (error: any) {
        console.log(error);
      }
      setIsLoading(false);
    };

    verifyAccessToken();
  }, []);

  return isLoading ? (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner isLoading={isLoading} size="lg" />
    </div>
  ) : (
    <Outlet />
  );
};

export default HomePageGuardian;
