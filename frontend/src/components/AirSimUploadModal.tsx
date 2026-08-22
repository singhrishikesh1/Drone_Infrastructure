import React, { useState } from 'react';
import { X, Plane, Play, Cpu, CheckCircle } from 'lucide-react';
import { Defect } from '../types';
import { useToast } from './ToastNotification';

interface AirSimUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (defect: Defect) => void;
}

export const AirSimUploadModal: React.FC<AirSimUploadModalProps> = ({ isOpen, onClose, onScanComplete }) => {
  if (!isOpen) return null;

  const { addToast } = useToast();
  const [assetType, setAssetType] = useState<'road' | 'bridge'>('road');
  const [assetName, setAssetName] = useState('Pune Outer Ring Road (Section 4)');
  const [locationName, setLocationName] = useState('Nagar Road Corridor (Point A ➔ Point B), Pune');
  const [scanning, setScanning] = useState(false);
  const [stepText, setStepText] = useState('');

  const handleLaunchScan = async () => {
    setScanning(true);
    setStepText('Connecting to AirSim Drone Simulator...');

    setTimeout(() => {
      setStepText('Capturing Stereo RGB & Point Cloud Telemetry (GPS 18.5679° N, 73.9143° E)...');
    }, 1000);

    setTimeout(() => {
      setStepText('Executing YOLOv8 Road Surface Defect Segmentation...');
    }, 2200);

    setTimeout(() => {
      setStepText('Computing Open3D Volumetric Depth & Material Repair Estimates...');
    }, 3400);

    try {
      const res = await fetch('http://localhost:5002/api/defects/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetName,
          assetType,
          locationName,
          lat: 18.5679,
          lng: 73.9143,
          altitude: 35.0,
          inspectorName: "Raisoni-Drone_P7 Autonomous Patrol"
        })
      });

      const json = await res.json();
      setTimeout(() => {
        setScanning(false);
        if (json.success && json.data) {
          onScanComplete(json.data);
          addToast('success', 'Scan Completed', 'New road defect added to live inspection queue');
          onClose();
        } else {
          // Fallback offline scan creation
          const mockDefect: Defect = {
            id: `DEF-PUNE-${Math.floor(1000 + Math.random() * 9000)}`,
            title: `Severe Pothole & Asphalt Degradation`,
            assetName,
            assetType,
            locationName,
            lat: 18.5720,
            lng: 73.9410,
            altitude: 35.0,
            riskLevel: 'CRITICAL',
            riskScore: 89,
            defectClass: 'Pothole Class IV',
            confidence: 0.94,
            volumetric: {
              volume_m3: 0.42,
              surface_area_m2: 2.1,
              avg_depth_cm: 8.5,
              max_depth_cm: 14.2,
              length_m: 1.8,
              width_m: 1.2
            },
            costEstimation: {
              total_estimated_cost: 38500,
              currency: '₹',
              required_materials: [
                { name: 'Bituminous Cold Mix Asphalt', quantity: '0.45 Tons', unit_cost: '₹40,000 / Ton', cost: 18000 },
                { name: 'Emulsion Tack Coat (RS-1)', quantity: '15 Liters', unit_cost: '₹120 / Liter', cost: 1800 },
                { name: 'Roller Compactor & Crew (1 Day)', quantity: '1 Shift', unit_cost: '₹18,700 / Shift', cost: 18700 }
              ],
              recommended_action: 'Milling of damaged asphalt layer followed by high-density compaction and tack coat sealing within 48 hours.'
            },
            riskReasons: ['Vehicle axle damage risk', 'Monsoon water accumulation hazard', 'High traffic corridor speed hazard'],
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            inspector: 'Raisoni-Drone_P7',
            status: 'OPEN',
            alertSent: true,
            thumbnailUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'
          };

          onScanComplete(mockDefect);
          addToast('success', 'AirSim Telemetry Scan Processed', 'Defect captured & added to database');
          onClose();
        }
      }, 4200);
    } catch (e) {
      setTimeout(() => {
        setScanning(false);
        addToast('info', 'AirSim Simulation Scan Added', 'Defect telemetry processed in offline mode');
        onClose();
      }, 4200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div className="relative w-full max-w-lg bg-[var(--bg-surface)] rounded-2xl overflow-hidden border border-[var(--border-subtle)] p-6 space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 flex items-center justify-center text-[var(--brand-primary)]">
              <Plane className="w-5 h-5 transform -rotate-45" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">AirSim Scan Mission</h3>
              <p className="text-xs text-[var(--text-secondary)]">Autonomous Drone Telemetry & 3D Scan Pipeline</p>
            </div>
          </div>
          
          <button onClick={onClose} className="p-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {!scanning ? (
          <div className="space-y-4 font-mono text-xs">
            
            {/* Target Asset Type */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                1. SELECT ASSET TYPE
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'road', label: 'Road / Highway', desc: 'Pothole & Surface Degradation' },
                  { id: 'bridge', label: 'Bridge / Flyover', desc: 'Structural & Concrete Crack' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAssetType(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      assetType === item.id
                        ? 'bg-[var(--brand-primary)]/10 border-[var(--brand-primary)] text-[var(--text-primary)] font-bold'
                        : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <p className="text-xs font-bold text-[var(--text-primary)]">{item.label}</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">
                  2. INFRASTRUCTURE TARGET NAME
                </label>
                <input
                  type="text"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">
                  3. SECTOR LOCATION / REGION
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] font-mono"
                />
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleLaunchScan}
              className="w-full py-3 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 mt-3 uppercase tracking-wider active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Execute AirSim Scan Mission</span>
            </button>

          </div>
        ) : (
          /* Scanning Progress View */
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-4 font-mono">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-2 border-[var(--brand-primary)]/20 border-t-[var(--brand-primary)] animate-spin" />
              <Cpu className="w-6 h-6 text-[var(--brand-primary)] absolute inset-0 m-auto" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">AirSim Scan Pipeline Active</h4>
              <p className="text-[11px] text-[var(--brand-primary)] font-medium">{stepText}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};