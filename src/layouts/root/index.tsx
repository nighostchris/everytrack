/* eslint-disable max-len */
import React from 'react';

import SideBar from '@layouts/side_bar';
import OpenSideBarButton from './OpenSideBarButton';

interface RootProps {
  children?: React.ReactNode;
}

const Root: React.FC<RootProps> = ({ children }) => {
  return (
    <div className="h-full w-full">
      <SideBar />
      <OpenSideBarButton />
      <div className="h-full w-full md:ml-64 md:w-[calc(100%-256px)]">{children}</div>
    </div>
  );
};

export default Root;
