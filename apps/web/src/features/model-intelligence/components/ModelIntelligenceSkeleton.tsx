import React from 'react';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Card } from '../../../components/ui/Card';

export const ModelIntelligenceSkeleton: React.FC = () => {
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

      {/* Overview Metrics Strip Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-slate-200 rounded-[8px] p-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2.5 px-2">
            <Skeleton className="w-8 h-8 rounded-[6px]" />
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Formula Card Skeleton */}
      <Card className="p-4 space-y-3">
        <div className="space-y-1">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-3 w-96" />
        </div>
        <Skeleton className="h-20 w-full rounded-[6px]" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-[6px]" />
          ))}
        </div>
      </Card>

      {/* Feature Weights Skeleton */}
      <Card className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-3 w-80" />
          </div>
          <Skeleton className="h-6 w-28 rounded-[6px]" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-40 w-full rounded-[6px]" />
      </Card>

      {/* Severity & Comparison Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 space-y-3">
          <Skeleton className="h-4 w-48" />
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-[6px]" />
            ))}
          </div>
        </Card>
        <Card className="p-4 space-y-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-44 w-full rounded-[6px]" />
        </Card>
      </div>

      {/* Limitations Skeleton */}
      <Card className="p-4 space-y-3">
        <Skeleton className="h-4 w-56" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-18 w-full rounded-[6px]" />
          ))}
        </div>
      </Card>
    </div>
  );
};
