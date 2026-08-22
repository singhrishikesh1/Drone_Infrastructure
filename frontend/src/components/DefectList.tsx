import React, { useState } from 'react';
import { Defect } from '../types';
import { ShieldAlert, Eye, CheckCircle2, AlertCircle, Search, Filter } from 'lucide-react';

interface DefectListProps {
  defects: Defect[];
  onSelectDefect: (defect: Defect) => void;
  selectedDefect: Defect | null;
}

export const DefectList: React.FC<DefectListProps> = ({ defects, onSelectDefect, selectedDefect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');

  const filteredDefects = defects.filter((defect) => {
    const matchesSearch =
      defect.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      defect.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      defect.defectClass.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = selectedRisk === 'ALL' || defect.riskLevel === selectedRisk;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="app-card p-4 flex flex-col h-[520px] font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-[var(--border-subtle)] gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--status-critical-bg)] border border-[var(--status-critical-border)] flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-[var(--status-critical)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono">
              Live Inspection Queue
            </h3>
            <span className="text-[11px] font-mono text-[var(--text-secondary)]">
              {filteredDefects.length} of {defects.length} Infrastructure Defects
            </span>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex items-center space-x-1 font-mono text-[10px]">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((risk) => (
            <button
              key={risk}
              onClick={() => setSelectedRisk(risk)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                selectedRisk === risk
                  ? 'bg-[var(--brand-primary)] text-white'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
              }`}
            >
              {risk}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="my-3 relative">
        <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location, asset class, title..."
          className="w-full pl-9 pr-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] placeholder-[var(--text-muted)]"
        />
      </div>

      {/* Queue Cards Scroll area */}
      <div className="overflow-y-auto flex-1 space-y-3 pr-1">
        {filteredDefects.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--text-muted)] font-mono text-xs">
            <CheckCircle2 className="w-8 h-8 text-[var(--status-success)] mb-2" />
            <div>No matching defects found</div>
          </div>
        ) : (
          filteredDefects.map((defect) => {
            const isSelected = selectedDefect?.id === defect.id;
            const isCritical = defect.riskLevel === 'CRITICAL';
            const isWarning = defect.riskLevel === 'HIGH' || defect.riskLevel === 'MEDIUM';
            const isResolved = defect.status === 'RESOLVED';

            let badgeBg = 'bg-[var(--status-critical-bg)] text-[var(--status-critical)] border-[var(--status-critical-border)]';
            let severityLabel = 'CRITICAL';

            if (isResolved) {
              badgeBg = 'bg-[var(--status-success-bg)] text-[var(--status-success)] border-[var(--status-success-border)]';
              severityLabel = 'RESOLVED';
            } else if (isWarning) {
              badgeBg = 'bg-[var(--status-warning-bg)] text-[var(--status-warning)] border-[var(--status-warning-border)]';
              severityLabel = defect.riskLevel;
            }

            return (
              <div
                key={defect.id}
                onClick={() => onSelectDefect(defect)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? 'bg-[var(--brand-primary)]/10 border-[var(--brand-primary)] shadow-sm'
                    : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]'
                }`}
              >
                {/* Header title & AI Confidence */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">{defect.title}</h4>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 font-medium">
                      📍 <strong>{defect.locationName}</strong>
                    </p>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border whitespace-nowrap ${badgeBg}`}>
                    {severityLabel} • {(defect.confidence * 100).toFixed(1)}% CONF
                  </span>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)] bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-subtle)]">
                  <span>DETECTED: <strong>{defect.timestamp || 'Recent'}</strong></span>
                  <span>INSPECTOR: <strong className="text-[var(--brand-primary)]">{defect.inspector || 'SkyGuardian-X1'}</strong></span>
                </div>

                {/* Workflow Status Pipeline */}
                <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1 text-[10px] font-mono">
                  <div className="grid grid-cols-4 gap-1 text-center font-bold">
                    <div className="bg-[var(--status-success-bg)] text-[var(--status-success)] py-1 rounded-md border border-[var(--status-success-border)] flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Scan</span>
                    </div>
                    <div className="bg-[var(--status-success-bg)] text-[var(--status-success)] py-1 rounded-md border border-[var(--status-success-border)] flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Detected</span>
                    </div>
                    <div className={`py-1 rounded-md border flex items-center justify-center gap-1 ${
                      defect.status !== 'OPEN'
                        ? 'bg-[var(--status-success-bg)] text-[var(--status-success)] border-[var(--status-success-border)]'
                        : 'bg-[var(--status-warning-bg)] text-[var(--status-warning)] border-[var(--status-warning-border)]'
                    }`}>
                      <span>{defect.status !== 'OPEN' ? 'Assigned' : 'Open'}</span>
                    </div>
                    <div className={`py-1 rounded-md border flex items-center justify-center gap-1 ${
                      defect.status === 'RESOLVED'
                        ? 'bg-[var(--status-success-bg)] text-[var(--status-success)] border-[var(--status-success-border)]'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border-subtle)]'
                    }`}>
                      <span>{defect.status === 'RESOLVED' ? 'Resolved' : 'Pending'}</span>
                    </div>
                  </div>
                </div>

                {/* View Action */}
                <div className="pt-1.5 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[var(--text-secondary)]">
                    Est. Repair: <strong className="text-[var(--status-warning)]">₹{(defect.costEstimation?.total_estimated_cost || 0).toLocaleString()}</strong>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDefect(defect);
                    }}
                    className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold transition-all text-[11px] shadow-xs active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Defect</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
