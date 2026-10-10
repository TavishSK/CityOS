/**
 * Centralized Simulation & Resource Dispatch Service for Bengaluru City OS
 * Provides synchronized scenario models, realistic civic budgets, and
 * cross-agency fleet assets for What-If Simulation Lab & Resource Command.
 */

export interface DispatchedAsset {
  id: string;
  name: string;
  type: 'rescue' | 'police' | 'fire' | 'water' | 'power' | 'health' | 'transit';
  agency: string;
  location: string;
  status: 'ON SCENE' | 'DISPATCHED' | 'COMMITTED' | 'ACTIVE SEARCH' | 'PUMPING' | 'SPRAYING' | 'EN ROUTE' | 'STANDBY';
  statusClass: string;
  eta: string;
  capacity: string;
  task: string;
  officerInCharge?: string;
  coords?: [number, number];
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
  dispatchedAssets?: DispatchedAsset[];
}

export const PRESET_SCENARIOS: Record<string, ScenarioTemplate> = {
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
      [12.9716, 77.5946],
      [12.9750, 77.5910],
      [12.9790, 77.5900],
      [12.9810, 77.5930],
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
    },
    dispatchedAssets: [
      {
        id: 'AST-BCP-01',
        name: 'Bengaluru City Police SAR Squad Alpha #BCP-SAR-01',
        type: 'police',
        agency: 'Bengaluru City Police (Central Division)',
        location: 'Cubbon Park Bal Bhavan Inner Lawn',
        status: 'ACTIVE SEARCH',
        statusClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        eta: 'On Site',
        capacity: '8 Officers, Handheld Thermal Scanners, PA Megaphones',
        task: 'Grid search Sector A (Bal Bhavan playground, toy train tracks, lake edge)',
        officerInCharge: 'Insp. R. Manjunath',
        coords: [12.9755, 77.5932]
      },
      {
        id: 'AST-K9-02',
        name: 'City Police Canine Unit K9-TRACKER #K9-ALPHA',
        type: 'police',
        agency: 'City Armed Reserve (CAR K9 Squad)',
        location: 'Kasturba Road Cubbon Park Gate',
        status: 'ON SCENE',
        statusClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        eta: 'On Site',
        capacity: 'German Shepherd Bloodhound + 2 Handlers',
        task: 'Scent-tracking from last known footprint near toy train ticket counter',
        officerInCharge: 'Sub-Insp. S. Gowda',
        coords: [12.9748, 77.5925]
      },
      {
        id: 'AST-DRN-03',
        name: 'Thermal Aerial Recon Drone Squadron #DRN-HEX-02',
        type: 'rescue',
        agency: 'BBMP Disaster Management / Police Air Support',
        location: 'Airspace over Bamboo Grove & State Central Library',
        status: 'ACTIVE SEARCH',
        statusClass: 'text-primary bg-primary/10 border-primary/30',
        eta: 'Airborne (Altitude 45m)',
        capacity: '2 Hexacopters with FLIR Thermal Imaging & 4K Zoom',
        task: 'Canopy penetration & infrared body-heat scan across dense trees',
        officerInCharge: 'Drone Pilot N. Kumar',
        coords: [12.9768, 77.5915]
      },
      {
        id: 'AST-BTP-04',
        name: 'BTP Gate Interceptor & Spot-Check Cruiser #BTP-IC-07',
        type: 'police',
        agency: 'Bengaluru Traffic Police (Cubbon Park PS)',
        location: 'Hudson Circle & High Court Gate Junction',
        status: 'COMMITTED',
        statusClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        eta: 'On Site',
        capacity: '4 Traffic Marshals + ANPR Plate Scanner',
        task: 'Gate perimeter lockdown; visual verification of all egress vehicles',
        officerInCharge: 'Traffic ASI B. Ramesh',
        coords: [12.9720, 77.5948]
      },
      {
        id: 'AST-EMS-05',
        name: '108 Advanced Pediatric Paramedic Unit #EMS-PED-01',
        type: 'health',
        agency: 'DHS GVK-EMRI 108 Emergency',
        location: 'Bal Bhavan Main Entrance Gate (Kasturba Rd)',
        status: 'STANDBY',
        statusClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        eta: 'On Site',
        capacity: 'Pediatric ICU Van, Paramedic Doctor & Child Hydration kit',
        task: 'Immediate medical triage, dehydration treatment, and stabilization upon recovery',
        officerInCharge: 'Dr. Ananya Rao',
        coords: [12.9752, 77.5935]
      },
      {
        id: 'AST-BMR-06',
        name: 'BMRCL Metro Turnstile Security Detail #BMR-SEC-03',
        type: 'transit',
        agency: 'BMRCL Namma Metro Security',
        location: 'Cubbon Park Metro Station Concourse & AFC Gates',
        status: 'COMMITTED',
        statusClass: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        eta: 'On Site',
        capacity: '6 Security Officers + Station CCTV Controller',
        task: 'Screening platform turnstiles and CCTV cross-check against child photo',
        officerInCharge: 'Station Controller V. Nayak',
        coords: [12.9812, 77.5955]
      },
      {
        id: 'AST-BBMP-07',
        name: 'BBMP Horticulture Marshals Rapid Squad #BBMP-PRK-04',
        type: 'rescue',
        agency: 'BBMP Horticulture Department',
        location: 'Queen\'s Road & Press Club Perimeter Paths',
        status: 'ON SCENE',
        statusClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        eta: 'On Site',
        capacity: '10 Park Guards with Two-Way Walkie-Talkies',
        task: 'Securing walking trails, lotus pond, and park peripheral fencing',
        officerInCharge: 'Supervisor M. Venkatesh',
        coords: [12.9785, 77.5910]
      }
    ]
  },

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
    },
    dispatchedAssets: [
      {
        id: 'AST-PMP-01',
        name: 'BBMP High-Discharge Dewatering Pump #BLR-PMP-01',
        type: 'water',
        agency: 'BBMP Stormwater Drain Operations',
        location: 'Hebbal Flyover Underpass (Bellary Road ramp)',
        status: 'PUMPING',
        statusClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        eta: 'Active 25m',
        capacity: '15,000 Liters/min High-Pressure Suction',
        task: 'Draining 3.2ft floodwater into Hebbal Lake bypass storm canal',
        officerInCharge: 'Exec Eng. K. Chandrashekhar',
        coords: [13.0360, 77.5968]
      },
      {
        id: 'AST-PMP-02',
        name: 'BBMP High-Discharge Dewatering Pump #BLR-PMP-02',
        type: 'water',
        agency: 'BBMP Stormwater Drain Operations',
        location: 'Esteem Mall Service Road Junction',
        status: 'PUMPING',
        statusClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        eta: 'Active 18m',
        capacity: '12,500 Liters/min Diesel Centrifugal Pump',
        task: 'Relieving secondary puddle accumulation on airport outbound lane',
        officerInCharge: 'Asst Eng. V. Prakash',
        coords: [13.0420, 77.5960]
      },
      {
        id: 'AST-SDRF-03',
        name: 'Karnataka SDRF Flood Rescue Inflatable Raft #SDRF-04',
        type: 'rescue',
        agency: 'State Disaster Response Force (SDRF)',
        location: 'Kempapura Hebbal Lake Overflow Culvert',
        status: 'ON SCENE',
        statusClass: 'text-primary bg-primary/10 border-primary/30',
        eta: 'On Site',
        capacity: '8-Man Rescue Crew, 2 Inflatable Motorboats, Life Jackets',
        task: 'Safeguarding stranded motorists & assisting low-lying settlement residents',
        officerInCharge: 'Capt. R. Deshmukh',
        coords: [13.0390, 77.5995]
      },
      {
        id: 'AST-BTP-04',
        name: 'BTP Airport Corridor Diversion Flying Squad #BTP-DIV-02',
        type: 'police',
        agency: 'Bengaluru Traffic Police (Hebbal PS)',
        location: 'Mekhri Circle & Ganganagar Divert Point',
        status: 'COMMITTED',
        statusClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        eta: 'On Site',
        capacity: '12 Traffic Marshals, 4 Patrol Bikes, Mobile LED Divert Sign',
        task: 'Diverting airport-bound cabs to Hennur-Thanisandra Expressway bypass',
        officerInCharge: 'ACP T. Nagaraj',
        coords: [13.0110, 77.5880]
      },
      {
        id: 'AST-BES-05',
        name: 'BESCOM Substation Flood Isolation Van #BES-FL-08',
        type: 'power',
        agency: 'BESCOM North Distribution Division',
        location: 'Hebbal 66kV Substation Auxiliary Yard',
        status: 'ON SCENE',
        statusClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        eta: 'On Site',
        capacity: 'Portable Submersible Sump Pumps + High-Voltage Isolation Gear',
        task: 'Preventing substation transformer plinth submergence & backfeeding Sahakar Nagar',
        officerInCharge: 'Divisional Eng. P. Suresh',
        coords: [13.0335, 77.5945]
      },
      {
        id: 'AST-BMTC-06',
        name: 'BMTC Airport Feeder Shuttle Wave #BMTC-KIA-SHUTTLE',
        type: 'transit',
        agency: 'BMTC Airport Operations',
        location: 'Nagawara Metro Station to Kempegowda Airport',
        status: 'DISPATCHED',
        statusClass: 'text-secondary bg-secondary/10 border-secondary/30',
        eta: 'Every 10m Headway',
        capacity: '15 Low-Floor AC Electric Buses via Thanisandra Route',
        task: 'Picking up stranded airport travelers diverted from Bellary Road',
        officerInCharge: 'Depot Mgr. A. Patil',
        coords: [13.0450, 77.6220]
      },
      {
        id: 'AST-EMS-07',
        name: '108 Baptist Hospital Rear-Gate Green Corridor #EMS-BLR-09',
        type: 'health',
        agency: 'DHS GVK-EMRI 108 Emergency',
        location: 'Sanjaynagar Service Road (Baptist Rear Entrance)',
        status: 'COMMITTED',
        statusClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        eta: 'On Site',
        capacity: 'Advanced Cardiac ICU Ambulance + Trauma Team',
        task: 'Guaranteeing zero ambulance stoppage for emergency transfers into Baptist Hospital',
        officerInCharge: 'Dr. L. Shweta',
        coords: [13.0280, 77.5890]
      }
    ]
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
      [12.9800, 77.6050],
      [12.9830, 77.6120],
      [12.9860, 77.6100],
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
        label: 'Evacuation Perimeter',
        key: 'p3',
        min: 50,
        max: 300,
        step: 25,
        defaultVal: 150,
        unit: 'Meters Radius',
        minLabel: '50m (Single Lane)',
        maxLabel: '300m (Whole Market)'
      },
      {
        label: 'Water Hydrant Pressure',
        key: 'p4',
        min: 3,
        max: 10,
        step: 0.5,
        defaultVal: 6.5,
        unit: 'Bar Pressure (BWSSB)',
        minLabel: '3 Bar (Low)',
        maxLabel: '10 Bar (Max Booster)'
      }
    ],
    whatHappened:
      'Electrical short circuit in an upper-floor synthetic fabric storage warehouse on Ibrahim Sahib Street triggered a fast-spreading structural fire. Narrow alleyways restrict heavy vehicle access, requiring specialized rapid-response mini tenders and continuous water shuttle links.',
    consequences: {
      traffic: {
        title: 'Commercial Street & Dispensary Road Sealed',
        description:
          'Commercial Street pedestrian zone and vehicle approaches via Kamaraj Road and Dispensary Road closed to civilian vehicles. Heavy traffic buildup around Bowring Hospital and Infantry Road.',
        delay: '+34 minutes delay',
        detour: 'Divert through Central Street towards Cubbon Road; avoid Shivajinagar bus stand junction.'
      },
      powerWater: {
        title: 'Immediate Power Cut to Ibrahim Sahib Street Block',
        description:
          'BESCOM emergency squad isolated the 11kV commercial feeder supplying 84 retail shops to prevent electrical explosions and protect firefighters spraying water.',
        homesAffected: '84 shops & 120 residences temporarily de-energized',
        waterStatus: 'BWSSB diverted 150,000 liters from High Grounds reservoir directly to fire line'
      },
      healthEmergency: {
        title: 'Smoke Inhalation Triage at Bowring Hospital',
        description:
          'Smoke from burning synthetic fibers poses inhalation danger. Bowring & Lady Curzon Hospital trauma ward placed on code yellow alert.',
        hospitalName: 'Bowring & Lady Curzon Hospital (400m away)',
        ambulanceStatus: '3 Ambulances stationed at Dispensary Road junction; 2 treated for smoke inhalation'
      },
      publicCommute: {
        title: 'Shivajinagar BMTC Bus Terminus Congestion',
        description:
          'Buses departing Shivajinagar TTMC experiencing 15-minute delays navigating around Russell Market and OPH Road.',
        busStatus: 'Normal bus schedules with modified exit routes via Broadway',
        citizenTip: 'Avoid entering Commercial Street shopping zone; shoppers advised to disperse towards MG Road.'
      }
    },
    cityActions: [
      {
        dept: 'Karnataka State Fire & Emergency Services (KSFES)',
        deptColor: 'text-red-400 bg-red-500/10 border-red-500/30',
        action: '6 Fire tenders active; 2 high-pressure hydraulic turntable platforms deployed on narrow alley flank.',
        eta: 'Fire 70% contained'
      },
      {
        dept: 'Bengaluru City Police & Traffic Police',
        deptColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        action: 'Evacuated 350 shoppers from adjacent 8 apparel stores; sealed pedestrian entrance from Kamaraj Road.',
        eta: 'Perimeter locked'
      },
      {
        dept: 'BWSSB Water Supply',
        deptColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        action: 'Pressurized Shivajinagar fire hydrants to 7.5 Bar; dispatched 4 emergency water tankers to replenish tenders.',
        eta: 'Continuous water flow'
      }
    ],
    budget: {
      operationalCost: '₹3.6 Lakhs',
      operationalCostDetails: '6 fire tenders, 8 water bowsers, foam concentrate refills, 45 personnel, and medical triage station',
      disruptionLossPrevented: '₹34.0 Lakhs saved in prevented fire propagation across dense textile cluster and commercial inventory',
      costEfficiencyRatio: '1 : 9.4 (Every ₹1 spent on rapid fire containment prevents ₹9.4 in adjacent store destruction)'
    },
    comparison: {
      timeToClearOld: '3 hours 40 mins (Delayed water tanker refill, chaotic crowd entry)',
      timeToClearNew: '48 minutes (Hydrant pressure boosted, coordinated police cordon)',
      trafficDelayOld: '+55 mins gridlock around Russell Market',
      trafficDelayNew: '+16 mins (Infantry Road detour)',
      emergencyDelayOld: 'Ambulances blocked by narrow lane parked scooters',
      emergencyDelayNew: 'Green corridor cleared to Bowring Hospital in 3 mins',
      economicLossOld: '₹42 Lakhs (Fire spread to 6 adjacent textile shops)',
      economicLossNew: '₹3.6 Lakhs (Contained to single storage room)'
    },
    dispatchedAssets: [
      {
        id: 'AST-FIR-01',
        name: 'KSFES High-Pressure Foam Crash Tender #KSFES-FT-04',
        type: 'fire',
        agency: 'Karnataka State Fire & Emergency Services',
        location: 'Ibrahim Sahib Street (Front Alley)',
        status: 'ON SCENE',
        statusClass: 'text-red-400 bg-red-500/10 border-red-500/30',
        eta: 'On Site',
        capacity: '4,500 L Water + 500 L AFFF Chemical Foam',
        task: 'Direct high-pressure foam deluge on warehouse second-story window',
        officerInCharge: 'Station Fire Officer S. D\'Souza',
        coords: [12.9825, 77.6080]
      },
      {
        id: 'AST-FIR-02',
        name: 'KSFES Compact Alley Quick-Response Tender #KSFES-M-02',
        type: 'fire',
        agency: 'KSFES High Grounds Station',
        location: 'Commercial Street Pedestrian Cross-Cut',
        status: 'ON SCENE',
        statusClass: 'text-red-400 bg-red-500/10 border-red-500/30',
        eta: 'On Site',
        capacity: '1,200 L Water + High-Expansion Foam Nozzle',
        task: 'Preventing flame spread to adjacent silk saree showroom',
        officerInCharge: 'Sub-Officer R. Kulkarni',
        coords: [12.9820, 77.6085]
      },
      {
        id: 'AST-BWSSB-03',
        name: 'BWSSB Emergency Water Tanker Shuttle #BWSSB-TNK-08',
        type: 'water',
        agency: 'BWSSB Water Supply Division',
        location: 'Kamaraj Road Hydrant Point',
        status: 'PUMPING',
        statusClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        eta: 'Continuous Loop',
        capacity: '12,000 Liters Potable Hydrant Reserve',
        task: 'Refueling KSFES tenders with continuous water feed',
        officerInCharge: 'Asst Eng. M. Govind',
        coords: [12.9810, 77.6095]
      },
      {
        id: 'AST-EMS-04',
        name: '108 Burn & Smoke Inhalation Mobile ICU #EMS-BLR-02',
        type: 'health',
        agency: 'DHS GVK-EMRI 108 Emergency',
        location: 'Dispensary Road & Commercial St Corner',
        status: 'ON SCENE',
        statusClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        eta: 'On Site',
        capacity: '4-Bed Oxygen Station, Burn Trauma Kit, Defibrillator',
        task: 'Triage of smoke-inhalation victims & emergency paramedic care',
        officerInCharge: 'Dr. Zoya Khan',
        coords: [12.9818, 77.6075]
      },
      {
        id: 'AST-BCP-05',
        name: 'Bengaluru City Police Evacuation & Cordon #BCP-CRD-12',
        type: 'police',
        agency: 'Commercial Street Police Station',
        location: 'Commercial Street Entrance Arch (Kamaraj Rd)',
        status: 'COMMITTED',
        statusClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        eta: 'On Site',
        capacity: '16 Police Personnel with Barricades & Megaphones',
        task: 'Crowd control, evacuating shoppers, clearing lane for emergency tenders',
        officerInCharge: 'Inspector K. Naveen',
        coords: [12.9815, 77.6090]
      },
      {
        id: 'AST-BES-06',
        name: 'BESCOM Power Cutoff & Wire Isolation Squad #BES-ISO-01',
        type: 'power',
        agency: 'BESCOM Shivajinagar Subdivision',
        location: 'Commercial St 11kV Distribution Transformer Plinth',
        status: 'ON SCENE',
        statusClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        eta: 'On Site',
        capacity: 'High-Voltage Breaker Isolation & Safety Grounding Kit',
        task: 'Guaranteed de-energization of fire block to prevent electrocution',
        officerInCharge: 'Lineman Supervisor T. Jagadish',
        coords: [12.9830, 77.6078]
      },
      {
        id: 'AST-BTP-07',
        name: 'BTP Traffic Rerouting Unit #BTP-DIV-09',
        type: 'police',
        agency: 'Bengaluru Traffic Police (Shivajinagar PS)',
        location: 'Infantry Road & Dickenson Road Junction',
        status: 'COMMITTED',
        statusClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        eta: 'On Site',
        capacity: '6 Traffic Marshals + Diversion Cones',
        task: 'Rerouting commuter traffic toward Cubbon Road & Bowring Hospital clearway',
        officerInCharge: 'Traffic Sub-Insp. C. Girish',
        coords: [12.9835, 77.6110]
      }
    ]
  },

  'silk-board-gridlock': {
    id: 'silk-board-gridlock',
    name: 'Silk Board Junction Gridlock (Truck Axle Breakdown)',
    category: 'traffic',
    emoji: '🚗',
    badge: 'TOTAL GRIDLOCK RISK',
    badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
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
    },
    dispatchedAssets: [
      {
        id: 'AST-CRN-01',
        name: 'BTP Heavy Hydraulic Recovery Crane #BTP-CRN-01',
        type: 'rescue',
        agency: 'Bengaluru Traffic Police Recovery Unit',
        location: 'Silk Board Flyover Ascending Ramp',
        status: 'ON SCENE',
        statusClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        eta: 'On Site',
        capacity: '40-Tonne Hydraulic Winch & Flatbed Tow',
        task: 'Hooking container truck broken rear axle and hoisting off lane 2',
        officerInCharge: 'Crane Master B. Shivaraj',
        coords: [12.9180, 77.6240]
      },
      {
        id: 'AST-CRN-02',
        name: 'BTP Auxiliary Commercial Winch Truck #BTP-CRN-02',
        type: 'rescue',
        agency: 'BTP South East Traffic Division',
        location: 'Hosur Road Bommanahalli Flyover Exit',
        status: 'ON SCENE',
        statusClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        eta: 'On Site',
        capacity: '20-Tonne Heavy Towing Rig',
        task: 'Towing two collateral damaged cars to clear shoulder lane',
        officerInCharge: 'Sub-Insp. M. Anand',
        coords: [12.9150, 77.6220]
      },
      {
        id: 'AST-BTP-03',
        name: 'BTP Green-Corridor Motorcycle Pilot Squad #BTP-MOTO-04',
        type: 'police',
        agency: 'BTP Traffic Enforcement',
        location: 'St. John\'s Hospital Junction Corridor',
        status: 'COMMITTED',
        statusClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        eta: 'Active Escort',
        capacity: '4 High-Speed Traffic Pilot Motorcycles with Siren & Beacon',
        task: 'Escorting incoming 108 ambulances trapped in Hosur Road queue',
        officerInCharge: 'Rider Head Constable N. Raju',
        coords: [12.9320, 77.6200]
      },
      {
        id: 'AST-BMTC-04',
        name: 'BMTC Reserve Feeder Bus Wave #BMTC-HSR-FEEDER',
        type: 'transit',
        agency: 'BMTC South Zone Operations',
        location: 'HSR Layout BDA Complex to Bellandur ORR',
        status: 'DISPATCHED',
        statusClass: 'text-secondary bg-secondary/10 border-secondary/30',
        eta: 'Active 6m Headway',
        capacity: '12 Vajra AC Buses originating past Silk Board bottleneck',
        task: 'Clearing stranded tech commuters heading to Bellandur IT parks',
        officerInCharge: 'Traffic Inspector D. Srinivas',
        coords: [12.9120, 77.6380]
      },
      {
        id: 'AST-EMS-05',
        name: '108 Rapid Trauma ICU Ambulance #EMS-SE-04',
        type: 'health',
        agency: 'DHS GVK-EMRI 108 Emergency',
        location: 'Bommanahalli Signal Junction',
        status: 'ON SCENE',
        statusClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        eta: 'On Site',
        capacity: 'Mobile Trauma Resuscitation & Emergency Paramedic',
        task: 'Immediate medical assistance for truck driver and car occupants',
        officerInCharge: 'Dr. Vivek Menon',
        coords: [12.9090, 77.6225]
      },
      {
        id: 'AST-BTP-06',
        name: 'BTP Variable Message Signboard Cruiser #BTP-VMS-03',
        type: 'police',
        agency: 'BTP Intelligent Traffic Management (ITMS)',
        location: 'Kudlu Gate / Electronic City Expressway Egress',
        status: 'COMMITTED',
        statusClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        eta: 'On Site',
        capacity: 'High-Visibility Electronic LED Matrix Display',
        task: 'Broadcasting live diversion advisory: Take Haralur Road to Sarjapur',
        officerInCharge: 'Tech Officer P. Karthik',
        coords: [12.8900, 77.6400]
      }
    ]
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
    detourRoute: [
      [12.9850, 77.7050],
      [12.9900, 77.7200],
      [12.9950, 77.7350],
    ],
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
    },
    dispatchedAssets: [
      {
        id: 'AST-GEN-01',
        name: 'BESCOM Heavy Mobile Generator Unit #GEN-500-01',
        type: 'power',
        agency: 'BESCOM Emergency Reserve Fleet',
        location: 'Kadugodi Residential Feeder Station',
        status: 'COMMITTED',
        statusClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        eta: 'On Site',
        capacity: '500 kVA / 400 kW Heavy Diesel Gen-Set',
        task: 'Energizing domestic water pumping station & street lighting in Kadugodi',
        officerInCharge: 'Exec Eng. T. Sudhir',
        coords: [12.9980, 77.7600]
      },
      {
        id: 'AST-LINE-02',
        name: 'BESCOM High-Voltage Lineman Emergency Squad #BES-LIN-04',
        type: 'power',
        agency: 'BESCOM East Grid Maintenance',
        location: 'Hoodi 400kV Master Substation Bay 3',
        status: 'ON SCENE',
        statusClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        eta: 'On Site',
        capacity: '16 High-Voltage Certified Technicians + Thermal Gun',
        task: 'Diagnosing transformer cooling coil thermal trip & SCADA bypass link',
        officerInCharge: 'Chief Engineer K. Murali',
        coords: [12.9915, 77.7130]
      },
      {
        id: 'AST-BTP-03',
        name: 'BTP Manual Intersection Marshalling Squad #BTP-SIG-06',
        type: 'police',
        agency: 'Bengaluru Traffic Police (Whitefield PS)',
        location: 'Hope Farm Junction & ITPL Main Gate',
        status: 'ON SCENE',
        statusClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        eta: 'On Site',
        capacity: '10 Traffic Marshals with Portable Solar Signal Packs',
        task: 'Manual intersection traffic management at dark signal lights',
        officerInCharge: 'Inspector B. Govindaraj',
        coords: [12.9840, 77.7500]
      },
      {
        id: 'AST-HOSP-04',
        name: 'Critical Healthcare Power Audit Van #BES-AUDIT-02',
        type: 'health',
        agency: 'BESCOM Essential Services Cell / Health DHS',
        location: 'Manipal Hospital & Vydehi Hospital Campus',
        status: 'ON SCENE',
        statusClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        eta: 'On Site',
        capacity: 'Electrical Auditor + 2,000L Emergency Diesel Tanker',
        task: 'Guaranteed uninterrupted fuel & auxiliary grid link for hospital ICUs',
        officerInCharge: 'Safety Officer Dr. N. Ramesh',
        coords: [12.9730, 77.7280]
      },
      {
        id: 'AST-BMTC-05',
        name: 'BMTC Whitefield Feeder Electric Shuttles #BMTC-WF-EV',
        type: 'transit',
        agency: 'BMTC Transit',
        location: 'Kadugodi Tree Park Metro to ITPL Loop',
        status: 'DISPATCHED',
        statusClass: 'text-secondary bg-secondary/10 border-secondary/30',
        eta: 'Active 7m Headway',
        capacity: '8 Electric Feeder Vans (Zero-Emissions)',
        task: 'Facilitating tech employee commute during intersection slowdowns',
        officerInCharge: 'Depot Supervisor R. Mohan',
        coords: [12.9880, 77.7450]
      }
    ]
  }
};

/**
 * Derives a rich, correlated set of 6-8 DispatchedAssets for ANY scenario.
 * If the scenario has explicit dispatchedAssets, returns them; otherwise synthesizes
 * high-fidelity, location-specific Bangalore municipal units.
 */
export function getScenarioAssets(scenario: ScenarioTemplate): DispatchedAsset[] {
  if (scenario.dispatchedAssets && scenario.dispatchedAssets.length > 0) {
    return scenario.dispatchedAssets;
  }

  const loc = scenario.locationName;
  const cat = scenario.category || 'general';
  const coords = scenario.coords || [12.9716, 77.5946];

  const assets: DispatchedAsset[] = [];

  // Asset 1: Primary Taskforce from City Actions
  const action1 = scenario.cityActions[0] || {
    dept: 'BBMP Municipal Operations',
    action: 'Rapid field mobilization and perimeter safety',
    eta: 'On Site'
  };
  assets.push({
    id: 'AST-PRM-01',
    name: `${action1.dept} Rapid Unit #BLR-RU-01`,
    type: cat === 'fire' ? 'fire' : cat === 'flood' ? 'water' : cat === 'search' ? 'police' : cat === 'power' ? 'power' : 'rescue',
    agency: action1.dept,
    location: loc,
    status: 'ON SCENE',
    statusClass: 'text-primary bg-primary/10 border-primary/30',
    eta: action1.eta || 'On Site',
    capacity: 'Specialized Emergency Team & First-Response Fleet',
    task: action1.action,
    coords: [coords[0] + 0.001, coords[1] + 0.001]
  });

  // Asset 2: Secondary Department Unit from City Actions
  if (scenario.cityActions[1]) {
    const action2 = scenario.cityActions[1];
    assets.push({
      id: 'AST-SEC-02',
      name: `${action2.dept} Field Squad #BLR-FS-02`,
      type: action2.dept.toLowerCase().includes('police') || action2.dept.toLowerCase().includes('traffic') ? 'police' : action2.dept.toLowerCase().includes('fire') ? 'fire' : action2.dept.toLowerCase().includes('power') || action2.dept.toLowerCase().includes('bescom') ? 'power' : 'rescue',
      agency: action2.dept,
      location: `${loc} Perimeter`,
      status: 'COMMITTED',
      statusClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      eta: action2.eta || '4 mins',
      capacity: 'Tactical Deployment Team with Direct Radio Link',
      task: action2.action,
      coords: [coords[0] - 0.001, coords[1] - 0.001]
    });
  }

  // Asset 3: Traffic & Detour Interceptor
  assets.push({
    id: 'AST-BTP-03',
    name: 'BTP Traffic Interceptor & Diversion Cruiser #BTP-DIV-05',
    type: 'police',
    agency: 'Bengaluru Traffic Police (BTP)',
    location: scenario.consequences.traffic.detour.split(' ')[0] ? `${scenario.consequences.traffic.detour.split(';')[0].slice(0, 32)}` : `${loc} Sector Divert`,
    status: 'COMMITTED',
    statusClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    eta: 'On Site',
    capacity: '6 Traffic Marshals + Variable Diversion Signs',
    task: `Enforcing bypass corridor: ${scenario.detourLabel || scenario.consequences.traffic.detour.slice(0, 60)}`,
    coords: [coords[0] - 0.003, coords[1] + 0.002]
  });

  // Asset 4: Medical / Health Standby
  const hosp = scenario.consequences.healthEmergency.hospitalName || 'Bowring & Lady Curzon Hospital';
  assets.push({
    id: 'AST-EMS-04',
    name: `108 Advanced Emergency Paramedic Unit #EMS-108-${cat.slice(0, 2).toUpperCase()}`,
    type: 'health',
    agency: 'DHS GVK-EMRI 108 Emergency',
    location: `${loc} Incident Triage Area`,
    status: 'ON SCENE',
    statusClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    eta: 'On Site',
    capacity: `ICU Support, Oxygen, Paramedic Doctor linked to ${hosp}`,
    task: scenario.consequences.healthEmergency.description.slice(0, 80),
    coords: [coords[0] + 0.002, coords[1] - 0.002]
  });

  // Asset 5: Infrastructure & Utility Unit (BESCOM / BWSSB)
  if (cat === 'flood' || cat === 'water') {
    assets.push({
      id: 'AST-PMP-05',
      name: 'BBMP Heavy Dewatering Trailer Pump #PMP-FL-08',
      type: 'water',
      agency: 'BBMP Stormwater Drain Maintenance',
      location: loc,
      status: 'PUMPING',
      statusClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      eta: 'Active Now',
      capacity: '12,500 LPM High-Capacity Suction Pump',
      task: 'Pumping standing floodwater into nearest stormwater drain culvert',
      coords: [coords[0] + 0.0005, coords[1] - 0.001]
    });
  } else if (cat === 'fire') {
    assets.push({
      id: 'AST-FIR-05',
      name: 'KSFES Multi-Stage Water Bowser #KSFES-WB-09',
      type: 'fire',
      agency: 'Karnataka State Fire & Emergency Services',
      location: `${loc} Flank Approach`,
      status: 'ON SCENE',
      statusClass: 'text-red-400 bg-red-500/10 border-red-500/30',
      eta: 'On Site',
      capacity: '6,000 Liters Water + High-Expansion Foam',
      task: 'Continuous water deluge & thermal barrier cooling',
      coords: [coords[0] - 0.0015, coords[1] + 0.0015]
    });
  } else if (cat === 'search') {
    assets.push({
      id: 'AST-K9-05',
      name: 'City Armed Reserve K9 Tracking Squad #K9-SWEEP',
      type: 'police',
      agency: 'Bengaluru City Police CAR K9',
      location: loc,
      status: 'ACTIVE SEARCH',
      statusClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      eta: 'On Site',
      capacity: '2 Scent Tracker Canines + 4 Officers',
      task: 'Perimeter trail tracking and ground search sweep',
      coords: [coords[0] + 0.0012, coords[1] + 0.0008]
    });
  } else {
    assets.push({
      id: 'AST-ENG-05',
      name: 'BESCOM / BBMP Rapid Utility Squad #UTIL-04',
      type: 'power',
      agency: 'BESCOM Grid Operations',
      location: loc,
      status: 'COMMITTED',
      statusClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      eta: '6 mins',
      capacity: 'Mobile Emergency Gen-Set & Cable Isolation Kit',
      task: scenario.consequences.powerWater.description.slice(0, 80),
      coords: [coords[0] + 0.0015, coords[1] - 0.001]
    });
  }

  // Asset 6: Public Transit Feeder / BMTC Advisory Bus
  assets.push({
    id: 'AST-BMTC-06',
    name: 'BMTC Dynamic Transit Feeder Loop #BMTC-DYN-01',
    type: 'transit',
    agency: 'BMTC Transit Operations',
    location: `${loc} Transit Junction`,
    status: 'DISPATCHED',
    statusClass: 'text-secondary bg-secondary/10 border-secondary/30',
    eta: 'Continuous (8m Headway)',
    capacity: '4 Electric Feeder Buses for Detour Relief',
    task: scenario.consequences.publicCommute.busStatus || 'Smoothing citizen transit through detour routes',
    coords: [coords[0] - 0.002, coords[1] - 0.003]
  });

  return assets;
}

/**
 * Intelligent semantic synthesizer fallback for any Bengaluru query.
 */
export function generateLocalSimulation(userPrompt: string): ScenarioTemplate {
  const q = userPrompt.toLowerCase();

  // Location heuristics
  let coords: [number, number] = [12.9716, 77.5946];
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

  // Incident Type logic
  if (q.includes('child') || q.includes('lost') || q.includes('missing') || q.includes('search') || q.includes('kid')) {
    const sc: ScenarioTemplate = {
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
        operationalCostDetails: '12 police search marshals, drone surveillance pilot, PA audio setup, and rapid community alerts',
        disruptionLossPrevented: '₹1.5 Lakhs saved in public panic mitigation and rapid resolution',
        costEfficiencyRatio: '1 : 3.6 (Every ₹1 spent accelerates golden-hour recovery)'
      },
      comparison: {
        timeToClearOld: '4 hours 00 mins (Unorganized crowd panic, delayed CCTV review)',
        timeToClearNew: '35 minutes (City OS coordinated gate lockdown & drone grid)',
        trafficDelayOld: '+30 mins unmanaged vehicle chaos',
        trafficDelayNew: '+10 mins (Orderly spot checks)',
        emergencyDelayOld: 'Delayed medical alert',
        emergencyDelayNew: 'Paramedic van standing by',
        economicLossOld: '₹2.2 Lakhs (Wasted emergency hours)',
        economicLossNew: '₹42,000 (Targeted swift resolution)'
      }
    };
    sc.dispatchedAssets = getScenarioAssets(sc);
    return sc;
  }

  if (q.includes('fire') || q.includes('smoke') || q.includes('burn') || q.includes('flame') || q.includes('explosion')) {
    const sc: ScenarioTemplate = {
      id: `custom-fire-${Date.now()}`,
      name: `${locationName.split(' &')[0]}: Emergency Fire Containment Protocol`,
      category: 'fire',
      emoji: '🔥',
      badge: 'ALARM LEVEL 2 FIRE',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
      headline: `Active structural fire outbreak reported at ${locationName}; multi-agency emergency response triggered`,
      locationName,
      zone,
      coords,
      affectedPopulation: '~12,000 local citizens & workers in proximity',
      detourLabel: `Cordon established around ${locationName}; use parallel ring road bypass`,
      whatHappened: `A fast-developing structural fire was reported at ${locationName}. Karnataka State Fire & Emergency Services (KSFES) and Bengaluru Traffic Police have cordoned the danger radius and mobilized high-pressure foam tenders.`,
      sliders: [
        { label: 'Buildings in Danger Radius', key: 'p1', min: 1, max: 12, step: 1, defaultVal: 3, unit: 'Structures', minLabel: '1 Building', maxLabel: '12 Buildings' },
        { label: 'Fire Tenders on Scene', key: 'p2', min: 2, max: 10, step: 1, defaultVal: 5, unit: 'Fire Engines', minLabel: '2 Engines', maxLabel: '10 Engines' },
        { label: 'Evacuation Perimeter', key: 'p3', min: 50, max: 400, step: 25, defaultVal: 150, unit: 'Meters Radius', minLabel: '50m Core', maxLabel: '400m Wide' },
        { label: 'Water Booster Pressure', key: 'p4', min: 3, max: 10, step: 0.5, defaultVal: 7.0, unit: 'Bar Pressure', minLabel: '3 Bar', maxLabel: '10 Bar (Max)' }
      ],
      consequences: {
        traffic: {
          title: `Roads Approaching ${locationName} Diverted`,
          description: `Approaches to ${locationName} are blocked for emergency tender vehicle access. Heavy congestion on connecting arterial corridors.`,
          delay: '+28 minutes delay',
          detour: 'Avoid the area; follow traffic police electronic signs toward alternate bypass.'
        },
        powerWater: {
          title: 'Feeder Power Cut for Firefighter Safety',
          description: 'BESCOM has cut electricity to the local transformer block to prevent high-voltage electrical arcing.',
          homesAffected: '45 buildings de-energized for safety',
          waterStatus: 'BWSSB diverted 80,000 liters from nearest reservoir for tenders'
        },
        healthEmergency: {
          title: 'Burn & Smoke Inhalation Station Deployed',
          description: '108 Advanced Life Support ambulances stationed at perimeter with burn dressing and high-flow oxygen.',
          hospitalName: 'Bowring Hospital / Victoria Hospital Burn ICU',
          ambulanceStatus: 'Green corridor cleared for medical emergency access'
        },
        publicCommute: {
          title: 'Public Transit Rerouted Around Incident Zone',
          description: 'BMTC bus routes passing through the cordoned area are diverted via the next major crossroad.',
          busStatus: 'Normal bus frequencies on alternate parallel routes',
          citizenTip: 'Stay clear of the smoke plume; merchants advised to turn off main circuit breakers.'
        }
      },
      cityActions: [
        { dept: 'Karnataka State Fire Services (KSFES)', deptColor: 'text-red-400 bg-red-500/10 border-red-500/30', action: '5 fire tenders active; establishing cooling perimeter.', eta: 'Under control in 25m' },
        { dept: 'Bengaluru Traffic Police', deptColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', action: 'Cleared 200m vehicle approach corridor for incoming water bowsers.', eta: 'Corridor clear' }
      ],
      budget: {
        operationalCost: '₹3.2 Lakhs',
        operationalCostDetails: '5 fire tenders, 6 water tankers, specialized chemical foam, 32 personnel, and medical triage setup',
        disruptionLossPrevented: '₹24.0 Lakhs in prevented structural damage and commercial inventory loss',
        costEfficiencyRatio: '1 : 7.5 (Every ₹1 spent prevents ₹7.5 in adjacent building destruction)'
      },
      comparison: {
        timeToClearOld: '3 hours 15 mins (Delayed water supply & civilian congestion)',
        timeToClearNew: '45 minutes (Automated hydrant boost & green corridor)',
        trafficDelayOld: '+50 mins severe bottleneck',
        trafficDelayNew: '+15 mins (Detour active)',
        emergencyDelayOld: 'Ambulances blocked in market street',
        emergencyDelayNew: 'Green corridor to hospital in 4 mins',
        economicLossOld: '₹32 Lakhs (Fire spread to adjacent properties)',
        economicLossNew: '₹3.2 Lakhs (Fast containment cost)'
      }
    };
    sc.dispatchedAssets = getScenarioAssets(sc);
    return sc;
  }

  if (q.includes('flood') || q.includes('waterlog') || q.includes('rain') || q.includes('lake') || q.includes('drain')) {
    const sc: ScenarioTemplate = {
      id: `custom-flood-${Date.now()}`,
      name: `${locationName.split(' &')[0]}: Severe Waterlogging & Monsoon Flood Response`,
      category: 'flood',
      emoji: '🌊',
      badge: 'WATERLOGGING ALERT',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
      headline: `Intense water accumulation causing road submersion at ${locationName}`,
      locationName,
      zone,
      coords,
      affectedPopulation: '~45,000 commuters & neighborhood residents',
      detourLabel: `Avoid underpasses near ${locationName}; use elevated alternate road`,
      whatHappened: `Heavy localized rainfall overloaded the stormwater drainage network at ${locationName}, causing up to 2.5 feet of standing water on the carriageway. Light vehicles cannot pass safely.`,
      sliders: [
        { label: 'Rainfall Intensity', key: 'p1', min: 20, max: 100, step: 5, defaultVal: 65, unit: 'mm/hour', minLabel: '20mm', maxLabel: '100mm (Severe)' },
        { label: 'Standing Water Depth', key: 'p2', min: 0.5, max: 4.0, step: 0.2, defaultVal: 2.2, unit: 'Feet', minLabel: '0.5 ft', maxLabel: '4.0 ft (Deep)' },
        { label: 'Storm Drains Blocked', key: 'p3', min: 10, max: 90, step: 5, defaultVal: 55, unit: '% Silted', minLabel: '10% Clear', maxLabel: '90% Blocked' },
        { label: 'BBMP Suction Pumps', key: 'p4', min: 1, max: 8, step: 1, defaultVal: 4, unit: 'Pumps Active', minLabel: '1 Pump', maxLabel: '8 Pumps' }
      ],
      consequences: {
        traffic: {
          title: `Vehicles Halted at ${locationName}`,
          description: `Water accumulation has stalled two-wheelers and sedans. Northbound and southbound lanes congested.`,
          delay: '+35 minutes delay',
          detour: 'Divert through adjacent elevated flyover or outer ring bypass.'
        },
        powerWater: {
          title: 'Low-Lying Feeder Plinths Isolated',
          description: 'BESCOM power operations isolated 2 road-level transformer plinths to prevent electrocution hazards.',
          homesAffected: '3,200 households temporarily affected',
          waterStatus: 'BWSSB sewage pumps operating at full discharge'
        },
        healthEmergency: {
          title: 'Paramedic Van Stationed on High Ground',
          description: '108 ambulance standing by to assist stranded commuters or elderly citizens.',
          hospitalName: 'Local Government General Hospital',
          ambulanceStatus: 'Ambulance rerouted via elevated road'
        },
        publicCommute: {
          title: 'BMTC Buses Operating at Slow Speed',
          description: 'High-clearance BMTC buses can cross but at 10 km/h; minor bus schedule bunching.',
          busStatus: 'Feeder buses operating with minor delays',
          citizenTip: 'Do not attempt to drive two-wheelers through dark water pools; wait for BBMP dewatering.'
        }
      },
      cityActions: [
        { dept: 'BBMP Stormwater Engineering', deptColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', action: 'Deployed 4 mobile dewatering pumps (10,000 LPM capacity).', eta: 'Pumping active' },
        { dept: 'Bengaluru Traffic Police', deptColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', action: 'Guiding traffic along the rightmost high-elevation lane.', eta: 'Traffic moving' }
      ],
      budget: {
        operationalCost: '₹4.5 Lakhs',
        operationalCostDetails: '4 high-power diesel pumps, 8 suction tankers, drain clearing crews, and traffic marshals',
        disruptionLossPrevented: '₹18.0 Lakhs in commuter fuel waste and prevented vehicle engine hydro-locking damages',
        costEfficiencyRatio: '1 : 4.0 (Every ₹1 invested in dewatering saves ₹4 in vehicle engine hydro-lock repairs)'
      },
      comparison: {
        timeToClearOld: '4 hours 20 mins (Delayed pump arrival)',
        timeToClearNew: '1 hour 05 mins (City OS rapid dewatering)',
        trafficDelayOld: '+65 mins heavy waterlogged jam',
        trafficDelayNew: '+16 mins (Coordinated slow lane)',
        emergencyDelayOld: 'Ambulances stalled in water pool',
        emergencyDelayNew: 'Rerouted to dry corridor',
        economicLossOld: '₹22 Lakhs (Engine hydro-locks & fuel waste)',
        economicLossNew: '₹4.5 Lakhs (Quick containment)'
      }
    };
    sc.dispatchedAssets = getScenarioAssets(sc);
    return sc;
  }

  if (q.includes('tree') || q.includes('branch') || q.includes('block') || q.includes('fall')) {
    const sc: ScenarioTemplate = {
      id: `custom-tree-${Date.now()}`,
      name: `${locationName.split(' &')[0]}: Fallen Heritage Tree Clearance Protocol`,
      category: 'traffic',
      emoji: '🌳',
      badge: 'CARRIAGEWAY BLOCKED',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      headline: `Large rain-soaked Gulmohar tree fallen across main carriageway at ${locationName}`,
      locationName,
      zone,
      coords,
      affectedPopulation: '~25,000 commuters during peak hours',
      detourLabel: `Take immediate left into service road; avoid main carriage road at ${locationName}`,
      whatHappened: `A large 40-year-old tree fell across both lanes of ${locationName} following gusty winds, bringing down overhead telecom and BESCOM power cables and completely blocking vehicle movement.`,
      sliders: [
        { label: 'Trunk Diameter & Size', key: 'p1', min: 1, max: 4, step: 0.5, defaultVal: 2.5, unit: 'Feet Diameter', minLabel: '1 ft (Branch)', maxLabel: '4 ft (Full Trunk)' },
        { label: 'BBMP Chainsaw Teams', key: 'p2', min: 1, max: 6, step: 1, defaultVal: 3, unit: 'Tree Cutting Teams', minLabel: '1 Team', maxLabel: '6 Teams' },
        { label: 'Overhead Cables Torn', key: 'p3', min: 2, max: 20, step: 2, defaultVal: 8, unit: 'Power / Fiber Cables', minLabel: '2 Lines', maxLabel: '20 Lines' },
        { label: 'Hydraulic Winch Cranes', key: 'p4', min: 1, max: 4, step: 1, defaultVal: 2, unit: 'Hydraulic Cranes', minLabel: '1 Crane', maxLabel: '4 Cranes' }
      ],
      consequences: {
        traffic: {
          title: `Traffic Blocked at ${locationName}`,
          description: `Vehicles cannot pass through the blocked section. Traffic tailback is building rapidly toward adjacent junctions.`,
          delay: '+30 minutes delay',
          detour: 'Divert through adjacent residential cross roads or parallel ring road.'
        },
        powerWater: {
          title: 'Overhead BESCOM Lines Safely Isolated',
          description: 'BESCOM quick reaction team cut power to the snapped overhead wires within 3 minutes to eliminate electrocution risk.',
          homesAffected: '450 homes on local transformer without power',
          waterStatus: 'Normal'
        },
        healthEmergency: {
          title: 'Zero Casualties Reported; Paramedic on Standby',
          description: '108 medical team inspected the site; no pedestrians or motorists injured.',
          hospitalName: 'Nearby General Hospital',
          ambulanceStatus: 'Ambulances rerouted through parallel lane'
        },
        publicCommute: {
          title: 'BMTC Buses Diverted via Parallel Cross',
          description: 'BMTC bus controllers redirecting buses 1 block before the blockage to keep passenger flow moving.',
          busStatus: 'Normal bus service on diverted loop',
          citizenTip: 'Do not approach dangling black cables; BBMP Forest Cell is cutting the trunk.'
        }
      },
      cityActions: [
        { dept: 'BBMP Forest & Tree Management Cell', deptColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', action: '3 hydraulic chainsaw squads cutting branches and clearing trunk with crane.', eta: 'Clearance in 28m' },
        { dept: 'BESCOM Lineman Rapid Action', deptColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30', action: 'Untangling snapped lines; preparing pole re-stringing.', eta: 'Restoring power' }
      ],
      budget: {
        operationalCost: '₹65,000',
        operationalCostDetails: '3 chainsaw squads, hydraulic crane hire, 2 tipper trucks for timber clearance, and lineman overtime',
        disruptionLossPrevented: '₹3.8 Lakhs in citizen fuel waste and avoided secondary accidents',
        costEfficiencyRatio: '1 : 5.8 (Every ₹1 spent clears arterial road 3 hours faster)'
      },
      comparison: {
        timeToClearOld: '3 hours 45 mins (Slow manual saw cutting, waiting for crane)',
        timeToClearNew: '32 minutes (Automated City OS dual crane & chainsaw mobilization)',
        trafficDelayOld: '+60 mins total gridlock',
        trafficDelayNew: '+14 mins (Orderly diversion)',
        emergencyDelayOld: 'Ambulance stuck behind fallen branches',
        emergencyDelayNew: 'Immediate bypass established',
        economicLossOld: '₹4.5 Lakhs (Fuel wastage & missed work hours)',
        economicLossNew: '₹65,000 (Targeted clearance cost)'
      }
    };
    sc.dispatchedAssets = getScenarioAssets(sc);
    return sc;
  }

  // General Bengaluru Urban Incident Fallback
  const sc: ScenarioTemplate = {
    id: `custom-event-${Date.now()}`,
    name: `${locationName.split(' &')[0]}: Municipal Incident Coordination`,
    category: 'general',
    emoji: '🏙️',
    badge: 'COORDINATED RESPONSE',
    badgeColor: 'bg-primary/20 text-primary border-primary/40',
    headline: `Unified municipal incident response activated for ${userPrompt} at ${locationName}`,
    locationName,
    zone,
    coords,
    affectedPopulation: '~20,000 citizens in affected ward',
    detourLabel: `Follow Bengaluru Traffic Police marshals at ${locationName} perimeter`,
    whatHappened: `A municipal situation was reported: "${userPrompt}". Bengaluru City OS has initiated synchronized cross-agency response across BBMP, BTP, and utility teams.`,
    sliders: [
      { label: 'Incident Severity Level', key: 'p1', min: 1, max: 5, step: 1, defaultVal: 3, unit: 'Severity Grade', minLabel: 'Grade 1 (Minor)', maxLabel: 'Grade 5 (Critical)' },
      { label: 'Agency Field Personnel', key: 'p2', min: 4, max: 30, step: 2, defaultVal: 14, unit: 'Staff On Duty', minLabel: '4 Staff', maxLabel: '30 Staff' },
      { label: 'Area Containment %', key: 'p3', min: 20, max: 100, step: 10, defaultVal: 80, unit: '% Managed', minLabel: '20% Partial', maxLabel: '100% Contained' },
      { label: 'Public Advisory Reach', key: 'p4', min: 1000, max: 50000, step: 5000, defaultVal: 18000, unit: 'Citizens Notified', minLabel: '1k Citizens', maxLabel: '50k Citizens' }
    ],
    consequences: {
      traffic: {
        title: `Traffic Flow Managed around ${locationName}`,
        description: `Traffic police actively synchronizing signal lights to prevent spillover queues.`,
        delay: '+14 minutes delay',
        detour: 'Follow digital road signboards for optimal alternate routing.'
      },
      powerWater: {
        title: 'Utility Grid Telemetry Monitored',
        description: 'BESCOM and BWSSB monitoring local load and water pressure in real time.',
        homesAffected: 'Zero unexpected residential outage',
        waterStatus: 'Normal utility supply'
      },
      healthEmergency: {
        title: 'Emergency Medical Standby Active',
        description: '108 ambulance standing by to handle any emergency requirements in the area.',
        hospitalName: 'Nearest District Hospital',
        ambulanceStatus: 'Emergency response ready'
      },
      publicCommute: {
        title: 'BMTC Public Transit Operating Smoothly',
        description: 'BMTC fleet operations running with route smoothing and automated headway tracking.',
        busStatus: 'Normal bus schedule with route smoothing',
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
  sc.dispatchedAssets = getScenarioAssets(sc);
  return sc;
}

export const ACTIVE_SIMULATION_STORAGE_KEY = 'blr_cityos_active_simulation';

/**
 * Loads the currently active simulation scenario from localStorage,
 * falling back to Cubbon Park Search preset.
 */
export function getStoredActiveSimulation(): ScenarioTemplate {
  try {
    const raw = localStorage.getItem(ACTIVE_SIMULATION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id && parsed.name) {
        // Ensure assets are present
        if (!parsed.dispatchedAssets || parsed.dispatchedAssets.length === 0) {
          parsed.dispatchedAssets = getScenarioAssets(parsed);
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading stored simulation scenario:', e);
  }
  return PRESET_SCENARIOS['cubbon-park-search'];
}

/**
 * Saves the active simulation scenario to localStorage and dispatches a window event.
 */
export function storeActiveSimulation(sc: ScenarioTemplate): void {
  try {
    if (!sc.dispatchedAssets || sc.dispatchedAssets.length === 0) {
      sc.dispatchedAssets = getScenarioAssets(sc);
    }
    localStorage.setItem(ACTIVE_SIMULATION_STORAGE_KEY, JSON.stringify(sc));
    window.dispatchEvent(new CustomEvent('blr_cityos_simulation_changed', { detail: sc }));
  } catch (e) {
    console.warn('Error saving active simulation scenario:', e);
  }
}

// ============================================================================
// CITYWIDE IMPACT CHAIN & CAUSAL TOPOLOGY DATA STRUCTURES
// ============================================================================

export interface ScenarioImpactNode {
  id: string;
  stage: 1 | 2 | 3 | 4;
  stageLabel: string;
  title: string;
  sector: string;
  colorClass: string;
  badgeBg: string;
  desc: string;
  vuln: string;
  metric: string;
  metricLabel: string;
  ripple: string;
  location: string;
  upstreamFrom?: string;
  severPointId?: string;
}

export interface ScenarioSeverIntervention {
  id: string;
  name: string;
  agency: string;
  action: string;
  consequencePrevented: string;
  efficiency: string;
  targetNodeIds: string[];
}

export interface ScenarioImpactChainData {
  graphId: string;
  rootStressor: string;
  rootStressorDetail: string;
  silosImpacted: string;
  cascadeVelocity: string;
  citizensAtRisk: string;
  riskRadius: string;
  nodes: Record<string, ScenarioImpactNode>;
  severInterventions: ScenarioSeverIntervention[];
  summary: string;
}

// ============================================================================
// AI RESPONSE PLANNER DATA STRUCTURES
// ============================================================================

export interface ScenarioResponseDirective {
  stepNumber: number;
  priority: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'URGENT';
  priorityColor: string;
  agencies: string;
  leadOfficial: string;
  title: string;
  explanation: string;
  resourcesCommitted: string;
  executionWindow: string;
  telemetryHook: string;
  approved: boolean;
  approvedBy?: string;
}

export interface ScenarioResourceConflict {
  resourceName: string;
  resourceType: string;
  agencyA: string;
  needA: string;
  agencyB: string;
  needB: string;
  aiArbitrationProposal: string;
  arbitrationFeasibility: string;
  rationale: string;
  status: 'PENDING' | 'RESOLVED';
}

export interface ScenarioResponsePlanData {
  planId: string;
  title: string;
  incidentName: string;
  location: string;
  protocolClass: string;
  severityLevel: string;
  aiConfidence: string;
  summary: string;
  targetResolutionWindow: string;
  projectedDeltas: {
    cascadeReduction: string;
    cascadeReductionLabel: string;
    timeSaved: string;
    timeSavedLabel: string;
    economicSaved: string;
    economicSavedLabel: string;
  };
  resourceConflict: ScenarioResourceConflict;
  directives: ScenarioResponseDirective[];
}

/**
 * Returns a mathematically and logically synchronized 4-stage causal impact chain
 * for ANY scenario in Bengaluru.
 */
export function getScenarioImpactChain(sc: ScenarioTemplate): ScenarioImpactChainData {
  const loc = sc.locationName.split(' &')[0].split(' (')[0];
  const cat = sc.category.toLowerCase();

  // 1. HEBBAL FLOOD CAUSAL TOPOLOGY
  if (sc.id === 'hebbal-flood' || loc.toLowerCase().includes('hebbal') || (cat === 'flood' && loc.toLowerCase().includes('hebbal'))) {
    return {
      graphId: 'NET-IMPACT-BLR-HEBBAL',
      rootStressor: '3.2 ft Underpass Flood',
      rootStressorDetail: 'Hebbal Sump Runoff Overflow',
      silosImpacted: '4 Sectors Bound',
      cascadeVelocity: '+18.5% / hr',
      citizensAtRisk: sc.affectedPopulation || '~85,000 Commuters',
      riskRadius: 'Hebbal, RT Nagar, Yelahanka',
      summary: 'Storm runoff overflow under Hebbal flyover ramp halts KIA Airport transit, isolating Baptist Hospital emergency care and threatening electrical substation feeders.',
      nodes: {
        'node-nexus': {
          id: 'ENV-TRIGGER-HEBBAL',
          stage: 1,
          stageLabel: 'Stage 01: Shock Nexus',
          title: 'Hebbal Flyover Ramp Inundation (3.2 ft)',
          sector: 'HYDROLOGICAL / BBMP STORMWATER',
          colorClass: 'text-error',
          badgeBg: 'bg-error/15',
          desc: 'Heavy stormwater from Hebbal Lake overflow channel surged into the sunken highway underpass, drowning road surface and stalling 40+ motor vehicles.',
          vuln: '9.8',
          metric: '3.2 ft Depth',
          metricLabel: 'Standing Water',
          ripple: '5 Primary Sectors',
          location: 'Hebbal Flyover / Bellary Road Underpass'
        },
        'node-sec-power': {
          id: 'NODE-SECTOR-POWER',
          stage: 2,
          stageLabel: 'Stage 02: Primary Stress',
          title: 'Hebbal 11kV Substation Isolation Trip',
          sector: 'ENERGY (BESCOM)',
          colorClass: 'text-primary',
          badgeBg: 'bg-primary/15',
          desc: 'BESCOM emergency linemen tripped 11kV feeder lines into submerged underpass streetlight conduits to eliminate lethal electrocution risks for stranded motorists.',
          vuln: '8.4',
          metric: '18,500 Homes',
          metricLabel: 'Grid Safeguard Mode',
          ripple: '3 Sub-Grids',
          location: 'Hebbal Kempapura & Sahakar Nagar',
          upstreamFrom: 'node-nexus'
        },
        'node-sec-transit': {
          id: 'NODE-SECTOR-TRANSIT',
          stage: 2,
          stageLabel: 'Stage 02: Primary Stress',
          title: 'Bellary Road & KIA Airport Arterial Stoppage',
          sector: 'TRANSIT OPERATIONS (BTP)',
          colorClass: 'text-secondary',
          badgeBg: 'bg-secondary/15',
          desc: 'Complete halt of north-bound traffic to Kempegowda International Airport. Tailback queue spans 4.2 kilometers reaching Mekhri Circle.',
          vuln: '9.2',
          metric: '+58 mins Delay',
          metricLabel: 'Commute Inflation',
          ripple: '4 Key Corridors',
          location: 'Bellary Road / Mekhri Circle Corridor',
          upstreamFrom: 'node-nexus'
        },
        'node-sec-health': {
          id: 'NODE-SECTOR-HEALTH',
          stage: 2,
          stageLabel: 'Stage 02: Primary Stress',
          title: 'Baptist Hospital Main Entrance Gate Flooded',
          sector: 'PUBLIC HEALTH (BBMP / 108 EMS)',
          colorClass: 'text-error',
          badgeBg: 'bg-error/15',
          desc: 'Front entrance on Bellary Road is submerged under 2.5 ft water. 108 Ambulances carrying trauma and cardiac patients cannot access the primary casualty triage bay.',
          vuln: '9.5',
          metric: '14 Ambulances',
          metricLabel: 'Access Impeded',
          ripple: '3 ER Networks',
          location: 'Baptist Hospital Bellary Road Gate',
          upstreamFrom: 'node-nexus'
        },
        'node-mult-commute': {
          id: 'NODE-MULT-COMMUTE',
          stage: 3,
          stageLabel: 'Stage 03: Cross Multiplier',
          title: 'BMTC Vayu Vajra & Manyata Tech Commuters Trapped',
          sector: 'TRANSIT + COMMERCE',
          colorClass: 'text-secondary',
          badgeBg: 'bg-secondary/15',
          desc: 'Over 40 BMTC airport buses halted. 45,000 tech employees exiting Manyata Tech park cannot merge onto the flooded Outer Ring Road.',
          vuln: '7.8',
          metric: '40 Buses Stalled',
          metricLabel: 'Mass Transit Choke',
          ripple: 'Manyata & Nagawara',
          location: 'Manyata Tech Park Gate 1 & 2',
          upstreamFrom: 'node-sec-transit'
        },
        'node-mult-health-power': {
          id: 'NODE-MULT-HEALTH-POWER',
          stage: 3,
          stageLabel: 'Stage 03: Cross Multiplier',
          title: 'Baptist Hospital ICU on Auxiliary Generator Fuel',
          sector: 'HEALTH + UTILITIES',
          colorClass: 'text-error',
          badgeBg: 'bg-error/15',
          desc: 'Hospital life-support operating on diesel backup; fuel delivery tanker is delayed in the Bellary Road gridlock queue.',
          vuln: '8.9',
          metric: '4.5 hrs Fuel',
          metricLabel: 'Diesel Reserve',
          ripple: '2 Hospital Wings',
          location: 'Baptist Hospital Emergency Genset',
          upstreamFrom: 'node-sec-health'
        },
        'node-mult-water': {
          id: 'NODE-MULT-WATER',
          stage: 3,
          stageLabel: 'Stage 03: Cross Multiplier',
          title: 'BWSSB Pumping Booster Station Submersion',
          sector: 'WATER WORKS (BWSSB)',
          colorClass: 'text-tertiary',
          badgeBg: 'bg-tertiary/15',
          desc: 'Storm drain overflow breached the pump house perimeter wall, threatening freshwater supply to Sahakar Nagar and Kodigehalli.',
          vuln: '7.4',
          metric: '-15 PSI Loss',
          metricLabel: 'Water Distribution',
          ripple: '2 Municipal Wards',
          location: 'BWSSB Hebbal Valley Pumping Station',
          upstreamFrom: 'node-sec-power'
        },
        'node-bottleneck': {
          id: 'BOTTLENECK-CRITICAL-NORTH',
          stage: 4,
          stageLabel: 'Stage 04: Systemic Bottleneck',
          title: 'Bengaluru Northern Arterial Grid Collapse',
          sector: 'CROSS-SILO CATASTROPHIC FAILURE',
          colorClass: 'text-error',
          badgeBg: 'bg-error/20',
          desc: 'Airport transit paralysis collides with hospital ambulance route blockade and electrical feeder safety shutdowns, generating systemic paralysis across North Bengaluru.',
          vuln: '9.9',
          metric: 'Total Gridlock',
          metricLabel: 'Systemic Fracture',
          ripple: '8 Municipal Divisions',
          location: 'North Bengaluru Master Arterial Ring'
        }
      },
      severInterventions: [
        {
          id: 'SEVER-A',
          name: 'Open Nagawara Sluice Gates & Deploy 6 High-Power Sump Pumps',
          agency: 'BBMP Stormwater & KSFES Dewatering',
          action: 'Diverts 45,000 LPM of flood runoff away from flyover into storm canal, lowering water level by 2.2 ft in 30 minutes.',
          consequencePrevented: 'Re-opens two central highway lanes, preventing total airport route collapse.',
          efficiency: '92% Water Clearance',
          targetNodeIds: ['node-sec-power', 'node-sec-transit']
        },
        {
          id: 'SEVER-B',
          name: 'BTP Hennur-Thanisandra Green Bypass & Hospital Rear Gate Corridor',
          agency: 'Bengaluru Traffic Police & BBMP Health',
          action: 'Reroutes airport taxis via Thanisandra Main Road and opens Sanjaynagar service road for 108 Baptist ambulances.',
          consequencePrevented: 'Guarantees zero stoppage for trauma patients and preserves airport passenger departures.',
          efficiency: '88% Route Recovery',
          targetNodeIds: ['node-sec-health', 'node-mult-health-power']
        }
      ]
    };
  }

  // 2. CUBBON PARK MISSING CHILD PROTOCOL AMBER
  if (sc.id === 'cubbon-park-search' || loc.toLowerCase().includes('cubbon') || cat === 'search') {
    return {
      graphId: 'NET-IMPACT-BLR-CUBBON',
      rootStressor: 'Child Missing (Protocol Amber)',
      rootStressorDetail: 'Bal Bhavan Play Area Core',
      silosImpacted: '4 Sectors Bound',
      cascadeVelocity: 'Golden Hour (T-45m)',
      citizensAtRisk: sc.affectedPopulation || '~6,500 Park Visitors',
      riskRadius: 'Cubbon Park, MG Road, Kasturba Rd',
      summary: 'Child separation near Bal Bhavan initiates Protocol Amber: securing 7 park gates, thermal drone canopy sweeps, and coordinated metro turnstile screening.',
      nodes: {
        'node-nexus': {
          id: 'ENV-TRIGGER-CUBBON',
          stage: 1,
          stageLabel: 'Stage 01: Shock Nexus',
          title: '7-Year-Old Child Separated near Bal Bhavan',
          sector: 'PUBLIC SAFETY & WELFARE (BCP)',
          colorClass: 'text-error',
          badgeBg: 'bg-error/15',
          desc: 'Child separated from parents inside Cubbon Park at 16:45. Dense bamboo clusters and multiple exit gates create an urgent golden-hour search window.',
          vuln: '9.6',
          metric: '150 Acres',
          metricLabel: 'Primary Search Zone',
          ripple: '7 Perimeter Gates',
          location: 'Cubbon Park Bal Bhavan / Toy Train Edge'
        },
        'node-sec-power': {
          id: 'NODE-SECTOR-SECURITY',
          stage: 2,
          stageLabel: 'Stage 02: Primary Stress',
          title: 'All 7 Park Perimeter Gates Sealed for Vehicle Egress',
          sector: 'HORTICULTURE & POLICE (BBMP / BCP)',
          colorClass: 'text-primary',
          badgeBg: 'bg-primary/15',
          desc: 'Gate marshals close vehicle exits across Kasturba Rd, Press Club, and High Court gates; conducting visual child verification on departing adults.',
          vuln: '8.2',
          metric: '7 Gates Sealed',
          metricLabel: 'Cordon Active',
          ripple: '3 Surrounding Roads',
          location: 'Cubbon Park Perimeter Gates',
          upstreamFrom: 'node-nexus'
        },
        'node-sec-transit': {
          id: 'NODE-SECTOR-TRANSIT',
          stage: 2,
          stageLabel: 'Stage 02: Primary Stress',
          title: 'Kasturba Road & Hudson Circle Vehicle Spot-Checks',
          sector: 'TRAFFIC MANAGEMENT (BTP)',
          colorClass: 'text-secondary',
          badgeBg: 'bg-secondary/15',
          desc: 'Traffic marshals slow incoming traffic on Kasturba Road and Queen\'s Road to monitor pedestrian crossings and support perimeter lockdown.',
          vuln: '7.4',
          metric: '+12 mins Delay',
          metricLabel: 'Gate Spot-Checks',
          ripple: 'Hudson Circle Arterials',
          location: 'Kasturba Road & Hudson Circle',
          upstreamFrom: 'node-nexus'
        },
        'node-sec-health': {
          id: 'NODE-SECTOR-HEALTH',
          stage: 2,
          stageLabel: 'Stage 02: Primary Stress',
          title: 'Pediatric Medical & First Aid Standby at Hudson Gate',
          sector: 'EMERGENCY MEDICAL (108 / BBMP)',
          colorClass: 'text-error',
          badgeBg: 'bg-error/15',
          desc: '108 Pediatric paramedic van positioned with hydration and emergency care ready immediately upon child location.',
          vuln: '7.8',
          metric: 'Paramedic Ready',
          metricLabel: 'Gate 1 Staging',
          ripple: 'Bowring Hospital Pediatric Bay',
          location: 'Hudson Circle Gate 1',
          upstreamFrom: 'node-nexus'
        },
        'node-mult-commute': {
          id: 'NODE-MULT-COMMUTE',
          stage: 3,
          stageLabel: 'Stage 03: Cross Multiplier',
          title: 'Cubbon Park & Vidhana Soudha Metro Turnstile Screen',
          sector: 'TRANSIT + RAPID SURVEILLANCE',
          colorClass: 'text-secondary',
          badgeBg: 'bg-secondary/15',
          desc: 'BMRCL metro security monitoring passenger gates with real-time description verification before commuters board trains.',
          vuln: '7.5',
          metric: '2 Metro Stations',
          metricLabel: 'Platform Gates Checked',
          ripple: 'Purple Line Commute',
          location: 'Cubbon Park Metro Station',
          upstreamFrom: 'node-sec-transit'
        },
        'node-mult-health-power': {
          id: 'NODE-MULT-HEALTH-POWER',
          stage: 3,
          stageLabel: 'Stage 03: Cross Multiplier',
          title: 'Park High-Mast LED & PA Broadcast Energized',
          sector: 'ENERGY + PUBLIC COMMS',
          colorClass: 'text-primary',
          badgeBg: 'bg-primary/15',
          desc: 'BESCOM energizes full walking-trail illumination early; PA speakers continuously broadcast child description in Kannada, English, and Hindi.',
          vuln: '6.5',
          metric: '100% Illumination',
          metricLabel: 'High-Mast Active',
          ripple: 'Inner Park Canopy',
          location: 'Central Library & Bamboo Walk',
          upstreamFrom: 'node-sec-power'
        },
        'node-mult-water': {
          id: 'NODE-MULT-WATER',
          stage: 3,
          stageLabel: 'Stage 03: Cross Multiplier',
          title: 'Volunteer Search Mesh & K9 Bloodhound Deployment',
          sector: 'POLICE TACTICAL (CAR K9)',
          colorClass: 'text-tertiary',
          badgeBg: 'bg-tertiary/15',
          desc: 'Canine squad tracking scent from toy train ticket area outward while 3 thermal drones scan tree canopies.',
          vuln: '8.1',
          metric: '14 Squads Active',
          metricLabel: 'Grid Search Mesh',
          ripple: '3 Park Sectors',
          location: 'Bal Bhavan to State Central Library',
          upstreamFrom: 'node-sec-health'
        },
        'node-bottleneck': {
          id: 'BOTTLENECK-CRITICAL-AMBER',
          stage: 4,
          stageLabel: 'Stage 04: Systemic Bottleneck',
          title: 'Golden Hour Perimeter Evaporation Risk',
          sector: 'SEARCH PERIMETER BREACH RISK',
          colorClass: 'text-error',
          badgeBg: 'bg-error/20',
          desc: 'If park gates or metro stations remain uncoordinated, search area expands from 150 acres of enclosed park to the open metropolitan core.',
          vuln: '9.4',
          metric: 'Cordon Critical',
          metricLabel: 'Search Window',
          ripple: 'All Central Bengaluru',
          location: 'Bengaluru Central District Mesh'
        }
      },
      severInterventions: [
        {
          id: 'SEVER-A',
          name: 'Thermal Drone Hexacopter Canopy Sweep & K9 Scent Tracking',
          agency: 'City Armed Reserve & BBMP Air Support',
          action: 'FLIR infrared body-heat scan pierces dense bamboo canopy in Sector A within 15 minutes.',
          consequencePrevented: 'Locates child immediately before sunset, eliminating night-time search complications.',
          efficiency: '96% Detection Rate',
          targetNodeIds: ['node-sec-power', 'node-mult-water']
        },
        {
          id: 'SEVER-B',
          name: 'Gate Lockdown & Metro Turnstile Facial Verification Protocol',
          agency: 'Bengaluru City Police & BMRCL Security',
          action: 'Instant gate marshal lockdown seals all egress points while BMRCL monitors turnstiles.',
          consequencePrevented: 'Completely prevents child from wandering into high-traffic MG Road or boarding departing trains.',
          efficiency: '99% Perimeter Integrity',
          targetNodeIds: ['node-sec-transit', 'node-mult-commute']
        }
      ]
    };
  }

  // 3. COMMERCIAL STREET FIRE OUTBREAK
  if (sc.id === 'commercial-street-fire' || loc.toLowerCase().includes('commercial') || cat === 'fire') {
    return {
      graphId: 'NET-IMPACT-BLR-COMMERCIAL-FIRE',
      rootStressor: 'Level 2 Structural Fire',
      rootStressorDetail: 'Textile Warehouse Complex',
      silosImpacted: '4 Sectors Bound',
      cascadeVelocity: '+24% / 15m',
      citizensAtRisk: sc.affectedPopulation || '~14,000 Shoppers & Staff',
      riskRadius: 'Commercial St, Ibrahim Sahib St, Kamaraj Rd',
      summary: 'Synthetic fabric warehouse fire in narrow Ibrahim Sahib Street threatens adjoining historic markets, requiring electrical isolation and emergency water relays.',
      nodes: {
        'node-nexus': {
          id: 'ENV-TRIGGER-FIRE',
          stage: 1,
          stageLabel: 'Stage 01: Shock Nexus',
          title: 'Textile Warehouse Fire on Ibrahim Sahib Street',
          sector: 'FIRE & RESCUE (KSFES)',
          colorClass: 'text-error',
          badgeBg: 'bg-error/15',
          desc: 'Synthetic garment inventory fire producing dense toxic smoke in narrow 12-foot alleys, restricting standard fire tender access.',
          vuln: '9.7',
          metric: '4 Shops in Danger',
          metricLabel: 'Structural Threat',
          ripple: '6 Commercial Blocks',
          location: 'Ibrahim Sahib Street / Commercial St'
        },
        'node-sec-power': {
          id: 'NODE-SECTOR-POWER-FIRE',
          stage: 2,
          stageLabel: 'Stage 02: Primary Stress',
          title: '11kV Feeder Isolation across 84 Retail Outlets',
          sector: 'ENERGY (BESCOM)',
          colorClass: 'text-primary',
          badgeBg: 'bg-primary/15',
          desc: 'Immediate power cut to prevent electrical transformer explosion and safeguard firefighters spraying continuous water streams.',
          vuln: '8.6',
          metric: '84 Retail Outlets',
          metricLabel: 'Feeder Isolated',
          ripple: '2 Distribution Blocks',
          location: 'Commercial Street Commercial Feeder',
          upstreamFrom: 'node-nexus'
        },
        'node-sec-transit': {
          id: 'NODE-SECTOR-TRANSIT-FIRE',
          stage: 2,
          stageLabel: 'Stage 02: Primary Stress',
          title: 'Dispensary Road & Kamaraj Road Sealed for Emergency Lane',
          sector: 'TRAFFIC OPS (BTP)',
          colorClass: 'text-secondary',
          badgeBg: 'bg-secondary/15',
          desc: 'Civilian vehicles diverted from Commercial Street approaches to establish a clean corridor for high-capacity water bowsers and rescue vehicles.',
          vuln: '8.8',
          metric: '+34 mins Delay',
          metricLabel: 'Shivajinagar Queue',
          ripple: 'Infantry Road Arterials',
          location: 'Kamaraj Road & Dispensary Road',
          upstreamFrom: 'node-nexus'
        },
        'node-sec-health': {
          id: 'NODE-SECTOR-HEALTH-FIRE',
          stage: 2,
          stageLabel: 'Stage 02: Primary Stress',
          title: 'Bowring Hospital Smoke Inhalation Trauma Bay Staged',
          sector: 'PUBLIC HEALTH (DHS / BBMP)',
          colorClass: 'text-error',
          badgeBg: 'bg-error/15',
          desc: 'Bowring & Lady Curzon Hospital trauma ward prepared with oxygen respirators and burn treatment protocols for evacuated shopkeepers.',
          vuln: '8.2',
          metric: '18 Trauma Beds',
          metricLabel: 'Triage Standby',
          ripple: 'Bowring Hospital ER',
          location: 'Bowring & Lady Curzon Hospital',
          upstreamFrom: 'node-nexus'
        },
        'node-mult-commute': {
          id: 'NODE-MULT-COMMUTE-FIRE',
          stage: 3,
          stageLabel: 'Stage 03: Cross Multiplier',
          title: 'Shivajinagar Bus Station Spillover Congestion',
          sector: 'TRANSIT + AIR QUALITY',
          colorClass: 'text-secondary',
          badgeBg: 'bg-secondary/15',
          desc: 'Dense smoke plumes drift towards Shivajinagar BMTC terminal; bus departures rerouted via Central Street to avoid smoke inhalation risks.',
          vuln: '7.6',
          metric: '25 Buses Re-routed',
          metricLabel: 'Bus Terminal Egress',
          ripple: 'Shivajinagar Terminal',
          location: 'Shivajinagar Bus Station',
          upstreamFrom: 'node-sec-transit'
        },
        'node-mult-health-power': {
          id: 'NODE-MULT-HEALTH-POWER-FIRE',
          stage: 3,
          stageLabel: 'Stage 03: Cross Multiplier',
          title: 'BWSSB Hydrant Water Booster Pressure Drop',
          sector: 'WATER WORKS (BWSSB)',
          colorClass: 'text-tertiary',
          badgeBg: 'bg-tertiary/15',
          desc: 'Fire engines drawing 8,000 LPM from municipal hydrants causes localized water pressure drop across Tasker Town lines.',
          vuln: '7.9',
          metric: '6.5 Bar Booster',
          metricLabel: 'Hydrant Flow',
          ripple: 'Tasker Town & Shivaji Nagar',
          location: 'Tasker Town BWSSB Main Booster',
          upstreamFrom: 'node-sec-power'
        },
        'node-mult-water': {
          id: 'NODE-MULT-WATER-FIRE',
          stage: 3,
          stageLabel: 'Stage 03: Cross Multiplier',
          title: 'Adjoining Heritage Commercial Blocks Evacuated',
          sector: 'PUBLIC SAFETY (BBMP)',
          colorClass: 'text-error',
          badgeBg: 'bg-error/15',
          desc: '150-meter safety cordon evacuated to prevent fire leap across shared wooden attic structures of historic colonial market buildings.',
          vuln: '8.4',
          metric: '150m Perimeter',
          metricLabel: 'Evacuation Zone',
          ripple: '14,000 Shoppers',
          location: 'Commercial Street Central Walkway',
          upstreamFrom: 'node-sec-health'
        },
        'node-bottleneck': {
          id: 'BOTTLENECK-CRITICAL-FIRE',
          stage: 4,
          stageLabel: 'Stage 04: Systemic Bottleneck',
          title: 'Dense Historic Market Conflagration & Route Choke',
          sector: 'URBAN CONFLAGRATION THREAT',
          colorClass: 'text-error',
          badgeBg: 'bg-error/20',
          desc: 'Narrow lane blockages prevent continuous water shuttle, while smoke plume chokes Shivajinagar and emergency access to Bowring Hospital.',
          vuln: '9.8',
          metric: 'Critical Blockade',
          metricLabel: 'Cascade Peak',
          ripple: 'Shivajinagar Commercial Core',
          location: 'Central Commercial Core'
        }
      },
      severInterventions: [
        {
          id: 'SEVER-A',
          name: 'Deploy KSFES Foam Tender & Establish 150m Relay Hose Line',
          agency: 'KSFES Fire Services & BWSSB',
          action: 'Deploys high-expansion synthetic foam to blanket burning warehouse and establishes high-pressure relay hose from Kamaraj Road.',
          consequencePrevented: 'Stops fire leap into adjoining retail shops within 18 minutes.',
          efficiency: '94% Fire Arrest',
          targetNodeIds: ['node-sec-power-fire', 'node-mult-health-power-fire']
        },
        {
          id: 'SEVER-B',
          name: 'BTP Clearway & Bowring Hospital Emergency Green Corridor',
          agency: 'Bengaluru Traffic Police & BBMP Health',
          action: 'Enforces dedicated emergency clearway along Kamaraj Road exclusively for fire bowsers and ambulances.',
          consequencePrevented: 'Maintains zero ambulance travel time for burn casualties to Bowring Hospital.',
          efficiency: '91% Clearway Efficiency',
          targetNodeIds: ['node-sec-transit-fire', 'node-sec-health-fire']
        }
      ]
    };
  }

  // 4. SILK BOARD JUNCTION TOTAL GRIDLOCK
  if (sc.id === 'silk-board-gridlock' || loc.toLowerCase().includes('silk board') || cat === 'traffic') {
    return {
      graphId: 'NET-IMPACT-BLR-SILKBOARD',
      rootStressor: 'Flyover Ramp Blockage',
      rootStressorDetail: 'Heavy Truck Axle Failure',
      silosImpacted: '4 Sectors Bound',
      cascadeVelocity: '1.2 km / 15 mins',
      citizensAtRisk: sc.affectedPopulation || '~140,000 Commuters',
      riskRadius: 'Silk Board, Hosur Rd, HSR, BTM, Bellandur',
      summary: 'Disabled heavy cargo truck on Silk Board flyover halts south-east Bengaluru arterial corridors, stalling emergency hospital transfers and 85 BMTC bus routes.',
      nodes: {
        'node-nexus': {
          id: 'ENV-TRIGGER-SILKBOARD',
          stage: 1,
          stageLabel: 'Stage 01: Shock Nexus',
          title: 'Heavy Truck Breakdown on Silk Board Flyover Ramp',
          sector: 'TRAFFIC MANAGEMENT (BTP)',
          colorClass: 'text-error',
          badgeBg: 'bg-error/15',
          desc: 'Multi-axle truck snapped chassis on narrow flyover ramp towards Outer Ring Road, blocking 2 out of 3 lanes during peak commuting rush.',
          vuln: '9.8',
          metric: '9,500 Vehicles',
          metricLabel: 'Immediate Queue',
          ripple: '5 South Arterials',
          location: 'Central Silk Board Junction'
        },
        'node-sec-power': {
          id: 'NODE-SECTOR-TRANSIT-HOSUR',
          stage: 2,
          stageLabel: 'Stage 02: Primary Stress',
          title: 'Hosur Road & Electronic City Expressway Halting',
          sector: 'TRAFFIC OPS (BTP)',
          colorClass: 'text-secondary',
          badgeBg: 'bg-secondary/15',
          desc: 'North-bound commuter traffic from Electronic City and Bommanahalli crawling at under 4 km/h over a 5.8 km tailback.',
          vuln: '9.1',
          metric: '+65 mins Delay',
          metricLabel: 'Expressway Stall',
          ripple: 'Electronic City Toll',
          location: 'Hosur Road / Bommanahalli',
          upstreamFrom: 'node-nexus'
        },
        'node-sec-transit': {
          id: 'NODE-SECTOR-TRANSIT-ORR',
          stage: 2,
          stageLabel: 'Stage 02: Primary Stress',
          title: 'Outer Ring Road (HSR to Bellandur) Stalled',
          sector: 'TRANSIT & COMMERCE (BTP)',
          colorClass: 'text-secondary',
          badgeBg: 'bg-secondary/15',
          desc: 'Commuter flow into Bellandur tech corridor frozen. Employees cannot access tech parks; BMTC Vajra buses unable to enter flyover.',
          vuln: '8.9',
          metric: '85 BMTC Buses',
          metricLabel: 'Fleet Trapped',
          ripple: 'HSR Layout & Bellandur',
          location: 'Outer Ring Road HSR Junction',
          upstreamFrom: 'node-nexus'
        },
        'node-sec-health': {
          id: 'NODE-SECTOR-HEALTH-STJOHNS',
          stage: 2,
          stageLabel: 'Stage 02: Primary Stress',
          title: '108 Ambulances Trapped on Route to St. John\'s Hospital',
          sector: 'PUBLIC HEALTH (108 / DHS)',
          colorClass: 'text-error',
          badgeBg: 'bg-error/15',
          desc: 'Four emergency ambulances transferring cardiac and trauma patients from South Bengaluru unable to negotiate the gridlock on Hosur Road.',
          vuln: '9.6',
          metric: '+28 mins EMS Delay',
          metricLabel: 'Life-Support Risk',
          ripple: 'St. John\'s Hospital ER',
          location: 'Hosur Road / St. John\'s Hospital',
          upstreamFrom: 'node-nexus'
        },
        'node-mult-commute': {
          id: 'NODE-MULT-RESIDENTIAL-BTM',
          stage: 3,
          stageLabel: 'Stage 03: Cross Multiplier',
          title: 'BTM Layout Residential Roads Choked by Diverting Cars',
          sector: 'LOCAL TRANSIT & CITIZEN SAFETY',
          colorClass: 'text-secondary',
          badgeBg: 'bg-secondary/15',
          desc: 'Navigation apps redirecting thousands of vehicles through narrow residential 16th Main in BTM 2nd Stage, blocking local school buses.',
          vuln: '7.8',
          metric: 'BTM Gridlocked',
          metricLabel: 'Spillover Bypass',
          ripple: 'BTM 1st & 2nd Stage',
          location: 'BTM Layout 16th Main Road',
          upstreamFrom: 'node-sec-power'
        },
        'node-mult-health-power': {
          id: 'NODE-MULT-AQI-EXHAUST',
          stage: 3,
          stageLabel: 'Stage 03: Cross Multiplier',
          title: 'High Vehicle Exhaust & Idling Air Quality Spike',
          sector: 'ENVIRONMENT & HEALTH',
          colorClass: 'text-error',
          badgeBg: 'bg-error/15',
          desc: 'Thousands of idling diesel trucks and cars elevate localized PM2.5 to 198 µg/m³ around Silk Board underpass.',
          vuln: '7.5',
          metric: 'AQI 245 Poor',
          metricLabel: 'Exhaust Spike',
          ripple: 'Bommanahalli Ward',
          location: 'Silk Board Junction Basin',
          upstreamFrom: 'node-sec-transit'
        },
        'node-mult-water': {
          id: 'NODE-MULT-METRO-FEEDER',
          stage: 3,
          stageLabel: 'Stage 03: Cross Multiplier',
          title: 'Yellow Line Metro Construction Feeder Lane Constriction',
          sector: 'CIVIC INFRASTRUCTURE (BMRCL)',
          colorClass: 'text-tertiary',
          badgeBg: 'bg-tertiary/15',
          desc: 'Heavy tow trucks navigating around metro construction barricades face tight turning radiuses, delaying physical truck removal.',
          vuln: '8.2',
          metric: 'Narrow Clearance',
          metricLabel: 'Tow Truck Constraint',
          ripple: 'Metro Construction Zone',
          location: 'Silk Board Metro Interchange',
          upstreamFrom: 'node-sec-health'
        },
        'node-bottleneck': {
          id: 'BOTTLENECK-CRITICAL-SILKBOARD',
          stage: 4,
          stageLabel: 'Stage 04: Systemic Bottleneck',
          title: 'South-East Bengaluru Mega-Arterial Paralysis',
          sector: 'TOTAL METROPOLITAN GRIDLOCK',
          colorClass: 'text-error',
          badgeBg: 'bg-error/20',
          desc: 'Electronic City tech transit, St. John\'s Hospital ambulance lifelines, and inter-state logistics converge into static gridlock.',
          vuln: '9.9',
          metric: 'Systemic Stalemate',
          metricLabel: 'Citywide Choke',
          ripple: 'Zones 5, 6 & 8',
          location: 'South-East Bengaluru Highway Mesh'
        }
      },
      severInterventions: [
        {
          id: 'SEVER-A',
          name: 'Deploy 50-Tonne Hydraulic Crane & Heavy Winch Rig #CRN-01',
          agency: 'Bengaluru Traffic Police & BBMP Disaster Cell',
          action: 'Lifts disabled multi-axle truck cab onto low-bed recovery flatbed in under 20 minutes.',
          consequencePrevented: 'Reopens all three flyover lanes, clearing the 9,500-vehicle backlog 2.5 hours faster.',
          efficiency: '95% Obstacle Clearance',
          targetNodeIds: ['node-sec-power', 'node-sec-transit']
        },
        {
          id: 'SEVER-B',
          name: 'BTP Green Motorcycle Pilot Escort & Upstream VMS Rerouting',
          agency: 'BTP Traffic Enforcement & ITMS Control',
          action: 'Motorcycle pilots carve an emergency shoulder lane along Hosur Road for St. John\'s ambulances, while digital signs divert traffic at Kudlu Gate.',
          consequencePrevented: 'Saves critical patients by eliminating ambulance delays and reduces incoming volume by 45%.',
          efficiency: '90% Ambulance Bypass',
          targetNodeIds: ['node-sec-health', 'node-mult-commute']
        }
      ]
    };
  }

  // 5. DYNAMIC GENERATOR FOR ANY OTHER SCENARIO IN BENGALURU
  return {
    graphId: `NET-IMPACT-${sc.id.toUpperCase()}`,
    rootStressor: sc.headline.slice(0, 32),
    rootStressorDetail: loc,
    silosImpacted: '4 Sectors Bound',
    cascadeVelocity: '+15.2% / hr',
    citizensAtRisk: sc.affectedPopulation || '~25,000 Citizens',
    riskRadius: sc.zone,
    summary: `Cascading civic impact model for ${sc.name} at ${sc.locationName}, showing multi-silo propagation across traffic, utilities, and emergency services.`,
    nodes: {
      'node-nexus': {
        id: `ENV-TRIGGER-${sc.id.toUpperCase()}`,
        stage: 1,
        stageLabel: 'Stage 01: Shock Nexus',
        title: sc.name.split(' (')[0],
        sector: `${sc.category.toUpperCase()} / MUNICIPAL DISPATCH`,
        colorClass: 'text-error',
        badgeBg: 'bg-error/15',
        desc: sc.whatHappened,
        vuln: '9.5',
        metric: sc.consequences.traffic.delay || 'Active Stressor',
        metricLabel: 'Incident Metric',
        ripple: '4 Primary Sectors',
        location: sc.locationName
      },
      'node-sec-power': {
        id: `NODE-SEC-POWER-${sc.id.toUpperCase()}`,
        stage: 2,
        stageLabel: 'Stage 02: Primary Stress',
        title: sc.consequences.powerWater.title,
        sector: 'UTILITIES & INFRASTRUCTURE',
        colorClass: 'text-primary',
        badgeBg: 'bg-primary/15',
        desc: sc.consequences.powerWater.description,
        vuln: '8.3',
        metric: sc.consequences.powerWater.homesAffected || 'Utility Safeguard',
        metricLabel: 'Utility Telemetry',
        ripple: 'Local Utility Feeders',
        location: sc.locationName,
        upstreamFrom: 'node-nexus'
      },
      'node-sec-transit': {
        id: `NODE-SEC-TRANSIT-${sc.id.toUpperCase()}`,
        stage: 2,
        stageLabel: 'Stage 02: Primary Stress',
        title: sc.consequences.traffic.title,
        sector: 'TRANSIT & MOBILITY (BTP)',
        colorClass: 'text-secondary',
        badgeBg: 'bg-secondary/15',
        desc: sc.consequences.traffic.description,
        vuln: '8.8',
        metric: sc.consequences.traffic.delay,
        metricLabel: 'Corridor Delay',
        ripple: 'Adjacent Corridors',
        location: sc.consequences.traffic.detour || sc.locationName,
        upstreamFrom: 'node-nexus'
      },
      'node-sec-health': {
        id: `NODE-SEC-HEALTH-${sc.id.toUpperCase()}`,
        stage: 2,
        stageLabel: 'Stage 02: Primary Stress',
        title: sc.consequences.healthEmergency.title,
        sector: 'EMERGENCY MEDICAL & SAFETY (108)',
        colorClass: 'text-error',
        badgeBg: 'bg-error/15',
        desc: sc.consequences.healthEmergency.description,
        vuln: '8.6',
        metric: sc.consequences.healthEmergency.ambulanceStatus || 'Medical Readiness',
        metricLabel: 'ER Readiness',
        ripple: sc.consequences.healthEmergency.hospitalName,
        location: sc.consequences.healthEmergency.hospitalName,
        upstreamFrom: 'node-nexus'
      },
      'node-mult-commute': {
        id: `NODE-MULT-COMMUTE-${sc.id.toUpperCase()}`,
        stage: 3,
        stageLabel: 'Stage 03: Cross Multiplier',
        title: sc.consequences.publicCommute.title,
        sector: 'TRANSIT + CITIZEN LIFE',
        colorClass: 'text-secondary',
        badgeBg: 'bg-secondary/15',
        desc: sc.consequences.publicCommute.description,
        vuln: '7.7',
        metric: sc.consequences.publicCommute.busStatus || 'Transit Adjusted',
        metricLabel: 'Transit Flow',
        ripple: 'Public Routes',
        location: sc.locationName,
        upstreamFrom: 'node-sec-transit'
      },
      'node-mult-health-power': {
        id: `NODE-MULT-FACILITIES-${sc.id.toUpperCase()}`,
        stage: 3,
        stageLabel: 'Stage 03: Cross Multiplier',
        title: 'Essential Services Backup & Safety Protocols Active',
        sector: 'HEALTH + INFRASTRUCTURE',
        colorClass: 'text-primary',
        badgeBg: 'bg-primary/15',
        desc: `Municipal services around ${loc} shifted to synchronized continuity protocols to safeguard public life-support and traffic signals.`,
        vuln: '7.9',
        metric: 'Continuity Active',
        metricLabel: 'System Status',
        ripple: 'Ward Services',
        location: sc.zone,
        upstreamFrom: 'node-sec-power'
      },
      'node-mult-water': {
        id: `NODE-MULT-COMMERCE-${sc.id.toUpperCase()}`,
        stage: 3,
        stageLabel: 'Stage 03: Cross Multiplier',
        title: 'Commercial & Residential Perimeter Caution Zone',
        sector: 'COMMERCE + SAFETY',
        colorClass: 'text-tertiary',
        badgeBg: 'bg-tertiary/15',
        desc: `Local establishments guided through precautionary protocols to prevent crowd panic and keep access lanes unobstructed.`,
        vuln: '7.3',
        metric: 'Perimeter Protected',
        metricLabel: 'Local Ward',
        ripple: 'Surrounding Streets',
        location: sc.locationName,
        upstreamFrom: 'node-sec-health'
      },
      'node-bottleneck': {
        id: `BOTTLENECK-${sc.id.toUpperCase()}`,
        stage: 4,
        stageLabel: 'Stage 04: Systemic Bottleneck',
        title: `Ward-Level Uncoordinated Cascade Vulnerability`,
        sector: 'SYSTEMIC MULTI-SILO RISK',
        colorClass: 'text-error',
        badgeBg: 'bg-error/20',
        desc: `Without coordinated City OS response, sequential agency delays inflate resolution time to ${sc.comparison.timeToClearOld} with ${sc.comparison.economicLossOld} in damages.`,
        vuln: '9.4',
        metric: 'High Cascade Risk',
        metricLabel: 'Uncoordinated Risk',
        ripple: 'Metropolitan Grid',
        location: sc.zone
      }
    },
    severInterventions: [
      {
        id: 'SEVER-A',
        name: sc.cityActions[0] ? `${sc.cityActions[0].dept}: ${sc.cityActions[0].action.slice(0, 50)}...` : 'Automated Inter-Agency Telemetry Synchronization',
        agency: sc.cityActions[0]?.dept || 'BBMP Unified Command',
        action: sc.cityActions[0]?.action || 'Coordinates field teams in real time.',
        consequencePrevented: `Reduces time to clear from ${sc.comparison.timeToClearOld} to ${sc.comparison.timeToClearNew}.`,
        efficiency: '92% Coordinated Impact',
        targetNodeIds: ['node-sec-power', 'node-sec-transit']
      },
      {
        id: 'SEVER-B',
        name: sc.cityActions[1] ? `${sc.cityActions[1].dept}: ${sc.cityActions[1].action.slice(0, 50)}...` : 'BTP Dynamic Bypass & Green Corridor Deployment',
        agency: sc.cityActions[1]?.dept || 'Bengaluru Traffic Police',
        action: sc.cityActions[1]?.action || 'Establishes clear alternate route and bypass.',
        consequencePrevented: `Minimizes transit delay from ${sc.comparison.trafficDelayOld} to ${sc.comparison.trafficDelayNew}.`,
        efficiency: '89% Route Recovery',
        targetNodeIds: ['node-sec-health', 'node-mult-commute']
      }
    ]
  };
}

/**
 * Returns an executive Coordinated Action Plan (CAP) tailored specifically to ANY scenario.
 */
export function getScenarioResponsePlan(sc: ScenarioTemplate): ScenarioResponsePlanData {
  const loc = sc.locationName.split(' &')[0].split(' (')[0];
  const cat = sc.category.toLowerCase();
  const planId = `CAP-2024-${sc.id.toUpperCase()}-BLR`;

  // 1. HEBBAL FLOOD PLAN
  if (sc.id === 'hebbal-flood' || loc.toLowerCase().includes('hebbal') || (cat === 'flood' && loc.toLowerCase().includes('hebbal'))) {
    return {
      planId,
      title: 'Hebbal Flyover & Airport Expressway Storm Inundation Mitigation Plan',
      incidentName: sc.name,
      location: sc.locationName,
      protocolClass: 'CROSS-SECTORAL CONCURRENT RAPID DRAINAGE',
      severityLevel: 'LEVEL 3 - CRITICAL ARTERIAL IMPACT',
      aiConfidence: '96.2%',
      summary: 'Cross-agency response linking BBMP Stormwater, Bengaluru Traffic Police (BTP), BESCOM Power Ops, and Baptist Hospital to reopen airport transit and restore emergency ambulance access.',
      targetResolutionWindow: '35 minutes to clear primary highway lanes',
      projectedDeltas: {
        cascadeReduction: '-74%',
        cascadeReductionLabel: 'Submersion Spillover',
        timeSaved: '2 hrs 25 min',
        timeSavedLabel: 'Faster Clearance vs Old Silos',
        economicSaved: sc.budget.disruptionLossPrevented || '₹42 Lakhs',
        economicSavedLabel: 'Public Delays Prevented'
      },
      resourceConflict: {
        resourceName: 'BBMP High-Capacity 500HP Dewatering Pump Unit #PUMP-04',
        resourceType: 'High-Volume Dewatering Pump (15,000 LPM)',
        agencyA: 'BBMP Stormwater Engineering',
        needA: 'Requisitioned for clearing the sunken underpass near Esteem Mall to reopen 2 lanes for general airport traffic.',
        agencyB: 'Baptist Hospital & Emergency Medical Services (108)',
        needB: 'Requisitioned to drain the submerged ambulance triage entrance on Bellary Road to allow incoming ICU cardiac transfers.',
        aiArbitrationProposal: 'Assign Pump #04 immediately to Baptist Hospital ER entrance to establish a dry ambulance ramp in 12 minutes; reroute KSFES Dewatering Engine #PUMP-02 from Sahakar Nagar to Hebbal underpass sump.',
        arbitrationFeasibility: '98% (Saves lives first, secondary pump maintains highway clearance within 16 mins)',
        rationale: 'Protecting human casualty intake at Baptist Hospital takes absolute operational priority over passenger flight delays. Secondary KSFES pump is already positioned 1.8 km away.',
        status: 'PENDING'
      },
      directives: [
        {
          stepNumber: 1,
          priority: 'CRITICAL',
          priorityColor: 'text-error bg-error/15 border-error/30',
          agencies: 'BBMP STORMWATER & KSFES RESCUE',
          leadOfficial: 'Chief Engr. S. Murthy (BBMP Stormwater)',
          title: 'Deploy 6 High-Power Dewatering Pumps into Hebbal Lake Canal & Evacuate Stranded Drivers',
          explanation: 'Discharge standing flood runoff from sunken flyover ramp directly into lake overflow channel; deploy 2 inflatable rescue dinghies to assist motorists stalled in deep water.',
          resourcesCommitted: '6 Heavy Dewatering Pumps (90,000 LPM total), 2 KSFES Rubber Boats, 18 Personnel',
          executionWindow: 'T-minus 15 mins (Continuous Pumping)',
          telemetryHook: 'Telemetry: Hebbal Underpass Water Depth Sensor #BLR-WD-04',
          approved: true,
          approvedBy: 'DIRECTOR VANCE'
        },
        {
          stepNumber: 2,
          priority: 'HIGH',
          priorityColor: 'text-secondary bg-secondary/15 border-secondary/30',
          agencies: 'BENGALURU TRAFFIC POLICE (BTP)',
          leadOfficial: 'DCP Traffic North (BTP)',
          title: 'Activate Hennur-Thanisandra Airport Green Bypass & Baptist Hospital Rear Gate Clearway',
          explanation: 'Switch traffic signals at Mekhri Circle to divert all airport taxis via Hennur ORR and Bagalur; open dedicated Sanjaynagar service lane exclusively for 108 Baptist ambulances.',
          resourcesCommitted: '18 Traffic Marshals, 4 Dynamic LED Signboards, 3 Motorcycle Pilots',
          executionWindow: 'Immediate Dispatch (Operational)',
          telemetryHook: 'ITMS Corridor Telemetry: Thanisandra Main Road Headway',
          approved: false
        },
        {
          stepNumber: 3,
          priority: 'ELEVATED',
          priorityColor: 'text-primary bg-primary/15 border-primary/30',
          agencies: 'BESCOM POWER OPS & BWSSB',
          leadOfficial: 'Superintending Engr. K. Gowda (BESCOM)',
          title: 'Safely Isolate Submerged Feeder Lines & Restore Sahakar Nagar Residential Power Loop',
          explanation: 'De-energize waterlogged street furniture conduits to prevent electrocution hazards; reroute Sahakar Nagar residential feeders from the alternate Yelahanka 66kV substation loop.',
          resourcesCommitted: '2 BESCOM Rapid Lineman Squads, 1 Mobile High-Voltage Insulation Rig',
          executionWindow: 'T-minus 22 mins',
          telemetryHook: 'Grid Relay: Feeder Loop #HEB-11KV-08',
          approved: false
        },
        {
          stepNumber: 4,
          priority: 'URGENT',
          priorityColor: 'text-tertiary bg-tertiary/15 border-tertiary/30',
          agencies: 'BMTC TRANSIT & BBMP WAR ROOM',
          leadOfficial: 'Director Public Relations & BMTC Operations',
          title: 'Broadcast Airport Advisory & Deploy 15 BMTC Feeder Shuttles from Nagawara Metro',
          explanation: 'Send emergency push notifications advising airport passengers to allow 90 extra minutes via Thanisandra; launch electric feeder buses to pick up stranded Manyata commuters.',
          resourcesCommitted: '15 Low-Floor AC Electric Buses, Citywide Citizen Alert Push',
          executionWindow: 'T-minus 10 mins',
          telemetryHook: 'BMTC Fleet GPS Telemetry: Vayu Vajra Route 8 & 9',
          approved: true,
          approvedBy: 'COMMISSIONER WAR ROOM'
        }
      ]
    };
  }

  // 2. CUBBON PARK MISSING CHILD PLAN
  if (sc.id === 'cubbon-park-search' || loc.toLowerCase().includes('cubbon') || cat === 'search') {
    return {
      planId,
      title: 'Cubbon Park Protocol Amber: Missing Child Perimeter Cordon & SAR Plan',
      incidentName: sc.name,
      location: sc.locationName,
      protocolClass: 'GOLDEN-HOUR MULTI-AGENCY SEARCH & RESCUE',
      severityLevel: 'LEVEL 1 - URGENT HUMAN LIFE SAFETY',
      aiConfidence: '98.4%',
      summary: 'Rapid inter-agency search linking Bengaluru City Police, BBMP Horticulture, Namma Metro Security, and 108 Emergency Medical Services to secure the park perimeter and recover the child.',
      targetResolutionWindow: '38 minutes (Golden Hour Recovery)',
      projectedDeltas: {
        cascadeReduction: '-88%',
        cascadeReductionLabel: 'Search Area Expansion',
        timeSaved: '3 hrs 52 min',
        timeSavedLabel: 'Faster Resolution vs Uncoordinated Search',
        economicSaved: sc.budget.disruptionLossPrevented || '₹1.8 Lakhs',
        economicSavedLabel: 'Trauma & Chaos Prevented'
      },
      resourceConflict: {
        resourceName: 'High-Altitude Thermal Imaging Hexacopter Drone #DRN-HEX-02',
        resourceType: 'FLIR Thermal Imaging Surveillance Drone',
        agencyA: 'Bengaluru City Police Central SAR Squad',
        needA: 'Requisitioned for penetrating dense bamboo grove canopy near Bal Bhavan playground.',
        agencyB: 'BTP Traffic & Perimeter Enforcement',
        needB: 'Requisitioned to monitor the Queen\'s Road and Kasturba Road park boundary fence for potential pedestrian breaches.',
        aiArbitrationProposal: 'Assign Thermal Drone #DRN-HEX-02 directly to the inner bamboo grove canopy (critical high-probability search zone); deploy Police K9 Bloodhound Unit #K9-ALPHA and 4 motorcycle marshals to patrol the perimeter boundary.',
        arbitrationFeasibility: '96% (Maximizes infrared scanning in dense foliage where ground vision is blocked)',
        rationale: 'Thermal drone is uniquely capable of piercing tree canopy where ground officers cannot see. Perimeter fence is already bordered by streetlights and easily patrolled by motorcycle marshals.',
        status: 'PENDING'
      },
      directives: [
        {
          stepNumber: 1,
          priority: 'CRITICAL',
          priorityColor: 'text-error bg-error/15 border-error/30',
          agencies: 'BENGALURU CITY POLICE (CUBBON PARK PS) & CAR K9',
          leadOfficial: 'Inspector R. Manjunath (Cubbon Park PS)',
          title: 'Establish 14 Ground Search Grids & Launch K9 Scent Tracking from Bal Bhavan',
          explanation: 'Cordon Sector A into numbered search grids; deploy certified K9 tracking bloodhound using child\'s clothing scent from toy train area outwards towards lake edge.',
          resourcesCommitted: '14 Police Search Squads, 1 K9 Canine Unit, 3 Thermal Drone Pilots',
          executionWindow: 'Immediate (Active Search)',
          telemetryHook: 'Police Bodycam & Live Drone Infrared Video Stream',
          approved: true,
          approvedBy: 'DCP CENTRAL'
        },
        {
          stepNumber: 2,
          priority: 'HIGH',
          priorityColor: 'text-secondary bg-secondary/15 border-secondary/30',
          agencies: 'BBMP HORTICULTURE & BMRCL NAMMA METRO',
          leadOfficial: 'Deputy Director Horticulture & BMRCL Security Chief',
          title: 'Seal Vehicle Egress across All 7 Park Gates & Activate Metro Turnstile Screening',
          explanation: 'Close boom barriers across all 7 gates; gate staff verify all departing adults accompanied by children. Metro security at Cubbon Park & Vidhana Soudha stations verify boarding passengers.',
          resourcesCommitted: '14 Park Gate Marshals, 6 Metro Turnstile Security Officers',
          executionWindow: 'T-minus 8 mins (Gates Locked Down)',
          telemetryHook: 'BMRCL Automated Fare Collection (AFC) Turnstile Telemetry',
          approved: true,
          approvedBy: 'DIRECTOR VANCE'
        },
        {
          stepNumber: 3,
          priority: 'ELEVATED',
          priorityColor: 'text-primary bg-primary/15 border-primary/30',
          agencies: 'BESCOM & BBMP WELFARE CELL',
          leadOfficial: 'Divisional Engr. BESCOM Central Core',
          title: 'Energize Park High-Mast LED Floodlights & Broadcast Tri-Lingual PA Audio',
          explanation: 'Switch on full park illumination early to remove shadowed areas; broadcast continuous clear physical description of child in Kannada, English, and Hindi across walking trails.',
          resourcesCommitted: '100% High-Mast LED Array, 12 Audio PA Stations',
          executionWindow: 'T-minus 12 mins',
          telemetryHook: 'BESCOM Central Lighting Loop #CUBBON-LED-01',
          approved: false
        },
        {
          stepNumber: 4,
          priority: 'URGENT',
          priorityColor: 'text-tertiary bg-tertiary/15 border-tertiary/30',
          agencies: 'DHS GVK-EMRI 108 EMERGENCY MEDICAL SERVICES',
          leadOfficial: 'Dr. L. Shweta (Head Paramedic 108 EMRI)',
          title: 'Stage Advanced Pediatric Ambulance & Hydration First Aid at Gate 1',
          explanation: 'Paramedic van staged with pediatric warming, glucose hydration, and first aid supplies ready for immediate physical evaluation the instant child is located.',
          resourcesCommitted: '1 Advanced Pediatric Ambulance, 2 Pediatric Paramedics',
          executionWindow: 'On Site (Hudson Circle Staging)',
          telemetryHook: '108 Paramedic Vitals Unit #EMS-PED-01',
          approved: true,
          approvedBy: 'CHIEF MEDICAL OFFICER'
        }
      ]
    };
  }

  // 3. COMMERCIAL STREET FIRE PLAN
  if (sc.id === 'commercial-street-fire' || loc.toLowerCase().includes('commercial') || cat === 'fire') {
    return {
      planId,
      title: 'Commercial Street High-Density Textile Fire Suppression & Cordon Plan',
      incidentName: sc.name,
      location: sc.locationName,
      protocolClass: 'MULTI-STATION STRUCTURAL CONFLAGRATION SUPPRESSION',
      severityLevel: 'LEVEL 2 - STRUCTURAL FIRE RISK',
      aiConfidence: '95.8%',
      summary: 'Integrated response coordinating KSFES Fire Services, BESCOM Grid Isolation, BTP Traffic Control, and Bowring Hospital to suppress textile blaze and protect historic commercial assets.',
      targetResolutionWindow: '45 minutes to knock down active fire',
      projectedDeltas: {
        cascadeReduction: '-82%',
        cascadeReductionLabel: 'Adjoining Shop Fire Spread',
        timeSaved: '2 hrs 10 min',
        timeSavedLabel: 'Faster Containment vs Old Systems',
        economicSaved: sc.budget.disruptionLossPrevented || '₹32 Lakhs',
        economicSavedLabel: 'Inventory & Structure Loss Avoided'
      },
      resourceConflict: {
        resourceName: 'BWSSB High-Pressure Water Bowser #WB-03 (12,000 Liters)',
        resourceType: 'Dedicated High-Volume Water Supply Tanker',
        agencyA: 'KSFES Fire Ground Command (Frontline Tender)',
        needA: 'Requisitioned to refill frontline mini-tender spraying water on active textile blaze in narrow Ibrahim Sahib Street.',
        agencyB: 'KSFES Defensive Exposure Crew',
        needB: 'Requisitioned to lay a continuous cooling water curtain against adjacent shop #16 to prevent structural fire leap.',
        aiArbitrationProposal: 'Connect Bowser #WB-03 to frontline attack line through 150m hose relay from Kamaraj Road; connect secondary municipal fire hydrant #HYD-04 (boosted to 8.5 bar by BWSSB) to feed defensive cooling spray.',
        arbitrationFeasibility: '97% (Suppresses blaze while maintaining complete defensive barrier)',
        rationale: 'BWSSB can instantly increase municipal hydrant pressure to 8.5 bar via Tasker Town booster station, freeing the mobile bowser for the high-pressure attack tender.',
        status: 'PENDING'
      },
      directives: [
        {
          stepNumber: 1,
          priority: 'CRITICAL',
          priorityColor: 'text-error bg-error/15 border-error/30',
          agencies: 'KSFES FIRE & RESCUE SERVICES',
          leadOfficial: 'Divisional Fire Officer M. Suresh (KSFES)',
          title: 'Deploy High-Expansion Foam Attack & Establish 150m Hose Relay through Narrow Alleys',
          explanation: 'Advance rapid mini tenders into Ibrahim Sahib Street; lay 150-meter heavy hose from Kamaraj Road hydrant to blanket synthetic fabrics with high-expansion fire suppressant foam.',
          resourcesCommitted: '6 Fire Tenders, 2 Foam Units, 1 Turn-Table Ladder, 28 Firefighters',
          executionWindow: 'Immediate (Active Attack)',
          telemetryHook: 'KSFES Ground Pressure Telemetry: 9.2 Bar Delivery',
          approved: true,
          approvedBy: 'DIRECTOR VANCE'
        },
        {
          stepNumber: 2,
          priority: 'HIGH',
          priorityColor: 'text-primary bg-primary/15 border-primary/30',
          agencies: 'BESCOM POWER DISTRIBUTION & BWSSB',
          leadOfficial: 'Executive Engr. BESCOM Shivajinagar',
          title: 'Isolate 11kV Feeder Block & Boost Municipal Hydrant Pressure to 8.5 Bar',
          explanation: 'De-energize overhead commercial lines supplying 84 shops to protect firefighters from electrical shock; BWSSB activates Tasker Town booster pumps to ensure maximum water delivery.',
          resourcesCommitted: 'BESCOM Feeder Squad, BWSSB Tasker Town Pumping Station Team',
          executionWindow: 'T-minus 10 mins',
          telemetryHook: 'BWSSB Water Main Sensor #HYD-TASKER-02',
          approved: false
        },
        {
          stepNumber: 3,
          priority: 'ELEVATED',
          priorityColor: 'text-secondary bg-secondary/15 border-secondary/30',
          agencies: 'BENGALURU TRAFFIC POLICE (BTP)',
          leadOfficial: 'ACP Traffic East Division (BTP)',
          title: 'Seal Dispensary Road & Kamaraj Road to Form Dedicated Emergency Water Corridor',
          explanation: 'Block civilian vehicular access into Commercial Street core; maintain uninterrupted clearway along Kamaraj Road to Bowring Hospital and water refill points.',
          resourcesCommitted: '12 Traffic Marshals, Tow Cruiser, Variable Message Signs',
          executionWindow: 'Operational Cordon',
          telemetryHook: 'ITMS Kamaraj Road Travel Time Index',
          approved: false
        },
        {
          stepNumber: 4,
          priority: 'URGENT',
          priorityColor: 'text-tertiary bg-tertiary/15 border-tertiary/30',
          agencies: 'BBMP HEALTH CELL & BOWRING HOSPITAL ER',
          leadOfficial: 'Medical Superintendent (Bowring Hospital)',
          title: 'Activate Smoke Inhalation Triage Ward & Evacuate 150m Merchant Perimeter',
          explanation: 'Evacuate shoppers and shop assistants within 150 meters to prevent toxic smoke inhalation; stage 2 advanced ambulances at Central Street exit.',
          resourcesCommitted: '2 ALS Ambulances, 18 Hospital ER Trauma Beds, Police Marshals',
          executionWindow: 'T-minus 15 mins',
          telemetryHook: 'Bowring Hospital ER Trauma Bed Occupancy',
          approved: true,
          approvedBy: 'COMMISSIONER WAR ROOM'
        }
      ]
    };
  }

  // 4. SILK BOARD JUNCTION PLAN
  if (sc.id === 'silk-board-gridlock' || loc.toLowerCase().includes('silk board') || cat === 'traffic') {
    return {
      planId,
      title: 'Silk Board Multi-Axle Breakdown & Arterial Recovery Action Plan',
      incidentName: sc.name,
      location: sc.locationName,
      protocolClass: 'MEGA-CORRIDOR MULTI-AGENCY GRIDLOCK UNBLOCKING',
      severityLevel: 'LEVEL 3 - CRITICAL TRANSIT BOTTLENECK',
      aiConfidence: '97.1%',
      summary: 'Rapid tactical unblocking coordinating BTP Traffic Police, BBMP Disaster Winch Teams, BMTC Feeder Operations, and St. John\'s Hospital EMS green corridors.',
      targetResolutionWindow: '28 minutes to clear disabled truck and restore 3 lanes',
      projectedDeltas: {
        cascadeReduction: '-78%',
        cascadeReductionLabel: 'Outer Ring Road Spillover',
        timeSaved: '2 hrs 40 min',
        timeSavedLabel: 'Faster Gridlock Dissipation',
        economicSaved: sc.budget.disruptionLossPrevented || '₹58 Lakhs',
        economicSavedLabel: 'Commuter Fuel & Productive Hours Saved'
      },
      resourceConflict: {
        resourceName: 'Heavy Hydraulic 50-Tonne Recovery Crane Unit #CRN-01',
        resourceType: '50-Tonne Industrial Hydraulic Recovery Crane',
        agencyA: 'BTP Traffic Recovery Operations (Silk Board Flyover)',
        needA: 'Requisitioned to lift disabled multi-axle freight truck whose broken rear axle has jammed both lanes on the flyover ramp.',
        agencyB: 'BMTC Central Operations (Bommanahalli Ramp)',
        needB: 'Requested to pull a broken-down BMTC low-floor bus that stalled while attempting to maneuver around the tailback queue.',
        aiArbitrationProposal: 'Dispatch 50-Tonne Crane #CRN-01 directly to the Silk Board flyover truck (root bottleneck holding 9,500 vehicles); deploy auxiliary 20-tonne commercial winch truck #CRN-02 to tow the BMTC bus to the shoulder at Bommanahalli.',
        arbitrationFeasibility: '99% (Clears root systemic blockage while resolving secondary bus stall simultaneously)',
        rationale: 'The truck on the flyover ramp is the root causal node causing the entire 5.8 km tailback. 20-Tonne auxiliary winch is completely adequate for the BMTC bus.',
        status: 'PENDING'
      },
      directives: [
        {
          stepNumber: 1,
          priority: 'CRITICAL',
          priorityColor: 'text-error bg-error/15 border-error/30',
          agencies: 'BTP TRAFFIC RECOVERY & BBMP INFRASTRUCTURE',
          leadOfficial: 'Traffic ACP South-East Division (BTP)',
          title: 'Deploy 50-Tonne Hydraulic Crane #CRN-01 to Winch Disabled Truck onto Low-Bed Trailer',
          explanation: 'Hook crane rigging to disabled truck chassis; lift axle clear of road surface and winch onto heavy flatbed recovery trailer to reopen flyover lanes within 20 minutes.',
          resourcesCommitted: '50-Tonne Hydraulic Crane, Low-Bed Recovery Trailer, 8 Mechanical Technicians',
          executionWindow: 'Immediate (Active Recovery)',
          telemetryHook: 'BTP Traffic Camera #CAM-SILK-02 Flyover Live Stream',
          approved: true,
          approvedBy: 'DIRECTOR VANCE'
        },
        {
          stepNumber: 2,
          priority: 'HIGH',
          priorityColor: 'text-secondary bg-secondary/15 border-secondary/30',
          agencies: 'BTP MOTORCYCLE PILOT SQUAD & 108 EMS',
          leadOfficial: 'Head Constable N. Raju (BTP Green Pilot)',
          title: 'Carve Dedicated Life-Support Green Corridor on Hosur Road for St. John\'s Ambulances',
          explanation: 'Four motorcycle pilots with sirens clear an emergency path along the right shoulder of Hosur Road, guiding 108 ambulances directly into St. John\'s Hospital triage without delays.',
          resourcesCommitted: '4 High-Speed Police Pilot Motorcycles, 2 Patrol Interceptors',
          executionWindow: 'Continuous Green Pilot Escort',
          telemetryHook: '108 Paramedic GPS Route Telemetry to St. John\'s ER',
          approved: true,
          approvedBy: 'DCP TRAFFIC'
        },
        {
          stepNumber: 3,
          priority: 'ELEVATED',
          priorityColor: 'text-primary bg-primary/15 border-primary/30',
          agencies: 'BTP INTELLIGENT TRAFFIC CONTROL & ITMS',
          leadOfficial: 'ITMS Operations Commander (BTP)',
          title: 'Activate Dynamic Variable Signs at Kudlu Gate & Reroute Traffic via Haralur Road',
          explanation: 'Update digital LED matrix signs at Electronic City exit and Kudlu Gate advising drivers to divert via Haralur Road to Sarjapur and Bannerghatta Road, reducing incoming volume by 45%.',
          resourcesCommitted: '6 Variable LED Signboards, BTP Traffic Radio Broadcasts',
          executionWindow: 'T-minus 5 mins (Active Messaging)',
          telemetryHook: 'ITMS Electronic City Expressway Traffic Volume Counter',
          approved: false
        },
        {
          stepNumber: 4,
          priority: 'URGENT',
          priorityColor: 'text-tertiary bg-tertiary/15 border-tertiary/30',
          agencies: 'BMTC SOUTH ZONE OPERATIONS',
          leadOfficial: 'Chief Traffic Manager (BMTC)',
          title: 'Launch 12 Vajra AC Feeder Shuttles Originating Past Silk Board Bottleneck at HSR',
          explanation: 'Ferry stranded tech employees from HSR Layout BDA Complex along the Outer Ring Road to Bellandur and Marathahalli IT parks, bypassing the jammed junction entirely.',
          resourcesCommitted: '12 Vajra AC Buses, 6-minute Headway Service Wave',
          executionWindow: 'T-minus 12 mins',
          telemetryHook: 'BMTC Smart Card & GPS Passenger Ingress Telemetry',
          approved: false
        }
      ]
    };
  }

  // 5. DYNAMIC GENERATOR FOR ANY OTHER SCENARIO
  const conflictResourceName = sc.dispatchedAssets?.[0]?.name || 'Municipal Rapid Interceptor Unit #AST-01';
  const conflictSecondaryName = sc.dispatchedAssets?.[1]?.name || 'Secondary Auxiliary Support Rig #AST-02';

  return {
    planId,
    title: `Coordinated Incident Response & Multi-Agency Action Plan: ${sc.name.split(' (')[0]}`,
    incidentName: sc.name,
    location: sc.locationName,
    protocolClass: 'UNIFIED MUNICIPAL COORDINATED INCIDENT PROTOCOL',
    severityLevel: 'LEVEL 2 - COORDINATED OPERATIONAL RESPONSE',
    aiConfidence: '95.4%',
    summary: `Synthesized cross-department mitigation plan linking BBMP, Bengaluru Traffic Police, BESCOM, and emergency healthcare providers to contain ${sc.name} at ${sc.locationName} and prevent systemic cascading delays.`,
    targetResolutionWindow: `${sc.comparison.timeToClearNew} (Target Resolution)`,
    projectedDeltas: {
      cascadeReduction: '-72%',
      cascadeReductionLabel: 'Cross-Sector Vulnerability',
      timeSaved: `${sc.comparison.timeToClearNew} vs ${sc.comparison.timeToClearOld}`,
      timeSavedLabel: 'Faster Incident Clearance',
      economicSaved: sc.budget.disruptionLossPrevented,
      economicSavedLabel: 'Public Delays & Damage Avoided'
    },
    resourceConflict: {
      resourceName: conflictResourceName,
      resourceType: 'Primary Field Operational Unit',
      agencyA: sc.cityActions[0]?.dept || 'Primary Municipal Response Agency',
      needA: `Requisitioned for immediate containment at ground zero near ${sc.locationName}.`,
      agencyB: sc.cityActions[1]?.dept || 'Secondary Transit / Safety Agency',
      needB: `Requisitioned to safeguard the surrounding perimeter and clear bypass traffic.`,
      aiArbitrationProposal: `Assign ${conflictResourceName} to ground zero containment for rapid stabilization; redeploy ${conflictSecondaryName} to maintain perimeter bypass and traffic smoothing.`,
      arbitrationFeasibility: '96% (Optimal multi-silo resource balance)',
      rationale: `Ground-zero containment arrests the root stressor faster, reducing downstream requirements for the secondary agency by 68%.`,
      status: 'PENDING'
    },
    directives: [
      {
        stepNumber: 1,
        priority: 'CRITICAL',
        priorityColor: 'text-error bg-error/15 border-error/30',
        agencies: sc.cityActions[0]?.dept || 'BBMP UNIFIED FIELD COMMAND',
        leadOfficial: 'Field Response Commander (Incident Zone)',
        title: `Ground-Zero Stabilization & Containment at ${loc}`,
        explanation: sc.cityActions[0]?.action || sc.whatHappened,
        resourcesCommitted: `${sc.dispatchedAssets?.length || 6} Specialized Field Units Assigned`,
        executionWindow: 'Immediate Dispatch',
        telemetryHook: 'Telemetry: Ward Level Incident Sensor Mesh',
        approved: true,
        approvedBy: 'DIRECTOR VANCE'
      },
      {
        stepNumber: 2,
        priority: 'HIGH',
        priorityColor: 'text-secondary bg-secondary/15 border-secondary/30',
        agencies: 'BENGALURU TRAFFIC POLICE (BTP)',
        leadOfficial: 'Traffic ACP Division Commander (BTP)',
        title: `Arterial Rerouting & Traffic Bypass along ${sc.consequences.traffic.detour || sc.locationName}`,
        explanation: sc.consequences.traffic.description,
        resourcesCommitted: 'Traffic Marshals, Signal Priority & Route Bypass Active',
        executionWindow: 'T-minus 10 mins',
        telemetryHook: 'ITMS Smart Signal Adaptive Loop',
        approved: false
      },
      {
        stepNumber: 3,
        priority: 'ELEVATED',
        priorityColor: 'text-primary bg-primary/15 border-primary/30',
        agencies: 'UTILITY & ESSENTIAL SERVICES (BESCOM / BWSSB)',
        leadOfficial: 'Executive Engineer (Utility Operations)',
        title: `Protect Essential Grid Infrastructure & Life-Support Facilities`,
        explanation: sc.consequences.powerWater.description,
        resourcesCommitted: 'Utility Technicians & Continuous Grid Monitoring',
        executionWindow: 'T-minus 20 mins',
        telemetryHook: 'Substation Load & Pressure Telemetry',
        approved: false
      },
      {
        stepNumber: 4,
        priority: 'URGENT',
        priorityColor: 'text-tertiary bg-tertiary/15 border-tertiary/30',
        agencies: 'PUBLIC TRANSIT & CITIZEN ADVISORY (BMTC / WAR ROOM)',
        leadOfficial: 'BBMP War Room Duty Officer',
        title: `Citizen Safety Advisory Broadcast & Public Transit Route Smoothing`,
        explanation: `${sc.consequences.publicCommute.citizenTip} Transit advisory: ${sc.consequences.publicCommute.description}`,
        resourcesCommitted: 'Citizen Alert Notification Mesh & Transit Headway Adjustments',
        executionWindow: 'T-minus 15 mins',
        telemetryHook: 'Citizen Notification Mesh Gateway',
        approved: true,
        approvedBy: 'COMMISSIONER WAR ROOM'
      }
    ]
  };
}
