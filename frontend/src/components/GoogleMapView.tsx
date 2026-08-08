import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Defect } from '../types';
import { Navigation, Cpu, Layers, MapPin, Eye } from 'lucide-react';

interface MapViewProps {
  defects: Defect[];
  selectedDefect: Defect | null;
  onSelectDefect: (defect: Defect) => void;
  activeAssetFilter?: string;
  onAssetFilterChange?: (filter: string) => void;
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
      // Initialize Leaflet map centered on Pune Region, Maharashtra
      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([18.5520, 73.9400], 12); // Centered on Pune

      // CartoDB Dark Matter map tile layer - renders visual roads, bridges, streets & terrain
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Draw Drone Corridor Flight Path Polyline connecting Viman Nagar -> Kharadi -> Wagholi -> Hadapsar
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
        dashArray: '6, 6',
        opacity: 0.8
      }).addTo(map);

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Remove existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Filter defects by assetType and location
    const filteredDefects = defects.filter(d => {
      const matchAsset = activeAssetFilter === 'all' || d.assetType.toLowerCase() === activeAssetFilter.toLowerCase();
      const matchLoc = activeLocationFilter === 'all' || d.locationName.toLowerCase().includes(activeLocationFilter.toLowerCase());
      return matchAsset && matchLoc;
    });

    const bounds = L.latLngBounds([]);

    // Plot Pune infrastructure pins
    filteredDefects.forEach((defect) => {
      let pinColor = '#10B981'; // Green
      if (defect.riskLevel === 'CRITICAL') pinColor = '#EF4444'; // Red
      else if (defect.riskLevel === 'HIGH') pinColor = '#F97316'; // Orange
      else if (defect.riskLevel === 'MEDIUM') pinColor = '#F59E0B'; // Yellow

      const customIcon = L.divIcon({
        className: 'pune-map-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background-color: ${pinColor}; opacity: 0.35; animation: ping 1.5s infinite;"></div>
            <div style="position: relative; width: 24px; height: 24px; border-radius: 50%; background-color: ${pinColor}; border: 2px solid white; box-shadow: 0 0 14px ${pinColor}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 10px;">
              ${defect.riskScore}
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([defect.lat, defect.lng], { icon: customIcon }).addTo(map);

      const popupHtml = `
        <div style="font-family: sans-serif; color: #0F172A; padding: 4px; max-width: 220px;">
          <div style="font-size: 10px; font-weight: 700; color: ${pinColor}; text-transform: uppercase;">
            ${defect.riskLevel} RISK (${defect.riskScore}/100)
          </div>
          <div style="font-size: 13px; font-weight: 700; margin-top: 2px; line-height: 1.2;">
            ${defect.title}
          </div>
          <div style="font-size: 11px; color: #64748B; margin-top: 4px;">
            📍 ${defect.locationName}
          </div>
          <div style="font-size: 11px; font-weight: 700; color: #0F172A; margin-top: 6px;">
            Est. Repair: ₹${defect.costEstimation?.total_estimated_cost?.toLocaleString()}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectDefect(defect);
      });

      bounds.extend([defect.lat, defect.lng]);
    });

    if (selectedDefect && map) {
      map.setView([selectedDefect.lat, selectedDefect.lng], 14, { animate: true });
    }
  }, [defects, selectedDefect, activeAssetFilter, activeLocationFilter]);

  const filteredDefectsCount = defects.filter(d => {
    const matchAsset = activeAssetFilter === 'all' || d.assetType.toLowerCase() === activeAssetFilter.toLowerCase();
    const matchLoc = activeLocationFilter === 'all' || d.locationName.toLowerCase().includes(activeLocationFilter.toLowerCase());
    return matchAsset && matchLoc;
  }).length;

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 bg-[#0c1220]/90 shadow-2xl relative space-y-3">
      {/* Header & Filter Controls Bar */}
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Navigation className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Pune Region GIS Command Map
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                  LIVE GIS
                </span>
              </h2>
              <p className="text-xs text-slate-400">Monitoring Viman Nagar, Kharadi & Wagholi Infrastructure Corridors</p>
            </div>
          </div>

          {/* Location Sector Filter Badges */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Pune' },
              { id: 'viman nagar', label: 'Viman Nagar' },
              { id: 'kharadi', label: 'Kharadi' },
              { id: 'wagholi', label: 'Wagholi' }
            ].map(loc => (
              <button
                key={loc.id}
                onClick={() => setActiveLocationFilter(loc.id)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all font-medium ${
                  activeLocationFilter === loc.id
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Asset Category Filters: All, Roads, Bridges, Railways, Buildings */}
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs overflow-x-auto">
          <span className="text-slate-400 font-semibold text-[11px] px-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Asset Filter:
          </span>
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'road', label: '🛣️ Roads & Highways' },
            { id: 'bridge', label: '🌉 Bridges & Flyovers' },
            { id: 'railway', label: '🚆 Railway Tracks' },
            { id: 'building', label: '🏢 Buildings & Facades' }
          ].map(asset => (
            <button
              key={asset.id}
              onClick={() => setActiveAssetFilter(asset.id)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeAssetFilter === asset.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {asset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actual Visual GIS Map Canvas Container */}
      <div className="relative w-full h-[430px] rounded-xl overflow-hidden border border-slate-800 shadow-inner">
        <div ref={containerRef} className="w-full h-full bg-[#06080f]" />

        {/* Floating Telemetry Stats Overlay */}
        <div className="absolute top-3 left-3 z-[400] bg-[#090d16]/95 backdrop-blur-md border border-slate-800 p-3 rounded-xl text-xs space-y-1.5 shadow-xl max-w-xs pointer-events-auto">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Pune Sector Radar
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
            <div>
              <span className="text-slate-400 block">Region</span>
              <span className="font-mono text-cyan-300 font-bold">Pune Region (MH)</span>
            </div>
            <div>
              <span className="text-slate-400 block">Active Markers</span>
              <span className="font-mono text-emerald-400 font-bold">{filteredDefectsCount} Locations</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 right-3 z-[400] bg-[#090d16]/95 backdrop-blur-md border border-slate-800 px-3 py-2 rounded-xl text-[11px] flex items-center space-x-4 shadow-xl">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500" />
            <span className="text-slate-300">Critical</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-slate-300">High</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
};
