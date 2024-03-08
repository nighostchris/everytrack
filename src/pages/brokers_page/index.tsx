/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import BigNumber from 'bignumber.js';
import { ToastContainer } from 'react-toastify';
import { FaSackDollar, FaQuestion } from 'react-icons/fa6';
import { AiOutlineRise, AiOutlineStock } from 'react-icons/ai';

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
import { StatCard, Button, Select, type SelectOption } from '@components';
import { useBrokersState } from '@features/brokers/hooks/use_brokers_state';

export const BrokersPage: React.FC = () => {
  const { symbol, error: displayCurrencyError } = useDisplayCurrency();
  const { updateOpenAddNewBrokerModal, updateOpenAddNewAccountModal, populateAddNewAccountModalState } = store();
  const { brokers, totalBalance, winLoseAmount, assetDistribution, enableAddNewProvider, error: brokersStateError } = useBrokersState();

  const [currentBrokerId, setCurrentBrokerId] = React.useState<string>();

  const currentBroker = React.useMemo(() => brokers.filter(({ id }) => id === currentBrokerId)[0], [brokers, currentBrokerId]);
  const brokerOptions: SelectOption[] = React.useMemo(() => brokers.map(({ id, name }) => ({ value: id, display: name })), [brokers]);
  console.log({ brokers, currentBroker });

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
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Broker Assets</h1>
            <p className="mt-2 text-sm text-gray-700">Balance of all your broker accounts</p>
          </div>
          {currentBrokerId && (
            <Select
              label=""
              placeholder=""
              value={currentBrokerId}
              setValue={setCurrentBrokerId}
              options={brokerOptions}
              className="max-w-64"
            />
          )}
          {enableAddNewProvider && (
            <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-none">
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
        <div className="mt-6 grid grid-cols-1 gap-y-4 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-0">
          <div className="flex flex-col space-y-5">
            <StatCard title="Total Balance" icon={FaSackDollar}>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-semibold">{`${symbol} ${totalBalance}`}</p>
            </StatCard>
            <StatCard title="W / L" icon={AiOutlineStock}>
              <div className="mt-1 flex flex-row items-center">
                <AiOutlineRise
                  className={clsx('h-6 w-6 font-bold', {
                    'text-green-600': new BigNumber(winLoseAmount.replaceAll(',', '')).isPositive(),
                    'text-red-600': new BigNumber(winLoseAmount.replaceAll(',', '')).isNegative(),
                  })}
                />
                <p
                  className={clsx('ml-2 overflow-hidden text-ellipsis whitespace-nowrap text-2xl', {
                    'text-green-600': new BigNumber(winLoseAmount.replaceAll(',', '')).isPositive(),
                    'text-red-600': new BigNumber(winLoseAmount.replaceAll(',', '')).isNegative(),
                  })}
                >{`${symbol} ${winLoseAmount}`}</p>
              </div>
            </StatCard>
            <StatCard title="Other Metrics" icon={FaQuestion}>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold">To Be Constructed Later</p>
            </StatCard>
          </div>
          <div className="flex flex-col rounded-lg border border-gray-300 lg:col-span-2">
            <h3 className="p-6 pb-0 text-sm leading-none tracking-tight">Distribution</h3>
            <StockHoldingDistributionChart data={assetDistribution} />
          </div>
        </div>
        {currentBroker && (
          <div className="mt-8 flex flex-col">
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
