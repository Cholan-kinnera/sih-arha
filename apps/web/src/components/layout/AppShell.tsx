import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col font-sans">
      {/* Top Fixed Operational Header */}
      <TopHeader />

      {/* Main Layout Container (Sidebar + Content Workspace) */}
      <div className="flex-1 flex w-full">
        <Sidebar />

        {/* Dynamic Route Workspace */}
        <main className="flex-1 min-w-0 bg-[#f8fafc] overflow-y-auto">
          <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
