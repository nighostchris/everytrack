import { Route, Outlet, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { HomePage, SavingsPage, DashboardPage } from '@pages';
import { HomePageGuardian, PrivateRouteGuardian } from '@features/auth/components';

const routes = createRoutesFromElements(
  <Route path="/" element={<Outlet />}>
    <Route element={<HomePageGuardian />}>
      <Route index element={<HomePage />} />
    </Route>
    <Route element={<PrivateRouteGuardian />}>
      <Route path="savings" element={<SavingsPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
    </Route>
  </Route>,
);

const router = createBrowserRouter(routes);

export default router;
