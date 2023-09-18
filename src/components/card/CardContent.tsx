import clsx from 'clsx';
import React from 'react';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx('p-6 pt-0', className)} {...props} />
));

CardContent.displayName = 'CardContent';

export default CardContent;
