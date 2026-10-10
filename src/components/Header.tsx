import React from 'react';
import { BengaluruWeather, BengaluruAirQuality } from '../services/bengaluruData';

interface HeaderProps {
  weather: BengaluruWeather | null;
  airQuality: BengaluruAirQuality | null;
  activeScenario: string;
  setActiveScenario: (scenario: string) => void;
  onRefreshTelemetry: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  weather,
  airQuality,
  activeScenario,
  setActiveScenario,
  onRefreshTelemetry,
  isRefreshing
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#171b26]/95 backdrop-blur-xl border-b border-[#262a35] shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
      <div className="h-16 w-full px-4 flex items-center justify-between gap-3">
        {/* Logo and Node Identity */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img
            alt="City OS Neural Node Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1Vz_C8tfx6tkblAu1QT1D-qzu6-N_18wSdrctZKM7W9eBHThnt6QyJm62L_fIlLcRWAx9AsU8JLqPh7cHopLI2JyhYhKo7lWvxR9JrIXF4bl_ktEpvOx5Jwa5RoBV2BtAEy2lygkX5t25lujiyON4kvU5f0Wl3RvhbqDL_SnCj_v-tE2ETOTezaSSDiE1g_wSEqy-dDX3pLTIqK1MS21pKRv1N0Eb45Zq_Ub2qUgBaW2VmFS-ZjbdtsSpQ"
          />
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps tracking-widest text-primary uppercase">
              CITY OS // CENTRAL INTELLIGENCE
            </span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              <span className="font-data-mono-sm text-data-mono-sm text-tertiary">
                NODE_ACTIVE: BENGALURU_MUNICIPAL_CORE_01
              </span>
            </div>
          </div>
        </div>

        {/* Live Real-Time Weather & Ticker Strip */}
        <div className="hidden xl:flex items-center gap-2 bg-[#1c1f2a] px-3 py-1 rounded-lg border border-[#262a35]">
          <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
          <span className="font-label-caps text-label-caps uppercase text-error">
            STATUS: ADVISORY - LEVEL 3 HEATWAVE
          </span>
          <span className="font-data-mono-sm text-data-mono-sm text-outline-variant">|</span>
          <span className="font-data-mono-sm text-data-mono-sm text-primary">
            {weather ? `${weather.temperature}°C (PEAK ${weather.peakExpectedTemp}°C)` : '34.2°C PEAK'}
          </span>
          <span className="font-data-mono-sm text-data-mono-sm text-outline-variant">|</span>
          <span className="font-data-mono-sm text-data-mono-sm text-secondary">
            {airQuality ? `AQI ${airQuality.aqi} (${airQuality.statusText})` : 'AQI 84'}
          </span>
          <span className="font-data-mono-sm text-data-mono-sm text-outline-variant">|</span>
          <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-tertiary">trending_up</span>
            BESCOM: 3,420 MW GRID
          </span>
        </div>

        {/* Scenario Switcher */}
        <div className="hidden lg:flex items-center bg-[#262a35] px-2.5 py-1 rounded-lg border border-[#313540]">
          <span className="font-label-caps text-label-caps text-outline uppercase mr-1.5">SCENARIO:</span>
          <select
            value={activeScenario}
            onChange={(e) => setActiveScenario(e.target.value)}
            className="bg-transparent font-data-mono-sm text-data-mono-sm text-primary focus:outline-none cursor-pointer"
          >
            <option value="heatwave" className="bg-[#262a35] text-on-surface">Active: Heatwave Alpha (Bengaluru)</option>
            <option value="silkboard" className="bg-[#262a35] text-on-surface">Traffic Corridor: Silk Board Choke</option>
            <option value="peenya" className="bg-[#262a35] text-on-surface">Peenya Industrial Waste Disruption</option>
          </select>
        </div>

        {/* Live Sync Trigger & Refresh */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRefreshTelemetry}
            disabled={isRefreshing}
            title="Refresh Live Bengaluru Telemetry"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1c1f2a] hover:bg-[#262a35] text-primary hover:text-white rounded-lg border border-[#262a35] transition-all text-xs font-mono"
          >
            <span className={`material-symbols-outlined text-[16px] ${isRefreshing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span className="hidden sm:inline font-data-mono-sm text-data-mono-sm">
              {isRefreshing ? 'SYNCING...' : 'LIVE BENGALURU SYNC'}
            </span>
          </button>
        </div>

        {/* User Profile & Notifications */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            className="relative p-1 text-on-surface-variant hover:text-on-surface transition-colors"
            title="Active Municipal Alerts"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-0 right-0 bg-error text-surface-container-lowest font-data-mono-sm text-[9px] font-bold px-1 rounded-full">
              4
            </span>
          </button>
          <div className="flex items-center gap-2 bg-[#1c1f2a] px-2 py-1 rounded-lg border border-[#262a35]">
            <img
              alt="Profile"
              className="w-7 h-7 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGRW2UmswjUREroOwpJgy3e741IuyoiORkTt5AsFPlrhMTv4FxEkIkAoaDxd4MmZuZwtXWoFqd-3CikGFVLBCy-PNaIo-sSWEUUeFcj3VwResSiTsK4ijFldHqBJwopUgi5hKMGx9NRep8rai9QPAqiZO-U0maO9eAKVVqrE-4qEGnIzMmfHfO7EH88Vsh0x13gKhf1FAI_L-EyUf-dVGLl08DvL4NdAsQj-15Qx4D3dZrYbv6g0-D"
            />
            <div className="hidden 2xl:flex flex-col text-left">
              <span className="font-headline-sm text-body-sm text-on-surface font-semibold leading-tight">
                Dir. Elena Vance
              </span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                BBMP / BTP Ops Command
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
