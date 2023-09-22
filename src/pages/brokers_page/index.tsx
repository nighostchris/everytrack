/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import BigNumber from 'bignumber.js';
import { ResponsivePie } from '@nivo/pie';
import { FaSackDollar } from 'react-icons/fa6';
import { ToastContainer } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';
import { AiOutlineRise, AiOutlineStock } from 'react-icons/ai';

import 'react-toastify/dist/ReactToastify.css';

import { Root } from '@layouts/root';
import {
  AddNewBrokerModal,
  BrokerAccountTable,
  AddNewAccountModal,
  DeleteAccountModal,
  AddNewStockHoldingModal,
  DeleteStockHoldingModal,
  EditStockHoldingCostModal,
} from '@features/brokers/components';
import { store } from '@features/brokers/zustand';
import { useBrokersState } from '@features/brokers/hooks/use_brokers_state';
import { Tabs, StatCard, TabsList, TabsTrigger, TabsContent, Button } from '@components';

export const BrokersPage: React.FC = () => {
  const { displayCurrency } = useOutletContext<{ displayCurrency: string }>();
  const { updateOpenAddNewBrokerModal, updateOpenAddNewAccountModal, populateAddNewAccountModalState } = store();
  const { isLoading, totalBalance, canAddNewBroker, winLoseAmount, assetDistribution, brokerAccountTableRows } = useBrokersState();

  return (
    <Root>
      <AddNewBrokerModal />
      <AddNewAccountModal />
      <DeleteAccountModal />
      <DeleteStockHoldingModal />
      <AddNewStockHoldingModal />
      <EditStockHoldingCostModal />
      <div className={clsx('relative h-full overflow-y-auto px-8 py-6')}>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Broker Assets</h1>
            <p className="mt-2 text-sm text-gray-700">Balance of all your broker accounts</p>
          </div>
          {canAddNewBroker && (
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                onClick={() => updateOpenAddNewBrokerModal(true)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
                Add New Broker
              </button>
            </div>
          )}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-y-4 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-0">
          <div className="flex flex-col space-y-5">
            <StatCard title="Total Balance" icon={FaSackDollar}>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-semibold">{`${displayCurrency} ${totalBalance}`}</p>
            </StatCard>
            <StatCard title="W / L" icon={AiOutlineStock}>
              <div className="mt-1 flex flex-row items-center">
                <AiOutlineRise
                  className={clsx('h-6 w-6 font-bold', {
                    'text-green-600': new BigNumber(winLoseAmount).isPositive(),
                    'text-red-600': new BigNumber(winLoseAmount).isNegative(),
                  })}
                />
                <p
                  className={clsx('ml-2 overflow-hidden text-ellipsis whitespace-nowrap text-2xl', {
                    'text-green-600': new BigNumber(winLoseAmount).isPositive(),
                    'text-red-600': new BigNumber(winLoseAmount).isNegative(),
                  })}
                >{`${displayCurrency} ${winLoseAmount}`}</p>
              </div>
            </StatCard>
          </div>
          <div className="flex flex-col rounded-lg border border-gray-300 lg:col-span-2">
            <h3 className="p-6 pb-0 text-sm leading-none tracking-tight">Distribution</h3>
            <div className="h-full w-full p-6 pt-0">
              <ResponsivePie
                // @ts-ignore
                data={assetDistribution}
                padAngle={0.7}
                borderWidth={1}
                cornerRadius={3}
                innerRadius={0.5}
                arcLabelsSkipAngle={10}
                arcLinkLabelsThickness={2}
                activeOuterRadiusOffset={8}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLabel={(item) => `${item.value}%`}
                arcLinkLabelsColor={{ from: 'color' }}
                margin={{ top: 30, right: 20, bottom: 30, left: 20 }}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              />
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col">
          <h2 className="text-lg font-medium text-gray-900">Stocks</h2>
          {brokerAccountTableRows.length > 0 && (
            <Tabs defaultValue={brokerAccountTableRows[0].id} className="mt-2 space-y-4">
              <TabsList>
                {brokerAccountTableRows.map(({ id, name }) => (
                  <TabsTrigger value={id}>{name}</TabsTrigger>
                ))}
              </TabsList>
              {brokerAccountTableRows.map(({ id: providerId, accounts }) => (
                <TabsContent value={providerId}>
                  {accounts.map((account, accountIndex) => (
                    <BrokerAccountTable data={account} className={accountIndex !== 0 ? 'mt-6' : undefined} />
                  ))}
                  <Button
                    variant="contained"
                    className="mt-6 h-10 w-full text-xs"
                    onClick={() => {
                      populateAddNewAccountModalState(providerId);
                      updateOpenAddNewAccountModal(true);
                    }}
                  >
                    Add New Account
                  </Button>
                </TabsContent>
              ))}
            </Tabs>
          )}
          {brokerAccountTableRows.length === 0 && (
            <div className="flex w-full flex-col items-center py-6">
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Oops! 😢</h1>
              <p className="mt-6 text-lg leading-7 text-gray-600">You don't seems to own any stocks 💸💸💸</p>
              <p className="mt-2 text-base leading-7 text-gray-600">
                Just click the button in top right corner to add your stock accounts!
              </p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </Root>
  );
};

export default BrokersPage;
