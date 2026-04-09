/**
 * Risk Engine - Niyantra
 *
 * Weighted scoring formula per industry.
 * All inputs are 0-100 normalized scores.
 * To add a new industry: add an entry to INDUSTRY_CONFIG and PRODUCT_MAP.
 */

// ─── Industry Configuration ──────────────────────────────────────────────────

export const INDUSTRY_CONFIG = {
  food: {
    id: 'food',
    label: 'Food & Agriculture',
    icon: '🌾',
    color: '#00FF87',
    weights: { weather: 0.50, traffic: 0.30, political: 0.20 },
    accentColor: 'rgba(0, 255, 135, 0.2)',
    borderColor: 'rgba(0, 255, 135, 0.3)',
    financials: { dailyRevenue: 12500000, marginRisk: 0.15 } // $12.5M daily rev
  },
  electronics: {
    id: 'electronics',
    label: 'Electronics',
    icon: '⚡',
    color: '#00D4FF',
    weights: { weather: 0.20, traffic: 0.40, political: 0.40 },
    accentColor: 'rgba(0, 212, 255, 0.2)',
    borderColor: 'rgba(0, 212, 255, 0.3)',
    financials: { dailyRevenue: 45000000, marginRisk: 0.25 } // $45M daily rev
  },
  pharma: {
    id: 'pharma',
    label: 'Pharmaceuticals',
    icon: '💊',
    color: '#A855F7',
    weights: { weather: 0.20, traffic: 0.30, political: 0.50 },
    accentColor: 'rgba(168, 85, 247, 0.2)',
    borderColor: 'rgba(168, 85, 247, 0.3)',
    financials: { dailyRevenue: 28000000, marginRisk: 0.40 } // $28M daily rev
  },
};

// ─── Product Mapping ─────────────────────────────────────────────────────────

export const PRODUCT_MAP = {
  food: [
    { id: 'vegetables', label: 'Fresh Vegetables', icon: '🥦' },
    { id: 'grains', label: 'Grains & Cereals', icon: '🌾' },
  ],
  electronics: [
    { id: 'semiconductors', label: 'Semiconductors', icon: '🔬' },
    { id: 'displays', label: 'Display Panels', icon: '📺' },
  ],
  pharma: [
    { id: 'medicines', label: 'Essential Medicines', icon: '💊' },
    { id: 'vaccines', label: 'Vaccine Supply', icon: '💉' },
  ],
};

// ─── Risk Scoring ─────────────────────────────────────────────────────────────

/**
 * Calculate weighted risk score for an industry.
 * @param {string} industryId
 * @param {{ weather: number, traffic: number, political: number }} factors
 * @returns {number} 0–100 risk score
 */
export function calculateRisk(industryId, factors) {
  const config = INDUSTRY_CONFIG[industryId];
  if (!config) return 0;
  const { weights } = config;
  const raw =
    factors.weather * weights.weather +
    factors.traffic * weights.traffic +
    factors.political * weights.political;
  return Math.round(Math.min(100, Math.max(0, raw)));
}

/**
 * Derive risk level label and badge color.
 * @param {number} score
 * @returns {{ level: 'Low'|'Medium'|'High'|'Critical', color: string, bg: string, glow: string }}
 */
export function getRiskLevel(score) {
  if (score < 30) return { level: 'Low', color: '#00FF87', bg: 'rgba(0,255,135,0.12)', glow: '0 0 12px rgba(0,255,135,0.5)' };
  if (score < 55) return { level: 'Moderate', color: '#FFE135', bg: 'rgba(255,225,53,0.12)', glow: '0 0 12px rgba(255,225,53,0.5)' };
  if (score < 75) return { level: 'High', color: '#FF9500', bg: 'rgba(255,149,0,0.12)', glow: '0 0 12px rgba(255,149,0,0.5)' };
  return { level: 'Critical', color: '#FF2D7A', bg: 'rgba(255,45,122,0.12)', glow: '0 0 12px rgba(255,45,122,0.6)' };
}

// ─── Issue Predictions ────────────────────────────────────────────────────────

const ISSUE_TEMPLATES = {
  food: {
    weather: ['Crop damage expected due to heavy rainfall', 'Temperature spike threatens perishable transit'],
    traffic: ['Port congestion delaying fresh produce delivery'],
    political: ['Import restrictions may cause vegetable shortage'],
    generic: ['Supply delay of 2–4 days projected'],
  },
  electronics: {
    traffic: ['Semiconductor shipment delay — 5–10 days', 'Port backlog affecting component delivery'],
    political: ['Trade sanctions risk component shortage', 'Tariff increase — 15–25% cost spike projected'],
    weather: ['Factory output unaffected; transit clear'],
    generic: ['Moderate supply disruption projected'],
  },
  pharma: {
    political: ['Regulatory changes may block drug imports', 'Sanctions affecting API (active ingredient) supply'],
    traffic: ['Cold-chain logistics at risk — re-routing needed'],
    weather: ['Distribution delay due to adverse weather'],
    generic: ['Stock buffer recommended for 2 weeks'],
  },
};

/**
 * Return a predicted issue string based on highest risk factor.
 */
export function predictIssue(industryId, factors) {
  const templates = ISSUE_TEMPLATES[industryId];
  if (!templates) return 'Monitor situation closely';
  const sorted = Object.entries(factors).sort((a, b) => b[1] - a[1]);
  const [topFactor] = sorted[0];
  const pool = templates[topFactor] || templates.generic;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Recommendation Engine ────────────────────────────────────────────────────

const RECOMMENDATIONS = {
  Critical: [
    { icon: '🚨', text: 'Halt non-essential shipments immediately', priority: 'Urgent' },
    { icon: '🔄', text: 'Activate backup supplier contracts', priority: 'Urgent' },
    { icon: '📦', text: 'Emergency stock-up — target 30-day buffer', priority: 'High' },
    { icon: '🗺️', text: 'Re-route via alternative logistics corridors', priority: 'High' },
  ],
  High: [
    { icon: '⚠️', text: 'Consider delaying non-urgent shipments by 5–7 days', priority: 'High' },
    { icon: '🔄', text: 'Begin supplier diversification review', priority: 'High' },
    { icon: '📦', text: 'Increase safety stock by 20–30%', priority: 'Medium' },
    { icon: '📊', text: 'Monitor daily — trigger escalation at score > 80', priority: 'Medium' },
  ],
  Moderate: [
    { icon: '🗺️', text: 'Optimize existing routes for efficiency', priority: 'Medium' },
    { icon: '📦', text: 'Increase inventory buffer by 10–15%', priority: 'Low' },
    { icon: '👀', text: 'Set email alerts for news keywords', priority: 'Low' },
  ],
  Low: [
    { icon: '✅', text: 'Maintain standard operations', priority: 'Info' },
    { icon: '📊', text: 'Regular weekly monitoring sufficient', priority: 'Info' },
  ],
};

/**
 * Get recommendations based on overall risk level.
 * @param {string} level - 'Low'|'Moderate'|'High'|'Critical'
 */
export function getRecommendations(level) {
  return RECOMMENDATIONS[level] || RECOMMENDATIONS.Low;
}

/**
 * Jitter function for simulation realism.
 */
export const jitter = (range = 5) => (Math.random() * range) - (range / 2);

// ─── Scenarios ──────────────────────────────────────────────────────────────

export const SCENARIO_TEMPLATES = {
  STRIKE: {
    id: 'STRIKE',
    label: 'Global Port Strike',
    description: 'Coordinated labor action across major shipping hubs.',
    factors: { weather: 10, traffic: 95, political: 60 },
    icon: '🪧'
  },
  HURRICANE: {
    id: 'HURRICANE',
    label: 'Grade 5 Hurricane',
    description: 'Major storm path passing through critical maritime routes.',
    factors: { weather: 98, traffic: 40, political: 10 },
    icon: '🌀'
  },
  CYBER: {
    id: 'CYBER',
    label: 'Infrastructure Cyber Attack',
    description: 'System-wide breach affecting automated port clearing.',
    factors: { weather: 5, traffic: 85, political: 95 },
    icon: '💻'
  }
};

// ─── Financial Impact Calculation ───────────────────────────────────────────

/**
 * Calculates current potential revenue loss range.
 * @param {Object} industries 
 * @returns {{ min: number, max: number }}
 */
export function calculateFinancialImpact(industries) {
  let minLoss = 0;
  let maxLoss = 0;

  Object.entries(industries).forEach(([id, state]) => {
    const config = INDUSTRY_CONFIG[id];
    if (!config || !config.financials) return;

    const { score } = state;
    const { dailyRevenue, marginRisk } = config.financials;

    // Loss logic: Higher risk score linearly increases the portion of revenue at risk
    // We also use the marginRisk as a secondary complexity multiplier
    const riskMultiplier = score / 100;
    
    // Heuristic: Min loss starts appearing at 30 score, Max loss at 80
    const currentMin = dailyRevenue * (riskMultiplier * 0.4) * marginRisk;
    const currentMax = dailyRevenue * (riskMultiplier * 1.1) * marginRisk;

    minLoss += currentMin;
    maxLoss += currentMax;
  });

  return { min: minLoss, max: maxLoss };
}
