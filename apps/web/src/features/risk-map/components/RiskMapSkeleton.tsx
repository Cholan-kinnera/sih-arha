import React from 'react';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Card } from '../../../components/ui/Card';

export const RiskMapSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 pb-4 select-none">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-3 w-96" />
        </div>
        <Skeleton className="h-8 w-48" />
      </div>

      {/* Toolbar Skeleton */}
      <Card className="p-2.5 h-12 flex items-center justify-between">
        <div className="flex items-center gap-3 w-full max-w-md">
          <Skeleton className="h-7 w-48 rounded-[6px]" />
          <Skeleton className="h-7 w-32 rounded-[6px]" />
        </div>
        <Skeleton className="h-7 w-40 rounded-[6px]" />
      </Card>

      {/* Map Workspace Canvas Skeleton */}
      <Skeleton className="w-full h-[620px] lg:h-[680px] rounded-[8px]" />
    </div>
  );
};
