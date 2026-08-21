import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AssistantDock } from './AssistantDock';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-blue-600/30">
      <Header />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 pb-28 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <AssistantDock />
    </div>
  );
};
