import clsx from 'clsx';
import React from 'react';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx('flex items-center p-6 pt-0', className)} {...props} />
));

CardFooter.displayName = 'CardFooter';

export default CardFooter;
