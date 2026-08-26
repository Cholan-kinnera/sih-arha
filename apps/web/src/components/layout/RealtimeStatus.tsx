import React from 'react';
import type { ConnectionState } from '../../types/realtime.types';
import { cn } from '../../lib/utils';

export interface RealtimeStatusProps {
  state: ConnectionState;
  className?: string;
}

export const RealtimeStatus: React.FC<RealtimeStatusProps> = ({ state, className }) => {
  const config = {
    CONNECTED: {
      dotColor: 'bg-emerald-500',
      text: 'LIVE (WebSocket)',
      textClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    RECONNECTING: {
      dotColor: 'bg-amber-500 animate-ping',
      text: 'RECONNECTING...',
      textClass: 'text-amber-800 bg-amber-50 border-amber-200',
    },
    OFFLINE: {
      dotColor: 'bg-red-500',
      text: 'OFFLINE (Cached)',
      textClass: 'text-red-700 bg-red-50 border-red-200',
    },
  }[state];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border select-none',
        config.textClass,
        className
      )}
    >
      <span className={cn('w-2 h-2 rounded-full shrink-0', config.dotColor)} />
      <span className="text-[11px] font-mono-data font-medium">{config.text}</span>
    </div>
  );
};
