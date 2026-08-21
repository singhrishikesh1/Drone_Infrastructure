import React from 'react';
import { Defect } from '../types';
import { FileText, Download } from 'lucide-react';

interface ReportsManagerProps {
  defects: Defect[];
}

export const ReportsManager: React.FC<ReportsManagerProps> = ({ defects }) => {
  const handleDownloadPdf = (defectId: string) => {
    window.open(`http://localhost:5002/api/reports/pdf/${defectId}`, '_blank');
  };

  return (
    <div className="space-y-4 font-mono text-xs font-sans">
      {/* Header Banner */}
      <div className="glass-panel p-4 rounded-2xl border border-[#FBCFE8] bg-[#FFFFFF] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hud-border font-mono">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFF1F2] border border-[#F43F5E]/30 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#E11D48]" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#831843] uppercase tracking-wider flex items-center gap-2">
              AUTOMATED AI INSPECTION AUDIT REPORTS 🧸
              <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#FFF1F2] text-[#E11D48] border border-[#F43F5E]/30 font-mono font-bold">
                PDF GENERATOR 💕
              </span>
            </h2>
            <p className="text-[11px] text-[#9D174D] font-sans">Civil Engineering Inspection Reports with 3D Volumetric Measurements & BOM Costs</p>
          </div>
        </div>
      </div>

      {/* PDF Reports Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {defects.map((defect) => (
          <div
            key={defect.id}
            className="glass-panel p-4 rounded-2xl border border-[#FBCFE8] bg-[#FFFFFF] hover:border-[#E11D48]/30 transition-all space-y-3 shadow-xs font-sans"
          >
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="px-1.5 py-0.5 rounded-md bg-[#FFF1F2] text-[#E11D48] font-bold text-[10px] border border-[#F43F5E]/20 font-mono">
                    {defect.id}
                  </span>
                  <span className="text-[10px] font-bold text-[#9D174D] uppercase font-mono">{defect.assetType}</span>
                </div>
                <h3 className="text-sm font-extrabold text-[#831843]">{defect.title}</h3>
                <p className="text-[11px] text-[#9D174D]">📍 {defect.locationName}</p>
              </div>

              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold font-mono ${
                  defect.riskLevel === 'CRITICAL'
                    ? 'bg-[#FFF1F2] text-[#E11D48] border border-[#F43F5E]/30'
                    : 'bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/30'
                }`}
              >
                {defect.riskLevel}
              </span>
            </div>

            {/* Metrics preview */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-[#FDF2F8] p-2.5 rounded-xl border border-[#FBCFE8] font-mono">
              <div>
                <span className="text-[#9D174D] text-[10px] block font-bold">DEFECT VOLUME</span>
                <span className="text-[#E11D48] font-extrabold">{defect.volumetric?.volume_m3 || 0} m³</span>
              </div>
              <div>
                <span className="text-[#9D174D] text-[10px] block font-bold">MAX DEPTH</span>
                <span className="text-[#16A34A] font-extrabold">{defect.volumetric?.max_depth_cm || 0} cm</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-[#FBCFE8] flex items-center justify-between">
                <span className="text-[#9D174D] text-[11px] font-bold">ESTIMATED REPAIR COST</span>
                <span className="text-[#831843] font-extrabold text-xs">₹{defect.costEstimation?.total_estimated_cost?.toLocaleString()}</span>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={() => handleDownloadPdf(defect.id)}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold text-xs transition-all uppercase tracking-wider font-mono shadow-xs active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD PDF AUDIT REPORT 💕</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


