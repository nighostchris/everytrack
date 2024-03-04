import clsx from 'clsx';
import React from 'react';

export const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={clsx('ml-auto text-xs tracking-widest', className)} {...props} />;
};

CommandShortcut.displayName = 'CommandShortcut';

export default CommandShortcut;
