import React, { useState } from 'react';
import { NavTab } from './Sidebar';

interface SystemGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const SystemGuideModal: React.FC<SystemGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [selectedSection, setSelectedSection] = useState<string>('overview');

  if (!isOpen) return null;

  const guideSections = [
    {
      id: 'overview',
      title: 'City OS Philosophy & Overview',
      icon: 'grid_view',
      desc: 'Central intelligence hub synchronizing Bengaluru public municipal data across BBMP, BESCOM, BMRCL, BTP, and BWSSB.',
      details: [
        'Real-Time Live Telemetry: Pulls live Open-Meteo Bengaluru weather (temperature, humidity, wind, pressure) and Air Quality (AQI, PM2.5, Ozone).',
        'OSRM Live Commute Times: Computes live road delays and congestion across Silk Board, Hebbal Flyover, Tin Factory, and Outer Ring Road.',
        'Resilience Barometer: Synthesizes multi-agency health into a single operational score (currently 68% under Heatwave Alpha).',
        'Made by TavishSK: Engineered as a unified municipal operations platform for Bangalore.'
      ]
    },
    {
      id: 'map-and-zone-explorer',
      title: 'Map & Zone Explorer (Live Bengaluru GIS)',
      icon: 'map',
      desc: 'Interactive tactical GIS map showing Bengaluru with real CartoDB Dark Matter / OpenStreetMap tiles.',
      details: [
        'Genuine Bengaluru Map: Shows actual city layout, Vidhana Soudha, MG Road, Indiranagar, Whitefield, Silk Board, Hebbal, and Peenya.',
        'BBMP 8 Administrative Zones: Color-coded polygons highlighting thermal stress in Zone 4 (Central Core), Zone 7 (Peenya), and Zone 6 (Bommanahalli).',
        'Namma Metro Network: Traces Purple Line (Challaghatta to Whitefield) and Green Line (Nagasandra to Silk Institute).',
        'Interactive Markers: Click on any BESCOM Substation (HAL, Peenya, Hoodi), Hospital ER, or Indira Canteen Cooling Hub for live telemetry.',
        'Camera Presets: Jump instantly between "MG Road Core", "Silk Board", "Whitefield IT", "Peenya Hub", and "All Bengaluru".'
      ]
    },
    {
      id: 'ai-predictions-and-alerts',
      title: 'AI Predictions & Alerts',
      icon: 'sensors',
      desc: 'Probabilistic threat forecasting and automated municipal safety mandates under Protocol 104-B.',
      details: [
        'Threat Vectors: Forecasts compound failures like transformer trips, ER bed saturation, and thermal rail expansions.',
        'Probability & Confidence: Visualizes AI prediction windows with 1-sigma variance bands and verification sources.',
        'Real-Time Anomaly Ledger: Displays SCADA transducer readings from HAL Substation 04 and DHS hospital bed occupancy.'
      ]
    },
    {
      id: 'citywide-impact-chain',
      title: 'Citywide Impact Chain',
      icon: 'account_tree',
      desc: 'Interactive 4-stage causal dependency graph tracking multi-silo cascading disruptions.',
      details: [
        'Stage 1 (Shock Nexus): Extreme Ambient Heat Index (41.2°C).',
        'Stage 2 (Grid Stress): HAL Substation 04 transformer oil overheating (88.4°C).',
        'Stage 3 (Downstream Failures): St. John\'s Hospital ER surges, Namma Metro speed restrictions, and sanitation delays.',
        'Interactive Sever Analysis: Click on any node to sever dependency lines and prevent systemic cascade.'
      ]
    },
    {
      id: 'ai-response-planner',
      title: 'AI Response Planner',
      icon: 'alt_route',
      desc: 'Coordinated inter-agency municipal action plans awaiting Director authorization.',
      details: [
        'Directives Ledger: Review and authorize plans like "Emergency Civic Cooling Shelters", "Commercial HVAC Curtailment", and "Substation Decoupling".',
        'Resource Commitments: Shows allocated hydration vans, misting sprinklers, and transit shuttles.',
        'One-Click Sign-Off: Directors can authorize directives with cryptographic audit hashes.'
      ]
    },
    {
      id: 'what-if-simulation-lab',
      title: 'What-If Simulation Lab (Bengaluru Crisis Simulator)',
      icon: 'science',
      desc: 'Simulate any question or crisis in Bengaluru (Cubbon Park Missing Child, Commercial Street Fire, Hebbal Floods, Silk Board Jams) with tight correlation and realistic civic budgets.',
      details: [
        'Tackles Any Question: Ask or simulate any municipal event in Bengaluru using natural language or select 1-click popular tests.',
        'Zero Jargon Consequences: Clear human explanations for traffic delays, power cut safety cutoffs, drinking water, and hospital access.',
        'Realistic Civic Budgets: Clear, proportional operational cost breakdowns in ₹ Lakhs and Thousands with itemized logistics and savings ratios.',
        'Actual Bengaluru Leaflet Map: Automatically zooms and pans to the incident spot showing pulsing hazard pins and green detour routes.',
        'Real-Time Levers: Adjust custom response sliders to dynamically see consequences update in real time.'
      ]
    },
    {
      id: 'resource-command',
      title: 'Resource Command',
      icon: 'local_shipping',
      desc: 'Live fleet dispatch and asset inventory tracking for emergency vehicles across Bengaluru.',
      details: [
        'Emergency Fleets: 108 GVK-EMRI Ambulances, BMTC transit buses, BBMP water misting tankers, and BESCOM mobile substations.',
        'Dispatch Table: Filter by status (EN ROUTE, DISPATCHED, STANDBY) and deploy resources to affected zones.'
      ]
    },
    {
      id: 'department-workspaces',
      title: 'Department Workspaces',
      icon: 'domain',
      desc: 'Dedicated consoles for BESCOM (Power), BMRCL & BMTC (Transit), BTP (Traffic), BBMP (Civic), and BWSSB (Water).',
      details: [
        'BESCOM: Substation SCADA transformers and rolling load shedding schedules.',
        'BMRCL & BMTC: Metro train headways, traction substations, and thermal speed throttles.',
        'BTP Traffic: Real-time congestion corridors with live OSRM commute minutes and signal pre-emption.',
        'BWSSB Water: Cauvery Stage-IV & V pumping head pressures and urban misting supply.'
      ]
    }
  ];

  const current = guideSections.find((s) => s.id === selectedSection) || guideSections[0];

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#171b26] border border-[#3d494c] rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1c1f2a] border-b border-[#262a35] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-base text-white font-bold">
                  City OS // Bengaluru Command Guide
                </h3>
                <span className="bg-primary/20 text-primary border border-primary/40 px-1.5 py-0.5 rounded font-mono text-[9px] font-bold">
                  MADE BY TAVISHSK
                </span>
              </div>
              <p className="font-data-mono-sm text-[11px] text-on-surface-variant">
                Comprehensive operations manual, screen directory, and real-time telemetry reference.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#262a35] hover:bg-[#353944] text-on-surface flex items-center justify-center font-mono transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body Split */}
        <div className="flex-1 overflow-hidden grid grid-cols-12">
          {/* Left Navigation */}
          <div className="col-span-4 bg-[#0f131d]/90 border-r border-[#262a35] p-3 overflow-y-auto flex flex-col gap-1">
            <span className="font-label-caps text-[10px] text-outline uppercase px-2 py-1 font-bold">
              SCREEN DIRECTORY
            </span>
            {guideSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-mono transition-all ${
                  selectedSection === sec.id
                    ? 'bg-primary text-on-primary font-bold shadow-md'
                    : 'text-on-surface-variant hover:bg-[#1c1f2a] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{sec.icon}</span>
                <span className="truncate">{sec.title.split('(')[0]}</span>
              </button>
            ))}
          </div>

          {/* Right Content */}
          <div className="col-span-8 p-6 overflow-y-auto bg-[#171b26] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary mb-1">
                <span className="material-symbols-outlined text-[22px]">{current.icon}</span>
                <h4 className="font-headline-sm text-lg text-white font-bold">{current.title}</h4>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mb-4 leading-relaxed">
                {current.desc}
              </p>

              <div className="bg-[#1c1f2a] p-4 rounded-xl border border-[#262a35] mb-4">
                <span className="font-label-caps text-[10px] text-primary uppercase font-bold tracking-wider block mb-2">
                  KEY FEATURES & HOW TO USE
                </span>
                <ul className="flex flex-col gap-2.5 font-data-mono-sm text-[11px] text-on-surface">
                  {current.details.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-tertiary font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-[#262a35] flex items-center justify-between">
              <span className="text-[10px] font-mono text-outline">
                Node: Bengaluru Municipal Core • Architect: TavishSK
              </span>
              {current.id !== 'overview' && (
                <button
                  onClick={() => {
                    onNavigateTab(current.id as NavTab);
                    onClose();
                  }}
                  className="bg-primary hover:bg-primary-container text-on-primary px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <span>Go to this Screen</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
