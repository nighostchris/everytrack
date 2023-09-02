import React from 'react';

import MobileSideBar from './MobileSideBar';
import DesktopSideBar from './DesktopSideBar';

const SideBar: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(true);

  return (
    <>
      <MobileSideBar open={open} setOpen={setOpen} />
      <DesktopSideBar />
    </>
  );
};

export default SideBar;
