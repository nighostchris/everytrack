import { Route, Outlet, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { HomePageGuardian, PrivateRouteGuardian } from '@features/auth/components';
import { HomePage, SavingsPage, SettingsPage, DashboardPage, BrokersPage } from '@pages';

const routes = createRoutesFromElements(
  <Route path="/" element={<Outlet />}>
    <Route element={<HomePageGuardian />}>
      <Route index element={<HomePage />} />
    </Route>
    <Route element={<PrivateRouteGuardian />}>
      <Route path="savings" element={<SavingsPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="brokers" element={<BrokersPage />} />
    </Route>
  </Route>,
);

const router = createBrowserRouter(routes);

export default router;
