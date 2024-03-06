/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

import 'react-toastify/dist/ReactToastify.css';

import { Root } from '@layouts/root';
import {
  PaymentsTable,
  PaymentsCalendar,
  EditFuturePaymentModal,
  AddNewFuturePaymentModal,
  DeleteFuturePaymentModal,
} from '@features/payments/components';
import { store } from '@features/payments/zustand';
import { usePaymentsState } from '@features/payments/hooks/use_payments_state';

export const PaymentsPage: React.FC = () => {
  const { openAddNewFuturePaymentModal, openEditFuturePaymentModal, openDeleteFuturePaymentModal } = store(
    useShallow(({ openAddNewFuturePaymentModal, openEditFuturePaymentModal, openDeleteFuturePaymentModal }) => ({
      openEditFuturePaymentModal,
      openAddNewFuturePaymentModal,
      openDeleteFuturePaymentModal,
    })),
  );
  // const { symbol, error: displayCurrencyError } = useDisplayCurrency();
  const { error: paymentsStateError, paymentsTableRows } = usePaymentsState();

  return (
    <Root>
      <EditFuturePaymentModal />
      <AddNewFuturePaymentModal />
      <DeleteFuturePaymentModal />
      <div
        className={clsx('relative flex h-full flex-col overflow-y-auto px-8 py-6', {
          'z-0': openAddNewFuturePaymentModal || openEditFuturePaymentModal || openDeleteFuturePaymentModal,
          'z-10': !openAddNewFuturePaymentModal && !openEditFuturePaymentModal && !openDeleteFuturePaymentModal,
        })}
      >
        <h1 className="text-xl font-semibold text-gray-900">Payments</h1>
        <p className="mt-2 text-sm text-gray-700">Monitor your rolling incomes and subscriptions</p>
        {/* Constructions on going */}
        <PaymentsCalendar className="mt-8" />
        {/* Constructions on going */}
        <PaymentsTable data={paymentsTableRows} className="!mt-10" />
      </div>
      <ToastContainer />
    </Root>
  );
};

export default PaymentsPage;
