import React, { useState, useEffect } from 'react';
import { Plane, Cpu, Navigation, FileText, CheckCircle2, Database, Clock, ShieldAlert } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export type TabType = 'telemetry' | 'drone' | 'defects' | 'reports' | 'redis';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
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
      setTimeString(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'telemetry', label: 'LIVE TELEMETRY', icon: Navigation },
    { id: 'drone', label: 'DRONE', icon: Plane },
    { id: 'defects', label: 'DEFECTS', icon: CheckCircle2 },
    { id: 'reports', label: 'REPORTS', icon: FileText },
    { id: 'redis', label: 'REDIS', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-4 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs transition-colors duration-200">
      {/* Brand & Identity */}
      <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 flex items-center justify-center shrink-0">
            <Plane className="w-5 h-5 text-[var(--brand-primary)] transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-base tracking-tight text-[var(--text-primary)] flex items-center gap-2">
                DRONACHARYA
                <span className="text-[10px] px-2 py-0.5 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 rounded-md font-mono font-semibold">
                  ROAD DETECTION AI
                </span>
              </h1>
            </div>
            <div className="flex items-center space-x-2.5 text-[11px] text-[var(--text-secondary)] font-mono mt-0.5">
              <span className="text-[var(--status-success)] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse" /> SYSTEM ONLINE
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[var(--text-muted)]" /> {timeString || '16:30:00 IST'}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Action toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation Capsule Pill Bar (Matching requested UI) */}
      <nav className="flex items-center space-x-1.5 bg-[var(--bg-surface)] p-1.5 rounded-full border border-[var(--border-strong)] text-xs overflow-x-auto max-w-full font-sans shadow-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-extrabold transition-all text-xs whitespace-nowrap tracking-wide ${
                isActive
                  ? 'bg-[var(--brand-primary)] text-white shadow-sm'
                  : 'text-[var(--text-primary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[var(--brand-primary)]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center space-x-3">
        {criticalCount > 0 && (
          <div className="flex items-center space-x-1.5 bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical-border)] px-2.5 py-1 rounded-lg text-xs font-mono font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{criticalCount} CRITICAL</span>
          </div>
        )}

        <ThemeToggle />

        <button
          onClick={onOpenScanModal}
          className="flex items-center space-x-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-xs active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        >
          <Cpu className="w-3.5 h-3.5 text-white" />
          <span>NEW DRONE SCAN</span>
        </button>
      </div>
    </header>
  );
};
