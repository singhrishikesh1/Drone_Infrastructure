import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Defect } from '../types';
import { Navigation, Cpu, Layers, Radio, ShieldAlert, Crosshair, Eye, Play, Pause, Activity } from 'lucide-react';

interface MapViewProps {
  defects: Defect[];
  selectedDefect: Defect | null;
  onSelectDefect: (defect: Defect) => void;
}

interface DroneFleetUnit {
  id: string;
  callsign: string;
  name: string;
  model: string;
  status: 'FLYING' | 'PATROLLING' | 'SCANNING';
  battery: number;
  speedKmH: number;
  altitude: number;
  sector: string;
  color: string;
  corridor: [number, number][];
}

const FLEET_DRONES: DroneFleetUnit[] = [
  {
    id: 'DRONE-PUNE-01',
    callsign: 'SkyGuardian-X1',
    name: 'SkyGuardian-X1 Pro',
    model: 'Matrice 300 RTK Industrial',
    status: 'FLYING',
    battery: 88,
    speedKmH: 24.2,
    altitude: 48.5,
    sector: 'Viman Nagar - Kharadi Corridor',
    color: '#00F3FF', // Cyan
    corridor: [
      [18.5679, 73.9143], // Viman Nagar
      [18.5515, 73.9348], // Kharadi EON
      [18.5808, 73.9818], // Wagholi
      [18.5089, 73.9259], // Hadapsar
      [18.5679, 73.9143]  // Loop back
    ]
  },
  {
    id: 'DRONE-PUNE-02',
    callsign: 'AeroFalcon-P2',
    name: 'AeroFalcon-P2 Autonomous',
    model: 'Skydio X2D AI Inspector',
    status: 'PATROLLING',
    battery: 74,
    speedKmH: 18.5,
    altitude: 38.0,
    sector: 'Kharadi EON Free Zone',
    color: '#10B981', // Emerald
    corridor: [
      [18.5515, 73.9348], // Kharadi
      [18.5620, 73.9550], // IT Corridor
      [18.5808, 73.9818], // Wagholi Stretch
      [18.5680, 73.9450], // Airport Bypass
      [18.5515, 73.9348]  // Loop back
    ]
  },
  {
    id: 'DRONE-PUNE-03',
    callsign: 'TerraRover-D3',
    name: 'TerraRover-D3 Heavy Payload',
    model: 'Freefly Alta X 3D Mapper',
    status: 'SCANNING',
    battery: 95,
    speedKmH: 21.0,
    altitude: 55.0,
    sector: 'Hadapsar Cybercity Sector',
    color: '#A855F7', // Purple
    corridor: [
      [18.5089, 73.9259], // Hadapsar
      [18.5350, 73.9200], // Mundhwa Flyover
      [18.5679, 73.9143], // Viman Nagar Base
      [18.5300, 73.9300], // Magarpatta Bridge
      [18.5089, 73.9259]  // Loop back
    ]
  }
];

export const GoogleMapView: React.FC<MapViewProps> = ({
  defects,
  selectedDefect,
  onSelectDefect
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const droneMarkersRef = useRef<{ [key: string]: L.Marker }>({});
  const dronePolylinesRef = useRef<L.Polyline[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const [activeAssetFilter, setActiveAssetFilter] = useState<string>('all');
  const [activeLocationFilter, setActiveLocationFilter] = useState<string>('all');
  const [followedDroneId, setFollowedDroneId] = useState<string | null>(null);
  const [showCorridors, setShowCorridors] = useState<boolean>(true);
  const [showDrones, setShowDrones] = useState<boolean>(true);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize Leaflet map centered on Pune Region, MH
    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([18.5520, 73.9400], 12);

    // CartoDB Dark Matter map tiles (Google Maps GIS Dark Mode look)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;
  }, []);

  // Update Defect Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing non-drone markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && !(layer as any).isDroneMarker) {
        map.removeLayer(layer);
      }
    });

    // Filter defects by asset type & location
    const filteredDefects = defects.filter(d => {
      const matchAsset = activeAssetFilter === 'all' || d.assetType.toLowerCase() === activeAssetFilter.toLowerCase();
      const matchLoc = activeLocationFilter === 'all' || d.locationName.toLowerCase().includes(activeLocationFilter.toLowerCase());
      return matchAsset && matchLoc;
    });

    // Plot defect pins with tactical badges
    filteredDefects.forEach((defect) => {
      let pinColor = '#10B981'; // Green
      if (defect.riskLevel === 'CRITICAL') pinColor = '#EF4444'; // Red
      else if (defect.riskLevel === 'HIGH') pinColor = '#F97316'; // Orange
      else if (defect.riskLevel === 'MEDIUM') pinColor = '#F59E0B'; // Yellow

      const customIcon = L.divIcon({
        className: 'pune-map-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background-color: ${pinColor}; opacity: 0.35; animation: ping 1.8s ease-in-out infinite;"></div>
            <div style="position: relative; width: 26px; height: 26px; border-radius: 50%; background-color: #0A0F17; border: 2px solid ${pinColor}; box-shadow: 0 0 16px ${pinColor}; display: flex; align-items: center; justify-content: center; color: ${pinColor}; font-weight: 800; font-family: 'JetBrains Mono', monospace; font-size: 10px;">
              ${defect.riskScore}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([defect.lat, defect.lng], { icon: customIcon }).addTo(map);

      const popupHtml = `
        <div style="font-family: 'Inter', sans-serif; background: #0A0F17; color: #F8FAFC; padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); max-width: 220px;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 800; color: ${pinColor}; text-transform: uppercase; letter-spacing: 0.5px;">
            ${defect.riskLevel === 'CRITICAL' ? 'URGENT REPAIR' : defect.riskLevel + ' RISK'} (${defect.riskScore}/100)
          </div>
          <div style="font-size: 12px; font-weight: 700; margin-top: 3px; line-height: 1.3;">
            ${defect.title}
          </div>
          <div style="font-size: 10px; color: #94A3B8; margin-top: 4px;">
            📍 ${defect.locationName}
          </div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #00F3FF; margin-top: 6px;">
            Est. Repair: ₹${defect.costEstimation?.total_estimated_cost?.toLocaleString()}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        onSelectDefect(defect);
      });
    });

    if (selectedDefect && map) {
      map.setView([selectedDefect.lat, selectedDefect.lng], 14, { animate: true });
    }
  }, [defects, selectedDefect, activeAssetFilter, activeLocationFilter]);

  // Render Flight Corridors
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing polylines
    dronePolylinesRef.current.forEach(p => map.removeLayer(p));
    dronePolylinesRef.current = [];

    if (showCorridors) {
      FLEET_DRONES.forEach((drone) => {
        const polyline = L.polyline(drone.corridor, {
          color: drone.color,
          weight: 2,
          dashArray: '6, 8',
          opacity: 0.6
        }).addTo(map);
        dronePolylinesRef.current.push(polyline);
      });
    }
  }, [showCorridors]);

  // Live Drone Motion Engine (Animation Loop)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing drone markers
    Object.values(droneMarkersRef.current).forEach(m => map.removeLayer(m));
    droneMarkersRef.current = {};

    if (!showDrones) return;

    // Initialize state tracking for each drone along its flight path leg
    const droneStates = FLEET_DRONES.map((drone, idx) => ({
      drone,
      segmentIndex: idx % (drone.corridor.length - 1),
      progress: (idx * 0.3) % 1, // stagger starting positions
      speed: 0.0015 // smooth speed step per frame
    }));

    // Helper to create HTML string for animated drone Leaflet icon
    const createDroneIconHtml = (drone: DroneFleetUnit, headingAngle: number) => {
      return `
        <div style="position: relative; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center;">
          <!-- Sonar Radar Pulse Aura -->
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid ${drone.color}; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: ${drone.color}15; border: 1px dashed ${drone.color}80;"></div>

          <!-- Rotating Quadcopter Body -->
          <div style="transform: rotate(${headingAngle.toFixed(1)}deg); transition: transform 0.1s linear; position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
            <!-- 4 Rotors -->
            <div class="animate-spin-fast" style="position: absolute; top: 1px; left: 1px; width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid ${drone.color};"></div>
            <div class="animate-spin-fast" style="position: absolute; top: 1px; right: 1px; width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid ${drone.color};"></div>
            <div class="animate-spin-fast" style="position: absolute; bottom: 1px; left: 1px; width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid ${drone.color};"></div>
            <div class="animate-spin-fast" style="position: absolute; bottom: 1px; right: 1px; width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid ${drone.color};"></div>

            <!-- Fuselage Core -->
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${drone.color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="4" y1="4" x2="20" y2="20" stroke-opacity="0.6"/>
              <line x1="20" y1="4" x2="4" y2="20" stroke-opacity="0.6"/>
              <circle cx="12" cy="12" r="4.5" fill="#0A0F17" stroke="${drone.color}" stroke-width="2"/>
              <!-- Forward Heading Pointer Arrow -->
              <polygon points="12,4 8,11 16,11" fill="${drone.color}"/>
            </svg>
          </div>

          <!-- Callsign Tag Badge -->
          <div style="position: absolute; top: -16px; white-space: nowrap; background: #0A0F17; border: 1px solid ${drone.color}; color: #F8FAFC; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 800; padding: 1px 5px; border-radius: 4px; box-shadow: 0 2px 10px rgba(0,0,0,0.8); display: flex; align-items: center; gap: 4px;">
            <span style="display: inline-block; width: 5px; height: 5px; border-radius: 50%; background-color: ${drone.color};"></span>
            ${drone.callsign}
          </div>
        </div>
      `;
    };

    // Create markers for each drone
    droneStates.forEach(({ drone, segmentIndex, progress }) => {
      const p1 = drone.corridor[segmentIndex];
      const p2 = drone.corridor[(segmentIndex + 1) % drone.corridor.length];

      const lat = p1[0] + (p2[0] - p1[0]) * progress;
      const lng = p1[1] + (p2[1] - p1[1]) * progress;

      const dLat = p2[0] - p1[0];
      const dLng = p2[1] - p1[1];
      const heading = (Math.atan2(dLng, dLat) * (180 / Math.PI) + 360) % 360;

      const icon = L.divIcon({
        className: 'moving-drone-pin',
        html: createDroneIconHtml(drone, heading),
        iconSize: [64, 64],
        iconAnchor: [32, 32]
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);
      (marker as any).isDroneMarker = true;

      const popupHtml = `
        <div style="font-family: 'Inter', sans-serif; background: #0A0F17; color: #F8FAFC; padding: 10px; border-radius: 10px; border: 1px solid ${drone.color}; max-width: 250px;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; color: ${drone.color}; text-transform: uppercase; display: flex; align-items: center; justify-content: space-between;">
            <span>🛸 ${drone.callsign}</span>
            <span style="color: #10B981; background: rgba(16,185,129,0.1); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(16,185,129,0.3); font-size: 8px;">LIVE MOVING</span>
          </div>
          <div style="font-size: 12px; font-weight: 700; margin-top: 4px;">${drone.name}</div>
          <div style="font-size: 10px; color: #94A3B8; margin-top: 1px;">Model: ${drone.model}</div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 8px; font-family: 'JetBrains Mono', monospace; font-size: 10px; background: #05070B; padding: 6px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">
            <div><span style="color: #64748B;">ALTITUDE:</span> <strong style="color: #00F3FF;">${drone.altitude}m</strong></div>
            <div><span style="color: #64748B;">SPEED:</span> <strong style="color: #F8FAFC;">${drone.speedKmH} km/h</strong></div>
            <div><span style="color: #64748B;">BATTERY:</span> <strong style="color: #10B981;">${drone.battery}%</strong></div>
            <div><span style="color: #64748B;">STATUS:</span> <strong style="color: #38BDF8;">${drone.status}</strong></div>
          </div>

          <div style="font-size: 10px; color: #94A3B8; margin-top: 6px; font-family: 'JetBrains Mono', monospace;">
            📍 Sector: <strong style="color: #E2E8F0;">${drone.sector}</strong>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      droneMarkersRef.current[drone.id] = marker;
    });

    // Animation Loop Function
    const animate = () => {
      droneStates.forEach((state) => {
        state.progress += state.speed;

        if (state.progress >= 1) {
          state.progress = 0;
          state.segmentIndex = (state.segmentIndex + 1) % (state.drone.corridor.length - 1);
        }

        const p1 = state.drone.corridor[state.segmentIndex];
        const p2 = state.drone.corridor[state.segmentIndex + 1];

        const lat = p1[0] + (p2[0] - p1[0]) * state.progress;
        const lng = p1[1] + (p2[1] - p1[1]) * state.progress;

        const dLat = p2[0] - p1[0];
        const dLng = p2[1] - p1[1];
        const heading = (Math.atan2(dLng, dLat) * (180 / Math.PI) + 360) % 360;

        const marker = droneMarkersRef.current[state.drone.id];
        if (marker) {
          marker.setLatLng([lat, lng]);

          // Update icon rotation & content
          const icon = L.divIcon({
            className: 'moving-drone-pin',
            html: createDroneIconHtml(state.drone, heading),
            iconSize: [64, 64],
            iconAnchor: [32, 32]
          });
          marker.setIcon(icon);

          // If camera follow mode is active for this drone
          if (followedDroneId === state.drone.id && mapRef.current) {
            mapRef.current.panTo([lat, lng], { animate: true, duration: 0.1 });
          }
        }
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [showDrones, followedDroneId]);

  const filteredCount = defects.filter(d => {
    const matchAsset = activeAssetFilter === 'all' || d.assetType.toLowerCase() === activeAssetFilter.toLowerCase();
    const matchLoc = activeLocationFilter === 'all' || d.locationName.toLowerCase().includes(activeLocationFilter.toLowerCase());
    return matchAsset && matchLoc;
  }).length;

  return (
    <div className="glass-panel rounded-xl p-3 border border-white/[0.08] bg-[#0A0F17]/90 shadow-2xl relative space-y-3 hud-border">
      {/* Header Controls Bar */}
      <div className="flex flex-col space-y-2.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Navigation className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
                PUNE GIS LIVE DRONE RADAR
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  3 DRONES MOVING LIVE
                </span>
              </h2>
            </div>
          </div>

          {/* Location Sector Filter Buttons */}
          <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto font-mono text-[11px]">
            {[
              { id: 'all', label: 'All Pune' },
              { id: 'viman nagar', label: 'Viman Nagar' },
              { id: 'kharadi', label: 'Kharadi' },
              { id: 'wagholi', label: 'Wagholi' }
            ].map(loc => (
              <button
                key={loc.id}
                onClick={() => setActiveLocationFilter(loc.id)}
                className={`px-2.5 py-1 rounded transition-all ${
                  activeLocationFilter === loc.id
                    ? 'bg-cyan-500 text-aerospace-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-[#05070B] text-slate-400 hover:text-slate-200 border border-white/[0.06]'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Drone Tracking Bar & Asset Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-[#05070B] p-1.5 rounded-lg border border-white/[0.06] text-[11px] font-mono">
          {/* Drone Tracking Selectors */}
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            <span className="text-cyan-400 font-bold px-1.5 flex items-center gap-1">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" /> TRACK DRONE:
            </span>
            <button
              onClick={() => setFollowedDroneId(null)}
              className={`px-2 py-0.5 rounded font-bold transition-all ${
                followedDroneId === null
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FREE VIEW
            </button>
            {FLEET_DRONES.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setFollowedDroneId(d.id);
                  const marker = droneMarkersRef.current[d.id];
                  if (marker && mapRef.current) {
                    mapRef.current.setView(marker.getLatLng(), 14, { animate: true });
                  }
                }}
                className={`px-2 py-0.5 rounded font-bold transition-all flex items-center gap-1 ${
                  followedDroneId === d.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'bg-[#0A0F17] text-slate-300 hover:text-white border border-white/[0.08]'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                {d.callsign}
              </button>
            ))}
          </div>

          {/* Asset Category Filters */}
          <div className="flex items-center space-x-1 overflow-x-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
            <span className="text-slate-500 font-semibold px-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-cyan-400" /> DEFECTS:
            </span>
            {[
              { id: 'all', label: 'All' },
              { id: 'road', label: '🛣️ Roads' },
              { id: 'bridge', label: '🌉 Bridges' },
              { id: 'railway', label: '🚆 Rail' },
              { id: 'building', label: '🏢 Facades' }
            ].map(asset => (
              <button
                key={asset.id}
                onClick={() => setActiveAssetFilter(asset.id)}
                className={`px-2 py-0.5 rounded font-medium transition-all whitespace-nowrap ${
                  activeAssetFilter === asset.id
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {asset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-[450px] rounded-lg overflow-hidden border border-white/[0.08] shadow-inner">
        <div ref={containerRef} className="w-full h-full bg-[#05070B]" />

        {/* Floating Live Telemetry Stats Overlay */}
        <div className="absolute top-3 left-3 z-[400] bg-[#0A0F17]/90 backdrop-blur-md border border-white/[0.08] p-2.5 rounded-lg text-xs space-y-1 shadow-xl max-w-xs pointer-events-auto font-mono">
          <div className="flex items-center justify-between text-slate-400 border-b border-white/[0.08] pb-1">
            <span className="font-bold text-slate-200 text-[11px] flex items-center gap-1.5 uppercase">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> PUNE GIS RADAR
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
            <div>
              <span className="text-slate-500 block">SECTOR</span>
              <span className="text-cyan-400 font-bold">Pune MH (5G RTK)</span>
            </div>
            <div>
              <span className="text-slate-500 block">DEFECT TARGETS</span>
              <span className="text-amber-400 font-bold">{filteredCount} Markers</span>
            </div>
          </div>
          {followedDroneId && (
            <div className="pt-1.5 border-t border-cyan-500/30 flex items-center justify-between text-[10px]">
              <span className="text-cyan-300 font-bold flex items-center gap-1">
                <Crosshair className="w-3 h-3 text-cyan-400 animate-spin" /> CAMERA LOCKED
              </span>
              <button
                onClick={() => setFollowedDroneId(null)}
                className="text-red-400 underline hover:text-red-300 font-bold"
              >
                UNLOCK
              </button>
            </div>
          )}
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-3 right-3 z-[400] bg-[#0A0F17]/90 backdrop-blur-md border border-white/[0.08] px-3 py-1.5 rounded-lg text-[10px] font-mono flex items-center space-x-3 shadow-xl">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500 animate-pulse" />
            <span className="text-slate-200 font-bold">Urgent Repair</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-slate-300">High Risk</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
};
