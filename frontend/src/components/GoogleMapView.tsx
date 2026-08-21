import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Defect } from '../types';
import { Navigation, Layers, ShieldAlert, Eye, Key } from 'lucide-react';

interface MapViewProps {
  defects: Defect[];
  selectedDefect: Defect | null;
  onSelectDefect: (defect: Defect) => void;
}

interface SingleDroneUnit {
  id: string;
  callsign: string;
  name: string;
  model: string;
  status: string;
  battery: number;
  speedKmH: number;
  altitude: number;
  sector: string;
  color: string;
  roadCorridor: [number, number][];
}

// Single active drone SkyGuardian-X1 following exact road network polylines (Pune Road Network)
const ACTIVE_DRONE: SingleDroneUnit = {
  id: 'DRONE-PUNE-01',
  callsign: 'SkyGuardian-X1',
  name: 'SkyGuardian-X1 Autonomous Patrol',
  model: 'Matrice 300 RTK Industrial',
  status: 'AUTONOMOUS PATROL',
  battery: 88,
  speedKmH: 24.2,
  altitude: 48.5,
  sector: 'Pune Outer Ring Road - Sector 04',
  color: '#16B9E8', // Cyan primary accent
  // Exact road coordinates snapped to Pune road network
  roadCorridor: [
    [18.5679, 73.9143], // Viman Nagar Airport Road
    [18.5600, 73.9250], // Airport Connector Rd
    [18.5515, 73.9348], // Kharadi Main Road / EON Bridge
    [18.5620, 73.9550], // IT Corridor Bypass
    [18.5808, 73.9818], // Wagholi Highway Stretch (NH-48)
    [18.5680, 73.9450], // Nagar Road Return
    [18.5679, 73.9143]  // Road Loop Back
  ]
};

export const GoogleMapView: React.FC<MapViewProps> = ({
  defects,
  selectedDefect,
  onSelectDefect
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const droneMarkerRef = useRef<L.Marker | null>(null);
  const roadPolylineRef = useRef<L.Polyline | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [activeAssetFilter, setActiveAssetFilter] = useState<string>('all');
  const [activeLocationFilter, setActiveLocationFilter] = useState<string>('all');
  const [googleApiKey, setGoogleApiKey] = useState<string>(
    (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || ''
  );
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map centered on Pune Region
    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([18.5520, 73.9400], 13);

    // CartoDB Dark tiles with Google Maps Road Network aesthetics
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;
  }, []);

  // Update Defect Markers on Map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing defect markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && !(layer as any).isDroneMarker) {
        map.removeLayer(layer);
      }
    });

    const filteredDefects = defects.filter(d => {
      const matchAsset = activeAssetFilter === 'all' || d.assetType.toLowerCase() === activeAssetFilter.toLowerCase();
      const matchLoc = activeLocationFilter === 'all' || d.locationName.toLowerCase().includes(activeLocationFilter.toLowerCase());
      return matchAsset && matchLoc;
    });

    filteredDefects.forEach((defect) => {
      let pinColor = '#22C55E'; // Green
      if (defect.riskLevel === 'CRITICAL') pinColor = '#EF4444'; // Red
      else if (defect.riskLevel === 'HIGH' || defect.riskLevel === 'MEDIUM') pinColor = '#F59E0B'; // Orange

      const customIcon = L.divIcon({
        className: 'pune-map-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background-color: ${pinColor}; opacity: 0.25;"></div>
            <div style="position: relative; width: 24px; height: 24px; border-radius: 50%; background-color: #101C28; border: 2px solid ${pinColor}; display: flex; align-items: center; justify-content: center; color: ${pinColor}; font-weight: 800; font-family: 'JetBrains Mono', monospace; font-size: 10px;">
              ${defect.riskScore || 90}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([defect.lat, defect.lng], { icon: customIcon }).addTo(map);

      const popupHtml = `
        <div style="font-family: 'Inter', sans-serif; background: #101C28; color: #F1F5F9; padding: 10px; border-radius: 8px; border: 1px solid #152535; max-width: 220px;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 800; color: ${pinColor}; text-transform: uppercase;">
            ${defect.riskLevel} RISK (${defect.riskScore}/100)
          </div>
          <div style="font-size: 12px; font-weight: 700; margin-top: 3px;">
            ${defect.title}
          </div>
          <div style="font-size: 10px; color: #94A3B8; margin-top: 4px;">
            📍 ${defect.locationName}
          </div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #16B9E8; margin-top: 6px;">
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

  // Render Cyan Road Patrol Corridor
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (roadPolylineRef.current) {
      map.removeLayer(roadPolylineRef.current);
    }

    const polyline = L.polyline(ACTIVE_DRONE.roadCorridor, {
      color: '#16B9E8',
      weight: 3,
      dashArray: '6, 8',
      opacity: 0.8
    }).addTo(map);

    roadPolylineRef.current = polyline;
  }, []);

  // Single Drone Road Navigation Animation Engine
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (droneMarkerRef.current) {
      map.removeLayer(droneMarkerRef.current);
    }

    let segmentIndex = 0;
    let progress = 0;
    const speed = 0.0015;

    const createDroneIconHtml = (headingAngle: number) => {
      return `
        <div style="position: relative; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
          <!-- Radar Aura -->
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid #16B9E8; opacity: 0.3;"></div>

          <!-- Quadcopter Body -->
          <div style="transform: rotate(${headingAngle.toFixed(1)}deg); position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <div class="animate-spin-fast" style="position: absolute; top: 0; left: 0; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid #16B9E8;"></div>
            <div class="animate-spin-fast" style="position: absolute; top: 0; right: 0; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid #16B9E8;"></div>
            <div class="animate-spin-fast" style="position: absolute; bottom: 0; left: 0; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid #16B9E8;"></div>
            <div class="animate-spin-fast" style="position: absolute; bottom: 0; right: 0; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid #16B9E8;"></div>

            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16B9E8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="4" y1="4" x2="20" y2="20" stroke-opacity="0.6"/>
              <line x1="20" y1="4" x2="4" y2="20" stroke-opacity="0.6"/>
              <circle cx="12" cy="12" r="4" fill="#101C28" stroke="#16B9E8" stroke-width="2"/>
              <polygon points="12,4 8,10 16,10" fill="#16B9E8"/>
            </svg>
          </div>

          <!-- Callsign Tag Badge -->
          <div style="position: absolute; top: -14px; white-space: nowrap; background: #101C28; border: 1px solid #16B9E8; color: #F1F5F9; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 800; padding: 1px 6px; border-radius: 4px; display: flex; align-items: center; gap: 4px;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: #22C55E;"></span>
            ${ACTIVE_DRONE.callsign}
          </div>
        </div>
      `;
    };

    const p1 = ACTIVE_DRONE.roadCorridor[0];
    const p2 = ACTIVE_DRONE.roadCorridor[1];
    const initialLat = p1[0];
    const initialLng = p1[1];

    const icon = L.divIcon({
      className: 'moving-drone-pin',
      html: createDroneIconHtml(0),
      iconSize: [60, 60],
      iconAnchor: [30, 30]
    });

    const marker = L.marker([initialLat, initialLng], { icon }).addTo(map);
    (marker as any).isDroneMarker = true;

    const popupHtml = `
      <div style="font-family: 'Inter', sans-serif; background: #101C28; color: #F1F5F9; padding: 10px; border-radius: 10px; border: 1px solid #16B9E8; max-width: 250px;">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; color: #16B9E8; display: flex; align-items: center; justify-content: space-between;">
          <span>🛸 ${ACTIVE_DRONE.callsign}</span>
          <span style="color: #22C55E; background: rgba(34,197,94,0.1); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(34,197,94,0.3); font-size: 8px;">SNAPPED TO ROAD</span>
        </div>
        <div style="font-size: 12px; font-weight: 700; margin-top: 4px;">${ACTIVE_DRONE.name}</div>
        <div style="font-size: 10px; color: #94A3B8; margin-top: 1px;">Model: ${ACTIVE_DRONE.model}</div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 8px; font-family: 'JetBrains Mono', monospace; font-size: 10px; background: #08111A; padding: 6px; border-radius: 6px; border: 1px solid #152535;">
          <div><span style="color: #64748B;">ALTITUDE:</span> <strong style="color: #16B9E8;">${ACTIVE_DRONE.altitude}m</strong></div>
          <div><span style="color: #64748B;">SPEED:</span> <strong style="color: #F1F5F9;">${ACTIVE_DRONE.speedKmH} km/h</strong></div>
          <div><span style="color: #64748B;">BATTERY:</span> <strong style="color: #22C55E;">${ACTIVE_DRONE.battery}%</strong></div>
          <div><span style="color: #64748B;">STATUS:</span> <strong style="color: #16B9E8;">PATROL</strong></div>
        </div>

        <div style="font-size: 10px; color: #94A3B8; margin-top: 6px; font-family: 'JetBrains Mono', monospace;">
          📍 Road Sector: <strong style="color: #F1F5F9;">${ACTIVE_DRONE.sector}</strong>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml);
    droneMarkerRef.current = marker;

    // Animation loop along road network
    const animate = () => {
      progress += speed;
      if (progress >= 1) {
        progress = 0;
        segmentIndex = (segmentIndex + 1) % (ACTIVE_DRONE.roadCorridor.length - 1);
      }

      const pointA = ACTIVE_DRONE.roadCorridor[segmentIndex];
      const pointB = ACTIVE_DRONE.roadCorridor[segmentIndex + 1];

      const lat = pointA[0] + (pointB[0] - pointA[0]) * progress;
      const lng = pointA[1] + (pointB[1] - pointA[1]) * progress;

      const dLat = pointB[0] - pointA[0];
      const dLng = pointB[1] - pointA[1];
      const heading = (Math.atan2(dLng, dLat) * (180 / Math.PI) + 360) % 360;

      if (droneMarkerRef.current) {
        droneMarkerRef.current.setLatLng([lat, lng]);
        const updatedIcon = L.divIcon({
          className: 'moving-drone-pin',
          html: createDroneIconHtml(heading),
          iconSize: [60, 60],
          iconAnchor: [30, 30]
        });
        droneMarkerRef.current.setIcon(updatedIcon);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const filteredCount = defects.filter(d => {
    const matchAsset = activeAssetFilter === 'all' || d.assetType.toLowerCase() === activeAssetFilter.toLowerCase();
    const matchLoc = activeLocationFilter === 'all' || d.locationName.toLowerCase().includes(activeLocationFilter.toLowerCase());
    return matchAsset && matchLoc;
  }).length;

  return (
    <div className="glass-panel rounded-xl p-3 border border-[#152535] bg-[#101C28] shadow-xl relative space-y-3 hud-border font-sans">
      {/* Header Controls Bar */}
      <div className="flex flex-col space-y-2.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#16B9E8]/10 border border-[#16B9E8]/30 flex items-center justify-center">
              <Navigation className="w-3.5 h-3.5 text-[#16B9E8]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F1F5F9] uppercase tracking-wider font-mono flex items-center gap-2">
                DRONACHARYA ROAD PATROL GIS RADAR
                <span className="text-[9px] px-2 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  1 ACTIVE DRONE PATROLLING ROADS
                </span>
              </h2>
            </div>
          </div>

          {/* Location Sector Filter Buttons */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto font-mono text-[11px]">
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#152535] text-[#16B9E8] border border-[#16B9E8]/30 font-bold hover:bg-[#16B9E8]/10 transition-all"
            >
              <Key className="w-3 h-3 text-[#16B9E8]" />
              <span>{googleApiKey ? 'GOOGLE MAPS API SET' : 'ADD MAPS API KEY'}</span>
            </button>

            {[
              { id: 'all', label: 'All Sectors' },
              { id: 'highway', label: 'Highway 101' },
              { id: 'sector 7', label: 'Sector 7 Road' },
              { id: 'exit 12', label: 'Exit 12' }
            ].map(loc => (
              <button
                key={loc.id}
                onClick={() => setActiveLocationFilter(loc.id)}
                className={`px-2.5 py-1 rounded transition-all ${
                  activeLocationFilter === loc.id
                    ? 'bg-[#16B9E8] text-[#08111A] font-bold shadow-md'
                    : 'bg-[#08111A] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#152535]'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-[#08111A] p-2 rounded-lg border border-[#152535] text-[11px] font-mono">
          <div className="flex items-center space-x-2 text-[#94A3B8]">
            <span className="text-[#16B9E8] font-bold flex items-center gap-1">
              🛣️ ROAD SNAPPED PATH:
            </span>
            <span className="text-[#F1F5F9] font-bold">Pune Outer Ring Road → NH-48 Expressway</span>
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto">
            <span className="text-[#64748B] font-semibold px-1">FILTER ASSET:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'road', label: '🛣️ Roads' },
              { id: 'bridge', label: '🌉 Bridges' }
            ].map(asset => (
              <button
                key={asset.id}
                onClick={() => setActiveAssetFilter(asset.id)}
                className={`px-2 py-0.5 rounded font-medium transition-all whitespace-nowrap ${
                  activeAssetFilter === asset.id
                    ? 'bg-[#152535] text-[#F1F5F9] border border-[#16B9E8]/40 font-bold'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                {asset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-[450px] rounded-lg overflow-hidden border border-[#152535] shadow-inner">
        <div ref={containerRef} className="w-full h-full bg-[#08111A]" />

        {/* Floating Live Overlay */}
        <div className="absolute top-3 left-3 z-[400] bg-[#101C28]/95 backdrop-blur-md border border-[#152535] p-2.5 rounded-lg text-xs space-y-1 shadow-lg max-w-xs font-mono">
          <div className="flex items-center justify-between text-[#94A3B8] border-b border-[#152535] pb-1">
            <span className="font-bold text-[#F1F5F9] text-[11px] flex items-center gap-1.5 uppercase">
              <Navigation className="w-3.5 h-3.5 text-[#16B9E8]" /> ROAD PATROL RADAR
            </span>
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
            <div>
              <span className="text-[#64748B] block">ACTIVE DRONE</span>
              <span className="text-[#16B9E8] font-bold">SkyGuardian-X1</span>
            </div>
            <div>
              <span className="text-[#64748B] block">DEFECTS DETECTED</span>
              <span className="text-[#F59E0B] font-bold">{filteredCount} Markers</span>
            </div>
          </div>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-3 right-3 z-[400] bg-[#101C28]/95 backdrop-blur-md border border-[#152535] px-3 py-1.5 rounded-lg text-[10px] font-mono flex items-center space-x-3 shadow-lg">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            <span className="text-[#F1F5F9] font-bold">Critical</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <span className="text-[#94A3B8]">Warning</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
            <span className="text-[#94A3B8]">Resolved</span>
          </div>
        </div>
      </div>

      {/* Google Maps API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 bg-[#08111A]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-5 rounded-xl border border-[#16B9E8]/30 bg-[#101C28] max-w-md w-full space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#152535] pb-2">
              <h3 className="text-sm font-extrabold text-[#F1F5F9] uppercase tracking-wider flex items-center gap-2">
                <Key className="w-4 h-4 text-[#16B9E8]" />
                GOOGLE MAPS API KEY FOR ROAD DETECTION
              </h3>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Add your Google Maps API Key to enable official Google Road Detection & Snap-to-Road Services for <strong className="text-[#16B9E8]">SkyGuardian-X1</strong>.
              </p>
              <div>
                <label className="block text-[#94A3B8] mb-1 font-bold">GOOGLE MAPS API KEY</label>
                <input
                  type="text"
                  value={googleApiKey}
                  onChange={(e) => setGoogleApiKey(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#08111A] border border-[#152535] text-[#F1F5F9] focus:outline-none focus:border-[#16B9E8]"
                  placeholder="AIzaSy..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#08111A] text-[#94A3B8] hover:text-[#F1F5F9] font-bold border border-[#152535]"
                >
                  CLOSE
                </button>
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-[#16B9E8] hover:bg-[#38CBF3] text-[#08111A] font-extrabold"
                >
                  SAVE & RELOAD MAP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

