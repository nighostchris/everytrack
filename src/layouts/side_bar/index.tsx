import React from 'react';

import MobileSideBar from './MobileSideBar';
import DesktopSideBar from './DesktopSideBar';

interface SideBarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar: React.FC<SideBarProps> = ({ open, setOpen }) => {
  return (
    <>
      <MobileSideBar open={open} setOpen={setOpen} />
      <DesktopSideBar />
    </>
  );
};

export default SideBar;
