import React, { useState } from 'react';
import { NavTab } from './Sidebar';

interface UserHelpGuideProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const UserHelpGuide: React.FC<UserHelpGuideProps> = ({ onNavigateTab }) => {
  const [activeCategory, setActiveCategory] = useState<'tutorial' | 'features' | 'data' | 'faq'>('tutorial');

  const featuresList: { id: NavTab; name: string; icon: string; desc: string; highlights: string[] }[] = [
    {
      id: 'city-overview-dashboard',
      name: 'City Overview Dashboard',
      icon: 'grid_view',
      desc: 'Central high-level executive situational awareness room for Bengaluru municipal operations.',
      highlights: [
        'Resilience Barometer: Synthesizes multi-agency health into a single operational score (currently 68%).',
        'Live Telemetry Ticker: Ambient surface temperature, KSPCB air quality, and BESCOM grid load in real-time.',
        'Interactive Bengaluru Tactical GIS Map: Filter by thermal plume, substations, or cooling shelters.',
        'View Switcher: Switch between Spatial Map, Grid & Traffic, or Incident Matrix to declutter your view.'
      ]
    },
    {
      id: 'map-and-zone-explorer',
      name: 'Map & Zone Explorer (Live Bengaluru GIS)',
      icon: 'map',
      desc: 'Deep-dive tactical spatial analysis of Bengaluru with zero API key dependencies.',
      highlights: [
        'Dual Map Styles: Toggle freely between "Tactical Dark (Esri GIS)" and "OpenStreetMap Bengaluru".',
        'BBMP 8 Administrative Zones: Color-coded vector polygons representing thermal index and citizen density.',
        'Namma Metro Rail Lines: Traces Purple Line (Challaghatta to Whitefield) and Green Line (Nagasandra to Silk Institute).',
        'Interactive Markers: Click on any BESCOM substation, hospital ER, or traffic chokepoint for instant telemetry cards.',
        'Camera Presets: Jump smoothly to MG Road Core, Silk Board, Whitefield IT, Peenya Hub, or Full Bengaluru.'
      ]
    },
    {
      id: 'ai-predictions-and-alerts',
      name: 'AI Predictions & Alerts',
      icon: 'sensors',
      desc: 'Probabilistic early-warning system and automated safety mandates under Protocol 104-B.',
      highlights: [
        'Threat Vectors: Multi-vector compound failure models forecasting power outages and ER saturation.',
        'Confidence Windows: High-precision probabilistic curves with 1-sigma variance bands.',
        'Sensor Audit Ledger: Real-time transducer feeds from HAL Substation 04 and DHS hospital bed ledgers.'
      ]
    },
    {
      id: 'citywide-impact-chain',
      name: 'Citywide Impact Chain',
      icon: 'account_tree',
      desc: 'Interactive 4-stage causal dependency graph tracking cascading failures across municipal silos.',
      highlights: [
        'Stage 1 (Shock Nexus): Ambient extreme heat wave index (41.2°C).',
        'Stage 2 (Grid Stress): HAL Substation 04 transformer oil temperature hitting 88.4°C.',
        'Stage 3 (Downstream Ripple): Hospital ER surges, Namma Metro speed restrictions, and sanitation delays.',
        'Interactive Sever Simulation: Click any node to model firewalling dependencies and prevent citywide collapse.'
      ]
    },
    {
      id: 'ai-response-planner',
      name: 'AI Response Planner',
      icon: 'alt_route',
      desc: 'Orchestrates multi-agency municipal response directives awaiting human Director authorization.',
      highlights: [
        'Directives Catalog: Review cooling shelters activation, commercial HVAC curtailment, and water sprinkler dispatch.',
        'Resource Commitments: Real-time inventory of deployed hydration vans, misting tankers, and volunteers.',
        'Director Authorization: Cryptographically signed approval workflows with audit timestamps.'
      ]
    },
    {
      id: 'what-if-simulation-lab',
      name: 'What-If Simulation Lab (Bengaluru Crisis Simulator)',
      icon: 'science',
      desc: 'Test any question or crisis in Bengaluru (Cubbon Park Missing Child, Commercial Street Fire, Hebbal Flooding, Silk Board Jam) with tightly correlated consequences, real map coordinates, and realistic civic budgets.',
      highlights: [
        'Tackles Any Question: Type any scenario in Bengaluru or click 1-click popular tests (Missing Child, Fire, Flood, Gridlock, Power Cut).',
        'Direct, Correlated Consequences: Precise breakdowns for Traffic Delays, Public Utilities, Hospital Green Corridors, and BMTC/Metro advisories.',
        'Realistic Civic Budgets: Clear, proportional operational cost breakdowns in ₹ Lakhs and Thousands with itemized logistics and savings ratios.',
        'Authentic Bengaluru Leaflet Map: Flies directly to the incident location with pulsing pins and green bypass routes.',
        'Real-Time Levers: Move custom sliders (teams deployed, search radius, water depth) to see real-time updates.'
      ]
    },
    {
      id: 'resource-command',
      name: 'Resource Command',
      icon: 'local_shipping',
      desc: 'Live fleet GPS and asset inventory management for emergency municipal responders, automatically synchronized with the What-If Simulation Lab.',
      highlights: [
        'Simulation Sync: Whenever any crisis is simulated in the Lab, Resource Command automatically updates with dedicated fleet vehicles, incident coordinates, and budget spend.',
        'Active Fleets: 108 GVK-EMRI Ambulances, BMTC Feeder Shuttles, KSFES Fire Tenders, BBMP Dewatering Pumps, Police SAR Units, and BESCOM Mobile Substations.',
        'Interactive Control: Reroute vehicles on the fly, confirm on-scene commitment, and dispatch mutual-aid auxiliary units.'
      ]
    },
    {
      id: 'department-workspaces',
      name: 'Department Workspaces',
      icon: 'domain',
      desc: 'Dedicated operational cockpits tailored for individual Bengaluru government authorities.',
      highlights: [
        'BESCOM: Substation SCADA telemetry, transformer cooling, and load shedding matrices.',
        'BMRCL & BMTC: Metro train headways, traction substations, and thermal track speed limits.',
        'BTP Traffic Police: Real-time corridor delay metrics with live OSRM routing and adaptive signal timing.',
        'BBMP Civic: 8 Administrative zones with population density and Indira Canteen cooling shelters.',
        'BWSSB Water Works: Cauvery Stage-IV & V master pumping pressures and emergency urban misting supply.'
      ]
    }
  ];

  return (
    <div className="flex flex-col w-full pb-16 animate-fade-in">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-[#171b26] via-[#1c1f2a] to-[#171b26] border border-[#262a35] rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(#4cd7f6_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary flex items-center justify-center text-primary shrink-0 shadow-lg">
              <span className="material-symbols-outlined text-[28px]">help_center</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-label-caps text-xs text-primary uppercase font-bold tracking-widest">
                  OPERATIONAL MANUAL &amp; USER GUIDE
                </span>
                <span className="bg-primary/20 text-primary border border-primary/40 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                  MADE BY TAVISHSK
                </span>
                <span className="bg-tertiary/20 text-tertiary border border-tertiary/40 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                  BENGALURU COMMAND v4.9
                </span>
              </div>
              <h1 className="font-headline-sm text-2xl text-white font-extrabold tracking-tight">
                How to Use City OS Central Intelligence
              </h1>
              <p className="font-body-sm text-xs text-on-surface-variant max-w-2xl mt-1 leading-relaxed">
                Learn how to monitor real-time Bengaluru public data, navigate the interactive GIS map, understand live telemetry, simulate crisis scenarios, and orchestrate municipal emergency response.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('city-overview-dashboard')}
            className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Back to Dashboard</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs for Help Sections */}
      <div className="flex items-center gap-2 border-b border-[#262a35] pb-3 mb-6 overflow-x-auto">
        {[
          { id: 'tutorial', label: 'Quick Start Tutorial', icon: 'school' },
          { id: 'features', label: 'All 8 Consoles & Features', icon: 'apps' },
          { id: 'data', label: 'Real Public APIs & Telemetry', icon: 'database' },
          { id: 'faq', label: 'FAQ & Tips', icon: 'quiz' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === tab.id
                ? 'bg-primary text-on-primary font-bold shadow-md'
                : 'bg-[#171b26] text-on-surface-variant hover:text-white hover:bg-[#262a35] border border-[#262a35]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Quick Start Tutorial */}
      {activeCategory === 'tutorial' && (
        <div className="flex flex-col gap-6">
          {/* Layman Overview Box */}
          <div className="bg-gradient-to-r from-[#171b26] to-[#1c1f2a] border border-cyan-500/30 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">lightbulb</span>
              <span>In Plain &amp; Simple English: What is this website doing and what problem does it solve?</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="bg-[#0f131d] p-4 rounded-xl border border-red-500/20">
                <span className="text-red-400 font-bold text-xs uppercase font-mono block mb-1">
                  ❌ The Real Problem in Bengaluru:
                </span>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  In Bengaluru, critical agencies work in separate silos. When heavy rain floods Hebbal flyover or Silk Board jams up, the Traffic Police (BTP) doesn't know where BBMP water pumps are, BESCOM power teams don't know which roads are blocked, and emergency ambulances carrying patients get stuck for hours. This causes chaos, missed flights, power cuts, and huge economic losses.
                </p>
              </div>

              <div className="bg-[#0f131d] p-4 rounded-xl border border-cyan-500/20">
                <span className="text-cyan-400 font-bold text-xs uppercase font-mono block mb-1">
                  ✅ How City OS Solves It:
                </span>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  City OS brings all Bengaluru data together into one live screen: real weather, live road congestion (OSRM), power substation loads (BESCOM), and metro trains (BMRCL). Instead of taking 4 hours of phone calls, City OS coordinates water pumps, traffic diversions, and emergency backup power within 12 minutes.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              step: '01',
              title: 'Monitor Live Bengaluru Header',
              icon: 'sensors',
              color: 'text-primary',
              desc: 'The top navigation header streams live weather, air quality, and grid load for Bengaluru. Notice the live auto-sync countdown timer or click "SYNC TELEMETRY" at any time to force an immediate refresh.',
              action: 'Click "SYNC TELEMETRY" anytime to fetch live Open-Meteo & OSRM data.'
            },
            {
              step: '02',
              title: 'Switch Active Scenarios',
              icon: 'tune',
              color: 'text-secondary',
              desc: 'Use the SCENARIO dropdown in the header to simulate different real conditions: Heatwave Alpha (Zone 4 Central Core stress), Silk Board Choke (Outer Ring Road transit gridlock), or Peenya Industrial Outage.',
              action: 'Watch all telemetry numbers and charts recalibrate dynamically.'
            },
            {
              step: '03',
              title: 'Explore the Interactive Map',
              icon: 'map',
              color: 'text-tertiary',
              desc: 'Navigate to "Map & Zone Explorer". The map uses free Esri and OpenStreetMap tiles with zero API keys. You can toggle between Tactical Dark and Street Map, click on any substation or hospital, and use camera presets.',
              action: 'Try clicking "Silk Board" or "MG Road Core" on the map toolbar.'
            },
            {
              step: '04',
              title: 'De-Clutter with Dashboard Views',
              icon: 'layers',
              color: 'text-primary',
              desc: 'On the City Overview Dashboard, use the new view switcher tabs (Spatial Map, Grid & Traffic, Incident Matrix, or Complete Overview) so all elements are not congested into a single long scroll.',
              action: 'Switch views based on your current operational focus.'
            },
            {
              step: '05',
              title: 'Sever Cascading Chains',
              icon: 'account_tree',
              color: 'text-error',
              desc: 'In the "Citywide Impact Chain", inspect how a heat spike at HAL Substation 04 cascades down to St. John\'s Hospital and Namma Metro. Click on nodes to simulate firewalling lines before the grid collapses.',
              action: 'Simulate inter-agency firewalls to safeguard civic health.'
            },
            {
              step: '06',
              title: 'Simulate Any Bengaluru Crisis',
              icon: 'science',
              color: 'text-cyan-400',
              desc: 'In the "What-If Simulation Lab", test real crises like Flooding at Hebbal, Silk Board Gridlock, or Power Blackouts. Type any custom situation, see plain-English consequences on traffic, water, and power, and view live map bypass routes.',
              action: 'Try typing "Hebbal has been flooded" or click 1-click popular tests.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 flex flex-col justify-between hover:border-[#3d494c] transition-all shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#262a35] text-primary">
                    STEP {item.step}
                  </span>
                  <span className={`material-symbols-outlined text-[24px] ${item.color}`}>
                    {item.icon}
                  </span>
                </div>
                <h3 className="font-headline-sm text-base text-white font-bold mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>
              <div className="bg-[#1c1f2a] p-2.5 rounded-lg border border-[#262a35] font-mono text-[11px] text-tertiary">
                💡 <strong>Tip:</strong> {item.action}
              </div>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* Tab 2: All 8 Consoles & Features */}
      {activeCategory === 'features' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featuresList.map((feat) => (
            <div
              key={feat.id}
              className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 flex flex-col justify-between hover:border-[#3d494c] transition-all shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">{feat.icon}</span>
                    <h3 className="font-headline-sm text-base text-white font-bold">{feat.name}</h3>
                  </div>
                  <button
                    onClick={() => onNavigateTab(feat.id)}
                    className="bg-[#262a35] hover:bg-primary hover:text-on-primary text-primary px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Open</span>
                    <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                  </button>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant mb-4">
                  {feat.desc}
                </p>
                <div className="bg-[#1c1f2a] p-3 rounded-lg border border-[#262a35] mb-2">
                  <span className="font-label-caps text-[10px] text-primary uppercase font-bold tracking-wider block mb-2">
                    CAPABILITIES &amp; HIGHLIGHTS
                  </span>
                  <ul className="flex flex-col gap-1.5 font-mono text-[11px] text-on-surface">
                    {feat.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        <span className="text-tertiary font-bold mt-0.5">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Real Public APIs & Telemetry */}
      {activeCategory === 'data' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <span className="material-symbols-outlined text-[24px]">cloud</span>
                <h3 className="font-headline-sm text-base text-white font-bold">Open-Meteo Weather API</h3>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mb-3">
                Live ambient atmospheric telemetry sampled at exact Bengaluru municipal center (12.9716° N, 77.5946° E).
              </p>
              <ul className="font-mono text-[11px] text-on-surface flex flex-col gap-2 bg-[#1c1f2a] p-3 rounded-lg border border-[#262a35]">
                <li>• Real-Time Temperature &amp; Apparent Feels-Like</li>
                <li>• Relative Humidity &amp; Wind Speed (10m)</li>
                <li>• Surface Barometric Pressure (hPa)</li>
                <li>• Hourly Diurnal Temperature Curves</li>
                <li>• 100% Free, Zero API Key Required</li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-[#262a35] text-[10px] font-mono text-tertiary">
              ✓ Status: Real-Time Stream Active
            </div>
          </div>

          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-secondary mb-2">
                <span className="material-symbols-outlined text-[24px]">air</span>
                <h3 className="font-headline-sm text-base text-white font-bold">Open-Meteo Air Quality</h3>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mb-3">
                Live atmospheric chemical sensor telemetry cross-referenced with Karnataka State Pollution Control Board (KSPCB).
              </p>
              <ul className="font-mono text-[11px] text-on-surface flex flex-col gap-2 bg-[#1c1f2a] p-3 rounded-lg border border-[#262a35]">
                <li>• US AQI (Air Quality Index) Standard</li>
                <li>• Fine Particulate Matter PM2.5 &amp; PM10</li>
                <li>• Ground-Level Ozone (O3) Plume Monitoring</li>
                <li>• Nitrogen Dioxide (NO2) &amp; Carbon Monoxide</li>
                <li>• Monitored at Silk Board / BTM Mesh</li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-[#262a35] text-[10px] font-mono text-tertiary">
              ✓ Status: Real-Time Stream Active
            </div>
          </div>

          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-tertiary mb-2">
                <span className="material-symbols-outlined text-[24px]">traffic</span>
                <h3 className="font-headline-sm text-base text-white font-bold">OSRM Live Corridor Routing</h3>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mb-3">
                Live open-source routing calculations querying travel durations and delays across Bengaluru's high-congestion corridors.
              </p>
              <ul className="font-mono text-[11px] text-on-surface flex flex-col gap-2 bg-[#1c1f2a] p-3 rounded-lg border border-[#262a35]">
                <li>• Silk Board ↔ Marathahalli (Outer Ring Rd)</li>
                <li>• Hebbal Flyover ↔ Manyata Tech Park</li>
                <li>• Tin Factory / KR Puram ↔ ITPL Whitefield</li>
                <li>• Electronic City Elevated Tollway</li>
                <li>• Dynamically adjusted for peak commute delay</li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-[#262a35] text-[10px] font-mono text-tertiary">
              ✓ Status: Real-Time Stream Active
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: FAQ & Tips */}
      {activeCategory === 'faq' && (
        <div className="flex flex-col gap-4">
          {[
            {
              q: 'Why was "API key required" showing on the map earlier?',
              a: 'CartoDB recently began watermarking direct unauthenticated web tile access with "API key required". We replaced that with official Esri Dark Gray Canvas and OpenStreetMap tile servers, which are 100% free, require zero API keys, and never show watermarks.'
            },
            {
              q: 'How frequently does Bengaluru live data refresh?',
              a: 'The system runs an automatic background sync every 45 seconds. Additionally, whenever you refresh your browser or click the "SYNC TELEMETRY" button in the header, all live APIs (Open-Meteo Weather, Air Quality, and OSRM Road Routing) are queried instantly.'
            },
            {
              q: 'How do I avoid having all elements congested in a single page?',
              a: 'Use the new "Dashboard View Switcher" on the City Overview Dashboard. You can select "Tactical Map", "Grid & Traffic", or "Incident Matrix" to focus on one operational view at a time without endless scrolling.'
            },
            {
              q: 'What do the BBMP Zones mean on the map?',
              a: 'Bruhat Bengaluru Mahanagara Palike (BBMP) divides Bengaluru into 8 administrative zones. Zone 4 represents the Central Core (MG Road, Cubbon Park, Indiranagar), Zone 7 is Peenya Industrial Hub, and Zone 6 is Bommanahalli & Silk Board.'
            },
            {
              q: 'Who built this system?',
              a: 'City OS // Central Intelligence — Bengaluru Command was designed and engineered by TavishSK as a unified municipal telemetry and crisis orchestration platform for Bangalore, India.'
            }
          ].map((faq, fIdx) => (
            <div key={fIdx} className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 shadow-sm">
              <h4 className="font-headline-sm text-sm text-white font-bold flex items-center gap-2 mb-2">
                <span className="text-primary font-mono">Q:</span>
                <span>{faq.q}</span>
              </h4>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
