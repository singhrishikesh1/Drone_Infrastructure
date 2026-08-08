import React from 'react';
import { Defect } from '../types';
import { Cpu, Eye, Sparkles, Layers, ShieldAlert, ArrowRight } from 'lucide-react';

interface DefectListProps {
  defects: Defect[];
  onSelectDefect: (defect: Defect) => void;
  selectedDefect: Defect | null;
}

export const DefectList: React.FC<DefectListProps> = ({ defects, onSelectDefect, selectedDefect }) => {
  return (
    <div className="glass-panel p-3.5 rounded-xl border border-white/[0.08] bg-[#0A0F17]/90 flex flex-col h-[495px] hud-border">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-1.5">
              AI INFRASTRUCTURE INTELLIGENCE
            </h3>
          </div>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
          {defects.length} ACTIVE DEFECTS
        </span>
      </div>

      {/* Queue List */}
      <div className="overflow-y-auto flex-1 mt-2.5 space-y-2 pr-1">
        {defects.map((defect) => {
          const isSelected = selectedDefect?.id === defect.id;
          let badgeBg = 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40';
          if (defect.riskLevel === 'CRITICAL') badgeBg = 'bg-red-950/80 text-red-400 border-red-500/40 animate-pulse';
          else if (defect.riskLevel === 'HIGH') badgeBg = 'bg-orange-950/80 text-orange-400 border-orange-500/40';
          else if (defect.riskLevel === 'MEDIUM') badgeBg = 'bg-yellow-950/80 text-yellow-400 border-yellow-500/40';

          return (
            <div
              key={defect.id}
              onClick={() => onSelectDefect(defect)}
              className={`p-3 rounded-lg border transition-all cursor-pointer space-y-2 ${
                isSelected
                  ? 'bg-[#0F1726] border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                  : 'bg-[#05070B]/80 border-white/[0.06] hover:bg-[#0F1726]/60 hover:border-slate-700'
              }`}
            >
              {/* Row 1: Badges & Asset Class */}
              <div className="flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center space-x-2">
                  <span className={`font-extrabold px-2 py-0.5 rounded border uppercase ${badgeBg}`}>
                    {defect.riskLevel} ({defect.riskScore}/100)
                  </span>
                  <span className="text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20 font-bold">
                    {(defect.confidence * 100).toFixed(0)}% CONFIDENCE
                  </span>
                </div>
                <span className="text-slate-400 uppercase font-semibold">• {defect.assetType}</span>
              </div>

              {/* Row 2: Thumbnail & Details */}
              <div className="flex items-center space-x-3">
                <img
                  src={defect.thumbnailUrl}
                  alt={defect.defectClass}
                  className="w-12 h-12 rounded-lg object-cover border border-white/[0.1] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-100 truncate">{defect.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    📍 {defect.locationName} ({defect.assetName})
                  </p>
                </div>
              </div>

              {/* Row 3: Metrics & View 3D Action */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center space-x-3 text-slate-400">
                  <span>VOL: <strong className="text-cyan-300">{defect.volumetric?.volume_m3 || 0} m³</strong></span>
                  <span>DEPTH: <strong className="text-slate-200">{defect.volumetric?.max_depth_cm || 0} cm</strong></span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-bold text-cyan-400">
                    ₹{defect.costEstimation?.total_estimated_cost?.toLocaleString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDefect(defect);
                    }}
                    className="flex items-center space-x-1 px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-aerospace-950 font-bold transition-all border border-cyan-500/30 text-[10px]"
                  >
                    <Eye className="w-3 h-3" />
                    <span>VIEW 3D</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

