import { motion, AnimatePresence } from 'framer-motion'
import { Cloud, Thermometer, Truck, Newspaper, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react'

function DataCard({ icon, label, value, sub, color, updating, source }) {
  const sourceColors = {
    LIVE: '#00FF87',
    CACHED: '#00F0FF',
    MOCK: '#FF3366',
    SIMULATED: '#FFD700'
  };
  const sColor = sourceColors[source] || '#ffffff40';

  return (
    <div className="p-4 rounded-xl relative overflow-hidden group" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Source Tag */}
      {source && (
        <div 
          className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-tighter transition-opacity opacity-40 group-hover:opacity-100"
          style={{ background: `${sColor}20`, color: sColor, border: `1px solid ${sColor}30` }}
        >
          {source}
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20`, color }}>
            {icon}
          </div>
          <span className="text-white/50 text-xs font-medium">{label}</span>
        </div>
        {updating && <RefreshCw size={10} className="text-white/20 animate-spin" />}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="font-display font-bold text-xl text-white">{value}</div>
          {sub && <div className="text-white/40 text-xs mt-1">{sub}</div>}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function NewsKeyword({ keyword }) {
  const colors = ['#A855F7', '#FF2D7A', '#FFE135', '#00D4FF', '#FF9500', '#00FF87']
  const color = colors[Math.abs(keyword.charCodeAt(0) + keyword.length) % colors.length]
  return (
    <motion.span
      key={keyword}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="px-2.5 py-1 rounded-lg text-xs font-medium"
      style={{ background: `${color}18`, color, border: `1px solid ${color}35` }}
    >
      {keyword}
    </motion.span>
  )
}

export default function LiveDataPanel({ liveData, lastUpdated }) {
  if (!liveData) {
    return (
      <div className="rounded-2xl p-6 flex flex-col items-center justify-center h-48 glass-panel min-h-[220px]">
        <div className="flex items-center gap-2 text-white/30">
          <RefreshCw size={14} className="animate-spin" />
          <span className="text-sm">Fetching live data…</span>
        </div>
      </div>
    )
  }

  const { weather, traffic, news } = liveData

  return (
    <div className="rounded-2xl p-6 glass-panel h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display font-semibold text-white text-base">Live Data Feed</h2>
        {lastUpdated && (
          <span className="text-white/30 text-xs">
            Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <DataCard icon={<Cloud size={14} />} label="Condition" value={`${weather.icon} ${weather.condition}`} source={weather.source} color="#00D4FF" />
        <DataCard icon={<Thermometer size={14} />} label="Temperature" value={`${weather.temperature}°C`} sub={`Rain risk: ${weather.rain}%`} source={weather.source} color="#00D4FF" />
        <DataCard icon={<Truck size={14} />} label="Traffic" value={`${traffic.congestion}%`} sub={`${traffic.level} · ${traffic.incidents} incidents`} source={traffic.source} color="#FF9500" />
      </div>

      {/* News section */}
      <div className="flex-1 min-h-0 flex flex-col mt-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Newspaper size={14} className="text-cyan" />
            <span className="text-white font-semibold text-sm">Global News Signals</span>
          </div>
          {news?.limitReached && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 font-bold uppercase tracking-wider">
              <AlertTriangle size={10} /> Limit Reached
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
          {(!news?.articles || news.articles.length === 0) ? (
            <div className="py-8 text-center text-white/20 text-xs italic">No relevant news signals detected.</div>
          ) : (
            news.articles.map((article, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 rounded-xl relative group transition-all duration-300 hover:bg-white/[0.04]"
                style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-tight">{news.source}</span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-[10px] text-white/30">{new Date(article.publishedAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-white/90 text-sm font-medium leading-snug group-hover:text-cyan transition-colors line-clamp-2">
                      {article.headline}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="px-2 py-0.5 rounded-full text-[10px] font-bold" 
                      style={{ 
                        background: article.score > 70 ? 'rgba(255,51,102,0.12)' : 'rgba(0,255,135,0.12)', 
                        color: article.score > 70 ? '#FF3366' : '#00FF87',
                        border: `1px solid ${article.score > 70 ? '#FF336640' : '#00FF8740'}`
                      }}
                    >
                      RISK {article.score}
                    </div>
                  </div>
                </div>
                
                <p className="text-white/40 text-xs line-clamp-2 mb-3 leading-relaxed">
                  {article.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {article.keywords.slice(0, 2).map(kw => <NewsKeyword key={kw} keyword={kw} />)}
                  </div>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan/20 text-white/30 hover:text-cyan transition-all"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
