import React from 'react';
import { ShieldAlert, AlertTriangle, IndianRupee, Activity, CheckCircle2 } from 'lucide-react';
import { AnalyticsSummary } from '../types';

interface StatCardsProps {
  summary: AnalyticsSummary;
}

export const StatCards: React.FC<StatCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Scans */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border-l-4 border-cyan-500">
        <div>
          <p className="text-xs font-medium text-slate-400">Total Asset Scans</p>
          <h3 className="text-2xl font-extrabold text-white font-['Outfit'] mt-1">{summary.totalInspections}</h3>
          <p className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Autonomous Drone Surveys
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <Activity className="w-6 h-6" />
        </div>
      </div>

      {/* Critical Risks */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border-l-4 border-red-500">
        <div>
          <p className="text-xs font-medium text-slate-400">Critical Risks</p>
          <h3 className="text-2xl font-extrabold text-red-400 font-['Outfit'] mt-1">{summary.criticalRisks}</h3>
          <p className="text-[11px] text-red-400/80 mt-1">Requires immediate engineering action</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      {/* High Priority */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border-l-4 border-orange-500">
        <div>
          <p className="text-xs font-medium text-slate-400">High Priority Defects</p>
          <h3 className="text-2xl font-extrabold text-orange-400 font-['Outfit'] mt-1">{summary.highRisks}</h3>
          <p className="text-[11px] text-orange-400/80 mt-1">Scheduled repair queues</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
      </div>

      {/* Total Repair Cost */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border-l-4 border-emerald-500">
        <div>
          <p className="text-xs font-medium text-slate-400">Est. Total Repair Budget</p>
          <h3 className="text-2xl font-extrabold text-emerald-400 font-['Outfit'] mt-1">
            ₹{summary.totalEstimatedBudget.toLocaleString()}
          </h3>
          <p className="text-[11px] text-emerald-400/80 mt-1">Auto-calculated Civil BOM</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <IndianRupee className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
