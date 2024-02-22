/* eslint-disable max-len */
import React from 'react';
import dayjs from 'dayjs';
import { ResponsiveLine } from '@nivo/line';
import { FaSackDollar } from 'react-icons/fa6';
import { GiReceiveMoney, GiLockedChest, GiPayMoney } from 'react-icons/gi';

import Root from '@layouts/root';
import { useDisplayCurrency } from '@hooks';
import { StatCard, Timeline } from '@components';
import { store as globalStore } from '@lib/zustand';
import { AssetDistributionChart } from '@features/dashboard/components';
import { useDashboardState } from '@features/dashboard/hooks/use_dashboard_state';

export const DashboardPage: React.FC = () => {
  const {
    lockedFund,
    totalBalance,
    recentExpenses,
    spentThisMonth,
    assetDistribution,
    instantAccessibleBalance,
    error: dashboardStateError,
  } = useDashboardState();
  const { username } = globalStore();
  const { symbol, error: displayCurrencyError } = useDisplayCurrency();

  return (
    <Root>
      <div className="flex h-full flex-col px-8 py-6">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        {/* Consturuction Site - To be refactored */}
        <div className="mb-20 mt-4 grid grid-cols-2 gap-x-8">
          <div className="flex h-72 w-full flex-col rounded-lg border border-gray-300 bg-white p-6">
            <h4 className="text-sm font-medium text-gray-500">Expense</h4>
            <h5 className="mb-2 mt-1 text-lg font-semibold">This month vs. Last month</h5>
            <div className="h-full w-full">
              <ResponsiveLine
                data={[
                  {
                    id: 'This Month',
                    data: [
                      { x: new Date('2024-02-01'), y: 0 },
                      { x: new Date('2024-02-02'), y: 37.8 },
                      { x: new Date('2024-02-03'), y: 70 },
                    ],
                  },
                  {
                    id: 'Last Month',
                    data: [
                      { x: new Date('2024-02-01'), y: 0 },
                      { x: new Date('2024-02-02'), y: 25 },
                      { x: new Date('2024-02-03'), y: 155.5 },
                    ],
                  },
                ]}
                colors={['#f87171', '#dc2626']}
                margin={{ left: 50, bottom: 50, top: 50, right: 50 }}
                xScale={{ type: 'time', precision: 'day' }}
                yScale={{
                  min: 0,
                  max: 'auto',
                  type: 'linear',
                }}
                useMesh={true}
                curve="linear"
                lineWidth={0}
                enableArea={true}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  tickValues: 'every 1 day',
                  legendOffset: -12,
                  legendPosition: 'middle',
                  truncateTickAt: 0,
                  format: (value) => {
                    return `Day ${dayjs(value).diff(dayjs().startOf('month'), 'days') + 1}`;
                  },
                }}
                axisLeft={{
                  tickSize: 5,
                  tickValues: 4,
                  tickPadding: 5,
                  tickRotation: 0,
                  legendOffset: 12,
                  truncateTickAt: 0,
                  legendPosition: 'middle',
                }}
                enablePoints={false}
                areaOpacity={0.25}
                enableGridX={false}
                enableGridY={false}
                theme={{
                  axis: {
                    domain: {
                      line: {
                        stroke: '#64748b',
                        strokeWidth: 2,
                      },
                    },
                  },
                }}
                tooltip={({
                  point: {
                    data: { y: value },
                  },
                }) => (
                  <div>
                    <p className="whitespace-pre-wrap rounded-md bg-gray-700 px-2 py-1 text-xs text-gray-200">{`${symbol} ${value}`}</p>
                  </div>
                )}
                legends={[
                  {
                    itemHeight: 20,
                    itemWidth: 100,
                    translateY: 50,
                    itemsSpacing: 20,
                    direction: 'row',
                    anchor: 'bottom',
                  },
                ]}
              />
            </div>
          </div>
          <div className="h-80 w-full rounded-lg border border-gray-300 bg-white"></div>
        </div>
        {/* Consturuction Site - To be refactored */}
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
            <div className="mt-6 flex h-full w-full flex-col space-y-4 overflow-y-hidden pt-4">
              <h3 className="text-xl font-semibold text-gray-900">Recent Expenses</h3>
              <Timeline feeds={recentExpenses.slice(0, 7)} className="h-full overflow-y-auto" />
            </div>
          </div>
        </div>
      </div>
    </Root>
  );
};

export default DashboardPage;
