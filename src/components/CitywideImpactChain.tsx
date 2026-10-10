import React, { useState } from 'react';

interface CitywideImpactChainProps {
  onNavigateTab: (tab: any) => void;
}

export const CitywideImpactChain: React.FC<CitywideImpactChainProps> = ({ onNavigateTab }) => {
  const [showSeverLines, setShowSeverLines] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState('node-substation-04');
  const [severDeployed, setSeverDeployed] = useState(false);
  const [isSimulatingAlternative, setIsSimulatingAlternative] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const nodeData: Record<string, {
    id: string;
    title: string;
    category: string;
    colorClass: string;
    desc: string;
    vuln: string;
    ripple: string;
  }> = {
    'node-nexus': {
      id: 'ENV-TRIGGER-01',
      title: 'Extreme Heat Index 42.4°C Peak',
      category: 'ENVIRONMENTAL TELEMETRY MESH (IMD BENGALURU)',
      colorClass: 'text-error',
      desc: 'Sustained solar radiation index 9.4 with asphalt albedo re-radiation. Generates systemic heat stress across open power lines, road surfaces, and outdoor human populations across Bengaluru.',
      vuln: '9.9',
      ripple: '12 Nodes'
    },
    'node-substation-04': {
      id: 'NODE-SUBSTATION-04',
      title: 'HAL Substation 04 Transformer Thermal Overload',
      category: 'PRIMARY SECTOR: ENERGY OPERATIONS (BESCOM)',
      colorClass: 'text-primary',
      desc: 'Critical 132/66kV municipal transformer core temperature reached 104°C due to sustained high ambient heat combined with +24% peak air-conditioning refrigeration load from Zone 4 commercial & tech towers.',
      vuln: '8.9',
      ripple: '4 Nodes'
    },
    'node-road-bitumen': {
      id: 'NODE-TRANSIT-BITUMEN',
      title: 'Bitumen Track Softening along Outer Ring Road',
      category: 'PRIMARY SECTOR: TRANSIT AUTHORITY (BTP & BBMP)',
      colorClass: 'text-secondary',
      desc: 'Surface asphalt temperatures exceeding 58°C causing road surface rutting along Silk Board and Bellandur Outer Ring Road. Heavy emergency transport and BMTC buses restricted to 25 km/h.',
      vuln: '6.4',
      ripple: '3 Nodes'
    },
    'node-heatstroke-surge': {
      id: 'NODE-HEALTH-DEHYDRATION',
      title: 'Severe Dehydration & Heat Stroke Surge',
      category: 'PRIMARY SECTOR: PUBLIC HEALTH (BBMP / DHS)',
      colorClass: 'text-error',
      desc: 'Ambulance dispatches spiked +310 calls/hour. Emergency departments in St. John\'s, Bowring, and Victoria hospitals at 108% nominal triage bed capacity.',
      vuln: '8.7',
      ripple: '5 Nodes'
    },
    'node-icu-generator': {
      id: 'NODE-HEALTH-GENSET',
      title: 'St. John\'s & Bowring ICU Generator Switch',
      category: 'SECONDARY MULTIPLIER: HEALTH + ENERGY',
      colorClass: 'text-error',
      desc: 'Main grid disconnect tripped by voltage sag protection. Backup diesel reserves at 82% fuel; continuous emergency load consumes 420 liters per operating hour.',
      vuln: '7.8',
      ripple: '2 Nodes'
    },
    'node-signals-dark': {
      id: 'NODE-TRANSIT-SIGNALS',
      title: 'Silk Board & Corridor Signals Offline',
      category: 'SECONDARY MULTIPLIER: TRAFFIC OPERATIONS (BTP)',
      colorClass: 'text-secondary',
      desc: '14 key intersection controllers along Old Airport Road & Silk Board lost grid synchronization. Ambulance transit delays inflated by +18.4 minutes across primary medical access routes.',
      vuln: '8.2',
      ripple: '4 Nodes'
    },
    'node-water-pressure': {
      id: 'NODE-WATER-PRESSURE',
      title: 'Zone 4 BWSSB Municipal Water Pressure Drop',
      category: 'SECONDARY MULTIPLIER: WATER WORKS (BWSSB)',
      colorClass: 'text-tertiary',
      desc: 'Cooling center HVAC chillers and emergency misting drew 15 PSI localized pressure loss. Impairs firefighting and emergency water reserves.',
      vuln: '5.9',
      ripple: '2 Nodes'
    },
    'node-bottleneck-alpha': {
      id: 'BOTTLENECK-ALPHA-CRITICAL',
      title: 'Emergency Corridor Paralysis Bottleneck',
      category: 'STAGE 4 CRITICAL MULTI-SILO BOTTLENECK',
      colorClass: 'text-error',
      desc: 'HAL Substation 4 degradation directly starves the traffic signal grid on Old Airport Road while concurrently flooding the hospital route with heatstroke emergencies, creating catastrophic response gridlock.',
      vuln: '9.8',
      ripple: '8 Silos'
    }
  };

  const activeNode = nodeData[selectedNodeId] || nodeData['node-substation-04'];

  const handleSimulateAlternative = () => {
    setIsSimulatingAlternative(true);
    setTimeout(() => {
      setIsSimulatingAlternative(false);
      setToastMessage('Alternative Cutoff points calculated: Path B yields 91.2% stabilization.');
      setTimeout(() => setToastMessage(null), 3000);
    }, 1200);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(nodeData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', 'Bengaluru_Causal_Topology.json');
    dlAnchorElem.click();
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Top Telemetry & Scenario Context Banner */}
      <div className="relative w-full bg-[#171b26] rounded-xl p-4 mb-4 shadow-xl border border-[#262a35] overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gradient-to-br from-primary/10 via-error/5 to-transparent blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-tertiary/5 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4">
          <div className="flex flex-col gap-1 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error/15 text-error font-data-mono-sm text-data-mono-sm border border-error/30">
                <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                ROOT CAUSAL TRIGGER IDENTIFIED
              </span>
              <span className="px-2 py-0.5 rounded bg-[#262a35] text-primary font-data-mono-sm text-data-mono-sm border border-[#3d494c]">
                GRAPH_ID: NET-IMPACT-7789A
              </span>
              <span className="px-2 py-0.5 rounded bg-[#1c1f2a] text-on-surface-variant font-data-mono-sm text-data-mono-sm">
                CYCLE RUN: T+03:42:18 IST
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#262a35] flex items-center justify-center flex-shrink-0 text-primary border border-[#3d494c]">
                <span className="material-symbols-outlined text-[28px]">account_tree</span>
              </div>
              <div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Citywide Impact Chain: Cross-Silo Causal Topology — Bengaluru
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Predictive neural modeling of cascading systemic collapse across municipal infrastructures (BESCOM, BBMP, BMRCL, BTP, BWSSB) under extreme stressors.
                </p>
              </div>
            </div>
          </div>

          {/* Incident Meta Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0a0e18]/80 backdrop-blur-md p-3 rounded-xl border border-[#262a35]">
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps uppercase text-outline">Root Stressor</span>
              <span className="font-headline-sm text-headline-sm text-error mt-0.5 font-bold">42.4°C Peak</span>
              <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">L3 Heatwave Delta</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps uppercase text-outline">Silos Impacted</span>
              <span className="font-headline-sm text-headline-sm text-primary mt-0.5 font-bold">5 Portfolios</span>
              <span className="font-data-mono-sm text-data-mono-sm text-tertiary">38 Nodes Bound</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps uppercase text-outline">Cascade Velocity</span>
              <span className="font-headline-sm text-headline-sm text-error mt-0.5 font-bold">+14.2% / hr</span>
              <span className="font-data-mono-sm text-data-mono-sm text-error">Unchecked Surge</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps uppercase text-outline">Risk Radius</span>
              <span className="font-headline-sm text-headline-sm text-secondary mt-0.5 font-bold">420k Citizens</span>
              <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">Zones 2, 4 &amp; 7</span>
            </div>
          </div>
        </div>

        {/* Graph Global Control Toolbar */}
        <div className="mt-3 pt-3 flex flex-wrap items-center justify-between gap-3 bg-[#1c1f2a]/60 rounded-lg px-3 py-2 border-t border-[#262a35]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-label-caps text-label-caps uppercase text-outline">Nexus Incident:</span>
              <select className="bg-[#262a35] font-data-mono-sm text-data-mono-sm text-primary px-3 py-1.5 rounded-lg focus:outline-none cursor-pointer border border-[#3d494c]">
                <option>HEATWAVE ALPHA: 42°C Ambient Peak (Active)</option>
                <option>SILK BOARD &amp; ORR ARTERIAL FLOOD CHOKE</option>
                <option>PEENYA SUB-07 MASTER GRID FIRE RISK</option>
                <option>CAUVERY STAGE-IV WATER MAIN PRESSURE LOSS</option>
              </select>
            </div>

            {/* Mitigation Cutoff Switch */}
            <label className="flex items-center gap-2 cursor-pointer select-none bg-[#262a35]/80 px-3 py-1.5 rounded-lg hover:bg-[#262a35] transition-colors border border-[#3d494c]">
              <input
                type="checkbox"
                checked={showSeverLines}
                onChange={(e) => setShowSeverLines(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-8 h-4 rounded-full relative transition-colors ${showSeverLines ? 'bg-primary-container' : 'bg-[#313540]'}`}>
                <div
                  className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${showSeverLines ? 'right-0.5' : 'left-0.5'}`}
                ></div>
              </div>
              <span className="font-label-caps text-label-caps uppercase text-primary ml-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                Show AI Mitigation Sever Lines
              </span>
            </label>

            {/* Dynamic Department Legend Toggles */}
            <div className="hidden lg:flex items-center gap-2 font-label-caps text-label-caps uppercase">
              <span className="text-outline mr-1">Cross-Silos:</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#262a35] text-primary border border-[#3d494c]">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Energy (BESCOM)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#262a35] text-error border border-[#3d494c]">
                <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Health (DHS)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#262a35] text-secondary border border-[#3d494c]">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Transit (BMRCL/BTP)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#262a35] text-tertiary border border-[#3d494c]">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Water (BWSSB)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleSimulateAlternative}
              disabled={isSimulatingAlternative}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262a35] hover:bg-[#353944] text-on-surface font-data-mono-sm text-data-mono-sm transition-all shadow-sm border border-[#3d494c]"
            >
              <span className={`material-symbols-outlined text-[16px] text-tertiary ${isSimulatingAlternative ? 'animate-spin' : ''}`}>
                {isSimulatingAlternative ? 'refresh' : 'science'}
              </span>
              {isSimulatingAlternative ? 'Re-computing Paths...' : 'Simulate Alternative Cutoffs'}
            </button>
            <button
              onClick={() => onNavigateTab('ai-response-planner')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-data-mono-sm text-data-mono-sm font-semibold transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              Deploy Response Plan
            </button>
          </div>
        </div>
      </div>

      {/* Primary Interactive Canvas & Inspector Split Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-start">
        {/* 8 Columns: Dynamic Interactive Causal Graph Visualization */}
        <div className="xl:col-span-8 flex flex-col gap-3">
          {/* Stage Progression Header */}
          <div className="grid grid-cols-4 gap-2 text-center font-label-caps text-label-caps uppercase tracking-wider">
            <div className="py-1.5 rounded-lg bg-[#1c1f2a] text-on-surface-variant flex items-center justify-center gap-1 border border-[#262a35]">
              <span className="w-2 h-2 rounded-full bg-error"></span> Stage 01: Shock Nexus
            </div>
            <div className="py-1.5 rounded-lg bg-[#1c1f2a] text-on-surface-variant flex items-center justify-center gap-1 border border-[#262a35]">
              <span className="w-2 h-2 rounded-full bg-primary"></span> Stage 02: Tier-1 Stress
            </div>
            <div className="py-1.5 rounded-lg bg-[#1c1f2a] text-on-surface-variant flex items-center justify-center gap-1 border border-[#262a35]">
              <span className="w-2 h-2 rounded-full bg-secondary"></span> Stage 03: Cross Multiplier
            </div>
            <div className="py-1.5 rounded-lg bg-[#262a35] text-error font-bold flex items-center justify-center gap-1 shadow-sm border border-error/40">
              <span className="material-symbols-outlined text-[14px] text-error">warning</span> Stage 04: Bottlenecks
            </div>
          </div>

          {/* Interactive Causal Visual Canvas Container */}
          <div className="relative w-full min-h-[700px] bg-[#0a0e18] rounded-xl p-4 overflow-hidden shadow-2xl border border-[#262a35]">
            <div className="absolute inset-0 bg-[radial-gradient(#1c1f2a_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"></div>

            {/* SVG Luminescent Dependency Connectors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="streamEnergy" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.8"></stop>
                  <stop offset="50%" stopColor="#4cd7f6" stopOpacity="0.9"></stop>
                  <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.6"></stop>
                </linearGradient>
                <linearGradient id="streamTransit" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.8"></stop>
                  <stop offset="100%" stopColor="#d0bcff" stopOpacity="0.8"></stop>
                </linearGradient>
                <linearGradient id="streamHealth" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.9"></stop>
                  <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0.9"></stop>
                </linearGradient>
                <linearGradient id="streamCrossCritical" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.8"></stop>
                  <stop offset="100%" stopColor="#ffb4ab" stopOpacity="1"></stop>
                </linearGradient>
              </defs>

              {/* Branch 1: Nexus -> Substation 04 */}
              <path d="M 180 340 C 240 340, 260 170, 310 170" fill="none" stroke="url(#streamEnergy)" strokeDasharray="6,4" strokeWidth="2.5"></path>
              {/* Branch 2: Nexus -> Bitumen Road Melt */}
              <path d="M 180 340 C 240 340, 260 340, 310 340" fill="none" stroke="url(#streamTransit)" strokeWidth="2"></path>
              {/* Branch 3: Nexus -> Heat Stroke Outbreak */}
              <path d="M 180 340 C 240 340, 260 510, 310 510" fill="none" stroke="url(#streamHealth)" strokeDasharray="4,4" strokeWidth="2.5"></path>
              {/* Branch 4: Substation 04 -> ICU Emergency Backup */}
              <path d="M 480 170 C 530 170, 545 130, 580 130" fill="none" stroke="url(#streamCrossCritical)" strokeWidth="3"></path>
              {/* Branch 5: Substation 04 -> Traffic Signals Outage */}
              <path d="M 480 170 C 530 170, 545 280, 580 280" fill="none" stroke="#4cd7f6" strokeOpacity="0.8" strokeWidth="2"></path>
              {/* Branch 6: Transit Melt -> Ambulance Arterial Delay */}
              <path d="M 480 340 C 530 340, 545 300, 580 300" fill="none" stroke="#d0bcff" strokeWidth="2.5"></path>
              {/* Branch 7: Heatstroke -> Cooling Shelter Overload */}
              <path d="M 480 510 C 530 510, 545 470, 580 470" fill="none" stroke="#4edea3" strokeWidth="2"></path>
              <path d="M 480 510 C 530 510, 545 560, 580 560" fill="none" stroke="#ffb4ab" strokeWidth="2"></path>

              {/* Convergence into Critical Bottleneck (Stage 4) */}
              <path d="M 750 130 C 800 130, 810 310, 850 310" fill="none" stroke="#ffb4ab" strokeDasharray="5,3" strokeWidth="3"></path>
              <path d="M 750 290 C 800 290, 810 320, 850 320" fill="none" stroke="#ffb4ab" strokeWidth="3"></path>
              <path d="M 750 470 C 800 470, 820 370, 850 350" fill="none" stroke="#4edea3" strokeWidth="2"></path>

              {/* Visual Shield Cutoff Lines */}
              {showSeverLines && (
                <g className="transition-opacity duration-300 opacity-100">
                  <line stroke="#4cd7f6" strokeDasharray="3,3" strokeWidth="2.5" x1="530" x2="530" y1="90" y2="230"></line>
                  <circle cx="530" cy="160" fill="#06b6d4" fillOpacity="0.25" r="14" stroke="#4cd7f6" strokeWidth="1.5"></circle>
                  <text fill="#4cd7f6" fontFamily="JetBrains Mono" fontSize="8" fontWeight="bold" textAnchor="middle" x="530" y="163">
                    SEVER A
                  </text>

                  <line stroke="#4edea3" strokeDasharray="3,3" strokeWidth="2.5" x1="535" x2="535" y1="260" y2="390"></line>
                  <circle cx="535" cy="325" fill="#1bbd85" fillOpacity="0.25" r="14" stroke="#4edea3" strokeWidth="1.5"></circle>
                  <text fill="#4edea3" fontFamily="JetBrains Mono" fontSize="8" fontWeight="bold" textAnchor="middle" x="535" y="328">
                    SEVER B
                  </text>
                </g>
              )}
            </svg>

            {/* Column Grid Structure for HTML Nodes */}
            <div className="relative z-10 grid grid-cols-4 gap-3 h-full py-2 min-h-[640px]">
              {/* STAGE 1 */}
              <div className="flex flex-col justify-center items-center">
                <div
                  onClick={() => setSelectedNodeId('node-nexus')}
                  className={`w-full max-w-[210px] bg-[#1c1f2a] p-3 rounded-xl cursor-pointer hover:scale-105 transition-all shadow-lg border relative ${
                    selectedNodeId === 'node-nexus' ? 'border-primary ring-2 ring-primary' : 'border-error/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-label-caps text-label-caps text-error bg-error/10 px-2 py-0.5 rounded">
                      ENV TRIGGER
                    </span>
                    <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">T0</span>
                  </div>
                  <h4 className="font-headline-sm text-body-lg text-on-surface font-bold leading-tight">
                    Extreme Heat Index 42.4°C
                  </h4>
                  <p className="font-body-sm text-[11px] text-on-surface-variant mt-1">
                    Solar Radiation Index 9.4 + Asphalt Albedo in Bengaluru
                  </p>
                  <div className="mt-3 pt-2 bg-[#0a0e18] px-2 py-1.5 rounded flex items-center justify-between border border-[#262a35]">
                    <span className="font-data-mono-sm text-[10px] text-outline">Stress Potential</span>
                    <span className="font-data-mono-sm text-data-mono-sm text-error font-bold">CRITICAL 9.9</span>
                  </div>
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-error ring-4 ring-[#1c1f2a] animate-pulse"></div>
                </div>
              </div>

              {/* STAGE 2 */}
              <div className="flex flex-col justify-around gap-y-4">
                {/* Node: Substation 04 */}
                <div
                  onClick={() => setSelectedNodeId('node-substation-04')}
                  className={`w-full bg-[#1c1f2a] p-2.5 rounded-xl cursor-pointer hover:scale-[1.03] transition-all shadow-lg border relative ${
                    selectedNodeId === 'node-substation-04' ? 'border-primary ring-2 ring-primary' : 'border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      BESCOM POWER
                    </span>
                    <span className="font-data-mono-sm text-[10px] text-error font-bold">104°C CORE</span>
                  </div>
                  <h4 className="font-headline-sm text-body-sm text-on-surface font-semibold mt-1">
                    HAL Substation 04 Overload
                  </h4>
                  <div className="w-full bg-[#313540] h-1 rounded mt-2 overflow-hidden">
                    <div className="bg-primary h-full w-[94%]"></div>
                  </div>
                  <div className="flex justify-between items-center mt-1.5 font-data-mono-sm text-[10px]">
                    <span className="text-outline">Grid Load</span>
                    <span className="text-primary font-bold">94% (Surge)</span>
                  </div>
                  <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-[#0a0e18]"></div>
                </div>

                {/* Node: Bitumen Road */}
                <div
                  onClick={() => setSelectedNodeId('node-road-bitumen')}
                  className={`w-full bg-[#1c1f2a] p-2.5 rounded-xl cursor-pointer hover:scale-[1.03] transition-all shadow-md border relative ${
                    selectedNodeId === 'node-road-bitumen' ? 'border-secondary ring-2 ring-secondary' : 'border-[#262a35]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-secondary bg-secondary/10 px-1.5 py-0.5 rounded">
                      BTP TRANSIT
                    </span>
                    <span className="font-data-mono-sm text-[10px] text-secondary">SURFACE 58°C</span>
                  </div>
                  <h4 className="font-headline-sm text-body-sm text-on-surface font-semibold mt-1">
                    Bitumen Softening (ORR)
                  </h4>
                  <p className="font-body-sm text-[11px] text-on-surface-variant mt-1 leading-snug">
                    Speed limits reduced -40% along Silk Board - Marathahalli.
                  </p>
                  <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-[#0a0e18]"></div>
                </div>

                {/* Node: Heatstroke Surge */}
                <div
                  onClick={() => setSelectedNodeId('node-heatstroke-surge')}
                  className={`w-full bg-[#1c1f2a] p-2.5 rounded-xl cursor-pointer hover:scale-[1.03] transition-all shadow-md border relative ${
                    selectedNodeId === 'node-heatstroke-surge' ? 'border-error ring-2 ring-error' : 'border-[#262a35]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-error bg-error/10 px-1.5 py-0.5 rounded">
                      PUBLIC HEALTH
                    </span>
                    <span className="font-data-mono-sm text-[10px] text-error font-bold">+310 CALLS/HR</span>
                  </div>
                  <h4 className="font-headline-sm text-body-sm text-on-surface font-semibold mt-1">
                    Severe Dehydration Spike
                  </h4>
                  <p className="font-body-sm text-[11px] text-on-surface-variant mt-1 leading-snug">
                    Elderly clusters in Shivajinagar &amp; Zone 4 at critical risk.
                  </p>
                  <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-error ring-2 ring-[#0a0e18]"></div>
                </div>
              </div>

              {/* STAGE 3 */}
              <div className="flex flex-col justify-around gap-y-3">
                {/* Node: Hospital Gen-set */}
                <div
                  onClick={() => setSelectedNodeId('node-icu-generator')}
                  className={`w-full bg-[#262a35] p-2.5 rounded-xl cursor-pointer hover:scale-[1.03] transition-all shadow-md border relative ${
                    selectedNodeId === 'node-icu-generator' ? 'border-primary ring-2 ring-primary' : 'border-[#3d494c]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-error bg-error/15 px-1.5 py-0.5 rounded">
                      HEALTH + ENERGY
                    </span>
                    <span className="font-data-mono-sm text-[10px] text-error">DIESEL TANK 82%</span>
                  </div>
                  <h4 className="font-headline-sm text-body-sm text-on-surface font-semibold mt-1">
                    St. John's ICU Gen-Set
                  </h4>
                  <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">
                    Isolated from grid due to voltage drop at HAL Substation 4.
                  </p>
                  <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-error ring-2 ring-[#0a0e18]"></div>
                </div>

                {/* Node: Signals Offline */}
                <div
                  onClick={() => setSelectedNodeId('node-signals-dark')}
                  className={`w-full bg-[#262a35] p-2.5 rounded-xl cursor-pointer hover:scale-[1.03] transition-all shadow-md border relative ${
                    selectedNodeId === 'node-signals-dark' ? 'border-secondary ring-2 ring-secondary' : 'border-[#3d494c]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-secondary bg-secondary/15 px-1.5 py-0.5 rounded">
                      BTP TRAFFIC OPS
                    </span>
                    <span className="font-data-mono-sm text-[10px] text-secondary">14 JUNCTIONS</span>
                  </div>
                  <h4 className="font-headline-sm text-body-sm text-on-surface font-semibold mt-1">
                    Corridor Signals Offline
                  </h4>
                  <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">
                    Ambulance runtimes bloated +18.4 mins on Old Airport Rd.
                  </p>
                  <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-[#0a0e18]"></div>
                </div>

                {/* Node: Water Pressure Drop */}
                <div
                  onClick={() => setSelectedNodeId('node-water-pressure')}
                  className={`w-full bg-[#262a35] p-2.5 rounded-xl cursor-pointer hover:scale-[1.03] transition-all shadow-md border relative ${
                    selectedNodeId === 'node-water-pressure' ? 'border-tertiary ring-2 ring-tertiary' : 'border-[#3d494c]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-tertiary bg-tertiary/15 px-1.5 py-0.5 rounded">
                      BWSSB WATER
                    </span>
                    <span className="font-data-mono-sm text-[10px] text-tertiary">38 PSI LOW</span>
                  </div>
                  <h4 className="font-headline-sm text-body-sm text-on-surface font-semibold mt-1">
                    Zone 4 Main Pressure Drop
                  </h4>
                  <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">
                    High HVAC chiller draw drops municipal head pressure.
                  </p>
                  <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-tertiary ring-2 ring-[#0a0e18]"></div>
                </div>
              </div>

              {/* STAGE 4 */}
              <div className="flex flex-col justify-center items-center">
                <div
                  onClick={() => setSelectedNodeId('node-bottleneck-alpha')}
                  className={`w-full max-w-[220px] bg-[#313540] p-3 rounded-xl cursor-pointer hover:scale-105 transition-all shadow-2xl border-2 relative overflow-hidden group ${
                    selectedNodeId === 'node-bottleneck-alpha' ? 'border-error ring-2 ring-error' : 'border-error'
                  }`}
                >
                  <div className="absolute inset-0 bg-error/5 group-hover:bg-error/10 transition-colors pointer-events-none"></div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-label-caps text-label-caps text-surface-container-lowest bg-error font-bold px-2 py-0.5 rounded uppercase">
                      CRITICAL BOTTLENECK
                    </span>
                    <span className="material-symbols-outlined text-error text-[18px]">emergency</span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-error font-bold leading-tight">
                    Emergency Corridor Paralysis
                  </h4>
                  <p className="font-body-sm text-[12px] text-on-surface font-medium mt-2 leading-relaxed">
                    Dual failure of HAL Substation 04 + Route 9 signals traps 8 frontline ambulances simultaneously.
                  </p>
                  <div className="mt-3 pt-2 bg-[#0a0e18]/90 rounded-lg p-2 flex flex-col gap-1 border border-[#262a35]">
                    <div className="flex items-center justify-between font-data-mono-sm text-[10px]">
                      <span className="text-outline">Patient Impact:</span>
                      <span className="text-error font-bold">+38% Mortality Delta</span>
                    </div>
                    <div className="flex items-center justify-between font-data-mono-sm text-[10px]">
                      <span className="text-outline">Cascading Cost:</span>
                      <span className="text-primary font-bold">₹1.52 Cr / Hour</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-1 py-1 rounded bg-error text-surface-container-lowest font-data-mono-sm text-data-mono-sm font-bold">
                    <span className="material-symbols-outlined text-[14px]">lock_reset</span>
                    PRIORITY MITIGATION #1
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Cascade Propagation Forecast Timeline Chart */}
          <div className="w-full bg-[#171b26] rounded-xl p-3 shadow-lg border border-[#262a35]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">show_chart</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Cascade Propagation Forecast (T+00 to T+06 Hours IST)
                </h3>
              </div>
              <span className="font-data-mono-sm text-data-mono-sm text-outline">STRESS MULTIPLIER DERIVATIVE</span>
            </div>

            <div className="w-full h-32 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 120">
                <line stroke="#313540" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="800" y1="20" y2="20"></line>
                <line stroke="#313540" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="800" y1="60" y2="60"></line>
                <line stroke="#313540" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="800" y1="100" y2="100"></line>

                {/* Unmitigated Disaster Curve */}
                <path d="M 0 100 Q 200 95, 350 70 T 550 30 T 800 5 L 800 120 L 0 120 Z" fill="#ffb4ab" fillOpacity="0.08"></path>
                <path d="M 0 100 Q 200 95, 350 70 T 550 30 T 800 5" fill="none" stroke="#ffb4ab" strokeWidth="2.5"></path>

                {/* AI Mitigated Trajectory */}
                <path d="M 0 100 Q 200 95, 350 70 T 500 78 T 800 85 L 800 120 L 0 120 Z" fill="#4cd7f6" fillOpacity="0.08"></path>
                <path d="M 0 100 Q 200 95, 350 70 T 500 78 T 800 85" fill="none" stroke="#4cd7f6" strokeDasharray="4,2" strokeWidth="2.5"></path>

                <circle cx="350" cy="70" fill="#ffb4ab" r="4"></circle>
                <text fill="#ffb4ab" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="350" y="60">
                  T+02h [HAL Sub-4 Trip Risk]
                </text>
                <circle cx="500" cy="78" fill="#4cd7f6" r="4"></circle>
                <text fill="#4cd7f6" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="500" y="98">
                  T+03.5h [Mitigation Plateau]
                </text>
              </svg>
            </div>
            <div className="flex items-center justify-between text-outline font-data-mono-sm text-data-mono-sm mt-2 px-1">
              <span>T+00h (Now: 14:00 IST)</span>
              <span>T+01h</span>
              <span>T+02h (Projected Peak Temp)</span>
              <span>T+03h</span>
              <span>T+04h (Shift Handover)</span>
              <span>T+05h</span>
              <span>T+06h (Sunset Drop)</span>
            </div>
          </div>
        </div>

        {/* 4 Columns: Node Inspector & Inter-Department Cross-Talk Drawer */}
        <div className="xl:col-span-4 flex flex-col gap-3">
          {/* Primary Node Telemetry Card */}
          <div className="w-full bg-[#171b26] rounded-xl p-4 shadow-xl border border-[#262a35] relative overflow-hidden transition-all">
            <div className="flex items-center justify-between mb-2 pb-2 bg-[#1c1f2a] px-3 py-2 rounded-lg border border-[#262a35]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                  NODE TELEMETRY INSPECTOR
                </span>
              </div>
              <span className="font-data-mono-sm text-data-mono-sm text-outline">{activeNode.id}</span>
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                {activeNode.title}
              </h2>
              <span className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary font-data-mono-sm text-data-mono-sm self-start border border-primary/30">
                {activeNode.category}
              </span>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
              {activeNode.desc}
            </p>

            {/* Detailed Vulnerability & Impact Ratios */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="p-2.5 bg-[#1c1f2a] rounded-lg border border-[#262a35]">
                <span className="font-label-caps text-label-caps uppercase text-outline">
                  Cascade Vulnerability
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline-sm text-headline-sm text-error font-bold">
                    {activeNode.vuln}
                  </span>
                  <span className="font-data-mono-sm text-data-mono-sm text-outline">/ 10</span>
                </div>
                <div className="w-full bg-[#313540] h-1 rounded mt-1.5 overflow-hidden">
                  <div className="bg-error h-full" style={{ width: `${parseFloat(activeNode.vuln) * 10}%` }}></div>
                </div>
              </div>

              <div className="p-2.5 bg-[#1c1f2a] rounded-lg border border-[#262a35]">
                <span className="font-label-caps text-label-caps uppercase text-outline">
                  Direct Ripple Count
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    {activeNode.ripple}
                  </span>
                  <span className="font-data-mono-sm text-data-mono-sm text-outline">Tiers 2-4</span>
                </div>
                <div className="w-full bg-[#313540] h-1 rounded mt-1.5 overflow-hidden">
                  <div className="bg-primary h-full w-[70%]"></div>
                </div>
              </div>
            </div>

            {/* Cross-Department Impact Matrix */}
            <div className="mt-3">
              <span className="font-label-caps text-label-caps uppercase text-outline block mb-1.5">
                Secondary Silo Ripple Impact
              </span>
              <div className="space-y-1.5">
                <div className="p-2 rounded-lg bg-[#1c1f2a] flex items-center justify-between border border-[#262a35]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-error">local_hospital</span>
                    <div>
                      <h4 className="font-headline-sm text-body-sm text-on-surface font-semibold leading-tight">
                        Public Health Services
                      </h4>
                      <p className="font-body-sm text-[11px] text-on-surface-variant">
                        St. John's &amp; Bowring switch to internal backup gen-sets
                      </p>
                    </div>
                  </div>
                  <span className="font-data-mono-sm text-data-mono-sm text-error font-bold">+28% RISK</span>
                </div>

                <div className="p-2 rounded-lg bg-[#1c1f2a] flex items-center justify-between border border-[#262a35]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">traffic</span>
                    <div>
                      <h4 className="font-headline-sm text-body-sm text-on-surface font-semibold leading-tight">
                        Transit &amp; Signal Authority (BTP)
                      </h4>
                      <p className="font-body-sm text-[11px] text-on-surface-variant">
                        Route 9 &amp; Silk Board signals drop to fail-safe flashing yellows
                      </p>
                    </div>
                  </div>
                  <span className="font-data-mono-sm text-data-mono-sm text-secondary font-bold">14 INTXNS</span>
                </div>

                <div className="p-2 rounded-lg bg-[#1c1f2a] flex items-center justify-between border border-[#262a35]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-tertiary">water_drop</span>
                    <div>
                      <h4 className="font-headline-sm text-body-sm text-on-surface font-semibold leading-tight">
                        Municipal Water Works (BWSSB)
                      </h4>
                      <p className="font-body-sm text-[11px] text-on-surface-variant">
                        Pumping Station 12 auxiliary motor auto-shedding
                      </p>
                    </div>
                  </div>
                  <span className="font-data-mono-sm text-data-mono-sm text-tertiary font-bold">-15 PSI</span>
                </div>
              </div>
            </div>

            {/* Department Cross-Talk Log */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-label-caps text-label-caps uppercase text-outline">
                  Autonomous Dispatch Comms
                </span>
                <span className="font-data-mono-sm text-[10px] text-tertiary">ENCRYPTED BENGALURU SYNC</span>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                <div className="p-2 rounded bg-[#1c1f2a] text-[11px] font-body-sm leading-relaxed text-on-surface-variant border border-[#262a35]">
                  <span className="font-data-mono-sm text-primary font-bold">[14:18:02 BESCOM_AI]:</span>
                  {' '}Load transfer request triggered: Shunting 18MW to North Hydro Reserve to cool HAL Substation 4.
                </div>
                <div className="p-2 rounded bg-[#1c1f2a] text-[11px] font-body-sm leading-relaxed text-on-surface-variant border border-[#262a35]">
                  <span className="font-data-mono-sm text-secondary font-bold">[14:19:44 BTP_BOT]:</span>
                  {' '}Outer Ring Road ambulance priority override active. Signal cycle synchronized to 120s green wave.
                </div>
                <div className="p-2 rounded bg-[#1c1f2a] text-[11px] font-body-sm leading-relaxed text-on-surface-variant border border-[#262a35]">
                  <span className="font-data-mono-sm text-error font-bold">[14:21:10 HEALTH_DESK]:</span>
                  {' '}St. John's received automated power stability alert. Chilled water storage reserves holding at 94%.
                </div>
              </div>
            </div>

            {/* Recommended Mitigation Action */}
            <div className="mt-3 p-3 rounded-xl bg-[#262a35] border border-primary/30">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                  ACTIVE SEVER RECOMMENDATION
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface">
                Execute automated battery-storage injection (Zone 4 Domlur microgrid) to sever the link between HAL Substation 04 and traffic controller relays.
              </p>
              <div className="mt-2.5 flex gap-2">
                <button
                  onClick={() => {
                    setSeverDeployed(true);
                    setToastMessage('Sever action executed: Battery storage injected into Zone 4 microgrid.');
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg font-data-mono-sm text-data-mono-sm font-bold transition-all text-center ${
                    severDeployed
                      ? 'bg-tertiary text-on-tertiary'
                      : 'bg-primary text-on-primary hover:brightness-110'
                  }`}
                >
                  {severDeployed ? 'SEVER ACTION ACTIVE' : 'DEPLOY SEVER ACTION'}
                </button>
                <button
                  onClick={() => onNavigateTab('ai-response-planner')}
                  className="p-2 rounded-lg bg-[#1c1f2a] hover:bg-[#313540] text-on-surface-variant transition-colors border border-[#3d494c]"
                  title="Simulate Tradeoff"
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Infrastructure Camera Feeds & Geo Validation */}
          <div className="w-full bg-[#171b26] rounded-xl p-3 shadow-lg border border-[#262a35]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-caps text-label-caps uppercase text-outline">
                PHYSICAL TELEMETRY FEEDS
              </span>
              <span className="font-data-mono-sm text-data-mono-sm text-primary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> OPTICAL 4K
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative rounded-lg overflow-hidden group aspect-video bg-[#0a0e18] border border-[#262a35]">
                <img
                  className="w-full h-full object-cover"
                  alt="BESCOM HAL Substation Thermal Camera"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmda90_a5YU1A1gbLaYFMLtn-rb6vJzTzTeT1O5uat9c8ua-7dRUQ-SCBv6iuIOSy467LFyHXIeQWZ0ChqgyPpZjnFAI8EMbcED5gCIjEEMh2DlfYYfIuWufTVhcClYPw_1weDBuTVWTeMu93GjfxSUDBwRJ2DbqNdxQpAeSK_1J4F7l4jM2JTbABG_S65jX6I7GOpsRl3VK0ImANFg9baGAf9nbl4j7jwjeFDVQrJUeo6tQFkz2uP"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e18] via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-1 left-2 right-2 flex justify-between items-end">
                  <span className="font-data-mono-sm text-[10px] text-on-surface">CAM 04-SUB (IR)</span>
                  <span className="font-data-mono-sm text-[10px] text-error font-bold">104°C</span>
                </div>
              </div>

              <div className="relative rounded-lg overflow-hidden group aspect-video bg-[#0a0e18] border border-[#262a35]">
                <img
                  className="w-full h-full object-cover"
                  alt="Outer Ring Road Bellandur Traffic Camera"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeA-NFNvl3UiOjJseI1itO94KSZpL3F8irgL9YeCiZ-S9v1CeFbpjzFJJ9rebkZnFKReIbSLGJw6A_nMZ0UJXvlcWb9Sdyc_O1ma9GWcCJoJYbRkyAW8voDFXYuZ13MuKIS6_ELrwkNHBGR03E0FGjSJF5VPXuxDFqdLm-Sl-y3wLjxCHMfZYLhEdemSQ3pcRsZFJygCe5tgoEhGkMuV-280k2QTHqYbIBpmrN1s6rFU-X3nrWjhiJ"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e18] via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-1 left-2 right-2 flex justify-between items-end">
                  <span className="font-data-mono-sm text-[10px] text-on-surface">SILK BOARD / ORR</span>
                  <span className="font-data-mono-sm text-[10px] text-secondary font-bold">SLOW 12KM/H</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Global Actions and Simulation Bar */}
      <div className="mt-4 w-full bg-[#171b26] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xl border border-[#262a35]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#262a35] flex items-center justify-center text-primary border border-[#3d494c]">
            <span className="material-symbols-outlined text-[24px]">hub</span>
          </div>
          <div>
            <h4 className="font-headline-sm text-body-lg text-on-surface font-semibold">
              Bengaluru Citywide Graph Synthesis Active
            </h4>
            <p className="font-body-sm text-[12px] text-on-surface-variant">
              38 interconnected municipal edge nodes evaluated across 4 cascade degrees.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-lg bg-[#262a35] hover:bg-[#353944] text-on-surface font-data-mono-sm text-data-mono-sm flex items-center gap-2 transition-all border border-[#3d494c]"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            Export Causal Topology (JSON)
          </button>
          <button
            onClick={handleSimulateAlternative}
            className="px-3.5 py-2 rounded-lg bg-[#262a35] hover:bg-[#353944] text-on-surface font-data-mono-sm text-data-mono-sm flex items-center gap-2 transition-all border border-[#3d494c]"
          >
            <span className="material-symbols-outlined text-[16px]">alt_route</span>
            Simulate Alternative Cutoff Points
          </button>
          <button
            onClick={() => onNavigateTab('ai-response-planner')}
            className="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-data-mono-sm text-data-mono-sm font-bold flex items-center gap-2 transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            Launch AI Response Planner
          </button>
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
