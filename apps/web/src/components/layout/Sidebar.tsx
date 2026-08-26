import React from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Mountain } from 'lucide-react';
import { NAVIGATION_GROUPS, APP_METADATA } from '../../config/constants';
import { useUiStore } from '../../stores/useUiStore';
import { useRealtimeStore } from '../../stores/useRealtimeStore';
import { NavigationGroup } from './NavigationGroup';
import { IconButton } from '../ui/IconButton';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();
  const { activeCriticalAlertCount } = useRealtimeStore();

  // Inject dynamic badge count for alerts
  const enrichedGroups = NAVIGATION_GROUPS.map((group) => {
    if (group.title === 'MONITOR') {
      return {
        ...group,
        items: group.items.map((item) => {
          if (item.href === '/alerts') {
            return { ...item, badgeCount: activeCriticalAlertCount };
          }
          return item;
        }),
      };
    }
    return group;
  });

  return (
    <aside
      className={cn(
        'h-[calc(100vh-56px)] bg-white border-r border-slate-200 flex flex-col transition-all duration-200 shrink-0 sticky top-14 z-30 select-none shadow-xs',
        sidebarCollapsed ? 'w-16 min-w-16 max-w-16' : 'w-60 min-w-60 max-w-60'
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          'h-14 border-b border-slate-200 flex items-center shrink-0',
          sidebarCollapsed ? 'justify-center px-0' : 'px-4 gap-3'
        )}
      >
        <div className="w-8 h-8 rounded-[6px] bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
          <Mountain className="w-4 h-4 shrink-0" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden min-w-0">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight truncate">
              {APP_METADATA.NAME}
            </h1>
            <p className="text-[11px] text-slate-500 truncate">Early Warning System</p>
          </div>
        )}
      </div>

      {/* Navigation Groups List */}
      <div
        className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden space-y-1',
          sidebarCollapsed ? 'p-1.5' : 'p-3'
        )}
      >
        {enrichedGroups.map((group) => (
          <NavigationGroup
            key={group.title}
            group={group}
            collapsed={sidebarCollapsed}
            activePath={location.pathname}
          />
        ))}
      </div>

      {/* Bottom Collapse Toggle */}
      <div
        className={cn(
          'h-12 border-t border-slate-200 flex items-center shrink-0',
          sidebarCollapsed ? 'justify-center px-0' : 'px-3 justify-between'
        )}
      >
        {!sidebarCollapsed && (
          <span className="text-[10px] font-mono-data text-slate-400">v{APP_METADATA.VERSION}</span>
        )}
        <IconButton
          aria-label={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          onClick={toggleSidebar}
          size="sm"
          className="text-slate-400 hover:text-slate-700"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </IconButton>
      </div>
    </aside>
  );
};
