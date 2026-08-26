import React from 'react';
import type { NavigationGroupType } from '../../types/ui.types';
import { NavigationItem } from './NavigationItem';

export interface NavigationGroupProps {
  group: NavigationGroupType;
  collapsed: boolean;
  activePath: string;
}

export const NavigationGroup: React.FC<NavigationGroupProps> = ({
  group,
  collapsed,
  activePath,
}) => {
  return (
    <div className="mb-3">
      {collapsed ? (
        <div className="my-2 mx-2 h-[1px] bg-slate-100" />
      ) : (
        <div className="px-3 mb-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase select-none">
          {group.title}
        </div>
      )}
      <div className="space-y-0.5">
        {group.items.map((item) => (
          <NavigationItem
            key={item.href}
            item={item}
            collapsed={collapsed}
            isActive={activePath === item.href}
          />
        ))}
      </div>
    </div>
  );
};
