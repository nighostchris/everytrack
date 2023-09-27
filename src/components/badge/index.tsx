import React from 'react';
import { IconBase } from 'react-icons';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: typeof IconBase;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ icon: Icon, className, children, ...props }, ref) => {
  return (
    <div className={className} {...props}>
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </div>
  );
});

Badge.displayName = 'Badge';

export default Badge;
