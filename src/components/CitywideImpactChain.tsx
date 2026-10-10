import React, { useState, useEffect, useMemo } from 'react';
import {
  ScenarioTemplate,
  ScenarioImpactChainData,
  ScenarioImpactNode,
  PRESET_SCENARIOS,
  getScenarioImpactChain,
  getStoredActiveSimulation,
  storeActiveSimulation
} from '../services/simulationData';

interface CitywideImpactChainProps {
  onNavigateTab: (tab: any) => void;
  activeScenario?: ScenarioTemplate;
  onSelectScenario?: (sc: ScenarioTemplate) => void;
}

export const CitywideImpactChain: React.FC<CitywideImpactChainProps> = ({
  onNavigateTab,
  activeScenario: propActiveScenario,
  onSelectScenario
}) => {
  // Sync scenario with props, localStorage, and window events
  const [currentScenario, setCurrentScenario] = useState<ScenarioTemplate>(() => {
    return propActiveScenario || getStoredActiveSimulation();
  });

  useEffect(() => {
    if (propActiveScenario) {
      setCurrentScenario(propActiveScenario);
    }
  }, [propActiveScenario]);

  useEffect(() => {
    const handleSimChange = (e: any) => {
      if (e.detail) {
        setCurrentScenario(e.detail);
      }
    };
    window.addEventListener('blr_cityos_simulation_changed', handleSimChange);
    return () => window.removeEventListener('blr_cityos_simulation_changed', handleSimChange);
  }, []);

  // Compute dynamic causal impact topology for the active scenario
  const chainData: ScenarioImpactChainData = useMemo(() => {
    return getScenarioImpactChain(currentScenario);
  }, [currentScenario]);

  // Selected node for detailed inspector panel
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-nexus');

  // Reset selected node whenever scenario changes
  useEffect(() => {
    setSelectedNodeId('node-nexus');
  }, [currentScenario.id]);

  // Interactive circuit breaker severing states
  const [showSeverLines, setShowSeverLines] = useState(true);
  const [severADeployed, setSeverADeployed] = useState(false);
  const [severBDeployed, setSeverBDeployed] = useState(false);
  const [isSimulatingAlternative, setIsSimulatingAlternative] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active inspected node data
  const activeNode: ScenarioImpactNode =
    chainData.nodes[selectedNodeId] || chainData.nodes['node-nexus'] || Object.values(chainData.nodes)[0];

  const handleSelectPresetScenario = (scenarioId: string) => {
    const preset = PRESET_SCENARIOS[scenarioId];
    if (preset) {
      setCurrentScenario(preset);
      storeActiveSimulation(preset);
      if (onSelectScenario) {
        onSelectScenario(preset);
      }
      setSeverADeployed(false);
      setSeverBDeployed(false);
      setToastMessage(`Switched impact model to: "${preset.name}"`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleToggleSeverA = () => {
    const next = !severADeployed;
    setSeverADeployed(next);
    const intervention = chainData.severInterventions[0];
    if (next) {
      setToastMessage(`CIRCUIT SEVERED: Deployed ${intervention?.name || 'Intervention A'}. Downstream cascade arrested!`);
    } else {
      setToastMessage(`Circuit restored to live cascade evaluation.`);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleSeverB = () => {
    const next = !severBDeployed;
    setSeverBDeployed(next);
    const intervention = chainData.severInterventions[1];
    if (next) {
      setToastMessage(`GREEN CORRIDOR SEVERED: Deployed ${intervention?.name || 'Intervention B'}. Life-support route isolated!`);
    } else {
      setToastMessage(`Circuit restored to baseline.`);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSimulateAlternative = () => {
    setIsSimulatingAlternative(true);
    setTimeout(() => {
      setIsSimulatingAlternative(false);
      setToastMessage(`Alternative Cutoff Simulation: Secondary bypass yields 93.4% stabilization for ${currentScenario.locationName.split(' &')[0]}!`);
      setTimeout(() => setToastMessage(null), 3500);
    }, 1100);
  };

  const handleExportJSON = () => {
    const exportPayload = {
      scenario: currentScenario.name,
      location: currentScenario.locationName,
      chainData,
      severStatus: { severA: severADeployed, severB: severBDeployed },
      exportedAt: new Date().toISOString()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `Bengaluru_Impact_Chain_${currentScenario.id}.json`);
    dlAnchorElem.click();
    setToastMessage('Causal graph topology exported as JSON!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Stage nodes groupings for the visual canvas
  const stage1Node = chainData.nodes['node-nexus'];
  const stage2Nodes = [
    chainData.nodes['node-sec-power'],
    chainData.nodes['node-sec-transit'],
    chainData.nodes['node-sec-health']
  ].filter(Boolean);
  const stage3Nodes = [
    chainData.nodes['node-mult-commute'],
    chainData.nodes['node-mult-health-power'],
    chainData.nodes['node-mult-water']
  ].filter(Boolean);
  const stage4Node = chainData.nodes['node-bottleneck'];

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Telemetry & Scenario Context Banner */}
      <div className="relative w-full bg-[#171b26] rounded-2xl p-5 mb-5 shadow-xl border border-[#262a35] overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gradient-to-br from-primary/10 via-error/5 to-transparent blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-tertiary/5 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4">
          <div className="flex flex-col gap-1 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error/15 text-error font-mono text-xs border border-error/30 font-bold">
                <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                ACTIVE CAUSAL TOPOLOGY
              </span>
              <span className="px-2 py-0.5 rounded bg-[#262a35] text-primary font-mono text-xs border border-[#3d494c]">
                GRAPH_ID: {chainData.graphId}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/30 font-mono text-xs font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">sync</span>
                Derived from What-If Simulation
              </span>
            </div>

            <div className="flex items-start sm:items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#262a35] flex items-center justify-center flex-shrink-0 text-primary border border-[#3d494c] shadow-inner">
                <span className="material-symbols-outlined text-[28px]">account_tree</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 flex-wrap">
                  <span>Citywide Impact Chain: {currentScenario.name.split(' (')[0]}</span>
                </h1>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 max-w-2xl leading-relaxed">
                  {chainData.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Incident Meta Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0a0e18]/80 backdrop-blur-md p-3.5 rounded-xl border border-[#262a35]">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono tracking-wider text-outline">Root Stressor</span>
              <span className="text-sm sm:text-base font-bold text-error mt-0.5 truncate">{chainData.rootStressor}</span>
              <span className="text-[10px] font-mono text-on-surface-variant truncate">{chainData.rootStressorDetail}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono tracking-wider text-outline">Silos Impacted</span>
              <span className="text-sm sm:text-base font-bold text-primary mt-0.5">{chainData.silosImpacted}</span>
              <span className="text-[10px] font-mono text-tertiary">BBMP • BTP • BESCOM • 108</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono tracking-wider text-outline">Cascade Velocity</span>
              <span className="text-sm sm:text-base font-bold text-amber-400 mt-0.5">{chainData.cascadeVelocity}</span>
              <span className="text-[10px] font-mono text-amber-400/80">Propagation Rate</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono tracking-wider text-outline">Risk Radius</span>
              <span className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5 truncate">{chainData.citizensAtRisk}</span>
              <span className="text-[10px] font-mono text-on-surface-variant truncate">{chainData.riskRadius}</span>
            </div>
          </div>
        </div>

        {/* Graph Global Control Toolbar */}
        <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 bg-[#1c1f2a]/70 rounded-xl px-3.5 py-2.5 border border-[#262a35]">
          <div className="flex flex-wrap items-center gap-3">
            {/* Simulation Context Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-outline uppercase font-semibold">Nexus Incident:</span>
              <select
                value={currentScenario.id}
                onChange={(e) => handleSelectPresetScenario(e.target.value)}
                className="bg-[#262a35] font-mono text-xs text-primary px-3 py-1.5 rounded-lg focus:outline-none cursor-pointer border border-[#3d494c] font-semibold"
              >
                {Object.values(PRESET_SCENARIOS).map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name.split(':')[0]}: {preset.headline.slice(0, 35)}...
                  </option>
                ))}
                {!PRESET_SCENARIOS[currentScenario.id] && (
                  <option value={currentScenario.id}>
                    [CUSTOM WHAT-IF]: {currentScenario.name.slice(0, 40)}...
                  </option>
                )}
              </select>
            </div>

            {/* Mitigation Sever Lines Switch */}
            <label className="flex items-center gap-2 cursor-pointer select-none bg-[#262a35]/80 px-3 py-1.5 rounded-lg hover:bg-[#262a35] transition-colors border border-[#3d494c]">
              <input
                type="checkbox"
                checked={showSeverLines}
                onChange={(e) => setShowSeverLines(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-8 h-4 rounded-full relative transition-colors ${showSeverLines ? 'bg-primary' : 'bg-[#313540]'}`}>
                <div
                  className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${showSeverLines ? 'right-0.5' : 'left-0.5'}`}
                ></div>
              </div>
              <span className="text-xs font-mono text-primary font-bold ml-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                Show AI Sever Points
              </span>
            </label>

            {/* Cross-Silo Legend */}
            <div className="hidden xl:flex items-center gap-2 text-xs font-mono">
              <span className="text-outline mr-1">Portfolios:</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#262a35] text-primary border border-[#3d494c]">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Power (BESCOM)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#262a35] text-error border border-[#3d494c]">
                <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Health (108)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#262a35] text-secondary border border-[#3d494c]">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Transit (BTP)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#262a35] text-tertiary border border-[#3d494c]">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Water (BWSSB)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <button
              onClick={() => onNavigateTab('what-if-simulation-lab')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262a35] hover:bg-[#353944] text-white text-xs font-mono transition-all border border-[#3d494c]"
              title="Test sliders or enter another prompt in What-If Lab"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">science</span>
              <span>Test in What-If Lab →</span>
            </button>
            <button
              onClick={handleSimulateAlternative}
              disabled={isSimulatingAlternative}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262a35] hover:bg-[#353944] text-white text-xs font-mono transition-all border border-[#3d494c]"
            >
              <span className={`material-symbols-outlined text-[16px] text-tertiary ${isSimulatingAlternative ? 'animate-spin' : ''}`}>
                {isSimulatingAlternative ? 'refresh' : 'calculate'}
              </span>
              <span>{isSimulatingAlternative ? 'Re-routing...' : 'Simulate Cutoffs'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('ai-response-planner')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:brightness-110 text-on-primary text-xs font-mono font-bold transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              <span>Deploy Response Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Split Layout: 8-Cols Interactive Graph Canvas + 4-Cols Detailed Node Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* 8 COLUMNS: DYNAMIC 4-STAGE CAUSAL TOPOLOGY CANVAS */}
        <div className="xl:col-span-8 flex flex-col gap-3">
          {/* Stage Progression Breadcrumb Bar */}
          <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs uppercase tracking-wider font-semibold">
            <div className="py-1.5 rounded-lg bg-[#1c1f2a] text-error flex items-center justify-center gap-1 border border-error/30">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span> Stage 01: Shock Nexus
            </div>
            <div className="py-1.5 rounded-lg bg-[#1c1f2a] text-primary flex items-center justify-center gap-1 border border-primary/30">
              <span className="w-2 h-2 rounded-full bg-primary"></span> Stage 02: Sector Stress
            </div>
            <div className="py-1.5 rounded-lg bg-[#1c1f2a] text-secondary flex items-center justify-center gap-1 border border-secondary/30">
              <span className="w-2 h-2 rounded-full bg-secondary"></span> Stage 03: Multipliers
            </div>
            <div className="py-1.5 rounded-lg bg-[#262a35] text-amber-400 flex items-center justify-center gap-1 shadow-sm border border-amber-500/40">
              <span className="material-symbols-outlined text-[14px]">warning</span> Stage 04: Bottleneck
            </div>
          </div>

          {/* Interactive Causal Visual Canvas Container */}
          <div className="relative w-full min-h-[720px] bg-[#0a0e18] rounded-2xl p-4 overflow-hidden shadow-2xl border border-[#262a35]">
            <div className="absolute inset-0 bg-[radial-gradient(#1c1f2a_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"></div>

            {/* SVG Dynamic Connectors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="streamPrimary" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.8"></stop>
                  <stop offset="50%" stopColor="#4cd7f6" stopOpacity="0.9"></stop>
                  <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.6"></stop>
                </linearGradient>
                <linearGradient id="streamSecondary" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.8"></stop>
                  <stop offset="100%" stopColor="#d0bcff" stopOpacity="0.8"></stop>
                </linearGradient>
                <linearGradient id="streamSever" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#4edea3" stopOpacity="0.9"></stop>
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9"></stop>
                </linearGradient>
              </defs>

              {/* Stage 1 to Stage 2 Branches */}
              <path d="M 180 360 C 240 360, 250 160, 310 160" fill="none" stroke="url(#streamPrimary)" strokeDasharray={severADeployed ? "4,4" : "none"} strokeWidth="2.5" opacity={severADeployed ? "0.3" : "0.9"}></path>
              <path d="M 180 360 C 240 360, 250 360, 310 360" fill="none" stroke="url(#streamSecondary)" strokeWidth="2.5"></path>
              <path d="M 180 360 C 240 360, 250 560, 310 560" fill="none" stroke="#ffb4ab" strokeDasharray={severBDeployed ? "4,4" : "none"} strokeWidth="2.5" opacity={severBDeployed ? "0.3" : "0.9"}></path>

              {/* Stage 2 to Stage 3 Branches */}
              <path d="M 480 160 C 530 160, 545 130, 580 130" fill="none" stroke="#4cd7f6" strokeWidth="2.5" opacity={severADeployed ? "0.2" : "0.85"}></path>
              <path d="M 480 360 C 530 360, 545 340, 580 340" fill="none" stroke="#d0bcff" strokeWidth="2.5"></path>
              <path d="M 480 560 C 530 560, 545 540, 580 540" fill="none" stroke="#ffb4ab" strokeWidth="2.5" opacity={severBDeployed ? "0.2" : "0.85"}></path>

              {/* Stage 3 to Stage 4 Bottleneck Convergence */}
              <path d="M 750 130 C 800 130, 810 330, 850 350" fill="none" stroke="#ffb4ab" strokeDasharray="5,3" strokeWidth="3" opacity={severADeployed ? "0.2" : "0.9"}></path>
              <path d="M 750 340 C 800 340, 810 360, 850 360" fill="none" stroke="#ffb4ab" strokeWidth="3"></path>
              <path d="M 750 540 C 800 540, 810 390, 850 370" fill="none" stroke="#ffb4ab" strokeDasharray="5,3" strokeWidth="3" opacity={severBDeployed ? "0.2" : "0.9"}></path>

              {/* Visual Sever Circuit Interrupters */}
              {showSeverLines && (
                <g className="transition-opacity duration-300 opacity-100">
                  {/* Sever Point A */}
                  <line stroke={severADeployed ? "#4edea3" : "#4cd7f6"} strokeDasharray="3,3" strokeWidth="2.5" x1="530" x2="530" y1="80" y2="240"></line>
                  <circle cx="530" cy="160" fill={severADeployed ? "#059669" : "#0891b2"} fillOpacity="0.4" r="15" stroke={severADeployed ? "#4edea3" : "#4cd7f6"} strokeWidth="2"></circle>
                  <text fill={severADeployed ? "#4edea3" : "#4cd7f6"} fontFamily="JetBrains Mono" fontSize="8" fontWeight="bold" textAnchor="middle" x="530" y="163">
                    {severADeployed ? "SEVERED" : "SEVER A"}
                  </text>

                  {/* Sever Point B */}
                  <line stroke={severBDeployed ? "#4edea3" : "#f59e0b"} strokeDasharray="3,3" strokeWidth="2.5" x1="535" x2="535" y1="480" y2="640"></line>
                  <circle cx="535" cy="560" fill={severBDeployed ? "#059669" : "#d97706"} fillOpacity="0.4" r="15" stroke={severBDeployed ? "#4edea3" : "#f59e0b"} strokeWidth="2"></circle>
                  <text fill={severBDeployed ? "#4edea3" : "#f59e0b"} fontFamily="JetBrains Mono" fontSize="8" fontWeight="bold" textAnchor="middle" x="535" y="563">
                    {severBDeployed ? "SEVERED" : "SEVER B"}
                  </text>
                </g>
              )}
            </svg>

            {/* Column Grid Structure for HTML Nodes */}
            <div className="relative z-10 grid grid-cols-4 gap-3 h-full py-2 min-h-[660px]">
              {/* STAGE 1: SHOCK NEXUS */}
              <div className="flex flex-col justify-center items-center">
                {stage1Node && (
                  <div
                    onClick={() => setSelectedNodeId(stage1Node.id)}
                    className={`w-full max-w-[210px] bg-[#1c1f2a] p-3 rounded-xl cursor-pointer hover:scale-105 transition-all shadow-lg border relative ${
                      selectedNodeId === stage1Node.id ? 'border-primary ring-2 ring-primary' : 'border-error/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-error bg-error/10 px-2 py-0.5 rounded uppercase">
                        GROUND ZERO
                      </span>
                      <span className="text-[10px] font-mono text-on-surface-variant">T0 SHOCK</span>
                    </div>
                    <h4 className="text-xs sm:text-sm text-white font-bold leading-tight">
                      {stage1Node.title}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant mt-1 line-clamp-2">
                      {stage1Node.desc}
                    </p>
                    <div className="mt-2.5 pt-2 bg-[#0a0e18] px-2 py-1.5 rounded flex items-center justify-between border border-[#262a35]">
                      <span className="text-[10px] font-mono text-outline">{stage1Node.metricLabel}</span>
                      <span className="text-xs font-mono text-error font-bold">{stage1Node.metric}</span>
                    </div>
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-error ring-4 ring-[#1c1f2a] animate-pulse"></div>
                  </div>
                )}
              </div>

              {/* STAGE 2: TIER-1 DIRECT SECTOR STRESS */}
              <div className="flex flex-col justify-around gap-y-4">
                {stage2Nodes.map((node) => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-full bg-[#1c1f2a] p-2.5 rounded-xl cursor-pointer hover:scale-[1.03] transition-all shadow-md border relative ${
                      selectedNodeId === node.id ? 'border-primary ring-2 ring-primary' : 'border-[#262a35]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${node.badgeBg} ${node.colorClass}`}>
                        {node.sector.split(' /')[0]}
                      </span>
                      <span className="text-[10px] font-mono text-on-surface-variant font-bold">STAGE 02</span>
                    </div>
                    <h4 className="text-xs text-white font-semibold mt-1 leading-snug">
                      {node.title}
                    </h4>
                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-[#262a35] text-[10px] font-mono">
                      <span className="text-outline">{node.metricLabel}</span>
                      <span className={`${node.colorClass} font-bold`}>{node.metric}</span>
                    </div>
                    <div className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${node.colorClass.includes('error') ? 'bg-error' : node.colorClass.includes('secondary') ? 'bg-secondary' : 'bg-primary'} ring-2 ring-[#0a0e18]`}></div>
                  </div>
                ))}
              </div>

              {/* STAGE 3: CROSS-MULTIPLIERS & SYSTEMIC SPILLOVER */}
              <div className="flex flex-col justify-around gap-y-3">
                {stage3Nodes.map((node) => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-full bg-[#1c1f2a] p-2.5 rounded-xl cursor-pointer hover:scale-[1.03] transition-all shadow-md border relative ${
                      selectedNodeId === node.id ? 'border-primary ring-2 ring-primary' : 'border-[#262a35]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${node.badgeBg} ${node.colorClass}`}>
                        {node.sector.split(' /')[0]}
                      </span>
                      <span className="text-[10px] font-mono text-on-surface-variant font-bold">STAGE 03</span>
                    </div>
                    <h4 className="text-xs text-white font-semibold mt-1 leading-snug">
                      {node.title}
                    </h4>
                    <p className="text-[10px] text-on-surface-variant mt-1 line-clamp-2">
                      {node.desc}
                    </p>
                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-[#262a35] text-[10px] font-mono">
                      <span className="text-outline">{node.metricLabel}</span>
                      <span className={`${node.colorClass} font-bold`}>{node.metric}</span>
                    </div>
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-[#0a0e18]"></div>
                  </div>
                ))}
              </div>

              {/* STAGE 4: CRITICAL CROSS-SILO SYSTEMIC BOTTLENECK */}
              <div className="flex flex-col justify-center items-center">
                {stage4Node && (
                  <div
                    onClick={() => setSelectedNodeId(stage4Node.id)}
                    className={`w-full max-w-[220px] bg-[#262a35] p-3 rounded-xl cursor-pointer hover:scale-105 transition-all shadow-2xl border relative ${
                      selectedNodeId === stage4Node.id
                        ? 'border-error ring-2 ring-error'
                        : 'border-error/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-error bg-error/20 px-2 py-0.5 rounded uppercase flex items-center gap-1 border border-error/30">
                        <span className="material-symbols-outlined text-[12px]">warning</span>
                        BOTTLENECK
                      </span>
                      <span className="text-[10px] font-mono text-error font-bold">STAGE 04</span>
                    </div>
                    <h4 className="text-xs sm:text-sm text-white font-bold leading-tight">
                      {stage4Node.title}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant mt-1">
                      {stage4Node.desc}
                    </p>
                    <div className="mt-2.5 pt-2 bg-[#0a0e18] px-2 py-1.5 rounded flex items-center justify-between border border-[#3d494c]">
                      <span className="text-[10px] font-mono text-outline">Cascade Potential</span>
                      <span className="text-xs font-mono text-error font-bold">VULN {stage4Node.vuln} / 10</span>
                    </div>
                    {/* Active Sever Indicator Badge */}
                    {(severADeployed || severBDeployed) && (
                      <div className="mt-2 p-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold text-center flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">shield</span>
                        <span>CASCADE SEVERED ({severADeployed && severBDeployed ? '94%' : '65%'} ARRESTED)</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actionable Circuit Breaker Sever Controls */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">healing</span>
                <h3 className="text-sm font-bold text-white">
                  Active Circuit Breakers (AI Cascade Sever Interventions)
                </h3>
              </div>
              <span className="text-xs font-mono text-outline">
                Click to sever causal chain and arrest municipal ripple effects
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {chainData.severInterventions.map((intervention, idx) => {
                const isDeployed = idx === 0 ? severADeployed : severBDeployed;
                const toggleFn = idx === 0 ? handleToggleSeverA : handleToggleSeverB;
                return (
                  <div
                    key={intervention.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isDeployed
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-[#1c1f2a] border-[#262a35]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold ${isDeployed ? 'bg-emerald-500 text-black' : 'bg-primary/20 text-primary'}`}>
                          {idx === 0 ? 'A' : 'B'}
                        </span>
                        <span className="text-xs font-bold text-white">{intervention.name}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${isDeployed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-[#262a35] text-outline'}`}>
                        {isDeployed ? 'ACTIVE SEVER' : 'STANDBY'}
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant mb-2 leading-relaxed">
                      {intervention.action}
                    </p>

                    <div className="bg-[#0a0e18] p-2 rounded-lg text-[11px] font-mono border border-[#262a35] mb-2.5">
                      <span className="text-emerald-400 block font-semibold">Prevents: {intervention.consequencePrevented}</span>
                      <span className="text-outline text-[10px] mt-0.5 block">Efficiency: {intervention.efficiency}</span>
                    </div>

                    <button
                      onClick={toggleFn}
                      className={`w-full py-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isDeployed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-primary hover:brightness-110 text-on-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isDeployed ? 'check_circle' : 'bolt'}
                      </span>
                      <span>{isDeployed ? 'CIRCUIT SEVERED (ARRESTED)' : 'DEPLOY CIRCUIT BREAKER'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4 COLUMNS: DETAILED CAUSAL NODE INSPECTOR */}
        <div className="xl:col-span-4 flex flex-col gap-3">
          <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-4 shadow-xl">
            {/* Inspector Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">troubleshoot</span>
                <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Node Inspector
                </span>
              </div>
              <span className="text-xs font-mono text-outline px-2 py-0.5 rounded bg-[#1c1f2a] border border-[#262a35]">
                {activeNode.id}
              </span>
            </div>

            {/* Active Node Identity */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${activeNode.badgeBg} ${activeNode.colorClass}`}>
                  {activeNode.sector}
                </span>
                <span className="text-[10px] font-mono text-outline">
                  {activeNode.stageLabel}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                {activeNode.title}
              </h2>
              <div className="flex items-center gap-1 text-xs text-on-surface-variant font-mono mt-1">
                <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
                <span>{activeNode.location}</span>
              </div>
            </div>

            {/* Plain English Impact Analysis */}
            <div className="bg-[#1c1f2a] p-3 rounded-xl border border-[#262a35] mb-3">
              <span className="text-[10px] uppercase font-mono text-outline block mb-1 font-bold">
                Causal Mechanism (What is happening):
              </span>
              <p className="text-xs text-gray-200 leading-relaxed">
                {activeNode.desc}
              </p>
            </div>

            {/* Real-World Telemetry Metrics */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-[#0f131d] p-2.5 rounded-xl border border-[#262a35]">
                <span className="text-[10px] uppercase font-mono text-outline block mb-0.5">
                  {activeNode.metricLabel}:
                </span>
                <span className={`text-sm font-bold font-mono ${activeNode.colorClass}`}>
                  {activeNode.metric}
                </span>
              </div>
              <div className="bg-[#0f131d] p-2.5 rounded-xl border border-[#262a35]">
                <span className="text-[10px] uppercase font-mono text-outline block mb-0.5">
                  Vulnerability Index:
                </span>
                <span className="text-sm font-bold font-mono text-error">
                  {activeNode.vuln} / 10
                </span>
              </div>
            </div>

            {/* Downstream Ripple & Sector Linkage */}
            <div className="bg-[#1c1f2a] p-3 rounded-xl border border-[#262a35] mb-3 text-xs font-mono">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-outline uppercase text-[10px]">Cascading Spread:</span>
                <span className="text-tertiary font-bold">{activeNode.ripple}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#262a35]">
                <span className="text-outline uppercase text-[10px]">Upstream Trigger:</span>
                <span className="text-white truncate max-w-[180px]">
                  {activeNode.upstreamFrom ? chainData.nodes[activeNode.upstreamFrom]?.title || 'Ground Zero Incident' : 'Nexus Point'}
                </span>
              </div>
            </div>

            {/* Quick Cross-Tab Actions */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => onNavigateTab('ai-response-planner')}
                className="w-full py-2 px-3 rounded-xl bg-primary hover:brightness-110 text-on-primary font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                <span>Open in AI Response Planner →</span>
              </button>
              <button
                onClick={() => onNavigateTab('resource-command')}
                className="w-full py-2 px-3 rounded-xl bg-[#1c1f2a] hover:bg-[#262a35] text-white font-mono text-xs font-bold border border-[#3d494c] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-tertiary">local_shipping</span>
                <span>Inspect Assets in Resource Command →</span>
              </button>
              <button
                onClick={handleExportJSON}
                className="w-full py-2 px-3 rounded-xl bg-[#0a0e18] hover:bg-[#141824] text-on-surface-variant hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 border border-[#262a35] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Export Causal Topology JSON</span>
              </button>
            </div>
          </div>

          {/* Scenario Overview Box */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-4 shadow-xl text-xs">
            <h4 className="font-bold text-white mb-2 flex items-center gap-1.5 font-mono">
              <span className="material-symbols-outlined text-amber-400 text-[18px]">info</span>
              <span>Why This Causal Chain Matters:</span>
            </h4>
            <p className="text-on-surface-variant leading-relaxed">
              When an emergency happens at <strong>{currentScenario.locationName.split(' &')[0]}</strong>, municipal departments usually act in isolation. The City OS neural causality model demonstrates how transit delays directly impair ambulance response times and power feeder integrity. Activating circuit breakers early isolates the damage within the golden hour.
            </p>
          </div>
        </div>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 right-8 bg-[#171b26]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-primary z-50 animate-fade-in font-mono text-xs">
          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
