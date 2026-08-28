import React from 'react';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Card } from '../../../components/ui/Card';

export const OverviewSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 pb-4">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-3 w-80" />
        </div>
        <Skeleton className="h-8 w-44" />
      </div>

      {/* KPI Row Skeleton (Unified Strip) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-[8px] p-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Primary Workspace Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <Skeleton className="w-full h-[380px] lg:h-[420px] rounded-[8px]" />
        </div>
        <div className="lg:col-span-4">
          <Card className="p-3.5 h-[380px] lg:h-[420px] space-y-3">
            <Skeleton className="h-4 w-32" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-[6px]" />
            ))}
          </Card>
        </div>
      </div>

      {/* Secondary Workspace Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-6">
          <Card className="p-4 h-[270px] lg:h-[290px] space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-48 w-full" />
          </Card>
        </div>
        <div className="lg:col-span-6">
          <Card className="p-4 h-[270px] lg:h-[290px] space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-48 w-full" />
          </Card>
        </div>
      </div>

      {/* Status Bar Skeleton */}
      <Skeleton className="h-16 w-full rounded-[8px]" />
    </div>
  );
};
