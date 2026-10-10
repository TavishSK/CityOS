import React, { useState, useMemo } from 'react';
import { BengaluruTacticalMap, SimulationIncident } from './BengaluruTacticalMap';

interface WhatIfSimulationLabProps {
  onNavigateTab: (tab: any) => void;
}

export interface ScenarioBudget {
  operationalCost: string;
  operationalCostDetails: string;
  disruptionLossPrevented: string;
  costEfficiencyRatio: string;
}

export interface ScenarioTemplate {
  id: string;
  name: string;
  category: string;
  emoji: string;
  badge: string;
  badgeColor: string;
  headline: string;
  locationName: string;
  zone: string;
  coords: [number, number];
  affectedPopulation: string;
  detourLabel?: string;
  detourRoute?: [number, number][];
  sliders: {
    label: string;
    key: 'p1' | 'p2' | 'p3' | 'p4';
    min: number;
    max: number;
    step: number;
    defaultVal: number;
    unit: string;
    minLabel: string;
    maxLabel: string;
  }[];
  whatHappened: string;
  consequences: {
    traffic: {
      title: string;
      description: string;
      delay: string;
      detour: string;
    };
    powerWater: {
      title: string;
      description: string;
      homesAffected: string;
      waterStatus: string;
    };
    healthEmergency: {
      title: string;
      description: string;
      hospitalName: string;
      ambulanceStatus: string;
    };
    publicCommute: {
      title: string;
      description: string;
      busStatus: string;
      citizenTip: string;
    };
  };
  cityActions: {
    dept: string;
    deptColor: string;
    action: string;
    eta: string;
  }[];
  budget: ScenarioBudget;
  comparison: {
    timeToClearOld: string;
    timeToClearNew: string;
    trafficDelayOld: string;
    trafficDelayNew: string;
    emergencyDelayOld: string;
    emergencyDelayNew: string;
    economicLossOld: string;
    economicLossNew: string;
  };
}

// Rich, high-fidelity presets for Bengaluru with realistic, proportional budgets
const PRESET_SCENARIOS: Record<string, ScenarioTemplate> = {
  'hebbal-flood': {
    id: 'hebbal-flood',
    name: 'Hebbal Flyover Flooded (Monsoon Cloudburst)',
    category: 'flood',
    emoji: '🌊',
    badge: 'CRITICAL WATERLOGGING',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    headline: 'Hebbal Flyover Loops & Bellary Road Submerged under 3.2 Feet Water',
    locationName: 'Hebbal Flyover & Airport Corridor (North Bengaluru)',
    zone: 'Zone 01: Yelahanka & North / BBMP Ward 07',
    coords: [13.0358, 77.5970],
    affectedPopulation: '~95,000 commuters & airport travelers',
    detourLabel: 'Thanisandra Main Rd ➔ Bagalur ➔ Airport Alternate Expressway',
    detourRoute: [
      [13.0150, 77.5970],
      [13.0200, 77.6150],
      [13.0450, 77.6250],
      [13.0800, 77.6350],
      [13.1300, 77.6400],
    ],
    sliders: [
      {
        label: 'Rainfall Intensity',
        key: 'p1',
        min: 20,
        max: 120,
        step: 5,
        defaultVal: 75,
        unit: 'mm/hour',
        minLabel: '20mm (Moderate)',
        maxLabel: '120mm (Cloudburst)'
      },
      {
        label: 'Flood Water Depth',
        key: 'p2',
        min: 1.0,
        max: 5.0,
        step: 0.2,
        defaultVal: 3.2,
        unit: 'Feet',
        minLabel: '1.0 ft (Passable)',
        maxLabel: '5.0 ft (Deep Submersion)'
      },
      {
        label: 'Storm Drainage Blockage',
        key: 'p3',
        min: 10,
        max: 90,
        step: 5,
        defaultVal: 65,
        unit: '% Blocked',
        minLabel: '10% (Clear drains)',
        maxLabel: '90% (Silted up)'
      },
      {
        label: 'BBMP High-Power Pumps',
        key: 'p4',
        min: 1,
        max: 12,
        step: 1,
        defaultVal: 6,
        unit: 'Pumps Deployed',
        minLabel: '1 Pump (Understaffed)',
        maxLabel: '12 Pumps (Full Force)'
      }
    ],
    whatHappened:
      'Sudden intense cloudburst (75mm rain in 60 mins) overflowed the Hebbal lake storm overflow channel. Water has accumulated 3.2 feet deep under the Hebbal flyover ramp towards Kempegowda International Airport. Vehicles, buses, and airport taxis cannot pass.',
    consequences: {
      traffic: {
        title: 'Airport Road Jammed & Vehicles Stranded',
        description:
          'Bellary Road north-bound is completely halted for 4.2 km all the way to Mekhri Circle. Airport taxis report missed flights.',
        delay: '+58 minutes delay',
        detour: 'Avoid Hebbal flyover. Divert at RT Nagar via Thanisandra Main Road or Hennur ORR to reach Airport.'
      },
      powerWater: {
        title: 'Substation Cutoff & Flooded Pumping Panels',
        description:
          'BESCOM has temporarily shut off power to Hebbal Kempapura & Sahakar Nagar feeder lines to prevent public electrocution in flood water. BWSSB drinking water booster station is partially submerged.',
        homesAffected: '18,500 homes without power for safety',
        waterStatus: 'Water supply to Sahakar Nagar delayed by 6 hours'
      },
      healthEmergency: {
        title: 'Baptist Hospital Bellary Road Access Impassable',
        description:
          'Baptist Hospital main entrance gate on Bellary Road is submerged. Ambulances carrying critical patients cannot enter via the front road.',
        hospitalName: 'Baptist Hospital & Columbia Asia Hebbal',
        ambulanceStatus: '108 Ambulances redirected to rear gate via Sanjaynagar service road'
      },
      publicCommute: {
        title: 'BMTC Airport Vayu Vajra Buses Re-routed',
        description:
          'Over 40 BMTC Vayu Vajra airport buses (KIA-8, KIA-9) halted near Esteem Mall. Commuters from Manyata Tech Park stranded.',
        busStatus: '15 special BMTC shuttle buses deployed from Nagawara metro station',
        citizenTip: 'If traveling to Bengaluru Airport, leave 2 hours earlier and take the Bagalur-Thanisandra route.'
      }
    },
    cityActions: [
      {
        dept: 'BBMP Stormwater Engineering',
        deptColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        action: 'Deployed 6 trailer-mounted dewatering pumps (15,000 LPM capacity) pumping water directly into Hebbal Lake overflow canal.',
        eta: 'Pumping active right now'
      },
      {
        dept: 'Bengaluru Traffic Police (BTP)',
        deptColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        action: 'Turned off traffic signals at Mekhri circle; manually diverting all airport traffic via Hennur-Thanisandra green corridor.',
        eta: 'Diversion operational'
      },
      {
        dept: 'BESCOM Power Ops',
        deptColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        action: 'Isolated 3 submerged street-level transformer plinths; energizing Sahakar Nagar homes via secondary feeder backfeed.',
        eta: 'Power restored to 12,000 homes in 45m'
      }
    ],
    budget: {
      operationalCost: '₹8.4 Lakhs',
      operationalCostDetails: '6 high-capacity diesel pumps, 14 suction tankers, 40 drainage staff, and traffic marshal mobilization',
      disruptionLossPrevented: '₹28.5 Lakhs saved in prevented commuter fuel wastage and missed flight claims',
      costEfficiencyRatio: '1 : 3.4 (Every ₹1 spent prevents ₹3.4 in secondary citizen losses)'
    },
    comparison: {
      timeToClearOld: '5 hours 45 mins (Uncoordinated phone calls)',
      timeToClearNew: '1 hour 15 mins (City OS telemetry)',
      trafficDelayOld: '+85 minutes delay',
      trafficDelayNew: '+18 minutes (Detours active)',
      emergencyDelayOld: '6 ambulances trapped in gridlock',
      emergencyDelayNew: '0 ambulances delayed (Sanjaynagar corridor)',
      economicLossOld: '₹38.5 Lakhs (Wasted fuel & missed flights)',
      economicLossNew: '₹8.4 Lakhs (Rapid containment)'
    }
  },

  'cubbon-park-search': {
    id: 'cubbon-park-search',
    name: 'Cubbon Park: Missing Child Search & Perimeter Lockdown',
    category: 'search',
    emoji: '🧒',
    badge: 'HIGH PRIORITY SEARCH',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    headline: '7-Year-Old Child Reported Missing Near Bal Bhavan Play Area in Cubbon Park',
    locationName: 'Cubbon Park & Kasturba Road Core',
    zone: 'Zone 04: Bengaluru Central / BBMP Ward 111',
    coords: [12.9763, 77.5929],
    affectedPopulation: '~6,500 park visitors & weekend families',
    detourLabel: 'Pedestrian flow guided via High Court & Press Club Gates; Vehicles avoid Kasturba Road',
    detourRoute: [
      [12.9716, 77.5946], // Hudson Circle
      [12.9750, 77.5910], // Kasturba Road
      [12.9790, 77.5900], // Queen's Road
      [12.9810, 77.5930], // High Court Gate
    ],
    sliders: [
      {
        label: 'Park Search Radius',
        key: 'p1',
        min: 50,
        max: 300,
        step: 25,
        defaultVal: 150,
        unit: 'Acres',
        minLabel: '50 Acres (Bal Bhavan)',
        maxLabel: '300 Acres (Whole Park)'
      },
      {
        label: 'Police & Volunteer Teams',
        key: 'p2',
        min: 4,
        max: 30,
        step: 2,
        defaultVal: 14,
        unit: 'Search Squads',
        minLabel: '4 Teams',
        maxLabel: '30 Teams'
      },
      {
        label: 'CCTV & Thermal Drone Scan',
        key: 'p3',
        min: 20,
        max: 100,
        step: 10,
        defaultVal: 85,
        unit: '% Coverage',
        minLabel: '20% (Ground eyes)',
        maxLabel: '100% (Drone + AI Face Match)'
      },
      {
        label: 'Perimeter Gates Sealed',
        key: 'p4',
        min: 1,
        max: 7,
        step: 1,
        defaultVal: 7,
        unit: 'All 7 Gates Monitored',
        minLabel: '1 Gate',
        maxLabel: '7 Gates Sealed'
      }
    ],
    whatHappened:
      'A 7-year-old child was reported separated from parents near Bal Bhavan inside Cubbon Park at 16:45. Bengaluru City Police, BBMP Horticulture staff, and volunteer park marshals immediately initiated Protocol Amber, securing all 7 park perimeter gates and launching thermal camera drones across dense bamboo groves.',
    consequences: {
      traffic: {
        title: 'Slow Traffic on Kasturba Road & Hudson Circle',
        description:
          'Kasturba Road and Queen\'s Road entry gates are strictly monitored with vehicle spot-checks. Brief slowdown for vehicles entering Hudson Circle.',
        delay: '+12 minutes delay on Kasturba Road',
        detour: 'Use Raja Ram Mohan Roy Road or Ambedkar Veedhi to bypass Kasturba Road.'
      },
      powerWater: {
        title: 'Park Illumination & PA Broadcast Energized',
        description:
          'BESCOM ensured 100% power reliability to park high-mast LED floodlights along walking tracks. Public announcement speakers broadcasting child description continuously in Kannada, English, and Hindi.',
        homesAffected: 'Zero residential impact',
        waterStatus: 'Normal park drinking water kiosks active for search teams'
      },
      healthEmergency: {
        title: 'Pediatric Medical Team Stationed at Hudson Gate',
        description:
          'BBMP mobile medical van and 108 ambulance stationed at Hudson Circle entrance with pediatric hydration and first aid supplies ready upon child discovery.',
        hospitalName: 'Bowring & Lady Curzon Hospital and Mallya Hospital',
        ambulanceStatus: '108 Paramedic unit standing by at Gate 1'
      },
      publicCommute: {
        title: 'Cubbon Park Metro Security Screening Active',
        description:
          'BMRCL Metro staff at Cubbon Park and Vidhana Soudha stations instructed to monitor all turnstiles and ticket gates. BMTC bus conductors on Kasturba Road alerted.',
        busStatus: 'BMTC bus routes operating with conductor photo verification',
        citizenTip: 'Park visitors asked to look out for child in blue t-shirt and report to nearest police marshal.'
      }
    },
    cityActions: [
      {
        dept: 'Bengaluru City Police (Cubbon Park PS)',
        deptColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        action: 'Formed 14 cordoned search grids with K9 tracking unit and 3 thermal drones scanning wooded areas.',
        eta: 'Search underway (Golden Hour)'
      },
      {
        dept: 'BBMP Horticulture & Parks',
        deptColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        action: 'Closed vehicle exits across all 7 gates; security staff cross-verifying departing adults with children.',
        eta: 'Perimeter locked down'
      },
      {
        dept: 'BMRCL Namma Metro Security',
        deptColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        action: 'Screening platform entrances at Cubbon Park & Dr. BR Ambedkar stations.',
        eta: 'Station gates active'
      }
    ],
    budget: {
      operationalCost: '₹48,000',
      operationalCostDetails: 'Deployment of 14 police patrol personnel, 3 thermal drones, 2 PA systems, and rapid volunteer mobilization',
      disruptionLossPrevented: '₹1.8 Lakhs saved in public panic mitigation, search optimization, and preventing trauma',
      costEfficiencyRatio: '1 : 3.8 (Every ₹1 invested in rapid protocol search secures immediate golden-hour recovery)'
    },
    comparison: {
      timeToClearOld: '4 hours 30 mins (Unorganized crowd panic, delayed CCTV review)',
      timeToClearNew: '38 minutes (City OS coordinated gate lockdown & drone grid)',
      trafficDelayOld: '+35 mins unmanaged vehicle chaos',
      trafficDelayNew: '+12 mins (Orderly spot checks)',
      emergencyDelayOld: 'No pediatric team on site',
      emergencyDelayNew: 'Paramedic van standing by at Bal Bhavan entrance',
      economicLossOld: '₹2.8 Lakhs (Wasted emergency hours & park disruption)',
      economicLossNew: '₹48,000 (Targeted swift resolution)'
    }
  },

  'commercial-street-fire': {
    id: 'commercial-street-fire',
    name: 'Commercial Street: Commercial Complex Fire Outbreak',
    category: 'fire',
    emoji: '🔥',
    badge: 'ALARM LEVEL 2 FIRE',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
    headline: 'Textile Warehouse Fire on Ibrahim Sahib Street near Commercial Street',
    locationName: 'Commercial Street & Tasker Town (Shivajinagar)',
    zone: 'Zone 04: Shivajinagar / BBMP Ward 92',
    coords: [12.9822, 77.6083],
    affectedPopulation: '~14,000 shoppers, merchants & pedestrians',
    detourLabel: 'Avoid Dispensary Road & Kamaraj Rd; Use Infantry Road & Dickenson Road',
    detourRoute: [
      [12.9800, 77.6050], // Central Infantry Rd
      [12.9830, 77.6120], // Dickenson Rd
      [12.9860, 77.6100], // Ulsoor Road bypass
    ],
    sliders: [
      {
        label: 'Affected Shops in Danger',
        key: 'p1',
        min: 1,
        max: 18,
        step: 1,
        defaultVal: 4,
        unit: 'Commercial Outlets',
        minLabel: '1 Store (Isolated)',
        maxLabel: '18 Stores (Cluster Risk)'
      },
      {
        label: 'KSFES Fire Tenders',
        key: 'p2',
        min: 2,
        max: 12,
        step: 1,
        defaultVal: 6,
        unit: 'Fire Engines On Scene',
        minLabel: '2 Engines',
        maxLabel: '12 Engines (Multi-Station)'
      },
      {
        label: 'Narrow Lane Evacuation',
        key: 'p3',
        min: 20,
        max: 100,
        step: 10,
        defaultVal: 80,
        unit: '% Shoppers Evacuated',
        minLabel: '20% (Congested)',
        maxLabel: '100% (Cleared corridor)'
      },
      {
        label: 'Hydrant Water Pressure',
        key: 'p4',
        min: 30,
        max: 120,
        step: 10,
        defaultVal: 85,
        unit: 'PSI Water Pressure',
        minLabel: '30 PSI (Low flow)',
        maxLabel: '120 PSI (BWSSB boosted)'
      }
    ],
    whatHappened:
      'A short circuit in an upper-floor synthetic fabric showroom sparked a Level-2 fire in the congested Commercial Street shopping bazaar. Fire tenders from Shivajinagar and High Grounds stations mobilized through narrow lanes while BESCOM immediately isolated the Tasker Town distribution transformer.',
    consequences: {
      traffic: {
        title: 'Commercial Street & Kamaraj Road Cordoned',
        description:
          'Ibrahim Sahib Street and Dispensary Road closed to civilian traffic to allow unimpeded entry for heavy fire engines and water bowsers.',
        delay: '+28 minutes delay in Shivajinagar area',
        detour: 'Divert via Infantry Road, Dickenson Road, or Cubbon Road.'
      },
      powerWater: {
        title: 'Localized Power Shutdown to Prevent Electrical Explosions',
        description:
          'BESCOM safely turned off the 11kV commercial line serving the block. BWSSB opened the dedicated emergency water hydrant valve from Russell Market booster reservoir.',
        homesAffected: '140 retail shops isolated for safety',
        waterStatus: 'Hydrant pressure boosted to 85 PSI for continuous hose feeding'
      },
      healthEmergency: {
        title: 'Bowring Hospital Burn Unit on Full Alert',
        description:
          'Bowring & Lady Curzon Hospital (located only 600m away on Hospital Road) prepped emergency triage and smoke inhalation beds. 4 ambulances on site.',
        hospitalName: 'Bowring & Lady Curzon Hospital',
        ambulanceStatus: 'Green corridor cleared along Lady Curzon Road'
      },
      publicCommute: {
        title: 'BMTC Shivajinagar Bus Terminus Operations Adjusted',
        description:
          'BMTC buses departing Shivajinagar avoid Commercial Street entrance and exit directly onto Broadway and Queens Road.',
        busStatus: 'Normal bus frequency maintained from Shivajinagar terminal',
        citizenTip: 'Shoppers urged to vacate Commercial Street and avoid narrow interior alleys until smoke clears.'
      }
    },
    cityActions: [
      {
        dept: 'Karnataka Fire & Emergency (KSFES)',
        deptColor: 'text-red-400 bg-red-500/10 border-red-500/30',
        action: '6 water tenders deployed with hydraulic aerial ladder tackling flames from rooftop level.',
        eta: 'Containment active'
      },
      {
        dept: 'Bengaluru Traffic Police (BTP)',
        deptColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        action: 'Towed 18 illegally parked two-wheelers in 7 minutes to widen alley access for fire trucks.',
        eta: 'Access lane clear'
      },
      {
        dept: 'BESCOM Power Ops',
        deptColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        action: 'Substation cut off local feed within 4 minutes, preventing secondary gas/electrical explosions.',
        eta: 'Isolated successfully'
      }
    ],
    budget: {
      operationalCost: '₹3.9 Lakhs',
      operationalCostDetails: '6 fire tenders foam concentrate, 18 water bowser refills, 45 firefighter deployment, and structural safety survey',
      disruptionLossPrevented: '₹38.5 Lakhs in prevented inventory fire spread across neighboring wooden heritage stores',
      costEfficiencyRatio: '1 : 9.8 (Every ₹1 spent on rapid fire suppression prevented ₹9.8 in devastating retail damage)'
    },
    comparison: {
      timeToClearOld: '3 hours 45 mins (Tenders blocked by two-wheelers in narrow alleys)',
      timeToClearNew: '48 minutes (City OS towing green wave & boosted hydrants)',
      trafficDelayOld: '+65 mins general gridlock in Shivajinagar',
      trafficDelayNew: '+28 mins with Infantry Road bypass',
      emergencyDelayOld: 'Ambulances blocked by crowd',
      emergencyDelayNew: 'Bowring Hospital corridor cleared in 3 minutes',
      economicLossOld: '₹42 Lakhs (Full block gutting risk)',
      economicLossNew: '₹3.9 Lakhs operational cost (Containment preserved shops)'
    }
  },

  'silk-board': {
    id: 'silk-board',
    name: 'Silk Board Junction: Multi-Vehicle Pileup & ORR Choke',
    category: 'traffic',
    emoji: '🚗',
    badge: 'ARTERIAL GRIDLOCK',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
    headline: 'Multi-Axle Truck Break-down on Silk Board Flyover Ramp Chokes South Bengaluru',
    locationName: 'Central Silk Board Junction (Hosur Rd & Outer Ring Rd)',
    zone: 'Zone 06: Bommanahalli / BBMP Ward 174',
    coords: [12.9177, 77.6238],
    affectedPopulation: '~140,000 commuters & IT employees',
    detourLabel: 'Divert via BTM 29th Main ➔ Bannerghatta Rd OR Sarjapur Outer Ring Rd',
    detourRoute: [
      [12.9100, 77.6200],
      [12.9150, 77.6050],
      [12.9300, 77.6080],
      [12.9400, 77.6200],
    ],
    sliders: [
      {
        label: 'Traffic Volume Backlog',
        key: 'p1',
        min: 2000,
        max: 16000,
        step: 1000,
        defaultVal: 9500,
        unit: 'Vehicles in Queue',
        minLabel: '2,000 (Manageable)',
        maxLabel: '16,000 (Total Halt)'
      },
      {
        label: 'Heavy Tow Cranes Dispatched',
        key: 'p2',
        min: 1,
        max: 6,
        step: 1,
        defaultVal: 3,
        unit: 'Hydraulic Cranes',
        minLabel: '1 Crane',
        maxLabel: '6 Cranes'
      },
      {
        label: 'Traffic Police on Duty',
        key: 'p3',
        min: 5,
        max: 40,
        step: 5,
        defaultVal: 25,
        unit: 'BTP Officers',
        minLabel: '5 Officers',
        maxLabel: '40 Officers'
      },
      {
        label: 'Hosur Toll Gate Free-Flow',
        key: 'p4',
        min: 2,
        max: 10,
        step: 1,
        defaultVal: 8,
        unit: 'Boom Barriers Lifted',
        minLabel: '2 Lanes Open',
        maxLabel: '10 Lanes (Free Flow)'
      }
    ],
    whatHappened:
      'A heavy 16-wheeler container truck broke its rear axle right on the ascending ramp from Hosur Road onto the Silk Board flyover during morning peak hour. Two trailing cars collided, completely blocking 3 of 4 lanes towards HSR Layout and Bellandur.',
    consequences: {
      traffic: {
        title: 'Tailback Stretches 6.5 km to Electronic City & BTM',
        description:
          'Hosur Road northbound is completely stationary. Commuters heading to Bellandur, Marathahalli, and Whitefield tech corridors face heavy delays.',
        delay: '+62 minutes delay',
        detour: 'Divert at Kudlu Gate via Haralur Road towards Sarjapur Road, or take BTM 29th Main to Dairy Circle.'
      },
      powerWater: {
        title: 'Traffic Signals Switched to Adaptive Green Wave',
        description:
          'BTP Central Control overrode local signal cycles to provide continuous 90-second green waves along the BTM Layout bypass.',
        homesAffected: 'Zero utility interruption',
        waterStatus: 'Normal'
      },
      healthEmergency: {
        title: "St. John's Hospital Trauma Access at Risk",
        description:
          "Ambulances carrying emergency patients from Electronic City to St. John's Hospital risk gridlock on Hosur Road.",
        hospitalName: "St. John's Medical College Hospital",
        ambulanceStatus: 'BTP green-corridor motorcycle escort assigned to all incoming 108 ambulances'
      },
      publicCommute: {
        title: 'BMTC Vajra 500-Series Buses Stuck in Traffic',
        description:
          'Over 85 BMTC buses trapped between Bommanahalli and Silk Board. Tech workers unable to reach RMZ Ecospace and Prestige Tech Park.',
        busStatus: 'BMTC dispatched 20 empty reserve buses starting directly from HSR Layout to serve Bellandur',
        citizenTip: 'Take Yellow Line Metro from Bommasandra or utilize Namma Metro feeder shuttles.'
      }
    },
    cityActions: [
      {
        dept: 'Bengaluru Traffic Police (BTP)',
        deptColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        action: 'Dispatched 3 heavy hydraulic recovery cranes to winch broken container truck off the ramp.',
        eta: 'Towing underway'
      },
      {
        dept: 'Electronic City Tollway Ops',
        deptColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        action: 'Lifted 8 boom barriers on Elevated Highway to clear stalled vehicles before toll plaza.',
        eta: 'Free flow active'
      }
    ],
    budget: {
      operationalCost: '₹1.8 Lakhs',
      operationalCostDetails: '3 heavy commercial hydraulic cranes, 25 BTP marshals, mobile signage, and toll operator coordination',
      disruptionLossPrevented: '₹14.2 Lakhs saved in wasted vehicle idling fuel and prevented productivity loss',
      costEfficiencyRatio: '1 : 7.8 (Every ₹1 spent on rapid towing cranes prevents ₹7.8 in commuter fuel waste)'
    },
    comparison: {
      timeToClearOld: '4 hours 10 mins (Single crane arrival after long delay)',
      timeToClearNew: '35 minutes (Dual crane team dispatched from Bommanahalli)',
      trafficDelayOld: '+90 mins massive gridlock',
      trafficDelayNew: '+22 mins (BTM diversion active)',
      emergencyDelayOld: 'St. John\'s ambulance delayed 38 mins',
      emergencyDelayNew: 'Ambulance cleared in 6 mins via motorbike escort',
      economicLossOld: '₹16 Lakhs (Fuel wastage & missed work hours)',
      economicLossNew: '₹1.8 Lakhs (Fast clearance cost)'
    }
  },

  'whitefield-power': {
    id: 'whitefield-power',
    name: 'Whitefield & Hoodi: Substation Transformer Trip',
    category: 'power',
    emoji: '⚡',
    badge: 'GRID OVERLOAD',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    headline: 'Hoodi 400kV Substation Transformer 3 Trips; 45,000 Homes & Tech Parks on Diesel',
    locationName: 'Hoodi & Whitefield IT Corridor (East Bengaluru)',
    zone: 'Zone 08: Mahadevapura / BBMP Ward 85',
    coords: [12.9912, 77.7126],
    affectedPopulation: '~120,000 residents & IT workers',
    detourLabel: 'Traffic signals dark at Hope Farm & ITPL; Traffic marshals on manual control',
    sliders: [
      {
        label: 'Transformer Capacity Lost',
        key: 'p1',
        min: 20,
        max: 180,
        step: 10,
        defaultVal: 95,
        unit: 'MW Offline',
        minLabel: '20 MW',
        maxLabel: '180 MW'
      },
      {
        label: 'Power Cut Duration',
        key: 'p2',
        min: 0.5,
        max: 6.0,
        step: 0.5,
        defaultVal: 2.5,
        unit: 'Hours Outage',
        minLabel: '30 mins',
        maxLabel: '6 hours'
      },
      {
        label: 'Hospital Generator Fuel',
        key: 'p3',
        min: 2,
        max: 24,
        step: 2,
        defaultVal: 14,
        unit: 'Hours Backup',
        minLabel: '2 hours',
        maxLabel: '24 hours'
      },
      {
        label: 'BESCOM Repair Linemen',
        key: 'p4',
        min: 4,
        max: 30,
        step: 2,
        defaultVal: 16,
        unit: 'Technicians',
        minLabel: '4 Linemen',
        maxLabel: '30 Technicians'
      }
    ],
    whatHappened:
      'High ambient heat combined with peak commercial air-conditioning demand caused transformer 3 at Hoodi 400kV master substation to trip on thermal overload. Power cut to residential feeders across Kadugodi, Hope Farm, and parts of ITPL.',
    consequences: {
      traffic: {
        title: 'Traffic Signals Off at Hope Farm & Graphite India',
        description:
          'Loss of utility power disabled automated signals at 6 major junctions in Whitefield. Manual traffic police marshals deployed to avoid intersection gridlocks.',
        delay: '+22 minutes delay',
        detour: 'Use Varthur Road or Hoodi Railway Station bypass.'
      },
      powerWater: {
        title: 'Tech Parks on Diesel Backup; Water Boosters Paused',
        description:
          'Tech parks running auxiliary diesel gen-sets. BWSSB Kaveri water booster pumps in Mahadevapura paused for 90 mins.',
        homesAffected: '45,000 apartments & residences affected',
        waterStatus: 'Water delivery delayed by 2 hours'
      },
      healthEmergency: {
        title: 'Manipal Hospital Whitefield Power Stable on Microgrid',
        description:
          'Manipal Hospital Whitefield and Vydehi Hospital automated diesel generators kicked in within 8 seconds; ICU and surgery suites 100% operational.',
        hospitalName: 'Manipal Hospital Whitefield & Vydehi Institute',
        ambulanceStatus: 'Normal ambulance access maintained'
      },
      publicCommute: {
        title: 'Namma Metro Purple Line Traction Unaffected',
        description:
          'BMRCL metro train operations continue uninterrupted via dedicated 66kV KPTCL grid line from HAL receiving station.',
        busStatus: 'Normal BMTC bus operations',
        citizenTip: 'Keep residential inverters on eco-mode; prioritize mobile phone charging.'
      }
    },
    cityActions: [
      {
        dept: 'BESCOM Grid Operations',
        deptColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        action: 'Transferred 42 MW load to Peenya & HAL auxiliary lines while Hoodi transformer heat exchanger cools down.',
        eta: 'Load re-routed'
      },
      {
        dept: 'Bengaluru Traffic Police (BTP)',
        deptColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        action: 'Deployed solar-battery backup packs to 6 dark traffic signal controllers in Whitefield.',
        eta: 'Signals restored'
      }
    ],
    budget: {
      operationalCost: '₹5.2 Lakhs',
      operationalCostDetails: '16 electrical engineers, mobile transformer emergency bypass, and secondary feeder load-balancing',
      disruptionLossPrevented: '₹22.0 Lakhs in residential food spoilage, commercial diesel burn, and water booster disruption',
      costEfficiencyRatio: '1 : 4.2 (Every ₹1 spent on rapid load re-routing prevents ₹4.2 in prolonged diesel costs)'
    },
    comparison: {
      timeToClearOld: '4 hours 30 mins (Sequential manual line switching)',
      timeToClearNew: '42 minutes (Automated SCADA load transfer)',
      trafficDelayOld: '+45 mins unmanaged dark signals',
      trafficDelayNew: '+12 mins (Solar backup signals)',
      emergencyDelayOld: 'Hospital diesel fuel supply chain anxiety',
      emergencyDelayNew: 'Guaranteed BESCOM line backfeed',
      economicLossOld: '₹24 Lakhs (Diesel burn & business downtime)',
      economicLossNew: '₹5.2 Lakhs (Swift electrical restoration)'
    }
  }
};

// Fallback intelligent semantic synthesizer for ANY Bengaluru question
function generateLocalSimulation(userPrompt: string): ScenarioTemplate {
  const q = userPrompt.toLowerCase();

  // Location heuristics
  let coords: [number, number] = [12.9716, 77.5946]; // Default MG Road Core
  let locationName = 'Central Bengaluru Urban Core';
  let zone = 'Zone 04: Bengaluru Central / BBMP Ward 111';

  if (q.includes('cubbon') || q.includes('bal bhavan') || q.includes('kasturba')) {
    coords = [12.9763, 77.5929];
    locationName = 'Cubbon Park & Kasturba Road Core';
    zone = 'Zone 04: Bengaluru Central / BBMP Ward 111';
  } else if (q.includes('commercial') || q.includes('shivajinagar') || q.includes('tasker')) {
    coords = [12.9822, 77.6083];
    locationName = 'Commercial Street & Tasker Town (Shivajinagar)';
    zone = 'Zone 04: Shivajinagar / BBMP Ward 92';
  } else if (q.includes('hebbal') || q.includes('bellary') || q.includes('yelahanka') || q.includes('airport')) {
    coords = [13.0358, 77.5970];
    locationName = 'Hebbal Flyover & Airport Expressway Corridor';
    zone = 'Zone 01: Yelahanka & North / BBMP Ward 07';
  } else if (q.includes('silk') || q.includes('hosur') || q.includes('btm') || q.includes('bommanahalli')) {
    coords = [12.9177, 77.6238];
    locationName = 'Central Silk Board Junction (Hosur Rd & ORR)';
    zone = 'Zone 06: Bommanahalli / BBMP Ward 174';
  } else if (q.includes('whitefield') || q.includes('hoodi') || q.includes('itpl') || q.includes('kadugodi')) {
    coords = [12.9698, 77.7500];
    locationName = 'ITPL Whitefield & Hope Farm Junction';
    zone = 'Zone 08: Mahadevapura / BBMP Ward 85';
  } else if (q.includes('majestic') || q.includes('railway') || q.includes('kempegowda')) {
    coords = [12.9767, 77.5713];
    locationName = 'Kempegowda Majestic Bus & Metro Interchange';
    zone = 'Zone 03: West Bengaluru / BBMP Ward 95';
  } else if (q.includes('indiranagar') || q.includes('100ft') || q.includes('hal')) {
    coords = [12.9784, 77.6408];
    locationName = 'Indiranagar 100ft Road & CMH Road Junction';
    zone = 'Zone 05: East Bengaluru / BBMP Ward 82';
  } else if (q.includes('koramangala') || q.includes('sony world')) {
    coords = [12.9352, 77.6245];
    locationName = 'Koramangala 80ft Road & Sony World Signal';
    zone = 'Zone 06: South-East / BBMP Ward 151';
  } else if (q.includes('marathahalli') || q.includes('outer ring') || q.includes('bellandur')) {
    coords = [12.9591, 77.6974];
    locationName = 'Marathahalli Bridge & Outer Ring Road IT Corridor';
    zone = 'Zone 08: Mahadevapura / BBMP Ward 87';
  } else if (q.includes('peenya') || q.includes('industrial') || q.includes('tumkur')) {
    coords = [13.0285, 77.5195];
    locationName = 'Peenya Industrial Area Stage 1';
    zone = 'Zone 07: Dasarahalli / BBMP Ward 41';
  }

  // Incident Type heuristics
  if (q.includes('child') || q.includes('lost') || q.includes('missing') || q.includes('search') || q.includes('kid')) {
    return {
      id: `custom-search-${Date.now()}`,
      name: `${locationName.split(' &')[0]}: Emergency Missing Person Search`,
      category: 'search',
      emoji: '🔍',
      badge: 'PRIORITY SEARCH GRID',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      headline: `Emergency missing person search and perimeter lockdown initiated at ${locationName}`,
      locationName,
      zone,
      coords,
      affectedPopulation: '~5,000 citizens in immediate zone',
      detourLabel: 'Pedestrian and vehicle spot checks active; please cooperate with Bengaluru City Police',
      whatHappened: `An emergency missing person report was filed at ${locationName}. Bengaluru City Police and local ward marshals have sealed perimeter exits and deployed patrol squads and drone surveillance.`,
      sliders: [
        { label: 'Search Perimeter Radius', key: 'p1', min: 100, max: 800, step: 50, defaultVal: 350, unit: 'Meters', minLabel: '100m Core', maxLabel: '800m Radius' },
        { label: 'Police & Patrol Squads', key: 'p2', min: 2, max: 24, step: 2, defaultVal: 12, unit: 'Search Teams', minLabel: '2 Teams', maxLabel: '24 Teams' },
        { label: 'CCTV & Drone Surveillance', key: 'p3', min: 20, max: 100, step: 10, defaultVal: 80, unit: '% Camera Grid', minLabel: '20% Manual', maxLabel: '100% Thermal' },
        { label: 'Perimeter Exit Gates Sealed', key: 'p4', min: 1, max: 6, step: 1, defaultVal: 4, unit: 'Gates Checked', minLabel: '1 Gate', maxLabel: 'All Gates' }
      ],
      consequences: {
        traffic: {
          title: 'Localized Slowdown Due to Spot Checks',
          description: `Entry and exit roads around ${locationName} are under controlled speed checks.`,
          delay: '+10 minutes delay',
          detour: 'Divert via parallel arterial road to avoid police checkpoint queues.'
        },
        powerWater: {
          title: 'Full Illumination & PA Broadcasts Active',
          description: 'BESCOM has ensured all street lamps and surveillance camera feeds have uninterrupted power backup.',
          homesAffected: 'Zero residential utility impact',
          waterStatus: 'Normal'
        },
        healthEmergency: {
          title: 'Mobile Paramedic Unit on Standby',
          description: '108 emergency ambulance stationed nearby with pediatric first aid and hydration equipment.',
          hospitalName: 'Bowring Hospital / Victoria Hospital Triage',
          ambulanceStatus: 'Paramedics on standby at primary gate'
        },
        publicCommute: {
          title: 'Public Transit Alerts Dispatched',
          description: 'BMTC conductors and nearby Metro stations alerted with missing person photo and description.',
          busStatus: 'Normal bus service with vigilance checks',
          citizenTip: 'If you spot anyone matching the broadcast description, immediately inform the nearest police officer.'
        }
      },
      cityActions: [
        { dept: 'Bengaluru City Police', deptColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30', action: 'Coordinating 12 search squads with drone camera sweep.', eta: 'Active now' },
        { dept: 'BBMP Ward Marshals', deptColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', action: 'Monitoring perimeter exits and coordinating public announcements.', eta: 'Perimeter sealed' }
      ],
      budget: {
        operationalCost: '₹42,000',
        operationalCostDetails: 'Patrol fuel, 2 thermal drone flight hours, public announcement logistics, and search coordination',
        disruptionLossPrevented: '₹1.5 Lakhs saved in public panic mitigation and rapid recovery within golden hour',
        costEfficiencyRatio: '1 : 3.6 (Targeted rapid protocol investment)'
      },
      comparison: {
        timeToClearOld: '3 hours 45 mins (Delayed manual search)',
        timeToClearNew: '35 minutes (City OS coordinated drone & gate lockdown)',
        trafficDelayOld: '+25 mins panic congestion',
        trafficDelayNew: '+10 mins (Structured spot checks)',
        emergencyDelayOld: 'No medical standby',
        emergencyDelayNew: 'Mobile 108 unit at gate',
        economicLossOld: '₹2.2 Lakhs in wasted civic search time',
        economicLossNew: '₹42,000 operational cost'
      }
    };
  }

  if (q.includes('fire') || q.includes('smoke') || q.includes('blaze') || q.includes('burn')) {
    return {
      id: `custom-fire-${Date.now()}`,
      name: `${locationName.split(' &')[0]}: Commercial Complex Fire Alert`,
      category: 'fire',
      emoji: '🔥',
      badge: 'ALARM LEVEL 2 FIRE',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
      headline: `Fire emergency reported at commercial premises in ${locationName}`,
      locationName,
      zone,
      coords,
      affectedPopulation: '~8,500 shoppers and residents',
      detourLabel: 'Emergency corridor active; clear lanes for incoming KSFES fire engines',
      whatHappened: `A commercial fire broke out at ${locationName}. Karnataka State Fire & Emergency Services (KSFES) and police teams have cordoned off the area while BESCOM isolated local power lines.`,
      sliders: [
        { label: 'Outlets / Shops at Risk', key: 'p1', min: 1, max: 12, step: 1, defaultVal: 3, unit: 'Units', minLabel: '1 Unit', maxLabel: '12 Units' },
        { label: 'Fire Tenders Dispatched', key: 'p2', min: 2, max: 10, step: 1, defaultVal: 5, unit: 'Fire Engines', minLabel: '2 Engines', maxLabel: '10 Engines' },
        { label: 'Narrow Alley Evacuation', key: 'p3', min: 20, max: 100, step: 10, defaultVal: 75, unit: '% Evacuated', minLabel: '20%', maxLabel: '100% Cleared' },
        { label: 'Water Pressure Boost', key: 'p4', min: 40, max: 120, step: 10, defaultVal: 90, unit: 'PSI Pressure', minLabel: '40 PSI', maxLabel: '120 PSI' }
      ],
      consequences: {
        traffic: {
          title: 'Immediate Access Roads Cordoned',
          description: `Roads entering ${locationName} are closed to private vehicles to guarantee fire engine passage.`,
          delay: '+25 minutes delay',
          detour: 'Follow BTP traffic diversions via outer bypass roads.'
        },
        powerWater: {
          title: 'Local Feeder Safely Isolated; Hydrants Boosted',
          description: 'BESCOM turned off local power to eliminate electrocution risk; BWSSB boosted pipeline water pressure.',
          homesAffected: '80 commercial units temporarily isolated',
          waterStatus: 'Hydrant water flowing at high pressure'
        },
        healthEmergency: {
          title: 'Burn Unit & Ambulances on Green Corridor',
          description: 'Emergency burn and smoke inhalation units alerted at nearest hospital. 3 ambulances on standby.',
          hospitalName: 'Bowring Hospital / Victoria Emergency Care',
          ambulanceStatus: 'Green corridor cleared for ambulances'
        },
        publicCommute: {
          title: 'BMTC Buses Rerouted Away from Fire Zone',
          description: 'City bus services redirected to parallel roads to keep response corridors open.',
          busStatus: 'Buses diverted via outer ring',
          citizenTip: 'Stay clear of smoke plume; follow police instructions for orderly evacuation.'
        }
      },
      cityActions: [
        { dept: 'Karnataka Fire Services (KSFES)', deptColor: 'text-red-400 bg-red-500/10 border-red-500/30', action: '5 fire tenders and hydraulic lift platform attacking blaze.', eta: 'Containment active' },
        { dept: 'Bengaluru Traffic Police', deptColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', action: 'Cleared access road of parked vehicles in 6 minutes.', eta: 'Corridor secured' }
      ],
      budget: {
        operationalCost: '₹3.6 Lakhs',
        operationalCostDetails: '5 fire tenders, foam compound, 30 firefighters, emergency cordoning, and drone structural scan',
        disruptionLossPrevented: '₹32.0 Lakhs in inventory loss and structural collapse prevented by quick containment',
        costEfficiencyRatio: '1 : 8.8 (Rapid fire suppression return)'
      },
      comparison: {
        timeToClearOld: '3 hours 15 mins (Delayed narrow alley entry)',
        timeToClearNew: '45 minutes (City OS towing green corridor)',
        trafficDelayOld: '+55 mins uncontrolled area jam',
        trafficDelayNew: '+25 mins with early diversions',
        emergencyDelayOld: 'Ambulances blocked by crowd',
        emergencyDelayNew: 'Green corridor cleared in 3 minutes',
        economicLossOld: '₹35 Lakhs property damage',
        economicLossNew: '₹3.6 Lakhs operational mitigation'
      }
    };
  }

  // Default intelligent general simulation for any custom scenario
  return {
    id: `custom-incident-${Date.now()}`,
    name: `${userPrompt.slice(0, 40)}: Bengaluru City Response`,
    category: 'general',
    emoji: '⚠️',
    badge: 'MUNICIPAL ADVISORY',
    badgeColor: 'bg-primary/20 text-primary border-primary/40',
    headline: `City OS Active Response Directive for: "${userPrompt}"`,
    locationName,
    zone,
    coords,
    affectedPopulation: '~25,000 citizens & commuters',
    detourLabel: 'Follow BTP digital variable message boards for real-time bypass route',
    whatHappened: `A municipal event ("${userPrompt}") has been simulated at ${locationName}. Integrated telemetry systems across BBMP, BTP, and BESCOM have initiated coordinated response procedures.`,
    sliders: [
      { label: 'Event Severity Scale', key: 'p1', min: 10, max: 100, step: 10, defaultVal: 50, unit: '% Severity', minLabel: '10% Low', maxLabel: '100% Critical' },
      { label: 'Municipal Personnel Deployed', key: 'p2', min: 5, max: 50, step: 5, defaultVal: 20, unit: 'Officers & Crew', minLabel: '5 Crew', maxLabel: '50 Crew' },
      { label: 'Response Fleet Dispatched', key: 'p3', min: 2, max: 15, step: 1, defaultVal: 6, unit: 'Special Vehicles', minLabel: '2 Vehicles', maxLabel: '15 Vehicles' },
      { label: 'Public Notification Reach', key: 'p4', min: 25, max: 100, step: 25, defaultVal: 75, unit: '% Ward Alerted', minLabel: '25%', maxLabel: '100% Broadcast' }
    ],
    consequences: {
      traffic: {
        title: 'Road Surface Flow Adjusted',
        description: `Traffic flows around ${locationName} are being actively modulated with signal timing adjustments.`,
        delay: '+15 minutes delay',
        detour: 'Utilize parallel arterial corridors to minimize travel time.'
      },
      powerWater: {
        title: 'Infrastructure Integrity Monitored',
        description: 'BESCOM and BWSSB field teams are monitoring distribution lines and water valves in the sector.',
        homesAffected: 'Monitored with zero unannounced outages',
        waterStatus: 'Normal utility supply'
      },
      healthEmergency: {
        title: 'Emergency Medical Corridor on Standby',
        description: 'Local hospital ERs alerted to maintain standby capacity for any incoming emergency vehicles.',
        hospitalName: 'Bengaluru District Hospital / Zonal Clinic',
        ambulanceStatus: '108 emergency network standing by'
      },
      publicCommute: {
        title: 'BMTC & Transit Integration',
        description: 'Public bus schedules dynamically informed of the local conditions to avoid bunching.',
        busStatus: 'Normal schedule with route smoothing',
        citizenTip: 'Check Bengaluru City OS for live corridor updates before stepping out.'
      }
    },
    cityActions: [
      { dept: 'BBMP Municipal Operations', deptColor: 'text-primary bg-primary/10 border-primary/30', action: 'Coordinated field logistics and emergency task force mobilization.', eta: '15 minutes' },
      { dept: 'Bengaluru Traffic Police', deptColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', action: 'Synchronized junction signals to prevent bottlenecks.', eta: 'Real-time' }
    ],
    budget: {
      operationalCost: '₹1.2 Lakhs',
      operationalCostDetails: 'Personnel mobilization, fleet fuel, digital variable signboards, and cross-departmental coordination',
      disruptionLossPrevented: '₹6.5 Lakhs saved in prevented commuter delays and municipal chaos',
      costEfficiencyRatio: '1 : 5.4 (Every ₹1 spent prevents ₹5.4 in delayed damages)'
    },
    comparison: {
      timeToClearOld: '2 hours 40 mins (Uncoordinated agency silos)',
      timeToClearNew: '35 minutes (City OS automated dispatch)',
      trafficDelayOld: '+40 mins delay',
      trafficDelayNew: '+15 mins delay',
      emergencyDelayOld: 'Delayed inter-agency response',
      emergencyDelayNew: 'Instant unified telemetry synchronization',
      economicLossOld: '₹7.5 Lakhs in citizen time lost',
      economicLossNew: '₹1.2 Lakhs operational cost'
    }
  };
}

export const WhatIfSimulationLab: React.FC<WhatIfSimulationLabProps> = ({ onNavigateTab }) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('cubbon-park-search');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic custom scenario if generated
  const [dynamicScenario, setDynamicScenario] = useState<ScenarioTemplate | null>(null);

  // Dynamic slider values for the active scenario
  const [sliderVals, setSliderVals] = useState<Record<string, number>>({
    p1: 150,
    p2: 14,
    p3: 85,
    p4: 7
  });

  // Current active scenario template (either dynamically generated or one of presets)
  const currentScenario = useMemo(() => {
    if (dynamicScenario && activeScenarioId === dynamicScenario.id) {
      return dynamicScenario;
    }
    return PRESET_SCENARIOS[activeScenarioId] || PRESET_SCENARIOS['cubbon-park-search'];
  }, [activeScenarioId, dynamicScenario]);

  // When switching preset scenario, load its default slider values
  const handleSelectScenario = (scenarioId: string) => {
    const sc = PRESET_SCENARIOS[scenarioId];
    if (sc) {
      setActiveScenarioId(scenarioId);
      const newVals: Record<string, number> = {};
      sc.sliders.forEach((s) => {
        newVals[s.key] = s.defaultVal;
      });
      setSliderVals(newVals);
      setToastMessage(`Switched to: ${sc.name}`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Run What-If Simulation for ANY user prompt (calls backend /api/simulate with local semantic fallback)
  const handleRunCustomSimulation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customPrompt.trim()) return;

    const query = customPrompt.trim();
    setIsSimulating(true);

    try {
      // 1. Try server-side Gemini API simulation endpoint
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });

      if (res.ok) {
        const generated: ScenarioTemplate = await res.json();
        setDynamicScenario(generated);
        setActiveScenarioId(generated.id);
        const newVals: Record<string, number> = {};
        generated.sliders.forEach((s) => {
          newVals[s.key] = s.defaultVal;
        });
        setSliderVals(newVals);
        setToastMessage(`✓ AI Simulated: "${generated.name}" with Real Bengaluru Coords & Budget`);
      } else {
        throw new Error('Server returned non-ok status');
      }
    } catch (_err) {
      // 2. Seamless local semantic synthesizer fallback (never breaks, perfectly correlated)
      const fallback = generateLocalSimulation(query);
      setDynamicScenario(fallback);
      setActiveScenarioId(fallback.id);
      const newVals: Record<string, number> = {};
      fallback.sliders.forEach((s) => {
        newVals[s.key] = s.defaultVal;
      });
      setSliderVals(newVals);
      setToastMessage(`✓ Simulated Bengaluru Impact for: "${fallback.name}"`);
    } finally {
      setIsSimulating(false);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleSliderChange = (key: string, val: number) => {
    setSliderVals((prev) => ({ ...prev, [key]: val }));
  };

  const handleResetSliders = () => {
    const newVals: Record<string, number> = {};
    currentScenario.sliders.forEach((s) => {
      newVals[s.key] = s.defaultVal;
    });
    setSliderVals(newVals);
    setToastMessage('Simulation levers reset to baseline values.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleApplyToLive = () => {
    setToastMessage(`Pushed "${currentScenario.name}" action plan to Live AI Response Planner!`);
    setTimeout(() => {
      onNavigateTab('ai-response-planner');
    }, 1500);
  };

  const handleExportReport = () => {
    const report = {
      simulationTitle: currentScenario.name,
      location: currentScenario.locationName,
      zone: currentScenario.zone,
      coordinates: currentScenario.coords,
      timestamp: new Date().toLocaleString(),
      inputs: sliderVals,
      whatHappened: currentScenario.whatHappened,
      consequences: currentScenario.consequences,
      cityActionsTaken: currentScenario.cityActions,
      budgetAssessment: currentScenario.budget,
      comparison: currentScenario.comparison,
      credit: 'Bengaluru City OS • Made by TavishSK'
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `Bengaluru_Simulation_${currentScenario.id}.json`);
    dlAnchorElem.click();
    setToastMessage('Report downloaded successfully!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Convert current scenario to Leaflet SimulationIncident for BengaluruTacticalMap
  const mapIncident: SimulationIncident = {
    coords: currentScenario.coords,
    title: currentScenario.name.split(' (')[0],
    type: currentScenario.category,
    severity: 'critical',
    waterLevel: currentScenario.category === 'flood' ? `${sliderVals.p2 || 3.2} ft` : undefined,
    delay: currentScenario.consequences.traffic.delay,
    description: currentScenario.whatHappened,
    radiusMeters: currentScenario.category === 'flood' ? 850 : 600,
    detourLabel: currentScenario.detourLabel,
    detourRoute: currentScenario.detourRoute
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Header Banner */}
      <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-5 mb-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Bengaluru Crisis Simulator
              </span>
              <span className="text-xs text-outline font-mono">
                Real City Coordinates • Realistic Civic Budgets • Any Question
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#262a35] text-amber-400 font-mono text-[11px] font-semibold border border-amber-500/20">
                Made by TavishSK
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>What-If Simulation Lab — Bengaluru</span>
            </h1>
            <p className="text-sm text-on-surface-variant mt-1 max-w-3xl leading-relaxed">
              Test <strong>any question or crisis in Bengaluru</strong> (like a missing child in Cubbon Park, a fire on Commercial Street, or flooding at Hebbal).
              Get tightly correlated, plain-English consequences, real city map coordinates, and realistic civic budgets.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleExportReport}
              className="px-3.5 py-2 rounded-xl bg-[#1c1f2a] hover:bg-[#262a35] text-white text-xs font-mono border border-[#3d494c] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Download full summary report"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">download</span>
              <span>Download Report</span>
            </button>
            <button
              onClick={handleApplyToLive}
              className="px-4 py-2 rounded-xl bg-primary hover:brightness-110 text-on-primary text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-[0_0_16px_rgba(76,215,246,0.25)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Send to Response Planner</span>
            </button>
          </div>
        </div>

        {/* Live Search & Custom What-If Scenario Input Bar */}
        <form onSubmit={handleRunCustomSimulation} className="mt-5 pt-4 border-t border-[#262a35]">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono text-primary font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              <span>Simulate Any Scenario in Bengaluru (Tackles Any Question):</span>
            </label>
            <span className="text-[11px] font-mono text-outline hidden sm:inline">
              Powered by Live Bengaluru Telemetry &amp; AI
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Type ANY question (e.g. 'Cubbon Park: Missing Child', 'Commercial Street: Fire', 'Hebbal has been flooded', 'Water main burst in Marathahalli')..."
                className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#0f131d] border border-[#3d494c] focus:border-primary text-white text-sm placeholder-on-surface-variant/60 focus:outline-none transition-colors"
              />
              {customPrompt && (
                <button
                  type="button"
                  onClick={() => setCustomPrompt('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white text-xs font-mono"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isSimulating}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 whitespace-nowrap shadow-md cursor-pointer transition-all disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[16px] ${isSimulating ? 'animate-spin' : ''}`}>
                {isSimulating ? 'refresh' : 'play_arrow'}
              </span>
              <span>{isSimulating ? 'Analyzing Scenario...' : 'Simulate What-If'}</span>
            </button>
          </div>
        </form>

        {/* 1-Click Scenario Preset Buttons */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-on-surface-variant font-mono">Popular Tests:</span>
          {Object.values(PRESET_SCENARIOS).map((sc) => {
            const isSelected = activeScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setDynamicScenario(null);
                  handleSelectScenario(sc.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-primary text-on-primary border-primary shadow-md font-bold'
                    : 'bg-[#1c1f2a] text-[#dfe2f1] hover:text-white hover:bg-[#262a35] border-[#262a35]'
                }`}
              >
                <span>{sc.emoji}</span>
                <span>{sc.name.split(' (')[0].split(':')[0]}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5 animate-pulse"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Column = Plain-English Breakdown & Sliders; Right Column = Map & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Left Column (7 cols): What Happened, Location, and Sliders */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Active Scenario Card */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{currentScenario.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${currentScenario.badgeColor}`}>
                      {currentScenario.badge}
                    </span>
                    <span className="text-xs text-outline font-mono">
                      {currentScenario.zone}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                    {currentScenario.name}
                  </h2>
                </div>
              </div>
              <button
                onClick={handleResetSliders}
                className="px-2.5 py-1 rounded-lg bg-[#1c1f2a] hover:bg-[#262a35] text-on-surface-variant hover:text-white text-xs font-mono border border-[#3d494c] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                title="Reset levers to default"
              >
                <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                <span>Reset Levers</span>
              </button>
            </div>

            {/* Plain-English "What is Happening" Box */}
            <div className="bg-[#0f131d] border border-[#262a35] rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-1.5">
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span>WHAT IS HAPPENING RIGHT NOW:</span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed font-sans">
                {currentScenario.whatHappened}
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs font-mono text-outline flex-wrap pt-2 border-t border-[#262a35]">
                <span>📍 <strong>Location:</strong> {currentScenario.locationName}</span>
                <span>👥 <strong>Citizens In Sector:</strong> <strong className="text-amber-400">{currentScenario.affectedPopulation}</strong></span>
              </div>
            </div>

            {/* Contextual Easy Levers / Sliders */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  Adjust Situation &amp; Response Levers:
                </span>
                <span className="text-[11px] font-mono text-outline">
                  Adjust levers to see dynamic consequences
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentScenario.sliders.map((s) => {
                  const currentVal = sliderVals[s.key] !== undefined ? sliderVals[s.key] : s.defaultVal;
                  return (
                    <div
                      key={s.key}
                      className="bg-[#1c1f2a] border border-[#262a35] rounded-xl p-3 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-white truncate max-w-[160px]">{s.label}</span>
                        <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                          {currentVal} {s.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={s.min}
                        max={s.max}
                        step={s.step}
                        value={currentVal}
                        onChange={(e) => handleSliderChange(s.key, parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 bg-[#313540] h-1.5 rounded-lg cursor-pointer my-2"
                      />
                      <div className="flex justify-between items-center text-[10px] font-mono text-outline">
                        <span>{s.minLabel}</span>
                        <span>{s.maxLabel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Real-Life Consequences: The 4 Bengaluru Pillars */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-5 shadow-xl">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">report_problem</span>
              <span>Direct, Real-Life Consequences in Bengaluru:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 1. Roads & Traffic */}
              <div className="bg-[#1c1f2a] border border-[#262a35] rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5 uppercase">
                      <span>🚗</span>
                      <span>Traffic &amp; Roads</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                      {currentScenario.consequences.traffic.delay}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">
                    {currentScenario.consequences.traffic.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-2">
                    {currentScenario.consequences.traffic.description}
                  </p>
                </div>
                <div className="bg-[#0f131d] p-2 rounded-lg border border-[#262a35] text-[11px] text-cyan-300 font-mono">
                  <strong>↪ Recommended Bypass:</strong> {currentScenario.consequences.traffic.detour}
                </div>
              </div>

              {/* 2. Electricity & Water */}
              <div className="bg-[#1c1f2a] border border-[#262a35] rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-yellow-400 flex items-center gap-1.5 uppercase">
                      <span>⚡</span>
                      <span>Utilities &amp; Grid</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/30">
                      Utility Status
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">
                    {currentScenario.consequences.powerWater.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-2">
                    {currentScenario.consequences.powerWater.description}
                  </p>
                </div>
                <div className="bg-[#0f131d] p-2 rounded-lg border border-[#262a35] text-[11px] text-amber-300 font-mono flex flex-col gap-0.5">
                  <span><strong>Infrastructure:</strong> {currentScenario.consequences.powerWater.homesAffected}</span>
                  <span><strong>Status:</strong> {currentScenario.consequences.powerWater.waterStatus}</span>
                </div>
              </div>

              {/* 3. Hospitals & Emergency */}
              <div className="bg-[#1c1f2a] border border-[#262a35] rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                      <span>🏥</span>
                      <span>Hospitals &amp; Medical</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      Medical Alert
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">
                    {currentScenario.consequences.healthEmergency.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-2">
                    {currentScenario.consequences.healthEmergency.description}
                  </p>
                </div>
                <div className="bg-[#0f131d] p-2 rounded-lg border border-[#262a35] text-[11px] text-emerald-300 font-mono flex flex-col gap-0.5">
                  <span><strong>Hospital:</strong> {currentScenario.consequences.healthEmergency.hospitalName}</span>
                  <span><strong>Corridor:</strong> {currentScenario.consequences.healthEmergency.ambulanceStatus}</span>
                </div>
              </div>

              {/* 4. Public Transit & Advisory */}
              <div className="bg-[#1c1f2a] border border-[#262a35] rounded-xl p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5 uppercase">
                      <span>🚌</span>
                      <span>Transit &amp; Advisory</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      BMTC / Metro
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">
                    {currentScenario.consequences.publicCommute.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-2">
                    {currentScenario.consequences.publicCommute.description}
                  </p>
                </div>
                <div className="bg-[#0f131d] p-2 rounded-lg border border-[#262a35] text-[11px] text-cyan-300 font-mono">
                  <strong>Citizen Tip:</strong> {currentScenario.consequences.publicCommute.citizenTip}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Authentic Bengaluru Map & Actions */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Authentic Bengaluru Interactive Leaflet Map Card */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-4 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                  Actual Bengaluru Map Location
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {currentScenario.locationName}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-outline">
                {currentScenario.coords[0].toFixed(4)}° N, {currentScenario.coords[1].toFixed(4)}° E
              </span>
            </div>

            {/* Leaflet Map Frame */}
            <div className="relative w-full rounded-xl overflow-hidden border border-[#262a35] shadow-inner bg-[#0a0e18]">
              <BengaluruTacticalMap
                height="380px"
                interactive={true}
                showControls={true}
                simulationIncident={mapIncident}
                customCenter={currentScenario.coords}
                customZoom={14}
              />
            </div>

            {/* Map Guidance */}
            <div className="mt-3 bg-[#1c1f2a] p-2.5 rounded-xl border border-[#262a35] text-[11px] font-mono flex items-center justify-between text-on-surface-variant flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <span>Incident Focal Pin (Pulsing)</span>
              </div>
              {currentScenario.detourRoute && (
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-3 h-0.5 bg-emerald-400 border border-emerald-400"></span>
                  <span>Green Dashed: Recommended Bypass</span>
                </div>
              )}
            </div>
          </div>

          {/* Realistic Civic Operational Budget & Savings Card */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3 border-b border-[#262a35] pb-2">
              <div>
                <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                  Civic Operational Budget &amp; Economics:
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  Realistic, Proportional Expenditure Model
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                PROPORTIONAL
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3 text-xs font-mono">
              <div className="bg-[#1c1f2a] p-3 rounded-xl border border-[#262a35]">
                <span className="text-outline text-[10px] uppercase block mb-1">Emergency Operations Cost:</span>
                <span className="text-cyan-400 font-bold text-base">{currentScenario.budget.operationalCost}</span>
                <span className="text-[10px] text-on-surface-variant block mt-1 leading-tight">
                  {currentScenario.budget.operationalCostDetails}
                </span>
              </div>

              <div className="bg-[#1c1f2a] p-3 rounded-xl border border-[#262a35]">
                <span className="text-outline text-[10px] uppercase block mb-1">Disruption Loss Prevented:</span>
                <span className="text-emerald-400 font-bold text-base">{currentScenario.budget.disruptionLossPrevented}</span>
                <span className="text-[10px] text-on-surface-variant block mt-1 leading-tight">
                  Efficiency: {currentScenario.budget.costEfficiencyRatio}
                </span>
              </div>
            </div>
          </div>

          {/* Immediate City Action Plan */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-400 text-[18px]">verified</span>
                <span>Immediate City Action Plan:</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                COORDINATED
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {currentScenario.cityActions.map((act, idx) => (
                <div
                  key={idx}
                  className="bg-[#1c1f2a] border border-[#262a35] p-2.5 rounded-xl flex items-start gap-2.5"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-mono text-[11px] font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${act.deptColor}`}>
                        {act.dept}
                      </span>
                      <span className="text-[10px] font-mono text-on-surface-variant">
                        {act.eta}
                      </span>
                    </div>
                    <p className="text-xs text-gray-200 mt-1 leading-snug">
                      {act.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison: Without Coordination vs. With City OS */}
      <div className="bg-[#171b26] border border-[#262a35] rounded-2xl p-5 shadow-xl mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#262a35]">
          <div>
            <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
              REAL-WORLD IMPACT COMPARISON
            </span>
            <h3 className="text-lg font-bold text-white">
              Without Inter-Agency Coordination vs. With City OS
            </h3>
          </div>
          <span className="text-xs font-mono text-outline">
            Simulated for: {currentScenario.name.split(' (')[0].split(':')[0]}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Old Way Box */}
          <div className="bg-[#1c1f2a] border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3 text-red-400 font-bold text-sm">
              <span className="material-symbols-outlined text-[20px]">cancel</span>
              <span>Without Coordination (Old Silos):</span>
            </div>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
              Agencies work independently with sequential phone calls, causing delays to cascade into citywide bottlenecks.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#0f131d] p-2.5 rounded-lg border border-[#262a35]">
                <span className="text-outline text-[10px] uppercase block mb-1">Time to Clear:</span>
                <span className="text-red-400 font-bold text-sm">{currentScenario.comparison.timeToClearOld}</span>
              </div>
              <div className="bg-[#0f131d] p-2.5 rounded-lg border border-[#262a35]">
                <span className="text-outline text-[10px] uppercase block mb-1">Traffic Delay Added:</span>
                <span className="text-red-400 font-bold text-sm">{currentScenario.comparison.trafficDelayOld}</span>
              </div>
              <div className="bg-[#0f131d] p-2.5 rounded-lg border border-[#262a35]">
                <span className="text-outline text-[10px] uppercase block mb-1">Emergency Delay:</span>
                <span className="text-red-400 font-bold text-xs">{currentScenario.comparison.emergencyDelayOld}</span>
              </div>
              <div className="bg-[#0f131d] p-2.5 rounded-lg border border-[#262a35]">
                <span className="text-outline text-[10px] uppercase block mb-1">Estimated Losses:</span>
                <span className="text-red-400 font-bold text-sm">{currentScenario.comparison.economicLossOld}</span>
              </div>
            </div>
          </div>

          {/* With City OS Box */}
          <div className="bg-[#1c1f2a] border border-cyan-500/40 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3 text-cyan-400 font-bold text-sm">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>With City OS Coordinated Response:</span>
            </div>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
              Real-time telemetry coupling synchronizes police green corridors, utility safety shutoffs, and public transit bypasses.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#0f131d] p-2.5 rounded-lg border border-[#262a35]">
                <span className="text-outline text-[10px] uppercase block mb-1">Time to Clear:</span>
                <span className="text-emerald-400 font-bold text-sm">{currentScenario.comparison.timeToClearNew}</span>
              </div>
              <div className="bg-[#0f131d] p-2.5 rounded-lg border border-[#262a35]">
                <span className="text-outline text-[10px] uppercase block mb-1">Traffic Delay Added:</span>
                <span className="text-emerald-400 font-bold text-sm">{currentScenario.comparison.trafficDelayNew}</span>
              </div>
              <div className="bg-[#0f131d] p-2.5 rounded-lg border border-[#262a35]">
                <span className="text-outline text-[10px] uppercase block mb-1">Emergency Delay:</span>
                <span className="text-emerald-400 font-bold text-xs">{currentScenario.comparison.emergencyDelayNew}</span>
              </div>
              <div className="bg-[#0f131d] p-2.5 rounded-lg border border-[#262a35]">
                <span className="text-outline text-[10px] uppercase block mb-1">Cost with City OS:</span>
                <span className="text-cyan-400 font-bold text-sm">{currentScenario.comparison.economicLossNew}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 right-8 bg-[#171b26]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-primary z-50 animate-fade-in font-mono text-xs">
          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
