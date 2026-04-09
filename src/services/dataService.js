/**
 * Data Service Layer - Niyantra (LIVE APIs with Optimization)
 */

// ─────────────────────────────────────────────────────────────
// CACHE HELPERS
// ─────────────────────────────────────────────────────────────

const CACHE_KEYS = {
  WEATHER: 'niyantra_weather_cache',
  NEWS: 'niyantra_news_cache',
};

function getWithCache(key, ttlMinutes) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const age = (Date.now() - timestamp) / (1000 * 60);

    if (age > ttlMinutes) {
      // Don't remove, just return null so caller can decide if they want to use stale data
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function getStaleCache(key) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    return JSON.parse(cached).data;
  } catch {
    return null;
  }
}

function setWithCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch {
    console.warn("Storage full, could not cache data");
  }
}

// ─────────────────────────────────────────────────────────────
// HELPERS & MOCK GENERATORS (FALLBACKS)
// ─────────────────────────────────────────────────────────────

function mapWeatherToIcon(condition) {
  const map = {
    Clear: '☀️',
    Clouds: '⛅',
    Rain: '🌧️',
    Thunderstorm: '⛈️',
    Drizzle: '🌦️',
    Mist: '🌫️',
    Smoke: '🌫️',
    Haze: '🌫️',
    Fog: '🌫️',
  };
  return map[condition] || '🌍';
}

function extractKeywords(text = "") {
  return text
    .split(" ")
    .filter(word => word.length > 5 && !['through', 'between', 'against'].includes(word.toLowerCase()))
    .slice(0, 3);
}

function calculateRiskScore(headline = "") {
  const riskWords = [
    'strike', 'ban', 'war', 'delay',
    'shutdown', 'protest', 'shortage',
    'sanctions', 'closure', 'disruption', 'conflict', 'crisis'
  ];

  const lower = headline.toLowerCase();
  let score = 5; // Base risk

  riskWords.forEach((word, idx) => {
    if (lower.includes(word)) score += (15 + idx); 
  });

  return Math.min(score, 100);
}

// Higher quality Mock Fallbacks
export function generateMockWeather() {
  const conditions = [
    { cond: 'Clear', icon: '☀️' },
    { cond: 'Clouds', icon: '⛅' },
    { cond: 'Rain', icon: '🌧️' }
  ];
  const pick = conditions[Math.floor(Math.random() * conditions.length)];
  return {
    rain: pick.cond === 'Rain' ? 85 : 15,
    temperature: 22 + Math.floor(Math.random() * 10),
    condition: pick.cond,
    icon: pick.icon,
    source: 'mock',
  };
}

export function generateMockNews() {
  const headlines = [
    "Global Logistics: Major port congestion reported in Singapore",
    "Trade Analytics: Semiconductor lead times expected to rise",
    "Supply Chain: New regulations impact tech export routes",
    "Labor Update: Potential strike at West Coast logistics hub"
  ];
  const headline = headlines[Math.floor(Math.random() * headlines.length)];
  return {
    headline,
    description: "System detected potential logistics bottleneck based on regional trends.",
    keywords: extractKeywords(headline),
    score: calculateRiskScore(headline),
    source: 'mock',
  };
}

// ─────────────────────────────────────────────────────────────
// WEATHER API
// ─────────────────────────────────────────────────────────────

export async function fetchWeatherData(city = "Chennai") {
  const cached = getWithCache(`${CACHE_KEYS.WEATHER}_${city}`, 30); // 30 mins
  if (cached) return { ...cached, source: 'cached' };

  try {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    if (!API_KEY) throw new Error("No Weather Key");

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!res.ok) throw new Error("Weather API error");

    const data = await res.json();
    const result = {
      rain: data.rain ? 80 : 10,
      temperature: Math.round(data.main?.temp || 0),
      condition: data.weather?.[0]?.main || "Unknown",
      icon: mapWeatherToIcon(data.weather?.[0]?.main),
    };

    setWithCache(`${CACHE_KEYS.WEATHER}_${city}`, result);
    return { ...result, source: 'LIVE' };

  } catch (err) {
    console.warn("Weather API fallback (attempting stale cache):", err.message);
    const stale = getStaleCache(`${CACHE_KEYS.WEATHER}_${city}`);
    if (stale) return { ...stale, source: 'CACHED (STALE)' };
    
    const mock = generateMockWeather();
    return { ...mock, source: 'MOCK' };
  }
}

// ─────────────────────────────────────────────────────────────
// NEWS API
// ─────────────────────────────────────────────────────────────

export async function fetchNewsData() {
  const cached = getWithCache(CACHE_KEYS.NEWS, 60); // 60 mins
  if (cached) {
    const articles = Array.isArray(cached) ? cached : [cached];
    return { articles, source: 'CACHED' };
  }

  try {
    const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
    if (!API_KEY) throw new Error("No News Key found in .env");

    const url = `https://gnews.io/api/v4/search?q="supply chain disruption"&lang=en&max=5&token=${API_KEY}`;
    
    console.info("[Niyantra] Fetching News Signal:", url.split('token=')[0] + 'token=REDACTED');

    const res = await fetch(url);

    const data = await res.json();
    if (!data.articles || data.articles.length === 0) {
      throw new Error("No articles found");
    }

    const results = data.articles.map(art => ({
      headline: art.title,
      description: art.description,
      url: art.url,
      image: art.image,
      publishedAt: art.publishedAt,
      keywords: extractKeywords(art.title + " " + (art.description || "")),
      score: calculateRiskScore(art.title + " " + (art.description || "")),
    }));

    setWithCache(CACHE_KEYS.NEWS, results);
    return { articles: results, source: 'LIVE' };

  } catch (err) {
    console.error("[Niyantra] News API failed:", err.message);
    
    const stale = getStaleCache(CACHE_KEYS.NEWS);
    if (stale) {
      return { 
        articles: Array.isArray(stale) ? stale : [stale], 
        source: 'CACHED (STALE)', 
        limitReached: err.message === "API_LIMIT_REACHED" 
      };
    }

    const mock = [generateMockNews(), generateMockNews()];
    return { 
      articles: mock, 
      source: 'MOCK', 
      error: err.message, 
      limitReached: err.message === "API_LIMIT_REACHED" 
    };
  }
}

// ─────────────────────────────────────────────────────────────
// TRAFFIC (SIMULATED REAL-TIME)
// ─────────────────────────────────────────────────────────────

export function generateTrafficData() {
  // ... (existing logic)
  const hour = new Date().getHours();
  const isRushHour = (hour > 8 && hour < 10) || (hour > 17 && hour < 19);
  
  const baseCongestion = isRushHour ? 65 : 30;
  const congestion = Math.min(100, Math.round(baseCongestion + Math.random() * 30));
  
  const level =
    congestion < 30 ? 'Low' :
      congestion < 60 ? 'Moderate' :
        congestion < 80 ? 'High' : 'Severe';

  // alternate routes basics
  const routes = [
    { name: 'Northern Corridor', time: '+12m', status: 'Clear' },
    { name: 'Sea Route B-12', time: '+2h', status: 'Heavy' },
    { name: 'Direct Expressway', time: 'Active', status: 'Blocked' }
  ].sort(() => 0.5 - Math.random()).slice(0, 2);

  return {
    congestion,
    level,
    incidents: Math.floor(Math.random() * 5) + (isRushHour ? 3 : 0),
    routes,
    source: 'SIMULATED',
  };
}

// ─────────────────────────────────────────────────────────────
// MAIN FETCH
// ─────────────────────────────────────────────────────────────

export async function fetchLiveData(city = "Chennai") {
  try {
    const [weather, news] = await Promise.all([
      fetchWeatherData(city),
      fetchNewsData()
    ]);

    const traffic = generateTrafficData();

    return {
      weather,
      news,
      traffic,
      timestamp: new Date().toISOString(),
    };

  } catch (err) {
    console.error("Live data fetch fatal:", err);
    return {
      weather: generateMockWeather(),
      news: { articles: [generateMockNews(), generateMockNews()], source: 'MOCK (FATAL)' },
      traffic: generateTrafficData(),
      timestamp: new Date().toISOString(),
    };
  }
}