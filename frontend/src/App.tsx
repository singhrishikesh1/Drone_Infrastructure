import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StatCards } from './components/StatCards';
import { MapView } from './components/MapView';
import { DefectList } from './components/DefectList';
import { DefectDetailModal } from './components/DefectDetailModal';
import { AirSimUploadModal } from './components/AirSimUploadModal';
import { Defect, AnalyticsSummary } from './types';
import { Cpu, RefreshCw, Layers } from 'lucide-react';

export const App: React.FC = () => {
  const [defects, setDefects] = useState<Defect[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalInspections: 4,
    criticalRisks: 2,
    highRisks: 1,
    totalEstimatedBudget: 44870,
    currency: "₹",
    byAssetType: { road: 1, bridge: 1, railway: 1, building: 1 }
  });

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch defects from Backend API
  const fetchDefects = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5002/api/defects?assetType=${activeFilter}`);
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
  }, [activeFilter]);

  const handleScanComplete = (newDefect: Defect) => {
    setDefects((prev) => [newDefect, ...prev]);
    setSelectedDefect(newDefect);
    fetchDefects();
  };

  const criticalCount = defects.filter((d) => d.riskLevel === 'CRITICAL').length;

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        onOpenScanModal={() => setIsScanModalOpen(true)}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        criticalCount={criticalCount}
      />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
        
        {/* Executive Stats Cards */}
        <StatCards summary={summary} />

        {/* GIS Map & Defect Queue Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* GIS Interactive Map (7 cols) */}
          <div className="lg:col-span-7">
            <MapView
              defects={defects}
              selectedDefect={selectedDefect}
              onSelectDefect={(d) => setSelectedDefect(d)}
            />
          </div>

          {/* Defect Queue List (5 cols) */}
          <div className="lg:col-span-5">
            <DefectList
              defects={defects}
              selectedDefect={selectedDefect}
              onSelectDefect={(d) => setSelectedDefect(d)}
            />
          </div>

        </div>

        {/* Hackathon Architecture Footer Info */}
        <footer className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Tech Stack: React • TypeScript • Node.js • Express • Python • YOLOv8 • OpenCV • Open3D • Leaflet.js • Twilio • Nodemailer</span>
          </div>
          <div className="text-slate-400">
            System Status: <span className="text-emerald-400 font-bold">● AI Engine Online</span>
          </div>
        </footer>

      </main>

      {/* Inspection Detail Modal */}
      {selectedDefect && (
        <DefectDetailModal
          defect={selectedDefect}
          onClose={() => setSelectedDefect(null)}
        />
      )}

      {/* AirSim Flight Scan Modal */}
      <AirSimUploadModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onScanComplete={handleScanComplete}
      />
    </div>
  );
};

export default App;
