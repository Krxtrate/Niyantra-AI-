import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Line, Points, PointMaterial, Stars, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Convert Lat/Lon to 3D Vector on Sphere
function latLongToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = (radius * Math.sin(phi) * Math.sin(theta))
  const y = (radius * Math.cos(phi))
  return [x, y, z]
}

// Generate random points on a sphere for stylized particles
function generateSphereParticles(count, radius) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const u = Math.random()
    const v = Math.random()
    const theta = u * 2.0 * Math.PI
    const phi = Math.acos(2.0 * v - 1.0)
    const r = Math.cbrt(Math.random()) * radius
    const sinPhi = Math.sin(phi)
    
    positions[i * 3] = r * sinPhi * Math.cos(theta)
    positions[i * 3 + 1] = r * sinPhi * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
  return positions
}

// Draw bezier curve arcs on the globe that draw based on scroll progress
function AnimatedArc({ start, end, color, scrollProgress, triggerRange }) {
  const points = useMemo(() => {
    const v1 = new THREE.Vector3(...start)
    const v2 = new THREE.Vector3(...end)
    const length = v1.length()
    // Elevate the midpoint based on the distance between nodes; longer arc = higher peak
    const dist = v1.distanceTo(v2)
    const midHeight = length + (dist * 0.25)
    
    // Lerp vector for midpoint then push it out
    const mid = v1.clone().lerp(v2, 0.5).normalize().multiplyScalar(midHeight)
    const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2)
    return curve.getPoints(50)
  }, [start, end])

  // Calculate how much of the line should be visible based on scroll
  const visible = useMemo(() => {
    const [startP, endP] = triggerRange
    if (scrollProgress < startP) return 0
    if (scrollProgress > endP) return 1
    return (scrollProgress - startP) / (endP - startP)
  }, [scrollProgress, triggerRange])

  if (visible === 0) return null

  // Reveal points array based on visible percentage
  const visiblePoints = Math.max(2, Math.floor(points.length * visible))
  const renderPoints = points.slice(0, visiblePoints)

  return (
    <Line 
      points={renderPoints} 
      color={color} 
      lineWidth={2.5} 
      transparent 
      opacity={0.8} 
    />
  )
}

function GlobeMarker({ position, color, size = 0.035, intensity = 1.5 }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={color} />
      <pointLight color={color} intensity={intensity} distance={1.5} />
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[size * 2, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>
    </mesh>
  )
}

// High-res dark earth map
const EARTH_TEXTURE_URL = 'https://unpkg.com/three-globe/example/img/earth-dark.jpg'
const EARTH_BUMP_URL = 'https://unpkg.com/three-globe/example/img/earth-topology.png'
const EARTH_WATER_URL = 'https://unpkg.com/three-globe/example/img/earth-water.png'

export default function GlobeScene({ scrollProgress }) {
  const groupRef = useRef()
  const mouseRef = useRef({ x: 0, y: 0 })
  const R = 1.78 // approx 0.89 scale from original 2.0
  const particles = useMemo(() => generateSphereParticles(2000, R * 1.05), [R])

  const [colorMap, bumpMap, specularMap] = useTexture([EARTH_TEXTURE_URL, EARTH_BUMP_URL, EARTH_WATER_URL])

  // Coordinate tracking for deep parallax ignoring pointer-events bounds
  useEffect(() => {
    const handleMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  // City coordinates mapped to globe
  const cities = useMemo(() => ({
    NY:  latLongToVector3(40.71, -74.00, R),
    LA:  latLongToVector3(34.05, -118.24, R),
    LON: latLongToVector3(51.50, -0.12, R),
    TYO: latLongToVector3(35.67, 139.65, R),
    SG:  latLongToVector3(1.35, 103.81, R),
    SYD: latLongToVector3(-33.86, 151.20, R),
    DXB: latLongToVector3(25.20, 55.27, R),
    BER: latLongToVector3(52.52, 13.40, R),
    SP:  latLongToVector3(-23.55, -46.63, R),      // Sao Paulo
    JNB: latLongToVector3(-26.20, 28.04, R),       // Johannesburg
    MUM: latLongToVector3(19.07, 72.87, R),        // Mumbai
    SHG: latLongToVector3(31.23, 121.47, R),       // Shanghai
    SFO: latLongToVector3(37.77, -122.41, R),      // San Francisco
  }), [R])

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Base continuous spin
      groupRef.current.rotation.y += delta * 0.05
      
      // Target rotation from scroll progress
      const scrollRotY = scrollProgress * Math.PI * 1.5
      const scrollRotX = scrollProgress * Math.PI * 0.2
      
      // Calculate active parallax tilt from direct window mouse coordinates
      const targetTiltX = -mouseRef.current.y * 0.3
      const targetTiltY = mouseRef.current.x * 0.4

      // Apply combined smooth rotations
      groupRef.current.rotation.y += (scrollRotY + targetTiltY - groupRef.current.rotation.y) * 0.05
      groupRef.current.rotation.x += (scrollRotX + targetTiltX - groupRef.current.rotation.x) * 0.05
    }
  })

  // Colors
  const C_CYAN = "#00F0FF"
  const C_EMERALD = "#00FF87"
  const C_SIGNAL = "#FF3366"
  const C_YELLOW = "#FFD700"

  return (
    <>
      {/* Super dense immersive star field */}
      <Stars radius={100} depth={50} count={12000} factor={6} saturation={0} fade speed={1} />
      
      <group ref={groupRef} rotation={[0.2, -0.8, 0]}>
        {/* Main Textured Earth */}
        <Sphere args={[R, 64, 64]}>
          <meshPhongMaterial 
            map={colorMap}
            bumpMap={bumpMap}
            bumpScale={0.015}
            specularMap={specularMap}
            specular={new THREE.Color('grey')}
            shininess={10}
          />
        </Sphere>

        {/* Atmospheric rim glow layer */}
        <Sphere args={[R * 1.02, 64, 64]}>
          <meshBasicMaterial 
            color="#00F0FF" 
            transparent 
            opacity={0.06} 
            blending={THREE.AdditiveBlending} 
            side={THREE.BackSide}
          />
        </Sphere>

        {/* Particles cloud around the globe */}
        <Points positions={particles}>
          <PointMaterial transparent opacity={0.25} size={0.012} sizeAttenuation={true} color="#00F0FF" />
        </Points>

        {/* Render all Nodes */}
        {Object.entries(cities).map(([name, pos], i) => (
          <GlobeMarker key={name} position={pos} color={i % 3 === 0 ? C_EMERALD : i % 2 === 0 ? C_SIGNAL : C_CYAN} intensity={2.0} />
        ))}

        {/* Supply Routes layered by scroll progress range */}
        
        {/* Early visible routes (Fill space but still draw dynamically) */}
        <AnimatedArc start={cities.LA} end={cities.NY} color={C_YELLOW} scrollProgress={scrollProgress} triggerRange={[0.0, 0.15]} />
        <AnimatedArc start={cities.LON} end={cities.DXB} color={C_EMERALD} scrollProgress={scrollProgress} triggerRange={[0.0, 0.25]} />
        <AnimatedArc start={cities.SP} end={cities.NY} color={C_SIGNAL} scrollProgress={scrollProgress} triggerRange={[0.0, 0.3]} />
        <AnimatedArc start={cities.LON} end={cities.JNB} color={C_CYAN} scrollProgress={scrollProgress} triggerRange={[0.0, 0.2]} />
        
        {/* Phase 1 (0.0 - 0.2) */}
        <AnimatedArc start={cities.NY} end={cities.LON} color={C_CYAN} scrollProgress={scrollProgress} triggerRange={[0.0, 0.2]} />
        <AnimatedArc start={cities.SFO} end={cities.TYO} color={C_EMERALD} scrollProgress={scrollProgress} triggerRange={[0.0, 0.2]} />
        
        {/* Phase 2 (0.2 - 0.45) */}
        <AnimatedArc start={cities.LON} end={cities.BER} color={C_CYAN} scrollProgress={scrollProgress} triggerRange={[0.2, 0.45]} />
        <AnimatedArc start={cities.SP} end={cities.JNB} color={C_YELLOW} scrollProgress={scrollProgress} triggerRange={[0.2, 0.45]} />
        
        {/* Phase 3 (0.45 - 0.7) */}
        <AnimatedArc start={cities.DXB} end={cities.MUM} color={C_SIGNAL} scrollProgress={scrollProgress} triggerRange={[0.45, 0.7]} />
        <AnimatedArc start={cities.MUM} end={cities.SG} color={C_CYAN} scrollProgress={scrollProgress} triggerRange={[0.45, 0.7]} />
        <AnimatedArc start={cities.SG} end={cities.TYO} color={C_EMERALD} scrollProgress={scrollProgress} triggerRange={[0.45, 0.7]} />
        <AnimatedArc start={cities.JNB} end={cities.DXB} color={C_EMERALD} scrollProgress={scrollProgress} triggerRange={[0.45, 0.7]} />
        
        {/* Phase 4 (0.7 - 0.95) */}
        <AnimatedArc start={cities.TYO} end={cities.LA} color={C_YELLOW} scrollProgress={scrollProgress} triggerRange={[0.7, 0.95]} />
        <AnimatedArc start={cities.SG} end={cities.SYD} color={C_SIGNAL} scrollProgress={scrollProgress} triggerRange={[0.7, 0.95]} />
        <AnimatedArc start={cities.SHG} end={cities.TYO} color={C_CYAN} scrollProgress={scrollProgress} triggerRange={[0.7, 0.95]} />
        <AnimatedArc start={cities.SYD} end={cities.LA} color={C_EMERALD} scrollProgress={scrollProgress} triggerRange={[0.7, 0.95]} />

        {/* Lights */}
        <ambientLight intensity={0.4} color="#ffffff" />
        <directionalLight position={[10, 5, 5]} intensity={2.0} color="#ffffff" />
        <directionalLight position={[-10, 5, -5]} intensity={0.8} color={C_CYAN} />
        <directionalLight position={[0, -10, 0]} intensity={0.5} color={C_SIGNAL} />
      </group>
    </>
  )
}
