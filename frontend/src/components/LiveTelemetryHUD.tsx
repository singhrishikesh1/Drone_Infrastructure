import React, { useState, useEffect } from 'react';
import { Battery, Navigation, Zap, Signal } from 'lucide-react';

export const LiveTelemetryHUD: React.FC = () => {
  const [telemetry, setTelemetry] = useState({
    battery: 88,
    altitude: 48.5,
    speed: 24.2,
    satellites: 18,
    signalDbm: -64,
    mode: 'AUTONOMOUS PATROL',
    sector: 'PUNE ROAD SECTOR 04',
    lat: 18.5679,
    lng: 73.9143
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        altitude: parseFloat((48.5 + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        speed: parseFloat((24.2 + (Math.random() * 0.8 - 0.4)).toFixed(1)),
        signalDbm: Math.floor(-64 + (Math.random() * 4 - 2)),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-3 rounded-2xl border border-[#FBCFE8] bg-[#FFFFFF] text-xs flex flex-wrap items-center justify-between gap-4 font-mono shadow-xs">
      {/* Active Unit Badge */}
      <div className="flex items-center space-x-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#E11D48] animate-pulse" />
        <span className="text-[#831843] font-extrabold tracking-wider text-[11px] uppercase flex items-center gap-1">
          UNIT: <span className="text-[#E11D48] font-bold">SKYGUARDIAN-X1</span> 🧸
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FFF1F2] text-[#E11D48] border border-[#F43F5E]/30 font-bold">
          RTK FIX (18 SAT) 💕
        </span>
      </div>

      {/* Dynamic Telemetry Metrics */}
      <div className="flex items-center space-x-5 overflow-x-auto text-[11px]">
        {/* Mode */}
        <div className="flex items-center space-x-1.5">
          <Zap className="w-3.5 h-3.5 text-[#16A34A]" />
          <span className="text-[#9D174D]">STATUS:</span>
          <span className="text-[#16A34A] font-extrabold">{telemetry.mode}</span>
        </div>

        {/* Coordinates */}
        <div className="flex items-center space-x-1.5">
          <Navigation className="w-3.5 h-3.5 text-[#E11D48]" />
          <span className="text-[#9D174D]">GPS:</span>
          <span className="text-[#831843] font-bold">{telemetry.lat}° N, {telemetry.lng}° E</span>
        </div>

        {/* Altitude */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[#9D174D]">ALT:</span>
          <span className="text-[#E11D48] font-extrabold">{telemetry.altitude}m</span>
        </div>

        {/* Speed */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[#9D174D]">SPD:</span>
          <span className="text-[#831843] font-extrabold">{telemetry.speed} km/h</span>
        </div>

        {/* Battery */}
        <div className="flex items-center space-x-1.5">
          <Battery className="w-3.5 h-3.5 text-[#16A34A]" />
          <span className="text-[#9D174D]">BATT:</span>
          <span className="text-[#16A34A] font-extrabold">{telemetry.battery}%</span>
        </div>

        {/* Signal Link */}
        <div className="flex items-center space-x-1.5">
          <Signal className="w-3.5 h-3.5 text-[#E11D48]" />
          <span className="text-[#9D174D]">LINK:</span>
          <span className="text-[#E11D48] font-extrabold">{telemetry.signalDbm} dBm</span>
        </div>
      </div>
    </div>
  );
};

