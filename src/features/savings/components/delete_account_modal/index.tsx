import React from 'react';
import { toast } from 'react-toastify';

import { Button, Dialog } from '@components';
import { store } from '@features/savings/zustand';
import { deleteAccount } from '@api/everytrack_backend';
import { useBankDetails, useBankAccounts } from '@hooks';

export const DeleteAccountModal: React.FC = () => {
  const { bankDetails } = useBankDetails();
  const { bankAccounts, refetch: refetchBankAccounts } = useBankAccounts();
  const { accountId, resetDeleteAccountModalState, openDeleteAccountModal: open, updateOpenDeleteAccountModal: setOpen } = store();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const accountDisplayName = React.useMemo(() => {
    let foundName: string | undefined;
    if (accountId && bankDetails && bankAccounts) {
      const { name: accountName, assetProviderId } = bankAccounts.filter(({ id }) => id === accountId)[0];
      const { name: bankName } = bankDetails.filter(({ id }) => id === assetProviderId)[0];
      foundName = `${bankName} - ${accountName}`;
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
          refetchBankAccounts();
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
    <Dialog open={open} className="md:max-w-sm">
      <div className="rounded-t-md bg-white px-4 pb-6 pt-5 md:px-6 md:py-6">
        <h3 className="text-lg font-medium text-gray-900">Delete Account</h3>
        <p className="mt-4">{`You are going to delete the account`}</p>
        <p className="mt-2 font-bold">{accountDisplayName}</p>
        <p className="mt-2">{`Are you sure about that? 😢`}</p>
      </div>
      <div className="flex flex-col space-y-2 rounded-b-md bg-gray-50 px-4 py-5 md:flex-row-reverse md:space-y-0 md:px-6 md:py-3">
        <Button
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={() => handleOnClickDeleteAccountButton()}
          className="w-full !bg-red-600 !text-white hover:!bg-red-700 md:ml-2 md:w-fit"
        >
          Delete
        </Button>
        <Button type="button" variant="outlined" onClick={() => setOpen(false)} className="w-full !text-gray-700 md:w-fit">
          Cancel
        </Button>
      </div>
    </Dialog>
  );
};

export default DeleteAccountModal;
