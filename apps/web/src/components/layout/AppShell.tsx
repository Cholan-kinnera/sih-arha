import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { pageTransitionVariants } from '../../lib/motion';
import { useTelemetryStream } from '../../hooks/useTelemetryStream';

export const AppShell: React.FC = () => {
  const location = useLocation();

  // Mount global WebSocket telemetry stream at app root
  useTelemetryStream();

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
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageTransitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};
