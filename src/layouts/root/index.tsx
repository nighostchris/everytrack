/* eslint-disable max-len */
import clsx from 'clsx';
import React from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';

import SideBar from '@layouts/side_bar';

interface RootProps {
  children?: React.ReactNode;
}

export const Root: React.FC<RootProps> = ({ children }) => {
  const [openSideBar, setOpenSideBar] = React.useState<boolean>(false);

  return (
    <div className="h-full w-full">
      <SideBar open={openSideBar} setOpen={setOpenSideBar} />
      <div className={clsx('absolute top-0 w-full bg-white px-2 py-1 shadow-sm md:hidden', { 'z-20': !openSideBar })}>
        <button
          type="button"
          onClick={() => setOpenSideBar(!openSideBar)}
          className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <RxHamburgerMenu className="h-6 w-6" />
        </button>
      </div>
      <div className="h-full w-full overflow-y-auto pt-[54px] md:ml-20 md:w-[calc(100%-80px)] md:pt-0">{children}</div>
    </div>
  );
};

export default Root;
