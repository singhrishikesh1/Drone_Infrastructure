import React, { useState, useEffect } from 'react';
import { Battery, Navigation, Radio, Cpu, ShieldCheck, Zap, Signal } from 'lucide-react';

export const LiveTelemetryHUD: React.FC = () => {
  const [telemetry, setTelemetry] = useState({
    battery: 88,
    altitude: 48.5,
    speed: 24.2,
    satellites: 18,
    signalDbm: -64,
    mode: 'AUTONOMOUS PATROL',
    sector: 'PUNE SECTOR 04',
    lat: 18.5679,
    lng: 73.9143
  });

  // Oscillate numbers slightly for dynamic live telemetry effect
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
    <div className="glass-panel p-3 rounded-xl border border-white/[0.08] bg-[#0A0F17]/90 text-xs flex flex-wrap items-center justify-between gap-4 font-mono shadow-xl">
      {/* Active Unit Badge */}
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-slate-300 font-bold tracking-wider text-[11px] uppercase">
          UNIT: <span className="text-cyan-400">SKYGUARDIAN-X1</span>
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          RTK FIX (18 SAT)
        </span>
      </div>

      {/* Dynamic Telemetry Metrics */}
      <div className="flex items-center space-x-5 overflow-x-auto text-[11px]">
        {/* Mode */}
        <div className="flex items-center space-x-1.5">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">STATUS:</span>
          <span className="text-emerald-400 font-bold">{telemetry.mode}</span>
        </div>

        {/* Coordinates */}
        <div className="flex items-center space-x-1.5">
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">GPS:</span>
          <span className="text-slate-200">{telemetry.lat}° N, {telemetry.lng}° E</span>
        </div>

        {/* Altitude */}
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400">ALT:</span>
          <span className="text-cyan-400 font-bold">{telemetry.altitude}m</span>
        </div>

        {/* Speed */}
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400">SPD:</span>
          <span className="text-slate-200 font-bold">{telemetry.speed} km/h</span>
        </div>

        {/* Battery */}
        <div className="flex items-center space-x-1.5">
          <Battery className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">BATT:</span>
          <span className="text-emerald-400 font-bold">{telemetry.battery}%</span>
        </div>

        {/* Signal Link */}
        <div className="flex items-center space-x-1.5">
          <Signal className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-slate-400">LINK:</span>
          <span className="text-purple-300 font-bold">{telemetry.signalDbm} dBm</span>
        </div>
      </div>
    </div>
  );
};
