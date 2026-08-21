import React from 'react';
import { Defect } from '../types';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ProblemSolvedLogProps {
  defects: Defect[];
  onStatusChange: (defectId: string, newStatus: 'RESOLVED' | 'DISPATCHED' | 'OPEN') => void;
}

export const ProblemSolvedLog: React.FC<ProblemSolvedLogProps> = ({
  defects,
  onStatusChange
}) => {
  const resolvedDefects = defects.filter(d => d.status === 'RESOLVED');
  const activeDefects = defects.filter(d => d.status !== 'RESOLVED');

  const totalSavedBudget = resolvedDefects.reduce(
    (acc, d) => acc + (d.costEstimation?.total_estimated_cost || 0),
    0
  );

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Header Banner */}
      <div className="glass-panel p-4 rounded-xl border border-[#152535] bg-[#101C28] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hud-border font-sans">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#F1F5F9] uppercase tracking-wider flex items-center gap-2 font-mono">
              INCIDENT REMEDIATION & DEFECT LOG
              <span className="text-[9px] px-2 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 font-bold">
                {resolvedDefects.length} PROBLEMS SOLVED
              </span>
            </h2>
            <p className="text-[11px] text-[#94A3B8]">AI Volumetric Defects, Preventive Field Repairs & Rescan Verification</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-right">
          <div className="p-2.5 rounded-lg bg-[#152535] border border-[#152535]">
            <span className="text-[#94A3B8] text-[10px] uppercase block font-bold">PREVENTED DISASTER COST</span>
            <span className="text-base font-extrabold text-[#22C55E]">
              ₹{totalSavedBudget.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-sans">
        {/* Active Defects Needing Action */}
        <div className="glass-panel p-4 rounded-xl border border-[#152535] bg-[#101C28] space-y-3 shadow-md">
          <div className="flex items-center justify-between border-b border-[#152535] pb-2.5">
            <h3 className="text-xs font-bold text-[#F1F5F9] uppercase tracking-wider flex items-center gap-2 font-mono">
              <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
              ACTIVE DEFECTS NEEDING FIELD REPAIR ({activeDefects.length})
            </h3>
            <span className="text-[10px] text-[#94A3B8] font-mono">ACTION REQUIRED</span>
          </div>

          <div className="space-y-2.5">
            {activeDefects.map((defect) => (
              <div
                key={defect.id}
                className="p-3 rounded-lg bg-[#152535] border border-[#152535] hover:border-[#16B9E8]/30 transition-all space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444] font-bold text-[10px] border border-[#EF4444]/30 font-mono">
                        {defect.id}
                      </span>
                      <span className="font-bold text-[#F1F5F9] font-sans">{defect.title}</span>
                    </div>
                    <div className="text-[#94A3B8] text-[11px]">📍 {defect.locationName}</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] font-mono ${
                      defect.riskLevel === 'CRITICAL'
                        ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30'
                        : 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30'
                    }`}
                  >
                    {defect.riskLevel}
                  </span>
                </div>

                <div className="text-[#F1F5F9] bg-[#101C28] p-2 rounded border border-[#152535] text-[11px]">
                  <strong className="font-mono text-[#16B9E8] text-[10px]">AI ACTION:</strong> {defect.costEstimation?.recommended_action}
                </div>

                <div className="flex items-center justify-between pt-1 font-mono">
                  <span className="text-[#94A3B8] text-[11px]">EST. REPAIR: <strong className="text-[#F1F5F9]">₹{defect.costEstimation?.total_estimated_cost?.toLocaleString()}</strong></span>
                  <button
                    onClick={() => onStatusChange(defect.id, 'RESOLVED')}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded bg-[#22C55E] hover:bg-[#1ea850] text-[#08111A] font-extrabold transition-all shadow text-[10px] uppercase"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>MARK SOLVED</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solved Problems Audit Log */}
        <div className="glass-panel p-4 rounded-xl border border-[#152535] bg-[#101C28] space-y-3 shadow-md">
          <div className="flex items-center justify-between border-b border-[#152535] pb-2.5">
            <h3 className="text-xs font-bold text-[#F1F5F9] uppercase tracking-wider flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
              REMEDIATED DEFECT AUDIT LOG ({resolvedDefects.length})
            </h3>
            <span className="text-[10px] text-[#22C55E] font-bold font-mono">RESCAN VERIFIED</span>
          </div>

          <div className="space-y-2.5">
            {resolvedDefects.map((defect) => (
              <div
                key={defect.id}
                className="p-3 rounded-lg bg-[#152535] border border-[#22C55E]/30 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E] font-bold text-[10px] border border-[#22C55E]/30 font-mono">
                        {defect.id}
                      </span>
                      <span className="font-bold text-[#F1F5F9]">{defect.title}</span>
                    </div>
                    <div className="text-[#94A3B8] text-[11px]">📍 {defect.locationName}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E] font-bold text-[10px] border border-[#22C55E]/30 font-mono">
                    RESOLVED
                  </span>
                </div>

                <div className="text-[#94A3B8] text-[11px] bg-[#101C28] p-2 rounded border border-[#152535]">
                  <span className="text-[#22C55E] font-mono font-bold text-[10px]">RESOLUTION AUDIT:</span> Autonomous drone rescan verified repair integrity. Zero risk remaining.
                </div>

                <div className="flex items-center justify-between pt-0.5 text-[10px] font-mono">
                  <span className="text-[#64748B]">INSPECTOR: {defect.inspector}</span>
                  <button
                    onClick={() => onStatusChange(defect.id, 'OPEN')}
                    className="text-[#94A3B8] hover:text-[#F1F5F9] underline"
                  >
                    RE-OPEN TICKET
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

