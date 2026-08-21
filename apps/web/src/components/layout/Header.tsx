import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, User, Bell } from 'lucide-react';
import { useUiStore } from '../../stores/useUiStore';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { toggleSidebar } = useUiStore();

  return (
    <header className="sticky top-0 z-30 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-800"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/30 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-zinc-100 tracking-tight text-base">CBIP</span>
              <span className="hidden sm:inline-block ml-2 text-xs text-zinc-400 font-mono-code">v0.1.0</span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <Link to="/discover" className="hover:text-zinc-100 transition-colors">
            Discover
          </Link>
          <Link to="/dashboard" className="hover:text-zinc-100 transition-colors">
            Dashboard
          </Link>
          <Link to="/documents" className="hover:text-zinc-100 transition-colors">
            Documents
          </Link>
          <Link to="/verification" className="hover:text-zinc-100 transition-colors">
            Verification
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button className="text-zinc-400 hover:text-zinc-100 p-2 rounded-lg hover:bg-zinc-800/60 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5" />
          </button>

          <Link to="/onboarding">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <User className="w-3.5 h-3.5" />
              <span>Demo Profile</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
