import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Defect } from '../types';
import { Navigation, Cpu, Layers, MapPin, Radio, ShieldAlert } from 'lucide-react';

interface MapViewProps {
  defects: Defect[];
  selectedDefect: Defect | null;
  onSelectDefect: (defect: Defect) => void;
}

export const GoogleMapView: React.FC<MapViewProps> = ({
  defects,
  selectedDefect,
  onSelectDefect
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeAssetFilter, setActiveAssetFilter] = useState<string>('all');
  const [activeLocationFilter, setActiveLocationFilter] = useState<string>('all');

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      // Initialize Leaflet map centered on Pune Region, MH
      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([18.5520, 73.9400], 12);

      // CartoDB Dark Matter map tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Drone Flight Corridor Polyline
      const flightCoords: L.LatLngExpression[] = [
        [18.5679, 73.9143], // Viman Nagar
        [18.5515, 73.9348], // Kharadi
        [18.5808, 73.9818], // Wagholi
        [18.5089, 73.9259], // Hadapsar
        [18.5679, 73.9143]  // Loop back
      ];

      L.polyline(flightCoords, {
        color: '#00f3ff',
        weight: 2,
        dashArray: '8, 8',
        opacity: 0.85
      }).addTo(map);

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Clear previous markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Filter defects by asset type & location
    const filteredDefects = defects.filter(d => {
      const matchAsset = activeAssetFilter === 'all' || d.assetType.toLowerCase() === activeAssetFilter.toLowerCase();
      const matchLoc = activeLocationFilter === 'all' || d.locationName.toLowerCase().includes(activeLocationFilter.toLowerCase());
      return matchAsset && matchLoc;
    });

    // Plot pins with animated tactical SVG markers
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
            ${defect.riskLevel} RISK (${defect.riskScore}/100)
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
                PUNE GIS OPERATIONAL RADAR
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                  LIVE GIS
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

        {/* Asset Category Filters */}
        <div className="flex items-center space-x-1.5 bg-[#05070B] p-1 rounded-lg border border-white/[0.06] text-[11px] font-mono overflow-x-auto">
          <span className="text-slate-500 font-semibold px-2 flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" /> FILTER:
          </span>
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'road', label: '🛣️ Roads' },
            { id: 'bridge', label: '🌉 Bridges' },
            { id: 'railway', label: '🚆 Railways' },
            { id: 'building', label: '🏢 Facades' }
          ].map(asset => (
            <button
              key={asset.id}
              onClick={() => setActiveAssetFilter(asset.id)}
              className={`px-2.5 py-0.5 rounded font-medium transition-all whitespace-nowrap ${
                activeAssetFilter === asset.id
                  ? 'bg-cyan-500 text-aerospace-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {asset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-[450px] rounded-lg overflow-hidden border border-white/[0.08] shadow-inner">
        <div ref={containerRef} className="w-full h-full bg-[#05070B]" />

        {/* Floating Telemetry Stats Box */}
        <div className="absolute top-3 left-3 z-[400] bg-[#0A0F17]/90 backdrop-blur-md border border-white/[0.08] p-2.5 rounded-lg text-xs space-y-1 shadow-xl max-w-xs pointer-events-auto font-mono">
          <div className="flex items-center justify-between text-slate-400 border-b border-white/[0.08] pb-1">
            <span className="font-bold text-slate-200 text-[11px] flex items-center gap-1.5 uppercase">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> PUNE RADAR CORRIDOR
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
            <div>
              <span className="text-slate-500 block">SECTOR</span>
              <span className="text-cyan-400 font-bold">Pune MH (5G RTK)</span>
            </div>
            <div>
              <span className="text-slate-500 block">ACTIVE TARGETS</span>
              <span className="text-emerald-400 font-bold">{filteredCount} Markers</span>
            </div>
          </div>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-3 right-3 z-[400] bg-[#0A0F17]/90 backdrop-blur-md border border-white/[0.08] px-3 py-1.5 rounded-lg text-[10px] font-mono flex items-center space-x-3 shadow-xl">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500 animate-pulse" />
            <span className="text-slate-300">Critical</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-slate-300">High</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

