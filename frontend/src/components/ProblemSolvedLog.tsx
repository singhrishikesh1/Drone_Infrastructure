import React from 'react';
import { Defect } from '../types';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useToast } from './ToastNotification';

interface ProblemSolvedLogProps {
  defects: Defect[];
  onStatusChange: (defectId: string, newStatus: 'RESOLVED' | 'DISPATCHED' | 'OPEN') => void;
}

export const ProblemSolvedLog: React.FC<ProblemSolvedLogProps> = ({
  defects,
  onStatusChange
}) => {
  const { addToast } = useToast();
  const resolvedDefects = defects.filter(d => d.status === 'RESOLVED');
  const activeDefects = defects.filter(d => d.status !== 'RESOLVED');

  const totalSavedBudget = resolvedDefects.reduce(
    (acc, d) => acc + (d.costEstimation?.total_estimated_cost || 0),
    0
  );

  const handleStatusUpdate = (defectId: string, newStatus: 'RESOLVED' | 'DISPATCHED' | 'OPEN') => {
    onStatusChange(defectId, newStatus);
    const label = newStatus === 'RESOLVED' ? 'Marked as Resolved' : 'Ticket Re-opened';
    addToast('success', 'Status Updated', `Defect #${defectId} ${label}`);
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header Banner */}
      <div className="app-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--status-success-bg)] border border-[var(--status-success-border)] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-[var(--status-success)]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono flex items-center gap-2">
              INCIDENT REMEDIATION & DEFECT LOG
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)] font-bold font-mono">
                {resolvedDefects.length} RESOLVED
              </span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">AI Volumetric defects, field repairs, & rescan audit logs</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-right">
            <span className="text-[var(--text-muted)] text-[10px] uppercase block font-semibold">PREVENTED DAMAGE COST</span>
            <span className="text-base font-bold text-[var(--status-success)]">
              ₹{totalSavedBudget.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active Defects Needing Action */}
        <div className="app-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[var(--status-warning)]" />
              Active Defects Pending Repair ({activeDefects.length})
            </h3>
            <span className="text-[10px] text-[var(--status-warning)] font-bold font-mono uppercase">Action Needed</span>
          </div>

          <div className="space-y-2.5">
            {activeDefects.length === 0 ? (
              <div className="text-center p-6 text-[var(--text-muted)] font-mono text-xs">
                No active defects pending repair.
              </div>
            ) : (
              activeDefects.map((defect) => (
                <div
                  key={defect.id}
                  className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-bold text-[10px] border border-[var(--brand-primary)]/20 font-mono">
                          #{defect.id}
                        </span>
                        <span className="font-bold text-[var(--text-primary)]">{defect.title}</span>
                      </div>
                      <div className="text-[var(--text-secondary)] text-[11px]">📍 {defect.locationName}</div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] font-mono ${
                        defect.riskLevel === 'CRITICAL'
                          ? 'bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical-border)]'
                          : 'bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning-border)]'
                      }`}
                    >
                      {defect.riskLevel}
                    </span>
                  </div>

                  <div className="text-[var(--text-primary)] bg-[var(--bg-surface)] p-2.5 rounded-lg border border-[var(--border-subtle)] text-[11px]">
                    <strong className="font-mono text-[var(--brand-primary)] text-[10px]">AI RECOMMENDED ACTION:</strong> {defect.costEstimation?.recommended_action}
                  </div>

                  <div className="flex items-center justify-between pt-1 font-mono">
                    <span className="text-[var(--text-secondary)] text-[11px]">ESTIMATED COST: <strong className="text-[var(--text-primary)]">₹{(defect.costEstimation?.total_estimated_cost || 0).toLocaleString()}</strong></span>
                    <button
                      onClick={() => handleStatusUpdate(defect.id, 'RESOLVED')}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold transition-all text-[11px] shadow-xs active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Solved</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Solved Problems Audit Log */}
        <div className="app-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--status-success)]" />
              Remediated Defect Audit Log ({resolvedDefects.length})
            </h3>
            <span className="text-[10px] text-[var(--status-success)] font-bold font-mono uppercase">Verified</span>
          </div>

          <div className="space-y-2.5">
            {resolvedDefects.length === 0 ? (
              <div className="text-center p-6 text-[var(--text-muted)] font-mono text-xs">
                No defects resolved yet.
              </div>
            ) : (
              resolvedDefects.map((defect) => (
                <div
                  key={defect.id}
                  className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--status-success-border)] space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-md bg-[var(--status-success-bg)] text-[var(--status-success)] font-bold text-[10px] border border-[var(--status-success-border)] font-mono">
                          #{defect.id}
                        </span>
                        <span className="font-bold text-[var(--text-primary)]">{defect.title}</span>
                      </div>
                      <div className="text-[var(--text-secondary)] text-[11px]">📍 {defect.locationName}</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md bg-[var(--status-success-bg)] text-[var(--status-success)] font-bold text-[10px] border border-[var(--status-success-border)] font-mono">
                      RESOLVED
                    </span>
                  </div>

                  <div className="text-[var(--text-secondary)] text-[11px] bg-[var(--bg-surface)] p-2.5 rounded-lg border border-[var(--border-subtle)] font-sans">
                    <span className="text-[var(--status-success)] font-mono font-bold text-[10px]">RESOLUTION AUDIT: </span>
                    Autonomous drone rescan verified repair integrity and surface smoothness. Zero structural risk remaining.
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                    <span className="text-[var(--text-muted)]">INSPECTOR: {defect.inspector}</span>
                    <button
                      onClick={() => handleStatusUpdate(defect.id, 'OPEN')}
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline font-semibold"
                    >
                      Re-open Ticket
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
