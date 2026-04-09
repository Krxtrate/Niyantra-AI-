import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import GlobeScene from '../components/GlobeScene'
import {
  Activity, Brain, Globe, Shield, ArrowRight, ChevronRight,
  TrendingUp, AlertTriangle, CheckCircle, BarChart2, Truck, RefreshCw
} from 'lucide-react'

// ─── Reusable Fade-in wrapper ─────────────────────────────────────────────────
function GlassPanel({ children, delay = 0, y = 30, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-panel rounded-2xl p-8 relative overflow-hidden ${className}`}
    >
      {/* Subtle top edge highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-glass-gradient-highlight opacity-50" />
      {children}
    </motion.div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onDashboard }) {
  const { scrollY } = useScroll()
  const blur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(20px)'])
  const bg = useTransform(scrollY, [0, 100], ['rgba(3,5,16,0)', 'rgba(3,5,16,0.6)'])
  const border = useTransform(scrollY, [0, 100], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.08)'])

  return (
    <motion.nav
      style={{ backdropFilter: blur, backgroundColor: bg, borderBottomColor: border }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-5 transition-all duration-300 border-b border-transparent"
    >
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300" 
          style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(0,255,135,0.05))', border: '1px solid rgba(0,240,255,0.3)' }}>
          <Activity size={18} className="text-cyan" />
        </div>
        <span className="font-display font-bold text-white text-xl tracking-tight">NIYANTRA</span>
      </div>
      
      <div className="hidden md:flex items-center gap-10">
        {['Platform', 'Intelligence', 'Preview'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`}
            className="text-sm font-medium text-white/50 hover:text-white transition-colors duration-200">
            {item}
          </a>
        ))}
      </div>
      
      <button
        onClick={onDashboard}
        className="glass-button flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-glass-glow group"
      >
        <span>Access Platform</span>
        <ChevronRight size={14} className="text-cyan group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.nav>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({ onDashboard }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 z-10 w-full">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, ease: 'easeOut' }}
           className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10"
           style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)' }}
        >
          <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
          <span className="text-xs font-semibold text-cyan tracking-[0.2em] uppercase">Global Risk Intelligence</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
          className="font-display tracking-tight mb-8 leading-[1.1]"
        >
          <span className="block text-6xl md:text-8xl lg:text-[10rem] font-black text-white tracking-[0.05em] uppercase mb-6" style={{ textShadow: '0 0 60px rgba(255,255,255,0.15)' }}>
            NIYANTRA
          </span>
          <span className="block text-2xl lg:text-4xl text-white/50 font-light tracking-wide">
            Anticipate <span className="text-gradient-cyan font-medium">Disruption.</span> Secure your <span className="text-gradient-emerald font-medium">Supply.</span>
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="text-lg md:text-xl text-white/50 max-w-2xl font-light mb-12 leading-relaxed"
        >
          Niyantra transforms chaotic global signals — weather, traffic, and geopolitics — into actionable foresight.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center gap-5"
        >
          <button
            onClick={onDashboard}
            className="flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-space-900 text-base transition-all duration-300 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #00F0FF, #00FF87)', boxShadow: '0 0 30px rgba(0,240,255,0.4)' }}
          >
            Launch Interactive Dashboard
            <ArrowRight size={18} />
          </button>
          <a
            href="#platform"
            className="glass-button flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-white/80 text-base transition-all duration-300 hover:bg-white/5"
          >
            Explore Platform
          </a>
        </motion.div>
      </div>

    </section>
  )
}

// ─── Features/Platform Section ────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <Activity size={24} />,
    title: 'Live Telemetry',
    desc: 'Aggregates extreme weather vectors, port congestions, and political sentiment every 4 seconds into a unified operational mesh.',
    color: '#00F0FF',
  },
  {
    icon: <Brain size={24} />,
    title: 'Cognitive Scoring',
    desc: 'Proprietary models weigh localized factors against broad historical baselines, converting noise into distinct 0-100 risk scores.',
    color: '#00FF87',
  },
  {
    icon: <Shield size={24} />,
    title: 'Actionable Playbooks',
    desc: 'When metrics breach thresholds, Niyantra generates precise mitigation strategies — reroute, stockpile, or pause — instantly.',
    color: '#FF3366',
  },
]

function PlatformSection() {
  return (
    <section id="platform" className="relative min-h-[140vh] py-32 px-6 flex items-center z-10 w-full pointer-events-none">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pointer-events-auto">
        <div className="flex flex-col">
          <GlassPanel className="p-10 lg:p-12">
            <h2 className="font-display font-medium text-3xl md:text-5xl text-white mb-6 leading-tight">
              A nervous system for <br />
              <span className="text-gradient-cyan font-bold block mt-2">global logistics.</span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed max-w-lg mb-8">
              We replace static reports with a living data environment. Niyantra fuses macro and micro indicators into a single, cohesive situational awareness tool.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="font-display font-bold text-3xl text-white">4s</span>
                <span className="text-xs text-white/40 uppercase tracking-widest mt-1">Refresh Rate</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="font-display font-bold text-3xl text-emerald">99%</span>
                <span className="text-xs text-emerald/60 uppercase tracking-widest mt-1">Fault Accuracy</span>
              </div>
            </div>
          </GlassPanel>
        </div>
        
        <div className="flex flex-col gap-6">
          {FEATURES.map((f, i) => (
            <GlassPanel key={f.title} delay={i * 0.15} className="!p-6 flex items-start gap-5 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center relative overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {f.icon}
                <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle, ${f.color} 0%, transparent 70%)` }} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Demo Section ─────────────────────────────────────────────────────────────
function DemoSection({ onDashboard }) {
  return (
    <section id="preview" className="relative h-screen py-32 px-6 flex items-center justify-center z-10 w-full pointer-events-none mt-32">
      <div className="max-w-5xl mx-auto w-full text-center pointer-events-auto mt-auto">
        <GlassPanel className="p-12 lg:p-20 relative overflow-hidden group">
          {/* Internal massive glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20 mix-blend-screen transition-opacity group-hover:opacity-40 duration-700"
            style={{ background: 'radial-gradient(circle, #00F0FF 0%, transparent 60%)' }} />
            
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Stop Reacting. <br />
              <span className="text-gradient-emerald block mt-2">Start Predicting.</span>
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto mb-12">
              Step into the control room. Experience the full capabilities of Niyantra’s predictive risk models hooked up to an active simulation mesh.
            </p>
            
            <button
              onClick={onDashboard}
              className="group flex items-center gap-4 px-10 py-5 rounded-2xl font-semibold text-space-900 text-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #00F0FF, #00FF87)', boxShadow: '0 0 40px rgba(0,240,255,0.3), inset 0 2px 0 rgba(255,255,255,0.4)' }}
            >
              Enter the Dashboard
              <div className="w-8 h-8 rounded-full bg-space-900/10 flex items-center justify-center group-hover:translate-x-2 transition-transform duration-300">
                <ArrowRight size={18} />
              </div>
            </button>
          </div>
        </GlassPanel>
        
        <footer className="mt-20 text-center flex flex-col items-center gap-4">
           <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg flex items-center justify-center" 
              style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(0,255,135,0.05))', border: '1px solid rgba(0,240,255,0.3)' }}>
              <Activity size={10} className="text-cyan" />
            </div>
            <span className="font-display font-bold text-white/30 text-sm tracking-widest">NIYANTRA</span>
          </div>
          <p className="text-white/20 text-xs">A modern UX overhaul • Glassmorphism + Three.js</p>
        </footer>
      </div>
    </section>
  )
}

// ─── Workflow / API Section ───────────────────────────────────────────────────
function WorkflowSection() {
  return (
    <section className="relative py-32 px-6 flex items-center justify-center z-10 w-full pointer-events-none">
      <div className="max-w-6xl mx-auto w-full pointer-events-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">How Niyantra Works</h2>
          <p className="text-white/50 text-base max-w-2xl mx-auto">Live Data Ingestion &rarr; Cognitive Processing &rarr; Predictive UI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector lines behind cards */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-px bg-gradient-to-r from-cyan/0 via-cyan/40 to-emerald/0 -translate-y-1/2 -z-10" />

          {/* Step 1 */}
          <GlassPanel className="p-8 text-center bg-space-800/80">
            <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.2)', color: '#00F0FF' }}>
              <RefreshCw size={24} />
            </div>
            <h3 className="font-display font-semibold text-white text-xl mb-3">1. Data Ingestion</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Pulls live vectors from global APIs (OpenWeather, TomTom Traffic, GNews) every few seconds to build a real-time mesh.
            </p>
            <div className="text-xs font-mono text-cyan/70 bg-cyan/5 py-1 px-3 rounded-md inline-block">GET /api/v1/telemetry</div>
          </GlassPanel>

          {/* Step 2 */}
          <GlassPanel className="p-8 text-center bg-space-800/80" delay={0.2}>
            <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.2)', color: '#FF3366' }}>
              <Brain size={24} />
            </div>
            <h3 className="font-display font-semibold text-white text-xl mb-3">2. Risk Engine AI</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Scrutinizes overlapping anomalies. E.g., heavy rain + port congestion = critical tier disruption alert for electronics.
            </p>
            <div className="text-xs font-mono text-signal/70 bg-signal/5 py-1 px-3 rounded-md inline-block">POST /engine/simulate</div>
          </GlassPanel>

          {/* Step 3 */}
          <GlassPanel className="p-8 text-center bg-space-800/80" delay={0.4}>
            <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.2)', color: '#00FF87' }}>
              <BarChart2 size={24} />
            </div>
            <h3 className="font-display font-semibold text-white text-xl mb-3">3. Dashboard</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Translates scores into visual glassmorphism dashboards. Managers instantly deploy suggested playbooks.
            </p>
            <div className="text-xs font-mono text-emerald/70 bg-emerald/5 py-1 px-3 rounded-md inline-block">WSS://niyantra.stream</div>
          </GlassPanel>
        </div>

      </div>
    </section>
  )
}

// ─── Scroll-Bound Globe Component wrapper ─────────────────────────────────────
function ScrollBoundGlobe({ scrollProgress }) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    return scrollProgress.on('change', (v) => {
      setScrollY(v)
    })
  }, [scrollProgress])

  return <GlobeScene scrollProgress={scrollY} />
}

// ─── Landing Page (composed) ──────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  const go = () => navigate('/dashboard')
  const { scrollYProgress } = useScroll()

  // Animate the globe background opacity down as we reach the very bottom (optional effect)
  const bgOpacity = useTransform(scrollYProgress, [0.85, 1], [0.8, 0.4])

  return (
    <div className="relative min-h-[250vh] bg-space-900">
      
      {/* 3D Background - Fixed */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ opacity: bgOpacity }}
      >
        {/* Deep space radial fade behind globe */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#030510_75%)] z-10 pointer-events-none mix-blend-multiply" />
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ScrollBoundGlobe scrollProgress={scrollYProgress} />
        </Canvas>
      </motion.div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col">
        <Navbar onDashboard={go} />
        <HeroSection onDashboard={go} />
        <PlatformSection />
        <DemoSection onDashboard={go} />
        <WorkflowSection />
      </div>
      
    </div>
  )
}
