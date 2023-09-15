import clsx from 'clsx';
import React from 'react';

export const BaseTable = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={clsx('w-full caption-bottom text-sm', className)} {...props} />
  </div>
));

BaseTable.displayName = 'BaseTable';

export default BaseTable;
