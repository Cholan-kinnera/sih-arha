/**
 * UI and component types for LEWS application shell
 */

import type { LucideIcon } from 'lucide-react';
import type { SeverityLevel } from './domain.types';

export interface NavigationItemType {
  label: string;
  href: string;
  icon: LucideIcon;
  badgeCount?: number;
  badgeVariant?: 'critical' | 'info';
}

export interface NavigationGroupType {
  title: string;
  items: NavigationItemType[];
}

export interface SeverityVisualConfig {
  label: SeverityLevel;
  colorHex: string;
  bgToken: string;
  borderToken: string;
  textToken: string;
  iconName: string;
  minScore: number;
  maxScore: number;
}
