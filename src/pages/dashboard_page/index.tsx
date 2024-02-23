/* eslint-disable max-len */
import React from 'react';
import { FaSackDollar } from 'react-icons/fa6';
import { GiReceiveMoney, GiLockedChest, GiPayMoney } from 'react-icons/gi';

import Root from '@layouts/root';
import { StatCard } from '@components';
import { useDisplayCurrency } from '@hooks';
import { store as globalStore } from '@lib/zustand';
import { useDashboardState } from '@features/dashboard/hooks/use_dashboard_state';
import { AssetDistributionChart, RecentExpensesListCard, ThisMonthVersusLastMonthCard } from '@features/dashboard/components';

export const DashboardPage: React.FC = () => {
  const {
    lockedFund,
    totalBalance,
    recentExpenses,
    spentThisMonth,
    assetDistribution,
    recentTwoMonthsExpenses,
    instantAccessibleBalance,
    error: dashboardStateError,
  } = useDashboardState();
  const { username } = globalStore();
  const { symbol, error: displayCurrencyError } = useDisplayCurrency();

  return (
    <Root>
      <div className="flex h-full flex-col overflow-y-auto px-8 py-6">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <div className="mt-4 grid grid-rows-1 gap-x-6 lg:h-full xl:grid-cols-3">
          <div className="flex h-full flex-col py-6">
            <h2 className="text-4xl font-medium">{`Hello ${username}`}</h2>
            <h3 className="mt-2 text-xl">Let's have a look at your balance</h3>
            <StatCard title="Total Balance" icon={FaSackDollar} className="mt-8">
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-semibold">{`${symbol} ${totalBalance}`}</p>
            </StatCard>
            <div className="mt-4 flex h-full flex-col rounded-lg border border-gray-300">
              <h3 className="p-6 pb-0 text-sm leading-none tracking-tight">Distribution</h3>
              <AssetDistributionChart data={assetDistribution} />
            </div>
          </div>
          <div className="flex h-full flex-col pb-6 xl:col-span-2 xl:px-6">
            <div className="grid grid-rows-1 gap-y-4 lg:grid-cols-3 lg:gap-x-4">
              <StatCard title="Instant Accessible Balance" icon={GiReceiveMoney}>
                <p className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-semibold">{`${symbol} ${instantAccessibleBalance}`}</p>
              </StatCard>
              <StatCard title="Locked Fund" icon={GiLockedChest}>
                <p className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-semibold">{`${symbol} ${lockedFund}`}</p>
              </StatCard>
              <StatCard title="Spent this month" icon={GiPayMoney}>
                <p className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-semibold">{`${symbol} ${spentThisMonth}`}</p>
              </StatCard>
            </div>
            {/* <div className="mt-6 flex h-full w-full flex-col space-y-4 overflow-y-hidden pt-4">
              <h3 className="text-xl font-semibold text-gray-900">Recent Expenses</h3>
              <Timeline feeds={recentExpenses.slice(0, 7)} className="h-full overflow-y-auto" />
            </div> */}
          </div>
        </div>
        {/* Consturuction Site - To be refactored */}
        <div className="mt-4 grid grid-rows-1 gap-y-6 xl:grid-cols-2 xl:gap-x-8 xl:gap-y-0">
          <ThisMonthVersusLastMonthCard data={[] ?? recentTwoMonthsExpenses} />
          <RecentExpensesListCard data={recentExpenses} />
        </div>
        {/* Consturuction Site - To be refactored */}
      </div>
    </Root>
  );
};

export default DashboardPage;
