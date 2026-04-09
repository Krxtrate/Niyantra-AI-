import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { INDUSTRY_CONFIG } from '../lib/riskEngine'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl p-3 text-xs" style={{ background: 'rgba(10,8,24,0.97)', border: '1px solid rgba(168,85,247,0.3)', backdropFilter: 'blur(12px)' }}>
      <p className="text-white/50 mb-2 font-medium">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-white/70 capitalize">{p.dataKey}:</span>
          <span className="font-bold" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function RiskTrendChart({ riskHistory }) {
  if (!riskHistory || riskHistory.length < 2) {
    return (
      <div className="rounded-2xl p-6 flex items-center justify-center h-64 glass-panel min-h-[300px]">
        <p className="text-white/30 text-sm">Building history…</p>
      </div>
    )
  }

  const industries = Object.values(INDUSTRY_CONFIG)

  return (
    <div className="rounded-2xl p-6 glass-panel pb-2">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display font-semibold text-white text-base">Risk Trend</h2>
        <div className="flex items-center gap-4">
          {industries.map(cfg => (
            <div key={cfg.id} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.color }} />
              <span className="text-white/50 text-xs">{cfg.label.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={riskHistory} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            {industries.map(cfg => (
              <linearGradient key={cfg.id} id={`grad-${cfg.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={cfg.color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={cfg.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />

          <XAxis
            dataKey="time"
            tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} />

          {industries.map(cfg => (
            <Area
              key={cfg.id}
              type="monotone"
              dataKey={cfg.id}
              stroke={cfg.color}
              strokeWidth={2}
              fill={`url(#grad-${cfg.id})`}
              dot={false}
              activeDot={{ r: 5, fill: cfg.color, stroke: 'none' }}
              isAnimationActive={true}
              animationDuration={400}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
