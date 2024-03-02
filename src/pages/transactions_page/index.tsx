/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import dayjs from 'dayjs';
import { ResponsiveBar } from '@nivo/bar';
import { GiPayMoney } from 'react-icons/gi';
import { FaQuestion } from 'react-icons/fa6';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { Root } from '@layouts/root';
import { useDisplayCurrency } from '@hooks';
import { StatCard, Tabs, TabsContent, TabsList, TabsTrigger } from '@components';
import { ExpenseBarChartData, useTransactionsState } from '@features/transactions/hooks/use_transactions_state';
import { AddNewTransactionModal, DeleteTransactionModal, TransactionsTable } from '@features/transactions/components';

const extractExistingCategories = (chartData: ExpenseBarChartData[]) => {
  const map = new Map<string, boolean>();
  chartData.forEach((month) => Object.keys(month).forEach((key) => key !== 'spentDate' && map.set(key, true)));
  return Array.from(map.keys());
};

export const TransactionsPage: React.FC = () => {
  const {
    spentThisYear,
    spentThisMonth,
    transactionsTableRows,
    monthlyExpenseChartData,
    error: expensesStateError,
  } = useTransactionsState();
  const { symbol, error: displayCurrencyError } = useDisplayCurrency();

  return (
    <Root>
      <AddNewTransactionModal />
      <DeleteTransactionModal />
      <div className={clsx('relative flex h-full flex-col overflow-y-auto px-8 py-6')}>
        <h1 className="text-xl font-semibold text-gray-900">Transactions</h1>
        <p className="mt-2 text-sm text-gray-700">Easily organize and search all your income payments and expenses</p>
        <div className="mt-8 grid grid-cols-1 gap-y-4 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-0">
          <div className="flex flex-col space-y-5">
            <StatCard title="Spent This Month" icon={GiPayMoney}>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-semibold">{`${symbol} ${spentThisMonth}`}</p>
            </StatCard>
            <StatCard title="Spent This Year" icon={GiPayMoney}>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-semibold">{`${symbol} ${spentThisYear}`}</p>
            </StatCard>
            <StatCard title="Other Metrics" icon={FaQuestion}>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold">To Be Constructed Later</p>
            </StatCard>
          </div>
          <div className="flex flex-col rounded-lg border border-gray-300 px-6 py-4 lg:col-span-2">
            <Tabs defaultValue="monthly" className="space-y-4">
              <TabsList className="h-8 !p-1">
                <TabsTrigger value="weekly" className="text-xs">
                  Weekly
                </TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs">
                  Monthly
                </TabsTrigger>
                <TabsTrigger value="distribution" className="text-xs">
                  Distribution
                </TabsTrigger>
              </TabsList>
              <TabsContent value="monthly">
                <div className="h-[400px] w-full p-6 pt-0">
                  <ResponsiveBar
                    data={monthlyExpenseChartData}
                    keys={extractExistingCategories(monthlyExpenseChartData)}
                    indexBy="spentDate"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: 'linear' }}
                    colors={{ scheme: 'nivo' }}
                    borderColor={{
                      from: 'color',
                      modifiers: [['darker', 1.6]],
                    }}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      format: (value) => dayjs.unix(value).format('MMM'),
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{
                      from: 'color',
                      modifiers: [['darker', 1.6]],
                    }}
                    tooltip={() => <div />}
                    legends={[
                      {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                      },
                    ]}
                    ariaLabel="Monthly Expense"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <TransactionsTable data={transactionsTableRows} className="!mt-10" />
      </div>
      <ToastContainer />
    </Root>
  );
};

export default TransactionsPage;
