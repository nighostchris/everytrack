/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

import 'react-toastify/dist/ReactToastify.css';

import { Root } from '@layouts/root';
// import { useDisplayCurrency } from '@hooks';
import { store } from '@features/payments/zustand';
import { usePaymentsState } from '@features/payments/hooks/use_payments_state';
import { PaymentsTable, AddNewFuturePaymentModal } from '@features/payments/components';

export const PaymentsPage: React.FC = () => {
  const { openAddNewFuturePaymentModal, openUpdateFuturePaymentModal, openDeleteFuturePaymentModal } = store(
    useShallow(({ openAddNewFuturePaymentModal, openUpdateFuturePaymentModal, openDeleteFuturePaymentModal }) => ({
      openAddNewFuturePaymentModal,
      openUpdateFuturePaymentModal,
      openDeleteFuturePaymentModal,
    })),
  );
  // const { symbol, error: displayCurrencyError } = useDisplayCurrency();
  const { error: paymentsStateError, paymentsTableRows } = usePaymentsState();

  return (
    <Root>
      <AddNewFuturePaymentModal />
      <div
        className={clsx('relative flex h-full flex-col overflow-y-auto px-8 py-6', {
          'z-0': openAddNewFuturePaymentModal || openUpdateFuturePaymentModal || openDeleteFuturePaymentModal,
          'z-10': !openAddNewFuturePaymentModal && !openUpdateFuturePaymentModal && !openDeleteFuturePaymentModal,
        })}
      >
        <h1 className="text-xl font-semibold text-gray-900">Payments</h1>
        <p className="mt-2 text-sm text-gray-700">Monitor your rolling incomes and subscriptions</p>
        <PaymentsTable data={paymentsTableRows} className="!mt-10" />
      </div>
      <ToastContainer />
    </Root>
  );
};

export default PaymentsPage;
