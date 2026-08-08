import React from 'react';
import { Defect } from '../types';
import { FileText, Download, ShieldAlert, Cpu, Calendar, CheckCircle2, FileCheck } from 'lucide-react';

interface ReportsManagerProps {
  defects: Defect[];
}

export const ReportsManager: React.FC<ReportsManagerProps> = ({ defects }) => {
  const handleDownloadPdf = (defectId: string) => {
    window.open(`http://localhost:5002/api/reports/pdf/${defectId}`, '_blank');
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Header Banner */}
      <div className="glass-panel p-4 rounded-xl border border-white/[0.08] bg-[#0A0F17]/90 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hud-border">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <FileText className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              AUTOMATED AI INSPECTION PDF AUDIT REPORTS
              <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono font-bold">
                PDFKIT BACKEND GENERATOR
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">Civil Engineering Inspection Reports with 3D Volumetric Measurements & BOM Costs</p>
          </div>
        </div>
      </div>

      {/* PDF Reports Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {defects.map((defect) => (
          <div
            key={defect.id}
            className="glass-panel p-4 rounded-xl border border-white/[0.08] bg-[#0A0F17]/90 hover:border-slate-700 transition-all space-y-3 shadow-xl"
          >
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold text-[10px] border border-cyan-500/20">
                    {defect.id}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{defect.assetType}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-100 font-sans">{defect.title}</h3>
                <p className="text-[11px] text-slate-400 font-sans">📍 {defect.locationName}</p>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  defect.riskLevel === 'CRITICAL'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/30 animate-pulse'
                    : defect.riskLevel === 'HIGH'
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                {defect.riskLevel}
              </span>
            </div>

            {/* Metrics preview */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-[#05070B] p-2.5 rounded-lg border border-white/[0.06]">
              <div>
                <span className="text-slate-500 text-[10px] block">DEFECT VOLUME</span>
                <span className="text-cyan-300 font-bold">{defect.volumetric?.volume_m3 || 0} m³</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">MAX DEPTH</span>
                <span className="text-emerald-400 font-bold">{defect.volumetric?.max_depth_cm || 0} cm</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">ESTIMATED REPAIR COST</span>
                <span className="text-slate-100 font-bold text-xs">₹{defect.costEstimation?.total_estimated_cost?.toLocaleString()}</span>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={() => handleDownloadPdf(defect.id)}
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-aerospace-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all uppercase tracking-wider"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD PDF AUDIT REPORT</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

