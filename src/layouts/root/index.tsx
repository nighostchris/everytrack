/* eslint-disable max-len */
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
      <div className="absolute top-0 z-10 w-full bg-gray-100 px-2 py-1 md:hidden">
        <button
          type="button"
          onClick={() => setOpenSideBar(!openSideBar)}
          className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <RxHamburgerMenu className="h-6 w-6" />
        </button>
      </div>
      <div className="relative h-full w-full overflow-y-auto pt-[54px] md:ml-64 md:w-[calc(100%-256px)] md:pt-0">{children}</div>
    </div>
  );
};

export default Root;
