import React, { useState } from 'react';
import { BengaluruWeather, BengaluruAirQuality } from '../services/bengaluruData';
import { BengaluruTacticalMap } from './BengaluruTacticalMap';

interface MapZoneExplorerProps {
  weather: BengaluruWeather | null;
  airQuality: BengaluruAirQuality | null;
  onNavigateTab: (tab: any) => void;
}

export const MapZoneExplorer: React.FC<MapZoneExplorerProps> = ({
  weather,
  airQuality,
  onNavigateTab
}) => {
  const [activeLayer, setActiveLayer] = useState<string>('thermal');
  const [selectedZone, setSelectedZone] = useState<string>('4');
  const [timelineIndex, setTimelineIndex] = useState<number>(0);
  const [deployedAssets, setDeployedAssets] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const timelineStates = [
    { offset: 'T+00:00 (14:15 LIVE)', temp: '41.2°C', risk: '94.2%', delta: '+4.8° Δ' },
    { offset: 'T+01:00 (15:15 FORECAST)', temp: '42.1°C', risk: '96.0%', delta: '+5.7° Δ' },
    { offset: 'T+02:00 (16:15 PEAK LOAD)', temp: '43.4°C', risk: '98.4%', delta: '+7.0° Δ' },
    { offset: 'T+03:00 (17:15 PEAK DOME)', temp: '43.8°C', risk: '99.1%', delta: '+7.4° Δ' },
    { offset: 'T+04:00 (18:15 EXTENDED)', temp: '42.0°C', risk: '95.2%', delta: '+5.6° Δ' },
    { offset: 'T+05:00 (19:15 GRADUAL)', temp: '39.8°C', risk: '88.5%', delta: '+3.4° Δ' },
    { offset: 'T+06:00 (20:15 NIGHT COOL)', temp: '36.5°C', risk: '76.0%', delta: '+1.2° Δ' }
  ];

  const currentTimeline = timelineStates[timelineIndex];

  const handleDeployCooling = () => {
    setDeployedAssets(prev => [...prev, 'Mobile Hydration Pod #BLR-9']);
    setToastMessage('Mobile Cooling Unit dispatched to MG Road & Indiranagar Core.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGeoAlert = () => {
    setToastMessage('Geo-targeted SMS advisory pushed to 184,500 citizens in Zone 4.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSimShedding = () => {
    setToastMessage('Simulated rolling shed of 18 MW across commercial IT clusters.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Sub-header Tactical Status Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 pb-3 mb-2 border-b border-[#262a35]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#262a35] px-3 py-1 rounded-lg shadow-sm border border-[#3d494c]">
            <span className="material-symbols-outlined text-primary text-[18px]">satellite_alt</span>
            <span className="font-label-caps text-label-caps uppercase text-primary">
              LAYER: GIS ORTHO MESH v7.4 (BENGALURU)
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-[#1c1f2a] px-3 py-1 rounded-lg border border-[#262a35]">
            <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
            <span className="font-data-mono-sm text-data-mono-sm text-error">
              HEAT DOME: +5.4°C DELTA
            </span>
          </div>
          <div className="hidden xl:flex items-center gap-2 font-data-mono-sm text-data-mono-sm text-on-surface-variant">
            <span>COORDS: 12.9716° N, 77.5946° E</span>
            <span className="text-outline-variant">/</span>
            <span>PROJECTION: EPSG:3857</span>
          </div>
        </div>

        {/* Quick Telemetry Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-[#171b26] px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm border border-[#262a35]">
            <span className="font-label-caps text-label-caps text-outline uppercase">METRO LOAD</span>
            <span className="font-data-mono-sm text-data-mono-sm text-error font-bold">92.8%</span>
          </div>
          <div className="bg-[#171b26] px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm border border-[#262a35]">
            <span className="font-label-caps text-label-caps text-outline uppercase">INDIRA HUBS</span>
            <span className="font-data-mono-sm text-data-mono-sm text-tertiary font-bold">18/20 OPEN</span>
          </div>
          <div className="bg-[#171b26] px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm border border-[#262a35]">
            <span className="font-label-caps text-label-caps text-outline uppercase">EMS FLEET</span>
            <span className="font-data-mono-sm text-data-mono-sm text-primary font-bold">42 ACTIVE</span>
          </div>
          <button
            onClick={() => setToastMessage('Telemetry layer filters active.')}
            className="bg-[#262a35] hover:bg-[#353944] px-2.5 py-1 rounded-lg flex items-center gap-1 text-on-surface font-label-caps text-label-caps uppercase transition-colors border border-[#3d494c]"
          >
            <span className="material-symbols-outlined text-[15px]">tune</span>
            <span>FILTERS</span>
          </button>
        </div>
      </div>

      {/* Primary Map GIS Operations Split-Pane */}
      <div className="grid grid-cols-12 gap-3 relative w-full items-start">
        {/* Left Operations Stage (Map View + Controls) */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-8 flex flex-col gap-2 relative">
          {/* Interactive Map Top Utility Toolbar */}
          <div className="bg-[#171b26]/95 backdrop-blur-md p-2.5 rounded-xl flex flex-col gap-2 shadow-md border border-[#262a35]">
            {/* Row 1: Layer Selector Pills */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
              <div className="flex items-center gap-1 shrink-0">
                {[
                  { id: 'thermal', label: 'Thermal Plume', icon: 'thermostat' },
                  { id: 'ozone', label: 'Ozone Plume', icon: 'air' },
                  { id: 'traffic', label: 'Traffic Delays', icon: 'traffic' },
                  { id: 'substations', label: 'BESCOM Subs', icon: 'bolt' },
                  { id: 'hospital', label: 'Hospital Beds', icon: 'local_hospital' },
                  { id: 'ems', label: 'EMS Units', icon: 'emergency' }
                ].map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-data-mono-sm text-data-mono-sm transition-all ${
                      activeLayer === layer.id
                        ? 'bg-primary text-on-primary font-bold shadow-sm'
                        : 'bg-[#1c1f2a] text-on-surface-variant hover:text-on-surface hover:bg-[#262a35]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">{layer.icon}</span>
                    <span>{layer.label}</span>
                  </button>
                ))}
              </div>

              {/* Zone Quick Switcher */}
              <div className="flex items-center gap-1.5 shrink-0 pl-2">
                <span className="font-label-caps text-label-caps text-outline uppercase hidden sm:inline">
                  ZONE:
                </span>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="bg-[#262a35] font-data-mono-sm text-data-mono-sm text-primary px-2.5 py-1 rounded-lg focus:outline-none cursor-pointer border border-[#3d494c]"
                >
                  <option value="4">Zone 04: Central Core (MG Rd / Indiranagar - CRITICAL)</option>
                  <option value="7">Zone 07: Peenya Industrial (ELEVATED)</option>
                  <option value="9">Zone 09: West / Malleshwaram (MODERATE)</option>
                  <option value="12">Zone 12: South / Electronic City (NOMINAL)</option>
                  <option value="all">All Bengaluru BBMP Zones (1-8)</option>
                </select>
              </div>
            </div>

            {/* Row 2: Predictive Chrono-Timeline Scrubber */}
            <div className="bg-[#1c1f2a] px-3 py-1.5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-2 border border-[#262a35]">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1 text-primary">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-label-caps text-label-caps uppercase font-bold tracking-wider">
                    CHRONO-SIM:
                  </span>
                </div>
                <span className="font-data-mono-sm text-data-mono-sm text-on-surface bg-[#0a0e18] px-2 py-0.5 rounded border border-[#262a35]">
                  {currentTimeline.offset}
                </span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-2/3">
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="1"
                  value={timelineIndex}
                  onChange={(e) => setTimelineIndex(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-[#313540] rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex items-center gap-1 text-on-surface-variant font-data-mono-sm text-[10px] shrink-0">
                  <span className={timelineIndex === 0 ? 'text-primary font-bold' : ''}>NOW</span>
                  <span>•</span>
                  <span>+1H</span>
                  <span>•</span>
                  <span className={timelineIndex === 3 ? 'text-error font-bold' : 'text-error'}>+3H (PEAK)</span>
                  <span>•</span>
                  <span>+6H (COOL)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Tactical GIS Map Display Frame */}
          <BengaluruTacticalMap
            height="620px"
            activeLayer={activeLayer}
            selectedZone={selectedZone}
            onSelectZone={(zoneId) => setSelectedZone(zoneId)}
            interactive={true}
            showControls={true}
          />

          {/* Real-time Municipal Telemetry Data Feeds (Under Map Bar) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="bg-[#171b26] p-2.5 rounded-xl shadow-sm border border-[#262a35] flex items-center justify-between">
              <div>
                <span className="font-label-caps text-label-caps text-outline uppercase block">
                  URBAN CANYON HEAT DELTA
                </span>
                <span className="font-data-mono-lg text-data-mono-lg text-error font-bold">+4.2°C OFFSET</span>
              </div>
              <span className="material-symbols-outlined text-error text-[24px]">wb_sunny</span>
            </div>
            <div className="bg-[#171b26] p-2.5 rounded-xl shadow-sm border border-[#262a35] flex items-center justify-between">
              <div>
                <span className="font-label-caps text-label-caps text-outline uppercase block">
                  PEAK SYSTEM CONGESTION
                </span>
                <span className="font-data-mono-lg text-data-mono-lg text-on-surface font-bold">+18 MIN TRANSIT</span>
              </div>
              <span className="material-symbols-outlined text-primary text-[24px]">traffic</span>
            </div>
            <div className="bg-[#171b26] p-2.5 rounded-xl shadow-sm border border-[#262a35] flex items-center justify-between">
              <div>
                <span className="font-label-caps text-label-caps text-outline uppercase block">
                  REGIONAL EMS RESPONSE
                </span>
                <span className="font-data-mono-lg text-data-mono-lg text-tertiary font-bold">6.2 MIN AVG</span>
              </div>
              <span className="material-symbols-outlined text-tertiary text-[24px]">timer</span>
            </div>
            <div className="bg-[#171b26] p-2.5 rounded-xl shadow-sm border border-[#262a35] flex items-center justify-between">
              <div>
                <span className="font-label-caps text-label-caps text-outline uppercase block">
                  OZONE CONCENTRATION
                </span>
                <span className="font-data-mono-lg text-data-mono-lg text-secondary font-bold">82 PPB (MODERATE)</span>
              </div>
              <span className="material-symbols-outlined text-secondary text-[24px]">scatter_plot</span>
            </div>
          </div>
        </div>

        {/* Right Operations Drawer (Neighborhood Comparison & Zone Telemetry) */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-4 flex flex-col gap-3">
          {/* Selected Zone In-Depth Diagnostic Card */}
          <div className="bg-[#171b26] p-3 rounded-xl shadow-lg border border-[#262a35] flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest">
                  TACTICAL TELEMETRY PROFILE
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Zone 04: Commercial District (MG Rd Core)
                </h2>
              </div>
              <span className="bg-error/20 text-error px-2 py-0.5 rounded font-label-caps text-label-caps font-bold border border-error/30">
                HAZARD LEVEL 4
              </span>
            </div>

            {/* Zone Visual Graphic Representation */}
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-[#1c1f2a] border border-[#262a35] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-error/20 via-transparent to-primary/10"></div>
              <svg className="w-full h-full opacity-60" viewBox="0 0 300 120" preserveAspectRatio="none">
                <path d="M0,80 Q75,30 150,60 T300,20 L300,120 L0,120 Z" fill="rgba(239, 68, 68, 0.25)" />
                <path d="M0,95 Q75,60 150,85 T300,45 L300,120 L0,120 Z" fill="rgba(6, 182, 212, 0.15)" />
                <polyline points="0,80 75,30 150,60 225,25 300,20" fill="none" stroke="#ef4444" strokeWidth="2" />
              </svg>
              <div className="absolute top-2 left-3 font-mono text-[10px] text-primary flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                <span>BENGALURU ZONE 04 SENSOR RADAR (MG RD / INDIRANAGAR)</span>
              </div>
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                <span className="font-data-mono-sm text-data-mono-sm text-on-surface font-semibold">
                  Population: 184,500 Density/km²
                </span>
                <span className="font-data-mono-sm text-data-mono-sm text-error bg-[#0a0e18]/80 px-1.5 py-0.5 rounded border border-error/30">
                  94% AC Stress
                </span>
              </div>
            </div>

            {/* Telemetry Breakdown Bars */}
            <div className="flex flex-col gap-2 font-data-mono-sm text-data-mono-sm">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Elderly &amp; Pediatric Exposure</span>
                  <span className="text-error font-bold">34,200 High-Risk Ind.</span>
                </div>
                <div className="w-full bg-[#262a35] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-error h-full rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-on-surface-variant">
                  <span>BESCOM HAL Substation 4B Margin</span>
                  <span className="text-error font-bold">5.8% Margin (Reserve Low)</span>
                </div>
                <div className="w-full bg-[#262a35] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-error h-full rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Transit Congestion Delay (MG Rd / ORR)</span>
                  <span className="text-primary font-bold">+18.4 min over Baseline</span>
                </div>
                <div className="w-full bg-[#262a35] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>

              <div className="flex justify-between items-center py-1 bg-[#1c1f2a] px-2 rounded border border-[#262a35]">
                <span className="text-on-surface-variant">Tree Canopy Shade Coverage:</span>
                <span className="text-on-surface font-bold">11.4% (Severe Heat Trap)</span>
              </div>
            </div>

            {/* Comparison Matrix: Zone 04 vs Zone 12 */}
            <div className="bg-[#1c1f2a] p-2 rounded-lg flex flex-col gap-1 border border-[#262a35]">
              <div className="flex items-center justify-between pb-1 border-b border-[#262a35]">
                <span className="font-label-caps text-label-caps uppercase text-outline">DIAGNOSTIC MATRIX</span>
                <span className="font-data-mono-sm text-[10px] text-primary">ZONE 04 vs ZONE 12</span>
              </div>
              <div className="grid grid-cols-3 font-data-mono-sm text-[11px] gap-y-1.5 text-center items-center py-1">
                <div className="text-left text-on-surface-variant font-body-sm text-[11px]">Metric</div>
                <div className="text-error font-bold">Z04 (Central)</div>
                <div className="text-tertiary font-bold">Z12 (E-City)</div>
                <div className="text-left text-on-surface-variant text-[11px]">Surface Temp</div>
                <div className="text-error">41.2°C</div>
                <div className="text-tertiary">33.4°C</div>
                <div className="text-left text-on-surface-variant text-[11px]">Power Margin</div>
                <div className="text-error">5.8%</div>
                <div className="text-tertiary">38.2%</div>
                <div className="text-left text-on-surface-variant text-[11px]">Vulnerable Pop</div>
                <div className="text-on-surface">34.2k</div>
                <div className="text-on-surface">11.9k</div>
                <div className="text-left text-on-surface-variant text-[11px]">Indira Hubs</div>
                <div className="text-primary">3 Active</div>
                <div className="text-tertiary">6 Active</div>
                <div className="text-left text-on-surface-variant text-[11px]">EMS Response</div>
                <div className="text-on-surface">8.4 min</div>
                <div className="text-tertiary">4.9 min</div>
              </div>
            </div>

            {/* Tactical Intervention Direct Action Triggers */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider">
                COMMAND RESPONSE ACTIONS
              </span>
              <button
                onClick={handleDeployCooling}
                className="w-full bg-primary hover:brightness-110 text-on-primary font-data-mono-lg text-data-mono-lg py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">cool_to_dry</span>
                <span>DEPLOY MOBILE COOLING UNIT</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleGeoAlert}
                  className="bg-[#262a35] hover:bg-[#353944] text-on-surface font-data-mono-sm text-data-mono-sm py-2 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors border border-[#3d494c]"
                >
                  <span className="material-symbols-outlined text-primary text-[16px]">cell_tower</span>
                  <span>GEO ALERT</span>
                </button>
                <button
                  onClick={handleSimShedding}
                  className="bg-[#262a35] hover:bg-error-container text-on-surface hover:text-on-error-container font-data-mono-sm text-data-mono-sm py-2 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors border border-[#3d494c]"
                >
                  <span className="material-symbols-outlined text-error text-[16px]">power_off</span>
                  <span>SIM SHEDDING</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Dispatched Asset Log for District 4 */}
          <div className="bg-[#171b26] p-3 rounded-xl shadow-lg border border-[#262a35] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-label-caps uppercase text-outline">
                DISTRICT ASSETS IN TRANSIT
              </span>
              <span className="font-data-mono-sm text-data-mono-sm text-tertiary">
                {3 + deployedAssets.length} DISPATCHED
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {/* Asset Row 1 */}
              <div className="flex items-center justify-between p-2 bg-[#1c1f2a] rounded font-data-mono-sm text-data-mono-sm border border-[#262a35]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[16px]">local_shipping</span>
                  <div>
                    <span className="text-on-surface font-semibold block leading-tight">
                      Mobile Hydration Van 03 (BBMP)
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      Target: MG Road &amp; Brigade Junction
                    </span>
                  </div>
                </div>
                <span className="text-tertiary font-bold">ETA 3 MIN</span>
              </div>

              {/* Asset Row 2 */}
              <div className="flex items-center justify-between p-2 bg-[#1c1f2a] rounded font-data-mono-sm text-data-mono-sm border border-[#262a35]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-[16px]">ambulance</span>
                  <div>
                    <span className="text-on-surface font-semibold block leading-tight">
                      EMS Paramedic Squad 14
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      Assigned to: Trinity Metro Plaza Core
                    </span>
                  </div>
                </div>
                <span className="text-primary font-bold">ON SITE</span>
              </div>

              {/* Asset Row 3 */}
              <div className="flex items-center justify-between p-2 bg-[#1c1f2a] rounded font-data-mono-sm text-data-mono-sm border border-[#262a35]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">electric_meter</span>
                  <div>
                    <span className="text-on-surface font-semibold block leading-tight">
                      Auxiliary Transformer 4B (BESCOM)
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      HAL Substation Load Balancing Unit
                    </span>
                  </div>
                </div>
                <span className="text-secondary font-bold">ONLINE</span>
              </div>

              {deployedAssets.map((asset, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-primary/10 rounded font-data-mono-sm text-data-mono-sm border border-primary/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                    <span className="text-on-surface font-semibold">{asset}</span>
                  </div>
                  <span className="text-tertiary font-bold">DISPATCHED</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-10 right-8 bg-[#262a35] text-on-surface px-4 py-2 rounded-lg shadow-2xl flex items-center gap-2 border border-primary z-50">
          <span className="material-symbols-outlined text-primary">info</span>
          <span className="font-data-mono-sm text-data-mono-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
