/* eslint-disable max-len */
import React from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';

interface OpenSideBarButtonProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const OpenSideBarButton: React.FC<OpenSideBarButtonProps> = ({ open, setOpen }) => {
  return (
    <div className="absolute top-0 z-10 w-full bg-gray-100 px-2 py-1 md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        <RxHamburgerMenu className="h-6 w-6" />
      </button>
    </div>
  );
};

export default OpenSideBarButton;
