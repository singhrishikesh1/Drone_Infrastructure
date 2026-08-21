import React, { useState } from 'react';
import { X, Plane, Play, Cpu } from 'lucide-react';
import { Defect } from '../types';

interface AirSimUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (defect: Defect) => void;
}

export const AirSimUploadModal: React.FC<AirSimUploadModalProps> = ({ isOpen, onClose, onScanComplete }) => {
  if (!isOpen) return null;

  const [assetType, setAssetType] = useState<'road' | 'bridge' | 'railway' | 'building'>('road');
  const [assetName, setAssetName] = useState('Highway 101 Outer Ring Road');
  const [locationName, setLocationName] = useState('Pune, Maharashtra');
  const [scanning, setScanning] = useState(false);
  const [stepText, setStepText] = useState('');

  const handleLaunchScan = async () => {
    setScanning(true);
    setStepText(' Connecting to AirSim Drone Simulator...');

    setTimeout(() => {
      setStepText(' Capturing Stereo RGB & Depth Map Telemetry (GPS 18.5679° N, 73.9143° E)...');
    }, 1000);

    setTimeout(() => {
      setStepText(' Executing YOLOv8 Road Defect Segmentation & CLAHE Pre-processing...');
    }, 2200);

    setTimeout(() => {
      setStepText(' Extracting Open3D Volumetric Depth & Road Repair Math...');
    }, 3400);

    try {
      const res = await fetch('http://localhost:5002/api/defects/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetName,
          assetType,
          locationName,
          lat: 18.1234,
          lng: 73.5678,
          altitude: 30.0,
          inspectorName: "Autonomous AirSim Drone SkyGuardian-X1"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#831843]/40 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-lg glass-panel-cyan rounded-2xl overflow-hidden border border-[#E11D48]/30 p-5 space-y-4 hud-border shadow-2xl bg-[#FFFFFF]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#FBCFE8] pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFF1F2] border border-[#F43F5E]/30 flex items-center justify-center text-[#E11D48]">
              <Plane className="w-4 h-4 transform -rotate-45" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#831843] font-mono uppercase tracking-wider flex items-center gap-1">AirSim Road Inspection 🧸</h3>
              <p className="text-[11px] text-[#9D174D]">Autonomous AI Road Volumetric Scan Pipeline</p>
            </div>
          </div>
          
          <button onClick={onClose} className="p-1.5 rounded-lg bg-[#FDF2F8] text-[#9D174D] hover:text-[#831843] border border-[#FBCFE8]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {!scanning ? (
          <div className="space-y-3.5 font-mono text-xs">
            
            {/* Target Asset Type */}
            <div>
              <label className="block text-[11px] font-bold text-[#831843] uppercase tracking-wider mb-1.5">
                1. SELECT ASSET CLASS 💕
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'road', label: 'Road / Highway', desc: 'Pothole & Surface Damage' },
                  { id: 'bridge', label: 'Bridge Structural', desc: 'Structural Crack' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAssetType(item.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      assetType === item.id
                        ? 'bg-[#FFF1F2] border-[#E11D48] text-[#831843] font-extrabold shadow-xs'
                        : 'bg-[#FDF2F8] border-[#FBCFE8] text-[#9D174D] hover:bg-[#FCE7F3]'
                    }`}
                  >
                    <p className="text-xs font-bold text-[#831843]">{item.label}</p>
                    <p className="text-[10px] text-[#9D174D] mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[#831843] uppercase tracking-wider mb-1">
                  2. INFRASTRUCTURE TARGET NAME
                </label>
                <input
                  type="text"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full bg-[#FDF2F8] border border-[#FBCFE8] rounded-xl px-3 py-2 text-xs text-[#831843] font-bold focus:outline-none focus:border-[#E11D48] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#831843] uppercase tracking-wider mb-1">
                  3. GEO-LOCATION CITY/STATE
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-[#FDF2F8] border border-[#FBCFE8] rounded-xl px-3 py-2 text-xs text-[#831843] font-bold focus:outline-none focus:border-[#E11D48] font-mono"
                />
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleLaunchScan}
              className="w-full py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 mt-2 uppercase tracking-wider active:scale-95"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              <span>EXECUTE AIRSIM SCAN MISSION 💕</span>
            </button>

          </div>
        ) : (
          /* Scanning Progress View */
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 font-mono">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-[#E11D48]/20 border-t-[#E11D48] animate-spin" />
              <Cpu className="w-5 h-5 text-[#E11D48] absolute inset-0 m-auto" />
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#831843] uppercase tracking-wider">AIRSIM AI ROAD SCANNER ACTIVE 🧸</h4>
              <p className="text-[11px] text-[#E11D48] font-bold mt-1">{stepText}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};


