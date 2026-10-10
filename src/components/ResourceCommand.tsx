import React, { useState } from 'react';
import { TrafficCorridor, SubstationTelemetry, MetroLineStatus } from '../services/bengaluruData';

interface ResourceCommandProps {
  corridors: TrafficCorridor[];
  substations: SubstationTelemetry[];
  metroLines: MetroLineStatus[];
  onNavigateTab: (tab: any) => void;
}

export const ResourceCommand: React.FC<ResourceCommandProps> = ({
  corridors,
  substations,
  metroLines,
  onNavigateTab
}) => {
  const [filterType, setFilterType] = useState<'all' | 'power' | 'transit' | 'health' | 'water'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fleetAssets = [
    {
      id: 'ast-01',
      name: 'Mobile Hydration Unit #BLR-HYD-01',
      type: 'water',
      agency: 'BBMP Public Health',
      location: 'MG Road Metro Station',
      status: 'DISPATCHED',
      statusClass: 'text-tertiary bg-tertiary/10',
      eta: '4 mins',
      capacity: '3,000 Liters Chilled Water'
    },
    {
      id: 'ast-02',
      name: 'Heavy Diesel Gen-Set #GEN-FLEET-04',
      type: 'power',
      agency: 'BESCOM Emergency Reserve',
      location: 'En route to St. John\'s Hospital',
      status: 'COMMITTED',
      statusClass: 'text-primary bg-primary/10',
      eta: '8 mins',
      capacity: '500 kVA / 400 kW'
    },
    {
      id: 'ast-03',
      name: 'Advanced Life Support Ambulance #EMS-BLR-14',
      type: 'health',
      agency: 'DHS 108 Emergency',
      location: 'Silk Board Junction Flyover Ramp',
      status: 'ON SCENE',
      statusClass: 'text-error bg-error/10',
      eta: 'On Site',
      capacity: 'Trauma ICU & Paramedic Team'
    },
    {
      id: 'ast-04',
      name: 'BMTC EV Feeder Shuttle Fleet (4 Vans)',
      type: 'transit',
      agency: 'BMTC Transit',
      location: 'KBS Majestic to Kanteerava Pavilion',
      status: 'ACTIVE WAVE',
      statusClass: 'text-secondary bg-secondary/10',
      eta: 'Continuous (8m Headway)',
      capacity: '32 Passengers / Pod'
    },
    {
      id: 'ast-05',
      name: 'Mobile Substation Transformer 4B',
      type: 'power',
      agency: 'BESCOM Grid Ops',
      location: 'HAL 66kV Substation Auxiliary Bay',
      status: 'ENERGIZED',
      statusClass: 'text-primary bg-primary/10',
      eta: 'Online',
      capacity: '35 MW Thermal Load Shedding'
    },
    {
      id: 'ast-06',
      name: 'BWSSB Rapid High-Pressure Sprayer 07',
      type: 'water',
      agency: 'BWSSB / BBMP SWM',
      location: 'Peenya Industrial Area Stage 1',
      status: 'SPRAYING',
      statusClass: 'text-tertiary bg-tertiary/10',
      eta: 'Active 45m',
      capacity: '12,000 L Greywater Misting'
    }
  ];

  const filteredAssets = fleetAssets.filter(
    a => filterType === 'all' || a.type === filterType
  );

  return (
    <div className="flex flex-col w-full gap-4 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#171b26] p-4 rounded-xl border border-[#262a35] shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-caps text-label-caps text-primary uppercase">
              MUNICIPAL ASSET LOGISTICS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-data-mono-sm text-data-mono-sm text-tertiary">
              42/48 ACTIVE IN BENGALURU
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
            Resource Command &amp; Fleet Logistics
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Cross-agency dispatch tracking for BESCOM generators, BMTC shuttles, BBMP hydration pods, and emergency health units.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#1c1f2a] p-1 rounded-lg border border-[#262a35] flex-wrap">
          {(['all', 'power', 'transit', 'health', 'water'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded font-data-mono-sm text-data-mono-sm uppercase transition-all ${
                filterType === type
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-[#262a35]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="bg-[#171b26] p-3.5 rounded-xl border border-[#262a35] shadow-md hover:bg-[#1c1f2a] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-data-mono-sm text-data-mono-sm text-outline uppercase">{asset.agency}</span>
                <span className={`px-2 py-0.5 rounded font-data-mono-sm text-[10px] font-bold ${asset.statusClass}`}>
                  {asset.status}
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-1">
                {asset.name}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">
                Current Location: <span className="text-on-surface font-medium">{asset.location}</span>
              </p>
              <div className="bg-[#0a0e18] p-2 rounded border border-[#262a35] text-xs font-mono mb-3">
                <div className="flex justify-between text-outline-variant mb-1">
                  <span>Capacity / Spec:</span>
                  <span className="text-primary font-semibold">{asset.capacity}</span>
                </div>
                <div className="flex justify-between text-outline-variant">
                  <span>Transit ETA:</span>
                  <span className="text-tertiary font-bold">{asset.eta}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#262a35]">
              <span className="font-data-mono-sm text-[10px] text-outline">ID: #{asset.id}</span>
              <button
                onClick={() => {
                  setToastMessage(`Dispatched instructions updated for ${asset.name}.`);
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="px-3 py-1 bg-[#262a35] hover:bg-primary hover:text-on-primary text-on-surface rounded font-data-mono-sm text-[11px] transition-colors border border-[#3d494c]"
              >
                REROUTE ASSET
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Substation & Transit Readiness Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-2">
        {/* BESCOM Power Substations */}
        <div className="bg-[#171b26] p-4 rounded-xl border border-[#262a35] shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">bolt</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                BESCOM Grid Substations Readiness
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('city-overview-dashboard')}
              className="text-primary text-xs font-mono hover:underline"
            >
              View Telemetry →
            </button>
          </div>
          <div className="space-y-2">
            {substations.map((sub) => (
              <div key={sub.id} className="p-2.5 bg-[#1c1f2a] rounded-lg border border-[#262a35] flex items-center justify-between">
                <div>
                  <div className="font-data-mono-sm text-data-mono-sm text-on-surface font-bold">{sub.name}</div>
                  <div className="font-body-sm text-[11px] text-on-surface-variant">
                    {sub.zone} • {sub.voltageClass}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-data-mono-sm text-data-mono-sm text-primary font-bold">
                    {sub.currentLoadMw} / {sub.capacityMw} MW ({sub.loadPercentage}%)
                  </div>
                  <div className={`font-data-mono-sm text-[10px] ${sub.coolingStatus === 'NORMAL' ? 'text-tertiary' : 'text-error'}`}>
                    Temp: {sub.transformerTempC}°C • {sub.coolingStatus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Namma Metro & Corridors */}
        <div className="bg-[#171b26] p-4 rounded-xl border border-[#262a35] shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">subway</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Namma Metro Operational Corridor Sync
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('ai-predictions-and-alerts')}
              className="text-secondary text-xs font-mono hover:underline"
            >
              View Restrictions →
            </button>
          </div>
          <div className="space-y-2">
            {metroLines.map((line) => (
              <div key={line.lineId} className="p-2.5 bg-[#1c1f2a] rounded-lg border border-[#262a35] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: line.colorHex }}></span>
                  <div>
                    <div className="font-data-mono-sm text-data-mono-sm text-on-surface font-bold">{line.name}</div>
                    <div className="font-body-sm text-[11px] text-on-surface-variant">
                      {line.stationsCount} Stations • {line.lengthKm} km • {line.dailyRidershipApprox}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#262a35] text-primary">
                    Headway {line.headwayMinutes}m
                  </span>
                  <div className="text-[10px] font-mono text-outline mt-1">{line.operationalStatus}</div>
                </div>
              </div>
            ))}
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
