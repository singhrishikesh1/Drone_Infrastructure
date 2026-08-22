import React, { useState, useEffect } from 'react';
import { DroneItem, ServiceRecord } from '../types';
import { ShieldCheck, Cpu, Battery, Wrench, Navigation, Plus, X } from 'lucide-react';
import { useToast } from './ToastNotification';

export const DroneFleetServicing: React.FC = () => {
  const { addToast } = useToast();
  const [drones, setDrones] = useState<DroneItem[]>([]);
  const [serviceLogs, setServiceLogs] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBookModal, setShowBookModal] = useState<boolean>(false);
  const [serviceTypeInput, setServiceTypeInput] = useState<string>('Rotor Bearing Calibration & LiDAR Sensor Check');

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
          name: "Raisoni-Drone_P7",
          model: "Matrice 300 RTK Industrial",
          status: "FLYING",
          assignedArea: "Nagar Road Patrol Sector (Point A ➔ Point B)",
          lat: 18.5679,
          lng: 73.9143,
          altitude: 48.5,
          speedKmH: 7.0,
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
          droneName: 'Raisoni-Drone_P7',
          serviceType: serviceTypeInput,
          notes: 'Routine preventative servicing ticket created.'
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setServiceLogs(prev => [json.data, ...prev]);
        addToast('success', 'Service Scheduled', `Ticket generated for Raisoni-Drone_P7: ${serviceTypeInput}`);
        setShowBookModal(false);
      }
    } catch (err) {
      const mockRecord: ServiceRecord = {
        id: `SRV-${Math.floor(100 + Math.random() * 900)}`,
        droneId: 'DRONE-PUNE-01',
        droneName: 'Raisoni-Drone_P7',
        serviceType: serviceTypeInput,
        date: new Date().toISOString().split('T')[0],
        technician: 'Senior Avionics Engineer',
        status: 'SCHEDULED',
        cost: '₹14,500',
        notes: 'Routine preventative maintenance scheduled.'
      };
      setServiceLogs(prev => [mockRecord, ...prev]);
      addToast('success', 'Servicing Scheduled', `Service ticket generated: ${serviceTypeInput}`);
      setShowBookModal(false);
    }
  };

  const activeDrone = drones[0] || {
    id: "DRONE-PUNE-01",
    name: "Raisoni-Drone_P7",
    model: "Matrice 300 RTK Industrial",
    status: "FLYING",
    assignedArea: "Nagar Road Patrol Sector (Point A ➔ Point B)",
    lat: 18.5679,
    lng: 73.9143,
    altitude: 48.5,
    speedKmH: 7.0,
    batteryPercent: 88,
    rotorHealth: 96,
    cameraStream: "HD Thermal + LiDAR Road Scan",
    lastServiceDate: "2026-08-10",
    nextServiceDue: "2026-09-10",
    totalFlightHours: 142.5
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header Banner */}
      <div className="app-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5 text-[var(--brand-primary)]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono flex items-center gap-2">
              DRONE FLEET & MAINTENANCE
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)] font-mono font-semibold">
                1 ACTIVE PATROL IN AIR
              </span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">Telemetry diagnostics, battery health, motor wear, & maintenance scheduling</p>
          </div>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold text-xs transition-all shadow-xs active:scale-95"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Schedule Servicing</span>
        </button>
      </div>

      {/* Active Drone Card */}
      <div className="app-card p-5 space-y-4 font-sans">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div>
            <span className="text-xs text-[var(--brand-primary)] font-mono font-bold">{activeDrone.id}</span>
            <h3 className="text-base font-bold text-[var(--text-primary)]">{activeDrone.name}</h3>
            <span className="text-xs text-[var(--text-secondary)] font-mono">Model: {activeDrone.model}</span>
          </div>
          <span className="px-3 py-1 rounded-lg text-xs font-semibold font-mono border bg-[var(--status-success-bg)] text-[var(--status-success)] border-[var(--status-success-border)]">
            ● AUTONOMOUS PATROL
          </span>
        </div>

        {/* Location Sector */}
        <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs space-y-1 font-mono">
          <div className="text-[var(--text-secondary)] flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
              <Navigation className="w-3.5 h-3.5 text-[var(--brand-primary)]" /> PATROL SECTOR
            </span>
            <span className="text-[var(--brand-primary)] font-bold">{activeDrone.assignedArea}</span>
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] pt-1">
            GPS: {activeDrone.lat.toFixed(4)}° N, {activeDrone.lng.toFixed(4)}° E | Altitude: {activeDrone.altitude}m | Speed: {activeDrone.speedKmH} km/h
          </div>
        </div>

        {/* Telemetry Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Battery */}
          <div className="bg-[var(--bg-elevated)] p-3.5 rounded-xl border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between text-[var(--text-secondary)] text-[11px]">
              <span className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                <Battery className="w-4 h-4 text-[var(--status-success)]" /> Battery Charge Level
              </span>
              <span className="font-bold text-[var(--status-success)] text-sm">{activeDrone.batteryPercent}%</span>
            </div>
            <div className="w-full bg-[var(--bg-surface)] h-2 rounded-full overflow-hidden border border-[var(--border-subtle)]">
              <div
                className="bg-[var(--status-success)] h-full rounded-full transition-all"
                style={{ width: `${activeDrone.batteryPercent}%` }}
              />
            </div>
          </div>

          {/* Motor Diagnostics */}
          <div className="bg-[var(--bg-elevated)] p-3.5 rounded-xl border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between text-[var(--text-secondary)] text-[11px]">
              <span className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                <ShieldCheck className="w-4 h-4 text-[var(--brand-primary)]" /> Motor Diagnostic Rating
              </span>
              <span className="font-bold text-[var(--brand-primary)] text-sm">{activeDrone.rotorHealth}%</span>
            </div>
            <div className="w-full bg-[var(--bg-surface)] h-2 rounded-full overflow-hidden border border-[var(--border-subtle)]">
              <div
                className="bg-[var(--brand-primary)] h-full rounded-full transition-all"
                style={{ width: `${activeDrone.rotorHealth}%` }}
              />
            </div>
          </div>
        </div>

        {/* Service Metadata */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)] font-mono">
          <span>NEXT SERVICING DUE: <strong className="text-[var(--text-primary)]">{activeDrone.nextServiceDue}</strong></span>
          <span>TOTAL FLIGHT HOURS: <strong className="text-[var(--text-primary)]">{activeDrone.totalFlightHours} hrs</strong></span>
        </div>
      </div>

      {/* Service History Log Table */}
      <div className="app-card p-4 space-y-3 font-sans">
        <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2 font-mono">
          <Wrench className="w-4 h-4 text-[var(--brand-primary)]" />
          Maintenance & Avionics Service Log
        </h3>

        <div className="space-y-2.5 font-mono text-xs">
          {serviceLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[var(--text-primary)] font-sans">{log.droneName}</span>
                  <span className="px-2 py-0.5 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-bold text-[10px] border border-[var(--brand-primary)]/20">
                    #{log.id}
                  </span>
                </div>
                <div className="text-[var(--text-primary)] font-semibold">{log.serviceType}</div>
                <div className="text-[var(--text-secondary)] text-[11px] font-sans">{log.notes}</div>
              </div>

              <div className="flex items-center space-x-4 text-right">
                <div>
                  <div className="text-[var(--text-secondary)] text-[11px]">COST: <strong className="text-[var(--text-primary)]">{log.cost}</strong></div>
                  <div className="text-[var(--text-muted)] text-[10px]">ENGINEER: {log.technician}</div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)] font-bold text-[10px]">
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Service Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-subtle)] max-w-md w-full space-y-4 shadow-2xl font-sans animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2 font-mono">
                <Wrench className="w-4 h-4 text-[var(--brand-primary)]" />
                Schedule Maintenance Ticket
              </h3>
              <button onClick={() => setShowBookModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookService} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-bold">TARGET DRONE UNIT</label>
                <input
                  type="text"
                  disabled
                  value="SkyGuardian-X1 (DRONE-PUNE-01)"
                  className="w-full p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-bold">SERVICING REQUIREMENT</label>
                <input
                  type="text"
                  value={serviceTypeInput}
                  onChange={(e) => setServiceTypeInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] font-bold"
                  placeholder="e.g. Rotor Bearing Replacement & Sensor Calibration"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold border border-[var(--border-subtle)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold shadow-xs active:scale-95"
                >
                  Schedule Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
