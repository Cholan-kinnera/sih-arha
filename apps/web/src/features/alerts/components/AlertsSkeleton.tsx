import React from 'react';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Card } from '../../../components/ui/Card';

export const AlertsSkeleton: React.FC = () => {
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

      {/* Summary Strip Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white border border-slate-200 rounded-[8px] p-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2.5 px-2">
            <Skeleton className="w-8 h-8 rounded-[6px]" />
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-5 w-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <Card className="p-2.5 h-12 flex items-center justify-between">
        <div className="flex items-center gap-3 w-full max-w-md">
          <Skeleton className="h-7 w-48 rounded-[6px]" />
          <Skeleton className="h-7 w-32 rounded-[6px]" />
          <Skeleton className="h-7 w-32 rounded-[6px]" />
        </div>
        <Skeleton className="h-7 w-36 rounded-[6px]" />
      </Card>

      {/* Queue Table Skeleton */}
      <Card className="p-0 overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="divide-y divide-slate-100 p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-[4px]" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
