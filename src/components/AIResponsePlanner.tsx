import React, { useState, useEffect } from 'react';

interface AIResponsePlannerProps {
  onNavigateTab: (tab: any) => void;
}

export const AIResponsePlanner: React.FC<AIResponsePlannerProps> = ({ onNavigateTab }) => {
  const [countdownSeconds, setCountdownSeconds] = useState(282);
  const [arbitrationApplied, setArbitrationApplied] = useState(false);
  const [actionApprovals, setActionApprovals] = useState<{ [key: number]: boolean }>({
    1: true,
    2: false,
    3: false,
    4: true
  });
  const [authPin, setAuthPin] = useState('');
  const [masterPlanDispatched, setMasterPlanDispatched] = useState(false);
  const [rationaleExpanded, setRationaleExpanded] = useState<{ [key: string]: boolean }>({
    rat1: true,
    rat2: false
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds(prev => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleApplyArbitration = () => {
    setArbitrationApplied(true);
    setToastMessage('Arbitration applied: #GEN-04 assigned to St. John\'s Hospital, Solar #BAT-02 dispatched to Indira Canteen Shelter.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAuthorizeStep = (actionNum: number) => {
    setActionApprovals(prev => ({ ...prev, [actionNum]: true }));
    setToastMessage(`Action Directive #0${actionNum} authorized and verified by officer.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBiometric = () => {
    setAuthPin('84920412');
    setToastMessage('Biometric clearance valid: Officer token verified.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMasterDispatch = () => {
    setActionApprovals({ 1: true, 2: true, 3: true, 4: true });
    setMasterPlanDispatched(true);
    setToastMessage('SUCCESS: Coordinated Action Plan #CAP-2024-HEAT-04 fully dispatched across Bengaluru municipal mesh!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Top Command Telemetry Ticker & Mode Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 mb-4 border-b border-[#262a35]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#262a35] px-3 py-1 rounded-lg border border-[#3d494c]">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span className="font-label-caps text-label-caps tracking-widest text-primary uppercase">
              PLANNING ENGINE
            </span>
            <span className="font-data-mono-sm text-data-mono-sm text-outline-variant">|</span>
            <span className="font-data-mono-sm text-data-mono-sm text-on-surface">
              SYNTH_ID: CAP-2024-HEAT-04-BLR
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-error-container/20 px-3 py-1 rounded-lg border border-error/30">
            <span className="material-symbols-outlined text-error text-[16px]">verified_user</span>
            <span className="font-label-caps text-label-caps text-error uppercase">
              PENDING HUMAN AUTHORIZATION (DIRECTOR SIGN-OFF)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-data-mono-sm text-data-mono-sm text-outline">TIME TO NEXT EVALUATION CYCLE:</span>
          <span className="font-data-mono-lg text-data-mono-lg text-tertiary tabular-nums font-bold">
            {formatCountdown(countdownSeconds)}
          </span>
        </div>
      </div>

      {/* Executive Plan Master Header */}
      <div className="relative overflow-hidden bg-[#171b26] rounded-xl p-4 mb-4 shadow-xl border border-[#262a35]">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
        <div className="absolute right-40 bottom-0 w-64 h-32 rounded-full bg-tertiary/5 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-label-caps text-label-caps bg-[#1c1f2a] px-2 py-0.5 rounded text-outline uppercase border border-[#262a35]">
                PROTOCOL CLASS: CROSS-SECTORAL CONCURRENT
              </span>
              <span className="font-label-caps text-label-caps bg-tertiary/10 text-tertiary px-2 py-0.5 rounded uppercase border border-tertiary/30">
                AI CONFIDENCE: 94.2%
              </span>
              <span className="font-label-caps text-label-caps bg-secondary-container/40 text-secondary px-2 py-0.5 rounded uppercase border border-secondary/30">
                SEVERITY INDEX: LEVEL 3
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-1 font-bold">
              Integrated Metro Heatwave &amp; Energy Curtailment Protocol — Bengaluru
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl leading-relaxed">
              Synthesized cross-department mitigation plan linking BESCOM HAL Substation 4, Dept of Health trauma vectors (St. John's &amp; Bowring hospitals), and BTP / BMRCL Metro Transit arterials to forestall uncontrolled cascade brownouts and emergency service congestion.
            </p>
          </div>

          {/* Projected Impact Delta Cards */}
          <div className="grid grid-cols-3 gap-2 xl:min-w-[460px]">
            <div className="bg-[#1c1f2a] p-3 rounded-lg flex flex-col justify-between border border-[#262a35]">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-outline uppercase">CASCADE RISK</span>
                <span className="material-symbols-outlined text-tertiary text-[18px]">electric_bolt</span>
              </div>
              <div className="my-1">
                <span className="font-headline-lg text-headline-lg text-tertiary font-bold tracking-tight">-64%</span>
              </div>
              <span className="font-data-mono-sm text-[10px] text-on-surface-variant uppercase">
                Transformer Load
              </span>
            </div>
            <div className="bg-[#1c1f2a] p-3 rounded-lg flex flex-col justify-between border border-[#262a35]">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-outline uppercase">GRID RESERVE</span>
                <span className="material-symbols-outlined text-primary text-[18px]">battery_charging_full</span>
              </div>
              <div className="my-1">
                <span className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">+38 MW</span>
              </div>
              <span className="font-data-mono-sm text-[10px] text-on-surface-variant uppercase">
                Peak Preserved
              </span>
            </div>
            <div className="bg-[#1c1f2a] p-3 rounded-lg flex flex-col justify-between border border-[#262a35]">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-outline uppercase">EMS DELAY</span>
                <span className="material-symbols-outlined text-secondary text-[18px]">emergency</span>
              </div>
              <div className="my-1">
                <span className="font-headline-lg text-headline-lg text-secondary font-bold tracking-tight">-14 min</span>
              </div>
              <span className="font-data-mono-sm text-[10px] text-on-surface-variant uppercase">
                Zone 4 Arterial
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Conflict Warning Bar */}
      <div className="bg-[#262a35] rounded-xl p-3 mb-4 shadow-md border border-[#3d494c]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-error-container text-on-error-container rounded-lg flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-label-caps text-label-caps bg-error/20 text-error px-2 py-0.5 rounded font-bold uppercase border border-error/30">
                  RESOURCE CONTENTION DETECTED
                </span>
                <span className="font-data-mono-sm text-data-mono-sm text-outline">
                  RESOURCE: #GEN-FLEET-04 (500kVA Mobile Diesel)
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface mt-1">
                <strong className="font-semibold text-primary">Contention:</strong> Dept of Public Health (St. John's Islanding) and BBMP Parks &amp; Social Welfare (Zone 4 Indira Canteen Cooling Pavilion) concurrently requisitioned unit #GEN-FLEET-04.
              </p>
              <div className="mt-1 flex items-center gap-1.5 flex-wrap text-tertiary">
                <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                <span className="font-body-sm text-[12px]">
                  AI Auto-Arbitration: Reroute #GEN-04 to St. John's Hospital; dispatch BESCOM Micro-Battery Array #BAT-02 to Indira Canteen Shelter (Arbitration Feasibility: 96%).
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 self-end lg:self-center">
            <button
              onClick={handleApplyArbitration}
              className={`font-data-mono-sm text-data-mono-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all shadow-sm ${
                arbitrationApplied
                  ? 'bg-tertiary/20 text-tertiary border border-tertiary'
                  : 'bg-primary-container text-on-primary-container hover:brightness-110'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {arbitrationApplied ? 'done_all' : 'check_circle'}
              </span>
              {arbitrationApplied ? 'ARBITRATION COMMITTED' : 'APPLY ARBITRATION'}
            </button>
            <button
              onClick={() => setToastMessage('Manual override mode opened for dispatcher.')}
              className="bg-[#1c1f2a] text-on-surface-variant font-data-mono-sm text-data-mono-sm px-3 py-1.5 rounded-lg hover:text-on-surface transition-colors border border-[#262a35]"
            >
              OVERRIDE MANUAL
            </button>
          </div>
        </div>
      </div>

      {/* Main 12-Column Grid Layout: Action Matrix (Col 8) + Synthesis & Audit Rail (Col 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-6">
        {/* LEFT PANE: Coordinated Priority Action Matrix (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="flex items-center justify-between bg-[#171b26] px-3 py-2 rounded-lg border border-[#262a35]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">account_tree</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">Coordinated Action Sequence</span>
              <span className="font-data-mono-sm text-data-mono-sm text-outline bg-[#1c1f2a] px-2 py-0.5 rounded border border-[#262a35]">
                4 DIRECTIVES
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="text-on-surface-variant hover:text-on-surface p-1 rounded font-data-mono-sm text-data-mono-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">filter_list</span>
                FILTER BY DEPT
              </button>
            </div>
          </div>

          {/* Action Card 01: Critical */}
          <div className="bg-[#1c1f2a] rounded-xl p-3 transition-all shadow-md hover:bg-[#262a35]/90 border border-[#262a35]">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-data-mono-lg text-data-mono-lg text-primary font-bold">01</span>
                <span className="font-label-caps text-label-caps bg-error/20 text-error px-2 py-0.5 rounded uppercase border border-error/30">
                  PRIORITY: CRITICAL
                </span>
                <span className="font-data-mono-sm text-data-mono-sm text-outline-variant">•</span>
                <span className="font-label-caps text-label-caps text-primary uppercase">
                  ENERGY (BESCOM) &amp; PUBLIC HEALTH
                </span>
              </div>
              <div className="flex items-center gap-1 bg-tertiary/10 text-tertiary px-2 py-0.5 rounded border border-tertiary/30">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                <span className="font-data-mono-sm text-data-mono-sm uppercase">APPROVED [DIR. VANCE]</span>
              </div>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 font-bold">
              Decouple St. John's &amp; Bowring Hospitals to Microgrid Battery Storage &amp; Island HAL Substation 4
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
              Safeguards hospital life-support load from potential thermal voltage collapse at Grid Node 14. Isolates critical facility within controlled localized frequency envelope.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#0a0e18] p-2 rounded-lg mb-2 font-data-mono-sm text-data-mono-sm border border-[#262a35]">
              <div>
                <span className="text-outline block text-[10px] uppercase">COORDINATED BODIES:</span>
                <span className="text-on-surface">BESCOM + Health Directorate</span>
              </div>
              <div>
                <span className="text-outline block text-[10px] uppercase">RESOURCE COMMITTED:</span>
                <span className="text-on-surface">2 Aux Generators, 1 Tech Squad</span>
              </div>
              <div>
                <span className="text-outline block text-[10px] uppercase">EXECUTION WINDOW:</span>
                <span className="text-tertiary">T-minus 25 mins (15:30 EOD)</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                <span className="font-data-mono-sm text-[11px] text-tertiary">Ready for automated relay injection</span>
              </div>
              <button
                onClick={() => onNavigateTab('ai-predictions-and-alerts')}
                className="text-on-surface-variant hover:text-primary font-data-mono-sm text-[11px] flex items-center gap-1"
              >
                VIEW TELEMETRY HOOKS <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Action Card 02: High - Transit & Police */}
          <div className="bg-[#1c1f2a] rounded-xl p-3 transition-all shadow-md hover:bg-[#262a35]/90 border border-[#262a35]">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-data-mono-lg text-data-mono-lg text-primary font-bold">02</span>
                <span className="font-label-caps text-label-caps bg-primary/20 text-primary px-2 py-0.5 rounded uppercase border border-primary/30">
                  PRIORITY: HIGH
                </span>
                <span className="font-data-mono-sm text-data-mono-sm text-outline-variant">•</span>
                <span className="font-label-caps text-label-caps text-secondary uppercase">
                  TRANSIT &amp; POLICE OPS (BTP)
                </span>
              </div>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${actionApprovals[2] ? 'bg-tertiary/10 text-tertiary border border-tertiary/30' : 'bg-[#262a35] text-outline border border-[#3d494c]'}`}>
                <span className={`w-2 h-2 rounded-full ${actionApprovals[2] ? 'bg-tertiary' : 'bg-outline animate-pulse'}`}></span>
                <span className="font-data-mono-sm text-data-mono-sm uppercase">
                  {actionApprovals[2] ? 'APPROVED [DIR. VANCE]' : 'PENDING SIGN-OFF'}
                </span>
              </div>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 font-bold">
              Establish Emergency Green Corridor on Outer Ring Road &amp; Silk Board Pre-empt Signals
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
              Overrides 26 intersection signal timings along the Silk Board - Marathahalli corridor. Reduces heatstroke patient ambulance transit time to Trauma Center 1 from 28 minutes to 14 minutes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#0a0e18] p-2 rounded-lg mb-2 font-data-mono-sm text-data-mono-sm border border-[#262a35]">
              <div>
                <span className="text-outline block text-[10px] uppercase">COORDINATED BODIES:</span>
                <span className="text-on-surface">BMRCL Transit + BTP Police</span>
              </div>
              <div>
                <span className="text-outline block text-[10px] uppercase">RESOURCE COMMITTED:</span>
                <span className="text-on-surface">Automated Signal Mesh, 4 Field Units</span>
              </div>
              <div>
                <span className="text-outline block text-[10px] uppercase">EXECUTION WINDOW:</span>
                <span className="text-on-surface">T-minus 40 mins (Continuous 3h)</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span className="font-data-mono-sm text-[11px] text-on-surface-variant">
                  Requires BTP Police Dispatch Supervisor clearance
                </span>
              </div>
              {!actionApprovals[2] && (
                <button
                  onClick={() => handleAuthorizeStep(2)}
                  className="bg-[#262a35] hover:bg-[#313540] text-on-surface font-data-mono-sm text-[11px] px-2.5 py-1 rounded transition-colors border border-[#3d494c]"
                >
                  AUTHORIZE STEP
                </button>
              )}
            </div>
          </div>

          {/* Action Card 03: High - Parks, Social Services & Water */}
          <div className="bg-[#1c1f2a] rounded-xl p-3 transition-all shadow-md hover:bg-[#262a35]/90 border border-[#262a35]">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-data-mono-lg text-data-mono-lg text-primary font-bold">03</span>
                <span className="font-label-caps text-label-caps bg-primary/20 text-primary px-2 py-0.5 rounded uppercase border border-primary/30">
                  PRIORITY: HIGH
                </span>
                <span className="font-data-mono-sm text-data-mono-sm text-outline-variant">•</span>
                <span className="font-label-caps text-label-caps text-tertiary uppercase">
                  BBMP PARKS, INDIRA CANTEENS &amp; BWSSB
                </span>
              </div>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${actionApprovals[3] ? 'bg-tertiary/10 text-tertiary border border-tertiary/30' : 'bg-[#262a35] text-outline border border-[#3d494c]'}`}>
                <span className={`w-2 h-2 rounded-full ${actionApprovals[3] ? 'bg-tertiary' : 'bg-outline animate-pulse'}`}></span>
                <span className="font-data-mono-sm text-data-mono-sm uppercase">
                  {actionApprovals[3] ? 'APPROVED [DIR. VANCE]' : 'PENDING SIGN-OFF'}
                </span>
              </div>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 font-bold">
              Activate 4 Civic Cooling Shelters / Indira Canteens in Zone 4 &amp; Dispatch Municipal Water Sprinklers
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
              Opens Kanteerava Pavilion, Domlur Community Hall, and Indira Canteens. Dispatches six mobile hydration vans to vulnerable transit stops and auto stands.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#0a0e18] p-2 rounded-lg mb-2 font-data-mono-sm text-data-mono-sm border border-[#262a35]">
              <div>
                <span className="text-outline block text-[10px] uppercase">COORDINATED BODIES:</span>
                <span className="text-on-surface">BBMP Welfare + BWSSB Water</span>
              </div>
              <div>
                <span className="text-outline block text-[10px] uppercase">RESOURCE COMMITTED:</span>
                <span className="text-on-surface">6 Hydration Vans, 24 Civic Stewards</span>
              </div>
              <div>
                <span className="text-outline block text-[10px] uppercase">EXECUTION WINDOW:</span>
                <span className="text-on-surface">T-minus 60 mins</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                <span className="font-data-mono-sm text-[11px] text-on-surface-variant">
                  BWSSB water pressure check: 4.2 bar nominal
                </span>
              </div>
              {!actionApprovals[3] && (
                <button
                  onClick={() => handleAuthorizeStep(3)}
                  className="bg-[#262a35] hover:bg-[#313540] text-on-surface font-data-mono-sm text-[11px] px-2.5 py-1 rounded transition-colors border border-[#3d494c]"
                >
                  AUTHORIZE STEP
                </button>
              )}
            </div>
          </div>

          {/* Action Card 04: Moderate */}
          <div className="bg-[#1c1f2a] rounded-xl p-3 transition-all shadow-md hover:bg-[#262a35]/90 border border-[#262a35]">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-data-mono-lg text-data-mono-lg text-primary font-bold">04</span>
                <span className="font-label-caps text-label-caps bg-[#262a35] text-outline px-2 py-0.5 rounded uppercase border border-[#3d494c]">
                  PRIORITY: MODERATE
                </span>
                <span className="font-data-mono-sm text-data-mono-sm text-outline-variant">•</span>
                <span className="font-label-caps text-label-caps text-outline uppercase">
                  BBMP SANITATION &amp; LOGISTICS
                </span>
              </div>
              <div className="flex items-center gap-1 bg-tertiary/10 text-tertiary px-2 py-0.5 rounded border border-tertiary/30">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                <span className="font-data-mono-sm text-data-mono-sm uppercase">APPROVED [AUTO-ROUTINE]</span>
              </div>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 font-bold">
              Reschedule Peenya &amp; Commercial District Waste Collection to 22:00 Night Shift
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
              Pulls 42 heavy collection diesel trucks off the streets during peak thermal afternoon hours, reducing street-level smog generation and traffic friction along emergency pathways.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#0a0e18] p-2 rounded-lg mb-2 font-data-mono-sm text-data-mono-sm border border-[#262a35]">
              <div>
                <span className="text-outline block text-[10px] uppercase">COORDINATED BODIES:</span>
                <span className="text-on-surface">BBMP Sanitation Bureau</span>
              </div>
              <div>
                <span className="text-outline block text-[10px] uppercase">RESOURCE COMMITTED:</span>
                <span className="text-on-surface">Shift schedule delta for 84 staff</span>
              </div>
              <div>
                <span className="text-outline block text-[10px] uppercase">EXECUTION WINDOW:</span>
                <span className="text-tertiary">Locked in (22:00 - 05:00 IST)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Reasoning Telemetry, Rationale & Governance Console (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* AI Rationale & Evidence Engine Accordion */}
          <div className="bg-[#171b26] rounded-xl p-3 shadow-md border border-[#262a35]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-tertiary text-[20px]">psychology</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Synthesis Rationale</span>
              </div>
              <span className="font-data-mono-sm text-data-mono-sm bg-[#1c1f2a] px-2 py-0.5 rounded text-primary border border-[#262a35]">
                AUDIT v4.9
              </span>
            </div>
            <p className="font-body-sm text-[12px] text-on-surface-variant mb-3 leading-normal">
              Empirical citations and sensor-backed justification generated by the municipal neural decision model:
            </p>

            {/* Accordion Item 1 */}
            <div
              className="bg-[#1c1f2a] rounded-lg p-2.5 mb-1.5 cursor-pointer border border-[#262a35]"
              onClick={() => setRationaleExpanded(prev => ({ ...prev, rat1: !prev.rat1 }))}
            >
              <div className="flex items-center justify-between">
                <span className="font-data-mono-sm text-data-mono-sm text-primary font-semibold">
                  1. Why HAL Substation 4 Decoupling?
                </span>
                <span className="material-symbols-outlined text-outline text-[18px]">
                  {rationaleExpanded.rat1 ? 'expand_less' : 'expand_more'}
                </span>
              </div>
              {rationaleExpanded.rat1 && (
                <div className="mt-1.5 pt-1.5 border-t border-[#262a35] font-body-sm text-[11px] text-on-surface-variant flex flex-col gap-1">
                  <p>• Historical BESCOM grid telemetry from April 2024 revealed Substation 4 oil temperature topped 118°C at 72 MW load.</p>
                  <p>• Current ambient heat index is 41.2°C; without proactive decoupling, transformer fault probability reaches 88% by 16:15 IST.</p>
                  <div className="mt-1 bg-[#0a0e18] p-1.5 rounded font-data-mono-sm text-[10px] text-tertiary border border-[#262a35]">
                    SRC: BESCOM_SCADA_HAL_S4_LOGS // NO_ANOMALY_FALSE_POSITIVE
                  </div>
                </div>
              )}
            </div>

            {/* Accordion Item 2 */}
            <div
              className="bg-[#1c1f2a] rounded-lg p-2.5 mb-1.5 cursor-pointer border border-[#262a35]"
              onClick={() => setRationaleExpanded(prev => ({ ...prev, rat2: !prev.rat2 }))}
            >
              <div className="flex items-center justify-between">
                <span className="font-data-mono-sm text-data-mono-sm text-on-surface font-semibold">
                  2. Uncertainty Index &amp; Variance
                </span>
                <span className="material-symbols-outlined text-outline text-[18px]">
                  {rationaleExpanded.rat2 ? 'expand_less' : 'expand_more'}
                </span>
              </div>
              {rationaleExpanded.rat2 && (
                <div className="mt-1.5 pt-1.5 border-t border-[#262a35] font-body-sm text-[11px] text-on-surface-variant flex flex-col gap-1">
                  <p>• <strong>Solar generation variance:</strong> 6% probability of isolated cirrus cloud cover dampening rooftop solar peak at 16:00.</p>
                  <p>• <strong>Traffic flow variance:</strong> ±4.2% vehicle compliance on BTP signal changes based on historical Silk Board corridor telemetry.</p>
                </div>
              )}
            </div>

            {/* Inline Visual: Uncertainty Gauge */}
            <div className="bg-[#0a0e18] p-2.5 rounded-lg mt-2 border border-[#262a35]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-label-caps text-label-caps text-outline uppercase">MODEL UNCERTAINTY BAND</span>
                <span className="font-data-mono-sm text-data-mono-sm text-tertiary">5.8% (VERY LOW)</span>
              </div>
              <div className="w-full bg-[#1c1f2a] h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-tertiary via-primary to-secondary h-full rounded-full" style={{ width: '6%' }}></div>
              </div>
            </div>
          </div>

          {/* Human Authorization & Governance Console */}
          <div className="bg-[#171b26] rounded-xl p-3 shadow-xl border border-[#262a35] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-error text-[20px]">fingerprint</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Officer Authorization</span>
              </div>
              <span className="font-data-mono-sm text-data-mono-sm text-error bg-error/10 px-2 py-0.5 rounded border border-error/30 font-bold">
                MANDATORY
              </span>
            </div>
            <p className="font-body-sm text-[12px] text-on-surface-variant">
              Affirming this coordinated response will commit 36 municipal personnel, re-route primary BESCOM grid relays, and broadcast public health advisories across all zones.
            </p>

            {/* Officer Credential Badge Details */}
            <div className="bg-[#1c1f2a] p-2.5 rounded-lg flex items-center justify-between border border-[#262a35]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">badge</span>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-body-sm text-on-surface font-semibold">Dir. Elena Vance</span>
                  <span className="font-data-mono-sm text-[10px] text-on-surface-variant">
                    BBMP_BTP_COMMAND // LEVEL 5
                  </span>
                </div>
              </div>
              <span className="font-data-mono-sm text-data-mono-sm text-tertiary bg-tertiary/10 px-2 py-0.5 rounded border border-tertiary/30">
                CREDENTIAL_ACTIVE
              </span>
            </div>

            {/* Electronic Signature Pin / Input */}
            <div className="flex flex-col gap-1">
              <label className="font-label-caps text-label-caps text-outline uppercase">
                ENTER DIGITAL PIN / SECURITY TOKEN
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={authPin}
                  onChange={(e) => setAuthPin(e.target.value)}
                  maxLength={8}
                  placeholder="••••••••"
                  className="bg-[#0a0e18] text-on-surface font-data-mono-lg text-data-mono-lg px-3 py-1.5 rounded-lg w-full focus:outline-none focus:border-primary border border-[#3d494c]"
                />
                <button
                  onClick={handleBiometric}
                  className="bg-[#262a35] hover:bg-[#313540] text-on-surface-variant font-data-mono-sm text-data-mono-sm px-2.5 py-2 rounded-lg flex-shrink-0 border border-[#3d494c]"
                >
                  USE BIOMETRIC
                </button>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={handleMasterDispatch}
                className={`w-full py-2.5 rounded-lg font-data-mono-lg text-data-mono-lg font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] ${
                  masterPlanDispatched
                    ? 'bg-tertiary text-on-tertiary cursor-default'
                    : 'bg-primary-container text-on-primary-container hover:brightness-110 active:scale-[0.99]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {masterPlanDispatched ? 'check_circle' : 'send_time_extension'}
                </span>
                {masterPlanDispatched ? 'PLAN DISPATCHED TO MESH' : 'APPROVE & DISPATCH PLAN'}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setToastMessage('Directives calibrator opened.')}
                  className="bg-[#1c1f2a] hover:bg-[#262a35] text-on-surface font-data-mono-sm text-data-mono-sm py-1.5 rounded-lg transition-colors border border-[#262a35]"
                >
                  MODIFY DIRECTIVES
                </button>
                <button
                  onClick={() => setToastMessage('Reverted to manual dispatcher queue.')}
                  className="bg-[#1c1f2a] hover:bg-error/20 text-error font-data-mono-sm text-data-mono-sm py-1.5 rounded-lg transition-colors border border-[#262a35]"
                >
                  REVERT TO MANUAL
                </button>
              </div>
            </div>

            {/* Audit Hash Trail */}
            <div className="font-data-mono-sm text-[10px] text-outline flex items-center justify-between border-t border-[#262a35] pt-1.5">
              <span>TX_SIGN_DIGEST:</span>
              <span className="text-on-surface-variant">0x7F9B...D3E14-BLR</span>
            </div>
          </div>

          {/* Live Resource Utilization Breakdown Mini-Widget */}
          <div className="bg-[#171b26] rounded-xl p-3 shadow-md border border-[#262a35]">
            <span className="font-label-caps text-label-caps text-outline uppercase block mb-2">
              DISPATCH READINESS INVENTORY (BENGALURU)
            </span>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between font-data-mono-sm text-data-mono-sm">
                <span className="text-on-surface-variant">Microgrid Substation Crews (BESCOM)</span>
                <span className="text-tertiary">3/3 Dispatched</span>
              </div>
              <div className="w-full bg-[#1c1f2a] h-1.5 rounded-full overflow-hidden">
                <div className="bg-tertiary h-full rounded-full" style={{ width: '100%' }}></div>
              </div>

              <div className="flex items-center justify-between font-data-mono-sm text-data-mono-sm">
                <span className="text-on-surface-variant">Traffic Signal Overrides (BTP Mesh)</span>
                <span className="text-primary">26/26 Node Ready</span>
              </div>
              <div className="w-full bg-[#1c1f2a] h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '100%' }}></div>
              </div>

              <div className="flex items-center justify-between font-data-mono-sm text-data-mono-sm">
                <span className="text-on-surface-variant">Municipal Mobile Hydration Vans (BBMP)</span>
                <span className="text-secondary">6/8 Allocated</span>
              </div>
              <div className="w-full bg-[#1c1f2a] h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-10 right-8 bg-[#262a35] text-on-surface px-4 py-2 rounded-lg shadow-2xl flex items-center gap-2 border border-tertiary z-50">
          <span className="material-symbols-outlined text-tertiary">check_circle</span>
          <span className="font-data-mono-sm text-data-mono-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
