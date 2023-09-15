import clsx from 'clsx';
import React from 'react';

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr ref={ref} className={clsx('border-b transition-colors hover:bg-gray-200 data-[state=selected]:bg-gray-200', className)} {...props} />
));

TableRow.displayName = 'TableRow';

export default TableRow;
