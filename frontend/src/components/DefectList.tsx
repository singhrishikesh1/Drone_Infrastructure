import React from 'react';
import { Defect } from '../types';
import { ShieldAlert, Eye, CheckCircle2, AlertCircle, ArrowDown } from 'lucide-react';

interface DefectListProps {
  defects: Defect[];
  onSelectDefect: (defect: Defect) => void;
  selectedDefect: Defect | null;
}

export const DefectList: React.FC<DefectListProps> = ({ defects, onSelectDefect, selectedDefect }) => {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-[#FBCFE8] bg-[#FFFFFF] flex flex-col h-[520px] hud-border font-sans shadow-xs">
      {/* Header Banner - LIVE INSPECTION ALERTS */}
      <div className="flex items-center justify-between pb-3 border-b border-[#FBCFE8]">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#FFF1F2] border border-[#F43F5E]/30 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-[#E11D48]" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-[#831843] uppercase tracking-wider font-mono flex items-center gap-1">
              LIVE INSPECTION ALERTS 🧸
            </h3>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#E11D48] bg-[#FFF1F2] px-2 py-0.5 rounded-md border border-[#F43F5E]/30 font-bold">
          {defects.length} DEFECTS DETECTED
        </span>
      </div>

      {/* Queue List */}
      <div className="overflow-y-auto flex-1 mt-3 space-y-3 pr-1">
        {defects.map((defect) => {
          const isSelected = selectedDefect?.id === defect.id;
          const isCritical = defect.riskLevel === 'CRITICAL';
          const isWarning = defect.riskLevel === 'HIGH' || defect.riskLevel === 'MEDIUM';
          const isResolved = defect.status === 'RESOLVED';

          let statusDot = '🔴';
          let severityLabel = 'Critical';
          let badgeBg = 'bg-[#FFF1F2] text-[#E11D48] border-[#F43F5E]/30';

          if (isResolved) {
            statusDot = '🟢';
            severityLabel = 'Resolved';
            badgeBg = 'bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]/30';
          } else if (isWarning) {
            statusDot = '🟠';
            severityLabel = 'Warning';
            badgeBg = 'bg-[#FEF3C7] text-[#D97706] border-[#D97706]/30';
          }

          const displayTitle = defect.title.startsWith(statusDot)
            ? defect.title
            : `${statusDot} ${severityLabel} — ${defect.title}`;

          return (
            <div
              key={defect.id}
              onClick={() => onSelectDefect(defect)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                isSelected
                  ? 'bg-[#FFF1F2] border-[#E11D48] shadow-sm'
                  : `bg-[#FDF2F8] border-[#FBCFE8] hover:bg-[#FCE7F3] hover:border-[#E11D48]/40`
              }`}
            >
              {/* Row 1: Header title & AI Confidence */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-extrabold text-[#831843]">{displayTitle}</h4>
                  <p className="text-[11px] text-[#9D174D] mt-0.5">
                    📍 <strong className="text-[#831843]">{defect.locationName}</strong>
                  </p>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border whitespace-nowrap ${badgeBg}`}>
                  {(defect.confidence * 100).toFixed(1)}% CONFIDENCE
                </span>
              </div>

              {/* Row 2: Metadata (Time detected & Asset) */}
              <div className="flex items-center justify-between text-[10px] font-mono text-[#9D174D] bg-[#FFFFFF] p-2 rounded-lg border border-[#FBCFE8]">
                <span>TIME DETECTED: <strong className="text-[#831843]">{defect.timestamp || 'Just now'}</strong></span>
                <span>INSPECTOR: <strong className="text-[#E11D48]">{defect.inspector || 'SkyGuardian-X1'}</strong></span>
              </div>

              {/* Workflow Status Pipeline */}
              <div className="pt-2 border-t border-[#FBCFE8] space-y-1 text-[10px] font-mono">
                <div className="text-[#9D174D] font-bold text-[9px] uppercase tracking-wider mb-1">WORKFLOW PIPELINE 💕</div>
                <div className="grid grid-cols-4 gap-1 text-center font-bold">
                  <div className="bg-[#DCFCE7] text-[#16A34A] py-1 rounded-md border border-[#16A34A]/20 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
                    <span>Scan Done</span>
                  </div>
                  <div className="bg-[#DCFCE7] text-[#16A34A] py-1 rounded-md border border-[#16A34A]/20 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
                    <span>Detected</span>
                  </div>
                  <div className={`py-1 rounded-md border flex items-center justify-center gap-1 ${
                    defect.status !== 'OPEN' 
                      ? 'bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]/20'
                      : 'bg-[#FFF1F2] text-[#E11D48] border-[#E11D48]/40'
                  }`}>
                    <span className="text-xs">●</span>
                    <span>Assigned</span>
                  </div>
                  <div className={`py-1 rounded-md border flex items-center justify-center gap-1 ${
                    defect.status === 'RESOLVED'
                      ? 'bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]/20'
                      : 'bg-[#FFFFFF] text-[#9D174D] border-[#FBCFE8]'
                  }`}>
                    <span className="text-xs">{defect.status === 'RESOLVED' ? '✓' : '○'}</span>
                    <span>Pending</span>
                  </div>
                </div>
              </div>

              {/* Row 4: View Defect Button */}
              <div className="pt-1.5 flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#9D174D]">
                  Est. Repair: <strong className="text-[#E11D48]">₹{defect.costEstimation?.total_estimated_cost?.toLocaleString()}</strong>
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDefect(defect);
                  }}
                  className="flex items-center space-x-1 px-3.5 py-1 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold transition-all text-[11px] shadow-xs active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Defect</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


