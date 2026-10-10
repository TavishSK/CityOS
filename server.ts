import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), city: 'Bengaluru' });
});

// AI Simulation endpoint for What-If Lab and Municipal Synthesizer
app.post('/api/simulate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Valid prompt is required' });
      return;
    }

    if (!ai) {
      res.status(503).json({ error: 'AI model client unavailable' });
      return;
    }

    const systemPrompt = `You are the chief civic engineering brain of "City OS Bengaluru", an integrated municipal emergency and telemetry system for Bangalore, India.
The user is testing a municipal "what-if" crisis or event in Bengaluru (e.g. "Cubbon Park: Missing Child", "Commercial Street: Fire", "Hebbal flooded", "Silk Board traffic", "Water pipeline burst in Indiranagar", "Garbage protest in Peenya", etc.).

YOUR TASK:
Analyze the user query and generate a 100% logically sound, highly correlated simulation response in JSON.
CRITICAL RULES:
1. STRICTLY RELEVANT: If the query is about a missing child in Cubbon Park, the sliders MUST be search area, police teams, gate lockdowns, drone cameras. The consequences MUST relate to park gates, illumination, pediatric emergency, and public transit alerts. NEVER mention floods or irrelevant concepts!
2. REALISTIC BENGALURU LOCATIONS & COORDS:
   - Identify the real Bengaluru location (e.g. Cubbon Park coords [12.9763, 77.5929], Commercial Street [12.9822, 77.6083], Hebbal [13.0358, 77.5970], Silk Board [12.9177, 77.6238], Whitefield [12.9698, 77.7500], Majestic [12.9767, 77.5713], Indiranagar [12.9784, 77.6408], Jayanagar [12.9308, 77.5838], etc.).
   - Coords MUST be within latitude 12.85-13.15, longitude 77.45-77.75.
3. BUDGETS MUST BE REALISTIC AND PROPORTIONAL (NEVER OFF THE CHARTS):
   - Localized incident (e.g. missing child, tree fall, minor pipe leak): Operational budget = ₹35,000 to ₹1.5 Lakhs. Avoided loss/damage = ₹80,000 to ₹3 Lakhs.
   - Medium incident (e.g. shop fire, commercial grid fault): Operational budget = ₹2.5 Lakhs to ₹8 Lakhs. Avoided damage = ₹15 Lakhs to ₹45 Lakhs.
   - Major citywide crisis (e.g. major flyover flood, arterial gridlock): Operational budget = ₹8 Lakhs to ₹25 Lakhs. Commuter delay losses prevented = ₹25 Lakhs to ₹60 Lakhs.
   - NEVER quote dozens of Crores or billions for standard civic events! Explain the budget clearly with concrete civic line items.
4. Return ONLY valid JSON matching this exact structure:
{
  "id": "slug-id",
  "name": "Short Descriptive Scenario Title",
  "category": "flood" | "fire" | "traffic" | "power" | "search" | "water" | "medical" | "metro" | "general",
  "emoji": "emoji icon",
  "badge": "SHORT STATUS BADGE (e.g. HIGH PRIORITY SEARCH, ALARM LEVEL 2, WATERLOGGING ALERT)",
  "badgeColor": "Tailwind color class (e.g. bg-amber-500/20 text-amber-400 border-amber-500/40 or red/cyan/emerald)",
  "headline": "Clear 1-sentence headline of what is occurring",
  "locationName": "Specific landmark & neighborhood (e.g. Cubbon Park & Kasturba Road Core)",
  "zone": "BBMP Ward & Zone Name (e.g. Zone 04: Central Core / BBMP Ward 111)",
  "coords": [latitude, longitude],
  "affectedPopulation": "~X,XXX citizens / commuters / shoppers",
  "detourLabel": "Specific alternate road bypass recommendation in Bangalore",
  "whatHappened": "Plain-English 2-sentence description of the crisis or event.",
  "sliders": [
    {
      "label": "Lever Name (contextual to event)",
      "key": "p1",
      "min": number,
      "max": number,
      "step": number,
      "defaultVal": number,
      "unit": "Unit (e.g. Teams, Acres, Shops, PSI, mm/hr, Feet, etc.)",
      "minLabel": "Minimum explanation",
      "maxLabel": "Maximum explanation"
    },
    { "label": "Lever 2", "key": "p2", "min": 0, "max": 100, "step": 5, "defaultVal": 50, "unit": "Unit", "minLabel": "Min", "maxLabel": "Max" },
    { "label": "Lever 3", "key": "p3", "min": 0, "max": 100, "step": 5, "defaultVal": 50, "unit": "Unit", "minLabel": "Min", "maxLabel": "Max" },
    { "label": "Lever 4", "key": "p4", "min": 0, "max": 100, "step": 5, "defaultVal": 50, "unit": "Unit", "minLabel": "Min", "maxLabel": "Max" }
  ],
  "consequences": {
    "traffic": {
      "title": "Specific Traffic Impact Title",
      "description": "Specific Bangalore streets affected and why.",
      "delay": "+X minutes delay",
      "detour": "Actual alternate road route"
    },
    "powerWater": {
      "title": "Utility / Infrastructure Status",
      "description": "How power, water, or lighting is managed for this incident.",
      "homesAffected": "Direct utility status",
      "waterStatus": "Water or power status"
    },
    "healthEmergency": {
      "title": "Emergency & Medical Readiness",
      "description": "Ambulance and medical protocol.",
      "hospitalName": "Actual nearby Bangalore hospital name",
      "ambulanceStatus": "Green corridor or emergency status"
    },
    "publicCommute": {
      "title": "Public Transit & Advisory",
      "description": "BMTC or Namma Metro advisory.",
      "busStatus": "Transit status",
      "citizenTip": "Actionable tip for Bangalore residents"
    }
  },
  "cityActions": [
    { "dept": "Agency Name (e.g. Bengaluru City Police / KSFES / BBMP / BESCOM)", "deptColor": "text-primary bg-primary/10 border-primary/30", "action": "Exact concrete action taken", "eta": "Timeframe" },
    { "dept": "Second Agency", "deptColor": "text-amber-400 bg-amber-500/10 border-amber-500/30", "action": "Exact concrete action taken", "eta": "Timeframe" }
  ],
  "dispatchedAssets": [
    {
      "id": "AST-SIM-01",
      "name": "Specific unit name (e.g. BBMP Dewatering Pump 04, BTP Quick Interceptor 12, KSFES Foam Tender 02)",
      "type": "rescue",
      "agency": "Exact Bangalore Agency (BBMP / Police / Fire / BESCOM / Health / BMTC)",
      "location": "Specific street or landmark near incident",
      "status": "ON SCENE",
      "eta": "On Site",
      "capacity": "Capacity specification",
      "task": "Active emergency mission"
    }
  ],
  "budget": {
    "operationalCost": "₹X.X Lakhs (or ₹XX,000 for small events)",
    "operationalCostDetails": "Breakdown: e.g. 12 patrol vehicles + drone operator + PA systems",
    "disruptionLossPrevented": "₹X.X Lakhs saved in public time & secondary damages",
    "costEfficiencyRatio": "1 : 7.4 (Every ₹1 spent prevents ₹7.4 in damages)"
  },
  "comparison": {
    "timeToClearOld": "Realistic delayed resolution time without coordination",
    "timeToClearNew": "Fast coordinated resolution time with City OS",
    "trafficDelayOld": "+X mins delay",
    "trafficDelayNew": "+Y mins delay",
    "emergencyDelayOld": "Old uncoordinated status",
    "emergencyDelayNew": "City OS coordinated status",
    "economicLossOld": "₹X.X Lakhs (Total losses without coordination)",
    "economicLossNew": "₹Y.Y Lakhs (Minimized cost with City OS)"
  }
}`;

    // Prefer fast, highly capable models
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
    let resultText = '';

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: `Analyze this Bengaluru municipal query and return the simulation JSON:\n"${prompt}"`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
          },
        });
        if (response && response.text) {
          resultText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed, trying next:`, err?.message || err);
      }
    }

    if (!resultText) {
      res.status(502).json({ error: 'AI generation failed across models' });
      return;
    }

    const parsed = JSON.parse(resultText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Simulation API Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to simulate scenario' });
  }
});

// Start Express and mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bengaluru City OS server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
