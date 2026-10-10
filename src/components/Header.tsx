import React, { useState, useEffect } from 'react';
import { BengaluruWeather, BengaluruAirQuality } from '../services/bengaluruData';

interface HeaderProps {
  weather: BengaluruWeather | null;
  airQuality: BengaluruAirQuality | null;
  activeScenario: string;
  setActiveScenario: (scenario: string) => void;
  onRefreshTelemetry: () => void;
  isRefreshing: boolean;
  onOpenGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  weather,
  airQuality,
  activeScenario,
  setActiveScenario,
  onRefreshTelemetry,
  isRefreshing,
  onOpenGuide
}) => {
  const [secondsUntilSync, setSecondsUntilSync] = useState<number>(45);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilSync((prev) => (prev <= 1 ? 45 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualSync = () => {
    setSecondsUntilSync(45);
    onRefreshTelemetry();
  };

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
            <div className="flex items-center gap-2">
              <span className="font-label-caps text-label-caps tracking-widest text-primary uppercase font-bold">
                CITY OS // CENTRAL INTELLIGENCE
              </span>
              <span className="bg-primary/20 text-primary border border-primary/40 px-1.5 py-0.2 rounded font-mono text-[9px] font-bold">
                MADE BY TAVISHSK
              </span>
            </div>
            <div className="flex items-center gap-1.5">
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
          <span className="font-label-caps text-label-caps uppercase text-error font-semibold">
            STATUS: ADVISORY - LEVEL 3 HEATWAVE
          </span>
          <span className="font-data-mono-sm text-data-mono-sm text-outline-variant">|</span>
          <span className="font-data-mono-sm text-data-mono-sm text-primary font-bold">
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
          <div className="hidden sm:flex flex-col text-right font-mono text-[10px] text-on-surface-variant">
            <span className="text-tertiary font-bold flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              {weather?.lastUpdated ? `LIVE SYNC: ${weather.lastUpdated}` : 'LIVE CONNECTED'}
            </span>
            <span className="text-outline text-[9px]">Auto-sync in {secondsUntilSync}s</span>
          </div>

          <button
            onClick={handleManualSync}
            disabled={isRefreshing}
            title="Refresh Live Bengaluru Telemetry (Open-Meteo & OSRM)"
            className="flex items-center gap-1.5 px-3 py-1 bg-[#1c1f2a] hover:bg-primary hover:text-on-primary text-primary rounded-lg border border-[#262a35] hover:border-primary transition-all text-xs font-mono font-bold shadow-md cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[16px] ${isRefreshing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span className="hidden md:inline font-data-mono-sm text-data-mono-sm">
              {isRefreshing ? 'SYNCING...' : 'SYNC TELEMETRY'}
            </span>
          </button>

          {/* Quick System Guide Button */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              title="Open System Operations & Screen Guide"
              className="bg-[#262a35] hover:bg-[#353944] text-primary px-2.5 py-1 rounded-lg border border-[#3d494c] text-xs font-mono flex items-center gap-1 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">help_outline</span>
              <span className="hidden xl:inline text-[11px] font-bold">GUIDE</span>
            </button>
          )}
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
          <div className="flex items-center gap-2 bg-[#1c1f2a] px-2.5 py-1 rounded-lg border border-[#3d494c] shadow-md">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary flex items-center justify-center font-mono font-bold text-primary text-xs">
              TS
            </div>
            <div className="hidden 2xl:flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="font-headline-sm text-body-sm text-on-surface font-bold leading-tight">
                  TavishSK
                </span>
                <span className="text-[9px] text-tertiary bg-tertiary/10 px-1 rounded">CREATOR</span>
              </div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[9px]">
                Chief Systems Architect // BLR
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
