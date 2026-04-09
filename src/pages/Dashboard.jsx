import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Home, RefreshCw, Bell, Settings, ChevronLeft, Zap } from 'lucide-react'
import { useSimulation } from '../hooks/useSimulation'
import { useSettings } from '../contexts/SettingsContext'
import IndustryRiskPanel from '../components/IndustryRiskPanel'
import ProductAlertsPanel from '../components/ProductAlertsPanel'
import LiveDataPanel from '../components/LiveDataPanel'
import RiskTrendChart from '../components/RiskTrendChart'
import RecommendationsPanel from '../components/RecommendationsPanel'
import ParticleBackground from '../components/ParticleBackground'
import SettingsPanel from '../components/SettingsPanel'
import SimulationSandbox from '../components/SimulationSandbox'
import FinancialRiskPanel from '../components/FinancialRiskPanel'

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ onBack, onOpenSettings }) {
  const items = [
    { icon: <Activity size={18} />, label: 'Overview', active: true, action: () => {} },
    { icon: <Settings size={18} />, label: 'Settings', active: false, action: onOpenSettings },
  ]
  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 h-full py-6 px-3 glass-panel rounded-none border-b-0 border-t-0 border-l-0"
      style={{ zIndex: 10 }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-10 group cursor-pointer" onClick={onBack}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
          style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(0,255,135,0.05))', border: '1px solid rgba(0,240,255,0.3)' }}>
          <Activity size={16} className="text-cyan" />
        </div>
        <span className="font-display font-bold text-white tracking-tight">NIYANTRA</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {items.map(item => (
          <div key={item.label}
            onClick={item.action}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200"
            style={item.active
              ? { background: 'rgba(0,240,255,0.1)', color: '#00F0FF', border: '1px solid rgba(0,240,255,0.2)' }
              : { color: 'rgba(255,255,255,0.4)' }
            }
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
            {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_8px_#00F0FF]" />}
          </div>
        ))}
      </nav>

      {/* Back to Landing */}
      <button onClick={onBack}
        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200 text-sm">
        <ChevronLeft size={15} />
        Back to Home
      </button>
    </aside>
  )
}

// ─── Top Bar ─────────────────────────────────────────────────────────────────
function TopBar({ lastUpdated, isLoading, onBack, onOpenSettings, onRefresh }) {
  const { alertsEnabled } = useSettings()
  return (
    <div className="flex items-center justify-between px-5 lg:px-8 py-4 shrink-0 border-b border-white/5 bg-space-900/40 backdrop-blur-md relative z-10">
      {/* Mobile controls */}
      <div className="lg:hidden flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-1 text-white/50 hover:text-white text-sm transition-colors">
          <ChevronLeft size={15} /> Home
        </button>
        <button onClick={onOpenSettings} className="text-white/50 hover:text-white">
          <Settings size={18} />
        </button>
      </div>

      <div className="hidden lg:block">
        <h1 className="font-display font-semibold text-white text-lg">Supply Chain Dashboard</h1>
        <p className="text-white/40 text-xs mt-0.5">Real-time disruption prediction & monitoring</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Alerts status */}
        {!alertsEnabled && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-white/40">
            <Bell size={11} /> Muted
          </div>
        )}

        {/* Update indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {isLoading
            ? <><RefreshCw size={11} className="animate-spin text-white/40" /><span className="text-white/40">Syncing...</span></>
            : <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse shadow-[0_0_8px_#00FF87]" />
                <span className="text-emerald font-medium tracking-wide mr-1">LIVE</span>
                <button 
                  onClick={onRefresh}
                  className="p-1 hover:bg-white/10 rounded transition-colors text-white/40 hover:text-white"
                  title="Manual Sync"
                >
                  <RefreshCw size={11} />
                </button>
              </div>
          }
        </div>

        {/* AI Powered badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)' }}>
          <Zap size={11} style={{ color: '#00F0FF' }} />
          <span className="text-xs font-semibold text-cyan tracking-wide">Niyantra Core</span>
        </div>
      </div>
    </div>
  )
}

// ─── Summary Stats Row ────────────────────────────────────────────────────────
function SummaryRow({ industries }) {
  if (!industries) return null

  const activeInds = Object.values(industries)
  const avgScore = activeInds.length > 0
    ? Math.round(activeInds.reduce((s, i) => s + i.score, 0) / activeInds.length)
    : 0

  const critical = activeInds.filter(i => i.level === 'Critical').length
  const high = activeInds.filter(i => i.level === 'High').length

  const stats = [
    { label: 'Global Risk Index', value: avgScore, color: avgScore > 70 ? '#FF3366' : avgScore > 45 ? '#FFD700' : '#00FF87', suffix: '/100' },
    { label: 'Critical Sectors', value: critical, color: '#FF3366', suffix: '' },
    { label: 'Elevated Risk Sectors', value: high, color: '#FFD700', suffix: '' },
    { label: 'Sectors Monitored', value: activeInds.length, color: '#00F0FF', suffix: '' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-5 lg:px-8 pt-5 relative z-10">
      {stats.map((stat, i) => (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          key={stat.label} 
          className="glass-panel rounded-xl p-5 hover:border-white/20 transition-all duration-300 group"
        >
          <div className="text-white/40 text-xs font-medium tracking-wide uppercase mb-3">{stat.label}</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-display font-bold text-3xl group-hover:scale-105 transition-transform duration-300 origin-left"
              style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}40` }}
            >
              {stat.value}<span className="text-sm font-medium ml-1" style={{ color: `${stat.color}80`, textShadow: 'none' }}>{stat.suffix}</span>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const { 
    liveData, 
    industries, 
    riskHistory, 
    recommendations, 
    isLoading, 
    lastUpdated,
    financialRisk,
    activeScenario,
    forceRefresh,
    triggerScenario,
    clearScenario
  } = useSimulation()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Overview')

  const TABS = ['Overview', 'Intelligence', 'Scenario Lab', 'Live Feed']

  return (
    <div className="flex h-screen overflow-hidden relative bg-space-900">
      {/* Subtle background particles */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen">
        <ParticleBackground />
      </div>

      {/* Sidebar */}
      <Sidebar onBack={() => navigate('/')} onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <TopBar 
          lastUpdated={lastUpdated} 
          isLoading={isLoading} 
          onBack={() => navigate('/')} 
          onOpenSettings={() => setIsSettingsOpen(true)}
          onRefresh={forceRefresh}
        />
        <SummaryRow industries={industries} />

        {/* Scrollable container for tabs and content */}
        <div className="flex-1 overflow-y-scroll px-5 lg:px-8 py-6 relative z-10 pb-24 scrollbar-custom">
          
          {/* Section Tabs */}
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-cyan/10 text-cyan border border-cyan/20 cursor-default'
                    : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {/* TAB: Overview */}
              {activeTab === 'Overview' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <IndustryRiskPanel industries={industries} />
                    <FinancialRiskPanel financialRisk={financialRisk} />
                  </div>
                  <RiskTrendChart riskHistory={riskHistory} />
                </div>
              )}

              {/* TAB: Intelligence */}
              {activeTab === 'Intelligence' && (
                <div className="max-w-4xl">
                  <RecommendationsPanel recommendations={recommendations} />
                </div>
              )}

              {/* TAB: Scenario Lab */}
              {activeTab === 'Scenario Lab' && (
                <div className="max-w-4xl">
                  <SimulationSandbox 
                    activeScenario={activeScenario}
                    triggerScenario={triggerScenario}
                    clearScenario={clearScenario}
                  />
                </div>
              )}

              {/* TAB: Live Feed */}
              {activeTab === 'Live Feed' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2 space-y-6">
                    <LiveDataPanel liveData={liveData} lastUpdated={lastUpdated} />
                  </div>
                  <div className="xl:col-span-1">
                    <ProductAlertsPanel industries={industries} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer note about API integration */}
          <div className="mt-12 p-5 rounded-xl text-center glass-panel w-full max-w-2xl mx-auto border-cyan/20 bg-cyan/5">
            <p className="text-white/40 text-xs leading-relaxed">
              📡 Niyantra is running on a <span className="text-cyan font-medium">simulated data mesh</span>.<br/>
              Swap <code className="text-cyan bg-cyan/10 px-1 rounded mx-1">src/services/dataService.js</code> mock logic with live REST APIs (e.g. OpenWeatherMap, TomTom) to process real-world data feeds.
            </p>
          </div>
        </div>
      </div>

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  )
}
