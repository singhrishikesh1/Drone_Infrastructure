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
      setStepText(' Running YOLOv8 Segmentation & OpenCV CLAHE Pre-processing...');
    }, 2200);

    setTimeout(() => {
      setStepText(' Executing Open3D 3D Volumetric Depth Extraction & BOM Cost Math...');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel-glow rounded-3xl overflow-hidden border border-cyan-500/40 p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Plane className="w-5 h-5 transform -rotate-45" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">AirSim Drone Simulator & Data Ingestion</h3>
              <p className="text-xs text-slate-400">Trigger Real-Time AI Volumetric Inspection Mission</p>
            </div>
          </div>
          
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!scanning ? (
          <div className="space-y-4">
            
            {/* Target Asset Type */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                1. Select Asset Class
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
                    className={`p-3 rounded-xl border text-left transition-all ${
                      assetType === item.id
                        ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850'
                    }`}
                  >
                    <p className="text-xs font-bold">{item.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Asset Name & Location Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  2. Infrastructure Target Name
                </label>
                <input
                  type="text"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  3. Geo-Location City/State
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Simulated Live Flight Notice */}
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-900/40 flex items-center space-x-3 text-xs text-cyan-300">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>Connects to local AirSim API or streams synthetic high-resolution stereo RGB+Depth payload.</span>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleLaunchScan}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Execute AirSim Scan Mission</span>
            </button>

          </div>
        ) : (
          /* Scanning Progress View */
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
              <Cpu className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-white font-['Outfit']">AirSim AI Pipeline Active</h4>
              <p className="text-xs text-cyan-400 mt-1 font-mono">{stepText}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
