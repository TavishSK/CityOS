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
  const [activeTab, setActiveTab] = useState<NavTab>('city-overview-dashboard');
  const [activeScenario, setActiveScenario] = useState<string>('heatwave');
  const [weather, setWeather] = useState<BengaluruWeather | null>(null);
  const [airQuality, setAirQuality] = useState<BengaluruAirQuality | null>(null);
  const [corridors, setCorridors] = useState<TrafficCorridor[]>(BENGALURU_CORRIDORS);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch real-time Bengaluru public data on mount
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
      setToastMessage(`Bengaluru Telemetry Synced: ${w.temperature}°C • AQI ${aqi.aqi} • OSRM Active`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Telemetry fetch error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadRealTimeData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadRealTimeData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0f131d] min-h-screen text-[#dfe2f1] font-sans antialiased">
      {/* Top Fixed Header */}
      <Header
        weather={weather}
        airQuality={airQuality}
        activeScenario={activeScenario}
        setActiveScenario={setActiveScenario}
        onRefreshTelemetry={loadRealTimeData}
        isRefreshing={isRefreshing}
      />

      {/* Fixed Left Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

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
              onNavigateTab={setActiveTab}
              activeScenario={activeScenario}
              setActiveScenario={setActiveScenario}
            />
          )}

          {activeTab === 'map-and-zone-explorer' && (
            <MapZoneExplorer
              weather={weather}
              airQuality={airQuality}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'ai-predictions-and-alerts' && (
            <AIPredictionsAlerts
              weather={weather}
              airQuality={airQuality}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'citywide-impact-chain' && (
            <CitywideImpactChain onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'ai-response-planner' && (
            <AIResponsePlanner onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'what-if-simulation-lab' && (
            <WhatIfSimulationLab onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'resource-command' && (
            <ResourceCommand
              corridors={corridors}
              substations={BESCOM_SUBSTATIONS}
              metroLines={NAMMA_METRO_LINES}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'department-workspaces' && (
            <DepartmentWorkspaces
              corridors={corridors}
              substations={BESCOM_SUBSTATIONS}
              onNavigateTab={setActiveTab}
            />
          )}
        </main>
      </div>

      {/* Fixed Bottom Footer */}
      <Footer />

      {/* Global Toast Indicator */}
      {toastMessage && (
        <div className="fixed bottom-10 right-8 bg-[#171b26] text-on-surface px-4 py-2 rounded-lg shadow-2xl flex items-center gap-2 border border-primary z-50 animate-fade-in">
          <span className="material-symbols-outlined text-primary text-[18px]">cloud_sync</span>
          <span className="font-data-mono-sm text-data-mono-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
