/* eslint-disable max-len */
import React from 'react';
import { FaSackDollar } from 'react-icons/fa6';
import { GiReceiveMoney, GiLockedChest, GiPayMoney } from 'react-icons/gi';

import Root from '@layouts/root';
import { StatCard } from '@components';

export const DashboardPage: React.FC = () => {
  const displayCurrency = '£';
  const totalBalance = '12345.66';

  return (
    <>
      <Root>
        <div className="flex h-full flex-col px-8 py-6">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <div className="mt-4 grid grid-rows-1 gap-x-6 lg:h-full xl:grid-cols-3">
            <div className="flex h-full flex-col py-6">
              <h2 className="text-4xl font-medium">Hello Username</h2>
              <h3 className="mt-2 text-xl">Let's have a look at your balance</h3>
              <StatCard title="Total Balance" icon={FaSackDollar} className="mt-8">
                <p className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-semibold">{`${displayCurrency} ${totalBalance}`}</p>
              </StatCard>
              <div className="mt-4 flex h-full flex-col rounded-lg border border-gray-300">
                <h3 className="p-6 pb-0 text-sm leading-none tracking-tight">Distribution</h3>
                <div className="h-full w-full"></div>
              </div>
            </div>
            <div className="flex h-full flex-col pb-6 xl:col-span-2 xl:px-6">
              <div className="grid grid-rows-1 gap-y-4 lg:grid-cols-3 lg:gap-x-4">
                <StatCard title="Instant Accessible Balance" icon={GiReceiveMoney}>
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-semibold">{`${displayCurrency} ${totalBalance}`}</p>
                </StatCard>
                <StatCard title="Locked Fund" icon={GiLockedChest}>
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-semibold">{`${displayCurrency} ${totalBalance}`}</p>
                </StatCard>
                <StatCard title="Spent this month" icon={GiPayMoney}>
                  <p className="text-sm">To be supported in future</p>
                </StatCard>
              </div>
              <div className="mt-6 h-full w-full rounded-lg border border-gray-300 p-6">Transaction history to be supported in future</div>
            </div>
          </div>
        </div>
      </Root>
    </>
  );
};

export default DashboardPage;
