import React, { useState } from 'react';
import { BengaluruTacticalMap } from './BengaluruTacticalMap';
import {
  BengaluruWeather,
  BengaluruAirQuality,
  TrafficCorridor,
  SubstationTelemetry,
  IncidentAlert
} from '../services/bengaluruData';

interface CityOverviewDashboardProps {
  weather: BengaluruWeather | null;
  airQuality: BengaluruAirQuality | null;
  corridors: TrafficCorridor[];
  substations: SubstationTelemetry[];
  incidents: IncidentAlert[];
  onNavigateTab: (tab: any) => void;
  activeScenario: string;
  setActiveScenario: (s: string) => void;
}

export const CityOverviewDashboard: React.FC<CityOverviewDashboardProps> = ({
  weather,
  airQuality,
  corridors,
  substations,
  incidents,
  onNavigateTab,
  activeScenario,
  setActiveScenario
}) => {
  const [selectedOverlay, setSelectedOverlay] = useState<'thermal' | 'substations' | 'cooling'>('thermal');
  const [dashboardView, setDashboardView] = useState<'map' | 'telemetry' | 'incidents' | 'all'>('map');
  const [selectedZoneModal, setSelectedZoneModal] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<'severity' | 'time'>('severity');
  const [chatInput, setChatInput] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [intercomNoticeOpen, setIntercomNoticeOpen] = useState(false);
  const [intercomMessage, setIntercomMessage] = useState(
    'MUNICIPAL BROADCAST [BBMP / BESCOM / BTP]: Level 3 Heat Advisory active across Bengaluru East & Mahadevapura. Industrial AC loads throttled 15%.'
  );
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Pre-calculated query datasets for Municipal Neural Synthesizer
  const queryData: Record<string, { title: string; desc: string; rec: string; sources: string[] }> = {
    'cool-centers': {
      title: 'BBMP Municipal Cooling & Hydration Centers: Real-Time Bengaluru Capacity Audit',
      desc: '174 Indira Canteens and 12 designated BBMP cooling pavilions are operational across Bengaluru. Zone 12 (Bommanahalli / HSR Layout Indira Canteen) has 412 available seating & water dispenser slots (48% capacity). Zone 4 (MG Road / Shivajinagar Civic Center) is at 84% capacity. Recommendation: Open auxiliary cooling canopies at Kanteerava Stadium and Domlur BBMP Grounds with 350-person hydration capacity.',
      rec: 'Dispatch 4 BMTC EV Feeder shuttle vans from Majestic Interchange to transport vulnerable pedestrians and senior citizens from Shivaji Nagar to Kanteerava Cooling Pavilion.',
      sources: ['#BBMP-IndiraCanteenMesh', '#Zone12IoT-Meters', '#BMTC-FeederFleet-Vajra']
    },
    'substation-hospital': {
      title: 'Impact Analysis: HAL Sub-Station 04 Partial Trip on Bengaluru Healthcare Infrastructure',
      desc: "If BESCOM HAL Sub-Station 04 experiences a thermal breaker trip within 45 minutes, St. John's Medical College Hospital and Bowring Hospital will switch to emergency auxiliary diesel generators within 6.8 seconds. However, external transit signals along Old Airport Road, Trinity Circle, and 100ft Road Indiranagar will suffer localized power dropouts, resulting in an estimated +18 minute ambulance transit delay for acute heatstroke ICU transfers.",
      rec: 'Pre-emptively spin up BESCOM Microgrid Battery Storage Node 2 (Indiranagar / Domlur) to shed 28 MW prior to the 15:30 afternoon peak.',
      sources: ['#BESCOM-SCADA-HAL-Sub04', '#StJohns-HL7-ERStream', '#BTP-TrafficCam-OldAirportRd']
    },
    'compare-response': {
      title: 'Comparative Model: Isolated Silos vs City OS Coordinated Response in Bengaluru',
      desc: 'Standard protocol operates via independent departmental phone trees between BESCOM, BBMP, BMRCL, and BTP with ~47m inter-agency delay. City OS automated telemetry coupling reduces cascade risk by 68%, synchronizes BTP green waves for cooling shuttles, and throttles municipal grid load 18 minutes before transformer breakers trip.',
      rec: 'Keep City OS Orchestration Mode locked in [AUTOMATIC_DELEGATION].',
      sources: ['#BTP-HistoricalTelemetry', '#CityOS-PolicyEngine', '#BengaluruCrossDeptMatrix']
    }
  };

  const [activeAiAnswer, setActiveAiAnswer] = useState<{
    title: string;
    desc: string;
    rec: string;
    sources: string[];
  }>(queryData['substation-hospital']);

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const query = chatInput.trim();
    setChatInput('');
    setIsSynthesizing(true);

    try {
      // 1. Try server-side simulation endpoint
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveAiAnswer({
          title: `Telemetry Directive: ${data.name || query}`,
          desc: `${data.whatHappened || ''} Traffic Delay: ${data.consequences?.traffic?.delay || '+15 mins'}. Medical Readiness: ${data.consequences?.healthEmergency?.hospitalName || 'District ER'}. Direct Operations Cost: ${data.budget?.operationalCost || '₹1.2 Lakhs'}.`,
          rec: `${data.cityActions?.[0]?.action || 'Synchronize city agency telemetry and coordinate green corridor.'}`,
          sources: [
            `#${data.zone?.split(' / ')[0]?.replace(/[^a-zA-Z0-9]/g, '') || 'BLR-Central'}`,
            `#${data.cityActions?.[0]?.dept?.split(' ')[0] || 'Police'}-Telemetry`,
            '#Bengaluru-CityOS-Mesh'
          ]
        });
        return;
      }
    } catch (_e) {
      // Fallback to local semantic generator
    } finally {
      setIsSynthesizing(false);
    }

    // Heuristic semantic synthesizer fallback
    const qLower = query.toLowerCase();
    if (qLower.includes('child') || qLower.includes('missing') || qLower.includes('cubbon')) {
      setActiveAiAnswer({
        title: `Protocol Amber: Missing Person Search at Cubbon Park Core`,
        desc: `Perimeter gates sealed across Kasturba Road and High Court entrances. 14 police patrol squads deploying thermal camera drones across dense Bal Bhavan wooded areas. Pedestrian exits subject to visual verification.`,
        rec: `Maintain perimeter gate lockdown; broadcast child description across Cubbon Park Namma Metro turnstiles and Hudson Circle BMTC bus stops.`,
        sources: ['#BengaluruPolice-CubbonPark', '#BBMP-Parks-BalBhavan', '#BMRCL-MetroSecurity']
      });
    } else if (qLower.includes('fire') || qLower.includes('commercial') || qLower.includes('flame')) {
      setActiveAiAnswer({
        title: `Level-2 Fire Containment: Commercial Street & Tasker Town`,
        desc: `6 KSFES fire tenders and aerial hydraulic platforms active on Ibrahim Sahib Street. BESCOM isolated Tasker Town 11kV transformer to forestall secondary electrical explosions. Bowring Hospital ER triage prepared.`,
        rec: `Maintain traffic diversion via Infantry Road and Dickenson Road; keep emergency water hydrant pressure boosted at 85 PSI.`,
        sources: ['#KSFES-FireCommand', '#BESCOM-Shivajinagar11kV', '#BowringHospital-Trauma']
      });
    } else if (qLower.includes('flood') || qLower.includes('hebbal') || qLower.includes('rain')) {
      setActiveAiAnswer({
        title: `Monsoon Inundation Mitigation: Hebbal Flyover & Bellary Road`,
        desc: `Hebbal lake overflow channel cleared by 6 high-power trailer pumps (15,000 LPM). Bellary Road airport traffic diverted via Thanisandra Main Road and Hennur ORR.`,
        rec: `Keep Thanisandra green corridor active; deploy auxiliary dewatering suction tankers along Esteem Mall underpass.`,
        sources: ['#BBMP-StormwaterDivision', '#BTP-AirportExpressway', '#BESCOM-SahakarNagar']
      });
    } else {
      setActiveAiAnswer({
        title: `Synthesized Municipal Directive: "${query}"`,
        desc: `Autonomous telemetry correlation validated across Bengaluru agencies. Field deployment dispatched with proportional operational budget and dynamic traffic signal phase adjustments.`,
        rec: `Synchronize cross-departmental dispatch between Bengaluru City Police, BBMP Ward Marshals, and BESCOM field engineers.`,
        sources: ['#BBMP-CentralMesh', '#BTP-TrafficOps', '#BengaluruCityOS-Core']
      });
    }
  };

  const handleBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setIntercomNoticeOpen(false);
    }, 1800);
  };

  // Temperature display formatted
  const currentTemp = weather ? weather.temperature : 34.2;
  const peakTemp = weather ? weather.peakExpectedTemp : 36.8;
  const aqiValue = airQuality ? airQuality.aqi : 84;

  return (
    <div className="flex flex-col w-full gap-4 pb-12">
      {/* Active Scenario Spotlight Banner */}
      <div className="w-full bg-[#171b26] rounded-xl p-4 shadow-xl border border-[#262a35] relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-error/5 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-60 h-60 rounded-full bg-primary/5 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-caps text-label-caps uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                ACTIVE SIMULATION DEMO
              </span>
              <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">
                SCENARIO_ID: // SIM-BLR-HEAT-994
              </span>
              <span className="font-data-mono-sm text-data-mono-sm text-error bg-[#262a35] px-2 py-0.5 rounded">
                CROSS-DEPT CASCADE SEVERITY: HIGH
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Metro Heatwave & Energy Grid Surge — Bengaluru
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Coordinated multi-vector telemetry stress test for Bengaluru. Elevated ambient core temps are initiating compound downstream loads across BESCOM Energy Distribution, St. John's / Bowring Trauma units, and Outer Ring Road Arterials.
            </p>
          </div>

          {/* Quick Scenario Switcher & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
            <div className="flex items-center bg-[#1c1f2a] p-1 rounded-lg gap-1 border border-[#262a35]">
              <button
                onClick={() => setActiveScenario('heatwave')}
                className={`px-3 py-1.5 rounded font-label-caps text-label-caps font-bold transition-all flex items-center gap-1 ${
                  activeScenario === 'heatwave'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-[#262a35]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                HEATWAVE (ACTIVE)
              </button>
              <button
                onClick={() => setActiveScenario('silkboard')}
                className={`px-3 py-1.5 rounded font-label-caps text-label-caps font-bold transition-all flex items-center gap-1 ${
                  activeScenario === 'silkboard'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-[#262a35]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">car_crash</span>
                SILK BOARD CHOKE
              </button>
              <button
                onClick={() => setActiveScenario('peenya')}
                className={`px-3 py-1.5 rounded font-label-caps text-label-caps font-bold transition-all flex items-center gap-1 ${
                  activeScenario === 'peenya'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-[#262a35]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
                PEENYA DEPOT OUTAGE
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('citywide-impact-chain')}
                className="px-3 py-2 rounded-lg bg-[#313540] hover:bg-[#353944] text-on-surface font-label-caps text-label-caps uppercase transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">account_tree</span>
                Impact Chain
              </button>
              <button
                onClick={() => onNavigateTab('ai-response-planner')}
                className="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-data-mono-lg text-data-mono-sm font-bold shadow-[0_0_16px_rgba(6,182,212,0.3)] transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">neurology</span>
                GENERATE AI PLAN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Urban Health Barometer & Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-7 gap-3">
        {/* Barometer Index Large Card */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 2xl:col-span-1 bg-[#171b26] rounded-xl p-3 shadow-md border border-[#262a35] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
              RESILIENCE BAROMETER
            </span>
            <span className="font-data-mono-sm text-data-mono-sm text-error bg-error-container/30 px-1.5 py-0.5 rounded">
              -6.2% STRESS
            </span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">74</span>
            <span className="font-headline-sm text-headline-sm text-outline-variant font-medium">/100</span>
          </div>
          <div className="space-y-1">
            <div className="w-full bg-[#313540] h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-error h-full rounded-full" style={{ width: '74%' }}></div>
            </div>
            <div className="flex items-center justify-between font-label-caps text-[9px] text-on-surface-variant">
              <span>NOMINAL: &gt;85</span>
              <span className="text-error">SURGE ADVISORY L3</span>
            </div>
          </div>
        </div>

        {/* Ambient Temp Telemetry Card */}
        <div className="bg-[#171b26] rounded-xl p-3 shadow-md border border-[#262a35] hover:bg-[#1c1f2a] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              AMBIENT TEMPERATURE
            </span>
            <span className="material-symbols-outlined text-[18px] text-error">thermostat</span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg text-headline-lg text-on-surface font-bold">{currentTemp}</span>
              <span className="font-data-mono-sm text-data-mono-sm text-outline">°C</span>
            </div>
            <div className="font-data-mono-sm text-data-mono-sm text-error flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[13px]">trending_up</span>
              Peak {peakTemp}°C @ 15:30 IST
            </div>
          </div>
          {/* Sparkline chart */}
          <div className="w-full h-7">
            <svg className="w-full h-full text-error" fill="none" viewBox="0 0 100 24">
              <path d="M0 20 Q 20 18, 40 12 T 70 8 T 100 2" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
              <path d="M0 20 Q 20 18, 40 12 T 70 8 T 100 2 L 100 24 L 0 24 Z" fill="currentColor" fillOpacity="0.12"></path>
            </svg>
          </div>
        </div>

        {/* Air Quality Index */}
        <div className="bg-[#171b26] rounded-xl p-3 shadow-md border border-[#262a35] hover:bg-[#1c1f2a] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              AIR QUALITY (AQI)
            </span>
            <span className="material-symbols-outlined text-[18px] text-secondary">air</span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg text-headline-lg text-on-surface font-bold">{aqiValue}</span>
              <span className="font-data-mono-sm text-data-mono-sm text-outline">AQI</span>
            </div>
            <div className="font-data-mono-sm text-data-mono-sm text-secondary flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[13px]">warning</span>
              KSPCB Silk Board / BTM Mesh
            </div>
          </div>
          <div className="w-full bg-[#313540] h-1.5 rounded-full overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: `${Math.min(100, Math.round(aqiValue / 2))}%` }}></div>
          </div>
        </div>

        {/* Traffic Grid Flow */}
        <div className="bg-[#171b26] rounded-xl p-3 shadow-md border border-[#262a35] hover:bg-[#1c1f2a] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              TRAFFIC GRID FLOW
            </span>
            <span className="material-symbols-outlined text-[18px] text-tertiary">traffic</span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg text-headline-lg text-on-surface font-bold">58%</span>
              <span className="font-data-mono-sm text-data-mono-sm text-outline">EFFICIENCY</span>
            </div>
            <div className="font-data-mono-sm text-data-mono-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[13px] text-error">fmd_bad</span>
              Choke: Silk Board / ORR
            </div>
          </div>
          <div className="w-full h-7">
            <svg className="w-full h-full text-tertiary" fill="none" viewBox="0 0 100 24">
              <path d="M0 8 Q 25 14, 50 10 T 80 18 T 100 16" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
            </svg>
          </div>
        </div>

        {/* Power Grid Demand */}
        <div className="bg-[#171b26] rounded-xl p-3 shadow-md border border-[#262a35] hover:bg-[#1c1f2a] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              POWER GRID LOAD
            </span>
            <span className="material-symbols-outlined text-[18px] text-primary">bolt</span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg text-headline-lg text-on-surface font-bold">3,640</span>
              <span className="font-data-mono-sm text-data-mono-sm text-outline">MW</span>
            </div>
            <div className="font-data-mono-sm text-data-mono-sm text-error flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[13px]">crisis_alert</span>
              91% BESCOM Peak (3 Subs Amber)
            </div>
          </div>
          <div className="w-full bg-[#313540] h-1.5 rounded-full overflow-hidden">
            <div className="bg-error h-full rounded-full" style={{ width: '91%' }}></div>
          </div>
        </div>

        {/* Emergency Health Capacity */}
        <div className="bg-[#171b26] rounded-xl p-3 shadow-md border border-[#262a35] hover:bg-[#1c1f2a] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              METRO ER OCCUPANCY
            </span>
            <span className="material-symbols-outlined text-[18px] text-error">local_hospital</span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg text-headline-lg text-on-surface font-bold">79%</span>
              <span className="font-data-mono-sm text-data-mono-sm text-outline">CAPACITY</span>
            </div>
            <div className="font-data-mono-sm text-data-mono-sm text-error flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[13px]">arrow_upward</span>
              St. John's & Bowring +34%
            </div>
          </div>
          <div className="w-full bg-[#313540] h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-tertiary via-secondary to-error h-full rounded-full" style={{ width: '79%' }}></div>
          </div>
        </div>

        {/* Sanitation & Municipal Waste Index */}
        <div className="bg-[#171b26] rounded-xl p-3 shadow-md border border-[#262a35] hover:bg-[#1c1f2a] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              WASTE OPS INTEGRITY
            </span>
            <span className="material-symbols-outlined text-[18px] text-tertiary">recycling</span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg text-headline-lg text-on-surface font-bold">88%</span>
              <span className="font-data-mono-sm text-data-mono-sm text-outline">CADENCE</span>
            </div>
            <div className="font-data-mono-sm text-data-mono-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[13px] text-secondary">schedule</span>
              BBMP Peenya 3 Routes Delayed
            </div>
          </div>
          <div className="w-full bg-[#313540] h-1.5 rounded-full overflow-hidden">
            <div className="bg-tertiary h-full rounded-full" style={{ width: '88%' }}></div>
          </div>
        </div>
      </div>

      {/* Console View Switcher to De-congest View */}
      <div className="flex items-center justify-between gap-3 bg-[#171b26] p-2.5 rounded-xl border border-[#262a35] shadow-md flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-label-caps text-[10px] text-outline uppercase font-bold tracking-wider pl-1">
            CONSOLE VIEW:
          </span>
          <div className="flex items-center gap-1 bg-[#1c1f2a] p-1 rounded-lg border border-[#262a35] flex-wrap">
            <button
              onClick={() => setDashboardView('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                dashboardView === 'map'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-white hover:bg-[#262a35]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
              <span>Tactical Map &amp; Spatial</span>
            </button>

            <button
              onClick={() => setDashboardView('telemetry')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                dashboardView === 'telemetry'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-white hover:bg-[#262a35]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Grid &amp; Traffic Corridors</span>
            </button>

            <button
              onClick={() => setDashboardView('incidents')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                dashboardView === 'incidents'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-white hover:bg-[#262a35]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">warning</span>
              <span>Incident Matrix &amp; Triage</span>
            </button>

            <button
              onClick={() => setDashboardView('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                dashboardView === 'all'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-white hover:bg-[#262a35]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">dashboard</span>
              <span>All Consoles</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('user-help-guide')}
            className="bg-[#262a35] hover:bg-primary hover:text-on-primary text-primary px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border border-[#3d494c] transition-all cursor-pointer font-bold shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">help_center</span>
            <span>How to Use / Features Guide</span>
          </button>
        </div>
      </div>

      {/* Real-Time Multi-Feed Split Grid (Tactical Map) */}
      {(dashboardView === 'map' || dashboardView === 'all') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left 8 cols: Live City Sensor Map Summary Widget */}
        <div className="lg:col-span-8 bg-[#171b26] rounded-xl p-3 shadow-md border border-[#262a35] flex flex-col justify-between gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">radar</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                Spatial Telemetry Heatmap & Zone Nodes
              </h2>
              <span className="px-2 py-0.5 rounded bg-[#1c1f2a] font-data-mono-sm text-data-mono-sm text-tertiary flex items-center gap-1 border border-[#262a35]">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                LIVE BENGALURU MESH
              </span>
            </div>
            {/* Active Filter Buttons */}
            <div className="flex items-center gap-1 bg-[#1c1f2a] p-0.5 rounded-lg border border-[#262a35]">
              <button
                onClick={() => setSelectedOverlay('thermal')}
                className={`px-2.5 py-1 rounded font-data-mono-sm text-data-mono-sm transition-all ${
                  selectedOverlay === 'thermal'
                    ? 'bg-[#262a35] text-primary font-bold'
                    : 'text-on-surface-variant hover:bg-[#262a35]'
                }`}
              >
                Thermal Overlay
              </button>
              <button
                onClick={() => setSelectedOverlay('substations')}
                className={`px-2.5 py-1 rounded font-data-mono-sm text-data-mono-sm transition-all ${
                  selectedOverlay === 'substations'
                    ? 'bg-[#262a35] text-primary font-bold'
                    : 'text-on-surface-variant hover:bg-[#262a35]'
                }`}
              >
                BESCOM Substations
              </button>
              <button
                onClick={() => setSelectedOverlay('cooling')}
                className={`px-2.5 py-1 rounded font-data-mono-sm text-data-mono-sm transition-all ${
                  selectedOverlay === 'cooling'
                    ? 'bg-[#262a35] text-primary font-bold'
                    : 'text-on-surface-variant hover:bg-[#262a35]'
                }`}
              >
                Cooling / Indira Canteens
              </button>
            </div>
          </div>

          {/* Interactive GIS Geo Canvas */}
          <BengaluruTacticalMap
            height="420px"
            activeLayer={selectedOverlay}
            onSelectZone={(id) => setSelectedZoneModal(`zone-${id}`)}
            interactive={true}
            showControls={true}
          />

          {/* Quick zone cards footer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <div className="bg-[#1c1f2a] p-2.5 rounded-lg flex items-center justify-between border border-[#262a35]">
              <div>
                <div className="font-data-mono-sm text-data-mono-sm text-on-surface font-bold">
                  Zone 4 (Central Core - MG Rd)
                </div>
                <div className="font-body-sm text-[11px] text-error">
                  BESCOM HAL Substation 04 Overload risk
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('map-and-zone-explorer')}
                className="p-1 text-outline hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </button>
            </div>
            <div className="bg-[#1c1f2a] p-2.5 rounded-lg flex items-center justify-between border border-[#262a35]">
              <div>
                <div className="font-data-mono-sm text-data-mono-sm text-on-surface font-bold">
                  Zone 7 (Industrial - Peenya)
                </div>
                <div className="font-body-sm text-[11px] text-secondary">
                  Coordinated 15% Industrial AC Curtailment
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('map-and-zone-explorer')}
                className="p-1 text-outline hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </button>
            </div>
            <div className="bg-[#1c1f2a] p-2.5 rounded-lg flex items-center justify-between border border-[#262a35]">
              <div>
                <div className="font-data-mono-sm text-data-mono-sm text-on-surface font-bold">
                  Zone 12 (Tech South - Koramangala)
                </div>
                <div className="font-body-sm text-[11px] text-tertiary">
                  3,200/4,500 Indira Canteen Hydration Cap
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('map-and-zone-explorer')}
                className="p-1 text-outline hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 cols: Real-Time Department Telemetry Stream Feed */}
        <div className="lg:col-span-4 bg-[#171b26] rounded-xl p-3 shadow-md border border-[#262a35] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[20px]">dynamic_feed</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Cross-Agency Live Wire</h2>
            </div>
            <span className="font-data-mono-sm text-[10px] text-on-surface-variant flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
              STREAM SYNC
            </span>
          </div>

          {/* Feed entries scroll list */}
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-[460px] pr-1">
            {/* Item: BESCOM Energy Grid Ops */}
            <div className="bg-[#1c1f2a] p-2.5 rounded-lg hover:bg-[#262a35] transition-all border border-[#262a35]">
              <div className="flex items-center justify-between font-data-mono-sm text-[11px]">
                <span className="font-bold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">bolt</span> BESCOM POWER OPS
                </span>
                <span className="text-on-surface-variant">14:26:08 IST</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface mt-1 leading-snug">
                HAL Sub-Station 04 transformer temp hit 88.4°C. Automated load shedding initiated for BBMP decorative lighting and non-essential fountains.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-label-caps text-[9px] bg-[#313540] px-1.5 py-0.5 rounded text-error">
                  TRANSFORMER TEMP ALERT
                </span>
                <span className="font-data-mono-sm text-[10px] text-outline">LATENCY: 8ms</span>
              </div>
            </div>

            {/* Item: Health Services DHS / BBMP */}
            <div className="bg-[#1c1f2a] p-2.5 rounded-lg hover:bg-[#262a35] transition-all border border-[#262a35]">
              <div className="flex items-center justify-between font-data-mono-sm text-[11px]">
                <span className="font-bold text-error flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">emergency</span> PUBLIC HEALTH SVCS
                </span>
                <span className="text-on-surface-variant">14:24:41 IST</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface mt-1 leading-snug">
                St. John's & Bowring reporting acute heat stroke admissions: 18 patients in 45 mins. Requesting secondary triage unit deploy and mobile hydration vans.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-label-caps text-[9px] bg-error-container text-on-error-container px-1.5 py-0.5 rounded">
                  Triage Stage 2
                </span>
                <span className="font-data-mono-sm text-[10px] text-tertiary">DISPATCHED #TR-08</span>
              </div>
            </div>

            {/* Item: Namma Metro & BTP */}
            <div className="bg-[#1c1f2a] p-2.5 rounded-lg hover:bg-[#262a35] transition-all border border-[#262a35]">
              <div className="flex items-center justify-between font-data-mono-sm text-[11px]">
                <span className="font-bold text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">subway</span> BMRCL NAMMA METRO
                </span>
                <span className="text-on-surface-variant">14:21:19 IST</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface mt-1 leading-snug">
                Thermal rail expansion speed limit imposed on Purple Line elevated viaduct (MG Road to Baiyappanahalli). Speed throttled to 40 km/h.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-label-caps text-[9px] bg-[#313540] px-1.5 py-0.5 rounded text-on-surface-variant">
                  SPEED SLOWDOWN
                </span>
                <span className="font-data-mono-sm text-[10px] text-outline">EST. HEADWAY +11m</span>
              </div>
            </div>

            {/* Item: BBMP Environment Services */}
            <div className="bg-[#1c1f2a] p-2.5 rounded-lg hover:bg-[#262a35] transition-all border border-[#262a35]">
              <div className="flex items-center justify-between font-data-mono-sm text-[11px]">
                <span className="font-bold text-tertiary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">eco</span> BBMP ENVIRONMENT
                </span>
                <span className="text-on-surface-variant">14:18:02 IST</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface mt-1 leading-snug">
                Automated urban misting canopy clusters activated across Majestic KBS concourse & MG Road boulevard.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-label-caps text-[9px] bg-tertiary-container/30 text-tertiary px-1.5 py-0.5 rounded">
                  MISTING RUNNING
                </span>
                <span className="font-data-mono-sm text-[10px] text-outline">24 CANOPIES ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Quick Broadcast Command Button */}
          <div className="pt-2 mt-1">
            <button
              onClick={() => setIntercomNoticeOpen(true)}
              className="w-full py-2 bg-[#262a35] hover:bg-[#313540] text-on-surface font-label-caps text-label-caps uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-[#3d494c]"
            >
              <span className="material-symbols-outlined text-[16px]">campaign</span>
              Broadcast Incident Intercom Notice
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Grid & Traffic Telemetry Console */}
      {(dashboardView === 'telemetry' || dashboardView === 'all') && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-1 border-b border-[#262a35]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">alt_route</span>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Bengaluru Traffic Corridors &amp; BESCOM Power Grid Telemetry
                </h2>
                <p className="font-body-sm text-[12px] text-on-surface-variant">
                  Live OSRM commute routing and SCADA receiving substation load indicators
                </p>
              </div>
            </div>
            <span className="font-data-mono-sm text-[11px] text-tertiary bg-tertiary/10 border border-tertiary/30 px-2 py-0.5 rounded">
              7 CORRIDORS • 6 SUBSTATIONS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: BTP Traffic Corridors */}
            <div className="bg-[#171b26] rounded-xl p-4 shadow-md border border-[#262a35] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">traffic</span>
                  <h3 className="font-headline-sm text-sm text-white font-bold">
                    BTP Arterial Traffic Congestion (OSRM Live)
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-error font-bold">SILK BOARD APEX</span>
              </div>

              <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto pr-1">
                {corridors.map((c) => (
                  <div
                    key={c.id}
                    className="bg-[#1c1f2a] p-3 rounded-lg border border-[#262a35] hover:border-[#3d494c] transition-all flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-white font-bold truncate max-w-[240px]">
                        {c.name}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          c.congestionLevel === 'CRITICAL'
                            ? 'bg-error-container text-on-error-container'
                            : c.congestionLevel === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-primary/20 text-primary'
                        }`}
                      >
                        {c.congestionLevel}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-[#0a0e18] p-2 rounded text-[10px] font-mono">
                      <div>
                        <span className="text-outline uppercase block">CURRENT:</span>
                        <span className="text-error font-bold">{c.currentMinutes} MIN</span>
                      </div>
                      <div>
                        <span className="text-outline uppercase block">DELAY:</span>
                        <span className="text-amber-400 font-bold">+{c.delayMinutes} MIN</span>
                      </div>
                      <div>
                        <span className="text-outline uppercase block">SPEED:</span>
                        <span className="text-primary font-bold">{c.speedKmph} KM/H</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-on-surface-variant">
                      <span className="truncate">Hotspot: {c.hotspot}</span>
                      <span className="text-outline">{c.distanceKm} km</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: BESCOM Power Substations */}
            <div className="bg-[#171b26] rounded-xl p-4 shadow-md border border-[#262a35] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">bolt</span>
                  <h3 className="font-headline-sm text-sm text-white font-bold">
                    BESCOM Receiving Substations SCADA
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-tertiary font-bold">3,420 MW GRID</span>
              </div>

              <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto pr-1">
                {substations.map((s) => (
                  <div
                    key={s.id}
                    className="bg-[#1c1f2a] p-3 rounded-lg border border-[#262a35] hover:border-[#3d494c] transition-all flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs text-white font-bold">{s.name}</span>
                        <span className="text-outline text-[10px] font-mono ml-2">({s.voltageClass})</span>
                      </div>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          s.loadPercentage >= 90
                            ? 'bg-error-container text-on-error-container'
                            : s.loadPercentage >= 80
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-tertiary/20 text-tertiary'
                        }`}
                      >
                        {s.loadPercentage}% LOAD
                      </span>
                    </div>

                    <div className="w-full bg-[#0a0e18] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          s.loadPercentage >= 90 ? 'bg-error' : s.loadPercentage >= 80 ? 'bg-amber-400' : 'bg-tertiary'
                        }`}
                        style={{ width: `${s.loadPercentage}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-[#0a0e18] p-2 rounded text-[10px] font-mono">
                      <div>
                        <span className="text-outline uppercase block">LOAD:</span>
                        <span className="text-on-surface font-bold">{s.currentLoadMw} / {s.capacityMw} MW</span>
                      </div>
                      <div>
                        <span className="text-outline uppercase block">TRANSFORMER:</span>
                        <span className={s.transformerTempC >= 80 ? 'text-error font-bold' : 'text-primary font-bold'}>
                          {s.transformerTempC}°C
                        </span>
                      </div>
                      <div>
                        <span className="text-outline uppercase block">COOLING:</span>
                        <span className="text-secondary font-bold truncate">{s.coolingStatus}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Intercom Modal */}
      {intercomNoticeOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 max-w-lg w-full shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#262a35] pb-2">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined">campaign</span>
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  Bengaluru Municipal Intercom Broadcast
                </span>
              </div>
              <button
                onClick={() => setIntercomNoticeOpen(false)}
                className="text-on-surface-variant hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-body-sm text-on-surface-variant">
              This message will broadcast instantly over the BBMP Digital Signboards, BMRCL Metro station PAs, and BTP Traffic overhead matrix signs.
            </p>
            <textarea
              value={intercomMessage}
              onChange={(e) => setIntercomMessage(e.target.value)}
              className="w-full h-24 bg-[#0a0e18] border border-[#3d494c] rounded-lg p-2.5 font-data-mono-sm text-data-mono-sm text-on-surface focus:outline-none focus:border-primary"
            ></textarea>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIntercomNoticeOpen(false)}
                className="px-3 py-1.5 bg-[#262a35] hover:bg-[#313540] text-on-surface rounded-lg text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handleBroadcast}
                className="px-4 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-mono font-bold flex items-center gap-1 hover:brightness-110"
              >
                <span className="material-symbols-outlined text-[14px]">send</span>
                {broadcastSent ? 'BROADCAST TRANSMITTED' : 'TRANSMIT BROADCAST'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Incidents & Rapid AI Warnings Table */}
      {(dashboardView === 'incidents' || dashboardView === 'all') && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <div className="bg-[#171b26] rounded-xl p-3 shadow-md border border-[#262a35] flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-[22px]">warning</span>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                Active Incidents & Cross-Department Cascade Matrix — Bengaluru
              </h2>
              <p className="font-body-sm text-[12px] text-on-surface-variant">
                Live correlated Bengaluru events with AI cascade trajectory scores and municipal action triggers
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-label-caps text-outline uppercase">SORT BY:</span>
            <button
              onClick={() => setSortKey('severity')}
              className={`px-2.5 py-1 rounded font-data-mono-sm text-data-mono-sm transition-all ${
                sortKey === 'severity'
                  ? 'bg-[#1c1f2a] text-primary border border-[#262a35]'
                  : 'hover:bg-[#1c1f2a] text-on-surface-variant'
              }`}
            >
              Severity Index
            </button>
            <button
              onClick={() => setSortKey('time')}
              className={`px-2.5 py-1 rounded font-data-mono-sm text-data-mono-sm transition-all ${
                sortKey === 'time'
                  ? 'bg-[#1c1f2a] text-primary border border-[#262a35]'
                  : 'hover:bg-[#1c1f2a] text-on-surface-variant'
              }`}
            >
              Time Code
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead>
              <tr className="bg-[#313540]/60 text-outline uppercase font-label-caps text-label-caps">
                <th className="py-2.5 px-3 rounded-l">Incident Code</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Cascade Risk</th>
                <th className="py-2.5 px-3">Zone / Location</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">AI Confidence</th>
                <th className="py-2.5 px-3">Verification</th>
                <th className="py-2.5 px-3 text-right rounded-r">Action Triggers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3d494c]/20">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-[#1c1f2a]/50 transition-colors">
                  <td className="py-3 px-3 font-data-mono-sm text-data-mono-sm text-primary font-bold">
                    {inc.code}
                  </td>
                  <td className="py-3 px-3 flex items-center gap-1.5 text-on-surface">
                    <span className={`material-symbols-outlined text-[16px] ${inc.deptColor}`}>
                      {inc.deptIcon}
                    </span>
                    <span>{inc.department}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 text-error font-data-mono-sm text-data-mono-sm">
                      <span className="material-symbols-outlined text-[14px]">call_split</span>
                      <span>{inc.cascadeSilos}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-data-mono-sm text-data-mono-sm text-on-surface-variant">
                    {inc.zone}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded ${inc.severityClass} font-label-caps text-[10px] font-bold uppercase`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-data-mono-sm text-data-mono-sm text-tertiary">
                        {inc.aiConfidence}%
                      </span>
                      <div className="w-12 bg-[#262a35] h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-tertiary h-full"
                          style={{ width: `${inc.aiConfidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-data-mono-sm text-[11px] text-tertiary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    <span className="truncate max-w-[140px]">{inc.verificationSource}</span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onNavigateTab('ai-response-planner')}
                        className="px-2.5 py-1 bg-[#262a35] hover:bg-[#313540] text-on-surface rounded font-data-mono-sm text-[11px] transition-colors"
                      >
                        {inc.actionTriggers.primary}
                      </button>
                      <button
                        onClick={() => onNavigateTab('ai-predictions-and-alerts')}
                        className="px-2.5 py-1 bg-error-container hover:bg-error text-on-error-container hover:text-on-error rounded font-data-mono-sm text-[11px] font-bold transition-colors"
                      >
                        {inc.actionTriggers.secondary}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embedded City AI Assistant Quick Drawer / Terminal */}
      <div className="bg-[#171b26] rounded-xl p-3 shadow-lg border border-[#262a35] flex flex-col gap-3 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#262a35] pb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[18px]">neurology</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                Municipal Neural Synthesizer
              </h2>
              <span className="font-data-mono-sm text-data-mono-sm text-primary">
                CITY_OS_LLM // ACTIVE BENGALURU TELEMETRY INGESTION (v4.9)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-label-caps text-tertiary bg-tertiary-container/20 px-2 py-0.5 rounded flex items-center gap-1 border border-tertiary/30">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              REALTIME BENGALURU CONTEXT SYNCED
            </span>
          </div>
        </div>

        {/* Suggested Quick Municipal Prompts */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-label-caps text-label-caps text-outline uppercase mr-1">
            PRE-CALCULATED QUERIES:
          </span>
          <button
            onClick={() => setActiveAiAnswer(queryData['cool-centers'])}
            className="px-3 py-1.5 bg-[#1c1f2a] hover:bg-[#262a35] text-on-surface font-data-mono-sm text-data-mono-sm rounded-lg transition-all flex items-center gap-1 border border-[#262a35]"
          >
            <span className="material-symbols-outlined text-[14px] text-primary">ac_unit</span>
            Which cooling centers & Indira Canteens have available capacity?
          </button>
          <button
            onClick={() => setActiveAiAnswer(queryData['substation-hospital'])}
            className="px-3 py-1.5 bg-[#1c1f2a] hover:bg-[#262a35] text-on-surface font-data-mono-sm text-data-mono-sm rounded-lg transition-all flex items-center gap-1 border border-[#262a35]"
          >
            <span className="material-symbols-outlined text-[14px] text-error">power_off</span>
            How will HAL Substation 4 trip impact St. John's & Bowring ER?
          </button>
          <button
            onClick={() => setActiveAiAnswer(queryData['compare-response'])}
            className="px-3 py-1.5 bg-[#1c1f2a] hover:bg-[#262a35] text-on-surface font-data-mono-sm text-data-mono-sm rounded-lg transition-all flex items-center gap-1 border border-[#262a35]"
          >
            <span className="material-symbols-outlined text-[14px] text-tertiary">compare_arrows</span>
            Compare standard response vs City OS coordinated response
          </button>
        </div>

        {/* Dynamic Answer Drawer Box */}
        <div className="bg-[#0a0e18] p-3 rounded-lg flex flex-col gap-2 relative border border-[#262a35]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 font-data-mono-sm text-data-mono-sm text-primary">
              <span className="material-symbols-outlined text-[16px]">smart_toy</span>
              <span>CITY AI REASONING OUTPUT:</span>
            </div>
            <span className="font-data-mono-sm text-[10px] text-outline">
              LATENCY: 420ms | CONFIDENCE: 97.2% | BENGALURU MESH
            </span>
          </div>

          {isSynthesizing ? (
            <div className="py-6 flex items-center justify-center gap-2 text-primary font-mono text-xs">
              <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
              <span>Synthesizing multi-vector Bengaluru telemetry directive...</span>
            </div>
          ) : (
            <div className="font-body-sm text-body-sm text-on-surface leading-relaxed">
              <p className="font-semibold text-primary mb-1">{activeAiAnswer.title}</p>
              <p className="text-on-surface-variant">{activeAiAnswer.desc}</p>
              <div className="mt-2 p-2.5 bg-[#1c1f2a] rounded flex flex-col md:flex-row md:items-center justify-between gap-2 border border-[#262a35]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">auto_fix_high</span>
                  <span className="font-body-sm text-[12px] text-on-surface">
                    Recommendation: {activeAiAnswer.rec}
                  </span>
                </div>
                <button
                  onClick={() => onNavigateTab('ai-response-planner')}
                  className="px-3 py-1 bg-primary text-on-primary font-label-caps text-label-caps uppercase rounded font-bold hover:brightness-110 transition-colors flex-shrink-0"
                >
                  Apply AI Mitigation
                </button>
              </div>
            </div>
          )}

          {/* Cited evidence nodes */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#262a35] text-outline font-data-mono-sm text-[10px]">
            <span className="uppercase font-label-caps text-[9px]">Cited Bengaluru Telemetry Sources:</span>
            {activeAiAnswer.sources.map((src, i) => (
              <span key={i} className="bg-[#1c1f2a] px-2 py-0.5 rounded text-on-surface-variant border border-[#262a35]">
                {src}
              </span>
            ))}
          </div>
        </div>

        {/* Live Interactive Prompt Input */}
        <div className="flex items-center gap-2 bg-[#1c1f2a] px-3 py-2 rounded-lg border border-[#262a35] focus-within:border-primary">
          <span className="material-symbols-outlined text-outline text-[20px]">terminal</span>
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
            className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder-outline focus:outline-none"
            placeholder="Type a municipal directive or query telemetry (e.g. 'Reroute BMTC buses away from Silk Board and Bellandur')..."
            type="text"
          />
          <button
            onClick={handleSendChat}
            className="px-3 py-1 bg-primary text-on-primary font-data-mono-sm text-data-mono-sm rounded font-bold hover:brightness-110 transition-colors flex items-center gap-1 shrink-0"
          >
            <span>TRANSMIT</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>
      </div>
      )}
    </div>
  );
};
