import clsx from 'clsx';
import React from 'react';

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h3 ref={ref} className={clsx('font-semibold leading-none tracking-tight', className)} {...props} />,
);

CardTitle.displayName = 'CardTitle';

export default CardTitle;
