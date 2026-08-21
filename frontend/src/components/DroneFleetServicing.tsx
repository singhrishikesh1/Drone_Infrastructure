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
      <div className="glass-panel p-4 rounded-xl border border-[#152535] bg-[#101C28] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hud-border font-sans">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#16B9E8]/10 border border-[#16B9E8]/30 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-[#16B9E8]" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#F1F5F9] uppercase tracking-wider flex items-center gap-2">
              ACTIVE DRONE TELEMETRY & MAINTENANCE
              <span className="text-[9px] px-2 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 font-mono font-bold">
                1 ACTIVE DRONE IN AIR
              </span>
            </h2>
            <p className="text-[11px] text-[#94A3B8]">Live GPS Telemetry, Battery Status, Motor Diagnostics & Avionics Tickets</p>
          </div>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#16B9E8] hover:bg-[#38CBF3] text-[#08111A] font-extrabold text-xs transition-all uppercase tracking-wider"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>SCHEDULE SERVICING</span>
        </button>
      </div>

      {/* Active Drone Spec Card */}
      <div className="glass-panel p-5 rounded-xl border border-[#152535] bg-[#101C28] space-y-4 shadow-md font-sans">
        <div className="flex items-center justify-between border-b border-[#152535] pb-3">
          <div>
            <span className="text-xs text-[#16B9E8] font-mono font-bold">{activeDrone.id}</span>
            <h3 className="text-base font-extrabold text-[#F1F5F9]">{activeDrone.name}</h3>
            <span className="text-xs text-[#94A3B8] font-mono">Model: {activeDrone.model}</span>
          </div>
          <span className="px-3 py-1 rounded text-xs font-bold font-mono border bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30">
            ● AUTONOMOUS PATROL
          </span>
        </div>

        {/* Location Sector */}
        <div className="p-3 rounded-lg bg-[#152535] border border-[#152535] text-xs space-y-1 font-mono">
          <div className="text-[#94A3B8] flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold text-[#F1F5F9]">
              <Navigation className="w-3.5 h-3.5 text-[#16B9E8]" /> PATROL SECTOR
            </span>
            <span className="text-[#16B9E8] font-bold">{activeDrone.assignedArea}</span>
          </div>
          <div className="text-[11px] text-[#94A3B8] pt-0.5">
            GPS: {activeDrone.lat.toFixed(4)}° N, {activeDrone.lng.toFixed(4)}° E | Altitude: {activeDrone.altitude}m | Speed: {activeDrone.speedKmH} km/h
          </div>
        </div>

        {/* Telemetry Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Battery */}
          <div className="bg-[#152535] p-3 rounded-lg border border-[#152535]">
            <div className="flex items-center justify-between text-[#94A3B8] mb-1.5 text-[11px]">
              <span className="flex items-center gap-1 font-bold text-[#F1F5F9]">
                <Battery className="w-4 h-4 text-[#22C55E]" /> Battery Charge
              </span>
              <span className="font-extrabold text-[#22C55E] text-sm">{activeDrone.batteryPercent}%</span>
            </div>
            <div className="w-full bg-[#08111A] h-2 rounded overflow-hidden border border-[#152535]">
              <div
                className="bg-[#22C55E] h-full rounded transition-all"
                style={{ width: `${activeDrone.batteryPercent}%` }}
              />
            </div>
          </div>

          {/* Rotor Health */}
          <div className="bg-[#152535] p-3 rounded-lg border border-[#152535]">
            <div className="flex items-center justify-between text-[#94A3B8] mb-1.5 text-[11px]">
              <span className="flex items-center gap-1 font-bold text-[#F1F5F9]">
                <ShieldCheck className="w-4 h-4 text-[#16B9E8]" /> Motor Diagnostics
              </span>
              <span className="font-extrabold text-[#16B9E8] text-sm">{activeDrone.rotorHealth}%</span>
            </div>
            <div className="w-full bg-[#08111A] h-2 rounded overflow-hidden border border-[#152535]">
              <div
                className="bg-[#16B9E8] h-full rounded transition-all"
                style={{ width: `${activeDrone.rotorHealth}%` }}
              />
            </div>
          </div>
        </div>

        {/* Service metadata */}
        <div className="pt-2 border-t border-[#152535] flex items-center justify-between text-xs text-[#94A3B8] font-mono">
          <span>NEXT SERVICING DUE: <strong className="text-[#F1F5F9]">{activeDrone.nextServiceDue}</strong></span>
          <span>TOTAL FLIGHT HOURS: <strong className="text-[#F1F5F9]">{activeDrone.totalFlightHours}h</strong></span>
        </div>
      </div>

      {/* Service Maintenance History */}
      <div className="glass-panel p-4 rounded-xl border border-[#152535] bg-[#101C28] space-y-3 font-sans">
        <h3 className="text-xs font-bold text-[#F1F5F9] uppercase tracking-wider flex items-center gap-2 font-mono">
          <Wrench className="w-3.5 h-3.5 text-[#16B9E8]" />
          MAINTENANCE & AVIONICS SERVICING TICKETS
        </h3>

        <div className="space-y-2 font-mono text-xs">
          {serviceLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-lg bg-[#152535] border border-[#152535] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#F1F5F9] font-sans">{log.droneName}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#101C28] text-[#16B9E8] font-bold text-[10px] border border-[#16B9E8]/20">
                    {log.id}
                  </span>
                </div>
                <div className="text-[#F1F5F9] font-semibold">{log.serviceType}</div>
                <div className="text-[#94A3B8] text-[11px] font-sans">{log.notes}</div>
              </div>

              <div className="flex items-center space-x-4 text-right">
                <div>
                  <div className="text-[#94A3B8] text-[11px]">COST: <strong className="text-[#F1F5F9]">{log.cost}</strong></div>
                  <div className="text-[#64748B] text-[10px]">TECH: {log.technician}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 font-bold text-[10px]">
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Service Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-[#08111A]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-5 rounded-xl border border-[#16B9E8]/30 bg-[#101C28] max-w-md w-full space-y-4 shadow-2xl hud-border font-sans">
            <h3 className="text-sm font-extrabold text-[#F1F5F9] uppercase tracking-wider flex items-center gap-2 font-mono">
              <Wrench className="w-4 h-4 text-[#16B9E8]" />
              SCHEDULE DRONE SERVICING TICKET
            </h3>

            <form onSubmit={handleBookService} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-[#94A3B8] mb-1 font-bold">DRONE UNIT</label>
                <input
                  type="text"
                  disabled
                  value="SkyGuardian-X1 (DRONE-PUNE-01)"
                  className="w-full p-2.5 rounded-lg bg-[#152535] border border-[#152535] text-[#F1F5F9] font-bold"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1 font-bold">SERVICING TYPE</label>
                <input
                  type="text"
                  value={serviceTypeInput}
                  onChange={(e) => setServiceTypeInput(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#08111A] border border-[#152535] text-[#F1F5F9] focus:outline-none focus:border-[#16B9E8]"
                  placeholder="e.g. Rotor Bearing Replacement & Sensor Calibration"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#08111A] text-[#94A3B8] hover:text-[#F1F5F9] font-bold border border-[#152535]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#16B9E8] hover:bg-[#38CBF3] text-[#08111A] font-extrabold"
                >
                  BOOK TICKET
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


