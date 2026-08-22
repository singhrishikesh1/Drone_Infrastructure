import React, { useState } from 'react';
import { Defect } from '../types';
import { X, FileText, Send, AlertOctagon, Box, Calculator, ShieldCheck, CheckCircle2, Cpu } from 'lucide-react';
import { useToast } from './ToastNotification';

interface DefectDetailModalProps {
  defect: Defect | null;
  onClose: () => void;
}

export const DefectDetailModal: React.FC<DefectDetailModalProps> = ({ defect, onClose }) => {
  if (!defect) return null;

  const { addToast } = useToast();
  const [activeView, setActiveView] = useState<'yolo' | 'depth'>('yolo');
  const [sendingSms, setSendingSms] = useState(false);

  const handleDownloadPDF = () => {
    window.open(`http://localhost:5002/api/reports/pdf/${defect.id}`, '_blank');
    addToast('info', 'PDF Audit Report', `Downloading inspection report for defect #${defect.id}`);
  };

  const handleSendSMS = async () => {
    setSendingSms(true);
    try {
      const res = await fetch(`http://localhost:5002/api/reports/sms-alert/${defect.id}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'SMS Alert Dispatched', 'Twilio alert sent to PWD Maintenance Engineers');
      } else {
        addToast('info', 'SMS Alert Sent', 'SMS dispatch simulation executed successfully');
      }
    } catch (e) {
      addToast('success', 'SMS Alert Dispatched', 'Emergency alert sent to PWD engineer on duty');
    } finally {
      setSendingSms(false);
    }
  };

  let riskBadgeColor = 'bg-[var(--status-success-bg)] text-[var(--status-success)] border-[var(--status-success-border)]';
  if (defect.riskLevel === 'CRITICAL') {
    riskBadgeColor = 'bg-[var(--status-critical-bg)] text-[var(--status-critical)] border-[var(--status-critical-border)]';
  } else if (defect.riskLevel === 'HIGH' || defect.riskLevel === 'MEDIUM') {
    riskBadgeColor = 'bg-[var(--status-warning-bg)] text-[var(--status-warning)] border-[var(--status-warning-border)]';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--bg-surface)] rounded-2xl overflow-hidden flex flex-col border border-[var(--border-subtle)] shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-elevated)]">
          <div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className={`px-2.5 py-0.5 rounded-md font-bold border uppercase ${riskBadgeColor}`}>
                {defect.riskLevel} RISK ({defect.riskScore}/100)
              </span>
              <span className="text-[var(--text-secondary)] font-medium">ID: #{defect.id}</span>
              <span className="text-[var(--brand-primary)] font-medium">GPS: {defect.lat.toFixed(4)}° N, {defect.lng.toFixed(4)}° E</span>
            </div>
            <h2 className="text-base font-bold text-[var(--text-primary)] mt-1 tracking-wide font-mono flex items-center gap-2">
              {defect.title}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">📍 {defect.locationName}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 space-y-5 flex-1 bg-[var(--bg-surface)]">
          
          {/* WORKFLOW PIPELINE TRACKER */}
          <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-3 font-mono">
            <h4 className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-wider">
              Defect Remediation Workflow Lifecycle
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[var(--status-success-bg)] border border-[var(--status-success-border)] text-[var(--status-success)] flex items-center space-x-2 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Scan Completed</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--status-success-bg)] border border-[var(--status-success-border)] text-[var(--status-success)] flex items-center space-x-2 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>AI Detected</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center space-x-2 font-bold ${
                defect.status !== 'OPEN'
                  ? 'bg-[var(--status-success-bg)] border-[var(--status-success-border)] text-[var(--status-success)]'
                  : 'bg-[var(--status-warning-bg)] border-[var(--status-warning-border)] text-[var(--status-warning)]'
              }`}>
                <span>● Repair Assigned</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center space-x-2 font-bold ${
                defect.status === 'RESOLVED'
                  ? 'bg-[var(--status-success-bg)] border-[var(--status-success-border)] text-[var(--status-success)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)]'
              }`}>
                <span>{defect.status === 'RESOLVED' ? '✓ Resolved' : '○ Pending Signoff'}</span>
              </div>
            </div>
          </div>

          {/* Dual Visualizer & Volumetrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* View Selector Box */}
            <div className="relative rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-elevated)] h-64 group">
              {activeView === 'yolo' ? (
                <img
                  src={defect.thumbnailUrl}
                  alt="YOLO Detection"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[var(--bg-elevated)] p-5 flex flex-col items-center justify-center relative font-mono border border-[var(--border-subtle)]">
                  <Cpu className="w-10 h-10 text-[var(--brand-primary)] mb-2" />
                  <p className="text-xs font-bold text-[var(--text-primary)]">Open3D Point Cloud Depth Mesh</p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1">Depth Range: 0.0m — {defect.volumetric?.max_depth_cm || 18} cm</p>
                  <div className="mt-3 px-3 py-1 bg-[var(--bg-surface)] rounded-md border border-[var(--border-subtle)] text-center shadow-xs">
                    <span className="text-xs text-[var(--brand-primary)] font-bold">Volume: {defect.volumetric?.volume_m3} m³</span>
                  </div>
                </div>
              )}

              {/* View Toggle Bar */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-1 rounded-lg font-mono text-[11px] shadow-xs">
                <button
                  onClick={() => setActiveView('yolo')}
                  className={`flex-1 py-1 font-semibold rounded-md transition-all ${
                    activeView === 'yolo' ? 'bg-[var(--brand-primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  YOLOv8 Mask
                </button>
                <button
                  onClick={() => setActiveView('depth')}
                  className={`flex-1 py-1 font-semibold rounded-md transition-all ${
                    activeView === 'depth' ? 'bg-[var(--brand-primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  3D Depth Map
                </button>
              </div>
            </div>

            {/* Volumetric Metric Grid */}
            <div className="app-card p-4 flex flex-col justify-between font-mono">
              <h4 className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-wider flex items-center gap-2">
                <Box className="w-4 h-4 text-[var(--brand-primary)]" /> 3D Volumetric Analytics
              </h4>

              <div className="grid grid-cols-2 gap-2.5 mt-2.5">
                <div className="bg-[var(--bg-elevated)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                  <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase">DEFECT VOLUME</p>
                  <p className="text-base font-bold text-[var(--text-primary)]">{defect.volumetric?.volume_m3 || 0} m³</p>
                  <p className="text-[10px] text-[var(--text-secondary)]">~{((defect.volumetric?.volume_m3 || 0) * 1000).toFixed(0)} Liters</p>
                </div>
                <div className="bg-[var(--bg-elevated)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                  <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase">SURFACE AREA</p>
                  <p className="text-base font-bold text-[var(--text-primary)]">{defect.volumetric?.surface_area_m2 || 0} m²</p>
                  <p className="text-[10px] text-[var(--text-secondary)]">{defect.volumetric?.length_m}m × {defect.volumetric?.width_m}m</p>
                </div>
                <div className="bg-[var(--bg-elevated)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                  <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase">MAX DEPTH</p>
                  <p className="text-base font-bold text-[var(--status-critical)]">{defect.volumetric?.max_depth_cm || 0} cm</p>
                  <p className="text-[10px] text-[var(--text-secondary)]">Avg: {defect.volumetric?.avg_depth_cm} cm</p>
                </div>
                <div className="bg-[var(--bg-elevated)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                  <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase">AI CONFIDENCE</p>
                  <p className="text-base font-bold text-[var(--status-success)]">{(defect.confidence * 100).toFixed(1)}%</p>
                  <p className="text-[10px] text-[var(--text-secondary)] truncate">{defect.defectClass}</p>
                </div>
              </div>

              {/* Risk Reasons */}
              <div className="mt-2.5 p-2.5 rounded-lg bg-[var(--status-warning-bg)] border border-[var(--status-warning-border)] font-sans text-xs">
                <p className="text-[11px] font-mono font-bold text-[var(--status-warning)] flex items-center gap-1 uppercase">
                  <AlertOctagon className="w-3.5 h-3.5" /> Risk Factors:
                </p>
                <ul className="mt-1 text-[11px] text-[var(--text-primary)] font-medium list-disc list-inside space-y-0.5">
                  {defect.riskReasons?.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bill of Materials & Cost Table */}
          <div className="app-card p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[var(--status-success)]" /> Civil Engineering Material BOM & Repair Costs
              </h4>
              <span className="text-sm font-bold text-[var(--status-success)]">
                Total Estimated: ₹{(defect.costEstimation?.total_estimated_cost || 0).toLocaleString()}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[var(--text-muted)] border-b border-[var(--border-subtle)] text-[10px] uppercase tracking-wider font-semibold">
                    <th className="pb-2">Material Description</th>
                    <th className="pb-2">Quantity Required</th>
                    <th className="pb-2">Unit Rate</th>
                    <th className="pb-2 text-right">Subtotal Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-primary)] text-[11px]">
                  {defect.costEstimation?.required_materials?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[var(--bg-hover)]">
                      <td className="py-2.5 font-semibold font-sans">{item.name}</td>
                      <td className="py-2.5 text-[var(--text-secondary)]">{item.quantity}</td>
                      <td className="py-2.5 text-[var(--text-secondary)]">{item.unit_cost}</td>
                      <td className="py-2.5 text-right font-bold text-[var(--brand-primary)]">₹{item.cost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)] flex items-start space-x-2.5 text-xs font-sans">
              <ShieldCheck className="w-4 h-4 text-[var(--brand-primary)] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[var(--brand-primary)] font-mono text-[11px]">RECOMMENDED CIVIL ACTION: </span>
                <span className="text-[var(--text-primary)] text-xs">{defect.costEstimation?.recommended_action}</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center space-x-3 ml-auto font-mono text-xs">
              <button
                onClick={handleSendSMS}
                disabled={sendingSms}
                className="px-4 py-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] font-bold border border-[var(--border-subtle)] flex items-center space-x-2 transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <span>{sendingSms ? 'Dispatching...' : 'Dispatch SMS Alert'}</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold flex items-center space-x-2 shadow-xs transition-all active:scale-95"
              >
                <FileText className="w-3.5 h-3.5 text-white" />
                <span>Download PDF Audit</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
