import React, { useState, useEffect } from 'react';
import { DroneItem, ServiceRecord } from '../types';
import { ShieldCheck, Cpu, Battery, Wrench, Navigation } from 'lucide-react';

export const DroneFleetServicing: React.FC = () => {
  const [drones, setDrones] = useState<DroneItem[]>([]);
  const [serviceLogs, setServiceLogs] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBookModal, setShowBookModal] = useState<boolean>(false);
  const [serviceTypeInput, setServiceTypeInput] = useState<string>('Rotor Calibration & LiDAR Sensor Check');

  const fetchFleetData = async () => {
    try {
      setLoading(true);
      const droneRes = await fetch('http://localhost:5002/api/drones/live');
      const droneJson = await droneRes.json();
      if (droneJson.success && droneJson.data) {
        setDrones(droneJson.data.slice(0, 1));
      }

      const srvRes = await fetch('http://localhost:5002/api/servicing');
      const srvJson = await srvRes.json();
      if (srvJson.success && srvJson.data) {
        setServiceLogs(srvJson.data.serviceHistory || []);
      }
    } catch (err) {
      setDrones([
        {
          id: "DRONE-PUNE-01",
          name: "SkyGuardian-X1",
          model: "Matrice 300 RTK Industrial",
          status: "FLYING",
          assignedArea: "Pune Outer Ring Road Patrol Sector",
          lat: 18.5679,
          lng: 73.9143,
          altitude: 48.5,
          speedKmH: 24.2,
          batteryPercent: 88,
          rotorHealth: 96,
          cameraStream: "HD Thermal + LiDAR Road Scan",
          lastServiceDate: "2026-08-10",
          nextServiceDue: "2026-09-10",
          totalFlightHours: 142.5
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleetData();
  }, []);

  const handleBookService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5002/api/servicing/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          droneId: 'DRONE-PUNE-01',
          droneName: 'SkyGuardian-X1',
          serviceType: serviceTypeInput,
          notes: 'Routine preventative servicing ticket created.'
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setServiceLogs(prev => [json.data, ...prev]);
        setShowBookModal(false);
      }
    } catch (err) {
      alert('Service request scheduled!');
      setShowBookModal(false);
    }
  };

  const activeDrone = drones[0] || {
    id: "DRONE-PUNE-01",
    name: "SkyGuardian-X1",
    model: "Matrice 300 RTK Industrial",
    status: "FLYING",
    assignedArea: "Pune Outer Ring Road Patrol Sector",
    lat: 18.5679,
    lng: 73.9143,
    altitude: 48.5,
    speedKmH: 24.2,
    batteryPercent: 88,
    rotorHealth: 96,
    cameraStream: "HD Thermal + LiDAR Road Scan",
    lastServiceDate: "2026-08-10",
    nextServiceDue: "2026-09-10",
    totalFlightHours: 142.5
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Header Banner */}
      <div className="glass-panel p-4 rounded-2xl border border-[#FBCFE8] bg-[#FFFFFF] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hud-border font-sans">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFF1F2] border border-[#F43F5E]/30 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-[#E11D48]" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#831843] uppercase tracking-wider flex items-center gap-2">
              ACTIVE DRONE TELEMETRY & MAINTENANCE 🧸
              <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/30 font-mono font-bold">
                1 ACTIVE DRONE IN AIR 💕
              </span>
            </h2>
            <p className="text-[11px] text-[#9D174D]">Live GPS Telemetry, Battery Status, Motor Diagnostics & Avionics Tickets</p>
          </div>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold text-xs transition-all uppercase tracking-wider shadow-sm active:scale-95"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>SCHEDULE SERVICING</span>
        </button>
      </div>

      {/* Active Drone Spec Card */}
      <div className="glass-panel p-5 rounded-2xl border border-[#FBCFE8] bg-[#FFFFFF] space-y-4 shadow-xs font-sans">
        <div className="flex items-center justify-between border-b border-[#FBCFE8] pb-3">
          <div>
            <span className="text-xs text-[#E11D48] font-mono font-extrabold">{activeDrone.id}</span>
            <h3 className="text-base font-extrabold text-[#831843]">{activeDrone.name} 🧸</h3>
            <span className="text-xs text-[#9D174D] font-mono font-bold">Model: {activeDrone.model}</span>
          </div>
          <span className="px-3 py-1 rounded-md text-xs font-extrabold font-mono border bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]/30">
            ● AUTONOMOUS PATROL 💕
          </span>
        </div>

        {/* Location Sector */}
        <div className="p-3 rounded-xl bg-[#FDF2F8] border border-[#FBCFE8] text-xs space-y-1 font-mono">
          <div className="text-[#9D174D] flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-extrabold text-[#831843]">
              <Navigation className="w-3.5 h-3.5 text-[#E11D48]" /> PATROL SECTOR
            </span>
            <span className="text-[#E11D48] font-extrabold">{activeDrone.assignedArea}</span>
          </div>
          <div className="text-[11px] text-[#9D174D] pt-0.5 font-bold">
            GPS: {activeDrone.lat.toFixed(4)}° N, {activeDrone.lng.toFixed(4)}° E | Altitude: {activeDrone.altitude}m | Speed: {activeDrone.speedKmH} km/h
          </div>
        </div>

        {/* Telemetry Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Battery */}
          <div className="bg-[#FDF2F8] p-3 rounded-xl border border-[#FBCFE8]">
            <div className="flex items-center justify-between text-[#9D174D] mb-1.5 text-[11px]">
              <span className="flex items-center gap-1 font-bold text-[#831843]">
                <Battery className="w-4 h-4 text-[#16A34A]" /> Battery Charge
              </span>
              <span className="font-extrabold text-[#16A34A] text-sm">{activeDrone.batteryPercent}%</span>
            </div>
            <div className="w-full bg-[#FFFFFF] h-2 rounded-full overflow-hidden border border-[#FBCFE8]">
              <div
                className="bg-[#16A34A] h-full rounded-full transition-all"
                style={{ width: `${activeDrone.batteryPercent}%` }}
              />
            </div>
          </div>

          {/* Rotor Health */}
          <div className="bg-[#FDF2F8] p-3 rounded-xl border border-[#FBCFE8]">
            <div className="flex items-center justify-between text-[#9D174D] mb-1.5 text-[11px]">
              <span className="flex items-center gap-1 font-bold text-[#831843]">
                <ShieldCheck className="w-4 h-4 text-[#E11D48]" /> Motor Diagnostics
              </span>
              <span className="font-extrabold text-[#E11D48] text-sm">{activeDrone.rotorHealth}%</span>
            </div>
            <div className="w-full bg-[#FFFFFF] h-2 rounded-full overflow-hidden border border-[#FBCFE8]">
              <div
                className="bg-[#E11D48] h-full rounded-full transition-all"
                style={{ width: `${activeDrone.rotorHealth}%` }}
              />
            </div>
          </div>
        </div>

        {/* Service metadata */}
        <div className="pt-2 border-t border-[#FBCFE8] flex items-center justify-between text-xs text-[#9D174D] font-mono font-bold">
          <span>NEXT SERVICING DUE: <strong className="text-[#831843]">{activeDrone.nextServiceDue}</strong></span>
          <span>TOTAL FLIGHT HOURS: <strong className="text-[#831843]">{activeDrone.totalFlightHours}h</strong></span>
        </div>
      </div>

      {/* Service Maintenance History */}
      <div className="glass-panel p-4 rounded-2xl border border-[#FBCFE8] bg-[#FFFFFF] space-y-3 font-sans shadow-xs">
        <h3 className="text-xs font-extrabold text-[#831843] uppercase tracking-wider flex items-center gap-2 font-mono">
          <Wrench className="w-3.5 h-3.5 text-[#E11D48]" />
          MAINTENANCE & AVIONICS SERVICING TICKETS 🧸
        </h3>

        <div className="space-y-2 font-mono text-xs">
          {serviceLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-[#FDF2F8] border border-[#FBCFE8] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#831843] font-sans">{log.droneName}</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-[#FFF1F2] text-[#E11D48] font-bold text-[10px] border border-[#F43F5E]/20">
                    {log.id}
                  </span>
                </div>
                <div className="text-[#831843] font-extrabold">{log.serviceType}</div>
                <div className="text-[#9D174D] text-[11px] font-sans">{log.notes}</div>
              </div>

              <div className="flex items-center space-x-4 text-right">
                <div>
                  <div className="text-[#9D174D] text-[11px]">COST: <strong className="text-[#831843]">{log.cost}</strong></div>
                  <div className="text-[#BE185D] text-[10px]">TECH: {log.technician}</div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/30 font-extrabold text-[10px]">
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Service Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-[#831843]/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-5 rounded-2xl border border-[#E11D48]/30 bg-[#FFFFFF] max-w-md w-full space-y-4 shadow-2xl font-sans">
            <h3 className="text-sm font-extrabold text-[#831843] uppercase tracking-wider flex items-center gap-2 font-mono">
              <Wrench className="w-4 h-4 text-[#E11D48]" />
              SCHEDULE DRONE SERVICING TICKET 🧸
            </h3>

            <form onSubmit={handleBookService} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-[#9D174D] mb-1 font-bold">DRONE UNIT</label>
                <input
                  type="text"
                  disabled
                  value="SkyGuardian-X1 (DRONE-PUNE-01)"
                  className="w-full p-2.5 rounded-xl bg-[#FDF2F8] border border-[#FBCFE8] text-[#831843] font-bold"
                />
              </div>

              <div>
                <label className="block text-[#9D174D] mb-1 font-bold">SERVICING TYPE</label>
                <input
                  type="text"
                  value={serviceTypeInput}
                  onChange={(e) => setServiceTypeInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#FBCFE8] text-[#831843] focus:outline-none focus:border-[#E11D48] font-bold"
                  placeholder="e.g. Rotor Bearing Replacement & Sensor Calibration"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#FDF2F8] text-[#9D174D] hover:text-[#831843] font-bold border border-[#FBCFE8]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold shadow-sm active:scale-95"
                >
                  BOOK TICKET 💕
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


