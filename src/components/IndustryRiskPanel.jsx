import { motion, AnimatePresence } from 'framer-motion'
import { INDUSTRY_CONFIG } from '../lib/riskEngine'

function RiskBar({ score, color }) {
  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
      <motion.div
        className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: `linear-gradient(90deg, ${color}99, ${color})`, boxShadow: `0 0 8px ${color}88` }}
      />
    </div>
  )
}

function RiskBadge({ level, color, bg, glow }) {
  return (
    <motion.span
      key={level}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
      style={{ background: bg, color, boxShadow: glow, border: `1px solid ${color}44` }}
    >
      {level}
    </motion.span>
  )
}

export default function IndustryRiskPanel({ industries }) {
  if (!industries) return null

  return (
    <div className="rounded-2xl p-6 glass-panel">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display font-semibold text-white text-base">Industry Risk Monitor</h2>
        <div className="flex items-center gap-1.5" style={{ background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.2)', borderRadius: 8, padding: '4px 10px' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
          <span className="text-xs text-green-400 font-medium">Live</span>
        </div>
      </div>

      <div className="space-y-4">
        {Object.values(INDUSTRY_CONFIG).map(cfg => {
          const ind = industries[cfg.id]
          if (!ind) return null
          return (
            <motion.div
              key={cfg.id}
              layout
              className="p-4 rounded-xl relative overflow-hidden group"
              style={{ background: cfg.accentColor, border: `1px solid ${cfg.borderColor}` }}
            >
              {/* Subtle inner glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ background: `radial-gradient(circle at 0% 50%, ${cfg.color}18 0%, transparent 60%)` }} />

              <div className="flex items-start justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cfg.icon}</span>
                  <div>
                    <div className="text-white font-medium text-sm">{cfg.label}</div>
                    <div className="text-white/40 text-xs mt-0.5 max-w-[200px] truncate">{ind.predictedIssue}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={ind.score}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="font-display font-bold text-2xl"
                      style={{ color: cfg.color }}
                    >
                      {ind.score}
                    </motion.div>
                  </AnimatePresence>
                  <RiskBadge level={ind.level} color={ind.color} bg={ind.bg} glow={ind.glow} />
                </div>
              </div>

              <RiskBar score={ind.score} color={cfg.color} />

              {/* Factor breakdown micro-bars */}
              <div className="flex gap-3 mt-3 relative z-10">
                {Object.entries(ind.factors).map(([fk, fv]) => (
                  <div key={fk} className="flex-1">
                    <div className="text-white/30 text-xs mb-1 capitalize">{fk}</div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        animate={{ width: `${fv}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ background: `${cfg.color}80` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
