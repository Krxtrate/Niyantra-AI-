import { motion } from 'framer-motion'
import { Share2 } from 'lucide-react'
import NetworkMap from './NetworkMap'

export default function NavigationMonitor() {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-cyan" /> 
          Global Logistics Monitor
        </div>
        
        <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-cyan/5 border border-cyan/20">
          <Share2 size={10} className="text-cyan" />
          <span className="text-[9px] font-bold text-cyan uppercase tracking-tighter">Live Network Topology</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl">
        <NetworkMap />
      </div>
    </div>
  )
}
