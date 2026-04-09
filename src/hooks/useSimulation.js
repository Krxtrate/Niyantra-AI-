import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchLiveData } from '../services/dataService';
import { calculateRisk, getRiskLevel, predictIssue, getRecommendations, INDUSTRY_CONFIG, calculateFinancialImpact, jitter } from '../lib/riskEngine';
import { useSettings } from '../contexts/SettingsContext';

const INDUSTRIES = Object.keys(INDUSTRY_CONFIG);
const UPDATE_INTERVAL = 4000;
const HISTORY_LENGTH = 20;

// jitter move

function buildInitialFactors() {
  return {
    weather: 40 + Math.random() * 30,
    traffic: 35 + Math.random() * 40,
    political: 25 + Math.random() * 35,
  };
}

function buildIndustryState(factors, sensitivity, enabled) {
  return INDUSTRIES.reduce((acc, id) => {
    if (!enabled[id]) return acc; // Skip disabled industries
    
    // Apply sensitivity multiplier to the raw score before cap
    let rawScore = calculateRisk(id, factors) * sensitivity;
    const score = Math.round(Math.min(100, Math.max(0, rawScore)));
    
    const { level, color, bg, glow } = getRiskLevel(score);
    acc[id] = {
      score,
      level,
      color,
      bg,
      glow,
      factors: { ...factors },
      predictedIssue: predictIssue(id, factors),
    };
    return acc;
  }, {});
}

export function useSimulation() {
  const { industriesEnabled, sensitivity } = useSettings();
  
  const [liveData, setLiveData] = useState(null);
  const [activeScenario, setActiveScenario] = useState(null);
  const [financialRisk, setFinancialRisk] = useState({ min: 0, max: 0 });
  const [industries, setIndustries] = useState(() => {
    const f = buildInitialFactors();
    return buildIndustryState(f, sensitivity, industriesEnabled);
  });
  const [riskHistory, setRiskHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Keep refs of latest settings to avoid putting them in tick dependency array and causing re-renders
  const settingsRef = useRef({ industriesEnabled, sensitivity });
  useEffect(() => {
    settingsRef.current = { industriesEnabled, sensitivity };
  }, [industriesEnabled, sensitivity]);

  const tick = useCallback(async () => {
    try {
      const data = await fetchLiveData();
      
      // STICKY NEWS: If new data has no articles, keep the previous news if it exists
      setLiveData(prev => {
        if (!data.news || !data.news.articles || data.news.articles.length === 0) {
          if (prev?.news?.articles?.length > 0) {
            return {
              ...data,
              news: {
                ...prev.news,
                source: prev.news.source + ' (RETAINED)'
              }
            };
          }
        }
        return data;
      });

      const scenarioFactors = activeScenario?.factors;
      
      const factors = {
        weather: scenarioFactors ? scenarioFactors.weather : (data.weather ? Math.min(100, Math.max(0, 
          ((data.weather.rain || 0) * 0.6 + Math.abs(((data.weather.temperature || 22) - 22) / 22) * 40) + jitter(4)
        )) : 50),
        traffic: scenarioFactors ? scenarioFactors.traffic : (data.traffic ? Math.min(100, Math.max(0, (data.traffic.congestion || 0) + jitter(8))) : 50),
        political: scenarioFactors ? scenarioFactors.political : ((data.news && data.news.articles && data.news.articles.length > 0) 
          ? Math.min(100, Math.max(0, Math.max(...data.news.articles.map(a => a.score)) + jitter(6)))
          : 30),
      };

      const currentSettings = settingsRef.current;
      const newIndustries = buildIndustryState(factors, currentSettings.sensitivity, currentSettings.industriesEnabled);
      setIndustries(newIndustries);

      // Build history point
      const historyPoint = {
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      
      // Only record enabled
      INDUSTRIES.forEach(id => {
        if (currentSettings.industriesEnabled?.[id]) {
          historyPoint[id] = newIndustries[id]?.score || 0;
        }
      });
      
      setRiskHistory(prev => [...prev.slice(-HISTORY_LENGTH + 1), historyPoint]);

      // Recommendations based on highest-risk industry among ENABLED
      const enabledScores = Object.keys(newIndustries).map(id => ({ 
        id, 
        score: newIndustries[id]?.score || 0, 
        level: newIndustries[id]?.level || 'Low' 
      }));
      
      if (enabledScores.length > 0) {
        const highest = enabledScores.sort((a, b) => b.score - a.score)[0];
        setRecommendations(getRecommendations(highest.level));
      } else {
        setRecommendations([]);
      }

      setLastUpdated(new Date());
      setIsLoading(false);
      
      // Update financial risk
      setFinancialRisk(calculateFinancialImpact(newIndustries));
    } catch (err) {
      console.error('[Niyantra] Data tick error:', err);
      setIsLoading(false);
    }
  }, [activeScenario]);

  const forceRefresh = useCallback(async () => {
    setIsLoading(true);
    // Clear all Niyantra caches
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('niyantra_')) localStorage.removeItem(key);
    });
    await tick();
  }, [tick]);

  useEffect(() => {
    tick();
    const interval = setInterval(tick, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [tick]);

  return { 
    liveData, 
    industries, 
    riskHistory, 
    recommendations, 
    financialRisk,
    activeScenario,
    isLoading, 
    lastUpdated,
    forceRefresh,
    triggerScenario: (scenario) => setActiveScenario(scenario),
    clearScenario: () => setActiveScenario(null)
  };
}
