import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Defect } from '../types';
import { Navigation, Key, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from './ToastNotification';

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

// Point A & Point B positioned strictly on Nagar Road (the main yellow highway line)
const POINT_A_COORDS: [number, number] = [18.5575, 73.9140]; // Point A: Nagar Road (Viman Nagar Depot)
const POINT_B_COORDS: [number, number] = [18.5808, 73.9818]; // Point B: Nagar Road (Wagholi Junction Target)

// Dense 13-point road curve geometry calibrated strictly to the yellow Nagar Road highway line
const ACTIVE_DRONE: SingleDroneUnit = {
  id: 'DRONE-PUNE-01',
  callsign: 'SkyGuardian-X1',
  name: 'SkyGuardian-X1 Autonomous Patrol',
  model: 'Matrice 300 RTK Industrial',
  status: 'FLYING STRICTLY ALONG NAGAR ROAD HIGHWAY',
  battery: 88,
  speedKmH: 24.2,
  altitude: 48.5,
  sector: 'Nagar Road Highway (Point A ➔ Point B)',
  color: '#0284C7',
  roadCorridor: [
    [18.5575, 73.9140], // Point A: Nagar Road (Viman Nagar Depot)
    [18.5590, 73.9190], // Nagar Road
    [18.5610, 73.9250], // Nagar Road
    [18.5630, 73.9310], // Nagar Road
    [18.5652, 73.9370], // Nagar Road
    [18.5672, 73.9430], // Nagar Road (Kharadi Bypass)
    [18.5694, 73.9490], // Nagar Road
    [18.5716, 73.9550], // Nagar Road
    [18.5738, 73.9610], // Nagar Road
    [18.5760, 73.9670], // Nagar Road
    [18.5782, 73.9730], // Nagar Road
    [18.5800, 73.9780], // Nagar Road
    [18.5808, 73.9818]  // Point B: Nagar Road (Wagholi Target)
  ]
};

export const GoogleMapView: React.FC<MapViewProps> = ({
  defects,
  selectedDefect,
  onSelectDefect
}) => {
  const { resolvedTheme } = useTheme();
  const { addToast } = useToast();
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const droneMarkerRef = useRef<L.Marker | null>(null);
  const roadPolylineRef = useRef<L.Polyline | null>(null);
  const pointAMarkerRef = useRef<L.Marker | null>(null);
  const pointBMarkerRef = useRef<L.Marker | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [activeLocationFilter, setActiveLocationFilter] = useState<string>('all');
  const [googleApiKey, setGoogleApiKey] = useState<string>(
    (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || ''
  );
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>(googleApiKey);

  const [routeProgressPct, setRouteProgressPct] = useState<number>(0);
  const [currentLegText, setCurrentLegText] = useState<string>('Flying strictly above Nagar Road: Point A ➔ Point B');

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([18.5680, 73.9450], 13);

    const tileUrl = resolvedTheme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;

    // Point A Marker (Depot on Nagar Road)
    const pointAIcon = L.divIcon({
      className: 'point-a-pin',
      html: `
        <div style="background: #16A34A; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; padding: 5px 9px; border-radius: 8px; border: 2px solid #FFFFFF; box-shadow: 0 4px 12px rgba(22,163,74,0.5); display: flex; align-items: center; gap: 4px; white-space: nowrap;">
          📍 POINT A (Depot)
        </div>
      `,
      iconSize: [110, 28],
      iconAnchor: [55, 14]
    });
    pointAMarkerRef.current = L.marker(POINT_A_COORDS, { icon: pointAIcon }).addTo(map);

    // Point B Marker (Target on Nagar Road)
    const pointBIcon = L.divIcon({
      className: 'point-b-pin',
      html: `
        <div style="background: #E11D48; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; padding: 5px 9px; border-radius: 8px; border: 2px solid #FFFFFF; box-shadow: 0 4px 12px rgba(225,29,72,0.5); display: flex; align-items: center; gap: 4px; white-space: nowrap;">
          🏁 POINT B (Target)
        </div>
      `,
      iconSize: [110, 28],
      iconAnchor: [55, 14]
    });
    pointBMarkerRef.current = L.marker(POINT_B_COORDS, { icon: pointBIcon }).addTo(map);

  }, []);

  // Sync Map Theme Tiles
  useEffect(() => {
    if (!mapRef.current) return;
    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }
    const tileUrl = resolvedTheme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(mapRef.current);
  }, [resolvedTheme]);

  // Update Defect Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && !(layer as any).isDroneMarker && layer !== pointAMarkerRef.current && layer !== pointBMarkerRef.current) {
        map.removeLayer(layer);
      }
    });

    const filteredDefects = defects.filter(d => {
      return activeLocationFilter === 'all' || d.locationName.toLowerCase().includes(activeLocationFilter.toLowerCase());
    });

    filteredDefects.forEach((defect) => {
      let pinColor = '#16A34A';
      if (defect.riskLevel === 'CRITICAL') pinColor = '#E11D48';
      else if (defect.riskLevel === 'HIGH' || defect.riskLevel === 'MEDIUM') pinColor = '#D97706';

      const customIcon = L.divIcon({
        className: 'pune-map-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background-color: ${pinColor}; opacity: 0.3;"></div>
            <div style="width: 14px; height: 14px; border-radius: 50%; background-color: ${pinColor}; border: 2.5px solid #FFFFFF; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([defect.lat, defect.lng], { icon: customIcon }).addTo(map);
      marker.on('click', () => onSelectDefect(defect));
    });

    if (selectedDefect && map) {
      map.setView([selectedDefect.lat, selectedDefect.lng], 14, { animate: true });
    }
  }, [defects, selectedDefect, activeLocationFilter]);

  // Render High Precision Polyline Corridor directly along Nagar Road
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (roadPolylineRef.current) {
      map.removeLayer(roadPolylineRef.current);
    }

    const strokeColor = resolvedTheme === 'dark' ? '#38BDF8' : '#0284C7';

    const polyline = L.polyline(ACTIVE_DRONE.roadCorridor, {
      color: strokeColor,
      weight: 5,
      dashArray: '6, 8',
      opacity: 0.95
    }).addTo(map);

    roadPolylineRef.current = polyline;
  }, [resolvedTheme]);

  // Patrol Loop Animation (Drone flying strictly above Nagar Road)
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
    const stepSpeed = 0.008; // Smooth, precise flight along Nagar Road segments

    const createDroneIconHtml = (headingAngle: number, currentLeg: string) => {
      const activeColor = resolvedTheme === 'dark' ? '#38BDF8' : '#0284C7';
      const bgCard = resolvedTheme === 'dark' ? '#1E293B' : '#FFFFFF';
      const textColor = resolvedTheme === 'dark' ? '#F8FAFC' : '#0F172A';

      return `
        <div style="position: relative; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; border: 2px solid ${activeColor}; opacity: 0.45; animation: ping 1.5s infinite;"></div>
          <div style="transform: rotate(${headingAngle.toFixed(1)}deg); position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${activeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="4" y1="4" x2="20" y2="20" stroke-opacity="0.6"/>
              <line x1="20" y1="4" x2="4" y2="20" stroke-opacity="0.6"/>
              <circle cx="12" cy="12" r="4" fill="${bgCard}" stroke="${activeColor}" stroke-width="2"/>
              <polygon points="12,4 8,10 16,10" fill="${activeColor}"/>
            </svg>
          </div>
          <div style="position: absolute; top: -14px; white-space: nowrap; background: ${bgCard}; border: 1.5px solid ${activeColor}; color: ${textColor}; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 5px; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 10px rgba(0,0,0,0.18);">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: #16A34A;"></span>
            ${ACTIVE_DRONE.callsign} (${currentLeg})
          </div>
        </div>
      `;
    };

    const initialLat = waypoints[0][0];
    const initialLng = waypoints[0][1];

    const icon = L.divIcon({
      className: 'moving-drone-pin',
      html: createDroneIconHtml(0, 'A ➔ B'),
      iconSize: [60, 60],
      iconAnchor: [30, 30]
    });

    const marker = L.marker([initialLat, initialLng], { icon }).addTo(map);
    (marker as any).isDroneMarker = true;
    droneMarkerRef.current = marker;

    const animateRoadPatrol = () => {
      segmentProgress += stepSpeed;

      if (segmentProgress >= 1) {
        segmentProgress = 0;
        if (isMovingForward) {
          currentSegment++;
          if (currentSegment >= numSegments) {
            isMovingForward = false;
            currentSegment = numSegments - 1;
            setCurrentLegText('Reached Point B (Wagholi). Returning B ➔ A directly above Nagar Road');
          }
        } else {
          currentSegment--;
          if (currentSegment < 0) {
            isMovingForward = true;
            currentSegment = 0;
            setCurrentLegText('Reached Point A (Depot). Starting A ➔ B directly above Nagar Road');
          }
        }
      }

      const fromIdx = isMovingForward ? currentSegment : currentSegment + 1;
      const toIdx = isMovingForward ? currentSegment + 1 : currentSegment;

      const pStart = waypoints[fromIdx];
      const pEnd = waypoints[toIdx];

      const lat = pStart[0] + (pEnd[0] - pStart[0]) * segmentProgress;
      const lng = pStart[1] + (pEnd[1] - pStart[1]) * segmentProgress;

      const dLat = pEnd[0] - pStart[0];
      const dLng = pEnd[1] - pStart[1];
      const heading = (Math.atan2(dLng, dLat) * (180 / Math.PI) + 360) % 360;

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
            iconSize: [60, 60],
            iconAnchor: [30, 30]
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
  }, [resolvedTheme]);

  const handleSaveApiKey = () => {
    setGoogleApiKey(apiKeyInput);
    setShowApiKeyModal(false);
    addToast('success', 'Maps API Key Updated', 'Google Maps configuration saved successfully.');
  };

  return (
    <div className="app-card p-4 space-y-3 font-sans">
      {/* Header Controls Bar */}
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 flex items-center justify-center shrink-0">
              <Navigation className="w-4 h-4 text-[var(--brand-primary)]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono flex items-center gap-2">
                NAGAR ROAD HIGHWAY PATROL RADAR
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)] font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)] animate-pulse" />
                  HIGHWAY PATROL
                </span>
              </h3>
            </div>
          </div>

          {/* Location Sector Filter Buttons & API Key Button */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto font-mono text-[11px]">
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[var(--text-primary)] font-semibold transition-all shadow-xs"
            >
              <Key className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span>{googleApiKey ? 'API KEY SET' : 'CONFIGURE MAPS API'}</span>
            </button>

            {[
              { id: 'all', label: 'Nagar Road Corridor' },
              { id: 'viman nagar', label: 'Viman Nagar' },
              { id: 'kharadi', label: 'Kharadi' },
              { id: 'wagholi', label: 'Wagholi' }
            ].map((loc) => (
              <button
                key={loc.id}
                onClick={() => setActiveLocationFilter(loc.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeLocationFilter === loc.id
                    ? 'bg-[var(--brand-primary)] text-white shadow-xs'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Patrol Route Status & Progress Bar */}
        <div className="bg-[var(--bg-elevated)] p-3 rounded-xl border border-[var(--border-subtle)] text-xs font-mono space-y-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
              <span className="text-[var(--brand-primary)] font-bold">NAGAR ROAD ROUTE:</span>
              <span className="px-2 py-0.5 rounded bg-[var(--status-success-bg)] text-[var(--status-success)] border border-[var(--status-success-border)] font-bold text-[10px]">
                Point A (Depot)
              </span>
              <span>➔</span>
              <span className="px-2 py-0.5 rounded bg-[var(--status-critical-bg)] text-[var(--status-critical)] border border-[var(--status-critical-border)] font-bold text-[10px]">
                Point B (Wagholi)
              </span>
            </div>

            <div className="flex items-center space-x-2 font-bold text-[var(--text-primary)]">
              <span className="text-[var(--text-secondary)] text-[11px]">{currentLegText}</span>
              <span className="px-2 py-0.5 rounded bg-[var(--brand-primary)] text-white font-mono text-[11px]">
                {routeProgressPct}%
              </span>
            </div>
          </div>

          <div className="w-full bg-[var(--bg-surface)] h-2 rounded-full overflow-hidden border border-[var(--border-subtle)]">
            <div
              className="bg-[var(--brand-primary)] h-full transition-all duration-300 rounded-full"
              style={{ width: `${routeProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-[450px] rounded-xl overflow-hidden border border-[var(--border-subtle)] shadow-inner">
        <div ref={containerRef} className="w-full h-full bg-[var(--bg-app)]" />

        {/* Telemetry Tag */}
        <div className="absolute top-3 left-3 z-[400] bg-[var(--bg-surface)]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] space-y-1 shadow-md">
          <div className="font-bold flex items-center gap-2 text-[var(--brand-primary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse" /> SKYGUARDIAN-X1 ROAD PATROL
          </div>
          <div className="text-[11px] text-[var(--text-secondary)]">
            NAVIGATING: <span className="text-[var(--text-primary)] font-semibold">STRICTLY ABOVE NAGAR ROAD HIGHWAY</span>
          </div>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-3 left-3 z-[400] bg-[var(--bg-surface)]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] text-[11px] font-mono flex items-center space-x-3 text-[var(--text-secondary)] shadow-md">
          <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-sm bg-[#16A34A]" /> Point A (Viman Nagar)</span>
          <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-sm bg-[#E11D48]" /> Point B (Wagholi)</span>
          <span className="flex items-center gap-1.5 font-medium text-[var(--brand-primary)]">⚡ Nagar Road Highway Corridor</span>
        </div>
      </div>

      {/* Google Maps API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-subtle)] max-w-md w-full space-y-4 shadow-2xl font-sans animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2 font-mono">
                <Key className="w-4 h-4 text-[var(--brand-primary)]" />
                Configure Google Maps API Key
              </h3>
              <button onClick={() => setShowApiKeyModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <p className="text-[var(--text-secondary)]">
                Provide your Google Maps JavaScript API Key to enable high-resolution satellite imagery, terrain tiles, and dynamic road snapping.
              </p>

              <div>
                <label className="block text-[var(--text-primary)] mb-1 font-bold">API KEY</label>
                <input
                  type="text"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] font-mono text-xs"
                  placeholder="AIzaSy..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold border border-[var(--border-subtle)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-4 py-2 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-semibold shadow-xs active:scale-95"
                >
                  Save & Activate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
