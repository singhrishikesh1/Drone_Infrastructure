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
    title: "Critical Asphalt Sub-base Pothole",
    assetName: "Nagar Road Highway (NH-753F)",
    assetType: "road",
    locationName: "Nagar Road Corridor (Point A Sector), Pune",
    lat: 18.5585,
    lng: 73.9165,
    altitude: 48.5,
    riskLevel: "CRITICAL",
    riskScore: 94,
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
      recommended_action: "Milling of degraded asphalt surface, application of RS-1 tack coat, and high-density compaction."
    },
    riskReasons: [
      "High probability of heavy commercial vehicle tire blowout",
      "Rainwater pooling leading to accelerated sub-base erosion"
    ],
    timestamp: "10:42 AM IST",
    inspector: "Raisoni-Drone_P7",
    status: "OPEN",
    alertSent: true,
    thumbnailUrl: "/defects/pothole_critical_1.jpg"
  },
  {
    id: "DEF-PUNE-1002",
    title: "Bridge Expansion Joint Shear & Concrete Spalling",
    assetName: "Nagar Road Highway Flyover (Span 2)",
    assetType: "bridge",
    locationName: "Nagar Road Corridor (Mid-Corridor Sector), Pune",
    lat: 18.5680,
    lng: 73.9450,
    altitude: 52.0,
    riskLevel: "CRITICAL",
    riskScore: 92,
    defectClass: "Expansion Joint Spalling",
    confidence: 0.942,
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
      recommended_action: "Replace damaged elastomeric joint seal and inject non-shrink polymer mortar around spalled edges."
    },
    riskReasons: [
      "Vibration impact on bridge deck girders under heavy traffic",
      "Risk of joint lock causing secondary structural cracking"
    ],
    timestamp: "09:15 AM IST",
    inspector: "Raisoni-Drone_P7",
    status: "OPEN",
    alertSent: true,
    thumbnailUrl: "/defects/bridge_spalling_1.jpg"
  },
  {
    id: "DEF-PUNE-1003",
    title: "Deep Rainwater Pothole & Subgrade Erosion",
    assetName: "Nagar Road Highway Corridor Exit 12",
    assetType: "road",
    locationName: "Nagar Road Corridor (Point B Sector), Pune",
    lat: 18.5775,
    lng: 73.9740,
    altitude: 45.0,
    riskLevel: "HIGH",
    riskScore: 89,
    defectClass: "Water-Logged Pothole",
    confidence: 0.915,
    volumetric: {
      volume_m3: 0.42,
      surface_area_m2: 2.1,
      avg_depth_cm: 8.5,
      max_depth_cm: 14.2,
      length_m: 1.8,
      width_m: 1.2
    },
    costEstimation: {
      total_estimated_cost: 34800,
      currency: "₹",
      required_materials: [
        { name: "Polymer Modified Bitumen Cold Mix", quantity: "0.45 Tons", unit_cost: "₹38,000 / Ton", cost: 17100 },
        { name: "RS-1 Emulsion Tack Coat", quantity: "15 Liters", unit_cost: "₹140 / Liter", cost: 2100 },
        { name: "Vibratory Roller & Maintenance Crew", quantity: "1 Shift", unit_cost: "₹15,600 / Shift", cost: 15600 }
      ],
      recommended_action: "Dewatering, application of RS-1 tack coat, and high-density polymer asphalt compaction."
    },
    riskReasons: [
      "Severe vehicle wheel hydroplaning and rim fracture hazard",
      "Subgrade moisture softening causing accelerated pothole enlargement"
    ],
    timestamp: "08:45 AM IST",
    inspector: "Raisoni-Drone_P7",
    status: "DISPATCHED",
    alertSent: false,
    thumbnailUrl: "/defects/pothole_water_1.jpg"
  },
  {
    id: "DEF-PUNE-1004",
    title: "Heavy Alligator Fatigue Cracking",
    assetName: "Nagar Road Highway Arterial Stretch",
    assetType: "road",
    locationName: "Nagar Road Corridor (Mid-Corridor Lane 2)",
    lat: 18.5630,
    lng: 73.9310,
    altitude: 46.0,
    riskLevel: "HIGH",
    riskScore: 84,
    defectClass: "Fatigue Alligator Cracking",
    confidence: 0.892,
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
        { name: "Rubberized Bitumen Crack Sealant", quantity: "35 Liters", unit_cost: "₹400 / Liter", cost: 14000 },
        { name: "Protective Surface Micro-surfacing", quantity: "50 m²", unit_cost: "₹280 / m²", cost: 14000 }
      ],
      recommended_action: "Apply high-viscosity rubberized crack sealant followed by protective micro-surfacing overlay."
    },
    riskReasons: [
      "Water penetration risk into road base during heavy rain",
      "Potential rapid escalation into widespread pothole clusters"
    ],
    timestamp: "08:10 AM IST",
    inspector: "Raisoni-Drone_P7",
    status: "DISPATCHED",
    alertSent: false,
    thumbnailUrl: "/defects/asphalt_alligator_1.jpg"
  },
  {
    id: "DEF-PUNE-1005",
    title: "Bridge Deck Concrete Spalling & Exposed Rebar",
    assetName: "Nagar Road Highway Overpass Bridge",
    assetType: "bridge",
    locationName: "Nagar Road Corridor (Span 4 West), Pune",
    lat: 18.5716,
    lng: 73.9550,
    altitude: 54.0,
    riskLevel: "HIGH",
    riskScore: 82,
    defectClass: "Deck Concrete Spalling",
    confidence: 0.884,
    volumetric: {
      volume_m3: 0.28,
      surface_area_m2: 1.6,
      avg_depth_cm: 7.2,
      max_depth_cm: 11.5,
      length_m: 2.2,
      width_m: 0.75
    },
    costEstimation: {
      total_estimated_cost: 58000,
      currency: "₹",
      required_materials: [
        { name: "Polymer Modified Structural Mortar", quantity: "40 kg", unit_cost: "₹400 / kg", cost: 16000 },
        { name: "Anti-Corrosion Zinc Primer Coating", quantity: "10 Liters", unit_cost: "₹1,200 / Liter", cost: 12000 },
        { name: "Bridge Repair Crew & Equipment", quantity: "1 Shift", unit_cost: "₹30,000 / Shift", cost: 30000 }
      ],
      recommended_action: "Clean exposed steel rebar, apply zinc anti-corrosion coating, and patch with polymer mortar."
    },
    riskReasons: [
      "Rusting rebar expansion causing concrete cover delamination",
      "Structural fatigue risk under continuous heavy transport loads"
    ],
    timestamp: "07:30 AM IST",
    inspector: "Raisoni-Drone_P7",
    status: "OPEN",
    alertSent: false,
    thumbnailUrl: "/defects/bridge_spalling_1.jpg"
  },
  {
    id: "DEF-PUNE-1006",
    title: "Severe Asphalt Edge Raveling & Sub-base Subsidence",
    assetName: "Nagar Road Highway Outer Lane",
    assetType: "road",
    locationName: "Nagar Road Corridor (Point A Sub-Sector)",
    lat: 18.5590,
    lng: 73.9190,
    altitude: 47.0,
    riskLevel: "MEDIUM",
    riskScore: 68,
    defectClass: "Asphalt Edge Raveling",
    confidence: 0.861,
    volumetric: {
      volume_m3: 0.19,
      surface_area_m2: 2.4,
      avg_depth_cm: 4.8,
      max_depth_cm: 7.5,
      length_m: 3.1,
      width_m: 0.8
    },
    costEstimation: {
      total_estimated_cost: 22400,
      currency: "₹",
      required_materials: [
        { name: "Dense Bituminous Macadam (DBM)", quantity: "0.3 Tons", unit_cost: "₹34,000 / Ton", cost: 10200 },
        { name: "Shoulder Compaction Crew", quantity: "1 Shift", unit_cost: "₹12,200 / Shift", cost: 12200 }
      ],
      recommended_action: "Re-compact road shoulder edge, apply DBM cold mix, and seal shoulder margin."
    },
    riskReasons: [
      "Vehicle drift tire drop hazard on unpaved shoulder edge",
      "Erosion propagation toward active traffic lane"
    ],
    timestamp: "Yesterday",
    inspector: "Raisoni-Drone_P7",
    status: "OPEN",
    alertSent: false,
    thumbnailUrl: "/defects/pothole_critical_1.jpg"
  },
  {
    id: "DEF-PUNE-1007",
    title: "Longitudinal Reflection Crack & Joint Separation",
    assetName: "Nagar Road Highway Central Median",
    assetType: "road",
    locationName: "Nagar Road Corridor (Mid-Corridor Median)",
    lat: 18.5652,
    lng: 73.9370,
    altitude: 49.0,
    riskLevel: "MEDIUM",
    riskScore: 64,
    defectClass: "Longitudinal Crack",
    confidence: 0.847,
    volumetric: {
      volume_m3: 0.12,
      surface_area_m2: 3.2,
      avg_depth_cm: 2.8,
      max_depth_cm: 4.2,
      length_m: 5.5,
      width_m: 0.05
    },
    costEstimation: {
      total_estimated_cost: 18500,
      currency: "₹",
      required_materials: [
        { name: "Hot-Applied Elastic Sealant", quantity: "20 Liters", unit_cost: "₹450 / Liter", cost: 9000 },
        { name: "Crack Routing & Sealing Crew", quantity: "1 Shift", unit_cost: "₹9,500 / Shift", cost: 9500 }
      ],
      recommended_action: "Route crack to 15mm width, clean with compressed air, and fill with hot elastic sealant."
    },
    riskReasons: [
      "Water ingress along longitudinal joint leading to subgrade failure",
      "Risk of crack widening during seasonal temperature changes"
    ],
    timestamp: "Yesterday",
    inspector: "Raisoni-Drone_P7",
    status: "OPEN",
    alertSent: false,
    thumbnailUrl: "/defects/asphalt_alligator_1.jpg"
  },
  {
    id: "DEF-PUNE-1008",
    title: "Bridge Concrete Parapet Wall Cracking",
    assetName: "Nagar Road Highway Flyover Barrier",
    assetType: "bridge",
    locationName: "Nagar Road Corridor (Flyover Span 3)",
    lat: 18.5694,
    lng: 73.9490,
    altitude: 53.0,
    riskLevel: "MEDIUM",
    riskScore: 61,
    defectClass: "Parapet Concrete Crack",
    confidence: 0.823,
    volumetric: {
      volume_m3: 0.08,
      surface_area_m2: 1.1,
      avg_depth_cm: 3.2,
      max_depth_cm: 5.0,
      length_m: 1.9,
      width_m: 0.03
    },
    costEstimation: {
      total_estimated_cost: 32000,
      currency: "₹",
      required_materials: [
        { name: "Structural Epoxy Resin Injection Kit", quantity: "5 Liters", unit_cost: "₹1,400 / Liter", cost: 7000 },
        { name: "Concrete Surface Seal Coating", quantity: "15 m²", unit_cost: "₹400 / m²", cost: 6000 },
        { name: "Safety Scaffolding & Crew", quantity: "1 Shift", unit_cost: "₹19,000 / Shift", cost: 19000 }
      ],
      recommended_action: "Low-pressure epoxy resin injection and application of protective weather-resistant coat."
    },
    riskReasons: [
      "Concrete spalling falling onto lower road underpass hazard",
      "Moisture rust risk to structural reinforcement bars"
    ],
    timestamp: "Yesterday",
    inspector: "Raisoni-Drone_P7",
    status: "RESOLVED",
    alertSent: false,
    thumbnailUrl: "/defects/bridge_spalling_1.jpg"
  },
  {
    id: "DEF-PUNE-1009",
    title: "Asphalt Surface Raveling & Aggregate Stripping",
    assetName: "Nagar Road Highway Service Lane",
    assetType: "road",
    locationName: "Nagar Road Corridor (Point B Service Road)",
    lat: 18.5760,
    lng: 73.9670,
    altitude: 44.5,
    riskLevel: "LOW",
    riskScore: 42,
    defectClass: "Surface Raveling",
    confidence: 0.954,
    volumetric: {
      volume_m3: 0.06,
      surface_area_m2: 3.8,
      avg_depth_cm: 1.5,
      max_depth_cm: 2.2,
      length_m: 2.8,
      width_m: 1.4
    },
    costEstimation: {
      total_estimated_cost: 9800,
      currency: "₹",
      required_materials: [
        { name: "Fog Seal Bituminous Emulsion", quantity: "25 Liters", unit_cost: "₹180 / Liter", cost: 4500 },
        { name: "Application Spray Unit & Crew", quantity: "1 Job", unit_cost: "₹5,300 / Job", cost: 5300 }
      ],
      recommended_action: "Apply high-penetration fog seal coat to arrest aggregate dislodgement."
    },
    riskReasons: [
      "Minor surface texture loss, low immediate risk to vehicular traffic"
    ],
    timestamp: "Yesterday",
    inspector: "Raisoni-Drone_P7",
    status: "RESOLVED",
    alertSent: false,
    thumbnailUrl: "/defects/pothole_water_1.jpg"
  },
  {
    id: "DEF-PUNE-1010",
    title: "Remediated Cold-Mix Pothole Seal Verification",
    assetName: "Nagar Road Highway (Point A Sector)",
    assetType: "road",
    locationName: "Nagar Road Corridor (Point A Entrance)",
    lat: 18.5575,
    lng: 73.9140,
    altitude: 48.0,
    riskLevel: "LOW",
    riskScore: 28,
    defectClass: "Remediated Pothole",
    confidence: 0.981,
    volumetric: {
      volume_m3: 0.03,
      surface_area_m2: 0.45,
      avg_depth_cm: 0.5,
      max_depth_cm: 1.0,
      length_m: 0.7,
      width_m: 0.6
    },
    costEstimation: {
      total_estimated_cost: 4500,
      currency: "₹",
      required_materials: [
        { name: "Bituminous Sealant Coating", quantity: "5 kg", unit_cost: "₹300 / kg", cost: 1500 },
        { name: "PWD Inspection Team", quantity: "1 Job", unit_cost: "₹3,000 / Job", cost: 3000 }
      ],
      recommended_action: "Seal coat verified normal by autonomous drone thermal + LiDAR scan."
    },
    riskReasons: [
      "Remediated pothole patch verified structurally sound by drone scan"
    ],
    timestamp: "Yesterday",
    inspector: "Raisoni-Drone_P7",
    status: "RESOLVED",
    alertSent: false,
    thumbnailUrl: "/defects/pothole_critical_1.jpg"
  }
];

const DashboardContent: React.FC = () => {
  const [defects, setDefects] = useState<Defect[]>(INITIAL_MOCK_DEFECTS);
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalInspections: 10,
    criticalRisks: 2,
    highRisks: 3,
    resolvedProblems: 3,
    totalEstimatedBudget: 314000,
    currency: "₹",
    byAssetType: { road: 7, bridge: 3 }
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
        bridge: defects.filter(d => d.assetType === 'bridge').length
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
