import React, { useState } from 'react';
import { X, Plane, Upload, Play, CheckCircle2, Cpu, Sparkles } from 'lucide-react';
import { Defect } from '../types';

interface AirSimUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (defect: Defect) => void;
}

export const AirSimUploadModal: React.FC<AirSimUploadModalProps> = ({ isOpen, onClose, onScanComplete }) => {
  if (!isOpen) return null;

  const [assetType, setAssetType] = useState<'road' | 'bridge' | 'railway' | 'building'>('road');
  const [assetName, setAssetName] = useState('NH-48 Golden Quadrilateral (Km 104)');
  const [locationName, setLocationName] = useState('Surat, Gujarat');
  const [scanning, setScanning] = useState(false);
  const [stepText, setStepText] = useState('');

  const handleLaunchScan = async () => {
    setScanning(true);
    setStepText(' Connecting to Microsoft AirSim Drone Simulator...');

    setTimeout(() => {
      setStepText(' Capturing Stereo RGB & Depth Map Telemetry (GPS 21.1702° N, 72.8311° E)...');
    }, 1000);

    setTimeout(() => {
      setStepText(' Executing YOLOv8 Segmentation & OpenCV CLAHE Pre-processing...');
    }, 2200);

    setTimeout(() => {
      setStepText(' Extracting Open3D Volumetric Depth & Civil Repair Math...');
    }, 3400);

    try {
      const res = await fetch('http://localhost:5002/api/defects/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetName,
          assetType,
          locationName,
          lat: 21.1702,
          lng: 72.8311,
          altitude: 30.0,
          inspectorName: "Autonomous AirSim Drone v2.4"
        })
      });

      const json = await res.json();
      setTimeout(() => {
        setScanning(false);
        if (json.success && json.data) {
          onScanComplete(json.data);
          onClose();
        }
      }, 4200);
    } catch (e) {
      setTimeout(() => {
        setScanning(false);
        onClose();
      }, 4200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070B]/85 backdrop-blur-xl animate-fade-in font-['Inter',sans-serif]">
      <div className="relative w-full max-w-lg glass-panel-cyan rounded-2xl overflow-hidden border border-cyan-500/30 p-5 space-y-4 hud-border shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Plane className="w-4 h-4 transform -rotate-45" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-100 font-mono uppercase tracking-wider">AirSim Mission Ingestion</h3>
              <p className="text-[11px] text-slate-400">Autonomous AI Volumetric Inspection Pipeline</p>
            </div>
          </div>
          
          <button onClick={onClose} className="p-1.5 rounded-lg bg-[#05070B] text-slate-400 hover:text-white border border-white/[0.08]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {!scanning ? (
          <div className="space-y-3.5 font-mono text-xs">
            
            {/* Target Asset Type */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                1. SELECT ASSET CLASS
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'road', label: 'Road / Highway', desc: 'Pothole Volume' },
                  { id: 'bridge', label: 'Bridge Girder', desc: 'Steel Corrosion' },
                  { id: 'railway', label: 'Railway Track', desc: 'Alignment & Crack' },
                  { id: 'building', label: 'Public Building', desc: 'Facade Seepage' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAssetType(item.id as any)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      assetType === item.id
                        ? 'bg-[#0F1726] border-cyan-500 text-slate-100 shadow-md shadow-cyan-500/10'
                        : 'bg-[#05070B] border-white/[0.06] text-slate-400 hover:bg-[#0F1726]/60'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-100">{item.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  2. INFRASTRUCTURE TARGET NAME
                </label>
                <input
                  type="text"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full bg-[#05070B] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  3. GEO-LOCATION CITY/STATE
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-[#05070B] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleLaunchScan}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-aerospace-950 font-extrabold text-xs rounded-lg shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2 mt-2 uppercase tracking-wider"
            >
              <Play className="w-4 h-4 fill-aerospace-950" />
              <span>EXECUTE AIRSIM SCAN MISSION</span>
            </button>

          </div>
        ) : (
          /* Scanning Progress View */
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 font-mono">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <Cpu className="w-5 h-5 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">AIRSIM AI PIPELINE ACTIVE</h4>
              <p className="text-[11px] text-cyan-400 mt-1">{stepText}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

