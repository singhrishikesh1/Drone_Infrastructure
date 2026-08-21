import React, { useState, useEffect } from 'react';
import { Plane, Cpu, Activity, FileText, CheckCircle2, Navigation, Clock, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  activeTab: 'telemetry' | 'drone' | 'defects' | 'reports';
  setActiveTab: (tab: 'telemetry' | 'drone' | 'defects' | 'reports') => void;
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
    <header className="sticky top-0 z-40 bg-[#FDF2F8] border-b border-[#FBCFE8] px-4 md:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
      {/* Brand & Logo - DRONACHARYA */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] border border-[#F472B6] p-0.5 flex items-center justify-center shadow-xs">
          <Plane className="w-4 h-4 text-[#E11D48] transform -rotate-45" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-['Inter'] font-extrabold text-base text-[#831843] tracking-wider flex items-center gap-1.5">
              DRONACHARYA
              <span className="text-sm">🧸</span>
              <span className="text-[9px] px-2 py-0.5 bg-[#FFF1F2] text-[#E11D48] border border-[#F43F5E]/30 rounded font-mono font-bold">
                ROAD DETECTION AI
              </span>
            </h1>
          </div>
          <div className="flex items-center space-x-2.5 text-[10px] text-[#9D174D] font-mono mt-0.5">
            <span className="text-[#16A34A] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" /> SYSTEM ONLINE 💕
            </span>
            <span>•</span>
            <span className="text-[#9D174D] flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-[#E11D48]" /> {timeString || '16:32:00 IST'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1 bg-[#FFFFFF] p-1 rounded-xl border border-[#FBCFE8] text-xs overflow-x-auto w-full md:w-auto font-sans shadow-xs">
        {[
          { id: 'telemetry', label: 'LIVE TELEMETRY', icon: Navigation },
          { id: 'drone', label: 'DRONE', icon: Plane },
          { id: 'defects', label: 'DEFECTS', icon: CheckCircle2 },
          { id: 'reports', label: 'REPORTS', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-extrabold transition-all text-xs whitespace-nowrap ${
                isActive
                  ? 'bg-[#E11D48] text-white shadow-sm'
                  : 'text-[#9D174D] hover:text-[#831843] hover:bg-[#FCE7F3]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#E11D48]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        {criticalCount > 0 && (
          <div className="hidden sm:flex items-center space-x-1.5 bg-[#FFF1F2] text-[#E11D48] border border-[#F43F5E]/30 px-2.5 py-1 rounded-lg text-xs font-mono font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-[#E11D48]" />
            <span>{criticalCount} CRITICAL DEFECTS</span>
          </div>
        )}

        <button
          onClick={onOpenScanModal}
          className="flex items-center space-x-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold text-xs px-4 py-1.5 rounded-lg transition-all shadow-md active:scale-95"
        >
          <Cpu className="w-3.5 h-3.5 text-white" />
          <span>NEW DRONE SCAN</span>
        </button>
      </div>
    </header>
  );
};



