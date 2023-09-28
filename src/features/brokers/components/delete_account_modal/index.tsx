import React from 'react';
import { toast } from 'react-toastify';

import { store } from '../../zustand';
import { Button, Dialog } from '@components';
import { store as globalStore } from '@lib/zustand';
import { deleteAccount, getAllAccounts, getAllStockHoldings } from '@api/everytrack_backend';

export const DeleteAccountModal: React.FC = () => {
  const {
    accountId,
    brokerDetails,
    resetDeleteAccountModalState,
    openDeleteAccountModal: open,
    updateOpenDeleteAccountModal: setOpen,
  } = store();
  const { brokerAccounts, updateBrokerAccounts, updateAccountStockHoldings } = globalStore();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const accountDisplayName = React.useMemo(() => {
    let foundName: string | undefined;
    if (accountId && brokerDetails && brokerAccounts) {
      const { name: accountName, assetProviderId } = brokerAccounts.filter(({ id }) => id === accountId)[0];
      const { name: brokerName } = brokerDetails.filter(({ id }) => id === assetProviderId)[0];
      foundName = `${brokerName} - ${accountName}`;
    }
    return foundName;
  }, [accountId, brokerDetails, brokerAccounts]);

  const handleOnClickDeleteAccountButton = React.useCallback(async () => {
    setIsLoading(true);
    if (!accountId) {
      setIsLoading(false);
      toast.error('Unexpected error!');
    } else {
      try {
        const { success } = await deleteAccount({ accountId, providerType: 'broker' });
        if (success) {
          setOpen(false);
          resetDeleteAccountModalState();
          const { data: accounts } = await getAllAccounts('broker');
          updateBrokerAccounts(accounts);
          const { data: accountStockHoldings } = await getAllStockHoldings();
          updateAccountStockHoldings(accountStockHoldings);
        }
        setIsLoading(false);
        toast.info('Success!');
      } catch (error: any) {
        setIsLoading(false);
        toast.error(error.message);
      }
    }
  }, [accountId]);

  return (
    <Dialog open={open}>
      <div className="rounded-t-md bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Delete Account</h3>
        <p className="mt-4">{`You are going to delete the account`}</p>
        <p className="mt-2 font-bold">{accountDisplayName}</p>
        <p className="mt-2">{`Are you sure about that? 😢`}</p>
      </div>
      <div className="rounded-b-md bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={() => handleOnClickDeleteAccountButton()}
          className="w-full !bg-red-600 !text-white hover:!bg-red-700 sm:ml-2 sm:w-28"
        >
          Delete
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={() => setOpen(false)}
          className="mt-3 w-full !border-gray-300 !text-gray-700 hover:!bg-gray-200 sm:mt-0 sm:w-28"
        >
          Cancel
        </Button>
      </div>
    </Dialog>
  );
};

export default DeleteAccountModal;
