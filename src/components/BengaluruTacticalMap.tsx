import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

export interface SimulationIncident {
  coords: [number, number];
  title: string;
  type: string;
  severity: 'critical' | 'high' | 'moderate' | string;
  waterLevel?: string;
  delay?: string;
  description: string;
  radiusMeters?: number;
  affectedRoad?: string;
  detourRoute?: [number, number][];
  detourLabel?: string;
}

interface BengaluruTacticalMapProps {
  height?: string;
  activeLayer?: string;
  selectedZone?: string;
  onSelectZone?: (zoneId: string) => void;
  interactive?: boolean;
  showControls?: boolean;
  simulationIncident?: SimulationIncident | null;
  customCenter?: [number, number];
  customZoom?: number;
}

// Real coordinates of Bengaluru Landmarks, Substations, Hospitals, and Transit Chokepoints
const BENGALURU_LOCATIONS = {
  center: [12.9716, 77.5946] as [number, number], // MG Road / Vidhana Soudha Central Business District
  substations: [
    { id: 'hal', name: 'HAL 66/11kV Substation 04', coords: [12.9568, 77.6622] as [number, number], temp: '88.4°C', load: '94.2%', status: 'THERMAL CRITICAL' },
    { id: 'peenya', name: 'Peenya 220/66kV Substation', coords: [13.0285, 77.5195] as [number, number], temp: '74.2°C', load: '89.2%', status: 'HIGH LOAD' },
    { id: 'hoodi', name: 'Hoodi 400/220kV Master Grid', coords: [12.9912, 77.7126] as [number, number], temp: '66.1°C', load: '78.5%', status: 'NOMINAL' },
    { id: 'ecity', name: 'Electronic City 66kV Substation', coords: [12.8452, 77.6602] as [number, number], temp: '69.4°C', load: '81.4%', status: 'NOMINAL' },
    { id: 'austin', name: 'Austin Town 66kV Substation', coords: [12.9610, 77.6150] as [number, number], temp: '81.2°C', load: '86.7%', status: 'ELEVATED' },
    { id: 'hebbal', name: 'Hebbal 220kV Substation', coords: [13.0358, 77.5970] as [number, number], temp: '71.0°C', load: '76.8%', status: 'NOMINAL' },
  ],
  hospitals: [
    { id: 'stjohns', name: "St. John's Medical College ER", coords: [12.9287, 77.6212] as [number, number], beds: '96% Full', heatCases: '+18 cases/hr', status: 'CAPACITY CRITICAL' },
    { id: 'bowring', name: 'Bowring & Lady Curzon Hospital', coords: [12.9833, 77.6033] as [number, number], beds: '91% Full', heatCases: '+14 cases/hr', status: 'TRIAGE ACTIVE' },
    { id: 'victoria', name: 'Victoria Hospital / BMCRI', coords: [12.9634, 77.5744] as [number, number], beds: '88% Full', heatCases: '+11 cases/hr', status: 'HIGH LOAD' },
    { id: 'manipal', name: 'Manipal Hospital Old Airport Rd', coords: [12.9582, 77.6486] as [number, number], beds: '89% Full', heatCases: '+9 cases/hr', status: 'HIGH LOAD' },
    { id: 'nimhans', name: 'NIMHANS Hosur Road Core', coords: [12.9392, 77.5960] as [number, number], beds: '79% Full', heatCases: '+6 cases/hr', status: 'NOMINAL' },
    { id: 'narayana', name: 'Narayana Health City Bommasandra', coords: [12.8016, 77.6983] as [number, number], beds: '74% Full', heatCases: '+4 cases/hr', status: 'NOMINAL' },
  ],
  trafficHotspots: [
    { id: 'silkboard', name: 'Central Silk Board Junction', coords: [12.9172, 77.6229] as [number, number], delay: '+28m delay', speed: '13 km/h', level: 'CRITICAL CHOKE' },
    { id: 'tinfactory', name: 'Tin Factory / KR Puram Bridge', coords: [12.9984, 77.6698] as [number, number], delay: '+24m delay', speed: '12 km/h', level: 'CRITICAL CHOKE' },
    { id: 'hebbalflyover', name: 'Hebbal Flyover / Airport Artery', coords: [13.0358, 77.5970] as [number, number], delay: '+17m delay', speed: '16 km/h', level: 'HIGH CONGESTION' },
    { id: 'marathahalli', name: 'Marathahalli Bridge ORR', coords: [12.9591, 77.6974] as [number, number], delay: '+22m delay', speed: '14 km/h', level: 'HIGH CONGESTION' },
    { id: 'goragunte', name: 'Goraguntepalya / Tumkur Rd', coords: [13.0285, 77.5385] as [number, number], delay: '+19m delay', speed: '15 km/h', level: 'HIGH CONGESTION' },
  ],
  coolingHubs: [
    { id: 'indira-indiranagar', name: 'Indira Canteen Indiranagar (Cooling Hub 01)', coords: [12.9784, 77.6408] as [number, number], capacity: '120 persons', water: 'Available (ORS)' },
    { id: 'indira-domlur', name: 'Indira Canteen Domlur (Cooling Hub 02)', coords: [12.9609, 77.6387] as [number, number], capacity: '90 persons', water: 'Available (Misting)' },
    { id: 'indira-shankar', name: 'Indira Canteen MG Road / Shantinagar', coords: [12.9580, 77.6000] as [number, number], capacity: '150 persons', water: 'High Demand' },
    { id: 'indira-peenya', name: 'Indira Canteen Peenya 2nd Stage', coords: [13.0250, 77.5150] as [number, number], capacity: '200 persons', water: 'High Capacity' },
    { id: 'indira-silkboard', name: 'Indira Canteen BTM / Silk Board', coords: [12.9150, 77.6180] as [number, number], capacity: '110 persons', water: 'Available' },
  ],
  // Namma Metro Purple Line track coordinates (Whitefield to Challaghatta)
  purpleLine: [
    [12.9177, 77.4838], // Challaghatta
    [12.9250, 77.4980], // Kengeri
    [12.9510, 77.5350], // Mysore Road
    [12.9740, 77.5680], // Majestic (Interchange)
    [12.9756, 77.6066], // MG Road
    [12.9784, 77.6408], // Indiranagar
    [12.9900, 77.6530], // Swami Vivekananda Rd
    [12.9930, 77.6680], // Baiyappanahalli
    [12.9984, 77.6950], // KR Puram
    [12.9863, 77.7380], // ITPL / Whitefield
  ] as [number, number][],
  // Namma Metro Green Line track coordinates (Nagasandra to Silk Institute)
  greenLine: [
    [13.0450, 77.5150], // Nagasandra
    [13.0285, 77.5385], // Peenya
    [13.0100, 77.5500], // Yeshwanthpur
    [12.9740, 77.5680], // Majestic (Interchange)
    [12.9500, 77.5750], // Krishna Rajendra Market
    [12.9350, 77.5800], // South End Circle / Jayanagar
    [12.9100, 77.5700], // Banashankari
    [12.8700, 77.5600], // Silk Institute
  ] as [number, number][],
  // Real BBMP Polygon zones for Bengaluru
  bbmpPolygons: [
    {
      id: '4',
      name: 'Zone 04: Central Core (MG Rd / Indiranagar / Cubbon Park)',
      color: '#ef4444',
      fillColor: '#ef4444',
      risk: '94.2% CRITICAL HEAT DOME',
      temp: '41.2°C (+5.4°C Delta)',
      coords: [
        [12.9950, 77.5850],
        [12.9900, 77.6500],
        [12.9550, 77.6600],
        [12.9480, 77.5950],
        [12.9750, 77.5750],
      ] as [number, number][],
    },
    {
      id: '7',
      name: 'Zone 07: Peenya Industrial Hub / Dasarahalli',
      color: '#f59e0b',
      fillColor: '#f59e0b',
      risk: '89.2% HIGH POWER LOAD',
      temp: '38.9°C (Transformer Stressed)',
      coords: [
        [13.0550, 77.4950],
        [13.0450, 77.5500],
        [13.0050, 77.5450],
        [13.0100, 77.4850],
      ] as [number, number][],
    },
    {
      id: '5',
      name: 'Zone 05: Mahadevapura / Outer Ring Road & Whitefield',
      color: '#ec4899',
      fillColor: '#ec4899',
      risk: '92.0% SEVERE TRANSIT CHOKE',
      temp: '39.8°C (Corridor Gridlock)',
      coords: [
        [13.0100, 77.6650],
        [13.0150, 77.7550],
        [12.9450, 77.7600],
        [12.9250, 77.6800],
        [12.9550, 77.6650],
      ] as [number, number][],
    },
    {
      id: '6',
      name: 'Zone 06: Bommanahalli & Silk Board Corridor',
      color: '#f97316',
      fillColor: '#f97316',
      risk: '95.1% CONGESTION APEX',
      temp: '40.1°C (Heat Canyon)',
      coords: [
        [12.9350, 77.6100],
        [12.9300, 77.6650],
        [12.8750, 77.6850],
        [12.8800, 77.6050],
      ] as [number, number][],
    },
    {
      id: '9',
      name: 'Zone 09 / 02: West Corridor (Malleshwaram & Rajajinagar)',
      color: '#06b6d4',
      fillColor: '#06b6d4',
      risk: '68.4% MODERATE ADVISORY',
      temp: '35.8°C (Normal Flow)',
      coords: [
        [13.0200, 77.5450],
        [13.0150, 77.5850],
        [12.9750, 77.5650],
        [12.9800, 77.5350],
      ] as [number, number][],
    },
    {
      id: '12',
      name: 'Zone 12: South / Electronic City Corridor',
      color: '#10b981',
      fillColor: '#10b981',
      risk: '42.1% NOMINAL BUFFER',
      temp: '33.4°C (Optimal)',
      coords: [
        [12.8700, 77.6450],
        [12.8650, 77.7000],
        [12.8050, 77.7150],
        [12.8100, 77.6400],
      ] as [number, number][],
    },
    {
      id: '8',
      name: 'Zone 08: Yelahanka & Hebbal Airport Artery',
      color: '#8b5cf6',
      fillColor: '#8b5cf6',
      risk: '77.5% HIGHWAY ARTERY',
      temp: '36.2°C (Flowing)',
      coords: [
        [13.1150, 77.5650],
        [13.1100, 77.6350],
        [13.0300, 77.6250],
        [13.0350, 77.5600],
      ] as [number, number][],
    }
  ]
};

export const BengaluruTacticalMap: React.FC<BengaluruTacticalMapProps> = ({
  height = '620px',
  activeLayer = 'thermal',
  selectedZone = '4',
  onSelectZone,
  interactive = true,
  showControls = true,
  simulationIncident = null,
  customCenter,
  customZoom
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [mapStyle, setMapStyle] = useState<'esri' | 'osm'>('esri');
  const [currentCoords, setCurrentCoords] = useState<string>('12.9716° N, 77.5946° E (Bengaluru Core)');
  const [activeInspectTarget, setActiveInspectTarget] = useState<any>(null);

  // Initialize Leaflet Map centered explicitly on Bengaluru, India
  // Uses Esri Dark Gray Base & OpenStreetMap - ZERO API keys required, NO watermarks
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialCenter = customCenter || (simulationIncident ? simulationIncident.coords : BENGALURU_LOCATIONS.center);
    const initialZoom = customZoom || (simulationIncident ? 14 : 12);

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    // Public tile source: Esri World Dark Gray Base (No API key required)
    const initialTile = L.tileLayer(
      mapStyle === 'esri'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap &copy; Esri'
      }
    ).addTo(map);

    tileLayerRef.current = initialTile;

    // Mouse move coordinate tracker
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setCurrentCoords(`${e.latlng.lat.toFixed(4)}° N, ${e.latlng.lng.toFixed(4)}° E`);
    });

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update base tile style when mapStyle changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const newTile = L.tileLayer(
      mapStyle === 'esri'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap &copy; Esri'
      }
    ).addTo(map);

    tileLayerRef.current = newTile;
  }, [mapStyle]);

  // Update Layers & Overlays whenever activeLayer or selectedZone changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Render BBMP Zone Polygons (Bengaluru Administrative Borders)
    BENGALURU_LOCATIONS.bbmpPolygons.forEach((poly) => {
      const isSelected = selectedZone === poly.id || selectedZone === 'all';
      const polygon = L.polygon(poly.coords, {
        color: poly.color,
        fillColor: poly.fillColor,
        fillOpacity: isSelected ? 0.35 : 0.12,
        weight: isSelected ? 2.5 : 1,
        dashArray: isSelected ? undefined : '4, 4'
      });

      polygon.on('click', () => {
        if (onSelectZone) onSelectZone(poly.id);
        setActiveInspectTarget({
          type: 'ZONE',
          title: poly.name,
          risk: poly.risk,
          temp: poly.temp,
          desc: 'Bruhat Bengaluru Mahanagara Palike (BBMP) Municipal Sector Command'
        });
      });

      // Zone label marker at centroid
      const centerLat = poly.coords.reduce((sum, c) => sum + c[0], 0) / poly.coords.length;
      const centerLng = poly.coords.reduce((sum, c) => sum + c[1], 0) / poly.coords.length;

      const zoneIcon = L.divIcon({
        className: 'custom-zone-label',
        html: `
          <div style="background: rgba(10, 14, 24, 0.92); border: 1px solid ${poly.color}; color: ${poly.color}; padding: 2px 7px; border-radius: 4px; font-family: monospace; font-size: 10px; font-weight: bold; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.8);">
            ${poly.id === '4' ? 'ZONE 4 [CRITICAL CORE]' : poly.id === '7' ? 'ZONE 7 [PEENYA]' : poly.id === '6' ? 'ZONE 6 [SILK BOARD]' : `ZONE ${poly.id}`}
          </div>
        `,
        iconSize: [120, 24],
        iconAnchor: [60, 12]
      });

      L.marker([centerLat, centerLng], { icon: zoneIcon }).addTo(layerGroup);
      polygon.addTo(layerGroup);
    });

    // 2. Render Namma Metro Rail Lines (Purple & Green Lines)
    const purplePolyline = L.polyline(BENGALURU_LOCATIONS.purpleLine, {
      color: '#c084fc',
      weight: 4,
      opacity: 0.85,
      dashArray: '6, 4'
    }).addTo(layerGroup);

    purplePolyline.bindTooltip('NAMMA METRO PURPLE LINE (Challaghatta ↔ Majestic ↔ Indiranagar ↔ Whitefield)', {
      className: 'tactical-tooltip',
      sticky: true
    });

    const greenPolyline = L.polyline(BENGALURU_LOCATIONS.greenLine, {
      color: '#34d399',
      weight: 4,
      opacity: 0.85,
      dashArray: '6, 4'
    }).addTo(layerGroup);

    greenPolyline.bindTooltip('NAMMA METRO GREEN LINE (Nagasandra ↔ Peenya ↔ Majestic ↔ Silk Institute)', {
      className: 'tactical-tooltip',
      sticky: true
    });

    // 3. Render BESCOM Substations Layer
    if (activeLayer === 'substations' || activeLayer === 'all' || activeLayer === 'thermal') {
      BENGALURU_LOCATIONS.substations.forEach((sub) => {
        const isAlert = sub.status.includes('CRITICAL');
        const icon = L.divIcon({
          className: 'tactical-marker',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <span style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: ${isAlert ? '#ef4444' : '#06b6d4'}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
              <div style="background: #0a0e18; border: 1.5px solid ${isAlert ? '#ef4444' : '#06b6d4'}; color: ${isAlert ? '#ef4444' : '#06b6d4'}; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; box-shadow: 0 0 10px ${isAlert ? 'rgba(239,68,68,0.5)' : 'rgba(6,182,212,0.5)'};">
                ⚡
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker(sub.coords, { icon }).addTo(layerGroup);
        marker.on('click', () => {
          setActiveInspectTarget({
            type: 'BESCOM_SUBSTATION',
            title: sub.name,
            temp: sub.temp,
            load: sub.load,
            status: sub.status,
            desc: 'Bangalore Electricity Supply Company (BESCOM) SCADA Substation Unit'
          });
        });
      });
    }

    // 4. Render Hospitals & EMS Layer
    if (activeLayer === 'hospital' || activeLayer === 'ems' || activeLayer === 'all' || activeLayer === 'thermal') {
      BENGALURU_LOCATIONS.hospitals.forEach((hosp) => {
        const isCritical = hosp.status.includes('CRITICAL');
        const icon = L.divIcon({
          className: 'tactical-hospital-marker',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <div style="background: #0a0e18; border: 1.5px solid ${isCritical ? '#ef4444' : '#10b981'}; color: ${isCritical ? '#ef4444' : '#10b981'}; padding: 2px 5px; border-radius: 4px; display: flex; align-items: center; gap: 3px; font-size: 10px; font-family: monospace; font-weight: bold; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.8);">
                <span>🏥</span>
                <span>${hosp.name.split(' ')[0]}</span>
              </div>
            </div>
          `,
          iconSize: [80, 20],
          iconAnchor: [40, 10]
        });

        const marker = L.marker(hosp.coords, { icon }).addTo(layerGroup);
        marker.on('click', () => {
          setActiveInspectTarget({
            type: 'HOSPITAL',
            title: hosp.name,
            beds: hosp.beds,
            heatCases: hosp.heatCases,
            status: hosp.status,
            desc: 'DHS & BBMP Emergency Care Command Center'
          });
        });
      });
    }

    // 5. Render Traffic Chokepoints (BTP & OSRM)
    if (activeLayer === 'traffic' || activeLayer === 'all') {
      BENGALURU_LOCATIONS.trafficHotspots.forEach((spot) => {
        const isCritical = spot.level.includes('CRITICAL');
        const icon = L.divIcon({
          className: 'tactical-traffic-marker',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <div style="background: #0a0e18; border: 1.5px solid ${isCritical ? '#ef4444' : '#f59e0b'}; color: ${isCritical ? '#ef4444' : '#f59e0b'}; padding: 2px 6px; border-radius: 4px; display: flex; align-items: center; gap: 4px; font-size: 10px; font-family: monospace; font-weight: bold; white-space: nowrap; box-shadow: 0 0 12px ${isCritical ? 'rgba(239,68,68,0.5)' : 'rgba(245,158,11,0.5)'};">
                <span>🚦</span>
                <span>${spot.name.split(' ')[0]}: ${spot.delay}</span>
              </div>
            </div>
          `,
          iconSize: [110, 22],
          iconAnchor: [55, 11]
        });

        const marker = L.marker(spot.coords, { icon }).addTo(layerGroup);
        marker.on('click', () => {
          setActiveInspectTarget({
            type: 'TRAFFIC',
            title: spot.name,
            delay: spot.delay,
            speed: spot.speed,
            level: spot.level,
            desc: 'Bengaluru Traffic Police (BTP) Live Commute Sensor Corridor'
          });
        });
      });
    }

    // 6. Render Indira Canteens / Cooling Hubs
    if (activeLayer === 'cooling' || activeLayer === 'all' || activeLayer === 'thermal') {
      BENGALURU_LOCATIONS.coolingHubs.forEach((hub) => {
        const icon = L.divIcon({
          className: 'tactical-cooling-marker',
          html: `
            <div style="background: rgba(10, 14, 24, 0.92); border: 1px solid #4edea3; color: #4edea3; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-family: monospace; display: flex; align-items: center; gap: 3px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.6);">
              <span>💧</span>
              <span>${hub.name.split(' ')[2] || 'Indira'} Hub</span>
            </div>
          `,
          iconSize: [95, 20],
          iconAnchor: [47, 10]
        });

        const marker = L.marker(hub.coords, { icon }).addTo(layerGroup);
        marker.on('click', () => {
          setActiveInspectTarget({
            type: 'COOLING_HUB',
            title: hub.name,
            capacity: hub.capacity,
            water: hub.water,
            desc: 'BBMP Municipal Free Hydration & Emergency Misting Center'
          });
        });
      });
    }

    // 7. Render Active Simulation Incident (e.g., Hebbal Flooding, Silk Board Gridlock, etc.)
    if (simulationIncident) {
      const getIncidentIconConfig = (type: string) => {
        switch (type) {
          case 'flood':
            return { emoji: '🌊', bg: '#0284c7', border: '#38bdf8', pulseColor: '#38bdf8' };
          case 'fire':
            return { emoji: '🔥', bg: '#dc2626', border: '#f87171', pulseColor: '#ef4444' };
          case 'search':
            return { emoji: '🔍', bg: '#ec4899', border: '#f472b6', pulseColor: '#f43f5e' };
          case 'traffic':
            return { emoji: '🚨', bg: '#dc2626', border: '#f87171', pulseColor: '#ef4444' };
          case 'power':
            return { emoji: '⚡', bg: '#d97706', border: '#fbbf24', pulseColor: '#f59e0b' };
          case 'water':
            return { emoji: '💧', bg: '#0891b2', border: '#22d3ee', pulseColor: '#06b6d4' };
          case 'medical':
            return { emoji: '🏥', bg: '#16a34a', border: '#4ade80', pulseColor: '#22c55e' };
          case 'tree':
            return { emoji: '🌳', bg: '#15803d', border: '#86efac', pulseColor: '#22c55e' };
          case 'metro':
            return { emoji: '🚇', bg: '#7c3aed', border: '#a78bfa', pulseColor: '#8b5cf6' };
          case 'strike':
            return { emoji: '🛑', bg: '#b91c1c', border: '#fca5a5', pulseColor: '#ef4444' };
          default:
            return { emoji: '⚠️', bg: '#ea580c', border: '#fb923c', pulseColor: '#f97316' };
        }
      };

      const cfg = getIncidentIconConfig(simulationIncident.type);

      // Hazard Warning Perimeter Circle
      const hazardCircle = L.circle(simulationIncident.coords, {
        radius: simulationIncident.radiusMeters || 750,
        color: cfg.border,
        fillColor: cfg.bg,
        fillOpacity: 0.28,
        weight: 2.5,
        dashArray: '5, 5'
      }).addTo(layerGroup);

      // Detour Route Polyline (if provided)
      if (simulationIncident.detourRoute && simulationIncident.detourRoute.length > 1) {
        const detourLine = L.polyline(simulationIncident.detourRoute, {
          color: '#10b981',
          weight: 4,
          opacity: 0.9,
          dashArray: '8, 6'
        }).addTo(layerGroup);

        detourLine.bindTooltip(
          `<div style="font-family: monospace; font-size: 11px; font-weight: bold; color: #10b981; background: #0a0e18; padding: 2px 6px; border: 1px solid #10b981; border-radius: 4px;">
            ↪ Recommended Detour: ${simulationIncident.detourLabel || 'Bypass Route'}
          </div>`,
          { sticky: true }
        );
      }

      // Pulsing Incident DivIcon
      const incidentDivIcon = L.divIcon({
        className: 'tactical-simulation-incident-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="position: absolute; top: -14px; width: 44px; height: 44px; border-radius: 50%; background: ${cfg.pulseColor}; opacity: 0.35; animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="background: ${cfg.bg}; border: 2px solid ${cfg.border}; color: white; padding: 3px 8px; border-radius: 6px; display: flex; align-items: center; gap: 5px; font-size: 11px; font-family: monospace; font-weight: bold; white-space: nowrap; box-shadow: 0 0 16px ${cfg.border}; z-index: 10;">
              <span style="font-size: 13px;">${cfg.emoji}</span>
              <span>${simulationIncident.title.toUpperCase()}</span>
            </div>
            ${simulationIncident.waterLevel ? `
              <div style="background: rgba(10, 14, 24, 0.95); border: 1px solid ${cfg.border}; color: #7dd3fc; padding: 1px 6px; border-radius: 4px; font-size: 9px; font-family: monospace; font-weight: bold; margin-top: 2px; white-space: nowrap;">
                Depth: ${simulationIncident.waterLevel}
              </div>
            ` : ''}
          </div>
        `,
        iconSize: [160, 42],
        iconAnchor: [80, 21]
      });

      const incidentMarker = L.marker(simulationIncident.coords, { icon: incidentDivIcon, zIndexOffset: 2000 }).addTo(layerGroup);

      incidentMarker.on('click', () => {
        setActiveInspectTarget({
          type: `INCIDENT: ${simulationIncident.type.toUpperCase()}`,
          title: simulationIncident.title,
          risk: `${simulationIncident.severity.toUpperCase()} PRIORITY`,
          delay: simulationIncident.delay || undefined,
          temp: simulationIncident.waterLevel ? `Water Depth: ${simulationIncident.waterLevel}` : undefined,
          desc: simulationIncident.description
        });
      });

      // Fly to the incident location smoothly
      map.flyTo(simulationIncident.coords, customZoom || 14, { duration: 1.2 });
    }
  }, [activeLayer, selectedZone, onSelectZone, simulationIncident, customZoom]);

  // Quick Zoom Helper to fly smoothly to Bengaluru focal points
  const flyToBengaluruFocal = (coords: [number, number], zoomLevel: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, zoomLevel, { duration: 1.2 });
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-[#0a0e18] border border-[#262a35] shadow-2xl flex flex-col" style={{ height }}>
      {/* Map Header Status Banner with TavishSK attribution & live telemetry */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2 flex-wrap pointer-events-auto">
        <div className="bg-[#0f131d]/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#3d494c] flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span className="font-label-caps text-[11px] text-primary uppercase font-bold tracking-wider">
            BENGALURU GIS MESH
          </span>
          <span className="text-[#3d494c]">|</span>
          <span className="font-data-mono-sm text-[10px] text-[#dfe2f1] font-semibold">
            12.9716° N, 77.5946° E
          </span>
        </div>

        {/* Map Tile Style Switcher (Esri Dark vs OpenStreetMap) */}
        <div className="bg-[#0f131d]/95 backdrop-blur-md p-0.5 rounded-lg border border-[#262a35] flex items-center gap-1 shadow-lg text-[10px] font-mono">
          <button
            onClick={() => setMapStyle('esri')}
            className={`px-2 py-1 rounded transition-colors ${
              mapStyle === 'esri'
                ? 'bg-primary text-on-primary font-bold'
                : 'text-on-surface-variant hover:text-white'
            }`}
          >
            Tactical Dark
          </button>
          <button
            onClick={() => setMapStyle('osm')}
            className={`px-2 py-1 rounded transition-colors ${
              mapStyle === 'osm'
                ? 'bg-primary text-on-primary font-bold'
                : 'text-on-surface-variant hover:text-white'
            }`}
          >
            OpenStreetMap
          </button>
        </div>

        <div className="hidden sm:flex bg-[#0f131d]/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-[#262a35] items-center gap-1.5 shadow-lg text-[10px] text-on-surface-variant font-mono">
          <span className="text-tertiary font-bold">MADE BY TAVISHSK</span>
          <span className="text-outline-variant">•</span>
          <span className="text-primary">100% Free Open Data</span>
        </div>
      </div>

      {/* Quick Camera Presets Toolbar */}
      {showControls && (
        <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 flex-wrap pointer-events-auto">
          <button
            onClick={() => flyToBengaluruFocal([13.0358, 77.5970], 14)}
            title="Focus Hebbal Flyover & Bellary Road Airport Artery"
            className="bg-[#171b26]/90 hover:bg-[#262a35] text-cyan-400 hover:text-white px-2 py-1 rounded-md text-[10px] font-mono border border-[#3d494c] backdrop-blur transition-all cursor-pointer flex items-center gap-1"
          >
            <span>🌊</span>
            <span>Hebbal Flyover</span>
          </button>
          <button
            onClick={() => flyToBengaluruFocal([12.9756, 77.6066], 14)}
            title="Focus Central Core: MG Road, Indiranagar, Vidhana Soudha"
            className="bg-[#171b26]/90 hover:bg-[#262a35] text-primary hover:text-white px-2 py-1 rounded-md text-[10px] font-mono border border-[#3d494c] backdrop-blur transition-all cursor-pointer"
          >
            MG Road Core
          </button>
          <button
            onClick={() => flyToBengaluruFocal([12.9172, 77.6229], 14)}
            title="Focus Central Silk Board Junction"
            className="bg-[#171b26]/90 hover:bg-[#262a35] text-error hover:text-white px-2 py-1 rounded-md text-[10px] font-mono border border-[#3d494c] backdrop-blur transition-all cursor-pointer"
          >
            Silk Board
          </button>
          <button
            onClick={() => flyToBengaluruFocal([12.9863, 77.7380], 13)}
            title="Focus Whitefield & ITPL Corridor"
            className="bg-[#171b26]/90 hover:bg-[#262a35] text-tertiary hover:text-white px-2 py-1 rounded-md text-[10px] font-mono border border-[#3d494c] backdrop-blur transition-all cursor-pointer"
          >
            Whitefield IT
          </button>
          <button
            onClick={() => flyToBengaluruFocal([13.0285, 77.5195], 13)}
            title="Focus Peenya Industrial Zone"
            className="bg-[#171b26]/90 hover:bg-[#262a35] text-amber-400 hover:text-white px-2 py-1 rounded-md text-[10px] font-mono border border-[#3d494c] backdrop-blur transition-all cursor-pointer"
          >
            Peenya Hub
          </button>
          <button
            onClick={() => flyToBengaluruFocal([12.9716, 77.5946], 12)}
            title="Reset to Full Bengaluru Municipality Overview"
            className="bg-[#262a35]/90 hover:bg-[#353944] text-white px-2 py-1 rounded-md text-[10px] font-mono border border-[#3d494c] backdrop-blur transition-all flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[12px]">restart_alt</span>
            <span>All Bengaluru</span>
          </button>
        </div>
      )}

      {/* Main Leaflet Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Bottom Floating Telemetry & Inspection Card */}
      {activeInspectTarget && (
        <div className="absolute bottom-10 left-4 z-[1000] bg-[#0f131d]/95 backdrop-blur-xl p-3.5 rounded-xl border border-primary/50 shadow-2xl max-w-sm pointer-events-auto animate-fade-in">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                {activeInspectTarget.type}
              </span>
            </div>
            <button
              onClick={() => setActiveInspectTarget(null)}
              className="text-on-surface-variant hover:text-white text-xs font-mono cursor-pointer"
            >
              ✕
            </button>
          </div>

          <h4 className="font-headline-sm text-sm text-white font-bold mb-1">
            {activeInspectTarget.title}
          </h4>
          <p className="font-data-mono-sm text-[11px] text-on-surface-variant mb-2">
            {activeInspectTarget.desc}
          </p>

          <div className="grid grid-cols-2 gap-2 bg-[#171b26] p-2 rounded-lg border border-[#262a35] text-[10px] font-mono">
            {activeInspectTarget.temp && (
              <div>
                <span className="text-outline uppercase block">TEMP:</span>
                <span className="text-error font-bold">{activeInspectTarget.temp}</span>
              </div>
            )}
            {activeInspectTarget.risk && (
              <div>
                <span className="text-outline uppercase block">RISK:</span>
                <span className="text-primary font-bold">{activeInspectTarget.risk}</span>
              </div>
            )}
            {activeInspectTarget.load && (
              <div>
                <span className="text-outline uppercase block">GRID LOAD:</span>
                <span className="text-amber-400 font-bold">{activeInspectTarget.load}</span>
              </div>
            )}
            {activeInspectTarget.beds && (
              <div>
                <span className="text-outline uppercase block">ER BEDS:</span>
                <span className="text-error font-bold">{activeInspectTarget.beds}</span>
              </div>
            )}
            {activeInspectTarget.delay && (
              <div>
                <span className="text-outline uppercase block">TRANSIT DELAY:</span>
                <span className="text-error font-bold">{activeInspectTarget.delay}</span>
              </div>
            )}
            {activeInspectTarget.capacity && (
              <div>
                <span className="text-outline uppercase block">CAPACITY:</span>
                <span className="text-tertiary font-bold">{activeInspectTarget.capacity}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Status Ticker Bar */}
      <div className="absolute bottom-2 right-3 z-[1000] bg-[#0a0e18]/85 backdrop-blur-md px-3 py-1 rounded border border-[#262a35] text-[10px] font-mono text-on-surface-variant flex items-center gap-3 pointer-events-none">
        <span className="text-primary font-bold">{currentCoords}</span>
        <span>•</span>
        <span>NAMMA METRO PURPLE &amp; GREEN LINES</span>
        <span>•</span>
        <span className="text-tertiary">BBMP 8-ZONE COVERAGE</span>
      </div>
    </div>
  );
};
