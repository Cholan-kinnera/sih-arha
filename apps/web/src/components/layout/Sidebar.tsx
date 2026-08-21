import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, FileText, CheckCircle2, CheckSquare, Sparkles, X } from 'lucide-react';
import { useUiStore } from '../../stores/useUiStore';
import { clsx } from 'clsx';

export const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Discover Schemes', path: '/discover', icon: Compass },
    { label: 'Documents', path: '/documents', icon: FileText },
    { label: 'Verification', path: '/verification', icon: CheckCircle2 },
    { label: 'Application Readiness', path: '/readiness', icon: CheckSquare },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={clsx(
          'fixed md:sticky top-0 md:top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-64 bg-zinc-950 border-r border-zinc-800/80 p-4 transition-transform duration-200 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between md:hidden mb-4 pb-2 border-b border-zinc-800">
          <span className="font-semibold text-sm text-zinc-300">Navigation</span>
          <button onClick={() => setSidebarOpen(false)} className="text-zinc-400 hover:text-zinc-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }: { isActive: boolean }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                  )
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="mt-8 pt-4 border-t border-zinc-800/80">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-400 font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIH 2026 Prototype</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Demonstrating deterministic rule evaluation & grounded AI explanation.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
