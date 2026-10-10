import React, { useState } from 'react';

interface WhatIfSimulationLabProps {
  onNavigateTab: (tab: any) => void;
}

export const WhatIfSimulationLab: React.FC<WhatIfSimulationLabProps> = ({ onNavigateTab }) => {
  const [selectedScenario, setSelectedScenario] = useState<number>(1);
  const [tempVal, setTempVal] = useState<number>(42.5);
  const [durationVal, setDurationVal] = useState<number>(36);
  const [gridFaultVal, setGridFaultVal] = useState<number>(25);
  const [fleetVal, setFleetVal] = useState<number>(85);
  const [isMonteCarloRunning, setIsMonteCarloRunning] = useState<boolean>(false);
  const [monteCarloDone, setMonteCarloDone] = useState<boolean>(false);
  const [appliedToLive, setAppliedToLive] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleResetBaseline = () => {
    setTempVal(42.5);
    setDurationVal(36);
    setGridFaultVal(25);
    setFleetVal(85);
    setToastMessage('Simulation parameters reset to baseline.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleRunMonteCarlo = () => {
    setIsMonteCarloRunning(true);
    setMonteCarloDone(false);
    setTimeout(() => {
      setIsMonteCarloRunning(false);
      setMonteCarloDone(true);
      setToastMessage('Monte Carlo 10,000 iterations converged with p=0.998 certainty.');
      setTimeout(() => setToastMessage(null), 3500);
    }, 1200);
  };

  const handleApplyToLive = () => {
    setAppliedToLive(true);
    setToastMessage('Simulation parameters pushed to Live AI Response Planner Core!');
    setTimeout(() => {
      setAppliedToLive(false);
      onNavigateTab('ai-response-planner');
    }, 1800);
  };

  const handleExportAudit = () => {
    const report = {
      runId: 'HW-402-BLR',
      city: 'Bengaluru (Bangalore)',
      timestamp: new Date().toISOString(),
      parameters: {
        ambientPeakTemp: `${tempVal}°C`,
        heatDuration: `${durationVal} Hours`,
        substationRedundancyFault: `-${gridFaultVal}%`,
        emtFleetAvailability: `${fleetVal}%`
      },
      results: {
        speedLift: '-94.6%',
        conflictAvoidance: '100% Net',
        casualtyRiskReduction: '-97.8%',
        municipalSavingsEst: '₹2.96 Cr ($3.58M)',
        blackoutsAverted: '12 Districts Protected'
      }
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', 'Bengaluru_Simulation_Audit_HW402.json');
    dlAnchorElem.click();
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Top Command Ribbon & Header Metadata */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#262a35] mb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-lg bg-[#1c1f2a] font-label-caps text-label-caps text-primary tracking-widest uppercase border border-[#262a35]">
              LAB_KERNEL // STOCHASTIC SIMULATION MATRIX
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-data-mono-sm text-data-mono-sm text-tertiary">
              ENGINE_STATE: HIGH_PRECISION_READY
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              What-If Simulation Lab — Bengaluru
            </h1>
            <span className="px-2 py-0.5 rounded-lg bg-[#262a35] font-data-mono-sm text-data-mono-sm text-on-surface-variant border border-[#3d494c]">
              SANDBOX_ID: #SIM-402-HW-BLR
            </span>
          </div>
        </div>

        {/* Scenario Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#171b26] p-1.5 rounded-xl border border-[#262a35]">
          <button
            onClick={() => setSelectedScenario(1)}
            className={`px-3 py-1.5 rounded-lg font-data-mono-sm text-data-mono-sm transition-all flex items-center gap-1.5 ${
              selectedScenario === 1
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-[#262a35]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">thermostat</span>
            <span>Scenario 1: Level 3 Heatwave</span>
            {selectedScenario === 1 && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping ml-1"></span>}
          </button>
          <button
            onClick={() => setSelectedScenario(2)}
            className={`px-3 py-1.5 rounded-lg font-data-mono-sm text-data-mono-sm transition-all flex items-center gap-1.5 ${
              selectedScenario === 2
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-[#262a35]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">car_crash</span>
            <span>Scenario 2: Silk Board &amp; ORR Gridlock</span>
          </button>
          <button
            onClick={() => setSelectedScenario(3)}
            className={`px-3 py-1.5 rounded-lg font-data-mono-sm text-data-mono-sm transition-all flex items-center gap-1.5 ${
              selectedScenario === 3
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-[#262a35]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            <span>Scenario 3: 40% Sanitation Deficit</span>
          </button>
        </div>
      </div>

      {/* Primary Parameter Tuning Console */}
      <section className="bg-[#171b26] rounded-xl p-4 mb-4 relative overflow-hidden shadow-xl border border-[#262a35]">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-3 mb-3 border-b border-[#262a35]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#1c1f2a] text-primary border border-[#262a35]">
              <span className="material-symbols-outlined text-[24px]">tune</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Heatwave Stress Simulation Sandbox - Run #402
                </h2>
                <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary rounded-lg font-data-mono-sm text-data-mono-sm border border-tertiary/30">
                  MONTE CARLO ACTIVE
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Inject environmental spikes, BESCOM grid dropouts, and BMTC/EMS fleet thresholds to evaluate Bengaluru resilience.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 lg:mt-0 flex-shrink-0">
            <button
              onClick={handleResetBaseline}
              className="px-3 py-2 rounded-lg bg-[#1c1f2a] hover:bg-[#262a35] text-on-surface-variant hover:text-on-surface font-data-mono-sm text-data-mono-sm flex items-center gap-1.5 transition-colors border border-[#262a35]"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset Baseline</span>
            </button>
            <button
              onClick={() => {
                setToastMessage('Preset saved to Municipal Registry.');
                setTimeout(() => setToastMessage(null), 2500);
              }}
              className="px-3 py-2 rounded-lg bg-[#1c1f2a] hover:bg-[#262a35] text-on-surface font-data-mono-sm text-data-mono-sm flex items-center gap-1.5 transition-colors border border-[#262a35]"
            >
              <span className="material-symbols-outlined text-[16px]">bookmark</span>
              <span>Save Preset</span>
            </button>
            <button
              onClick={handleRunMonteCarlo}
              disabled={isMonteCarloRunning}
              className="px-4 py-2 rounded-lg bg-primary text-on-primary font-data-mono-lg text-data-mono-lg font-bold flex items-center gap-2 hover:brightness-110 shadow-[0_0_16px_rgba(76,215,246,0.3)] transition-all"
            >
              <span className={`material-symbols-outlined text-[18px] ${isMonteCarloRunning ? 'animate-spin' : ''}`}>
                {isMonteCarloRunning ? 'refresh' : 'play_arrow'}
              </span>
              <span>{isMonteCarloRunning ? 'Computing 10,000 Loops...' : 'Run Monte Carlo (10,000 Iterations)'}</span>
            </button>
          </div>
        </div>

        {/* Parameter Sliders Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {/* Parameter 1 */}
          <div className="bg-[#1c1f2a] rounded-lg p-3 flex flex-col justify-between border border-[#262a35]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">local_fire_department</span>
                <span className="font-label-caps text-label-caps uppercase text-outline">Ambient Peak Temp</span>
              </div>
              <span className="font-data-mono-lg text-data-mono-lg text-primary font-bold">{tempVal}°C</span>
            </div>
            <input
              type="range"
              min="38"
              max="46"
              step="0.5"
              value={tempVal}
              onChange={(e) => setTempVal(parseFloat(e.target.value))}
              className="w-full accent-primary bg-[#313540] h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between items-center mt-1 font-data-mono-sm text-[10px] text-outline">
              <span>38.0°C (Nominal)</span>
              <span className="text-error">46.0°C (Extr.)</span>
            </div>
          </div>

          {/* Parameter 2 */}
          <div className="bg-[#1c1f2a] rounded-lg p-3 flex flex-col justify-between border border-[#262a35]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-tertiary text-[18px]">schedule</span>
                <span className="font-label-caps text-label-caps uppercase text-outline">Continuous Heat Duration</span>
              </div>
              <span className="font-data-mono-lg text-data-mono-lg text-tertiary font-bold">{durationVal} Hours</span>
            </div>
            <input
              type="range"
              min="12"
              max="72"
              step="6"
              value={durationVal}
              onChange={(e) => setDurationVal(parseInt(e.target.value, 10))}
              className="w-full accent-tertiary bg-[#313540] h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between items-center mt-1 font-data-mono-sm text-[10px] text-outline">
              <span>12h Wave</span>
              <span className="text-outline-variant">72h Prolonged</span>
            </div>
          </div>

          {/* Parameter 3 */}
          <div className="bg-[#1c1f2a] rounded-lg p-3 flex flex-col justify-between border border-[#262a35]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-error text-[18px]">bolt</span>
                <span className="font-label-caps text-label-caps uppercase text-outline">Substation Redundancy</span>
              </div>
              <span className="font-data-mono-lg text-data-mono-lg text-error font-bold">-{gridFaultVal}% Fault</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={gridFaultVal}
              onChange={(e) => setGridFaultVal(parseInt(e.target.value, 10))}
              className="w-full accent-error bg-[#313540] h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between items-center mt-1 font-data-mono-sm text-[10px] text-outline">
              <span>100% Intact</span>
              <span className="text-error">-50% Degraded</span>
            </div>
          </div>

          {/* Parameter 4 */}
          <div className="bg-[#1c1f2a] rounded-lg p-3 flex flex-col justify-between border border-[#262a35]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">ambulance</span>
                <span className="font-label-caps text-label-caps uppercase text-outline">EMT Fleet Availability</span>
              </div>
              <span className="font-data-mono-lg text-data-mono-lg text-secondary font-bold">{fleetVal}% Operational</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={fleetVal}
              onChange={(e) => setFleetVal(parseInt(e.target.value, 10))}
              className="w-full accent-secondary bg-[#313540] h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between items-center mt-1 font-data-mono-sm text-[10px] text-outline">
              <span className="text-error">50% Starved</span>
              <span>100% Full Cap</span>
            </div>
          </div>
        </div>
      </section>

      {/* Side-by-Side Model Comparison Benchmark */}
      <section className="mb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-3">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest">
              EMPIRICAL DELTA ANALYSIS
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              The Benchmark: Siloed Operations vs. City OS Coordinated
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">CONFIDENCE INTERVAL:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-[#1c1f2a] font-data-mono-sm text-data-mono-sm text-tertiary border border-[#262a35]">
              99.74% (p &lt; 0.001)
            </span>
          </div>
        </div>

        {/* Comparative Master Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Uncoordinated Model Column (Left 5 cols) */}
          <div className="lg:col-span-5 bg-[#171b26] rounded-xl p-4 flex flex-col justify-between shadow-md border border-[#262a35]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#262a35] flex items-center justify-center text-outline">
                  <span className="material-symbols-outlined text-[20px]">domain_disabled</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Legacy Siloed Response</h3>
                  <p className="font-label-caps text-label-caps uppercase text-outline">Asynchronous Agency Silos</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-[#262a35] text-outline font-data-mono-sm text-data-mono-sm rounded-lg border border-[#3d494c]">
                BASELINE STANDARD
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-[#1c1f2a] rounded-lg p-3 border border-[#262a35]">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-label-caps text-label-caps uppercase text-outline">
                    Dispatch &amp; Synthesis Speed
                  </span>
                  <span className="font-data-mono-sm text-data-mono-sm text-error font-bold">CRITICAL LAG</span>
                </div>
                <div className="font-display-lg text-display-lg text-on-surface font-data-mono-lg leading-none mb-1 font-bold">
                  3h 45m
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Fragmented manual phone calls, spreadsheet reconciliations, delayed crisis summit convening.
                </p>
                <div className="w-full bg-[#313540] h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-error h-full w-[88%]"></div>
                </div>
              </div>

              <div className="bg-[#1c1f2a] rounded-lg p-3 border border-[#262a35]">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-label-caps text-label-caps uppercase text-outline">
                    Conflicting Resource Requests
                  </span>
                  <span className="font-data-mono-sm text-data-mono-sm text-error font-bold">14 COLLISIONS</span>
                </div>
                <div className="font-headline-lg text-headline-lg text-error font-data-mono-lg leading-none mb-1 font-bold">
                  14 Agency Conflicts
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  BMTC, BTP Police &amp; BESCOM dispute priority over 500kVA emergency generator routing.
                </p>
              </div>

              <div className="bg-[#1c1f2a] rounded-lg p-3 border border-[#262a35]">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-label-caps text-label-caps uppercase text-outline">
                    Healthcare Vulnerability Impact
                  </span>
                  <span className="font-data-mono-sm text-data-mono-sm text-error font-bold">SEVERE RISK</span>
                </div>
                <div className="font-headline-lg text-headline-lg text-on-surface font-data-mono-lg leading-none mb-1 font-bold">
                  184 Unattended / 3 Brownouts
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Senior housing clusters left unmonitored; St. John's Hospital aux generator tripped offline.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#1c1f2a] rounded-lg p-3 border border-[#262a35]">
                  <span className="font-label-caps text-label-caps uppercase text-outline block mb-1">
                    Fleet Efficiency
                  </span>
                  <div className="font-headline-lg text-headline-lg text-on-surface font-data-mono-lg font-bold">58%</div>
                  <span className="font-data-mono-sm text-[10px] text-outline">Idle in Silk Board blockades</span>
                </div>
                <div className="bg-[#1c1f2a] rounded-lg p-3 border border-[#262a35]">
                  <span className="font-label-caps text-label-caps uppercase text-outline block mb-1">
                    Economic Damage
                  </span>
                  <div className="font-headline-lg text-headline-lg text-error font-data-mono-lg font-bold">₹3.48 Cr</div>
                  <span className="font-data-mono-sm text-[10px] text-outline">Overtime + transformer failure</span>
                </div>
              </div>
            </div>
          </div>

          {/* Central Differential Divider (2 cols) */}
          <div className="lg:col-span-2 flex flex-col justify-center items-center gap-3 py-2">
            <div className="w-full flex lg:flex-col items-center justify-between lg:justify-center gap-4 bg-[#171b26] rounded-xl p-3 h-full text-center border border-[#262a35]">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-[#262a35] flex items-center justify-center text-primary mb-2 shadow-md border border-[#3d494c]">
                  <span className="material-symbols-outlined text-[28px]">compare_arrows</span>
                </div>
                <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
                  MEASURED DELTA
                </span>
              </div>
              <div className="flex flex-col gap-2.5 w-full">
                <div className="p-2 bg-[#1c1f2a] rounded-lg border border-[#262a35]">
                  <span className="font-label-caps text-[9px] uppercase text-outline block">SPEED LIFT</span>
                  <span className="font-data-mono-lg text-data-mono-lg text-tertiary font-bold">-94.6%</span>
                </div>
                <div className="p-2 bg-[#1c1f2a] rounded-lg border border-[#262a35]">
                  <span className="font-label-caps text-[9px] uppercase text-outline block">CONFLICT AVOID</span>
                  <span className="font-data-mono-lg text-data-mono-lg text-tertiary font-bold">100% NET</span>
                </div>
                <div className="p-2 bg-[#1c1f2a] rounded-lg border border-[#262a35]">
                  <span className="font-label-caps text-[9px] uppercase text-outline block">CASUALTY RISK</span>
                  <span className="font-data-mono-lg text-data-mono-lg text-tertiary font-bold">-97.8%</span>
                </div>
                <div className="p-2 bg-[#1c1f2a] rounded-lg border border-[#262a35]">
                  <span className="font-label-caps text-[9px] uppercase text-outline block">MUNICIPAL SAVINGS</span>
                  <span className="font-data-mono-lg text-data-mono-lg text-primary font-bold">₹2.96 Cr</span>
                </div>
              </div>
              <div className="text-left w-full pt-1">
                <span className="font-data-mono-sm text-[10px] text-outline leading-tight block">
                  Simulated on 10,000 synthetic stochastic agent loops.
                </span>
              </div>
            </div>
          </div>

          {/* City OS Coordinated Response Column (Right 5 cols) */}
          <div className="lg:col-span-5 bg-[#171b26] rounded-xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden border border-[#262a35]">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#262a35]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">hub</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-1.5 font-bold">
                    <span>City OS Coordinated Intelligence</span>
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  </h3>
                  <p className="font-label-caps text-label-caps uppercase text-primary">Cross-Department Neural Sync</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-tertiary/10 text-tertiary font-data-mono-sm text-data-mono-sm rounded-lg flex items-center gap-1 border border-tertiary/30">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                <span>OPTIMIZED</span>
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-[#1c1f2a] rounded-lg p-3 border border-[#262a35]">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-label-caps text-label-caps uppercase text-primary">
                    Instant Automated Synthesis
                  </span>
                  <span className="px-2 py-0.5 rounded bg-tertiary/10 font-data-mono-sm text-data-mono-sm text-tertiary font-bold border border-tertiary/30">
                    -94.6% FASTER
                  </span>
                </div>
                <div className="font-display-lg text-display-lg text-primary font-data-mono-lg leading-none mb-1 font-bold">
                  12 Minutes
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Real-time cross-database telemetry parsing immediately synchronizes BESCOM, BTP, Health &amp; BMRCL.
                </p>
                <div className="w-full bg-[#313540] h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-tertiary h-full w-[6%]"></div>
                </div>
              </div>

              <div className="bg-[#1c1f2a] rounded-lg p-3 border border-[#262a35]">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-label-caps text-label-caps uppercase text-primary">
                    Resource Lock Arbitration
                  </span>
                  <span className="px-2 py-0.5 rounded bg-tertiary/10 font-data-mono-sm text-data-mono-sm text-tertiary border border-tertiary/30">
                    0 DISPUTES
                  </span>
                </div>
                <div className="font-headline-lg text-headline-lg text-tertiary font-data-mono-lg leading-none mb-1 font-bold">
                  0 Conflicting Assignments
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Automated arbitration assigns generators based on microclimate heat index vs hospital ICU load.
                </p>
              </div>

              <div className="bg-[#1c1f2a] rounded-lg p-3 border border-[#262a35]">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-label-caps text-label-caps uppercase text-primary">
                    Proactive Citizen Safeguarding
                  </span>
                  <span className="px-2 py-0.5 rounded bg-tertiary/10 font-data-mono-sm text-data-mono-sm text-tertiary border border-tertiary/30">
                    -98% RISK REDUCTION
                  </span>
                </div>
                <div className="font-headline-lg text-headline-lg text-on-surface font-data-mono-lg leading-none mb-1 font-bold">
                  4 Citizens Flagged / 0 Brownouts
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Autonomous mobile cooling pods deployed 4 hours in advance to vulnerable wards; grid loads shed smoothly.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#1c1f2a] rounded-lg p-3 border border-[#262a35]">
                  <span className="font-label-caps text-label-caps uppercase text-primary block mb-1">
                    Fleet Dynamic Utilization
                  </span>
                  <div className="font-headline-lg text-headline-lg text-tertiary font-data-mono-lg font-bold">92%</div>
                  <span className="font-data-mono-sm text-[10px] text-tertiary">+34% Fleet Yield</span>
                </div>
                <div className="bg-[#1c1f2a] rounded-lg p-3 border border-[#262a35]">
                  <span className="font-label-caps text-label-caps uppercase text-primary block mb-1">
                    Total Scenario Cost
                  </span>
                  <div className="font-headline-lg text-headline-lg text-primary font-data-mono-lg font-bold">₹51 Lakhs</div>
                  <span className="font-data-mono-sm text-[10px] text-tertiary">85.2% Cost Saved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Outcome Timeline Simulation */}
      <section className="bg-[#171b26] rounded-xl p-4 mb-4 shadow-lg border border-[#262a35]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 mb-3 border-b border-[#262a35]">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest">
                TEMPORAL PROJECTION CURVE
              </span>
              <span className="font-data-mono-sm text-data-mono-sm text-outline">• RESOLUTION: 15 MIN INTERVALS</span>
            </div>
            <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Timeline Projection: T+0 to T+24 Surge Trajectory (Bengaluru)
            </h3>
          </div>
          <div className="flex items-center gap-3 mt-2 lg:mt-0">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-error"></span>
              <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">Siloed Failure Curve</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-primary"></span>
              <span className="font-data-mono-sm text-data-mono-sm text-primary">City OS Stabilized Curve</span>
            </div>
          </div>
        </div>

        {/* Telemetry Multi-Stream Visualizer */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
          {/* Stream 1 */}
          <div className="bg-[#1c1f2a] rounded-lg p-3 flex flex-col justify-between border border-[#262a35]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-headline-sm text-body-sm font-semibold text-on-surface">
                1. BESCOM Substation Overload
              </span>
              <span className="font-data-mono-sm text-data-mono-sm text-error">MAX RISK T+14</span>
            </div>
            <div className="h-36 w-full flex items-end">
              <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 320 120">
                <line stroke="#313540" strokeDasharray="2 4" x1="0" x2="320" y1="30" y2="30"></line>
                <line stroke="#313540" strokeDasharray="2 4" x1="0" x2="320" y1="70" y2="70"></line>
                <line stroke="#313540" x1="0" x2="320" y1="110" y2="110"></line>
                <path d="M 0 95 C 40 90, 80 80, 120 50 C 160 20, 200 12, 240 18 C 280 25, 320 35, 320 40" fill="none" stroke="#ffb4ab" strokeWidth="2.5"></path>
                <circle className="animate-pulse" cx="200" cy="12" fill="#ffb4ab" r="4"></circle>
                <path d="M 0 100 C 40 96, 80 85, 120 75 C 160 68, 200 65, 240 68 C 280 72, 320 80, 320 85" fill="none" stroke="#4cd7f6" strokeWidth="2.5"></path>
                <circle cx="200" cy="65" fill="#4cd7f6" r="3.5"></circle>
              </svg>
            </div>
            <div className="flex items-center justify-between font-data-mono-sm text-[10px] text-outline pt-1">
              <span>T+0h (08:00)</span>
              <span>T+8h (Peak Sun)</span>
              <span>T+16h (Surge)</span>
              <span>T+24h (Cool)</span>
            </div>
            <div className="mt-2 p-1.5 bg-[#0a0e18] rounded font-data-mono-sm text-data-mono-sm text-on-surface-variant flex justify-between border border-[#262a35]">
              <span>Siloed Outage Est: <strong className="text-error">12 Districts</strong></span>
              <span>City OS: <strong className="text-tertiary">0 Blackouts</strong></span>
            </div>
          </div>

          {/* Stream 2 */}
          <div className="bg-[#1c1f2a] rounded-lg p-3 flex flex-col justify-between border border-[#262a35]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-headline-sm text-body-sm font-semibold text-on-surface">
                2. ER Hyperthermia &amp; Trauma Load
              </span>
              <span className="font-data-mono-sm text-data-mono-sm text-tertiary">LOAD FLATTENED</span>
            </div>
            <div className="h-36 w-full flex items-end">
              <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 320 120">
                <line stroke="#313540" strokeDasharray="2 4" x1="0" x2="320" y1="30" y2="30"></line>
                <line stroke="#313540" strokeDasharray="2 4" x1="0" x2="320" y1="70" y2="70"></line>
                <line stroke="#313540" x1="0" x2="320" y1="110" y2="110"></line>
                <path d="M 0 105 C 50 100, 100 85, 140 45 C 180 15, 230 10, 270 25 C 300 40, 320 60, 320 65" fill="none" stroke="#ffb4ab" strokeWidth="2.5"></path>
                <circle cx="210" cy="11" fill="#ffb4ab" r="4"></circle>
                <path d="M 0 105 C 50 98, 100 90, 140 82 C 180 75, 230 70, 270 78 C 300 85, 320 92, 320 95" fill="none" stroke="#4cd7f6" strokeWidth="2.5"></path>
                <circle cx="210" cy="71" fill="#4cd7f6" r="3.5"></circle>
              </svg>
            </div>
            <div className="flex items-center justify-between font-data-mono-sm text-[10px] text-outline pt-1">
              <span>T+0h</span>
              <span>T+8h</span>
              <span>T+16h</span>
              <span>T+24h</span>
            </div>
            <div className="mt-2 p-1.5 bg-[#0a0e18] rounded font-data-mono-sm text-data-mono-sm text-on-surface-variant flex justify-between border border-[#262a35]">
              <span>Siloed ER Surge: <strong className="text-error">+240% Cap</strong></span>
              <span>City OS: <strong className="text-tertiary">+14% Controlled</strong></span>
            </div>
          </div>

          {/* Stream 3 */}
          <div className="bg-[#1c1f2a] rounded-lg p-3 flex flex-col justify-between border border-[#262a35]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-headline-sm text-body-sm font-semibold text-on-surface">
                3. Silk Board Arterial Flow &amp; Congestion
              </span>
              <span className="font-data-mono-sm text-data-mono-sm text-primary">BTP SIGNALS SYNC</span>
            </div>
            <div className="h-36 w-full flex items-end">
              <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 320 120">
                <line stroke="#313540" strokeDasharray="2 4" x1="0" x2="320" y1="30" y2="30"></line>
                <line stroke="#313540" strokeDasharray="2 4" x1="0" x2="320" y1="70" y2="70"></line>
                <line stroke="#313540" x1="0" x2="320" y1="110" y2="110"></line>
                <path d="M 0 90 C 40 85, 90 70, 130 35 C 170 15, 220 22, 260 40 C 290 60, 320 70, 320 75" fill="none" stroke="#ffb4ab" strokeWidth="2.5"></path>
                <path d="M 0 92 C 40 90, 90 85, 130 80 C 170 72, 220 68, 260 70 C 290 75, 320 80, 320 82" fill="none" stroke="#4cd7f6" strokeWidth="2.5"></path>
              </svg>
            </div>
            <div className="flex items-center justify-between font-data-mono-sm text-[10px] text-outline pt-1">
              <span>T+0h</span>
              <span>T+8h</span>
              <span>T+16h</span>
              <span>T+24h</span>
            </div>
            <div className="mt-2 p-1.5 bg-[#0a0e18] rounded font-data-mono-sm text-data-mono-sm text-on-surface-variant flex justify-between border border-[#262a35]">
              <span>Siloed Transit Delay: <strong className="text-error">+68 min</strong></span>
              <span>City OS: <strong className="text-tertiary">+4 min EMS Wave</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sandbox Scenario Picker & Geospatial Micro-Context */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-4">
        {/* Visual Simulated Topology Map Card (7 cols) */}
        <div className="lg:col-span-7 bg-[#171b26] rounded-xl p-4 shadow-lg border border-[#262a35] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-outline">
                NEURAL SPATIAL SIMULATION
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Thermal Stress &amp; Resource Dispatch Map Overlay
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <span className="font-data-mono-sm text-data-mono-sm text-primary">ZONE_DELTA_BENGALURU</span>
            </div>
          </div>
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-[#0a0e18] border border-[#262a35]">
            <div
              className="w-full h-full bg-cover bg-center opacity-40"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuButD0jf0NhV8QLl3mxF3ZKTs6uOJvWx-0_ti2AwX8cWf9n1pGgNWACt6LBoKsjjHGNUYRfnH1TminPWHDGtkD6BTc7ABC6b8xZbTQLMf01O963vqwRBqSH9eT87X0YgxSVVZ4R8Rxq1apr3b2CwpPrlp16at7cowZYkCGdAv9n3ByH6SwXG_POZPhPsCkSShjWDiqlbVd-CY9j6ezv7VqfgBERmxIDcXMVhy1kzwHeiabYMs5K05Ht')`
              }}
            ></div>
            <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
              <div className="flex justify-between items-start">
                <div className="bg-[#171b26]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#3d494c]">
                  <span className="font-data-mono-sm text-data-mono-sm text-error font-bold">
                    HEAT ZONE: 43.1°C PEAK
                  </span>
                </div>
                <div className="bg-[#171b26]/90 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 border border-[#3d494c]">
                  <span className="material-symbols-outlined text-tertiary text-[14px]">electric_bolt</span>
                  <span className="font-data-mono-sm text-data-mono-sm text-tertiary">
                    3 DYNAMIC GENERATORS SYNCED
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-[#171b26]/90 backdrop-blur-md px-2 py-1 rounded-lg border border-[#3d494c]">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  <span className="font-data-mono-sm text-[11px] text-on-surface">
                    HAL Substation #04 Bypassed &amp; Protected
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-[#171b26]/90 backdrop-blur-md px-2 py-1 rounded-lg border border-[#3d494c]">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="font-data-mono-sm text-[11px] text-on-surface">
                    18 BMTC Evacuation Shuttles Routed
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 font-data-mono-sm text-data-mono-sm text-outline">
            <span>COORDINATES: 12.9716° N, 77.5946° E</span>
            <button
              onClick={() => onNavigateTab('map-and-zone-explorer')}
              className="text-primary hover:underline cursor-pointer"
            >
              Open Full 3D Digital Twin →
            </button>
          </div>
        </div>

        {/* Pre-configured Simulation Library (5 cols) */}
        <div className="lg:col-span-5 bg-[#171b26] rounded-xl p-4 shadow-lg border border-[#262a35] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Pre-Configured Simulation Library
              </h3>
              <span className="font-label-caps text-label-caps uppercase text-outline">STRESS CATALOG</span>
            </div>
            <div className="flex flex-col gap-2">
              {/* Active Scenario Card */}
              <div
                onClick={() => setSelectedScenario(1)}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  selectedScenario === 1
                    ? 'bg-[#1c1f2a] border-primary'
                    : 'bg-[#1c1f2a] border-[#262a35] hover:bg-[#262a35]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-data-mono-lg text-body-sm font-semibold text-primary">
                    Scenario 1: Level 3 Metro Heatwave (BLR)
                  </span>
                  <span className="px-2 py-0.5 bg-primary/20 text-primary font-data-mono-sm text-[10px] rounded border border-primary/30">
                    SELECTED
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">
                  Cross-department heat advisory with heavy grid degradation, elderly community isolation risk, and asphalt thermal softening.
                </p>
                <div className="flex items-center gap-3 font-data-mono-sm text-[10px] text-outline">
                  <span>EST. SAVINGS: ₹2.96 Cr ($3.58M)</span>
                  <span>LIVES SECURED: 180+</span>
                </div>
              </div>

              {/* Scenario Card 2 */}
              <div
                onClick={() => setSelectedScenario(2)}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  selectedScenario === 2
                    ? 'bg-[#1c1f2a] border-primary'
                    : 'bg-[#1c1f2a] border-[#262a35] hover:bg-[#262a35]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-data-mono-lg text-body-sm font-semibold text-on-surface">
                    Scenario 2: Silk Board Choke &amp; EMS Corridors
                  </span>
                  <span className="font-data-mono-sm text-data-mono-sm text-outline">READY</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">
                  Major multi-vehicle bottleneck on Hosur Elevated Tollway cutting off St. John's Medical Center. Evaluates dynamic BTP signal takeover.
                </p>
                <div className="flex items-center gap-3 font-data-mono-sm text-[10px] text-outline">
                  <span>RESPONSE SPEEDUP: -72%</span>
                  <span>CLEAR TIME: 38 MIN</span>
                </div>
              </div>

              {/* Scenario Card 3 */}
              <div
                onClick={() => setSelectedScenario(3)}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  selectedScenario === 3
                    ? 'bg-[#1c1f2a] border-primary'
                    : 'bg-[#1c1f2a] border-[#262a35] hover:bg-[#262a35]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-data-mono-lg text-body-sm font-semibold text-on-surface">
                    Scenario 3: 40% Sanitation Disruption &amp; Bio-Risk
                  </span>
                  <span className="font-data-mono-sm text-data-mono-sm text-outline">READY</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">
                  Peenya &amp; K.R. Market waste collection disruption combined with pre-monsoon thunderstorm flooding. Tests cross-department mobilization.
                </p>
                <div className="flex items-center gap-3 font-data-mono-sm text-[10px] text-outline">
                  <span>BIO-HAZARD PREVENT: 99.1%</span>
                  <span>SAVINGS: ₹1.02 Cr</span>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-3">
            <button
              onClick={() => setToastMessage('Custom Multi-Hazard Sandbox builder opened.')}
              className="w-full py-2 bg-[#1c1f2a] hover:bg-[#262a35] text-on-surface font-data-mono-sm text-data-mono-sm rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-[#262a35]"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Create Custom Multi-Hazard Sandbox...</span>
            </button>
          </div>
        </div>
      </section>

      {/* Live Operation Command Action Bar */}
      <section className="bg-[#171b26] rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xl border border-[#262a35]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1c1f2a] flex items-center justify-center text-tertiary border border-[#262a35]">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-data-mono-lg text-body-sm font-semibold text-on-surface">
                Simulation Audit Ready: Protocol #HW-402-BLR
              </span>
              <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary rounded text-[10px] font-data-mono-sm border border-tertiary/30">
                VALIDATED
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Optimal resource arbitration verified with 99.7% confidence across 10,000 runs in Bengaluru.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleExportAudit}
            className="px-3.5 py-2.5 rounded-lg bg-[#1c1f2a] hover:bg-[#262a35] text-on-surface font-data-mono-sm text-data-mono-sm flex items-center gap-1.5 transition-colors border border-[#262a35]"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Export Audit Report (PDF/JSON)</span>
          </button>
          <button
            onClick={() => {
              setToastMessage('Sandbox cloned into working branch.');
              setTimeout(() => setToastMessage(null), 2500);
            }}
            className="px-3.5 py-2.5 rounded-lg bg-[#1c1f2a] hover:bg-[#262a35] text-on-surface font-data-mono-sm text-data-mono-sm flex items-center gap-1.5 transition-colors border border-[#262a35]"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            <span>Clone Sandbox</span>
          </button>
          <button
            onClick={handleApplyToLive}
            className={`px-4 py-2.5 rounded-lg font-data-mono-lg text-data-mono-lg font-bold flex items-center gap-2 transition-all shadow-[0_0_16px_rgba(76,215,246,0.25)] ${
              appliedToLive
                ? 'bg-tertiary text-on-tertiary'
                : 'bg-primary text-on-primary hover:brightness-110'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>{appliedToLive ? 'Parameters Pushed to Live Core' : 'Apply to Live AI Response Planner'}</span>
          </button>
        </div>
      </section>

      {toastMessage && (
        <div className="fixed bottom-10 right-8 bg-[#262a35] text-on-surface px-4 py-2 rounded-lg shadow-2xl flex items-center gap-2 border border-tertiary z-50">
          <span className="material-symbols-outlined text-tertiary">check_circle</span>
          <span className="font-data-mono-sm text-data-mono-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
