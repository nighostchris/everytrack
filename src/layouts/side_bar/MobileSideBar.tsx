/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { MdClose } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';

import ProfileBar from './ProfileBar';
import { SIDE_BAR_TABS } from './consts';

interface MobileSideBarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileSideBar: React.FC<MobileSideBarProps> = ({ open, setOpen }) => {
  const { pathname } = useLocation();

  return (
    <div
      className={clsx(
        { 'translate-x-0': open, '-translate-x-full': !open },
        'fixed inset-0 z-20 flex transform transition duration-300 ease-in-out md:hidden',
      )}
    >
      <div className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800">
        <div className={clsx({ 'opacity-100': open, 'opacity-0': !open }, 'absolute right-0 top-0 -mr-12 pt-2 duration-300 ease-in-out')}>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-800"
            onClick={() => setOpen(!open)}
          >
            <MdClose className="h-6 w-6 text-gray-800" />
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
            {SIDE_BAR_TABS.map(({ name, icon: Icon, link }) => (
              <Link
                to={link}
                onClick={() => setOpen(false)}
                key={`mobile-side-nav-tab-${name}`}
                className={clsx(
                  {
                    'bg-gray-900 text-white': pathname.includes(link),
                    'text-gray-300 hover:bg-gray-700 hover:text-white': !pathname.includes(link),
                  },
                  'group flex items-center rounded-md px-2 py-2 text-base font-medium',
                )}
              >
                <Icon className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
                {name}
              </Link>
            ))}
          </nav>
        </div>
        <ProfileBar />
      </div>
    </div>
  );
};

export default MobileSideBar;
