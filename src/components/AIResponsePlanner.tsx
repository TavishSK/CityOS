import React, { useState, useEffect, useMemo } from 'react';
import {
  ScenarioTemplate,
  ScenarioResponsePlanData,
  ScenarioResponseDirective,
  ScenarioResourceConflict,
  PRESET_SCENARIOS,
  getScenarioResponsePlan,
  getScenarioAssets,
  getStoredActiveSimulation,
  storeActiveSimulation
} from '../services/simulationData';

interface AIResponsePlannerProps {
  onNavigateTab: (tab: any) => void;
  activeScenario?: ScenarioTemplate;
  onSelectScenario?: (sc: ScenarioTemplate) => void;
}

export const AIResponsePlanner: React.FC<AIResponsePlannerProps> = ({
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

  // Dynamically compute the customized Coordinated Action Plan
  const planData: ScenarioResponsePlanData = useMemo(() => {
    return getScenarioResponsePlan(currentScenario);
  }, [currentScenario]);

  const [countdownSeconds, setCountdownSeconds] = useState(240);
  const [arbitrationApplied, setArbitrationApplied] = useState(false);
  const [actionApprovals, setActionApprovals] = useState<{ [key: number]: boolean }>({
    1: true,
    2: false,
    3: false,
    4: true
  });
  const [authPin, setAuthPin] = useState('');
  const [masterPlanDispatched, setMasterPlanDispatched] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reset states whenever scenario changes
  useEffect(() => {
    setArbitrationApplied(false);
    setActionApprovals({
      1: true,
      2: false,
      3: false,
      4: true
    });
    setMasterPlanDispatched(false);
  }, [currentScenario.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSelectPresetScenario = (scenarioId: string) => {
    const preset = PRESET_SCENARIOS[scenarioId];
    if (preset) {
      setCurrentScenario(preset);
      storeActiveSimulation(preset);
      if (onSelectScenario) {
        onSelectScenario(preset);
      }
      setToastMessage(`Switched response plan to: "${preset.name}"`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleApplyArbitration = () => {
    setArbitrationApplied(true);
    setToastMessage(`Arbitration Applied: ${planData.resourceConflict.aiArbitrationProposal}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAuthorizeStep = (stepNumber: number) => {
    setActionApprovals((prev) => ({ ...prev, [stepNumber]: true }));
    setToastMessage(`Directive #0${stepNumber} authorized and verified by Director sign-off.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBiometric = () => {
    setAuthPin('84920412');
    setToastMessage('Biometric clearance valid: Director security token verified.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMasterDispatch = () => {
    setActionApprovals({ 1: true, 2: true, 3: true, 4: true });
    setMasterPlanDispatched(true);
    setToastMessage(`SUCCESS: Coordinated Master Action Plan [${planData.planId}] fully dispatched across all municipal agencies!`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const assignedAssets = getScenarioAssets(currentScenario);

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Command Telemetry Ticker & Scenario Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 mb-4 border-b border-[#262a35]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#262a35] px-3 py-1 rounded-lg border border-[#3d494c]">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span className="font-mono text-xs font-bold tracking-widest text-primary uppercase">
              PLANNING ENGINE
            </span>
            <span className="font-mono text-xs text-outline-variant">|</span>
            <span className="font-mono text-xs text-white">
              SYNTH_ID: {planData.planId}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-error/10 px-3 py-1 rounded-lg border border-error/30">
            <span className="material-symbols-outlined text-error text-[16px]">verified_user</span>
            <span className="font-mono text-xs text-error font-bold uppercase">
              {masterPlanDispatched ? 'FULLY DISPATCHED TO MESH' : 'PENDING HUMAN AUTHORIZATION (DIRECTOR SIGN-OFF)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-outline">NEXT EVAL CYCLE:</span>
          <span className="font-mono text-sm text-tertiary tabular-nums font-bold">
            {formatCountdown(countdownSeconds)}
          </span>
        </div>
      </div>

      {/* Executive Plan Master Header */}
      <div className="relative overflow-hidden bg-[#171b26] rounded-2xl p-5 mb-5 shadow-xl border border-[#262a35]">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
        <div className="absolute right-40 bottom-0 w-64 h-32 rounded-full bg-tertiary/5 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-mono text-xs bg-[#1c1f2a] px-2.5 py-0.5 rounded text-outline uppercase border border-[#262a35]">
                {planData.protocolClass}
              </span>
              <span className="font-mono text-xs bg-tertiary/10 text-tertiary px-2.5 py-0.5 rounded uppercase border border-tertiary/30 font-semibold">
                AI CONFIDENCE: {planData.aiConfidence}
              </span>
              <span className="font-mono text-xs bg-error/15 text-error px-2.5 py-0.5 rounded uppercase border border-error/30 font-semibold">
                {planData.severityLevel}
              </span>
              <span className="font-mono text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded border border-primary/30 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">sync</span>
                Derived from What-If Simulation
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1.5">
              {planData.title}
            </h1>

            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {planData.summary}
            </p>
          </div>

          {/* Projected Impact Delta Cards */}
          <div className="grid grid-cols-3 gap-2.5 xl:min-w-[460px]">
            <div className="bg-[#1c1f2a] p-3 rounded-xl flex flex-col justify-between border border-[#262a35]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-outline uppercase">CASCADE RISK</span>
                <span className="material-symbols-outlined text-tertiary text-[18px]">bolt</span>
              </div>
              <div className="my-1">
                <span className="text-xl sm:text-2xl font-bold text-tertiary font-mono tracking-tight">
                  {planData.projectedDeltas.cascadeReduction}
                </span>
              </div>
              <span className="font-mono text-[10px] text-on-surface-variant uppercase truncate">
                {planData.projectedDeltas.cascadeReductionLabel}
              </span>
            </div>

            <div className="bg-[#1c1f2a] p-3 rounded-xl flex flex-col justify-between border border-[#262a35]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-outline uppercase">TIME SAVED</span>
                <span className="material-symbols-outlined text-primary text-[18px]">timer</span>
              </div>
              <div className="my-1">
                <span className="text-xl sm:text-2xl font-bold text-primary font-mono tracking-tight">
                  {planData.projectedDeltas.timeSaved.split(' ')[0]} {planData.projectedDeltas.timeSaved.split(' ')[1] || 'Min'}
                </span>
              </div>
              <span className="font-mono text-[10px] text-on-surface-variant uppercase truncate">
                Faster Recovery
              </span>
            </div>

            <div className="bg-[#1c1f2a] p-3 rounded-xl flex flex-col justify-between border border-[#262a35]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-outline uppercase">DAMAGE SAVED</span>
                <span className="material-symbols-outlined text-emerald-400 text-[18px]">savings</span>
              </div>
              <div className="my-1">
                <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono tracking-tight">
                  {planData.projectedDeltas.economicSaved.split(' ')[0]}
                </span>
              </div>
              <span className="font-mono text-[10px] text-on-surface-variant uppercase truncate">
                Losses Avoided
              </span>
            </div>
          </div>
        </div>

        {/* Quick Toolbar with Cross-Navigation */}
        <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#262a35] text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-outline uppercase font-semibold">Incident Context:</span>
            <select
              value={currentScenario.id}
              onChange={(e) => handleSelectPresetScenario(e.target.value)}
              className="bg-[#262a35] text-primary px-3 py-1.5 rounded-lg focus:outline-none cursor-pointer border border-[#3d494c] font-semibold"
            >
              {Object.values(PRESET_SCENARIOS).map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name.split(':')[0]}: {preset.headline.slice(0, 36)}...
                </option>
              ))}
              {!PRESET_SCENARIOS[currentScenario.id] && (
                <option value={currentScenario.id}>
                  [CUSTOM]: {currentScenario.name.slice(0, 40)}...
                </option>
              )}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onNavigateTab('what-if-simulation-lab')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262a35] hover:bg-[#353944] text-white transition-all border border-[#3d494c]"
              title="Test levers or simulate a different crisis"
            >
              <span className="material-symbols-outlined text-[15px] text-primary">science</span>
              <span>Test in What-If Lab →</span>
            </button>
            <button
              onClick={() => onNavigateTab('citywide-impact-chain')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262a35] hover:bg-[#353944] text-white transition-all border border-[#3d494c]"
              title="View multi-stage causal topology"
            >
              <span className="material-symbols-outlined text-[15px] text-secondary">account_tree</span>
              <span>View Impact Chain →</span>
            </button>
            <button
              onClick={() => onNavigateTab('resource-command')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262a35] hover:bg-[#353944] text-white transition-all border border-[#3d494c]"
              title="Inspect dispatched municipal fleet units"
            >
              <span className="material-symbols-outlined text-[15px] text-tertiary">local_shipping</span>
              <span>View Fleet ({assignedAssets.length} Units) →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Resource Contention & AI Arbitration Bar */}
      <div className="bg-[#262a35] rounded-2xl p-4 mb-5 shadow-lg border border-[#3d494c]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-error/20 text-error rounded-xl flex-shrink-0 mt-0.5 border border-error/30">
              <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs bg-error/20 text-error px-2 py-0.5 rounded font-bold uppercase border border-error/30">
                  RESOURCE CONTENTION DETECTED
                </span>
                <span className="font-mono text-xs text-outline">
                  RESOURCE: {planData.resourceConflict.resourceName}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white mt-1 leading-relaxed">
                <strong className="text-primary font-semibold">{planData.resourceConflict.agencyA}:</strong> {planData.resourceConflict.needA}{' '}
                <span className="text-outline">concurrently challenged by</span>{' '}
                <strong className="text-secondary font-semibold">{planData.resourceConflict.agencyB}:</strong> {planData.resourceConflict.needB}
              </p>
              <div className="mt-1.5 flex items-start sm:items-center gap-1.5 text-tertiary text-xs font-mono">
                <span className="material-symbols-outlined text-[16px] flex-shrink-0 mt-0.5 sm:mt-0">smart_toy</span>
                <span>
                  <strong>AI Arbitration Proposal:</strong> {planData.resourceConflict.aiArbitrationProposal} ({planData.resourceConflict.arbitrationFeasibility})
                </span>
              </div>
              <div className="mt-1 text-[11px] text-on-surface-variant font-mono">
                <strong>Decision Rationale:</strong> {planData.resourceConflict.rationale}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 self-end lg:self-center">
            <button
              onClick={handleApplyArbitration}
              className={`font-mono text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-bold transition-all shadow-md cursor-pointer ${
                arbitrationApplied
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500'
                  : 'bg-primary hover:brightness-110 text-on-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {arbitrationApplied ? 'done_all' : 'check_circle'}
              </span>
              <span>{arbitrationApplied ? 'ARBITRATION COMMITTED' : 'APPLY ARBITRATION'}</span>
            </button>
            <button
              onClick={() => {
                setToastMessage('Manual dispatch override mode opened for incident commander.');
                setTimeout(() => setToastMessage(null), 3000);
              }}
              className="bg-[#1c1f2a] text-on-surface-variant hover:text-white font-mono text-xs px-3 py-2 rounded-xl border border-[#262a35] transition-colors cursor-pointer"
            >
              OVERRIDE MANUAL
            </button>
          </div>
        </div>
      </div>

      {/* Main 12-Column Grid Layout: Action Matrix (Col 8) + Synthesis & Audit Rail (Col 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        {/* LEFT PANE: Coordinated Priority Action Matrix (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="flex items-center justify-between bg-[#171b26] px-4 py-2.5 rounded-xl border border-[#262a35]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">account_tree</span>
              <span className="font-bold text-white text-sm">Coordinated Action Sequence</span>
              <span className="font-mono text-xs text-outline bg-[#1c1f2a] px-2 py-0.5 rounded border border-[#262a35]">
                {planData.directives.length} DIRECTIVES
              </span>
            </div>
            <span className="text-xs font-mono text-outline">
              Synchronized Execution Window: {planData.targetResolutionWindow}
            </span>
          </div>

          {/* Action Cards (Directives 1 through 4) */}
          {planData.directives.map((dir) => {
            const isApproved = actionApprovals[dir.stepNumber] ?? dir.approved;
            return (
              <div
                key={dir.stepNumber}
                className="bg-[#1c1f2a] rounded-2xl p-4 transition-all shadow-md hover:bg-[#262a35]/90 border border-[#262a35]"
              >
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-lg text-primary font-bold">
                      0{dir.stepNumber}
                    </span>
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${dir.priorityColor}`}>
                      PRIORITY: {dir.priority}
                    </span>
                    <span className="font-mono text-xs text-outline-variant">•</span>
                    <span className="font-mono text-xs text-primary font-semibold uppercase">
                      {dir.agencies}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-1 px-2.5 py-0.5 rounded font-mono text-xs ${
                        isApproved
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#262a35] text-outline border border-[#3d494c]'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isApproved ? 'bg-emerald-400' : 'bg-outline animate-pulse'}`}></span>
                      <span>
                        {isApproved ? 'APPROVED [DIRECTOR SIGN-OFF]' : 'PENDING SIGN-OFF'}
                      </span>
                    </div>

                    {!isApproved && (
                      <button
                        onClick={() => handleAuthorizeStep(dir.stepNumber)}
                        className="px-2.5 py-1 rounded-lg bg-primary hover:brightness-110 text-on-primary text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
                      >
                        AUTHORIZE
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                  {dir.title}
                </h3>

                <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
                  {dir.explanation}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#0a0e18] p-2.5 rounded-xl mb-2 font-mono text-xs border border-[#262a35]">
                  <div>
                    <span className="text-outline block text-[10px] uppercase font-semibold">LEAD OFFICIAL:</span>
                    <span className="text-white truncate block">{dir.leadOfficial}</span>
                  </div>
                  <div>
                    <span className="text-outline block text-[10px] uppercase font-semibold">RESOURCES COMMITTED:</span>
                    <span className="text-white truncate block">{dir.resourcesCommitted}</span>
                  </div>
                  <div>
                    <span className="text-outline block text-[10px] uppercase font-semibold">EXECUTION WINDOW:</span>
                    <span className="text-tertiary block font-semibold">{dir.executionWindow}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-tertiary font-mono text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                    <span>{dir.telemetryHook}</span>
                  </div>
                  <button
                    onClick={() => onNavigateTab('resource-command')}
                    className="text-on-surface-variant hover:text-primary font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    INSPECT DISPATCHED SQUAD <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT PANE: Synthesis Engine & Officer Authorization Rail (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Executive Synthesis Summary Card */}
          <div className="bg-[#171b26] rounded-2xl p-4 border border-[#262a35] shadow-xl">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#262a35]">
              <span className="font-bold text-white text-sm font-mono flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
                Plan Synthesis Engine
              </span>
              <span className="font-mono text-[11px] text-tertiary bg-tertiary/10 px-2 py-0.5 rounded border border-tertiary/30">
                ACTIVE COUPLING
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center py-1 border-b border-[#262a35]">
                <span className="text-outline">Cross-Silo Feasibility:</span>
                <span className="text-emerald-400 font-bold">97.8% Optimum</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#262a35]">
                <span className="text-outline">Target Clear Time:</span>
                <span className="text-primary font-bold">{currentScenario.comparison.timeToClearNew}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#262a35]">
                <span className="text-outline">Uncoordinated Baseline:</span>
                <span className="text-error font-bold">{currentScenario.comparison.timeToClearOld}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#262a35]">
                <span className="text-outline">Secondary Losses Prevented:</span>
                <span className="text-emerald-400 font-bold">{currentScenario.budget.disruptionLossPrevented}</span>
              </div>
            </div>

            {/* Direct Officer Authorization Controls */}
            <div className="mt-4 pt-3 border-t border-[#262a35]">
              <span className="text-[10px] font-mono text-outline uppercase block mb-1.5 font-semibold">
                Officer Clearance Token Verification:
              </span>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={authPin}
                  onChange={(e) => setAuthPin(e.target.value)}
                  placeholder="Officer PIN / Token (e.g. 84920412)"
                  className="bg-[#0a0e18] font-mono text-xs text-white px-3 py-2 rounded-xl border border-[#3d494c] w-full focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleBiometric}
                  className="px-3 py-2 bg-[#262a35] hover:bg-[#353944] text-tertiary rounded-xl font-mono text-xs border border-[#3d494c] flex-shrink-0 cursor-pointer"
                  title="Simulate biometric authentication"
                >
                  TOKEN
                </button>
              </div>

              <button
                onClick={handleMasterDispatch}
                disabled={masterPlanDispatched}
                className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                  masterPlanDispatched
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {masterPlanDispatched ? 'done_all' : 'send'}
                </span>
                <span>
                  {masterPlanDispatched
                    ? 'COORDINATED PLAN FULLY DISPATCHED'
                    : 'AUTHORIZE ALL & DISPATCH MASTER PLAN'}
                </span>
              </button>
            </div>
          </div>

          {/* Chronological Unified Audit Rail */}
          <div className="bg-[#171b26] rounded-2xl p-4 border border-[#262a35] shadow-xl">
            <span className="font-bold text-white text-xs font-mono uppercase block mb-3 text-outline">
              Incident Action Audit Stream:
            </span>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                <div>
                  <span className="text-white block font-semibold">T-00: Telemetry Trigger Logged</span>
                  <span className="text-[10px] text-on-surface-variant">Ground zero incident registered at {currentScenario.locationName.split(' &')[0]}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
                <div>
                  <span className="text-white block font-semibold">T+02m: Neural Causal Graph Computed</span>
                  <span className="text-[10px] text-on-surface-variant">Identified 4 multi-silo stress points and 2 circuit breaker cutoffs</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary mt-1.5 flex-shrink-0"></span>
                <div>
                  <span className="text-white block font-semibold">T+05m: Cross-Agency Arbitration Prepared</span>
                  <span className="text-[10px] text-on-surface-variant">{planData.resourceConflict.resourceName} allocated via AI balance</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0"></span>
                <div>
                  <span className="text-white block font-semibold">T+08m: Fleet Routing Active</span>
                  <span className="text-[10px] text-on-surface-variant">{assignedAssets.length} specialized municipal units committed on scene</span>
                </div>
              </div>
            </div>
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
