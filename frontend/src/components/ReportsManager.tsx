import React from 'react';
import { Defect } from '../types';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';
import { useToast } from './ToastNotification';

interface ReportsManagerProps {
  defects: Defect[];
}

export const ReportsManager: React.FC<ReportsManagerProps> = ({ defects }) => {
  const { addToast } = useToast();

  const handleDownloadPdf = (defectId: string) => {
    window.open(`http://localhost:5002/api/reports/pdf/${defectId}`, '_blank');
    addToast('info', 'PDF Generation Triggered', `Downloading formal audit document for defect #${defectId}`);
  };

  const handleExportCSV = () => {
    const headers = ['Defect ID', 'Title', 'Location', 'Risk Level', 'Risk Score', 'Volume (m3)', 'Max Depth (cm)', 'Est Repair Cost (INR)', 'Status'];
    const rows = defects.map(d => [
      d.id,
      `"${d.title.replace(/"/g, '""')}"`,
      `"${d.locationName.replace(/"/g, '""')}"`,
      d.riskLevel,
      d.riskScore,
      d.volumetric?.volume_m3 || 0,
      d.volumetric?.max_depth_cm || 0,
      d.costEstimation?.total_estimated_cost || 0,
      d.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Drone_Inspection_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'CSV Export Complete', 'All defect records exported to spreadsheet format');
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header Banner */}
      <div className="app-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-[var(--brand-primary)]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono flex items-center gap-2">
              AUTOMATED AI AUDIT & REPORT GENERATOR
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">Civil engineering compliance reports with 3D volumetric metrics & material BOM costs</p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-bold text-xs transition-all shadow-xs active:scale-95"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-[var(--status-success)]" />
          <span>Export CSV Master Log</span>
        </button>
      </div>

      {/* PDF Reports Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {defects.map((defect) => (
          <div
            key={defect.id}
            className="app-card p-4 space-y-3 font-sans hover:border-[var(--border-strong)] transition-all"
          >
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-bold text-[10px] border border-[var(--brand-primary)]/20 font-mono">
                    #{defect.id}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase font-mono">{defect.assetType}</span>
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">{defect.title}</h3>
                <p className="text-xs text-[var(--text-secondary)]">📍 {defect.locationName}</p>
              </div>

              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono ${
                  defect.riskLevel === 'CRITICAL'
                    ? 'bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical-border)]'
                    : 'bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[var(--status-warning-border)]'
                }`}
              >
                {defect.riskLevel}
              </span>
            </div>

            {/* Metrics preview */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-[var(--bg-elevated)] p-3 rounded-xl border border-[var(--border-subtle)] font-mono">
              <div>
                <span className="text-[var(--text-muted)] text-[10px] block font-semibold">DEFECT VOLUME</span>
                <span className="text-[var(--brand-primary)] font-bold text-sm">{defect.volumetric?.volume_m3 || 0} m³</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] text-[10px] block font-semibold">MAX DEPTH</span>
                <span className="text-[var(--status-critical)] font-bold text-sm">{defect.volumetric?.max_depth_cm || 0} cm</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[var(--text-secondary)] text-[11px] font-semibold">ESTIMATED REPAIR COST</span>
                <span className="text-[var(--text-primary)] font-bold text-xs">₹{(defect.costEstimation?.total_estimated_cost || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={() => handleDownloadPdf(defect.id)}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold text-xs transition-all uppercase tracking-wider font-mono shadow-xs active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Audit Report</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
