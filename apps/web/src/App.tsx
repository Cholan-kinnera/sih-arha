import React from 'react';

export function App() {
  return (
    <div className="min-h-screen bg-[#0b0f17] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl bg-[#111827] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-6">
          🚧 Project Foundation Initialized
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-4">
          AI-Based Early Warning & Risk Monitoring for Landslide-Prone Areas
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          High-resolution hazard zoning, multi-factor risk inference, and real-time early warning system for vulnerable terrains.
        </p>
        <div className="grid grid-cols-3 gap-4 text-left border-t border-white/5 pt-6 text-xs text-gray-500">
          <div>
            <span className="block font-semibold text-gray-300">Phase</span>
            <span>0 — Repository Foundation</span>
          </div>
          <div>
            <span className="block font-semibold text-gray-300">Architecture</span>
            <span>FastAPI + React + SQLite</span>
          </div>
          <div>
            <span className="block font-semibold text-gray-300">Status</span>
            <span className="text-emerald-400">Foundation Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
