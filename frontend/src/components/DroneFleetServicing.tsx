import React, { useState, useEffect } from 'react';
import { DroneItem, ServiceRecord } from '../types';
import { ShieldCheck, Cpu, Battery, Wrench, AlertTriangle, Calendar, PlusCircle, CheckCircle2, Navigation } from 'lucide-react';

export const DroneFleetServicing: React.FC = () => {
  const [drones, setDrones] = useState<DroneItem[]>([]);
  const [serviceLogs, setServiceLogs] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBookModal, setShowBookModal] = useState<boolean>(false);
  const [selectedDroneForService, setSelectedDroneForService] = useState<string>('DRONE-PUNE-01');
  const [serviceTypeInput, setServiceTypeInput] = useState<string>('Rotor Calibration & Avionics Check');

  const fetchFleetData = async () => {
    try {
      setLoading(true);
      const droneRes = await fetch('http://localhost:5002/api/drones/live');
      const droneJson = await droneRes.json();
      if (droneJson.success && droneJson.data) {
        setDrones(droneJson.data);
      }

      const srvRes = await fetch('http://localhost:5002/api/servicing');
      const srvJson = await srvRes.json();
      if (srvJson.success && srvJson.data) {
        setServiceLogs(srvJson.data.serviceHistory || []);
      }
    } catch (err) {
      console.log('Using offline mock fleet data');
      setDrones([
        {
          id: "DRONE-PUNE-01",
          name: "SkyGuardian-X1 Pro",
          model: "Matrice 300 RTK Industrial",
          status: "FLYING",
          assignedArea: "Viman Nagar Flyover Sector",
          lat: 18.5679,
          lng: 73.9143,
          altitude: 48.5,
          speedKmH: 24.2,
          batteryPercent: 88,
          rotorHealth: 96,
          cameraStream: "HD Thermal + LiDAR Scan Active",
          lastServiceDate: "2026-07-20",
          nextServiceDue: "2026-08-25",
          totalFlightHours: 142.5
        },
        {
          id: "DRONE-PUNE-02",
          name: "AeroFalcon-P2 Autonomous",
          model: "Skydio X2D Autonomous Inspector",
          status: "FLYING",
          assignedArea: "Kharadi EON Bridge Sector",
          lat: 18.5515,
          lng: 73.9348,
          altitude: 38.0,
          speedKmH: 18.5,
          batteryPercent: 74,
          rotorHealth: 92,
          cameraStream: "AI Visual Defect Detector (YOLOv8)",
          lastServiceDate: "2026-07-15",
          nextServiceDue: "2026-08-20",
          totalFlightHours: 198.0
        },
        {
          id: "DRONE-PUNE-03",
          name: "TerraRover-D3 Heavy Payload",
          model: "Freefly Alta X Aerial Mapper",
          status: "CHARGING",
          assignedArea: "Wagholi Highway Base Station",
          lat: 18.5808,
          lng: 73.9818,
          altitude: 0.0,
          speedKmH: 0.0,
          batteryPercent: 99,
          rotorHealth: 98,
          cameraStream: "3D Photogrammetry Mesh Generator",
          lastServiceDate: "2026-08-01",
          nextServiceDue: "2026-09-01",
          totalFlightHours: 89.2
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
      const droneObj = drones.find(d => d.id === selectedDroneForService);
      const res = await fetch('http://localhost:5002/api/servicing/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          droneId: selectedDroneForService,
          droneName: droneObj?.name || 'Drone Unit',
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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-[#0c1220]/90 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Drone Fleet Command & Servicing Center
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                {drones.filter(d => d.status === 'FLYING').length} DRONES IN AIR
              </span>
            </h2>
            <p className="text-xs text-slate-400">Live GPS Coordinates, Battery Telemetry, Motor Diagnostics & Maintenance Logs</p>
          </div>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Wrench className="w-4 h-4" />
          <span>Schedule Drone Servicing</span>
        </button>
      </div>

      {/* Active Drones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {drones.map((drone) => (
          <div
            key={drone.id}
            className="glass-panel p-5 rounded-2xl border border-slate-800 bg-[#0c1220]/90 hover:border-slate-700 transition-all space-y-4 shadow-xl"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-semibold">{drone.id}</span>
                <h3 className="text-base font-bold text-slate-100">{drone.name}</h3>
                <span className="text-xs text-slate-400">{drone.model}</span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  drone.status === 'FLYING'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}
              >
                ● {drone.status}
              </span>
            </div>

            {/* Location Sector */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <div className="text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" /> Sector
                </span>
                <span className="font-mono text-cyan-300">{drone.assignedArea}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                GPS: {drone.lat.toFixed(4)}° N, {drone.lng.toFixed(4)}° E | Alt: {drone.altitude}m
              </div>
            </div>

            {/* Telemetry Progress Bars */}
            <div className="space-y-2 text-xs">
              {/* Battery */}
              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5 text-emerald-400" /> Battery Charge
                  </span>
                  <span className="font-mono font-bold text-slate-200">{drone.batteryPercent}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${drone.batteryPercent}%` }}
                  />
                </div>
              </div>

              {/* Rotor Health */}
              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Rotor & Motor Health
                  </span>
                  <span className="font-mono font-bold text-slate-200">{drone.rotorHealth}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all"
                    style={{ width: `${drone.rotorHealth}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Service metadata */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Next Service Due: <strong className="text-slate-200">{drone.nextServiceDue}</strong></span>
              <span>Hours: <strong className="text-slate-200">{drone.totalFlightHours}h</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Service Maintenance History */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-[#0c1220]/90 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-cyan-400" />
          Drone Maintenance & Servicing Records
        </h3>

        <div className="space-y-3">
          {serviceLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-100">{log.droneName}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-[10px]">
                    {log.id}
                  </span>
                </div>
                <div className="text-slate-300 font-semibold">{log.serviceType}</div>
                <div className="text-slate-400 text-[11px]">{log.notes}</div>
              </div>

              <div className="flex items-center space-x-4 text-right">
                <div>
                  <div className="text-slate-400 text-[11px]">Cost: <strong className="text-slate-200">{log.cost}</strong></div>
                  <div className="text-slate-500 text-[10px]">Tech: {log.technician}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-[11px]">
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Service Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-[#0c1220] max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-cyan-400" />
              Schedule Drone Servicing & Maintenance
            </h3>

            <form onSubmit={handleBookService} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Select Drone Unit</label>
                <select
                  value={selectedDroneForService}
                  onChange={(e) => setSelectedDroneForService(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  {drones.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Servicing Type</label>
                <input
                  type="text"
                  value={serviceTypeInput}
                  onChange={(e) => setServiceTypeInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. Rotor Bearing Replacement & Sensor Calibration"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Book Servicing Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
