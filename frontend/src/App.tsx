import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './components/ToastNotification';
import { Navbar, TabType } from './components/Navbar';
import { StatCards } from './components/StatCards';
import { LiveTelemetryHUD } from './components/LiveTelemetryHUD';
import { GoogleMapView } from './components/GoogleMapView';
import { Drone3DViewport } from './components/Drone3DViewport';
import { DefectList } from './components/DefectList';
import { DefectDetailModal } from './components/DefectDetailModal';
import { AirSimUploadModal } from './components/AirSimUploadModal';
import { Drone3DBackground } from './components/Drone3DBackground';
import { DroneFleetServicing } from './components/DroneFleetServicing';
import { ProblemSolvedLog } from './components/ProblemSolvedLog';
import { ReportsManager } from './components/ReportsManager';
import { RedisTelemetryDashboard } from './components/RedisTelemetryDashboard';
import { Defect, AnalyticsSummary } from './types';
import { Navigation, Box, Layers } from 'lucide-react';

const INITIAL_MOCK_DEFECTS: Defect[] = [
  {
    id: "DEF-PUNE-1001",
    title: "Critical Asphalt Pothole & Sub-base Subsidence",
    assetName: "Nagar Road Highway (NH-753F)",
    assetType: "road",
    locationName: "Viman Nagar Airport Road Junction (Nagar Road), Pune",
    lat: 18.5585,
    lng: 73.9165,
    altitude: 48.5,
    riskLevel: "CRITICAL",
    riskScore: 92,
    defectClass: "Pothole Class IV (Severe)",
    confidence: 0.965,
    volumetric: {
      volume_m3: 0.68,
      surface_area_m2: 3.45,
      avg_depth_cm: 11.2,
      max_depth_cm: 18.5,
      length_m: 2.3,
      width_m: 1.5
    },
    costEstimation: {
      total_estimated_cost: 42500,
      currency: "₹",
      required_materials: [
        { name: "Bituminous Concrete Cold Mix (VG-30)", quantity: "0.75 Tons", unit_cost: "₹38,000 / Ton", cost: 28500 },
        { name: "Rapid-Setting Emulsion Tack Coat (RS-1)", quantity: "20 Liters", unit_cost: "₹140 / Liter", cost: 2800 },
        { name: "Compaction Equipment & Field Crew", quantity: "1 Shift", unit_cost: "₹11,200 / Shift", cost: 11200 }
      ],
      recommended_action: "Milling of degraded asphalt surface, application of RS-1 tack coat, and high-density compaction with VG-30 mix."
    },
    riskReasons: [
      "High probability of heavy commercial vehicle tire blowout",
      "Rainwater pooling leading to accelerated sub-base erosion",
      "High-speed highway corridor conflict zone"
    ],
    timestamp: "10:42 AM IST",
    inspector: "SkyGuardian-X1",
    status: "OPEN",
    alertSent: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "DEF-PUNE-1002",
    title: "Bridge Expansion Joint Shear & Concrete Spalling",
    assetName: "Nagar Road Kharadi Flyover",
    assetType: "bridge",
    locationName: "Kharadi Junction (Nagar Road), Pune",
    lat: 18.5680,
    lng: 73.9450,
    altitude: 52.0,
    riskLevel: "HIGH",
    riskScore: 78,
    defectClass: "Expansion Joint Spalling",
    confidence: 0.912,
    volumetric: {
      volume_m3: 0.32,
      surface_area_m2: 1.8,
      avg_depth_cm: 6.4,
      max_depth_cm: 9.8,
      length_m: 3.0,
      width_m: 0.6
    },
    costEstimation: {
      total_estimated_cost: 65000,
      currency: "₹",
      required_materials: [
        { name: "High-Performance Elastomeric Expansion Seal", quantity: "3.2 Meters", unit_cost: "₹12,500 / Meter", cost: 40000 },
        { name: "Non-Shrink Polymer Modified Mortar", quantity: "50 kg", unit_cost: "₹300 / kg", cost: 15000 },
        { name: "Bridge Structural Maintenance Crew", quantity: "1 Shift", unit_cost: "₹10,000 / Shift", cost: 10000 }
      ],
      recommended_action: "Replace damaged elastomeric joint seal and inject non-shrink polymer mortar around spalled concrete edges."
    },
    riskReasons: [
      "Vibration impact on bridge deck girders under heavy traffic",
      "Risk of joint lock causing secondary structural cracking"
    ],
    timestamp: "09:15 AM IST",
    inspector: "SkyGuardian-X1",
    status: "DISPATCHED",
    alertSent: false,
    thumbnailUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "DEF-PUNE-1003",
    title: "Alligator Cracking & Asphalt Fatigue Disintegration",
    assetName: "Wagholi Highway Stretch (Nagar Road)",
    assetType: "road",
    locationName: "Wagholi Junction (Nagar Road), Pune",
    lat: 18.5775,
    lng: 73.9740,
    altitude: 45.0,
    riskLevel: "MEDIUM",
    riskScore: 62,
    defectClass: "Fatigue Alligator Cracking",
    confidence: 0.884,
    volumetric: {
      volume_m3: 0.24,
      surface_area_m2: 4.8,
      avg_depth_cm: 3.5,
      max_depth_cm: 5.8,
      length_m: 4.0,
      width_m: 1.2
    },
    costEstimation: {
      total_estimated_cost: 28000,
      currency: "₹",
      required_materials: [
        { name: "Polymer-Modified Bitumen Crack Sealant", quantity: "35 Liters", unit_cost: "₹400 / Liter", cost: 14000 },
        { name: "Surface Seal Coating", quantity: "50 m²", unit_cost: "₹280 / m²", cost: 14000 }
      ],
      recommended_action: "Apply high-viscosity rubberized crack sealant followed by micro-surfacing protective overlay."
    },
    riskReasons: [
      "Water penetration risk into road base during monsoon",
      "Potential escalation to severe pothole formation"
    ],
    timestamp: "Yesterday",
    inspector: "SkyGuardian-X1",
    status: "RESOLVED",
    alertSent: false,
    thumbnailUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80"
  }
];

const DashboardContent: React.FC = () => {
  const [defects, setDefects] = useState<Defect[]>(INITIAL_MOCK_DEFECTS);
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalInspections: 3,
    criticalRisks: 1,
    highRisks: 1,
    resolvedProblems: 1,
    totalEstimatedBudget: 135500,
    currency: "₹",
    byAssetType: { road: 2, bridge: 1, railway: 0, building: 0 }
  });

  const [activeTab, setActiveTab] = useState<TabType>('telemetry');
  const [hudViewMode, setHudViewMode] = useState<'map' | '3d' | 'split'>('map');
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);

  const fetchDefects = async () => {
    try {
      const res = await fetch(`http://localhost:5002/api/defects`);
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        setDefects(json.data);
      }

      const summaryRes = await fetch('http://localhost:5002/api/analytics');
      const summaryJson = await summaryRes.json();
      if (summaryJson.success && summaryJson.data) {
        setSummary(summaryJson.data);
      }
    } catch (err) {
      // Use local state if backend is offline
    }
  };

  useEffect(() => {
    fetchDefects();
  }, []);

  useEffect(() => {
    const critical = defects.filter(d => d.riskLevel === 'CRITICAL' && d.status !== 'RESOLVED').length;
    const high = defects.filter(d => d.riskLevel === 'HIGH' && d.status !== 'RESOLVED').length;
    const resolved = defects.filter(d => d.status === 'RESOLVED').length;
    const totalBudget = defects.reduce((acc, d) => acc + (d.costEstimation?.total_estimated_cost || 0), 0);

    setSummary({
      totalInspections: defects.length,
      criticalRisks: critical,
      highRisks: high,
      resolvedProblems: resolved,
      totalEstimatedBudget: totalBudget,
      currency: "₹",
      byAssetType: {
        road: defects.filter(d => d.assetType === 'road').length,
        bridge: defects.filter(d => d.assetType === 'bridge').length,
        railway: defects.filter(d => d.assetType === 'railway').length,
        building: defects.filter(d => d.assetType === 'building').length,
      }
    });
  }, [defects]);

  const handleScanComplete = (newDefect: Defect) => {
    setDefects((prev) => [newDefect, ...prev]);
    setSelectedDefect(newDefect);
  };

  const handleStatusChange = async (defectId: string, newStatus: 'RESOLVED' | 'DISPATCHED' | 'OPEN') => {
    try {
      await fetch(`http://localhost:5002/api/defects/${defectId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setDefects(prev => prev.map(d => d.id === defectId ? { ...d, status: newStatus } : d));
    } catch (err) {
      setDefects(prev => prev.map(d => d.id === defectId ? { ...d, status: newStatus } : d));
    }
  };

  const criticalCount = summary.criticalRisks;

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col relative font-sans transition-colors duration-200">
      {/* 3D Flying Drone Background Scene */}
      <Drone3DBackground />

      {/* Top Aerospace Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenScanModal={() => setIsScanModalOpen(true)}
        criticalCount={criticalCount}
      />

      {/* Main Command Workspace */}
      <main className="flex-1 p-4 md:p-6 space-y-4 max-w-[1600px] w-full mx-auto z-10">
        
        {/* Live Telemetry HUD Banner */}
        <LiveTelemetryHUD />

        {/* Tab 1: COMMAND HUD */}
        {activeTab === 'telemetry' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <StatCards summary={summary} activeDronesCount={1} />

            {/* View Switcher Bar for HUD */}
            <div className="flex items-center justify-between bg-[var(--bg-surface)] p-2 rounded-xl border border-[var(--border-subtle)] font-mono text-xs shadow-xs">
              <span className="text-[var(--text-secondary)] font-bold px-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--brand-primary)]" /> DISPLAY MODE:
              </span>
              <div className="flex items-center space-x-1.5">
                {[
                  { id: 'map', label: 'GIS Road Map', icon: Navigation },
                  { id: '3d', label: '3D Drone Viewport', icon: Box },
                  { id: 'split', label: 'Split View', icon: Layers }
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isActive = hudViewMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setHudViewMode(mode.id as any)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
                        isActive
                          ? 'bg-[var(--brand-primary)] text-white shadow-xs'
                          : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GIS Map & 3D Drone Viewport Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              <div className="lg:col-span-7 space-y-4">
                {(hudViewMode === 'map' || hudViewMode === 'split') && (
                  <GoogleMapView
                    defects={defects}
                    selectedDefect={selectedDefect}
                    onSelectDefect={(d) => setSelectedDefect(d)}
                  />
                )}

                {(hudViewMode === '3d' || hudViewMode === 'split') && (
                  <Drone3DViewport height={hudViewMode === 'split' ? '380px' : '450px'} />
                )}
              </div>

              {/* Inspection Alerts List */}
              <div className="lg:col-span-5">
                <DefectList
                  defects={defects}
                  selectedDefect={selectedDefect}
                  onSelectDefect={(d) => setSelectedDefect(d)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: DRONE FLEET */}
        {activeTab === 'drone' && (
          <div className="animate-in fade-in duration-200 space-y-4">
            <Drone3DViewport height="400px" />
            <DroneFleetServicing />
          </div>
        )}

        {/* Tab 3: DEFECTS QUEUE */}
        {activeTab === 'defects' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <DefectList
              defects={defects}
              selectedDefect={selectedDefect}
              onSelectDefect={(d) => setSelectedDefect(d)}
            />
            <ProblemSolvedLog
              defects={defects}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}

        {/* Tab 4: AUDIT REPORTS */}
        {activeTab === 'reports' && (
          <div className="animate-in fade-in duration-200">
            <ReportsManager defects={defects} />
          </div>
        )}

        {/* Tab 5: REDIS PIPELINE */}
        {activeTab === 'redis' && (
          <div className="animate-in fade-in duration-200">
            <RedisTelemetryDashboard />
          </div>
        )}

      </main>

      {/* Inspection Detail Modal */}
      {selectedDefect && (
        <DefectDetailModal
          defect={selectedDefect}
          onClose={() => setSelectedDefect(null)}
        />
      )}

      {/* AirSim Drone Scan Upload Modal */}
      <AirSimUploadModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onScanComplete={handleScanComplete}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <DashboardContent />
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
