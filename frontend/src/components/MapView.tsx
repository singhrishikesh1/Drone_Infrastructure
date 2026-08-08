import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Defect } from '../types';
import { ShieldAlert, MapPin, Eye } from 'lucide-react';

interface MapViewProps {
  defects: Defect[];
  selectedDefect: Defect | null;
  onSelectDefect: (defect: Defect) => void;
}

export const MapView: React.FC<MapViewProps> = ({ defects, selectedDefect, onSelectDefect }) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      // Initialize Leaflet map centered over India
      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([20.5937, 78.9629], 5);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapRef.current = map;
    }

    const map = mapRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    const bounds = L.latLngBounds([]);

    // Plot defect markers
    defects.forEach((defect) => {
      let colorClass = '#10B981'; // Green
      if (defect.riskLevel === 'CRITICAL') colorClass = '#EF4444'; // Red
      else if (defect.riskLevel === 'HIGH') colorClass = '#F97316'; // Orange
      else if (defect.riskLevel === 'MEDIUM') colorClass = '#F59E0B'; // Yellow

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background-color: ${colorClass}; opacity: 0.3; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 22px; height: 22px; border-radius: 50%; background-color: ${colorClass}; border: 2px solid white; box-shadow: 0 0 12px ${colorClass}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">
              ${defect.riskScore}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([defect.lat, defect.lng], { icon: customIcon }).addTo(map);

      // Popup HTML content
      const popupHtml = `
        <div style="font-family: 'Inter', sans-serif; color: #0F172A; padding: 4px; max-width: 220px;">
          <div style="font-size: 10px; font-weight: 700; color: ${colorClass}; text-transform: uppercase;">
            ${defect.riskLevel} RISK (${defect.riskScore}/100)
          </div>
          <div style="font-size: 13px; font-weight: 700; margin-top: 2px; line-height: 1.2;">
            ${defect.defectClass}
          </div>
          <div style="font-size: 11px; color: #64748B; margin-top: 4px;">
            📍 ${defect.assetName}
          </div>
          <div style="font-size: 11px; font-weight: 600; color: #0F172A; margin-top: 6px;">
            Est Repair: ₹${defect.costEstimation?.total_estimated_cost?.toLocaleString()}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectDefect(defect);
      });

      bounds.extend([defect.lat, defect.lng]);
    });

    if (defects.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [defects]);

  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden glass-panel border border-slate-800 shadow-2xl">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Overlay GIS Map Header */}
      <div className="absolute top-4 left-4 z-[400] glass-panel px-3.5 py-2 rounded-xl flex items-center space-x-2 border border-slate-700/60 shadow-lg">
        <MapPin className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit']">
          Interactive GIS Defect Map ({defects.length} Active Pins)
        </span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[400] glass-panel p-2.5 rounded-xl border border-slate-800 flex items-center space-x-3 text-[11px] font-medium text-slate-300">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500"></span>
          <span>Urgent Repair</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          <span>High</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
          <span>Medium</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Low</span>
        </div>
      </div>
    </div>
  );
};
