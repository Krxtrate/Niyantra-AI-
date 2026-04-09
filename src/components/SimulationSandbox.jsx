import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Zap, Wind, ShieldAlert, Cpu } from 'lucide-react'
import { SCENARIO_TEMPLATES } from '../lib/riskEngine'

export default function SimulationSandbox({ activeScenario, triggerScenario, clearScenario }) {
  const scenarios = Object.values(SCENARIO_TEMPLATES)
  
  const icons = {
    STRIKE: <Zap size={16} />,
    HURRICANE: <Wind size={16} />,
    CYBER: <ShieldAlert size={16} />
  }

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-semibold text-base mb-1 flex items-center gap-2">
            <Cpu size={16} className="text-cyan" />
            Niyantra Lab
          </h2>
          <p className="text-white/40 text-xs">Run predictive "What-If" disruption scenarios</p>
        </div>
        
        {activeScenario && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1 rounded-full bg-cyan/10 border border-cyan/30 flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse shadow-[0_0_8px_#00F0FF]" />
            <span className="text-[10px] font-bold text-cyan uppercase tracking-wider">Simulation Active</span>
          </motion.div>
        )}
      </div>

      <div className="space-y-3">
        {scenarios.map((scenario) => {
          const isActive = activeScenario?.id === scenario.id
          return (
            <motion.div
              key={scenario.id}
              whileHover={{ x: 4 }}
              onClick={() => isActive ? clearScenario() : triggerScenario(scenario)}
              className={`p-4 rounded-xl cursor-pointer border transition-all duration-300 group ${
                isActive 
                  ? 'bg-cyan/10 border-cyan/40' 
                  : 'bg-white/[0.03] border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? 'bg-cyan text-space-900' : 'bg-white/5 text-white/40 group-hover:text-white'
                  }`}>
                    {icons[scenario.id]}
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold mb-1 ${isActive ? 'text-white' : 'text-white/70'}`}>
                      {scenario.label}
                    </h3>
                    <p className="text-[11px] text-white/30 leading-relaxed max-w-[180px]">
                      {scenario.description}
                    </p>
                  </div>
                </div>
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isActive ? 'bg-cyan text-space-900' : 'bg-white/5 text-white/30 opacity-0 group-hover:opacity-100'
                }`}>
                  {isActive ? <Pause size={14} fill="currentColor" /> : <Play size={10} fill="currentColor" className="ml-0.5" />}
                </div>
              </div>

              {isActive && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 pt-4 border-t border-cyan/20 grid grid-cols-3 gap-2"
                >
                  {Object.entries(scenario.factors).map(([key, val]) => (
                    <div key={key} className="text-center">
                      <div className="text-[9px] uppercase font-bold text-cyan/50 mb-1">{key}</div>
                      <div className="text-xs font-mono text-white">{val}%</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-cyan/5 border border-cyan/10">
        <div className="flex items-center gap-2 mb-2 text-cyan/60">
          <Info size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Auto-Recovery</span>
        </div>
        <p className="text-[10px] text-white/30 leading-relaxed">
          Niyantra will re-calibrate to live feeds automatically once the simulation is suspended.
        </p>
      </div>
    </div>
  )
}

function Info({ size, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}
