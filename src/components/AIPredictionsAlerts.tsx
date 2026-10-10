import React, { useState } from 'react';
import { BengaluruWeather, BengaluruAirQuality } from '../services/bengaluruData';

interface AIPredictionsAlertsProps {
  weather: BengaluruWeather | null;
  airQuality: BengaluruAirQuality | null;
  onNavigateTab: (tab: any) => void;
}

export const AIPredictionsAlerts: React.FC<AIPredictionsAlertsProps> = ({
  weather,
  airQuality,
  onNavigateTab
}) => {
  const [authorizedPlaybooks, setAuthorizedPlaybooks] = useState<{ [key: string]: boolean }>({});
  const [paramModalOpen, setParamModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handlePreAuthorize = (playbookId: string, title: string) => {
    setAuthorizedPlaybooks(prev => ({ ...prev, [playbookId]: true }));
    setToastMessage(`Playbook ${title} successfully pre-authorized and dispatched to Bengaluru mesh.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,STRESSOR_ORIGIN,ENERGY_GRID,HEALTHCARE_EMS,TRANSIT_ROADS,PUBLIC_WORKS,WATER_BWSSB\n' +
      'Energy & Municipal Grid,--,0.94,0.78,0.52,0.81\n' +
      'Healthcare & EMS,0.18,--,0.88,0.24,0.15\n' +
      'Transit & Corridors,0.44,0.91,--,0.76,0.11\n' +
      'Public Works & Sanitation,0.12,0.61,0.55,--,0.32\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Bengaluru_Risk_Correlation_Matrix.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentTemp = weather ? weather.temperature : 34.2;

  return (
    <div className="flex flex-col w-full gap-4 pb-12">
      {/* Mission Verification Protocol Notice */}
      <div className="relative overflow-hidden rounded-lg bg-[#262a35] px-4 py-2.5 shadow-md border border-[#3d494c]">
        <div className="absolute inset-y-0 left-0 w-1 bg-primary"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pl-1">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
              verified_user
            </span>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary">
                MUNICIPAL AI SAFETY MANDATE // PROTOCOL 104-B
              </span>
              <span className="font-body-sm text-body-sm text-on-surface">
                All Bengaluru AI forecasts operate under probabilistic thresholds. Human municipal officer sign-off is strictly enforced prior to grid re-routing or automated asset dispatch.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
            <span className="font-data-mono-sm text-data-mono-sm text-outline">ENGINE RUNTIME:</span>
            <span className="font-data-mono-sm text-data-mono-sm text-tertiary">
              NEURAL_CORE_v4.9 [NOMINAL]
            </span>
          </div>
        </div>
      </div>

      {/* Telemetry Summary Metric Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div className="relative overflow-hidden rounded-xl bg-[#1c1f2a] p-3 shadow-sm border border-[#262a35] group hover:bg-[#262a35] transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-caps text-label-caps uppercase text-outline">ACTIVE SIGNALS</span>
            <span className="flex items-center gap-1 font-data-mono-sm text-data-mono-sm text-error bg-error-container/40 px-1.5 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
              REAL-TIME
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display-lg text-display-lg text-on-surface font-bold">03</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Active Models</span>
          </div>
          <p className="font-data-mono-sm text-data-mono-sm text-outline-variant mt-1">
            Bengaluru telemetry nodes sampled: 12,480/sec
          </p>
        </div>

        {/* Metric 2 */}
        <div className="relative overflow-hidden rounded-xl bg-[#1c1f2a] p-3 shadow-sm border border-[#262a35] group hover:bg-[#262a35] transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-caps text-label-caps uppercase text-outline">
              CRITICAL CASCADE RISK
            </span>
            <span className="font-data-mono-sm text-data-mono-sm bg-error/20 text-error px-1.5 py-0.5 rounded font-bold">
              ALPHA SURGE
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display-lg text-display-lg text-error font-bold">01</span>
            <span className="font-body-sm text-body-sm text-error/80">Sector Imminent</span>
          </div>
          <p className="font-data-mono-sm text-data-mono-sm text-outline-variant mt-1">
            HAL Substation 4 (Indiranagar / MG Rd Core)
          </p>
        </div>

        {/* Metric 3 */}
        <div className="relative overflow-hidden rounded-xl bg-[#1c1f2a] p-3 shadow-sm border border-[#262a35] group hover:bg-[#262a35] transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-caps text-label-caps uppercase text-outline">MODEL ACCURACY (30D)</span>
            <span className="font-data-mono-sm text-data-mono-sm text-tertiary flex items-center">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>+1.4%
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display-lg text-display-lg text-tertiary font-bold">94.2%</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Ground Validated</span>
          </div>
          <p className="font-data-mono-sm text-data-mono-sm text-outline-variant mt-1">
            Verified across 48 Bengaluru municipal incidents
          </p>
        </div>

        {/* Metric 4 */}
        <div className="relative overflow-hidden rounded-xl bg-[#1c1f2a] p-3 shadow-sm border border-[#262a35] group hover:bg-[#262a35] transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="font-label-caps text-label-caps uppercase text-outline">
              EST. MITIGATION WINDOW
            </span>
            <span className="font-data-mono-sm text-data-mono-sm text-primary font-bold">T-MINUS</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display-lg text-display-lg text-primary font-bold">42m</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Remaining</span>
          </div>
          <p className="font-data-mono-sm text-data-mono-sm text-outline-variant mt-1">
            Before AC commercial peak lock-in (15:30)
          </p>
        </div>
      </div>

      {/* Deep Prediction Alert Cards Section */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">warning</span>
            <span className="font-headline-sm text-headline-sm text-on-surface">
              Active Predictive Threat Vectors — Bengaluru Core
            </span>
            <span className="font-data-mono-sm text-data-mono-sm bg-[#262a35] px-2 py-0.5 rounded text-primary border border-[#3d494c]">
              SCENARIO: HEATWAVE ALPHA ({currentTemp}°C AMBIENT)
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button className="bg-[#262a35] hover:bg-[#353944] text-on-surface px-2.5 py-1 rounded font-data-mono-sm text-data-mono-sm flex items-center gap-1 transition-colors border border-[#3d494c]">
              <span className="material-symbols-outlined text-[16px]">tune</span> Filter Confidence &gt; 70%
            </button>
          </div>
        </div>

        {/* 3 High Density Technical Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Card 1: Critical Heat & Grid */}
          <div className="flex flex-col justify-between rounded-xl bg-[#171b26] p-3 shadow-md border-l-4 border-l-error border border-[#262a35] relative overflow-hidden group">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <span className="font-label-caps text-label-caps bg-error-container/60 text-error px-1.5 py-0.5 rounded tracking-widest uppercase font-bold">
                  CRITICAL CASCADE RISK
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-data-mono-sm text-data-mono-sm text-error font-bold">94% CONFIDENCE</span>
                  <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                </div>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface leading-tight font-bold">
                  Cascading Grid Failure & St. John's Hospital Surge
                </h3>
                <span className="font-data-mono-sm text-data-mono-sm text-primary">
                  East / Indiranagar Core // Sector 01-A HAL Substation
                </span>
              </div>
              <div className="bg-[#0a0e18]/80 rounded p-2 flex flex-col gap-1 border border-[#262a35]">
                <span className="font-label-caps text-label-caps text-outline uppercase">
                  ROOT CAUSE HEURISTIC:
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Continuous {currentTemp}°C ambient load driving extreme commercial and tech park AC consumption colliding with HAL Substation 4 cooling heat-exchanger pump cavitation.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-1 pt-1">
                <div className="bg-[#1c1f2a] p-1.5 rounded border border-[#262a35]">
                  <span className="font-label-caps text-label-caps text-outline block">PROJECTED DEFICIT</span>
                  <span className="font-data-mono-lg text-data-mono-lg text-error font-bold">-140 MW Load</span>
                </div>
                <div className="bg-[#1c1f2a] p-1.5 rounded border border-[#262a35]">
                  <span className="font-label-caps text-label-caps text-outline block">CRITICAL AT-RISK</span>
                  <span className="font-data-mono-lg text-data-mono-lg text-on-surface font-bold">St. John's ICU</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 flex items-center justify-between border-t border-[#262a35]">
              <span className="font-data-mono-sm text-data-mono-sm text-outline">Lead Time: 34 mins</span>
              <button
                onClick={() => handlePreAuthorize('alpha-01', 'ALPHA-01: Microgrid Isolate St. John\'s')}
                className="bg-primary text-on-primary font-data-mono-sm text-data-mono-sm font-bold px-2.5 py-1.5 rounded hover:brightness-110 transition-all flex items-center gap-1 shadow-sm"
              >
                DISPATCH INTERVENTION
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Card 2: High Traffic & Asphalt */}
          <div className="flex flex-col justify-between rounded-xl bg-[#171b26] p-3 shadow-md border-l-4 border-l-primary border border-[#262a35] relative overflow-hidden group">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <span className="font-label-caps text-label-caps bg-primary/20 text-primary px-1.5 py-0.5 rounded tracking-widest uppercase font-bold">
                  HIGH MOBILITY WARNING
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-data-mono-sm text-data-mono-sm text-primary font-bold">88% CONFIDENCE</span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                </div>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface leading-tight font-bold">
                  Hosur Road & Silk Board Softening & Stalls
                </h3>
                <span className="font-data-mono-sm text-data-mono-sm text-primary">
                  Outer Ring Road & Hosur Elevated Tollway // KM 12-24
                </span>
              </div>
              <div className="bg-[#0a0e18]/80 rounded p-2 flex flex-col gap-1 border border-[#262a35]">
                <span className="font-label-caps text-label-caps text-outline uppercase">
                  ROOT CAUSE HEURISTIC:
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Asphalt surface temps exceeding 58°C causing tire blowouts and heavy BMTC bus coolant boil-overs along Silk Board uphill merge.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-1 pt-1">
                <div className="bg-[#1c1f2a] p-1.5 rounded border border-[#262a35]">
                  <span className="font-label-caps text-label-caps text-outline block">EMT TRANSIT DELAY</span>
                  <span className="font-data-mono-lg text-data-mono-lg text-error font-bold">+24.5 Mins</span>
                </div>
                <div className="bg-[#1c1f2a] p-1.5 rounded border border-[#262a35]">
                  <span className="font-label-caps text-label-caps text-outline block">CORRIDOR VOLUME</span>
                  <span className="font-data-mono-lg text-data-mono-lg text-on-surface font-bold">4,800 veh/hr</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 flex items-center justify-between border-t border-[#262a35]">
              <span className="font-data-mono-sm text-data-mono-sm text-outline">Lead Time: 1h 15m</span>
              <button
                onClick={() => onNavigateTab('ai-response-planner')}
                className="bg-[#262a35] hover:bg-[#353944] text-on-surface font-data-mono-sm text-data-mono-sm font-semibold px-2.5 py-1.5 rounded transition-all flex items-center gap-1 border border-[#3d494c]"
              >
                REROUTE LOGISTICS
                <span className="material-symbols-outlined text-[16px]">alt_route</span>
              </button>
            </div>
          </div>

          {/* Card 3: Bio Hazard Peenya District 7 */}
          <div className="flex flex-col justify-between rounded-xl bg-[#171b26] p-3 shadow-md border-l-4 border-l-secondary border border-[#262a35] relative overflow-hidden group">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <span className="font-label-caps text-label-caps bg-secondary-container/50 text-secondary-fixed px-1.5 py-0.5 rounded tracking-widest uppercase font-bold">
                  EMERGING VECTOR
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-data-mono-sm text-data-mono-sm text-secondary font-bold">76% CONFIDENCE</span>
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                </div>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface leading-tight font-bold">
                  Perishable Waste Fermentation Cascade
                </h3>
                <span className="font-data-mono-sm text-data-mono-sm text-secondary">
                  Dasarahalli // Peenya & K.R. Market Wholesale Hub
                </span>
              </div>
              <div className="bg-[#0a0e18]/80 rounded p-2 flex flex-col gap-1 border border-[#262a35]">
                <span className="font-label-caps text-label-caps text-outline uppercase">
                  ROOT CAUSE HEURISTIC:
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Delayed morning sanitation collection cycle combined with sun-exposed compaction units reaching &gt;46°C interior fermentation temperatures.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-1 pt-1">
                <div className="bg-[#1c1f2a] p-1.5 rounded border border-[#262a35]">
                  <span className="font-label-caps text-label-caps text-outline block">METHANE OUTGASSING</span>
                  <span className="font-data-mono-lg text-data-mono-lg text-secondary font-bold">310 PPM Est.</span>
                </div>
                <div className="bg-[#1c1f2a] p-1.5 rounded border border-[#262a35]">
                  <span className="font-label-caps text-label-caps text-outline block">FLEET READY</span>
                  <span className="font-data-mono-lg text-data-mono-lg text-on-surface font-bold">4 Units Avail</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 flex items-center justify-between border-t border-[#262a35]">
              <span className="font-data-mono-sm text-data-mono-sm text-outline">Lead Time: 2h 40m</span>
              <button
                onClick={() => onNavigateTab('ai-response-planner')}
                className="bg-[#262a35] hover:bg-[#353944] text-on-surface font-data-mono-sm text-data-mono-sm font-semibold px-2.5 py-1.5 rounded transition-all flex items-center gap-1 border border-[#3d494c]"
              >
                QUEUE SANITATION
                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Split Deck: AI Model Projection vs Sensor Ground Truth */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-outline">
              GROUND TRUTH VALIDATION DECK
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Simulated Neural Projection vs. Verified Bengaluru IoT Stream
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-[#0a0e18] px-2.5 py-1 rounded border border-[#262a35]">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span className="font-data-mono-sm text-data-mono-sm text-on-surface">TELEMETRY DELAY: 180ms</span>
            <span className="font-data-mono-sm text-data-mono-sm text-outline">|</span>
            <span className="font-data-mono-sm text-data-mono-sm text-primary">PROBABILITY ENVELOPE: 95% CI</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Left: AI Neural Model Projection (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-xl bg-[#1c1f2a] p-4 shadow-md border border-[#262a35]">
            <div>
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">timeline</span>
                  <span className="font-headline-sm text-body-lg text-on-surface font-semibold">
                    HAL Substation 04: Thermal Load Forecast (+180 Mins)
                  </span>
                </div>
                <span className="font-data-mono-sm text-data-mono-sm bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/30">
                  MODEL: LSTM-SURGE-4R
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
                Shaded cyan boundary represents predictive confidence envelope (σ ± 2.1). Peak anomaly expected at 16:45 IST.
              </p>

              {/* SVG Chart: Neural Curve with Confidence Band */}
              <div className="w-full h-56 bg-[#0a0e18] rounded-lg p-2 relative overflow-hidden flex flex-col justify-between border border-[#262a35]">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 180">
                  <defs>
                    <linearGradient id="confidenceBand" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.35"></stop>
                      <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.02"></stop>
                    </linearGradient>
                  </defs>
                  {/* Critical Threshold Line (at y=45) */}
                  <line opacity="0.8" stroke="#ffb4ab" strokeDasharray="4,4" strokeWidth="1.5" x1="0" x2="500" y1="45" y2="45"></line>
                  <text fill="#ffb4ab" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700" x="8" y="38">
                    CRITICAL SAFETY CAPACITY (850 MW)
                  </text>
                  {/* Confidence Band Area */}
                  <polygon
                    fill="url(#confidenceBand)"
                    points="0,130 50,122 100,110 160,95 220,70 280,48 340,30 400,24 450,28 500,40 500,85 450,75 400,65 340,75 280,95 220,118 160,132 100,140 50,145 0,148"
                  ></polygon>
                  {/* Ground Truth Actuals (Solid green) */}
                  <polyline
                    fill="none"
                    points="0,138 50,132 100,125 160,112 180,105"
                    stroke="#4edea3"
                    strokeLinecap="round"
                    strokeWidth="3"
                  ></polyline>
                  {/* Current Time Divider */}
                  <line opacity="0.6" stroke="#dfe2f1" strokeDasharray="2,2" strokeWidth="1" x1="180" x2="180" y1="10" y2="170"></line>
                  <circle className="animate-ping" cx="180" cy="105" fill="#4edea3" r="4"></circle>
                  <circle cx="180" cy="105" fill="#4edea3" r="4"></circle>
                  {/* Predictive Curve (Dashed cyan) */}
                  <polyline
                    fill="none"
                    points="180,105 220,90 280,68 340,48 400,40 450,45 500,60"
                    stroke="#4cd7f6"
                    strokeDasharray="5,3"
                    strokeWidth="2.5"
                  ></polyline>
                  {/* Anomaly Highlight Point */}
                  <circle cx="400" cy="40" fill="#ffb4ab" r="5"></circle>
                </svg>

                {/* Bottom X-Axis Axis Labels */}
                <div className="flex justify-between items-center px-1 pt-1 font-data-mono-sm text-[10px] text-outline">
                  <span>13:00 (ACTUAL)</span>
                  <span>14:00 (ACTUAL)</span>
                  <span className="text-tertiary font-bold">14:45 [NOW]</span>
                  <span>15:30 (PROJ)</span>
                  <span className="text-error font-bold">16:45 (SURGE)</span>
                  <span>17:30 (PROJ)</span>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="bg-[#262a35]/60 p-2 rounded border border-[#3d494c]">
                <span className="font-label-caps text-label-caps text-outline block">EST. PEAK SPIKE</span>
                <span className="font-data-mono-lg text-data-mono-lg text-error font-bold">912.4 MW</span>
                <span className="font-data-mono-sm text-[10px] text-outline block mt-0.5">Threshold: 850 MW</span>
              </div>
              <div className="bg-[#262a35]/60 p-2 rounded border border-[#3d494c]">
                <span className="font-label-caps text-label-caps text-outline block">VARIANCE BAND</span>
                <span className="font-data-mono-lg text-data-mono-lg text-primary font-bold">±14.2 MW</span>
                <span className="font-data-mono-sm text-[10px] text-outline block mt-0.5">P-Value: 0.001</span>
              </div>
              <div className="bg-[#262a35]/60 p-2 rounded border border-[#3d494c]">
                <span className="font-label-caps text-label-caps text-outline block">ANOMALY WEIGHT</span>
                <span className="font-data-mono-lg text-data-mono-lg text-tertiary font-bold">0.962 (HIGH)</span>
                <span className="font-data-mono-sm text-[10px] text-outline block mt-0.5">Transformer Oil Temp</span>
              </div>
            </div>
          </div>

          {/* Right: Verified Sensor Ground Truth IoT Telemetry (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-xl bg-[#1c1f2a] p-4 shadow-md border border-[#262a35]">
            <div>
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">sensors</span>
                  <span className="font-headline-sm text-body-lg text-on-surface font-semibold">
                    Live Edge Ground Truth
                  </span>
                </div>
                <span className="font-data-mono-sm text-data-mono-sm bg-tertiary/20 text-tertiary px-2 py-0.5 rounded font-bold border border-tertiary/30">
                  VERIFIED REALITY
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
                Direct cryptographic readings from physical Bengaluru edge transducers (IMD, BESCOM SCADA, BTP, DHS).
              </p>
              <div className="flex flex-col gap-2">
                {/* Telemetry Row 1 */}
                <div className="flex items-center justify-between p-2 rounded bg-[#262a35] border border-[#3d494c]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline text-[18px]">device_thermostat</span>
                    <div>
                      <span className="font-body-sm text-body-sm text-on-surface block font-medium">
                        Ambient Bengaluru Core Temp
                      </span>
                      <span className="font-data-mono-sm text-data-mono-sm text-outline">
                        Sensor ID: IMD-BLR-CENTRAL-99
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-data-mono-lg text-data-mono-lg text-error font-bold">{currentTemp}°C</span>
                    <span className="font-data-mono-sm text-[10px] text-error block">+0.4°C vs Forecast</span>
                  </div>
                </div>

                {/* Telemetry Row 2 */}
                <div className="flex items-center justify-between p-2 rounded bg-[#262a35] border border-[#3d494c]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline text-[18px]">bolt</span>
                    <div>
                      <span className="font-body-sm text-body-sm text-on-surface block font-medium">
                        HAL Substation 4 Oil Pump Flow
                      </span>
                      <span className="font-data-mono-sm text-data-mono-sm text-outline">
                        Sensor ID: BESCOM-SUB04-PUMP-A
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-data-mono-lg text-data-mono-lg text-error font-bold">12.1 L/min</span>
                    <span className="font-data-mono-sm text-[10px] text-error block">-48% [CAVITATING]</span>
                  </div>
                </div>

                {/* Telemetry Row 3 */}
                <div className="flex items-center justify-between p-2 rounded bg-[#262a35] border border-[#3d494c]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline text-[18px]">local_hospital</span>
                    <div>
                      <span className="font-body-sm text-body-sm text-on-surface block font-medium">
                        St. John's & Bowring ER Inflow
                      </span>
                      <span className="font-data-mono-sm text-data-mono-sm text-outline">
                        Sensor ID: HL7-BLR-SURGE-01
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-data-mono-lg text-data-mono-lg text-tertiary font-bold">22 Admits/hr</span>
                    <span className="font-data-mono-sm text-[10px] text-tertiary block">Matches AI Projection</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 bg-[#0a0e18]/60 p-2 rounded flex items-center justify-between border border-[#262a35]">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                <span className="font-data-mono-sm text-data-mono-sm text-on-surface">
                  Data Authenticated: Ledger #7719-BLR
                </span>
              </div>
              <span className="font-data-mono-sm text-data-mono-sm text-outline">SYNC: REAL-TIME</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Early Interventions & Mitigation Playbooks */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-outline">
              AUTHORIZATION CONSOLE
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              AI Recommended Countermeasures & Playbooks
            </h2>
          </div>
          <span className="font-data-mono-sm text-data-mono-sm bg-[#262a35] text-on-surface-variant px-2.5 py-1 rounded border border-[#3d494c]">
            OFFICER ROLE: ELENA VANCE (COMMAND CLEARANCE LEVEL 4)
          </span>
        </div>

        {/* Action Rows / Playbooks */}
        <div className="flex flex-col gap-2">
          {/* Playbook 1 */}
          <div className="rounded-xl bg-[#1c1f2a] p-3 shadow-md flex flex-col xl:flex-row xl:items-center justify-between gap-3 border border-[#262a35] hover:bg-[#262a35]/90 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[24px]">power</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-headline-sm text-body-lg text-on-surface font-semibold">
                    Playbook ALPHA-01: Microgrid Isolate St. John's & Bowring Hospitals
                  </span>
                  <span className="font-data-mono-sm text-data-mono-sm bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold border border-primary/30">
                    96% SUCCESS CONFIDENCE
                  </span>
                  <span className="font-data-mono-sm text-data-mono-sm text-outline">
                    EST. IMPACT: +35 MW BUFFER SAVED
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-3xl">
                  Remotely shifts St. John's Medical College Hospital and Bowring Trauma Wings to localized hydrogen fuel cell and battery storage, decoupling them from failing HAL Substation 4 prior to peak thermal cascade.
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="font-label-caps text-label-caps text-outline uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-tertiary">history_edu</span> EVIDENCE: APRIL 2024 HEAT LOGS
                  </span>
                  <span className="font-label-caps text-label-caps text-outline uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-primary">analytics</span> TELEMETRY: BESCOM GRID FEED #882
                  </span>
                  <span className="font-label-caps text-label-caps text-outline uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-secondary">cloud</span> IMD BENGALURU THERMAL MESH
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-end xl:self-center shrink-0">
              <button
                onClick={() => setParamModalOpen(true)}
                className="bg-[#262a35] hover:bg-[#313540] text-on-surface font-data-mono-sm text-data-mono-sm px-3 py-1.5 rounded transition-all border border-[#3d494c]"
              >
                Modify Parameters
              </button>
              <button
                onClick={() => handlePreAuthorize('alpha-01', 'ALPHA-01')}
                className={`font-data-mono-sm text-data-mono-sm font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1 shadow-md ${
                  authorizedPlaybooks['alpha-01']
                    ? 'bg-tertiary text-on-tertiary'
                    : 'bg-primary text-on-primary hover:brightness-110'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                {authorizedPlaybooks['alpha-01'] ? 'AUTHORIZED & DISPATCHED' : 'Pre-Authorize Action'}
              </button>
            </div>
          </div>

          {/* Playbook 2 */}
          <div className="rounded-xl bg-[#1c1f2a] p-3 shadow-md flex flex-col xl:flex-row xl:items-center justify-between gap-3 border border-[#262a35] hover:bg-[#262a35]/90 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-container text-secondary-fixed flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[24px]">traffic</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-headline-sm text-body-lg text-on-surface font-semibold">
                    Playbook BETA-04: Emergency Priority Transit Lane on Silk Board & Outer Ring Road
                  </span>
                  <span className="font-data-mono-sm text-data-mono-sm bg-tertiary/20 text-tertiary px-1.5 py-0.5 rounded font-bold border border-tertiary/30">
                    89% SUCCESS CONFIDENCE
                  </span>
                  <span className="font-data-mono-sm text-data-mono-sm text-outline">
                    EST. IMPACT: -18 MIN EMT LATENCY
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-3xl">
                  Synchronize BTP smart overhead signage on Hosur Road and Outer Ring Road to commandeer express lanes exclusively for ambulance and water relief fleets, clearing anticipated thermal vehicle breakdown bottlenecks.
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="font-label-caps text-label-caps text-outline uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-tertiary">history_edu</span> EVIDENCE: BTP CORRIDOR ARCHIVE
                  </span>
                  <span className="font-label-caps text-label-caps text-outline uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-primary">videocam</span> TELEMETRY: 42 CAM OVERHEAD RADAR
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-end xl:self-center shrink-0">
              <button
                onClick={() => setParamModalOpen(true)}
                className="bg-[#262a35] hover:bg-[#313540] text-on-surface font-data-mono-sm text-data-mono-sm px-3 py-1.5 rounded transition-all border border-[#3d494c]"
              >
                Modify Parameters
              </button>
              <button
                onClick={() => handlePreAuthorize('beta-04', 'BETA-04')}
                className={`font-data-mono-sm text-data-mono-sm font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1 shadow-md ${
                  authorizedPlaybooks['beta-04']
                    ? 'bg-tertiary text-on-tertiary'
                    : 'bg-primary text-on-primary hover:brightness-110'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                {authorizedPlaybooks['beta-04'] ? 'AUTHORIZED & DISPATCHED' : 'Pre-Authorize Action'}
              </button>
            </div>
          </div>

          {/* Playbook 3 */}
          <div className="rounded-xl bg-[#1c1f2a] p-3 shadow-md flex flex-col xl:flex-row xl:items-center justify-between gap-3 border border-[#262a35] hover:bg-[#262a35]/90 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#262a35] text-tertiary flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[24px]">water_drop</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-headline-sm text-body-lg text-on-surface font-semibold">
                    Playbook GAMMA-09: Municipal Fogging & Early Waste Flush (Peenya & K.R. Market)
                  </span>
                  <span className="font-data-mono-sm text-data-mono-sm bg-outline-variant text-on-surface-variant px-1.5 py-0.5 rounded font-bold">
                    78% SUCCESS CONFIDENCE
                  </span>
                  <span className="font-data-mono-sm text-data-mono-sm text-outline">
                    EST. IMPACT: -6.2°C LOCAL HEAT DAMPENING
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-3xl">
                  Dispatch autonomous greywater street misting sprayers across Peenya Industrial Hub and K.R. Market wholesale lanes to suppress ambient thermal rise and neutralize commercial dumpster anaerobic fermentation.
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="font-label-caps text-label-caps text-outline uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-primary">analytics</span> TELEMETRY: BBMP BIO-SENSOR MESH 07
                  </span>
                  <span className="font-label-caps text-label-caps text-outline uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-tertiary">water</span> BWSSB RESERVOIR: 98% AVAILABLE
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-end xl:self-center shrink-0">
              <button
                onClick={() => setParamModalOpen(true)}
                className="bg-[#262a35] hover:bg-[#313540] text-on-surface font-data-mono-sm text-data-mono-sm px-3 py-1.5 rounded transition-all border border-[#3d494c]"
              >
                Modify Parameters
              </button>
              <button
                onClick={() => handlePreAuthorize('gamma-09', 'GAMMA-09')}
                className={`font-data-mono-sm text-data-mono-sm font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1 shadow-md ${
                  authorizedPlaybooks['gamma-09']
                    ? 'bg-tertiary text-on-tertiary'
                    : 'bg-primary text-on-primary hover:brightness-110'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                {authorizedPlaybooks['gamma-09'] ? 'AUTHORIZED & DISPATCHED' : 'Pre-Authorize Action'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Department Risk Correlation Heat Matrix */}
      <div className="rounded-xl bg-[#1c1f2a] p-4 shadow-md border border-[#262a35] flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
          <div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
              <span className="font-label-caps text-label-caps uppercase text-outline">
                CROSS-SYSTEM CASCADE TOPOLOGY
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Bengaluru Department Risk Correlation Heat Matrix
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-data-mono-sm text-data-mono-sm text-outline">CASCADE INTENSITY:</span>
            <span className="inline-flex items-center gap-1 font-data-mono-sm text-data-mono-sm text-on-surface">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#313540]"></span> Low
              <span className="w-2.5 h-2.5 rounded-sm bg-primary/40 ml-1"></span> Moderate
              <span className="w-2.5 h-2.5 rounded-sm bg-error ml-1"></span> Critical
            </span>
          </div>
        </div>

        {/* The Cross-Department Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-data-mono-sm text-data-mono-sm">
            <thead>
              <tr className="bg-[#0a0e18] text-outline border-b-0">
                <th className="p-2.5 font-label-caps text-label-caps uppercase">STRESSOR ORIGIN \ RECIPIENT</th>
                <th className="p-2.5 text-center font-label-caps text-label-caps uppercase">ENERGY (BESCOM)</th>
                <th className="p-2.5 text-center font-label-caps text-label-caps uppercase">HEALTHCARE (DHS)</th>
                <th className="p-2.5 text-center font-label-caps text-label-caps uppercase">TRANSIT (BMRCL/BTP)</th>
                <th className="p-2.5 text-center font-label-caps text-label-caps uppercase">PUBLIC WORKS (BBMP)</th>
                <th className="p-2.5 text-center font-label-caps text-label-caps uppercase">WATER (BWSSB)</th>
              </tr>
            </thead>
            <tbody className="divide-y-0">
              {/* Row 1: Energy */}
              <tr className="hover:bg-[#262a35]/50 transition-colors">
                <td className="p-2.5 font-semibold text-on-surface bg-[#262a35]/40">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[16px]">bolt</span>
                    <span>Energy (BESCOM Grid)</span>
                  </div>
                </td>
                <td className="p-2.5 text-center bg-[#313540]/20 text-outline">--</td>
                <td className="p-2.5 text-center">
                  <span className="inline-block px-2 py-1 rounded bg-error text-surface-container-lowest font-bold shadow-sm">
                    CRITICAL (0.94)
                  </span>
                </td>
                <td className="p-2.5 text-center">
                  <span className="inline-block px-2 py-1 rounded bg-error/30 text-error font-semibold">
                    HIGH (0.78)
                  </span>
                </td>
                <td className="p-2.5 text-center">
                  <span className="inline-block px-2 py-1 rounded bg-primary/20 text-primary">
                    MED (0.52)
                  </span>
                </td>
                <td className="p-2.5 text-center">
                  <span className="inline-block px-2 py-1 rounded bg-error/30 text-error font-semibold">
                    HIGH (0.81)
                  </span>
                </td>
              </tr>

              {/* Row 2: Healthcare */}
              <tr className="hover:bg-[#262a35]/50 transition-colors">
                <td className="p-2.5 font-semibold text-on-surface bg-[#262a35]/40">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-error text-[16px]">medical_services</span>
                    <span>Healthcare &amp; EMS (DHS)</span>
                  </div>
                </td>
                <td className="p-2.5 text-center">
                  <span className="inline-block px-2 py-1 rounded bg-[#313540] text-outline">
                    LOW (0.18)
                  </span>
                </td>
                <td className="p-2.5 text-center bg-[#313540]/20 text-outline">--</td>
                <td className="p-2.5 text-center">
                  <span className="inline-block px-2 py-1 rounded bg-error text-surface-container-lowest font-bold shadow-sm">
                    CRITICAL (0.88)
                  </span>
                </td>
                <td className="p-2.5 text-center">
                  <span className="inline-block px-2 py-1 rounded bg-[#313540] text-outline">
                    LOW (0.24)
                  </span>
                </td>
                <td className="p-2.5 text-center">
                  <span className="inline-block px-2 py-1 rounded bg-[#313540] text-outline">
                    LOW (0.15)
                  </span>
                </td>
              </tr>

              {/* Row 3: Transit */}
              <tr className="hover:bg-[#262a35]/50 transition-colors">
                <td className="p-2.5 font-semibold text-on-surface bg-[#262a35]/40">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-[16px]">commute</span>
                    <span>Transit &amp; Corridors (BMRCL/BTP)</span>
                  </div>
                </td>
                <td className="p-2.5 text-center">
                  <span className="inline-block px-2 py-1 rounded bg-primary/20 text-primary">
                    MED (0.44)
                  </span>
                </td>
                <td className="p-2.5 text-center">
                  <span className="inline-block px-2 py-1 rounded bg-error text-surface-container-lowest font-bold shadow-sm">
                    CRITICAL (0.91)
                  </span>
                </td>
                <td className="p-2.5 text-center bg-[#313540]/20 text-outline">--</td>
                <td className="p-2.5 text-center">
                  <span className="inline-block px-2 py-1 rounded bg-error/30 text-error font-semibold">
                    HIGH (0.76)
                  </span>
                </td>
                <td className="p-2.5 text-center">
                  <span className="inline-block px-2 py-1 rounded bg-[#313540] text-outline">
                    LOW (0.11)
                  </span>
                </td>
              </tr>

              {/* Row 4: Public Works */}
              <tr className="hover:bg-[#262a35]/50 transition-colors">
                <td className="p-2.5 font-semibold text-on-surface bg-[#262a35]/40">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-tertiary text-[16px]">delete_sweep</span>
                    <span>Public Works &amp; SWM (BBMP)</span>
                  </div>
                </td>
                <td className="p-2.5 text-center">
                  <span className="inline-block px-2 py-1 rounded bg-[#313540] text-outline">
                    LOW (0.12)
                  </span>
                </td>
                <td className="p-2.5 text-center">
                  <span className="inline-block px-2 py-1 rounded bg-primary/20 text-primary">
                    MED (0.61)
                  </span>
                </td>
                <td className="p-2.5 text-center">
                  <span className="inline-block px-2 py-1 rounded bg-primary/20 text-primary">
                    MED (0.55)
                  </span>
                </td>
                <td className="p-2.5 text-center bg-[#313540]/20 text-outline">--</td>
                <td className="p-2.5 text-center">
                  <span className="inline-block px-2 py-1 rounded bg-[#313540] text-outline">
                    LOW (0.32)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Explanatory note */}
        <div className="bg-[#0a0e18] p-2.5 rounded flex items-center justify-between border border-[#262a35]">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Values represent normalized systemic correlation index (0.0 to 1.0) synthesized from historical Bengaluru heatwave and traffic surge incidents.
          </span>
          <button
            onClick={handleExportCSV}
            className="shrink-0 bg-[#262a35] hover:bg-[#353944] text-on-surface font-data-mono-sm text-data-mono-sm px-3 py-1 rounded transition-colors ml-3 border border-[#3d494c]"
          >
            Export Matrix (.CSV)
          </button>
        </div>
      </div>

      {/* Parameter Adjustment Modal */}
      {paramModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 max-w-md w-full shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#262a35] pb-2">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                Modify Protocol Execution Parameters
              </span>
              <button onClick={() => setParamModalOpen(false)} className="text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-outline uppercase text-[10px] block mb-1">
                  Grid Load Shed Target (MW)
                </label>
                <input
                  type="number"
                  defaultValue={35}
                  className="w-full bg-[#0a0e18] border border-[#3d494c] p-2 rounded text-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-outline uppercase text-[10px] block mb-1">
                  Ambulance Green Wave Pre-emption (Seconds)
                </label>
                <input
                  type="number"
                  defaultValue={120}
                  className="w-full bg-[#0a0e18] border border-[#3d494c] p-2 rounded text-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-outline uppercase text-[10px] block mb-1">
                  Misting Sprayers Reservoir Threshold (Bar)
                </label>
                <input
                  type="number"
                  defaultValue={4.2}
                  step={0.1}
                  className="w-full bg-[#0a0e18] border border-[#3d494c] p-2 rounded text-primary focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#262a35]">
              <button
                onClick={() => setParamModalOpen(false)}
                className="px-3 py-1.5 bg-[#262a35] text-on-surface rounded text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setParamModalOpen(false);
                  setToastMessage('Parameters updated and verified by Safety Heuristics v4.9.');
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="px-4 py-1.5 bg-primary text-on-primary rounded text-xs font-mono font-bold"
              >
                Save &amp; Calibrate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 right-8 bg-[#262a35] text-on-surface px-4 py-2 rounded-lg shadow-2xl flex items-center gap-2 border border-tertiary z-50">
          <span className="material-symbols-outlined text-tertiary">check_circle</span>
          <span className="font-data-mono-sm text-data-mono-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
