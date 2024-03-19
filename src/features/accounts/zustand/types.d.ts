/* eslint-disable no-unused-vars */
import { ClientSettings } from '@api/everytrack_backend';

export type ModalStateSlice = {
  openTransferBetweenAccountModal: boolean;
  updateOpenTransferBetweenAccountModal: (newModalState: boolean) => void;
};

export type AccountsState = ModalStateSlice;
