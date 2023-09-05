import { Route, Outlet, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { HomePage, SavingsPage, DashboardPage } from '@pages';
import HomePageGuardian from '@features/auth/components/home_page_guardian';

const routes = createRoutesFromElements(
  <Route path="/" element={<Outlet />}>
    <Route element={<HomePageGuardian />}>
      <Route index element={<HomePage />} />
    </Route>
    <Route path="savings" element={<SavingsPage />} />
    <Route path="dashboard" element={<DashboardPage />} />
  </Route>,
);

const router = createBrowserRouter(routes);

export default router;
