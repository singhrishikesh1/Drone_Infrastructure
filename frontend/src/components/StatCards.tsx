import React from 'react';
import { ShieldAlert, IndianRupee, Activity, CheckCircle2, Cpu } from 'lucide-react';
import { AnalyticsSummary } from '../types';

interface StatCardsProps {
  summary: AnalyticsSummary;
  activeDronesCount?: number;
}

export const StatCards: React.FC<StatCardsProps> = ({ summary, activeDronesCount = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Active Drone Fleet */}
      <div className="glass-panel p-3.5 rounded-xl border border-white/[0.08] bg-[#0A0F17]/90 shadow-xl flex items-center justify-between hud-border">
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">AUTONOMOUS FLEET</span>
          <h3 className="text-xl font-extrabold text-slate-100 font-mono mt-0.5">{activeDronesCount} <span className="text-xs font-sans text-emerald-400 font-normal">Active</span></h3>
          <p className="text-[10px] text-cyan-400 font-mono mt-0.5 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" /> {summary.totalInspections} Scans Completed
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Activity className="w-5 h-5 animate-pulse" />
        </div>
      </div>

      {/* Urgent Repairs */}
      <div className="glass-panel p-3.5 rounded-xl border border-red-500/30 bg-[#0A0F17]/90 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">URGENT REPAIRS</span>
          <h3 className="text-xl font-extrabold text-red-400 font-mono mt-0.5">{summary.criticalRisks} <span className="text-xs font-sans text-red-400/80 font-normal">Active</span></h3>
          <p className="text-[10px] text-red-400/80 font-mono mt-0.5">Urgent Repair Dispatch</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
        </div>
      </div>

      {/* Solved Problems */}
      <div className="glass-panel p-3.5 rounded-xl border border-emerald-500/30 bg-[#0A0F17]/90 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">REMEDIATED DEFECTS</span>
          <h3 className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">
            {summary.resolvedProblems || 1} <span className="text-xs font-sans text-emerald-400 font-normal">Resolved</span>
          </h3>
          <p className="text-[10px] text-emerald-400/80 font-mono mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Rescan Verified
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* Total Repair Budget */}
      <div className="glass-panel p-3.5 rounded-xl border border-purple-500/30 bg-[#0A0F17]/90 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">EST. REPAIR BUDGET</span>
          <h3 className="text-xl font-extrabold text-purple-300 font-mono mt-0.5">
            ₹{summary.totalEstimatedBudget.toLocaleString()}
          </h3>
          <p className="text-[10px] text-purple-400 font-mono mt-0.5">Auto-calculated Civil BOM</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <IndianRupee className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

