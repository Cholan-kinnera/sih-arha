import React from 'react';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Card } from '../../../components/ui/Card';

export const OverviewSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-48" />
      </div>

      {/* KPI Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-5 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-36" />
          </Card>
        ))}
      </div>

      {/* Primary Workspace Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Skeleton className="w-full h-[460px] lg:h-[520px] rounded-[8px]" />
        </div>
        <div className="lg:col-span-4">
          <Card className="p-4 h-[460px] lg:h-[520px] space-y-4">
            <Skeleton className="h-5 w-36" />
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-[6px]" />
            ))}
          </Card>
        </div>
      </div>

      {/* Secondary Workspace Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <Card className="p-5 h-80 space-y-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-56 w-full" />
          </Card>
        </div>
        <div className="lg:col-span-6">
          <Card className="p-5 h-80 space-y-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-56 w-full" />
          </Card>
        </div>
      </div>

      {/* Status Bar Skeleton */}
      <Skeleton className="h-12 w-full rounded-[8px]" />
    </div>
  );
};
