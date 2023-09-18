import clsx from 'clsx';
import React from 'react';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx('flex flex-col space-y-1.5 p-6', className)} {...props} />
));

CardHeader.displayName = 'CardHeader';

export default CardHeader;
