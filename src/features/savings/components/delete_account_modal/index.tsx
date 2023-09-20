import React from 'react';
import { toast } from 'react-toastify';

import { Button, Dialog } from '@components';
import { store } from '@features/savings/zustand';
import { store as globalStore } from '@lib/zustand';
import { deleteAccount, getAllAccounts } from '@api/everytrack_backend';

export const DeleteAccountModal: React.FC = () => {
  const {
    accountId,
    bankDetails,
    resetDeleteAccountModalState,
    openDeleteAccountModal: open,
    updateOpenDeleteAccountModal: setOpen,
  } = store();
  const { bankAccounts, updateBankAccounts } = globalStore();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const accountName = React.useMemo(() => {
    let foundName: string | undefined;
    if (accountId && bankDetails && bankAccounts) {
      const { accountTypeId } = bankAccounts.filter((bankAccount) => bankAccount.id === accountId)[0];
      bankDetails.forEach(({ name: bankName, accountTypes }) => {
        accountTypes.forEach(({ id, name: accountTypeName }) => {
          if (id === accountTypeId) {
            foundName = `${bankName} - ${accountTypeName}`;
          }
        });
      });
    }
    return foundName;
  }, [accountId, bankDetails, bankAccounts]);

  const handleOnClickDeleteAccountButton = React.useCallback(async () => {
    setIsLoading(true);
    if (!accountId) {
      setIsLoading(false);
      toast.error('Unexpected error!');
    } else {
      try {
        const { success } = await deleteAccount({ accountId, providerType: 'savings' });
        if (success) {
          setOpen(false);
          resetDeleteAccountModalState();
          const { data } = await getAllAccounts('savings');
          updateBankAccounts(data);
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
      <div className=" bg-white p-6 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Delete Account</h3>
        <p className="mt-4">{`Are you sure to delete the account`}</p>
        <p className="mt-2">{accountName}</p>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={() => handleOnClickDeleteAccountButton()}
          className="w-full bg-red-200 text-red-800 hover:bg-red-300 hover:text-red-900 sm:ml-2 sm:w-28"
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
