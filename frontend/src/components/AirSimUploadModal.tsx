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
          lat: 18.5679,
          lng: 73.9143,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08111A]/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-lg glass-panel-cyan rounded-2xl overflow-hidden border border-[#16B9E8]/30 p-5 space-y-4 hud-border shadow-2xl bg-[#101C28]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#152535] pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#16B9E8]/10 border border-[#16B9E8]/30 flex items-center justify-center text-[#16B9E8]">
              <Plane className="w-4 h-4 transform -rotate-45" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#F1F5F9] font-mono uppercase tracking-wider">AirSim Road Inspection</h3>
              <p className="text-[11px] text-[#94A3B8]">Autonomous AI Road Volumetric Scan Pipeline</p>
            </div>
          </div>
          
          <button onClick={onClose} className="p-1.5 rounded-lg bg-[#152535] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#152535]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {!scanning ? (
          <div className="space-y-3.5 font-mono text-xs">
            
            {/* Target Asset Type */}
            <div>
              <label className="block text-[11px] font-bold text-[#F1F5F9] uppercase tracking-wider mb-1.5">
                1. SELECT ASSET CLASS
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'road', label: 'Road / Highway', desc: 'Pothole & Surface Damage' },
                  { id: 'bridge', label: 'Bridge Structural', desc: 'Structural Crack' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAssetType(item.id as any)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      assetType === item.id
                        ? 'bg-[#152535] border-[#16B9E8] text-[#F1F5F9] font-bold'
                        : 'bg-[#08111A] border-[#152535] text-[#94A3B8] hover:bg-[#152535]/60'
                    }`}
                  >
                    <p className="text-xs font-bold text-[#F1F5F9]">{item.label}</p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[#F1F5F9] uppercase tracking-wider mb-1">
                  2. INFRASTRUCTURE TARGET NAME
                </label>
                <input
                  type="text"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full bg-[#08111A] border border-[#152535] rounded-lg px-3 py-1.5 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#16B9E8] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#F1F5F9] uppercase tracking-wider mb-1">
                  3. GEO-LOCATION CITY/STATE
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-[#08111A] border border-[#152535] rounded-lg px-3 py-1.5 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#16B9E8] font-mono"
                />
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleLaunchScan}
              className="w-full py-2.5 bg-[#16B9E8] hover:bg-[#38CBF3] text-[#08111A] font-extrabold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 mt-2 uppercase tracking-wider"
            >
              <Play className="w-4 h-4 fill-[#08111A]" />
              <span>EXECUTE AIRSIM SCAN MISSION</span>
            </button>

          </div>
        ) : (
          /* Scanning Progress View */
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 font-mono">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-[#16B9E8]/20 border-t-[#16B9E8] animate-spin" />
              <Cpu className="w-5 h-5 text-[#16B9E8] absolute inset-0 m-auto" />
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#F1F5F9] uppercase tracking-wider">AIRSIM AI ROAD SCANNER ACTIVE</h4>
              <p className="text-[11px] text-[#16B9E8] mt-1">{stepText}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};


