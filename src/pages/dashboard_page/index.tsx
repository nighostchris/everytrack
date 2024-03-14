/* eslint-disable max-len */
import React from 'react';

import Root from '@layouts/root';
import { store as globalStore } from '@lib/zustand';
import { useDashboardState } from '@features/dashboard/hooks/use_dashboard_state';
import { RecentTransactionsListCard, ThisMonthVersusLastMonthCard, TotalBalanceOverviewCard } from '@features/dashboard/components';

export const DashboardPage: React.FC = () => {
  const {
    lockedFund,
    totalBalance,
    assetDistribution,
    recentTransactions,
    recentTwoMonthsExpenses,
    instantAccessibleBalance,
    error: dashboardStateError,
  } = useDashboardState();
  const { username } = globalStore();

  return (
    <Root>
      <div className="flex h-full flex-col overflow-y-auto px-8 py-6">
        <div className="my-4 flex h-full flex-col">
          <h2 className="text-4xl font-medium">{`Hello ${username}`}</h2>
          <h3 className="mt-2 text-xl">Let's have a look at your balance</h3>
        </div>
        <div className="mt-4 grid grid-rows-1 gap-y-6 xl:grid-cols-2 xl:gap-x-8 xl:gap-y-0">
          <div className="grid grid-cols-1 gap-y-6">
            <TotalBalanceOverviewCard
              lockedFund={lockedFund}
              totalBalance={totalBalance}
              assetDistribution={assetDistribution}
              instantAccessibleBalance={instantAccessibleBalance}
            />
          </div>
          <div className="grid grid-cols-1 gap-y-6">
            <ThisMonthVersusLastMonthCard data={recentTwoMonthsExpenses} className="hidden md:flex" />
            <RecentTransactionsListCard data={recentTransactions} />
          </div>
        </div>
      </div>
    </Root>
  );
};

export default DashboardPage;
