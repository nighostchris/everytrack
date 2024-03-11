/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import BigNumber from 'bignumber.js';
import { GiMoneyStack } from 'react-icons/gi';
import { AiOutlineStock } from 'react-icons/ai';
import { ToastContainer } from 'react-toastify';
import { FaSackDollar, FaMoneyBillTrendUp } from 'react-icons/fa6';

import 'react-toastify/dist/ReactToastify.css';

import { Root } from '@layouts/root';
import {
  AddNewBrokerModal,
  AddNewAccountModal,
  DeleteAccountModal,
  EditCashHoldingModal,
  AddNewStockHoldingModal,
  DeleteStockHoldingModal,
  EditStockHoldingCostModal,
  BrokerAccountHoldingsTable,
  StockHoldingDistributionChart,
} from '@features/brokers/components';
import { useDisplayCurrency } from '@hooks';
import { store } from '@features/brokers/zustand';
import { Button, Select, type SelectOption, Card } from '@components';
import { useBrokersState } from '@features/brokers/hooks/use_brokers_state';

export const BrokersPage: React.FC = () => {
  const { symbol, error: displayCurrencyError } = useDisplayCurrency();
  const { updateOpenAddNewBrokerModal, updateOpenAddNewAccountModal, populateAddNewAccountModalState } = store();
  const { brokers, brokerAccountMetrics, assetDistribution, enableAddNewProvider, error: brokersStateError } = useBrokersState();

  const [currentBrokerId, setCurrentBrokerId] = React.useState<string>();

  const currentBrokerMetrics = React.useMemo(() => {
    let metrics: { totalBalance: string | undefined; totalReturns: string | undefined } = {
      totalBalance: undefined,
      totalReturns: undefined,
    };
    if (currentBrokerId) {
      const accountMetrics = brokerAccountMetrics.get(currentBrokerId);
      metrics = accountMetrics ?? metrics;
    }
    return metrics;
  }, [currentBrokerId, brokerAccountMetrics]);
  const totalBrokerMetrics = React.useMemo(() => {
    let totalBrokerBalance = new BigNumber(0);
    let totalBrokerReturns = new BigNumber(0);
    brokerAccountMetrics.forEach(({ totalBalance, totalReturns }) => {
      totalBrokerBalance = totalBrokerBalance.plus(totalBalance);
      totalBrokerReturns = totalBrokerReturns.plus(totalReturns);
    });
    return { totalBalance: totalBrokerBalance, totalReturns: totalBrokerReturns };
  }, [brokerAccountMetrics]);
  const currentBroker = React.useMemo(() => brokers.filter(({ id }) => id === currentBrokerId)[0], [brokers, currentBrokerId]);
  const brokerOptions: SelectOption[] = React.useMemo(() => brokers.map(({ id, name }) => ({ value: id, display: name })), [brokers]);

  React.useEffect(() => {
    if (brokers.length > 0) {
      setCurrentBrokerId(brokers[0].id);
    }
  }, [brokers]);

  return (
    <Root>
      <AddNewBrokerModal />
      <AddNewAccountModal />
      <DeleteAccountModal />
      <EditCashHoldingModal />
      <DeleteStockHoldingModal />
      <AddNewStockHoldingModal />
      <EditStockHoldingCostModal />
      <div className={clsx('relative h-full overflow-y-auto px-8 py-6')}>
        <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex flex-col space-y-1 md:space-y-2">
            <h1 className="text-xl font-semibold text-gray-900">Broker Assets</h1>
            <p className="text-sm text-gray-700">Balance of all your broker accounts</p>
          </div>
          <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            {currentBrokerId && (
              <Select
                label=""
                placeholder=""
                value={currentBrokerId}
                setValue={setCurrentBrokerId}
                options={brokerOptions}
                className="md:w-64 md:max-w-64"
              />
            )}
            {enableAddNewProvider && (
              <button
                type="button"
                onClick={() => updateOpenAddNewBrokerModal(true)}
                className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 md:w-auto"
              >
                Add New Broker
              </button>
            )}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-y-6 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-0">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: FaSackDollar, title: 'Total Broker Balance', value: totalBrokerMetrics.totalBalance },
              { icon: FaMoneyBillTrendUp, title: 'Total Broker Returns', value: totalBrokerMetrics.totalReturns },
              { icon: GiMoneyStack, title: 'Total Account Balance', value: currentBrokerMetrics.totalBalance },
              { icon: AiOutlineStock, title: 'Total Account Returns', value: currentBrokerMetrics.totalReturns },
            ].map(({ icon: Icon, title, value }, index) => (
              <Card className="flex flex-col space-y-2 !bg-white px-6 py-4">
                <span
                  className={clsx('flex w-fit flex-row items-center justify-center rounded-full p-3', {
                    'bg-yellow-200': index % 2 === 0,
                    'bg-green-200': index % 2 === 1 && new BigNumber(value ?? 0).isPositive(),
                    'bg-red-200': index % 2 === 1 && new BigNumber(value ?? 0).isNegative(),
                  })}
                >
                  <Icon
                    className={clsx('h-5 w-5', {
                      'text-yellow-800': index % 2 === 0,
                      'text-green-800': index % 2 === 1 && new BigNumber(value ?? 0).isPositive(),
                      'text-red-800': index % 2 === 1 && new BigNumber(value ?? 0).isNegative(),
                    })}
                  />
                </span>
                <p className="text-xs">{title}</p>
                <p
                  className={clsx('text-xl font-medium', {
                    'text-green-800': index % 2 === 1 && new BigNumber(value ?? 0).isPositive(),
                    'text-red-800': index % 2 === 1 && new BigNumber(value ?? 0).isNegative(),
                  })}
                >{`${symbol}${new BigNumber(value ?? 0).toFormat(2)}`}</p>
              </Card>
            ))}
          </div>
          <div className="flex flex-col rounded-lg border border-gray-300 lg:col-span-2">
            <h3 className="p-6 pb-0 text-sm leading-none tracking-tight">Distribution</h3>
            <div className="relative flex h-[220px] w-full flex-col items-center justify-center">
              <StockHoldingDistributionChart data={assetDistribution} />
            </div>
          </div>
        </div>
        {currentBroker && (
          <div className="mt-6 flex flex-col">
            <div className="flex flex-col space-y-8">
              {currentBroker.accounts.map((account) => (
                <BrokerAccountHoldingsTable data={account} />
              ))}
            </div>
            <Button
              variant="outlined"
              className="mt-6 h-10 w-full !border-none text-xs hover:shadow-md"
              onClick={() => {
                populateAddNewAccountModalState(currentBroker.id);
                updateOpenAddNewAccountModal(true);
              }}
            >
              Add New Account
            </Button>
          </div>
        )}
      </div>
      <ToastContainer />
    </Root>
  );
};

export default BrokersPage;
