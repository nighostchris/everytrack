import { Route, Outlet, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import DashboardPage from '@pages/DashboardPage';

const routes = createRoutesFromElements(
  <Route path="/" element={<Outlet />}>
    <Route index element={<></>} />
    <Route path="dashboard" element={<DashboardPage />} />
  </Route>,
);

const router = createBrowserRouter(routes);

export default router;
