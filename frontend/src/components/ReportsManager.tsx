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
      <div className="glass-panel p-4 rounded-xl border border-[#152535] bg-[#101C28] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hud-border font-mono">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#16B9E8]/10 border border-[#16B9E8]/30 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#16B9E8]" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#F1F5F9] uppercase tracking-wider flex items-center gap-2">
              AUTOMATED AI INSPECTION AUDIT REPORTS
              <span className="text-[9px] px-2 py-0.5 rounded bg-[#16B9E8]/10 text-[#16B9E8] border border-[#16B9E8]/30 font-mono font-bold">
                PDF GENERATOR
              </span>
            </h2>
            <p className="text-[11px] text-[#94A3B8] font-sans">Civil Engineering Inspection Reports with 3D Volumetric Measurements & BOM Costs</p>
          </div>
        </div>
      </div>

      {/* PDF Reports Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {defects.map((defect) => (
          <div
            key={defect.id}
            className="glass-panel p-4 rounded-xl border border-[#152535] bg-[#101C28] hover:border-[#16B9E8]/30 transition-all space-y-3 shadow-md font-sans"
          >
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#16B9E8]/10 text-[#16B9E8] font-bold text-[10px] border border-[#16B9E8]/20 font-mono">
                    {defect.id}
                  </span>
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase font-mono">{defect.assetType}</span>
                </div>
                <h3 className="text-sm font-bold text-[#F1F5F9]">{defect.title}</h3>
                <p className="text-[11px] text-[#94A3B8]">📍 {defect.locationName}</p>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  defect.riskLevel === 'CRITICAL'
                    ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30'
                    : 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30'
                }`}
              >
                {defect.riskLevel}
              </span>
            </div>

            {/* Metrics preview */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-[#152535] p-2.5 rounded-lg border border-[#152535] font-mono">
              <div>
                <span className="text-[#94A3B8] text-[10px] block">DEFECT VOLUME</span>
                <span className="text-[#16B9E8] font-bold">{defect.volumetric?.volume_m3 || 0} m³</span>
              </div>
              <div>
                <span className="text-[#94A3B8] text-[10px] block">MAX DEPTH</span>
                <span className="text-[#22C55E] font-bold">{defect.volumetric?.max_depth_cm || 0} cm</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-[#101C28] flex items-center justify-between">
                <span className="text-[#94A3B8] text-[11px]">ESTIMATED REPAIR COST</span>
                <span className="text-[#F1F5F9] font-bold text-xs">₹{defect.costEstimation?.total_estimated_cost?.toLocaleString()}</span>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={() => handleDownloadPdf(defect.id)}
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg bg-[#16B9E8] hover:bg-[#38CBF3] text-[#08111A] font-extrabold text-xs transition-all uppercase tracking-wider font-mono"
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


