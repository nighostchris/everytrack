/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import BigNumber from 'bignumber.js';
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
  } = store();
  const { symbol, error: displayCurrencyError } = useDisplayCurrency();

  return (
    <Accordion className="mt-8">
      {data.map(({ id, name, icon, accounts }, providerIndex) => (
        <AccordionItem value={id} className={clsx({ 'border-t border-gray-200': providerIndex !== 0 })}>
          <AccordionTrigger className="!py-0">
            <img src={icon} alt={name} className="h-16 w-24 object-scale-down" />
          </AccordionTrigger>
          <AccordionContent className="bg-white px-4 py-2">
            {accounts.map(({ id: accountId, name, balance }, accountIndex) => (
              <div className={clsx('grid grid-cols-8 gap-x-2 py-4', { 'border-t border-gray-200': accountIndex !== 0 })}>
                <h4 className="col-span-3 text-sm font-medium text-gray-900">{name}</h4>
                <h4 className="col-span-3 text-sm text-gray-500">{`${symbol} ${new BigNumber(balance).toFormat(2)}`}</h4>
                <span className="col-span-2 flex flex-row items-center justify-end">
                  <IoIosRemoveCircle
                    className="h-4 w-4 text-gray-600 hover:cursor-pointer"
                    onClick={() => {
                      populateDeleteAccountModalState(accountId);
                      updateOpenDeleteAccountModal(true);
                    }}
                  />
                </span>
              </div>
            ))}
            <Button
              variant="outlined"
              className="my-4 w-full text-xs"
              onClick={() => {
                populateAddNewAccountModalState(id);
                updateOpenAddNewAccountModal(true);
              }}
            >
              Add New Account
            </Button>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default SavingProviderTable;
