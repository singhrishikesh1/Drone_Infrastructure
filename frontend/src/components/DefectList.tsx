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
    <div className="glass-panel p-4 rounded-xl border border-[#152535] bg-[#101C28] flex flex-col h-[520px] hud-border font-sans">
      {/* Header Banner - LIVE INSPECTION ALERTS */}
      <div className="flex items-center justify-between pb-3 border-b border-[#152535]">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#16B9E8]/10 border border-[#16B9E8]/30 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-[#16B9E8]" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-[#F1F5F9] uppercase tracking-wider font-mono">
              LIVE INSPECTION ALERTS
            </h3>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#16B9E8] bg-[#16B9E8]/10 px-2 py-0.5 rounded border border-[#16B9E8]/20 font-bold">
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

          // Formatting Title & Dot according to prompt specs:
          // 🔴 Critical — Bridge Structural Crack
          // 🟠 Warning — Road Surface Damage
          // 🟢 Resolved — Pothole Inspection
          let statusDot = '🔴';
          let severityLabel = 'Critical';
          let borderAccent = 'border-[#EF4444]/40';
          let badgeBg = 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30';

          if (isResolved) {
            statusDot = '🟢';
            severityLabel = 'Resolved';
            borderAccent = 'border-[#22C55E]/40';
            badgeBg = 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30';
          } else if (isWarning) {
            statusDot = '🟠';
            severityLabel = 'Warning';
            borderAccent = 'border-[#F59E0B]/40';
            badgeBg = 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30';
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
                  ? 'bg-[#152535] border-[#16B9E8] shadow-md'
                  : `bg-[#08111A] border-[#152535] hover:bg-[#152535]/60 hover:border-[#16B9E8]/40`
              }`}
            >
              {/* Row 1: Header title & AI Confidence */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-[#F1F5F9]">{displayTitle}</h4>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    📍 <strong className="text-[#F1F5F9]">{defect.locationName}</strong>
                  </p>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border whitespace-nowrap ${badgeBg}`}>
                  {(defect.confidence * 100).toFixed(1)}% CONFIDENCE
                </span>
              </div>

              {/* Row 2: Metadata (Time detected & Asset) */}
              <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] bg-[#101C28] p-2 rounded-lg border border-[#152535]">
                <span>TIME DETECTED: <strong className="text-[#94A3B8]">{defect.timestamp || 'Just now'}</strong></span>
                <span>INSPECTOR: <strong className="text-[#16B9E8]">{defect.inspector || 'SkyGuardian-X1'}</strong></span>
              </div>

              {/* Workflow Status Pipeline (4 Steps as specified) */}
              <div className="pt-2 border-t border-[#152535] space-y-1 text-[10px] font-mono">
                <div className="text-[#64748B] font-bold text-[9px] uppercase tracking-wider mb-1">WORKFLOW PIPELINE</div>
                <div className="grid grid-cols-4 gap-1 text-center font-bold">
                  <div className="bg-[#152535] text-[#22C55E] py-1 rounded border border-[#22C55E]/20 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                    <span>Scan Done</span>
                  </div>
                  <div className="bg-[#152535] text-[#22C55E] py-1 rounded border border-[#22C55E]/20 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                    <span>Detected</span>
                  </div>
                  <div className={`py-1 rounded border flex items-center justify-center gap-1 ${
                    defect.status !== 'OPEN' 
                      ? 'bg-[#152535] text-[#22C55E] border-[#22C55E]/20'
                      : 'bg-[#16B9E8]/10 text-[#16B9E8] border-[#16B9E8]/40'
                  }`}>
                    <span className="text-xs">●</span>
                    <span>Assigned</span>
                  </div>
                  <div className={`py-1 rounded border flex items-center justify-center gap-1 ${
                    defect.status === 'RESOLVED'
                      ? 'bg-[#152535] text-[#22C55E] border-[#22C55E]/20'
                      : 'bg-[#101C28] text-[#64748B] border-[#152535]'
                  }`}>
                    <span className="text-xs">{defect.status === 'RESOLVED' ? '✓' : '○'}</span>
                    <span>Pending</span>
                  </div>
                </div>
              </div>

              {/* Row 4: View Defect Button */}
              <div className="pt-1.5 flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#94A3B8]">
                  Est. Repair: <strong className="text-[#16B9E8]">₹{defect.costEstimation?.total_estimated_cost?.toLocaleString()}</strong>
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDefect(defect);
                  }}
                  className="flex items-center space-x-1 px-3 py-1 rounded bg-[#16B9E8] hover:bg-[#38CBF3] text-[#08111A] font-extrabold transition-all text-[11px]"
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


