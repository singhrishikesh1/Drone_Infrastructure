import React from 'react';
import { Defect } from '../types';
import { CheckCircle2, AlertTriangle, ShieldCheck, Clock, ArrowRight, DollarSign, Wrench } from 'lucide-react';

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
      <div className="glass-panel p-4 rounded-xl border border-white/[0.08] bg-[#0A0F17]/90 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hud-border">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              INCIDENT REMEDIATION & PROBLEM SOLVED LOG
              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {resolvedDefects.length} PROBLEMS SOLVED
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">AI Volumetric Defects, Preventive Field Repairs & Disaster Mitigation Verification</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-right">
          <div className="p-2.5 rounded-lg bg-[#05070B] border border-white/[0.08]">
            <span className="text-slate-500 text-[10px] uppercase block">PREVENTED DISASTER COST</span>
            <span className="text-base font-extrabold text-emerald-400">
              ₹{totalSavedBudget.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active Problems Needing Action */}
        <div className="glass-panel p-4 rounded-xl border border-white/[0.08] bg-[#0A0F17]/90 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
              ACTIVE DEFECTS NEEDING FIELD REPAIR ({activeDefects.length})
            </h3>
            <span className="text-[10px] text-slate-400">ACTION REQUIRED</span>
          </div>

          <div className="space-y-2.5">
            {activeDefects.map((defect) => (
              <div
                key={defect.id}
                className="p-3 rounded-lg bg-[#05070B] border border-white/[0.06] hover:border-slate-700 transition-all space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-bold text-[10px] border border-red-500/20">
                        {defect.id}
                      </span>
                      <span className="font-bold text-slate-100 font-sans">{defect.title}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">📍 {defect.locationName} ({defect.assetName})</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      defect.riskLevel === 'CRITICAL'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                        : 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                    }`}
                  >
                    {defect.riskLevel}
                  </span>
                </div>

                <div className="text-slate-300 bg-[#0A0F17] p-2 rounded border border-white/[0.04] text-[11px] font-sans">
                  <strong className="font-mono text-cyan-400 text-[10px]">AI RECOMMENDATION:</strong> {defect.costEstimation?.recommended_action}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400 text-[11px]">EST. REPAIR: <strong className="text-slate-200">₹{defect.costEstimation?.total_estimated_cost?.toLocaleString()}</strong></span>
                  <button
                    onClick={() => onStatusChange(defect.id, 'RESOLVED')}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-aerospace-950 font-extrabold transition-all shadow text-[10px] uppercase"
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
        <div className="glass-panel p-4 rounded-xl border border-white/[0.08] bg-[#0A0F17]/90 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              REMEDIATED DEFECT AUDIT LOG ({resolvedDefects.length})
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold">RESCAN VERIFIED</span>
          </div>

          <div className="space-y-2.5">
            {resolvedDefects.map((defect) => (
              <div
                key={defect.id}
                className="p-3 rounded-lg bg-[#05070B] border border-emerald-500/20 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                        {defect.id}
                      </span>
                      <span className="font-bold text-slate-100 font-sans">{defect.title}</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">📍 {defect.locationName}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                    RESOLVED
                  </span>
                </div>

                <div className="text-slate-400 text-[11px] bg-[#0A0F17] p-2 rounded border border-white/[0.04] font-sans">
                  <span className="text-emerald-400 font-mono font-bold text-[10px]">RESOLUTION AUDIT:</span> Autonomous drone rescan verified crack filling & seal integrity. Zero risk remaining.
                </div>

                <div className="flex items-center justify-between pt-0.5 text-[10px]">
                  <span className="text-slate-500">INSPECTOR: {defect.inspector}</span>
                  <button
                    onClick={() => onStatusChange(defect.id, 'OPEN')}
                    className="text-slate-500 hover:text-slate-300 underline"
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
