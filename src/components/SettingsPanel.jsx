import { motion, AnimatePresence } from 'framer-motion'
import { X, Sliders, Check, Eye, EyeOff } from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'
import { INDUSTRY_CONFIG } from '../lib/riskEngine'

export default function SettingsPanel({ isOpen, onClose }) {
  const { 
    industriesEnabled, toggleIndustry, 
    sensitivity, setSensitivity,
    alertsEnabled, setAlertsEnabled 
  } = useSettings()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-space-900/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-80 z-50 glass-modal border-l border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-cyan">
                  <Sliders size={16} />
                </div>
                <h2 className="font-display font-semibold text-lg text-white">Dashboard Settings</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white/50 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-8">
              
              {/* Monitored Industries */}
              <section>
                <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Monitored Sectors</div>
                <div className="space-y-2">
                  {Object.values(INDUSTRY_CONFIG).map(cfg => {
                    const active = industriesEnabled[cfg.id]
                    return (
                      <div 
                        key={cfg.id}
                        onClick={() => toggleIndustry(cfg.id)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                          active ? 'bg-white/5 border border-white/10' : 'opacity-50 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{cfg.icon}</span>
                          <span className="text-sm font-medium text-white">{cfg.label}</span>
                        </div>
                        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${active ? 'bg-cyan' : 'bg-white/10'}`}>
                          <motion.div 
                            layout
                            className="w-4 h-4 rounded-full bg-white shadow-sm"
                            animate={{ x: active ? 16 : 0 }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* Sensitivity Multiplier */}
              <section>
                <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Risk Sensitivity</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Relaxed', value: 0.8 },
                    { label: 'Normal', value: 1.0 },
                    { label: 'Strict', value: 1.2 },
                  ].map(lvl => (
                    <button
                      key={lvl.label}
                      onClick={() => setSensitivity(lvl.value)}
                      className={`py-2 rounded-lg text-xs font-medium transition-all ${
                        sensitivity === lvl.value 
                          ? 'bg-cyan/20 text-cyan border border-cyan/30' 
                          : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
                <p className="text-white/30 text-xs mt-3 leading-relaxed">
                  Adjusting sensitivity scales the weighted baseline. Strict mode triggers alerts sooner.
                </p>
              </section>

              {/* Alerts Toggle */}
              <section>
                <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Notifications</div>
                <div 
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {alertsEnabled ? <Eye size={16} className="text-emerald" /> : <EyeOff size={16} className="text-white/50" />}
                    <div>
                      <div className="text-sm font-medium text-white">Intelligent Alerts</div>
                      <div className="text-xs text-white/40 mt-0.5">Enable contextual modals</div>
                    </div>
                  </div>
                  <div className={`w-10 h-6 rounded-full p-1 transition-colors ${alertsEnabled ? 'bg-emerald' : 'bg-white/10'}`}>
                    <motion.div 
                      layout
                      className="w-4 h-4 rounded-full bg-white shadow-sm"
                      animate={{ x: alertsEnabled ? 16 : 0 }}
                    />
                  </div>
                </div>
              </section>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
