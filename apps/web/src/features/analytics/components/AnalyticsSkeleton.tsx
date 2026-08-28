import React from 'react';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Card } from '../../../components/ui/Card';

export const AnalyticsSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 pb-4 select-none">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-3 w-96" />
        </div>
        <Skeleton className="h-8 w-44" />
      </div>

      {/* Summary Metrics Strip Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-slate-200 rounded-[8px] p-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2.5 px-2">
            <Skeleton className="w-8 h-8 rounded-[6px]" />
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <Card className="p-2.5 h-12 flex items-center justify-between">
        <div className="flex items-center gap-3 w-full max-w-md">
          <Skeleton className="h-7 w-48 rounded-[6px]" />
          <Skeleton className="h-7 w-36 rounded-[6px]" />
        </div>
        <Skeleton className="h-7 w-40 rounded-[6px]" />
      </Card>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4 space-y-3">
            <div className="space-y-1">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-3 w-80" />
            </div>
            <Skeleton className="h-64 w-full rounded-[6px]" />
            <Skeleton className="h-10 w-full rounded-[4px]" />
          </Card>
        ))}
      </div>

      {/* Full-width 5th Chart Skeleton */}
      <Card className="p-4 space-y-3">
        <div className="space-y-1">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-3 w-80" />
        </div>
        <Skeleton className="h-64 w-full rounded-[6px]" />
      </Card>
    </div>
  );
};
