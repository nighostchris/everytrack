import { Route, Outlet, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import SavingsPage from '@pages/savings_page';
import DashboardPage from '@pages/dashboard_page';

const routes = createRoutesFromElements(
  <Route path="/" element={<Outlet />}>
    <Route index element={<></>} />
    <Route path="savings" element={<SavingsPage />} />
    <Route path="dashboard" element={<DashboardPage />} />
  </Route>,
);

const router = createBrowserRouter(routes);

export default router;
