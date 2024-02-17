import { Route, Outlet, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { HomePageGuardian, PrivateRouteGuardian } from '@features/auth/components';
import { HomePage, SavingsPage, SettingsPage, DashboardPage, ExpensesPage, BrokersPage, PaymentsPage, MetricsPage } from '@pages';

const routes = createRoutesFromElements(
  <Route path="/" element={<Outlet />}>
    <Route element={<HomePageGuardian />}>
      <Route index element={<HomePage />} />
    </Route>
    <Route element={<PrivateRouteGuardian />}>
      <Route path="brokers" element={<BrokersPage />} />
      <Route path="savings" element={<SavingsPage />} />
      <Route path="expenses" element={<ExpensesPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="payments" element={<PaymentsPage />} />
      <Route path="metrics" element={<MetricsPage />} />
    </Route>
  </Route>,
);

const router = createBrowserRouter(routes);

export default router;
