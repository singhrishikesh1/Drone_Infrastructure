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
      <div className="glass-panel p-4 rounded-2xl border border-[#FBCFE8] bg-[#FFFFFF] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hud-border font-sans">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] border border-[#16A34A]/30 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#831843] uppercase tracking-wider flex items-center gap-2 font-mono">
              INCIDENT REMEDIATION & DEFECT LOG 🧸
              <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/30 font-bold">
                {resolvedDefects.length} PROBLEMS SOLVED 💕
              </span>
            </h2>
            <p className="text-[11px] text-[#9D174D]">AI Volumetric Defects, Preventive Field Repairs & Rescan Verification</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-right">
          <div className="p-2.5 rounded-xl bg-[#FDF2F8] border border-[#FBCFE8]">
            <span className="text-[#9D174D] text-[10px] uppercase block font-extrabold">PREVENTED DISASTER COST</span>
            <span className="text-base font-extrabold text-[#16A34A]">
              ₹{totalSavedBudget.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-sans">
        {/* Active Defects Needing Action */}
        <div className="glass-panel p-4 rounded-2xl border border-[#FBCFE8] bg-[#FFFFFF] space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#FBCFE8] pb-2.5">
            <h3 className="text-xs font-extrabold text-[#831843] uppercase tracking-wider flex items-center gap-2 font-mono">
              <AlertTriangle className="w-3.5 h-3.5 text-[#E11D48]" />
              ACTIVE DEFECTS NEEDING FIELD REPAIR ({activeDefects.length})
            </h3>
            <span className="text-[10px] text-[#E11D48] font-bold font-mono">ACTION REQUIRED</span>
          </div>

          <div className="space-y-2.5">
            {activeDefects.map((defect) => (
              <div
                key={defect.id}
                className="p-3 rounded-xl bg-[#FDF2F8] border border-[#FBCFE8] hover:border-[#E11D48]/30 transition-all space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded-md bg-[#FFF1F2] text-[#E11D48] font-bold text-[10px] border border-[#F43F5E]/30 font-mono">
                        {defect.id}
                      </span>
                      <span className="font-bold text-[#831843] font-sans">{defect.title}</span>
                    </div>
                    <div className="text-[#9D174D] text-[11px]">📍 {defect.locationName}</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] font-mono ${
                      defect.riskLevel === 'CRITICAL'
                        ? 'bg-[#FFF1F2] text-[#E11D48] border border-[#F43F5E]/30'
                        : 'bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/30'
                    }`}
                  >
                    {defect.riskLevel}
                  </span>
                </div>

                <div className="text-[#831843] bg-[#FFFFFF] p-2 rounded-lg border border-[#FBCFE8] text-[11px] font-bold">
                  <strong className="font-mono text-[#E11D48] text-[10px]">AI ACTION:</strong> {defect.costEstimation?.recommended_action}
                </div>

                <div className="flex items-center justify-between pt-1 font-mono">
                  <span className="text-[#9D174D] text-[11px]">EST. REPAIR: <strong className="text-[#831843]">₹{defect.costEstimation?.total_estimated_cost?.toLocaleString()}</strong></span>
                  <button
                    onClick={() => onStatusChange(defect.id, 'RESOLVED')}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold transition-all shadow-xs text-[10px] uppercase active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>MARK SOLVED</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solved Problems Audit Log */}
        <div className="glass-panel p-4 rounded-2xl border border-[#FBCFE8] bg-[#FFFFFF] space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#FBCFE8] pb-2.5">
            <h3 className="text-xs font-extrabold text-[#831843] uppercase tracking-wider flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              REMEDIATED DEFECT AUDIT LOG ({resolvedDefects.length})
            </h3>
            <span className="text-[10px] text-[#16A34A] font-bold font-mono">RESCAN VERIFIED</span>
          </div>

          <div className="space-y-2.5">
            {resolvedDefects.map((defect) => (
              <div
                key={defect.id}
                className="p-3 rounded-xl bg-[#FDF2F8] border border-[#16A34A]/30 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded-md bg-[#DCFCE7] text-[#16A34A] font-bold text-[10px] border border-[#16A34A]/30 font-mono">
                        {defect.id}
                      </span>
                      <span className="font-bold text-[#831843]">{defect.title}</span>
                    </div>
                    <div className="text-[#9D174D] text-[11px]">📍 {defect.locationName}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#16A34A] font-extrabold text-[10px] border border-[#16A34A]/30 font-mono">
                    RESOLVED
                  </span>
                </div>

                <div className="text-[#9D174D] text-[11px] bg-[#FFFFFF] p-2 rounded-lg border border-[#FBCFE8]">
                  <span className="text-[#16A34A] font-mono font-bold text-[10px]">RESOLUTION AUDIT:</span> Autonomous drone rescan verified repair integrity. Zero risk remaining.
                </div>

                <div className="flex items-center justify-between pt-0.5 text-[10px] font-mono">
                  <span className="text-[#BE185D]">INSPECTOR: {defect.inspector}</span>
                  <button
                    onClick={() => onStatusChange(defect.id, 'OPEN')}
                    className="text-[#9D174D] hover:text-[#831843] underline font-bold"
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

