import React from 'react';
import { Plane, Cpu, Database, Wrench, CheckCircle2, FileText, Map, ShieldAlert, Bell } from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'redis' | 'servicing' | 'problems' | 'reports';
  setActiveTab: (tab: 'map' | 'redis' | 'servicing' | 'problems' | 'reports') => void;
  onOpenScanModal: () => void;
  criticalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenScanModal,
  criticalCount
}) => {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800 px-6 py-3.5 flex flex-col md:flex-row items-center justify-between shadow-2xl gap-4 bg-[#090d16]/95 backdrop-blur-xl">
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
              Drone <span className="text-cyan-400">Infrastructure</span>
              <span className="text-[10px] ml-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-mono font-semibold">
                v2.0 PUNE CLUSTER
              </span>
            </h1>
          </div>
          <p className="text-[11px] text-slate-400">Autonomous AI Infrastructure Inspection & Telemetry Engine</p>
        </div>
      </div>

      {/* Main View Navigation Tabs */}
      <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs overflow-x-auto w-full md:w-auto">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeTab === 'map'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Pune Map & Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('redis')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeTab === 'redis'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Redis Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('servicing')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeTab === 'servicing'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Drone Servicing</span>
        </button>

        <button
          onClick={() => setActiveTab('problems')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeTab === 'problems'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Problems Solved</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
            activeTab === 'reports'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>PDF Reports</span>
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        {criticalCount > 0 && (
          <div className="hidden sm:flex items-center space-x-1.5 bg-red-950/60 text-red-400 border border-red-800/60 px-3 py-1.5 rounded-lg text-xs font-semibold animate-pulse">
            <Bell className="w-3.5 h-3.5" />
            <span>{criticalCount} Critical</span>
          </div>
        )}

        <button
          onClick={onOpenScanModal}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Cpu className="w-4 h-4" />
          <span>New Drone Scan</span>
        </button>
      </div>
    </header>
  );
};
