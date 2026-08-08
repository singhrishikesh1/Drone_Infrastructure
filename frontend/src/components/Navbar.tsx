import React, { useState, useEffect } from 'react';
import { Plane, Cpu, Database, Wrench, CheckCircle2, FileText, Map, Bell, Clock } from 'lucide-react';

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
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#06090F]/95 backdrop-blur-md border-b border-white/[0.06] px-4 md:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
      {/* Brand & Logo - Restored to Drone Infrastructure */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-[#0A0F17] border border-cyan-500/30 p-0.5 flex items-center justify-center">
          <Plane className="w-4 h-4 text-cyan-400 transform -rotate-45" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-['Manrope'] font-bold text-base text-slate-100 tracking-tight flex items-center gap-2">
              Drone <span className="text-cyan-400 font-extrabold">Infrastructure</span>
              <span className="text-[9px] px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded font-mono font-medium">
                PUNE CLUSTER v2.0
              </span>
            </h1>
          </div>
          <div className="flex items-center space-x-2.5 text-[10px] text-slate-400 font-mono mt-0.5">
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> SYSTEM ONLINE
            </span>
            <span>•</span>
            <span className="text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-cyan-400" /> {timeString || '16:13:53 IST'}
            </span>
          </div>
        </div>
      </div>

      {/* Minimal Segmented Navigation Tabs */}
      <div className="flex items-center space-x-1 bg-[#0A0F17] p-1 rounded-lg border border-white/[0.06] text-xs overflow-x-auto w-full md:w-auto font-sans">
        {[
          { id: 'map', label: 'GIS Map & Radar', icon: Map },
          { id: 'redis', label: 'Redis Telemetry', icon: Database },
          { id: 'servicing', label: 'Fleet Hangar', icon: Wrench },
          { id: 'problems', label: 'Defect Log', icon: CheckCircle2 },
          { id: 'reports', label: 'Audit Reports', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-all text-xs whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        {criticalCount > 0 && (
          <div className="hidden sm:flex items-center space-x-1.5 bg-red-950/60 text-red-400 border border-red-800/40 px-2.5 py-1 rounded-md text-xs font-mono font-medium animate-pulse">
            <Bell className="w-3.5 h-3.5 text-red-400" />
            <span>{criticalCount} CRITICAL</span>
          </div>
        )}

        <button
          onClick={onOpenScanModal}
          className="flex items-center space-x-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-md transition-all shadow-sm"
        >
          <Cpu className="w-3.5 h-3.5 text-slate-950" />
          <span>NEW DRONE SCAN</span>
        </button>
      </div>
    </header>
  );
};


