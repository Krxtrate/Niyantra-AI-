import { useMemo } from 'react'
import { motion } from 'framer-motion'

// Stylized minimal world map paths (approximate for aesthetic tech feel)
const WORLD_PATH = "M10,40 Q15,35 20,40 T30,45 T45,35 T60,40 T75,45 T90,40 M15,60 Q25,65 35,60 T50,70 T70,65 T85,75 M70,25 Q75,20 80,25 T90,30"

const NODES = [
  { id: 'SHA', x: 82, y: 42, label: 'Shanghai', region: 'East Asia' },
  { id: 'SIN', x: 78, y: 68, label: 'Singapore', region: 'SE Asia' },
  { id: 'RTM', x: 48, y: 32, label: 'Rotterdam', region: 'Europe' },
  { id: 'NYC', x: 25, y: 38, label: 'New York', region: 'North America' },
  { id: 'LAX', x: 12, y: 45, label: 'Los Angeles', region: 'North America' },
  { id: 'DXB', x: 58, y: 48, label: 'Dubai', region: 'Middle East' },
  { id: 'MUM', x: 68, y: 55, label: 'Mumbai', region: 'South Asia' },
]

const ROUTES = [
  { from: 'SHA', to: 'SIN', risk: 'Low' },
  { from: 'SIN', to: 'RTM', risk: 'High' },
  { from: 'RTM', to: 'NYC', risk: 'Moderate' },
  { from: 'NYC', to: 'LAX', risk: 'Low' },
  { from: 'DXB', to: 'MUM', risk: 'Moderate' },
  { from: 'MUM', to: 'SIN', risk: 'Low' },
]

export default function NetworkMap({ industries }) {
  const getNodePos = (id) => NODES.find(n => n.id === id)

  // Determine the "focal point" based on highest risk (simulated for demo)
  const focalPoint = useMemo(() => {
    // In a real app, we'd map 'industries' risk to locations. 
    // Here we'll pick a high-risk route to showcase the zoom.
    return NODES.find(n => n.id === 'SIN') // Focusing on Singapore/SE Asia hub
  }, [])

  // ViewBox calculation for Dynamic Zoom
  // Base: 0 0 100 100. Zoomed: close to focal point.
  const viewBox = `0 10 100 80` // Moderate global crop for better dashboard fit

  return (
    <div className="w-full h-full min-h-[350px] relative bg-black/40 rounded-xl border border-white/5 overflow-hidden group">
      <motion.svg 
        viewBox={viewBox} 
        className="w-full h-full"
        initial={false}
        animate={{ viewBox: `50 25 50 50` }} // Zoomed into the active hub
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: 'reverse', repeatDelay: 5 }}
      >
        {/* World Map Background (Stylized) */}
        <path 
          d="M0,0 L100,0 L100,100 L0,100 Z" 
          fill="none" 
        />
        <path 
          d={WORLD_PATH} 
          fill="none" 
          stroke="rgba(0,240,255,0.05)" 
          strokeWidth="15" 
          strokeLinecap="round"
        />

        {/* Connection Arcs */}
        {ROUTES.map((route, i) => {
          const start = getNodePos(route.from)
          const end = getNodePos(route.to)
          const midX = (start.x + end.x) / 2
          const midY = Math.min(start.y, end.y) - 5
          const pathD = `M${start.x},${start.y} Q${midX},${midY} ${end.x},${end.y}`
          
          const color = route.risk === 'High' ? '#FF3366' : route.risk === 'Moderate' ? '#FFD700' : '#00FF87'

          return (
            <g key={i}>
              <path
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth="0.4"
                strokeDasharray="1,2"
                opacity="0.3"
              />
              {/* Moving Data Particle */}
              <motion.circle r="0.4" fill={color}>
                <animateMotion 
                  path={pathD} 
                  dur={`${2 + Math.random() * 2}s`} 
                  repeatCount="indefinite" 
                />
                <circle r="1" fill={color} opacity="0.2">
                  <animateMotion path={pathD} dur="3s" repeatCount="indefinite" />
                </circle>
              </motion.circle>
            </g>
          )
        })}

        {/* Nodes */}
        {NODES.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x} cy={node.y} r="1.2"
              fill="#000"
              stroke="#00F0FF"
              strokeWidth="0.3"
            />
            <motion.circle
               cx={node.x} cy={node.y} r="2.5"
               fill="#00F0FF"
               opacity="0.1"
               animate={{ scale: [1, 1.5, 1] }}
               transition={{ duration: 2, repeat: Infinity }}
            />
            <text 
              x={node.x} y={node.y - 3} 
              textAnchor="middle" fontSize="1.8" 
              fill="rgba(255,255,255,0.6)" fontWeight="700"
              className="pointer-events-none tracking-tighter"
            >
              {node.id}
            </text>
          </g>
        ))}
      </motion.svg>
      
      {/* Zoom Overlay Info */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1 pointer-events-none">
        <div className="text-[10px] uppercase font-bold text-cyan tracking-[0.2em] bg-cyan/10 px-2 py-1 rounded border border-cyan/20">
          Global Route Monitor
        </div>
        <div className="text-[9px] text-white/30 italic">
          Auto-focusing on high-volatility corridors...
        </div>
      </div>
    </div>
  )
}
