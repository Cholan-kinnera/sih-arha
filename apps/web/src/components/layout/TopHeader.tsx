import React from 'react';
import { BellRing, MapPin } from 'lucide-react';
import { useRealtimeStore } from '../../stores/useRealtimeStore';
import { useUiStore } from '../../stores/useUiStore';
import { RealtimeStatus } from './RealtimeStatus';
import { SimulationModeBadge } from './SimulationModeBadge';
import { DataFreshness } from './DataFreshness';
import { IconButton } from '../ui/IconButton';
import { Divider } from '../ui/Divider';

export const TopHeader: React.FC = () => {
  const { connectionState, simulationMode, lastTelemetryTimestamp, activeCriticalAlertCount } =
    useRealtimeStore();
  const { activeRegion, toggleAlertDrawer } = useUiStore();

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-40 select-none shadow-sm">
      {/* Left Area: Active Monitoring Region */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium bg-slate-100 px-2.5 py-1 rounded-[6px] border border-slate-200">
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate max-w-[200px] sm:max-w-none">{activeRegion}</span>
        </div>
      </div>

      {/* Center Area: Realtime & Simulator Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        <RealtimeStatus state={connectionState} />
        {simulationMode && <SimulationModeBadge />}
      </div>

      {/* Right Area: Freshness & Alert Trigger Button */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center">
          <DataFreshness lastUpdated={lastTelemetryTimestamp} />
        </div>

        <Divider orientation="vertical" className="hidden md:block h-5 bg-slate-200" />

        <div className="relative">
          <IconButton
            aria-label="Toggle Alert Feed"
            onClick={toggleAlertDrawer}
            variant="ghost"
            size="sm"
            className="relative text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            <BellRing className="w-4 h-4" />
            {activeCriticalAlertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                {activeCriticalAlertCount}
              </span>
            )}
          </IconButton>
        </div>
      </div>
    </header>
  );
};
