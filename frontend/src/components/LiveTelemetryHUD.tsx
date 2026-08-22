import React from 'react';
import { Wifi, Battery, Compass, Gauge, Radio, MapPin } from 'lucide-react';

export const LiveTelemetryHUD: React.FC = () => {
  return (
    <div className="app-card p-4 relative overflow-hidden font-sans border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Unit Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 text-[var(--brand-primary)] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-[var(--text-primary)] font-mono tracking-wide">
                Raisoni-Drone_P7
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)] font-semibold">
                PATROLLING SECTOR A ➔ B
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span>Nagar Road Highway Corridor (Point A ➔ Point B)</span>
            </p>
          </div>
        </div>

        {/* Telemetry Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto font-mono text-xs">
          {/* Battery */}
          <div className="bg-[var(--bg-elevated)] p-2.5 rounded-xl border border-[var(--border-subtle)] flex items-center space-x-2.5">
            <Battery className="w-4 h-4 text-[var(--status-success)] shrink-0" />
            <div>
              <div className="text-[10px] text-[var(--text-muted)] uppercase">Battery</div>
              <div className="font-bold text-[var(--text-primary)]">88% (42m left)</div>
            </div>
          </div>

          {/* Speed & Altitude */}
          <div className="bg-[var(--bg-elevated)] p-2.5 rounded-xl border border-[var(--border-subtle)] flex items-center space-x-2.5">
            <Gauge className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
            <div>
              <div className="text-[10px] text-[var(--text-muted)] uppercase">Speed / Alt</div>
              <div className="font-bold text-[var(--text-primary)]">7 km/h • 48.5m</div>
            </div>
          </div>

          {/* Heading */}
          <div className="bg-[var(--bg-elevated)] p-2.5 rounded-xl border border-[var(--border-subtle)] flex items-center space-x-2.5">
            <Compass className="w-4 h-4 text-[var(--status-warning)] shrink-0" />
            <div>
              <div className="text-[10px] text-[var(--text-muted)] uppercase">GPS / Heading</div>
              <div className="font-bold text-[var(--text-primary)]">18.5575°N, 042°NE</div>
            </div>
          </div>

          {/* Signal Link */}
          <div className="bg-[var(--bg-elevated)] p-2.5 rounded-xl border border-[var(--border-subtle)] flex items-center space-x-2.5">
            <Wifi className="w-4 h-4 text-[var(--status-success)] shrink-0" />
            <div>
              <div className="text-[10px] text-[var(--text-muted)] uppercase">RF Link</div>
              <div className="font-bold text-[var(--text-primary)]">99.4% (-42 dBm)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
