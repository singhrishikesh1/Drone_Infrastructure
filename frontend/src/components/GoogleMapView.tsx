import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Defect } from '../types';
import { Navigation, Cpu, MapPin, AlertTriangle } from 'lucide-react';

interface GoogleMapViewProps {
  defects: Defect[];
  selectedDefect: Defect | null;
  onSelectDefect: (defect: Defect) => void;
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#090d16' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#090d16' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#748296' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#38bdf8' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#0284c7' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#0b192c' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f172a' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#0284c7' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#0369a1' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#03203c' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#0284c7' }] }
];

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  defects,
  selectedDefect,
  onSelectDefect
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [useFallbackCanvas, setUseFallbackCanvas] = useState<boolean>(false);
  const [activeLocationFilter, setActiveLocationFilter] = useState<string>('all');
  const googleMapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
    if (!apiKey) {
      setUseFallbackCanvas(true);
      return;
    }

    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['places']
    });

    (loader as any).load().then(() => {
      if (!mapRef.current) return;
      const puneCenter = { lat: 18.5520, lng: 73.9400 };

      const map = new google.maps.Map(mapRef.current, {
        center: puneCenter,
        zoom: 12,
        styles: darkMapStyle,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false
      });

      googleMapInstance.current = map;

      const flightPathCoords = [
        { lat: 18.5679, lng: 73.9143 },
        { lat: 18.5515, lng: 73.9348 },
        { lat: 18.5808, lng: 73.9818 },
        { lat: 18.5089, lng: 73.9259 },
        { lat: 18.5679, lng: 73.9143 }
      ];

      const flightPath = new google.maps.Polyline({
        path: flightPathCoords,
        geodesic: true,
        strokeColor: '#00f3ff',
        strokeOpacity: 0.8,
        strokeWeight: 2
      });

      flightPath.setMap(map);
    }).catch(err => {
      console.log('Google Maps API fallback active:', err.message);
      setUseFallbackCanvas(true);
    });
  }, []);

  useEffect(() => {
    if (!googleMapInstance.current || !window.google) return;

    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    const map = googleMapInstance.current;
    const filteredDefects = activeLocationFilter === 'all' 
      ? defects 
      : defects.filter(d => d.locationName.toLowerCase().includes(activeLocationFilter.toLowerCase()));

    filteredDefects.forEach(defect => {
      let pinColor = '#10b981';
      if (defect.riskLevel === 'CRITICAL') pinColor = '#ef4444';
      else if (defect.riskLevel === 'HIGH') pinColor = '#f97316';
      else if (defect.riskLevel === 'MEDIUM') pinColor = '#f59e0b';

      const marker = new google.maps.Marker({
        position: { lat: defect.lat, lng: defect.lng },
        map: map,
        title: defect.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: pinColor,
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="color: #0f172a; padding: 6px; font-family: sans-serif;">
            <div style="font-weight: 700; font-size: 14px;">${defect.title}</div>
            <div style="font-size: 12px; color: #475569; margin-top: 2px;">📍 ${defect.locationName}</div>
            <div style="margin-top: 6px; display: flex; gap: 8px;">
              <span style="background: ${pinColor}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600;">${defect.riskLevel}</span>
              <span style="font-size: 12px; font-weight: 600;">₹${defect.costEstimation?.total_estimated_cost?.toLocaleString()}</span>
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        onSelectDefect(defect);
      });

      markersRef.current.push(marker);
    });

    if (selectedDefect && window.google) {
      map.panTo({ lat: selectedDefect.lat, lng: selectedDefect.lng });
      map.setZoom(14);
    }
  }, [defects, selectedDefect, activeLocationFilter]);

  const filteredDefects = activeLocationFilter === 'all' 
    ? defects 
    : defects.filter(d => d.locationName.toLowerCase().includes(activeLocationFilter.toLowerCase()));

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 bg-[#0c1220]/90 shadow-2xl relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Navigation className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Pune Infrastructure GIS Command Map
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE GPS
              </span>
            </h2>
            <p className="text-xs text-slate-400">Monitoring Viman Nagar, Kharadi & Wagholi Corridors</p>
          </div>
        </div>

        {/* Filters */}
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

      {/* Map Container */}
      <div className="relative w-full h-[450px] rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-[#06080f]">
        {!useFallbackCanvas ? (
          <div ref={mapRef} className="w-full h-full" />
        ) : (
          /* Interactive High-Tech HUD Radar Fallback Map for Pune */
          <div className="w-full h-full relative p-6 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] flex flex-col justify-between">
            {/* Grid Vector Flight Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <polygon points="120,100 280,180 420,120 220,320" fill="rgba(6, 182, 212, 0.05)" stroke="#00f3ff" strokeWidth="1.5" strokeDasharray="4,4" />
            </svg>

            {/* Pune Nodes Markers */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredDefects.map((defect) => {
                const isSelected = selectedDefect?.id === defect.id;
                let badgeBg = 'border-emerald-500 text-emerald-400 bg-emerald-950/80';
                if (defect.riskLevel === 'CRITICAL') badgeBg = 'border-red-500 text-red-400 bg-red-950/80';
                else if (defect.riskLevel === 'HIGH') badgeBg = 'border-orange-500 text-orange-400 bg-orange-950/80';

                return (
                  <div
                    key={defect.id}
                    onClick={() => onSelectDefect(defect)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 backdrop-blur-md ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400 shadow-xl shadow-cyan-500/20'
                        : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {defect.locationName}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeBg}`}>
                        {defect.riskLevel}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 font-semibold">{defect.title}</div>
                    <div className="text-[11px] text-slate-400">GPS: {defect.lat.toFixed(4)}° N, {defect.lng.toFixed(4)}° E</div>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-500 text-center font-mono">
              📍 Pune GIS Infrastructure Radar • Viman Nagar • Kharadi • Wagholi
            </div>
          </div>
        )}

        {/* Floating Telemetry Stats Overlay */}
        <div className="absolute top-3 left-3 bg-[#090d16]/95 backdrop-blur-md border border-slate-800 p-3 rounded-xl text-xs space-y-1.5 shadow-xl max-w-xs pointer-events-auto">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Drone Sector Radar
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
            <div>
              <span className="text-slate-400 block">Center Region</span>
              <span className="font-mono text-cyan-300">Pune (MH)</span>
            </div>
            <div>
              <span className="text-slate-400 block">Active Corridors</span>
              <span className="font-mono text-emerald-400">3 Hotspots</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 right-3 bg-[#090d16]/95 backdrop-blur-md border border-slate-800 px-3 py-2 rounded-xl text-[11px] flex items-center space-x-4 shadow-xl">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-slate-300">Critical Risk</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-slate-300">High</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Normal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
