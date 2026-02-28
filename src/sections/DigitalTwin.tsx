import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useCampusStore } from '@/store/campusStore';
import { Play, Pause, RotateCcw, Eye, EyeOff, Info } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Particle System Component
function ParticleSystem({
  count,
  color,
  enabled,
  path,
  speed,
}: {
  count: number;
  color: string;
  enabled: boolean;
  path: THREE.Vector3[];
  speed: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      progress: i / count,
      offset: Math.random() * 0.1,
    }));
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(path), [path]);

  useFrame((_, delta) => {
    if (!meshRef.current || !enabled) return;

    particles.forEach((particle, i) => {
      particle.progress += delta * speed * 0.1;
      if (particle.progress > 1) particle.progress = 0;

      const position = curve.getPoint(particle.progress);
      dummy.position.copy(position);
      dummy.scale.setScalar(0.3 + Math.sin(particle.progress * Math.PI) * 0.2);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!enabled) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.15, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </instancedMesh>
  );
}

// Building Component
function Building({
  position,
  size,
  color,
  label,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  label: string;
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.2} />
      </mesh>
      <Text
        position={[0, size[1] / 2 + 0.5, 0]}
        fontSize={0.3}
        color="#A9B3C2"
        anchorX="center"
        anchorY="bottom"
      >
        {label}
      </Text>
    </group>
  );
}

// Campus Scene
function CampusScene({
  flowLayers,
  simulationSpeed,
}: {
  flowLayers: { id: string; enabled: boolean; color: string; particleCount: number }[];
  simulationSpeed: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  // Define paths for particle systems
  const wastePath = useMemo(
    () => [
      new THREE.Vector3(-8, 0.5, -6),
      new THREE.Vector3(-4, 0.5, -4),
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(4, 0.5, 4),
      new THREE.Vector3(8, 0.5, 6),
    ],
    []
  );

  const waterPath = useMemo(
    () => [
      new THREE.Vector3(8, 0.5, -6),
      new THREE.Vector3(4, 0.5, -3),
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(-4, 0.5, 3),
      new THREE.Vector3(-8, 0.5, 6),
    ],
    []
  );

  const energyPath = useMemo(
    () => [
      new THREE.Vector3(-6, 0.5, 6),
      new THREE.Vector3(-3, 0.5, 3),
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(3, 0.5, -3),
      new THREE.Vector3(6, 0.5, -6),
    ],
    []
  );

  const wasteLayer = flowLayers.find(l => l.id === 'waste');
  const waterLayer = flowLayers.find(l => l.id === 'water');
  const energyLayer = flowLayers.find(l => l.id === 'energy');

  return (
    <group ref={groupRef}>
      {/* Grid Floor */}
      <Grid
        position={[0, 0, 0]}
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#2A3449"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#00F0FF"
        fadeDistance={25}
        fadeStrength={1}
        infiniteGrid
      />

      {/* Buildings */}
      <Building position={[-6, 1, -4]} size={[2, 2, 2]} color="#232D42" label="Hostel A" />
      <Building position={[-2, 1.5, -5]} size={[2.5, 3, 2.5]} color="#232D42" label="Hostel B" />
      <Building position={[2, 1, -4]} size={[2, 2, 2]} color="#232D42" label="Hostel C" />
      <Building position={[6, 1.2, -3]} size={[2, 2.4, 2]} color="#232D42" label="Hostel D" />
      <Building position={[-5, 0.8, 2]} size={[3, 1.6, 2]} color="#1A2233" label="Canteen" />
      <Building position={[0, 1.5, 0]} size={[3, 3, 3]} color="#1A2233" label="Main Block" />
      <Building position={[5, 1, 3]} size={[2.5, 2, 2]} color="#1A2233" label="Library" />
      <Building position={[-3, 0.6, 5]} size={[2, 1.2, 2]} color="#232D42" label="STP" />

      {/* Particle Systems */}
      {wasteLayer && (
        <ParticleSystem
          count={wasteLayer.particleCount}
          color={wasteLayer.color}
          enabled={wasteLayer.enabled}
          path={wastePath}
          speed={simulationSpeed}
        />
      )}
      {waterLayer && (
        <ParticleSystem
          count={waterLayer.particleCount}
          color={waterLayer.color}
          enabled={waterLayer.enabled}
          path={waterPath}
          speed={simulationSpeed}
        />
      )}
      {energyLayer && (
        <ParticleSystem
          count={energyLayer.particleCount}
          color={energyLayer.color}
          enabled={energyLayer.enabled}
          path={energyPath}
          speed={simulationSpeed}
        />
      )}

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00F0FF" />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#27C59A" />
    </group>
  );
}

export function DigitalTwin() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { flowLayers, toggleFlowLayer, simulationTime, setSimulationTime, isSimulationPlaying, setSimulationPlaying, simulationSpeed, setSimulationSpeed } = useCampusStore();
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.querySelector('.canvas-container'),
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        content.querySelector('.control-panel'),
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // Simulation time update
  useEffect(() => {
    if (!isSimulationPlaying) return;
    
    const interval = setInterval(() => {
      setSimulationTime((simulationTime + 0.1 * simulationSpeed) % 24);
    }, 100);

    return () => clearInterval(interval);
  }, [isSimulationPlaying, simulationTime, simulationSpeed, setSimulationTime]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = Math.floor((time - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <section
      id="twin"
      ref={sectionRef}
      className="min-h-screen py-20 px-4 md:px-6 lg:pl-28"
    >
      <div ref={contentRef} className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="section-title mb-3">Resource Flow Digital Twin</h2>
          <p className="text-[#A9B3C2] text-sm md:text-base max-w-xl">
            Abstract 3D campus model showing waste streams and water cycles as live particle systems
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 3D Canvas */}
          <div className="canvas-container lg:col-span-3 glass-panel rounded-2xl overflow-hidden" style={{ height: '500px' }}>
            <Canvas
              camera={{ position: [12, 10, 12], fov: 50 }}
              style={{ background: '#0B0F17' }}
            >
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={25}
              />
              <CampusScene
                flowLayers={flowLayers}
                simulationSpeed={simulationSpeed}
              />
            </Canvas>

            {/* Time Overlay */}
            <div className="absolute bottom-4 left-4 px-4 py-2 bg-[#1A2233]/90 backdrop-blur rounded-lg border border-[#2A3449]">
              <div className="text-xs mono text-[#A9B3C2]">SIMULATION TIME</div>
              <div className="text-2xl font-bold text-[#00F0FF]">{formatTime(simulationTime)}</div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="control-panel glass-panel rounded-xl p-5">
            <h3 className="font-semibold text-[#F2F5F9] mb-4">Flow Controls</h3>
            
            {/* Layer Toggles */}
            <div className="space-y-3 mb-6">
              {flowLayers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => toggleFlowLayer(layer.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                    layer.enabled
                      ? 'bg-[#1A2233] border-[#00F0FF]/50'
                      : 'bg-[#111827] border-[#2A3449] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span className="text-sm text-[#F2F5F9]">{layer.name}</span>
                  </div>
                  {layer.enabled ? (
                    <Eye className="w-4 h-4 text-[#00F0FF]" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-[#A9B3C2]" />
                  )}
                </button>
              ))}
            </div>

            {/* Playback Controls */}
            <div className="mb-6">
              <div className="text-xs mono text-[#A9B3C2] mb-2">PLAYBACK</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSimulationPlaying(!isSimulationPlaying)}
                  className="flex-1 flex items-center justify-center gap-2 p-3 bg-[#00F0FF]/10 border border-[#00F0FF]/30 rounded-lg text-[#00F0FF] hover:bg-[#00F0FF]/20 transition-colors"
                >
                  {isSimulationPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span className="text-sm">Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span className="text-sm">Play</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSimulationTime(12)}
                  className="p-3 bg-[#1A2233] border border-[#2A3449] rounded-lg text-[#A9B3C2] hover:text-[#F2F5F9] transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Speed Control */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs mono text-[#A9B3C2]">SPEED</span>
                <span className="text-xs text-[#00F0FF]">{simulationSpeed}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                className="w-full h-2 bg-[#2A3449] rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-[#A9B3C2]">1x</span>
                <span className="text-[10px] text-[#A9B3C2]">10x</span>
              </div>
            </div>

            {/* Labels Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#111827] rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#A9B3C2]" />
                <span className="text-sm text-[#F2F5F9]">Show Labels</span>
              </div>
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`w-10 h-5 rounded-full transition-colors ${
                  showLabels ? 'bg-[#00F0FF]' : 'bg-[#2A3449]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    showLabels ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Stats */}
            <div className="mt-6 pt-4 border-t border-[#2A3449]">
              <div className="text-xs mono text-[#A9B3C2] mb-2">ACTIVE PARTICLES</div>
              <div className="text-2xl font-bold text-[#F2F5F9]">
                {flowLayers.filter(l => l.enabled).reduce((acc, l) => acc + l.particleCount, 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Educational Mode Info */}
        <div className="mt-6 glass-panel rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#00F0FF] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-[#F2F5F9] mb-1">Educational Mode</h4>
              <p className="text-sm text-[#A9B3C2]">
                This digital twin visualizes resource flows across campus. 
                <span className="text-[#00F0FF]"> Cyan particles</span> represent waste streams from bins to processing facilities, 
                <span className="text-[#27C59A]"> green particles</span> show water recycling through the STP, and 
                <span className="text-[#F59E0B]"> amber particles</span> indicate energy distribution. 
                Use the controls to explore different flow patterns and time-of-day variations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
