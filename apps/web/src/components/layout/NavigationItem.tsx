import React from 'react';
import { Link } from 'react-router-dom';
import type { NavigationItemType } from '../../types/ui.types';
import { cn } from '../../lib/utils';
import { Tooltip } from '../ui/Tooltip';

export interface NavigationItemProps {
  item: NavigationItemType;
  collapsed: boolean;
  isActive: boolean;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  collapsed,
  isActive,
}) => {
  const Icon = item.icon;

  if (collapsed) {
    return (
      <div className="flex justify-center w-full my-1">
        <Tooltip content={item.label} side="right">
          <Link
            to={item.href}
            aria-label={item.label}
            className={cn(
              'w-10 h-10 rounded-[6px] flex items-center justify-center transition-colors select-none group focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2',
              isActive
                ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            )}
          >
            <Icon
              className={cn(
                'w-4 h-4 shrink-0 transition-colors',
                isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-900'
              )}
            />
          </Link>
        </Tooltip>
      </div>
    );
  }

  return (
    <Link
      to={item.href}
      className={cn(
        'flex items-center h-10 w-full px-3 rounded-[6px] text-sm font-medium transition-colors select-none group focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2',
        isActive
          ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
        'gap-3'
      )}
    >
      <Icon
        className={cn(
          'w-4 h-4 shrink-0 transition-colors',
          isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'
        )}
      />
      <span className="truncate min-w-0 flex-1">{item.label}</span>
      {item.badgeCount !== undefined && item.badgeCount > 0 && (
        <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-50 text-red-700 border border-red-200">
          {item.badgeCount}
        </span>
      )}
    </Link>
  );
};
