import React from 'react';
import { Plane, AlertTriangle, ShieldAlert, Cpu, FileText, Bell } from 'lucide-react';

interface NavbarProps {
  onOpenScanModal: () => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  criticalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenScanModal, activeFilter, setActiveFilter, criticalCount }) => {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shadow-2xl">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Plane className="w-5 h-5 text-cyan-400 transform -rotate-45" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-['Outfit'] font-extrabold text-xl text-white tracking-tight">
              AERO<span className="text-cyan-400">INSPECT</span> <span className="text-xs px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800/60 rounded-full">AI 3D v2.4</span>
            </h1>
          </div>
          <p className="text-[11px] text-slate-400">Autonomous Infrastructure Volumetric Defect & Repair Cost Engine</p>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
        {['all', 'road', 'bridge', 'railway', 'building'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              activeFilter === filter
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {filter === 'all' ? 'All Assets' : filter}
          </button>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex items-center space-x-3">
        {criticalCount > 0 && (
          <div className="flex items-center space-x-2 bg-red-950/60 text-red-400 border border-red-800/60 px-3 py-1.5 rounded-lg text-xs font-medium animate-pulse">
            <Bell className="w-4 h-4 text-red-400" />
            <span>{criticalCount} Critical Alerts</span>
          </div>
        )}

        <button
          onClick={onOpenScanModal}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Cpu className="w-4 h-4" />
          <span>Launch AirSim Scan</span>
        </button>
      </div>
    </header>
  );
};
