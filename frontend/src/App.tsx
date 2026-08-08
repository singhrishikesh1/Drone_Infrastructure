import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StatCards } from './components/StatCards';
import { LiveTelemetryHUD } from './components/LiveTelemetryHUD';
import { GoogleMapView } from './components/GoogleMapView';
import { DefectList } from './components/DefectList';
import { DefectDetailModal } from './components/DefectDetailModal';
import { AirSimUploadModal } from './components/AirSimUploadModal';
import { Drone3DBackground } from './components/Drone3DBackground';
import { RedisTelemetryDashboard } from './components/RedisTelemetryDashboard';
import { DroneFleetServicing } from './components/DroneFleetServicing';
import { ProblemSolvedLog } from './components/ProblemSolvedLog';
import { ReportsManager } from './components/ReportsManager';
import { Defect, AnalyticsSummary } from './types';

export const App: React.FC = () => {
  const [defects, setDefects] = useState<Defect[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalInspections: 4,
    criticalRisks: 2,
    highRisks: 1,
    resolvedProblems: 1,
    totalEstimatedBudget: 57600,
    currency: "₹",
    byAssetType: { road: 2, bridge: 1, railway: 0, building: 1 }
  });

  const [activeTab, setActiveTab] = useState<'map' | 'redis' | 'servicing' | 'problems' | 'reports'>('map');
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch defects from Backend API
  const fetchDefects = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5002/api/defects`);
      const json = await res.json();
      if (json.success && json.data) {
        setDefects(json.data);
      }

      const summaryRes = await fetch('http://localhost:5002/api/analytics');
      const summaryJson = await summaryRes.json();
      if (summaryJson.success && summaryJson.data) {
        setSummary(summaryJson.data);
      }
    } catch (err) {
      console.log('Using pre-populated state for offline dashboard rendering');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefects();
  }, []);

  const handleScanComplete = (newDefect: Defect) => {
    setDefects((prev) => [newDefect, ...prev]);
    setSelectedDefect(newDefect);
    fetchDefects();
  };

  const handleStatusChange = async (defectId: string, newStatus: 'RESOLVED' | 'DISPATCHED' | 'OPEN') => {
    try {
      const res = await fetch(`http://localhost:5002/api/defects/${defectId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (json.success) {
        setDefects(prev => prev.map(d => d.id === defectId ? { ...d, status: newStatus } : d));
        fetchDefects();
      }
    } catch (err) {
      setDefects(prev => prev.map(d => d.id === defectId ? { ...d, status: newStatus } : d));
    }
  };

  const criticalCount = defects.filter((d) => d.riskLevel === 'CRITICAL' && d.status !== 'RESOLVED').length;

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 flex flex-col relative font-['Inter',sans-serif] selection:bg-cyan-500 selection:text-aerospace-950">
      {/* 3D Flying Drone Background Scene */}
      <Drone3DBackground />

      {/* Top Aerospace Brand & Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenScanModal={() => setIsScanModalOpen(true)}
        criticalCount={criticalCount}
      />

      {/* Main Command Bridge Container */}
      <main className="flex-1 p-3.5 md:p-5 space-y-4 max-w-[1600px] w-full mx-auto z-10">
        
        {/* Dynamic Telemetry HUD Banner */}
        <LiveTelemetryHUD />

        {/* Dynamic View Tab Switcher */}
        {activeTab === 'map' && (
          <div className="space-y-4 animate-fade-in">
            {/* Executive Metric Strip */}
            <StatCards summary={summary} activeDronesCount={3} />

            {/* GIS Operational Map & AI Defect Queue Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* GIS Command Map (7 cols) */}
              <div className="lg:col-span-7">
                <GoogleMapView
                  defects={defects}
                  selectedDefect={selectedDefect}
                  onSelectDefect={(d) => setSelectedDefect(d)}
                />
              </div>

              {/* AI Infrastructure Intelligence Queue (5 cols) */}
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

        {activeTab === 'redis' && (
          <div className="animate-fade-in">
            <RedisTelemetryDashboard />
          </div>
        )}

        {activeTab === 'servicing' && (
          <div className="animate-fade-in">
            <DroneFleetServicing />
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="animate-fade-in">
            <ProblemSolvedLog
              defects={defects}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="animate-fade-in">
            <ReportsManager defects={defects} />
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

export default App;
