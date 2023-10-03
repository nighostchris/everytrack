import clsx from 'clsx';
import React from 'react';
import { IconBase } from 'react-icons';

export interface Feed {
  content: React.ReactNode;
  date: string;
  icon?: {
    svg: typeof IconBase;
    background: string;
    className?: string;
  };
}

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  feeds: Feed[];
}

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(({ className, feeds, ...props }, ref) => {
  return (
    <div className={className} {...props}>
      <ul role="list" className="-mb-8">
        {feeds.map(({ date, content, icon }, feedIndex) => (
          <li key={`timeline-feed-${feedIndex}`} className="relative pb-8">
            {feedIndex !== feeds.length - 1 ? (
              <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
            ) : null}
            <div className="relative flex space-x-3">
              {icon && (
                <span className={clsx(icon.background, 'flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-gray-50')}>
                  <icon.svg className={clsx('h-5 w-5', { 'text-white': !icon.className }, icon.className)} aria-hidden="true" />
                </span>
              )}
              <div className="flex min-w-0 flex-1 justify-between pt-1.5">
                {content}
                <time dateTime={date} className="whitespace-nowrap text-right text-sm text-gray-500">
                  {date}
                </time>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

Timeline.displayName = 'Timeline';

export default Timeline;
