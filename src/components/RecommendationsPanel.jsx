import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb } from 'lucide-react'

const PRIORITY_STYLES = {
  Urgent: { color: '#FF2D7A', bg: 'rgba(255,45,122,0.15)', border: 'rgba(255,45,122,0.3)' },
  High:   { color: '#FF9500', bg: 'rgba(255,149,0,0.12)',  border: 'rgba(255,149,0,0.3)' },
  Medium: { color: '#FFE135', bg: 'rgba(255,225,53,0.10)', border: 'rgba(255,225,53,0.25)' },
  Low:    { color: '#A855F7', bg: 'rgba(168,85,247,0.10)', border: 'rgba(168,85,247,0.25)' },
  Info:   { color: '#00FF87', bg: 'rgba(0,255,135,0.10)',  border: 'rgba(0,255,135,0.25)' },
}

export default function RecommendationsPanel({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null

  return (
    <div className="rounded-2xl p-6 glass-panel">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,225,53,0.15)', color: '#FFE135' }}>
          <Lightbulb size={15} />
        </div>
        <h2 className="font-display font-semibold text-white text-base">AI Recommendations</h2>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {recommendations.map((rec, i) => {
            const style = PRIORITY_STYLES[rec.priority] || PRIORITY_STYLES.Info
            return (
              <motion.div
                key={rec.text}
                layout
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className="flex items-start gap-3 p-3.5 rounded-xl"
                style={{ background: style.bg, border: `1px solid ${style.border}` }}
              >
                <span className="text-lg shrink-0 mt-0.5">{rec.icon}</span>
                <div className="flex-1">
                  <p className="text-white/85 text-sm leading-snug">{rec.text}</p>
                </div>
                <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: `${style.color}22`, color: style.color, border: `1px solid ${style.color}44` }}>
                  {rec.priority}
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
