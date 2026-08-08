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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-[#0c1220]/90 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Infrastructure Incident & Problem Resolution Log
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {resolvedDefects.length} PROBLEMS SOLVED
              </span>
            </h2>
            <p className="text-xs text-slate-400">Tracked AI Volumetric Defects, Preventive Field Repairs & Disaster Mitigation</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-right">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Prevented Disaster Cost</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              ₹{totalSavedBudget.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Problems Needing Action */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-[#0c1220]/90 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              Active Infrastructure Defects ({activeDefects.length})
            </h3>
            <span className="text-xs text-slate-400">Requires Field Crew</span>
          </div>

          <div className="space-y-3">
            {activeDefects.map((defect) => (
              <div
                key={defect.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold font-mono text-[10px]">
                        {defect.id}
                      </span>
                      <span className="font-bold text-slate-100">{defect.title}</span>
                    </div>
                    <div className="text-slate-400">📍 {defect.locationName} ({defect.assetName})</div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      defect.riskLevel === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    }`}
                  >
                    {defect.riskLevel}
                  </span>
                </div>

                <div className="text-slate-300 bg-[#06080f] p-2.5 rounded-lg border border-slate-800/80 text-[11px]">
                  <strong>AI Recommended Action:</strong> {defect.costEstimation?.recommended_action}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">Est. Repair: <strong className="text-slate-200">₹{defect.costEstimation?.total_estimated_cost?.toLocaleString()}</strong></span>
                  <button
                    onClick={() => onStatusChange(defect.id, 'RESOLVED')}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Problem Solved</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solved Problems Audit Log */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-[#0c1220]/90 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Resolved & Remediated Defects ({resolvedDefects.length})
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">● Solved & Verified</span>
          </div>

          <div className="space-y-3">
            {resolvedDefects.map((defect) => (
              <div
                key={defect.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/20 space-y-3 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono text-[10px]">
                        {defect.id}
                      </span>
                      <span className="font-bold text-slate-100">{defect.title}</span>
                    </div>
                    <div className="text-slate-400">📍 {defect.locationName}</div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                    RESOLVED
                  </span>
                </div>

                <div className="text-slate-400 text-[11px] bg-[#06080f] p-2.5 rounded-lg border border-slate-800">
                  <span className="text-emerald-400 font-semibold">Resolution Audit:</span> Drone re-inspection scan verified crack filling and structural seal integrity. Zero safety risks remaining.
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-400">Inspector: {defect.inspector}</span>
                  <button
                    onClick={() => onStatusChange(defect.id, 'OPEN')}
                    className="text-slate-500 hover:text-slate-300 underline text-[10px]"
                  >
                    Re-open Ticket
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
