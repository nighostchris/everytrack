/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { MdClose } from 'react-icons/md';
import { BsPiggyBank } from 'react-icons/bs';
import { RxDashboard } from 'react-icons/rx';
import { RiStockLine } from 'react-icons/ri';
import { FaCreditCard } from 'react-icons/fa';
import { MdSubscriptions } from 'react-icons/md';

import ProfileBar from './ProfileBar';

interface MobileSideBarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileSideBar: React.FC<MobileSideBarProps> = ({ open, setOpen }) => {
  return (
    <div className="fixed inset-0 z-40 flex md:hidden">
      <div
        className={clsx(
          { 'opacity-100': open, 'opacity-0': !open },
          'fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-linear',
        )}
      />
      <div
        className={clsx(
          { 'translate-x-0': open, '-translate-x-full': !open },
          'relative flex w-full max-w-xs flex-1 transform flex-col bg-gray-800 transition duration-300 ease-in-out',
        )}
      >
        <div className={clsx({ 'opacity-100': open, 'opacity-0': !open }, 'absolute right-0 top-0 -mr-12 pt-2 duration-300 ease-in-out')}>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setOpen(!open)}
          >
            <MdClose className="h-6 w-6 text-white" />
          </button>
        </div>
        <div className={`h-0 overflow-y-auto pb-4 pt-5 ${open ? 'flex-1' : 'hidden'}`}>
          <div className="flex flex-shrink-0 items-center px-4">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
              alt="Workflow"
            />
          </div>
          <nav className="mt-5 space-y-1 px-2">
            <a href="#" className="group flex items-center rounded-md bg-gray-900 px-2 py-2 text-base font-medium text-white">
              <RxDashboard className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
              Dashboard
            </a>
            <a
              href="#"
              className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <BsPiggyBank className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
              Savings
            </a>
            <a
              href="#"
              className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <FaCreditCard className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
              Credit
            </a>
            <a
              href="#"
              className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <RiStockLine className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
              Brokers
            </a>
            <a
              href="#"
              className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <MdSubscriptions className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
              Subscriptions
            </a>
          </nav>
        </div>
        <ProfileBar />
      </div>
      <div className="w-14 flex-shrink-0" />
    </div>
  );
};

export default MobileSideBar;
