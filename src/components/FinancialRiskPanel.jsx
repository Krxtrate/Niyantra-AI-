import { motion, AnimatePresence } from 'framer-motion'
import { DollarSign, TrendingDown, Info } from 'lucide-react'

export default function FinancialRiskPanel({ financialRisk }) {
  const { min, max } = financialRisk
  
  const formatCurrency = (val) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`
    return `$${val.toFixed(0)}`
  }

  const avgLoss = (min + max) / 2
  const riskColor = avgLoss > 10000000 ? '#FF3366' : avgLoss > 5000000 ? '#FFD700' : '#00FF87'

  return (
    <div className="glass-panel p-6 overflow-hidden relative group">
      {/* Background Glow */}
      <div 
        className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[100px] transition-colors duration-1000 opacity-20"
        style={{ background: riskColor }}
      />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h2 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Potential Financial Impact</h2>
          <p className="text-white/30 text-[10px]">Real-time revenue-at-risk estimation</p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${riskColor}15`, border: `1px solid ${riskColor}30` }}>
          <TrendingDown size={20} style={{ color: riskColor }} />
        </div>
      </div>

      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-baseline gap-3">
          <AnimatePresence mode="wait">
            <motion.span
              key={min}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-display font-bold text-white tracking-tighter"
            >
              {formatCurrency(min)}
            </motion.span>
          </AnimatePresence>
          <span className="text-white/20 text-xl font-medium">—</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={max}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-display font-bold tracking-tighter"
              style={{ color: riskColor }}
            >
              {formatCurrency(max)}
            </motion.span>
          </AnimatePresence>
        </div>
        <p className="text-white/40 text-xs font-medium">Daily Revenue Exposure</p>
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
        <motion.div 
          className="h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (avgLoss / 20000000) * 100)}%` }}
          style={{ background: `linear-gradient(90deg, ${riskColor}30, ${riskColor})` }}
        />
      </div>

      <div className="mt-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <Info size={12} className="text-white/30" />
          <span className="text-[10px] text-white/40 font-medium">Includes port delay + buffer holding costs</span>
        </div>
        <div className="text-[10px] text-white/20 font-mono tracking-tighter">
          NY-FIN-ALPHA_V2
        </div>
      </div>
    </div>
  )
}
