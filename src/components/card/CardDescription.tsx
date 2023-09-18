import clsx from 'clsx';
import React from 'react';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={clsx('text-sm text-gray-800', className)} {...props} />,
);

CardDescription.displayName = 'CardDescription';

export default CardDescription;
