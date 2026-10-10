import React, { useState } from 'react';
import { BengaluruWeather, BengaluruAirQuality } from '../services/bengaluruData';

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
          <div className="relative w-full h-[620px] bg-[#0a0e18] rounded-xl overflow-hidden shadow-2xl flex items-center justify-center border border-[#262a35]">
            {/* GIS Map Base Layer */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 mix-blend-luminosity filter contrast-125"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuButD0jf0NhV8QLl3mxF3ZKTs6uOJvWx-0_ti2AwX8cWf9n1pGgNWACt6LBoKsjjHGNUYRfnH1TminPWHDGtkD6BTc7ABC6b8xZbTQLMf01O963vqwRBqSH9eT87X0YgxSVVZ4R8Rxq1apr3b2CwpPrlp16at7cowZYkCGdAv9n3ByH6SwXG_POZPhPsCkSShjWDiqlbVd-CY9j6ezv7VqfgBERmxIDcXMVhy1kzwHeiabYMs5K05Ht')`
              }}
            ></div>

            {/* Ambient Cybernetic Grid Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>

            {/* Dynamic Vector Polygonal District Topology */}
            <svg className="absolute inset-0 w-full h-full pointer-events-auto" preserveAspectRatio="none" viewBox="0 0 1000 700">
              <defs>
                <linearGradient id="grad-zone4" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45"></stop>
                  <stop offset="100%" stopColor="#991b1b" stopOpacity="0.15"></stop>
                </linearGradient>
                <linearGradient id="grad-zone7" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35"></stop>
                  <stop offset="100%" stopColor="#78350f" stopOpacity="0.1"></stop>
                </linearGradient>
                <linearGradient id="grad-zone9" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25"></stop>
                  <stop offset="100%" stopColor="#083344" stopOpacity="0.05"></stop>
                </linearGradient>
                <linearGradient id="grad-zone12" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#064e3b" stopOpacity="0.05"></stop>
                </linearGradient>
                <filter height="140%" id="vector-glow" width="140%" x="-20%" y="-20%">
                  <feGaussianBlur result="blur" stdDeviation="3"></feGaussianBlur>
                  <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
                </filter>
              </defs>

              {/* Zone 12: South / Bommanahalli / Electronic City (Green/Nominal) */}
              <polygon
                className="cursor-pointer hover:opacity-90 transition-opacity"
                fill="url(#grad-zone12)"
                points="120,440 280,410 390,560 300,680 90,620"
                stroke="#4edea3"
                strokeDasharray="4,2"
                strokeWidth="1.5"
                onClick={() => setSelectedZone('12')}
              ></polygon>
              <text fill="#4edea3" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700" letterSpacing="1" x="220" y="540">
                ZONE 12 // KORAMANGALA & E-CITY
              </text>
              <text fill="#dfe2f1" fontFamily="JetBrains Mono" fontSize="10" x="220" y="558">
                TEMP 33.4°C • NOMINAL
              </text>

              {/* Zone 9: West / Malleshwaram & Rajajinagar (Cyan/Moderate) */}
              <polygon
                className="cursor-pointer hover:opacity-90 transition-opacity"
                fill="url(#grad-zone9)"
                points="150,150 360,110 440,290 310,380 180,310"
                stroke="#4cd7f6"
                strokeWidth="1.5"
                onClick={() => setSelectedZone('9')}
              ></polygon>
              <text fill="#4cd7f6" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700" letterSpacing="1" x="240" y="230">
                ZONE 09 // MALLESHWARAM CORRIDOR
              </text>
              <text fill="#dfe2f1" fontFamily="JetBrains Mono" fontSize="10" x="240" y="248">
                TEMP 35.8°C • ADVISORY
              </text>

              {/* Zone 7: Industrial East / Peenya (Amber/Warning) */}
              <polygon
                className="cursor-pointer hover:opacity-90 transition-opacity"
                fill="url(#grad-zone7)"
                points="680,210 930,160 960,420 790,470 690,360"
                stroke="#f59e0b"
                strokeWidth="1.5"
                onClick={() => setSelectedZone('7')}
              ></polygon>
              <text fill="#f59e0b" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700" letterSpacing="1" x="760" y="300">
                ZONE 07 // PEENYA INDUSTRIAL HUB
              </text>
              <text fill="#dfe2f1" fontFamily="JetBrains Mono" fontSize="10" x="760" y="318">
                TEMP 38.9°C • HIGH LOAD
              </text>

              {/* Zone 4: Central Commercial / MG Road - Indiranagar (CRITICAL HAZARD) */}
              <polygon
                className="cursor-pointer transition-all duration-300"
                fill="url(#grad-zone4)"
                filter="url(#vector-glow)"
                id="poly-zone-4"
                points="420,190 640,150 720,380 570,490 390,390"
                stroke="#ffb4ab"
                strokeWidth="2.5"
                onClick={() => setSelectedZone('4')}
              ></polygon>

              {/* Heat Canyon Concentric Heatwave Shockwaves */}
              <circle cx="530" cy="310" fill="none" opacity="0.6" r="45" stroke="#ef4444" strokeWidth="1.5">
                <animate attributeName="r" dur="4s" repeatCount="indefinite" values="30;95;30"></animate>
                <animate attributeName="opacity" dur="4s" repeatCount="indefinite" values="0.7;0.1;0.7"></animate>
              </circle>
              <circle cx="530" cy="310" fill="none" opacity="0.4" r="75" stroke="#ffb4ab" strokeDasharray="3,3" strokeWidth="1"></circle>
              <line opacity="0.8" stroke="#4cd7f6" strokeDasharray="2,2" strokeWidth="1" x1="530" x2="610" y1="310" y2="180"></line>
              <circle cx="530" cy="310" fill="#4cd7f6" r="4"></circle>
            </svg>

            {/* Dynamic Map Pins & Micro Markers */}
            {/* Hospital 1: St. John's Emergency */}
            <div className="absolute top-[28%] left-[64%] transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-[#0a0e18]/90 px-2 py-1 rounded shadow-lg backdrop-blur cursor-pointer hover:scale-105 transition-transform border border-error/50">
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
              <span className="material-symbols-outlined text-error text-[16px]">local_hospital</span>
              <div className="flex flex-col">
                <span className="font-data-mono-sm text-[10px] text-on-surface font-bold leading-tight">
                  St. John's Hospital ER
                </span>
                <span className="font-data-mono-sm text-[9px] text-error font-bold">92% OCCUPIED</span>
              </div>
            </div>

            {/* Hospital 2: Bowring & Lady Curzon */}
            <div className="absolute bottom-[32%] left-[22%] transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-[#0a0e18]/90 px-2 py-1 rounded shadow-lg backdrop-blur cursor-pointer hover:scale-105 transition-transform border border-tertiary/40">
              <span className="material-symbols-outlined text-tertiary text-[16px]">local_hospital</span>
              <div className="flex flex-col">
                <span className="font-data-mono-sm text-[10px] text-on-surface font-bold leading-tight">
                  Bowring &amp; Lady Curzon
                </span>
                <span className="font-data-mono-sm text-[9px] text-tertiary">68% NOMINAL</span>
              </div>
            </div>

            {/* Cooling Center Alpha: Kanteerava Cooling Hub */}
            <div className="absolute top-[48%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-[#0a0e18]/90 px-2 py-1 rounded shadow-lg backdrop-blur border-l-2 border-primary cursor-pointer hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-primary text-[16px]">ac_unit</span>
              <div className="flex flex-col">
                <span className="font-data-mono-sm text-[10px] text-on-surface font-bold leading-tight">
                  Kanteerava Cooling Hub
                </span>
                <span className="font-data-mono-sm text-[9px] text-primary">COOLING ACTIVE (412 PAX)</span>
              </div>
            </div>

            {/* Cooling Center Beta: Koramangala Sanctuary */}
            <div className="absolute bottom-[24%] left-[72%] transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-[#0a0e18]/90 px-2 py-1 rounded shadow-lg backdrop-blur border-l-2 border-primary cursor-pointer hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-primary text-[16px]">ac_unit</span>
              <div className="flex flex-col">
                <span className="font-data-mono-sm text-[10px] text-on-surface font-bold leading-tight">
                  Koramangala Sanctuary
                </span>
                <span className="font-data-mono-sm text-[9px] text-tertiary">CAPACITY: 850 FREE</span>
              </div>
            </div>

            {/* Mobile EMS Unit 09 in Transit */}
            <div className="absolute top-[38%] left-[34%] transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-[#262a35] px-2 py-0.5 rounded shadow-md border border-[#3d494c]">
              <span className="material-symbols-outlined text-secondary text-[14px]">ambulance</span>
              <span className="font-data-mono-sm text-[9px] text-secondary font-mono">EMS-09 (EN ROUTE)</span>
            </div>

            {/* Interactive Pinned Zone 4 Inspection Callout Card */}
            {selectedZone === '4' && (
              <div className="absolute top-[18%] left-[42%] w-72 bg-[#171b26]/95 backdrop-blur-xl p-3 rounded-xl shadow-2xl transition-all duration-300 border border-error/60 z-30">
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-[#262a35]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                    <span className="font-label-caps text-label-caps uppercase text-error font-bold">
                      ZONE 04: CANYON CORE (MG RD)
                    </span>
                  </div>
                  <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">NODE_441</span>
                </div>
                <div className="flex flex-col gap-1 mb-2">
                  <div className="flex items-baseline justify-between">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Ambient Surface Temp:</span>
                    <span className="font-data-mono-lg text-data-mono-lg text-error font-bold">
                      {currentTimeline.temp} <span className="font-data-mono-sm text-[11px] text-error">({currentTimeline.delta})</span>
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Elderly / Vulnerable Index:</span>
                    <span className="font-data-mono-sm text-data-mono-sm text-on-surface font-semibold">
                      34,200 Citizens
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">HAL Substation 4B Load:</span>
                    <span className="font-data-mono-sm text-data-mono-sm text-error font-bold">
                      94.2% (CRITICAL)
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Active Cooling Hubs:</span>
                    <span className="font-data-mono-sm text-data-mono-sm text-tertiary">3 Operable / 1 Full</span>
                  </div>
                </div>
                <div className="w-full bg-[#313540] h-1.5 rounded-full overflow-hidden mb-2">
                  <div className="bg-error h-full rounded-full" style={{ width: '94.2%' }}></div>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <button
                    onClick={() => onNavigateTab('ai-predictions-and-alerts')}
                    className="flex-1 bg-primary text-on-primary font-data-mono-sm text-[11px] font-bold py-1 rounded hover:brightness-110 transition-colors"
                  >
                    INSPECT GRID
                  </button>
                  <button
                    onClick={() => setToastMessage('4 Indira Canteen Hydration points tagged.')}
                    className="bg-[#262a35] hover:bg-[#313540] text-on-surface px-2 py-1 rounded transition-colors"
                    title="Locate Hydration Points"
                  >
                    <span className="material-symbols-outlined text-[16px] align-middle">water_drop</span>
                  </button>
                </div>
              </div>
            )}

            {/* Floating Map Instrument Tools (Bottom-Left) */}
            <div className="absolute bottom-4 left-4 bg-[#171b26]/90 backdrop-blur-md p-1 rounded-xl shadow-lg flex items-center gap-1 border border-[#262a35]">
              <button
                onClick={() => setSelectedZone('4')}
                className="p-1.5 hover:bg-[#262a35] rounded text-on-surface-variant hover:text-on-surface"
                title="Recenter Target"
              >
                <span className="material-symbols-outlined text-[18px]">my_location</span>
              </button>
              <button className="p-1.5 hover:bg-[#262a35] rounded text-on-surface-variant hover:text-on-surface" title="Zoom In">
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
              <button className="p-1.5 hover:bg-[#262a35] rounded text-on-surface-variant hover:text-on-surface" title="Zoom Out">
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="w-px h-4 bg-[#313540] mx-0.5"></span>
              <button className="p-1.5 hover:bg-[#262a35] rounded text-on-surface-variant hover:text-on-surface" title="3D Elevation Tilt">
                <span className="material-symbols-outlined text-[18px]">3d_rotation</span>
              </button>
            </div>

            {/* Dynamic Map Legend (Bottom-Right) */}
            <div className="absolute bottom-4 right-4 bg-[#171b26]/90 backdrop-blur-md px-3 py-1 rounded-xl shadow-lg hidden sm:flex items-center gap-3 font-data-mono-sm text-[10px] border border-[#262a35]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-error"></span>
                <span className="text-on-surface-variant">&gt;40°C Critical</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
                <span className="text-on-surface-variant">36-39°C Elevated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-primary"></span>
                <span className="text-on-surface-variant">32-35°C Advisory</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-tertiary"></span>
                <span className="text-on-surface-variant">&lt;31°C Nominal</span>
              </div>
            </div>
          </div>

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
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-[#1c1f2a] border border-[#262a35]">
              <div
                className="w-full h-full bg-cover bg-center opacity-70"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCmxdHhprsjcgFIkwbTDzs_9egrwmZCKTcET-WkxZrfvSyF3b8rF1AEW1dOiKMWFMz5KMndnjD5jp2EMBOqu2K8_oBCi6ycTyZvMcywjTipoIbq_Fz7Hnrb8ZL3Aw_465zqQf7hD0OnZ4p-jpGPxCS3fLZN2AYJ3j_bsGk1Elc16EbCtGffgR9kbZJI_enczfCfFJpwz8ZL-p1xCjuecAuYxpXPZylhs5Du6OwJ98H2b_SvgE1MeewH')`
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#171b26] via-transparent to-transparent"></div>
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                <span className="font-data-mono-sm text-data-mono-sm text-on-surface font-semibold">
                  Population: 184,500 Density/km²
                </span>
                <span className="font-data-mono-sm text-data-mono-sm text-error bg-[#0a0e18]/80 px-1.5 py-0.5 rounded">
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
