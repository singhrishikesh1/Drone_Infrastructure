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
      {/* ACTIVE DRONE */}
      <div className="glass-panel p-4 rounded-2xl border border-[#FBCFE8] bg-[#FFFFFF] flex items-center justify-between hud-border shadow-xs">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#9D174D] uppercase tracking-wider block flex items-center gap-1">
            ACTIVE DRONE 🧸
          </span>
          <h3 className="text-2xl font-extrabold text-[#E11D48] font-mono mt-1">1</h3>
          <div className="mt-1 flex items-center space-x-2">
            <span className="text-xs font-bold text-white bg-[#E11D48] px-2 py-0.5 rounded-md border border-[#E11D48] shadow-xs">
              SkyGuardian-X1
            </span>
            <span className="text-[11px] text-[#16A34A] font-bold flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] inline-block animate-pulse" /> Patrol 💕
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] border border-[#F43F5E]/30 flex items-center justify-center text-[#E11D48]">
          <Plane className="w-5 h-5" />
        </div>
      </div>

      {/* Critical Defects / Repairs */}
      <div className="glass-panel p-4 rounded-2xl border border-[#FBCFE8] bg-[#FFFFFF] flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#9D174D] uppercase tracking-wider block">CRITICAL DEFECTS</span>
          <h3 className="text-2xl font-extrabold text-[#E11D48] font-mono mt-1">{summary.criticalRisks}</h3>
          <p className="text-[11px] text-[#E11D48] font-bold font-mono mt-1">Action Required</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] border border-[#F43F5E]/30 flex items-center justify-center text-[#E11D48]">
          <ShieldAlert className="w-5 h-5" />
        </div>
      </div>

      {/* Resolved Inspection Problems */}
      <div className="glass-panel p-4 rounded-2xl border border-[#FBCFE8] bg-[#FFFFFF] flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#9D174D] uppercase tracking-wider block">REMEDIATED DEFECTS</span>
          <h3 className="text-2xl font-extrabold text-[#16A34A] font-mono mt-1">
            {summary.resolvedProblems || 1}
          </h3>
          <p className="text-[11px] text-[#16A34A] font-bold font-mono mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Rescan Verified
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] border border-[#16A34A]/30 flex items-center justify-center text-[#16A34A]">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* Total Estimated Repair Budget */}
      <div className="glass-panel p-4 rounded-2xl border border-[#FBCFE8] bg-[#FFFFFF] flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#9D174D] uppercase tracking-wider block">EST. REPAIR BUDGET</span>
          <h3 className="text-2xl font-extrabold text-[#D97706] font-mono mt-1">
            ₹{summary.totalEstimatedBudget.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#9D174D] font-mono mt-1">Civil BOM Estimation</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#D97706]/30 flex items-center justify-center text-[#D97706]">
          <IndianRupee className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};


