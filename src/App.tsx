/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { Footer } from './components/Footer';
import { CityOverviewDashboard } from './components/CityOverviewDashboard';
import { MapZoneExplorer } from './components/MapZoneExplorer';
import { AIPredictionsAlerts } from './components/AIPredictionsAlerts';
import { CitywideImpactChain } from './components/CitywideImpactChain';
import { AIResponsePlanner } from './components/AIResponsePlanner';
import { WhatIfSimulationLab } from './components/WhatIfSimulationLab';
import { ResourceCommand } from './components/ResourceCommand';
import { DepartmentWorkspaces } from './components/DepartmentWorkspaces';
import { SystemGuideModal } from './components/SystemGuideModal';
import { UserHelpGuide } from './components/UserHelpGuide';
import {
  BengaluruWeather,
  BengaluruAirQuality,
  TrafficCorridor,
  fetchLiveBengaluruWeather,
  fetchLiveBengaluruAirQuality,
  fetchLiveCorridorCommute,
  BENGALURU_CORRIDORS,
  BESCOM_SUBSTATIONS,
  NAMMA_METRO_LINES,
  BENGALURU_ACTIVE_INCIDENTS
} from './services/bengaluruData';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    const saved = localStorage.getItem('blr_cityos_active_tab');
    return (saved as NavTab) || 'city-overview-dashboard';
  });
  const [activeScenario, setActiveScenario] = useState<string>(() => {
    return localStorage.getItem('blr_cityos_scenario') || 'heatwave';
  });
  const [weather, setWeather] = useState<BengaluruWeather | null>(null);
  const [airQuality, setAirQuality] = useState<BengaluruAirQuality | null>(null);
  const [corridors, setCorridors] = useState<TrafficCorridor[]>(BENGALURU_CORRIDORS);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Sync state changes with localStorage
  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    localStorage.setItem('blr_cityos_active_tab', tab);
  };

  const handleScenarioChange = (scenario: string) => {
    setActiveScenario(scenario);
    localStorage.setItem('blr_cityos_scenario', scenario);
    setToastMessage(`Scenario Switched: ${scenario.toUpperCase()} • Telemetry Recalibrated`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch real-time Bengaluru public data on mount & on refresh
  const loadRealTimeData = async () => {
    setIsRefreshing(true);
    try {
      const [w, aqi, traffic] = await Promise.all([
        fetchLiveBengaluruWeather(),
        fetchLiveBengaluruAirQuality(),
        fetchLiveCorridorCommute()
      ]);
      setWeather(w);
      setAirQuality(aqi);
      setCorridors(traffic);
      setToastMessage(`Bengaluru Telemetry Live Synced: ${w.temperature}°C • AQI ${aqi.aqi} • OSRM Routing Active`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error('Telemetry fetch error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadRealTimeData();
    // Auto-refresh every 45 seconds
    const interval = setInterval(loadRealTimeData, 45000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0f131d] min-h-screen text-[#dfe2f1] font-sans antialiased">
      {/* Top Fixed Header with sync indicator & TavishSK attribution */}
      <Header
        weather={weather}
        airQuality={airQuality}
        activeScenario={activeScenario}
        setActiveScenario={handleScenarioChange}
        onRefreshTelemetry={loadRealTimeData}
        isRefreshing={isRefreshing}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Fixed Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content Area (offset by sidebar w-72 and header top-16) */}
      <div className="pl-72">
        <main className="w-full min-h-screen pt-16 pb-10 px-4 bg-[#0f131d]">
          {activeTab === 'city-overview-dashboard' && (
            <CityOverviewDashboard
              weather={weather}
              airQuality={airQuality}
              corridors={corridors}
              substations={BESCOM_SUBSTATIONS}
              incidents={BENGALURU_ACTIVE_INCIDENTS}
              onNavigateTab={handleTabChange}
              activeScenario={activeScenario}
              setActiveScenario={handleScenarioChange}
            />
          )}

          {activeTab === 'map-and-zone-explorer' && (
            <MapZoneExplorer
              weather={weather}
              airQuality={airQuality}
              onNavigateTab={handleTabChange}
            />
          )}

          {activeTab === 'ai-predictions-and-alerts' && (
            <AIPredictionsAlerts
              weather={weather}
              airQuality={airQuality}
              onNavigateTab={handleTabChange}
            />
          )}

          {activeTab === 'citywide-impact-chain' && (
            <CitywideImpactChain onNavigateTab={handleTabChange} />
          )}

          {activeTab === 'ai-response-planner' && (
            <AIResponsePlanner onNavigateTab={handleTabChange} />
          )}

          {activeTab === 'what-if-simulation-lab' && (
            <WhatIfSimulationLab onNavigateTab={handleTabChange} />
          )}

          {activeTab === 'resource-command' && (
            <ResourceCommand
              corridors={corridors}
              substations={BESCOM_SUBSTATIONS}
              metroLines={NAMMA_METRO_LINES}
              onNavigateTab={handleTabChange}
            />
          )}

          {activeTab === 'department-workspaces' && (
            <DepartmentWorkspaces
              corridors={corridors}
              substations={BESCOM_SUBSTATIONS}
              onNavigateTab={handleTabChange}
            />
          )}

          {activeTab === 'user-help-guide' && (
            <UserHelpGuide onNavigateTab={handleTabChange} />
          )}
        </main>
      </div>

      {/* Fixed Bottom Footer */}
      <Footer />

      {/* Interactive System Guide Modal */}
      <SystemGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onNavigateTab={handleTabChange}
      />

      {/* Global Toast Indicator */}
      {toastMessage && (
        <div className="fixed bottom-10 right-8 bg-[#171b26]/95 backdrop-blur-md text-on-surface px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 border border-primary z-50 animate-fade-in font-mono text-xs">
          <span className="material-symbols-outlined text-primary text-[18px]">cloud_sync</span>
          <span className="text-[#dfe2f1] font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
