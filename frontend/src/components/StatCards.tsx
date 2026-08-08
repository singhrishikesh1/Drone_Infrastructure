import React from 'react';
import { ShieldAlert, AlertTriangle, IndianRupee, Activity, CheckCircle2, Cpu } from 'lucide-react';
import { AnalyticsSummary } from '../types';

interface StatCardsProps {
  summary: AnalyticsSummary;
  activeDronesCount?: number;
}

export const StatCards: React.FC<StatCardsProps> = ({ summary, activeDronesCount = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Scans & Active Drones */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border-l-4 border-cyan-500 bg-[#0c1220]/90 shadow-xl">
        <div>
          <p className="text-xs font-medium text-slate-400">Pune Active Drone Fleet</p>
          <h3 className="text-2xl font-extrabold text-white font-['Outfit'] mt-1">{activeDronesCount} Drones Flying</h3>
          <p className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" /> {summary.totalInspections} Total Sector Scans
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <Activity className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      {/* Critical Risks */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border-l-4 border-red-500 bg-[#0c1220]/90 shadow-xl">
        <div>
          <p className="text-xs font-medium text-slate-400">Critical Risks</p>
          <h3 className="text-2xl font-extrabold text-red-400 font-['Outfit'] mt-1">{summary.criticalRisks}</h3>
          <p className="text-[11px] text-red-400/80 mt-1">Immediate engineering action</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      {/* Problems Solved */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border-l-4 border-emerald-500 bg-[#0c1220]/90 shadow-xl">
        <div>
          <p className="text-xs font-medium text-slate-400">Problems Solved</p>
          <h3 className="text-2xl font-extrabold text-emerald-400 font-['Outfit'] mt-1">
            {summary.resolvedProblems || 1} Solved
          </h3>
          <p className="text-[11px] text-emerald-400/80 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Verified by Drone Scan
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>

      {/* Total Repair Cost */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border-l-4 border-purple-500 bg-[#0c1220]/90 shadow-xl">
        <div>
          <p className="text-xs font-medium text-slate-400">Est. Repair Budget</p>
          <h3 className="text-2xl font-extrabold text-slate-100 font-['Outfit'] mt-1">
            ₹{summary.totalEstimatedBudget.toLocaleString()}
          </h3>
          <p className="text-[11px] text-purple-400 mt-1">Auto-calculated Civil BOM</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
          <IndianRupee className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
