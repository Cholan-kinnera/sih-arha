import {
  LayoutDashboard,
  Map,
  Layers,
  BellRing,
  LineChart,
  Cpu,
  Database,
  Activity,
} from 'lucide-react';
import type { NavigationGroupType } from '../types/ui.types';

export const APP_METADATA = {
  NAME: 'LEWS',
  FULL_NAME: 'Landslide Early Warning & Risk Monitoring',
  TAGLINE: 'AI-Based Early Warning & Risk Monitoring for Landslide-Prone Areas',
  DEFAULT_REGION: 'Wayanad Basin — Western Ghats Sector',
  VERSION: '0.1.0-alpha',
} as const;

export const NAVIGATION_GROUPS: NavigationGroupType[] = [
  {
    title: 'MONITOR',
    items: [
      { label: 'Overview', href: '/overview', icon: LayoutDashboard },
      { label: 'Risk Map', href: '/map', icon: Map },
      { label: 'Zones', href: '/zones', icon: Layers },
      { label: 'Alerts', href: '/alerts', icon: BellRing },
    ],
  },
  {
    title: 'ANALYZE',
    items: [
      { label: 'Analytics', href: '/analytics', icon: LineChart },
      { label: 'Model Intelligence', href: '/model-intelligence', icon: Cpu },
      { label: 'Data Sources', href: '/data-sources', icon: Database },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'System Health', href: '/data-sources', icon: Activity },
    ],
  },
];
