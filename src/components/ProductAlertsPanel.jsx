import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { INDUSTRY_CONFIG, PRODUCT_MAP, getRecommendations } from '../lib/riskEngine'
import { useSettings } from '../contexts/SettingsContext'
import { AlertTriangle, TrendingUp, Package, Clock, X, Info } from 'lucide-react'

const ISSUE_ICONS = {
  delay: <Clock size={13} />,
  shortage: <Package size={13} />,
  'price spike': <TrendingUp size={13} />,
  default: <AlertTriangle size={13} />,
}

function getIssueIcon(text) {
  const lower = text.toLowerCase()
  if (lower.includes('delay')) return ISSUE_ICONS.delay
  if (lower.includes('shortage') || lower.includes('short')) return ISSUE_ICONS.shortage
  if (lower.includes('price') || lower.includes('cost') || lower.includes('tariff')) return ISSUE_ICONS['price spike']
  return ISSUE_ICONS.default
}

function AlertModal({ alert, onClose }) {
  if (!alert) return null

  // Fetch a recommendation specific to this level
  const recs = getRecommendations(alert.ind.level)
  const mainRec = recs[0]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-900/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-modal w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
        >
          {/* Top colored edge */}
          <div className="h-1.5 w-full" style={{ background: alert.cfg.color }} />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
             <X size={16} />
          </button>

          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style={{ background: `${alert.cfg.color}15`, border: `1px solid ${alert.cfg.color}30` }}>
                {alert.icon}
              </div>
              <div>
                <h3 className="font-display font-semibold text-xl text-white">{alert.label}</h3>
                <p className="text-white/50 text-sm">{alert.cfg.label} Sector</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                <div className="text-white/40 text-xs mb-1">Risk Score</div>
                <div className="font-display font-bold text-3xl" style={{ color: alert.cfg.color }}>{alert.ind.score}</div>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                <div className="text-white/40 text-xs mb-1">Severity</div>
                <div className="font-semibold text-lg" style={{ color: alert.ind.color }}>{alert.ind.level}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl mb-4 border" style={{ background: `${alert.cfg.color}0A`, borderColor: `${alert.cfg.color}20` }}>
              <div className="flex items-center gap-2 text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">
                <Info size={12} /> Predicted Issue
              </div>
              <p className="text-white/90 text-sm leading-relaxed">{alert.ind.predictedIssue}</p>
            </div>

            {mainRec && (
              <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                 <div className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">Primary Recommendation</div>
                 <div className="flex items-start gap-3">
                   <span className="text-xl leading-none mt-0.5">{mainRec.icon}</span>
                   <p className="text-white/80 text-sm leading-snug">{mainRec.text}</p>
                 </div>
              </div>
            )}
            
            <button 
              onClick={onClose}
              className="w-full mt-6 py-3 rounded-xl font-medium text-sm border hover:bg-white/5 transition-colors"
               style={{ borderColor: alert.cfg.color, color: alert.cfg.color }}
            >
              Acknowledge Alert
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function ProductAlertsPanel({ industries }) {
  const { alertsEnabled } = useSettings()
  const [activeAlert, setActiveAlert] = useState(null)

  if (!industries) return null

  const alerts = []
  for (const [indId, products] of Object.entries(PRODUCT_MAP)) {
    const cfg = INDUSTRY_CONFIG[indId]
    const ind = industries[indId]
    if (!ind) continue
    for (const product of products) {
      alerts.push({ ...product, indId, cfg, ind })
    }
  }

  alerts.sort((a, b) => b.ind.score - a.ind.score)

  return (
    <>
      <div className="rounded-2xl p-6 glass-panel">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-white text-base">Product-Level Alerts</h2>
          {!alertsEnabled && <span className="text-xs text-white/30 px-2 py-1 rounded bg-white/5">Alerts Muted</span>}
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {alerts.map((a, i) => (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                onClick={() => alertsEnabled && setActiveAlert(a)}
                className={`flex items-center gap-3 p-3.5 rounded-xl transition-colors ${alertsEnabled ? 'cursor-pointer hover:bg-white/5' : 'opacity-80'}`}
                style={{ background: `${a.cfg.color}08`, border: `1px solid ${a.cfg.color}20` }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xl"
                  style={{ background: `${a.cfg.color}15` }}>
                  {a.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{a.label}</span>
                    <span className="text-white/40 text-xs">· {a.cfg.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span style={{ color: a.ind.color, opacity: 0.9 }}>{getIssueIcon(a.ind.predictedIssue)}</span>
                    <span className="text-white/50 text-xs truncate">{a.ind.predictedIssue}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={a.ind.score}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="font-display font-bold text-lg"
                      style={{ color: a.ind.color }}
                    >
                      {a.ind.score}
                    </motion.div>
                  </AnimatePresence>
                  <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: a.ind.color, opacity: 0.7 }}>{a.ind.level}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      {activeAlert && <AlertModal alert={activeAlert} onClose={() => setActiveAlert(null)} />}
    </>
  )
}
