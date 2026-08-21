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
    <header className="sticky top-0 z-40 bg-[#08111A] border-b border-[#152535] px-4 md:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
      {/* Brand & Logo - DRONACHARYA */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-[#101C28] border border-[#16B9E8]/30 p-0.5 flex items-center justify-center">
          <Plane className="w-4 h-4 text-[#16B9E8] transform -rotate-45" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-['Inter'] font-extrabold text-base text-[#F1F5F9] tracking-wider flex items-center gap-2">
              DRONACHARYA
              <span className="text-[9px] px-2 py-0.5 bg-[#16B9E8]/10 text-[#16B9E8] border border-[#16B9E8]/20 rounded font-mono font-medium">
                ROAD DETECTION AI
              </span>
            </h1>
          </div>
          <div className="flex items-center space-x-2.5 text-[10px] text-[#94A3B8] font-mono mt-0.5">
            <span className="text-[#22C55E] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" /> SYSTEM ONLINE
            </span>
            <span>•</span>
            <span className="text-[#94A3B8] flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-[#16B9E8]" /> {timeString || '16:13:53 IST'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Image 1 Specs) */}
      <div className="flex items-center space-x-1 bg-[#101C28] p-1 rounded-lg border border-[#152535] text-xs overflow-x-auto w-full md:w-auto font-sans">
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
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md font-bold transition-all text-xs whitespace-nowrap ${
                isActive
                  ? 'bg-[#16B9E8] text-[#08111A] shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#152535]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#08111A]' : 'text-[#94A3B8]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        {criticalCount > 0 && (
          <div className="hidden sm:flex items-center space-x-1.5 bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 px-2.5 py-1 rounded-md text-xs font-mono font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-[#EF4444]" />
            <span>{criticalCount} CRITICAL DEFECTS</span>
          </div>
        )}

        <button
          onClick={onOpenScanModal}
          className="flex items-center space-x-1.5 bg-[#16B9E8] hover:bg-[#38CBF3] text-[#08111A] font-extrabold text-xs px-3.5 py-1.5 rounded-md transition-all shadow-sm"
        >
          <Cpu className="w-3.5 h-3.5 text-[#08111A]" />
          <span>NEW DRONE SCAN</span>
        </button>
      </div>
    </header>
  );
};



