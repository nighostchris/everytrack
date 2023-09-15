import clsx from 'clsx';
import React from 'react';

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={clsx('[&_tr:last-child]:border-0', className)} {...props} />,
);

TableBody.displayName = 'TableBody';

export default TableBody;
