import React from 'react';
import { ShieldAlert, IndianRupee, Activity, CheckCircle2, Plane } from 'lucide-react';
import { AnalyticsSummary } from '../types';

interface StatCardsProps {
  summary: AnalyticsSummary;
  activeDronesCount?: number;
}

export const StatCards: React.FC<StatCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-sans">
      {/* ACTIVE DRONE (Prompt Spec) */}
      <div className="glass-panel p-4 rounded-xl border border-[#152535] bg-[#101C28] flex items-center justify-between hud-border">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider block">ACTIVE DRONE</span>
          <h3 className="text-2xl font-extrabold text-[#F1F5F9] font-mono mt-1">1</h3>
          <div className="mt-1 flex items-center space-x-2">
            <span className="text-xs font-bold text-[#16B9E8] bg-[#16B9E8]/10 px-2 py-0.5 rounded border border-[#16B9E8]/30">
              SkyGuardian-X1
            </span>
            <span className="text-[11px] text-[#22C55E] font-medium flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] inline-block animate-pulse" /> Autonomous Patrol
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#16B9E8]/10 border border-[#16B9E8]/30 flex items-center justify-center text-[#16B9E8]">
          <Plane className="w-5 h-5" />
        </div>
      </div>

      {/* Critical Defects / Repairs */}
      <div className="glass-panel p-4 rounded-xl border border-[#152535] bg-[#101C28] flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider block">CRITICAL DEFECTS</span>
          <h3 className="text-2xl font-extrabold text-[#EF4444] font-mono mt-1">{summary.criticalRisks}</h3>
          <p className="text-[11px] text-[#94A3B8] font-mono mt-1">Action Required</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444]">
          <ShieldAlert className="w-5 h-5" />
        </div>
      </div>

      {/* Resolved Inspection Problems */}
      <div className="glass-panel p-4 rounded-xl border border-[#152535] bg-[#101C28] flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider block">REMEDIATED DEFECTS</span>
          <h3 className="text-2xl font-extrabold text-[#22C55E] font-mono mt-1">
            {summary.resolvedProblems || 1}
          </h3>
          <p className="text-[11px] text-[#22C55E] font-mono mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Rescan Verified
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* Total Estimated Repair Budget */}
      <div className="glass-panel p-4 rounded-xl border border-[#152535] bg-[#101C28] flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider block">EST. REPAIR BUDGET</span>
          <h3 className="text-2xl font-extrabold text-[#F59E0B] font-mono mt-1">
            ₹{summary.totalEstimatedBudget.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#94A3B8] font-mono mt-1">Civil BOM Estimation</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
          <IndianRupee className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};


