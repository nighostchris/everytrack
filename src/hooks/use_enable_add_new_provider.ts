import { Account, Provider } from '@api/everytrack_backend';

export const useEnableAddNewProvider = (providers: Provider[], accounts: Account[]) => {
  if (providers.length === 0) return false;
  if (accounts.length === 0) return true;
  const existingProviderMap = accounts.reduce((acc, { assetProviderId }) => acc.set(assetProviderId, true), new Map<string, boolean>());
  return Array.from(existingProviderMap.keys()).length < providers.length;
};
