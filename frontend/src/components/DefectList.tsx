import React from 'react';
import { Defect } from '../types';
import { ShieldAlert, AlertTriangle, Eye, ArrowRight, Layers, Box } from 'lucide-react';

interface DefectListProps {
  defects: Defect[];
  onSelectDefect: (defect: Defect) => void;
  selectedDefect: Defect | null;
}

export const DefectList: React.FC<DefectListProps> = ({ defects, onSelectDefect, selectedDefect }) => {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col h-[420px]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" /> Detected Defect Queue ({defects.length})
        </h3>
        <span className="text-[11px] text-slate-400">Click card for 3D & Cost Breakdown</span>
      </div>

      <div className="overflow-y-auto flex-1 mt-3 space-y-2.5 pr-1">
        {defects.map((defect) => {
          const isSelected = selectedDefect?.id === defect.id;
          let badgeBg = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
          if (defect.riskLevel === 'CRITICAL') badgeBg = 'bg-red-950/80 text-red-400 border-red-800/60';
          else if (defect.riskLevel === 'HIGH') badgeBg = 'bg-orange-950/80 text-orange-400 border-orange-800/60';
          else if (defect.riskLevel === 'MEDIUM') badgeBg = 'bg-yellow-950/80 text-yellow-400 border-yellow-800/60';

          return (
            <div
              key={defect.id}
              onClick={() => onSelectDefect(defect)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-slate-850 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={defect.thumbnailUrl}
                  alt={defect.defectClass}
                  className="w-14 h-14 rounded-lg object-cover border border-slate-700/80"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badgeBg}`}>
                      {defect.riskLevel} ({defect.riskScore}/100)
                    </span>
                    <span className="text-[11px] text-slate-400 capitalize">• {defect.assetType}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">{defect.title}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <span>📍 {defect.assetName}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-extrabold text-cyan-400 font-['Outfit']">
                  ₹{defect.costEstimation?.total_estimated_cost?.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Vol: {defect.volumetric?.volume_m3 || 0} m³
                </p>
                <button className="mt-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 ml-auto">
                  <Eye className="w-3 h-3" /> View 3D
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
