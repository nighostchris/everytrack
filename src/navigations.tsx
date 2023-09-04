import { Route, Outlet, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { HomePage, SavingsPage, DashboardPage } from '@pages';

const routes = createRoutesFromElements(
  <Route path="/" element={<Outlet />}>
    <Route index element={<HomePage />} />
    <Route path="savings" element={<SavingsPage />} />
    <Route path="dashboard" element={<DashboardPage />} />
  </Route>,
);

const router = createBrowserRouter(routes);

export default router;
