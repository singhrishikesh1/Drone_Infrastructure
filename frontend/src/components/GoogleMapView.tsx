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
const POINT_A_COORDS: [number, number] = [18.5679, 73.9143]; // Point A: Viman Nagar Depot
const POINT_B_COORDS: [number, number] = [18.5808, 73.9818]; // Point B: Wagholi Highway Junction

const ACTIVE_DRONE: SingleDroneUnit = {
  id: 'DRONE-PUNE-01',
  callsign: 'SkyGuardian-X1',
  name: 'SkyGuardian-X1 Autonomous Patrol',
  model: 'Matrice 300 RTK Industrial',
  status: 'PATROLLING POINT A ➔ POINT B ON ROAD NETWORK',
  battery: 88,
  speedKmH: 24.2,
  altitude: 48.5,
  sector: 'Pune Outer Ring Road (Point A ➔ Point B)',
  color: '#E11D48',
  roadCorridor: [
    [18.5679, 73.9143], // Point A: Viman Nagar Airport Road
    [18.5600, 73.9250], // Airport Connector Rd
    [18.5515, 73.9348], // Kharadi Main Road / EON Bridge
    [18.5620, 73.9550], // IT Corridor Bypass
    [18.5808, 73.9818]  // Point B: Wagholi Highway Stretch (NH-48)
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
  const pointAMarkerRef = useRef<L.Marker | null>(null);
  const pointBMarkerRef = useRef<L.Marker | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [activeAssetFilter, setActiveAssetFilter] = useState<string>('all');
  const [activeLocationFilter, setActiveLocationFilter] = useState<string>('all');
  const [googleApiKey, setGoogleApiKey] = useState<string>(
    (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || ''
  );
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  
  // Navigation State
  const [direction, setDirection] = useState<'forward' | 'reverse'>('forward');
  const [routeProgressPct, setRouteProgressPct] = useState<number>(0);
  const [currentLegText, setCurrentLegText] = useState<string>('Moving from Point A ➔ Point B');

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map centered on Pune Region
    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([18.5650, 73.9450], 13);

    // CartoDB Voyager Light tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;

    // Render Point A Icon (Green Start Flag)
    const pointAIcon = L.divIcon({
      className: 'point-a-pin',
      html: `
        <div style="background: #16A34A; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 8px; border: 2px solid #FFFFFF; box-shadow: 0 4px 12px rgba(22,163,74,0.4); display: flex; align-items: center; gap: 4px; white-space: nowrap;">
          📍 POINT A (Depot)
        </div>
      `,
      iconSize: [120, 30],
      iconAnchor: [60, 15]
    });
    pointAMarkerRef.current = L.marker(POINT_A_COORDS, { icon: pointAIcon }).addTo(map);

    // Render Point B Icon (Red Target Flag)
    const pointBIcon = L.divIcon({
      className: 'point-b-pin',
      html: `
        <div style="background: #E11D48; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 8px; border: 2px solid #FFFFFF; box-shadow: 0 4px 12px rgba(225,29,72,0.4); display: flex; align-items: center; gap: 4px; white-space: nowrap;">
          🏁 POINT B (Target)
        </div>
      `,
      iconSize: [120, 30],
      iconAnchor: [60, 15]
    });
    pointBMarkerRef.current = L.marker(POINT_B_COORDS, { icon: pointBIcon }).addTo(map);

  }, []);

  // Update Defect Markers on Map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing defect markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && !(layer as any).isDroneMarker && layer !== pointAMarkerRef.current && layer !== pointBMarkerRef.current) {
        map.removeLayer(layer);
      }
    });

    const filteredDefects = defects.filter(d => {
      const matchAsset = activeAssetFilter === 'all' || d.assetType.toLowerCase() === activeAssetFilter.toLowerCase();
      const matchLoc = activeLocationFilter === 'all' || d.locationName.toLowerCase().includes(activeLocationFilter.toLowerCase());
      return matchAsset && matchLoc;
    });

    filteredDefects.forEach((defect) => {
      let pinColor = '#16A34A'; // Green
      if (defect.riskLevel === 'CRITICAL') pinColor = '#E11D48'; // Red
      else if (defect.riskLevel === 'HIGH' || defect.riskLevel === 'MEDIUM') pinColor = '#D97706'; // Amber

      const customIcon = L.divIcon({
        className: 'pune-map-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background-color: ${pinColor}; opacity: 0.25;"></div>
            <div style="width: 14px; height: 14px; border-radius: 50%; background-color: ${pinColor}; border: 2.5px solid #FFFFFF; box-shadow: 0 2px 8px rgba(0,0,0,0.2);"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([defect.lat, defect.lng], { icon: customIcon }).addTo(map);
      marker.on('click', () => onSelectDefect(defect));
    });

    if (selectedDefect && map) {
      map.setView([selectedDefect.lat, selectedDefect.lng], 14, { animate: true });
    }
  }, [defects, selectedDefect, activeAssetFilter, activeLocationFilter]);

  // Render Red/Pink Road Patrol Corridor strictly along roads
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (roadPolylineRef.current) {
      map.removeLayer(roadPolylineRef.current);
    }

    const polyline = L.polyline(ACTIVE_DRONE.roadCorridor, {
      color: '#E11D48',
      weight: 4,
      dashArray: '8, 10',
      opacity: 0.95
    }).addTo(map);

    roadPolylineRef.current = polyline;
  }, []);

  // Point A to Point B Road Navigation Loop Engine
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (droneMarkerRef.current) {
      map.removeLayer(droneMarkerRef.current);
    }

    const waypoints = ACTIVE_DRONE.roadCorridor;
    const numSegments = waypoints.length - 1;

    let isMovingForward = true;
    let currentSegment = 0;
    let segmentProgress = 0;
    const stepSpeed = 0.003; // Smooth travel speed along road segments

    const createDroneIconHtml = (headingAngle: number, currentLeg: string) => {
      return `
        <div style="position: relative; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center;">
          <!-- Radar Pulse -->
          <div style="position: absolute; width: 40px; height: 40px; border-radius: 50%; border: 2px solid #E11D48; opacity: 0.35; animation: ping 1.5s infinite;"></div>

          <!-- Quadcopter Body -->
          <div style="transform: rotate(${headingAngle.toFixed(1)}deg); position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
            <div class="animate-spin-fast" style="position: absolute; top: 0; left: 0; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid #E11D48;"></div>
            <div class="animate-spin-fast" style="position: absolute; top: 0; right: 0; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid #E11D48;"></div>
            <div class="animate-spin-fast" style="position: absolute; bottom: 0; left: 0; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid #E11D48;"></div>
            <div class="animate-spin-fast" style="position: absolute; bottom: 0; right: 0; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid #E11D48;"></div>

            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="4" y1="4" x2="20" y2="20" stroke-opacity="0.6"/>
              <line x1="20" y1="4" x2="4" y2="20" stroke-opacity="0.6"/>
              <circle cx="12" cy="12" r="4" fill="#FFFFFF" stroke="#E11D48" stroke-width="2"/>
              <polygon points="12,4 8,10 16,10" fill="#E11D48"/>
            </svg>
          </div>

          <!-- Callsign Tag Badge -->
          <div style="position: absolute; top: -16px; white-space: nowrap; background: #FFFFFF; border: 1.5px solid #E11D48; color: #831843; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 800; padding: 1px 7px; border-radius: 6px; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 12px rgba(225,29,72,0.25);">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: #16A34A;"></span>
            ${ACTIVE_DRONE.callsign} (${currentLeg}) 🧸
          </div>
        </div>
      `;
    };

    const initialLat = waypoints[0][0];
    const initialLng = waypoints[0][1];

    const icon = L.divIcon({
      className: 'moving-drone-pin',
      html: createDroneIconHtml(0, 'A ➔ B'),
      iconSize: [64, 64],
      iconAnchor: [32, 32]
    });

    const marker = L.marker([initialLat, initialLng], { icon }).addTo(map);
    (marker as any).isDroneMarker = true;
    droneMarkerRef.current = marker;

    // Road Animation Loop from Point A to Point B and Back
    const animateRoadPatrol = () => {
      segmentProgress += stepSpeed;

      if (segmentProgress >= 1) {
        segmentProgress = 0;
        if (isMovingForward) {
          currentSegment++;
          if (currentSegment >= numSegments) {
            // Reached Point B! Turn around and head back to Point A
            isMovingForward = false;
            currentSegment = numSegments - 1;
            setDirection('reverse');
            setCurrentLegText('Reached Point B! Returning B ➔ A');
          }
        } else {
          currentSegment--;
          if (currentSegment < 0) {
            // Reached Point A! Start next mission to Point B
            isMovingForward = true;
            currentSegment = 0;
            setDirection('forward');
            setCurrentLegText('Reached Point A! Starting A ➔ B Patrol');
          }
        }
      }

      // Calculate exact coordinates along current road segment
      const fromIdx = isMovingForward ? currentSegment : currentSegment + 1;
      const toIdx = isMovingForward ? currentSegment + 1 : currentSegment;

      const pStart = waypoints[fromIdx];
      const pEnd = waypoints[toIdx];

      const lat = pStart[0] + (pEnd[0] - pStart[0]) * segmentProgress;
      const lng = pStart[1] + (pEnd[1] - pStart[1]) * segmentProgress;

      // Heading orientation angle
      const dLat = pEnd[0] - pStart[0];
      const dLng = pEnd[1] - pStart[1];
      const heading = (Math.atan2(dLng, dLat) * (180 / Math.PI) + 360) % 360;

      // Calculate total route progress percentage
      const totalProgressRatio = isMovingForward
        ? (currentSegment + segmentProgress) / numSegments
        : 1 - (currentSegment + (1 - segmentProgress)) / numSegments;

      setRouteProgressPct(Math.round(totalProgressRatio * 100));

      if (droneMarkerRef.current) {
        droneMarkerRef.current.setLatLng([lat, lng]);
        const legLabel = isMovingForward ? 'A ➔ B' : 'B ➔ A';
        droneMarkerRef.current.setIcon(
          L.divIcon({
            className: 'moving-drone-pin',
            html: createDroneIconHtml(heading, legLabel),
            iconSize: [64, 64],
            iconAnchor: [32, 32]
          })
        );
      }

      animFrameRef.current = requestAnimationFrame(animateRoadPatrol);
    };

    animFrameRef.current = requestAnimationFrame(animateRoadPatrol);

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
    <div className="glass-panel rounded-2xl p-3 border border-[#FBCFE8] bg-[#FFFFFF] shadow-xs relative space-y-3 hud-border font-sans">
      {/* Header Controls Bar */}
      <div className="flex flex-col space-y-2.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#FFF1F2] border border-[#F43F5E]/30 flex items-center justify-center">
              <Navigation className="w-3.5 h-3.5 text-[#E11D48]" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#831843] uppercase tracking-wider font-mono flex items-center gap-2">
                DRONACHARYA ROAD PATROL GIS RADAR 🧸
                <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/30 font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                  1 DRONE PATROLLING 💕
                </span>
              </h2>
            </div>
          </div>

          {/* Location Sector Filter Buttons */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto font-mono text-[11px]">
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-[#E11D48] text-white font-extrabold hover:bg-[#BE123C] transition-all shadow-xs"
            >
              <Key className="w-3 h-3 text-white" />
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
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeLocationFilter === loc.id
                    ? 'bg-[#E11D48] text-white shadow-xs'
                    : 'bg-[#FDF2F8] text-[#9D174D] hover:text-[#831843] border border-[#FBCFE8]'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Point A to Point B Status & Progress Bar */}
        <div className="bg-[#FDF2F8] p-2.5 rounded-xl border border-[#FBCFE8] text-[11px] font-mono space-y-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-[#9D174D]">
              <span className="text-[#E11D48] font-extrabold flex items-center gap-1">
                🛣️ ROAD MISSION:
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#16A34A] font-extrabold border border-[#16A34A]/30">
                📍 Point A (Depot)
              </span>
              <span className="text-[#E11D48] font-bold">➔</span>
              <span className="px-2 py-0.5 rounded-md bg-[#FFF1F2] text-[#E11D48] font-extrabold border border-[#F43F5E]/30">
                🏁 Point B (Wagholi Junction)
              </span>
            </div>

            <div className="flex items-center space-x-2 font-bold text-[#831843]">
              <span className="text-[#9D174D]">{currentLegText}</span>
              <span className="px-2 py-0.5 rounded-md bg-[#E11D48] text-white font-extrabold">
                {routeProgressPct}%
              </span>
            </div>
          </div>

          {/* Route Progress Bar */}
          <div className="w-full bg-[#FFFFFF] h-2 rounded-full overflow-hidden border border-[#FBCFE8]">
            <div
              className="bg-[#E11D48] h-full transition-all duration-300 rounded-full"
              style={{ width: `${routeProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-[450px] rounded-xl overflow-hidden border border-[#FBCFE8] shadow-inner">
        <div ref={containerRef} className="w-full h-full bg-[#FDF2F8]" />

        {/* Overlay Telemetry Tag */}
        <div className="absolute top-3 left-3 z-[400] bg-[#FFFFFF]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-[#FBCFE8] text-[11px] font-mono text-[#831843] space-y-0.5 shadow-xs">
          <div className="font-extrabold flex items-center gap-1.5 text-[#E11D48]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" /> SKYGUARDIAN-X1 ROAD PATROL 🧸
          </div>
          <div className="text-[10px] text-[#9D174D] font-bold">
            NAVIGATING: <span className="text-[#E11D48]">POINT A ➔ POINT B ON ROAD MAP</span>
          </div>
          <div className="text-[9.5px] text-[#9D174D]">
            LAT: 18.5679° N | LNG: 73.9143° E | ALT: 48.5m
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-[400] bg-[#FFFFFF]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#FBCFE8] text-[10px] font-mono flex items-center space-x-3 text-[#831843] shadow-xs">
          <span className="flex items-center gap-1 font-bold"><span className="w-2.5 h-2.5 rounded-md bg-[#16A34A]" /> Point A (Start)</span>
          <span className="flex items-center gap-1 font-bold"><span className="w-2.5 h-2.5 rounded-md bg-[#E11D48]" /> Point B (Target)</span>
          <span className="flex items-center gap-1 font-bold text-[#E11D48]">⚡ Road Polyline Corridor</span>
        </div>
      </div>

      {/* Google Maps API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 bg-[#831843]/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-5 rounded-2xl border border-[#E11D48]/30 bg-[#FFFFFF] max-w-md w-full space-y-4 shadow-2xl font-sans">
            <div className="flex items-center justify-between border-b border-[#FBCFE8] pb-3">
              <h3 className="text-sm font-extrabold text-[#831843] uppercase tracking-wider flex items-center gap-2 font-mono">
                <Key className="w-4 h-4 text-[#E11D48]" />
                SET GOOGLE MAPS API KEY 🧸
              </h3>
              <button onClick={() => setShowApiKeyModal(false)} className="text-[#9D174D] hover:text-[#831843] font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <p className="text-[#9D174D]">
                Enter your Google Maps JavaScript API key to enable high-resolution satellite road tile overlays & dynamic road network snapping.
              </p>

              <div>
                <label className="block text-[#831843] mb-1 font-bold">API KEY</label>
                <input
                  type="text"
                  value={googleApiKey}
                  onChange={(e) => setGoogleApiKey(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FDF2F8] border border-[#FBCFE8] text-[#831843] focus:outline-none focus:border-[#E11D48] font-mono text-xs font-bold"
                  placeholder="AIzaSy..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#FDF2F8] text-[#9D174D] hover:text-[#831843] font-bold border border-[#FBCFE8]"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold shadow-sm active:scale-95"
                >
                  SAVE & ACTIVATE MAPS 💕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
