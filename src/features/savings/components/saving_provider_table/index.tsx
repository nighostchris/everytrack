/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import BigNumber from 'bignumber.js';
import { VscEdit } from 'react-icons/vsc';
import { useShallow } from 'zustand/react/shallow';
import { IoIosRemoveCircle } from 'react-icons/io';

import { useDisplayCurrency } from '@hooks';
import { store } from '@features/savings/zustand';
import { SavingProviderTableRow } from '../../hooks/use_savings_state';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button } from '@components';

interface SavingProviderTableProps {
  data: SavingProviderTableRow[];
}

export const SavingProviderTable: React.FC<SavingProviderTableProps> = ({ data }) => {
  const {
    updateOpenDeleteAccountModal,
    updateOpenAddNewAccountModal,
    populateDeleteAccountModalState,
    populateAddNewAccountModalState,
    updateOpenEditAccountBalanceModal,
    populateEditAccountBalanceModalState,
  } = store(
    useShallow(
      ({
        updateOpenDeleteAccountModal,
        updateOpenAddNewAccountModal,
        populateDeleteAccountModalState,
        populateAddNewAccountModalState,
        updateOpenEditAccountBalanceModal,
        populateEditAccountBalanceModalState,
      }) => ({
        updateOpenDeleteAccountModal,
        updateOpenAddNewAccountModal,
        populateDeleteAccountModalState,
        populateAddNewAccountModalState,
        updateOpenEditAccountBalanceModal,
        populateEditAccountBalanceModalState,
      }),
    ),
  );
  const { symbol: globalSymbol, error: displayCurrencyError } = useDisplayCurrency();

  return (
    <Accordion className="mt-8">
      <div className="text-md w-full bg-white px-6 pb-2 pt-6 font-semibold text-gray-900 md:px-8">Bank Accounts</div>
      {data.map(({ id, name, icon, balance, accounts }, providerIndex) => (
        <AccordionItem value={id} className={clsx({ 'border-t border-gray-200': providerIndex !== 0 })}>
          <AccordionTrigger className="!py-0 !no-underline">
            <div className="grid w-full max-w-xs grid-cols-3 gap-x-4 md:max-w-sm md:grid-cols-4 lg:max-w-md">
              <span className="col-span-1 md:col-span-2">
                <img src={icon} alt={name} className="h-16 w-16 object-scale-down md:w-24" />
              </span>
              <span className="col-span-1 flex flex-col items-start justify-center text-left">
                <h3 className="text-sm text-gray-700 md:text-base">{`${name}`}</h3>
                <h4 className="text-sm font-normal text-gray-500 md:hidden">{`${globalSymbol}${balance}`}</h4>
              </span>
              <span className="col-span-1 hidden flex-row items-center md:flex">
                <h4 className="text-sm font-normal text-gray-500">{`${globalSymbol}${balance}`}</h4>
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white py-2">
            {accounts.map(
              ({ id: accountId, name, balance: accountBalance, currency: { id: currencyId, symbol }, accountTypeId }, accountIndex) => (
                <div className={clsx('grid grid-cols-8 gap-x-2 py-4', { 'border-t border-gray-200': accountIndex !== 0 })}>
                  <h4 className="col-span-3 text-sm text-gray-900">{name}</h4>
                  <span className="col-span-3 flex flex-row items-center">
                    <h4 className="text-sm text-gray-500">{`${symbol}${new BigNumber(accountBalance).toFormat(2)}`}</h4>
                  </span>
                  <span className="col-span-2 flex flex-row items-center justify-end space-x-4">
                    <VscEdit
                      className="h-4 w-4 hover:cursor-pointer"
                      onClick={() => {
                        populateEditAccountBalanceModalState({ balance: accountBalance, currencyId, accountTypeId });
                        updateOpenEditAccountBalanceModal(true);
                      }}
                    />
                    <IoIosRemoveCircle
                      className="h-4 w-4 text-gray-600 hover:cursor-pointer"
                      onClick={() => {
                        populateDeleteAccountModalState(accountId);
                        updateOpenDeleteAccountModal(true);
                      }}
                    />
                  </span>
                </div>
              ),
            )}
            <div className="my-4 flex flex-col space-y-3">
              <Button
                variant="outlined"
                className="w-full text-xs"
                onClick={() => {
                  populateAddNewAccountModalState(id);
                  updateOpenAddNewAccountModal(true);
                }}
              >
                Add New Account
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default SavingProviderTable;
