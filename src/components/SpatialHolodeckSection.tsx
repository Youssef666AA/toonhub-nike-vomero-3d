import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Rotate3D,
  Layers,
  Crosshair,
  Sun,
  Activity,
  Compass,
  ArrowRight,
  Zap,
  Gauge,
  Sliders,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { CurrencyCode, CURRENCIES } from '../types/store';
import { sound } from '../utils/sound';

interface SpatialHolodeckSectionProps {
  currency: CurrencyCode;
  onAddToCart: (title: string, colorway: string, price: number, src: string) => void;
}

type ModeType = 'orbit' | 'exploded' | 'scan' | 'lighting';
type LightingTheme = 'neon' | 'cyber' | 'solar' | 'titanium';

interface CameraPreset {
  id: string;
  name: string;
  degrees: string;
  frame: number;
  highlight: string;
}

const TOTAL_FRAMES = 48;
const START_FRAME_INDEX = 5780;

const CAMERA_PRESETS: CameraPreset[] = [
  { id: 'p1', name: '45° HERO ANGLE', degrees: '045°', frame: 4, highlight: 'Aerodynamic Monomesh Silhouette' },
  { id: 'p2', name: '90° LATERAL CAGE', degrees: '090°', frame: 12, highlight: 'Laser-Cut TPU Ribbed Lattice' },
  { id: 'p3', name: '180° REAR HEEL COUNTER', degrees: '180°', frame: 24, highlight: 'Architectural Lockdown Cup' },
  { id: 'p4', name: '270° MEDIAL ARCH', degrees: '270°', frame: 36, highlight: 'Dynamic Cushlon Compression' },
  { id: 'p5', name: '360° OUTSOLE MATRIX', degrees: '360°', frame: 44, highlight: 'BRS 1000 Carbon Waffle Lug' },
];

const LIGHTING_CONFIGS: Record<
  LightingTheme,
  {
    name: string;
    accent: string;
    glow: string;
    gradient: string;
    shadow: string;
    filter: string;
  }
> = {
  neon: {
    name: 'NEON VOLT MATRIX',
    accent: '#D4FF00',
    glow: 'rgba(212, 255, 0, 0.28)',
    gradient: 'from-lime-500/20 via-emerald-950/30 to-black',
    shadow: '0 30px 60px rgba(212, 255, 0, 0.15)',
    filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.7))',
  },
  cyber: {
    name: 'CYBERPUNK SHIBUYA',
    accent: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.32)',
    gradient: 'from-cyan-500/20 via-blue-950/30 to-black',
    shadow: '0 30px 60px rgba(0, 240, 255, 0.2)',
    filter: 'hue-rotate(25deg) drop-shadow(0 20px 35px rgba(0,0,0,0.7))',
  },
  solar: {
    name: 'SOLAR INFRARED',
    accent: '#FF5500',
    glow: 'rgba(255, 85, 0, 0.32)',
    gradient: 'from-orange-600/20 via-amber-950/30 to-black',
    shadow: '0 30px 60px rgba(255, 85, 0, 0.2)',
    filter: 'hue-rotate(320deg) drop-shadow(0 20px 35px rgba(0,0,0,0.7))',
  },
  titanium: {
    name: 'TITANIUM CLEAN ROOM',
    accent: '#E5E7EB',
    glow: 'rgba(255, 255, 255, 0.2)',
    gradient: 'from-white/15 via-zinc-900/30 to-black',
    shadow: '0 30px 60px rgba(255, 255, 255, 0.1)',
    filter: 'contrast(1.08) drop-shadow(0 20px 35px rgba(0,0,0,0.7))',
  },
};

export default function SpatialHolodeckSection({
  currency,
  onAddToCart,
}: SpatialHolodeckSectionProps) {
  // Primary Modes: orbit, exploded, scan, lighting
  const [activeMode, setActiveMode] = useState<ModeType>('orbit');

  // Turntable state
  const [currentFrame, setCurrentFrame] = useState<number>(4);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragStartFrame, setDragStartFrame] = useState<number>(0);
  const [velocity, setVelocity] = useState<number>(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(false);
  const [orbitSpeed, setOrbitSpeed] = useState<'cinematic' | 'turbo'>('cinematic');

  // Exploded view state
  const [explosionDepth, setExplosionDepth] = useState<number>(65); // 0 to 100%
  const [activeLayerIndex, setActiveLayerIndex] = useState<number | null>(null);

  // Lighting theme state
  const [lightingTheme, setLightingTheme] = useState<LightingTheme>('neon');

  // Mouse Gyroscope Parallax
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Scan HUD state
  const [scanPulse, setScanPulse] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTickTime = useRef<number>(0);

  const currInfo = CURRENCIES[currency];
  const formatPrice = (usd: number) => `${currInfo.symbol}${Math.round(usd * currInfo.rate)}`;

  // Generate 48 high-res 360-degree rotation frame paths
  const framePaths = useMemo(() => {
    return Array.from({ length: TOTAL_FRAMES }, (_, i) => {
      return `/shoes/test_${START_FRAME_INDEX + i}.png`;
    });
  }, []);

  // Preload frames for butter-smooth 60fps rotation
  useEffect(() => {
    framePaths.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [framePaths]);

  // Inertial momentum animation loop
  useEffect(() => {
    const loop = () => {
      if (!isDragging && Math.abs(velocity) > 0.05) {
        setCurrentFrame((prev) => {
          const next = (prev - velocity + TOTAL_FRAMES * 100) % TOTAL_FRAMES;
          const roundedNext = Math.round(next);
          // Play micro mechanical tick on frame change
          const now = Date.now();
          if (now - lastTickTime.current > 60) {
            sound.playTick();
            lastTickTime.current = now;
          }
          return roundedNext;
        });
        setVelocity((prev) => prev * 0.92); // damping friction
      }

      // Auto-orbit loop
      if (isAutoSpinning && !isDragging) {
        const speed = orbitSpeed === 'cinematic' ? 0.35 : 0.85;
        setCurrentFrame((prev) => {
          const next = (prev + speed) % TOTAL_FRAMES;
          return Math.round(next);
        });
      }

      // Scanner pulse
      if (activeMode === 'scan') {
        setScanPulse((prev) => (prev + 1) % 100);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDragging, velocity, isAutoSpinning, orbitSpeed, activeMode]);

  // Drag interaction handlers
  const handleDragStart = (clientX: number) => {
    setIsAutoSpinning(false);
    setIsDragging(true);
    setDragStartX(clientX);
    setDragStartFrame(currentFrame);
    setVelocity(0);
    sound.playClick();
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartX;
    const sensitivity = 0.22;
    const frameShift = deltaX * sensitivity;
    const newFrame = (dragStartFrame - frameShift + TOTAL_FRAMES * 100) % TOTAL_FRAMES;
    setCurrentFrame(Math.round(newFrame));

    // Calculate instantaneous velocity for inertia
    setVelocity(frameShift * 0.15);
  };

  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Mouse tilt tracking for 3D gyro parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMouseTilt({ x, y });
  };

  // Jump to specific camera preset
  const handleSelectPreset = (preset: CameraPreset) => {
    sound.playSwoosh();
    setIsAutoSpinning(false);
    setVelocity(0);
    setCurrentFrame(preset.frame);
  };

  // Switch primary mode
  const handleModeSwitch = (mode: ModeType) => {
    if (mode === activeMode) return;
    if (mode === 'exploded') {
      sound.playMechanical();
    } else if (mode === 'scan') {
      sound.playLaser();
    } else {
      sound.playClick();
    }
    setActiveMode(mode);
  };

  const currentDegrees = Math.round((currentFrame / TOTAL_FRAMES) * 360);
  const currentTheme = LIGHTING_CONFIGS[lightingTheme];

  // Exploded anatomy layer descriptions
  const explodedLayers = [
    {
      id: 'upper',
      name: '01 // ENGINEERED MONOMESH UPPER',
      desc: 'Variable gauge micro-knit jacquard with 3M Scotchlite reflective heel collar',
      weight: '62g',
      tech: 'CFM Air Permeability',
      src: '/views/view_1.png',
      yOffset: -explosionDepth * 1.5,
      zOffset: explosionDepth * 1.8,
      rotation: -8,
      opacity: 1,
    },
    {
      id: 'cage',
      name: '02 // 3D LASER-CUT TPU MIDFOOT MATRIX',
      desc: 'Parametrically modeled lateral ribs with integrated lacing anchors',
      weight: '28g',
      tech: 'Torsional Rigidity 9.8/10',
      src: '/views/view_2.png',
      yOffset: -explosionDepth * 0.45,
      zOffset: explosionDepth * 0.7,
      rotation: -3,
      opacity: 0.95,
    },
    {
      id: 'core',
      name: '03 // DUAL-CHAMBER ZOOM AIR & CUSHLON CORE',
      desc: 'Decoupled tensile nitrogen air pods pressurized at 20 PSI',
      weight: '110g',
      tech: '85.4% Kinetic Rebound',
      src: '/views/view_1.png',
      yOffset: explosionDepth * 0.45,
      zOffset: -explosionDepth * 0.5,
      rotation: 4,
      opacity: 0.9,
    },
    {
      id: 'outsole',
      name: '04 // BRS 1000 CARBON WAFFLE OUTSOLE',
      desc: 'Segmented crash pad geometry with multi-directional asphalt traction lugs',
      weight: '86g',
      tech: '0.94 μ Friction Index',
      src: '/views/view_3.png',
      yOffset: explosionDepth * 1.45,
      zOffset: -explosionDepth * 1.6,
      rotation: 9,
      opacity: 1,
    },
  ];

  return (
    <section
      id="spatial-lab"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[920px] lg:min-h-[1000px] bg-[#050507] text-white border-t border-b border-white/10 select-none overflow-hidden py-16 sm:py-24"
      style={{
        perspective: '1400px',
      }}
    >
      {/* Invisible anchor target for backwards compatibility with #split links */}
      <span id="split" className="absolute -top-24 left-0 pointer-events-none" />

      {/* Cyber Horizon & Dynamic Volumetric Studio Ambient Background */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700 opacity-60"
        style={{
          background: `radial-gradient(ellipse at 50% 45%, ${currentTheme.glow} 0%, transparent 68%), linear-gradient(to bottom, #040406 0%, #08080c 50%, #030305 100%)`,
        }}
      />

      {/* 3D Wireframe Plane Floor Grid */}
      <div
        className="absolute inset-x-0 bottom-0 h-[380px] pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          transform: 'rotateX(75deg) translateY(120px)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E\")",
          backgroundSize: '160px 160px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 z-20">
        {/* =========================================================
            HEADER: PORTFOLIO SHOWCASE BADGE & TITLES
           ========================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 backdrop-blur-xl mb-3">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-lime-400">
                PORTFOLIO 3D SHOWCASE // SPATIAL HOLODECK
              </span>
              <span className="text-white/40">•</span>
              <span className="text-[10px] font-mono text-white/70">60 FPS CAD ENGINE</span>
            </div>

            <h2
              className="text-4xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-none"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              KINETIC 3D EXPERIENCE
            </h2>
          </div>

          {/* Telemetry Chips */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/15 backdrop-blur-md flex items-center gap-2">
              <Activity size={13} className="text-lime-400" />
              <span className="text-white/60">FPS:</span>
              <span className="font-bold text-white">60.0</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/15 backdrop-blur-md flex items-center gap-2">
              <Compass size={13} className="text-lime-400" />
              <span className="text-white/60">AZIMUTH:</span>
              <span className="font-bold text-lime-300 font-mono">{currentDegrees}°</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/15 backdrop-blur-md flex items-center gap-2">
              <Gauge size={13} className="text-lime-400" />
              <span className="text-white/60">PHASE:</span>
              <span className="font-bold text-white">
                {String(currentFrame + 1).padStart(2, '0')}/48
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================
            PRIMARY 4-MODE INTERACTION SWITCHER BAR
           ========================================================= */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-black/70 border border-white/15 backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Mode 1: 360 Spatial Orbit */}
            <button
              type="button"
              onClick={() => handleModeSwitch('orbit')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeMode === 'orbit'
                  ? 'bg-white text-black shadow-lg scale-100'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Rotate3D size={15} />
              <span>360° SPATIAL ORBIT</span>
            </button>

            {/* Mode 2: 3D Exploded Anatomy */}
            <button
              type="button"
              onClick={() => handleModeSwitch('exploded')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeMode === 'exploded'
                  ? 'bg-lime-400 text-black shadow-lg scale-100'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers size={15} />
              <span>3D EXPLODED ANATOMY</span>
            </button>

            {/* Mode 3: Cyber Holographic Scan */}
            <button
              type="button"
              onClick={() => handleModeSwitch('scan')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeMode === 'scan'
                  ? 'bg-cyan-400 text-black shadow-lg scale-100'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Crosshair size={15} />
              <span>HOLO LASER SCAN</span>
            </button>

            {/* Mode 4: Studio Lighting Rig */}
            <button
              type="button"
              onClick={() => handleModeSwitch('lighting')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeMode === 'lighting'
                  ? 'bg-orange-400 text-black shadow-lg scale-100'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sun size={15} />
              <span>LIGHTING MATRIX</span>
            </button>
          </div>

          {/* Sound / Interactive helper badge */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-white/50 pr-3">
            <Volume2 size={13} className="text-lime-400" />
            <span>INTERACTIVE AUDIO SYNTHESIS ACTIVE</span>
          </div>
        </div>

        {/* =========================================================
            MAIN 3D CANVAS & INTERACTIVE STAGE
           ========================================================= */}
        <div className="relative mt-8 rounded-3xl bg-gradient-to-b from-[#0e0e13] via-[#09090c] to-[#040406] border border-white/15 p-6 sm:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden min-h-[580px] sm:min-h-[640px] flex flex-col justify-between">
          {/* Radial Studio Keylight based on active theme */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-30"
            style={{ backgroundColor: currentTheme.accent }}
          />

          {/* Giant Floating Ghost 3D Typography */}
          <div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none select-none uppercase transition-transform duration-150 ease-out"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(80px, 20vw, 260px)',
              color: '#ffffff',
              opacity: 0.04,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              transform: `translate(${mouseTilt.x * -0.5}px, ${mouseTilt.y * -0.5}px) rotateY(${
                mouseTilt.x * 0.2
              }deg)`,
              whiteSpace: 'nowrap',
            }}
          >
            {activeMode === 'exploded'
              ? 'ANATOMY'
              : activeMode === 'scan'
              ? 'SCAN CAD'
              : activeMode === 'lighting'
              ? 'STUDIO'
              : 'ORBIT 360'}
          </div>

          {/* TOP CONTROLS OVERLAY ON CANVAS */}
          <div className="relative z-30 flex items-center justify-between gap-4">
            {/* Left: Mode specific contextual sub-controls */}
            {activeMode === 'orbit' && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsAutoSpinning(!isAutoSpinning);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-all cursor-pointer border ${
                    isAutoSpinning
                      ? 'bg-lime-400 text-black border-lime-400 shadow-md'
                      : 'bg-white/5 border-white/15 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <Activity size={12} className={isAutoSpinning ? 'animate-spin' : ''} />
                  <span>{isAutoSpinning ? 'PAUSE ORBIT' : 'AUTO ORBIT'}</span>
                </button>

                {isAutoSpinning && (
                  <div className="flex items-center p-0.5 rounded-full bg-white/5 border border-white/15 text-[10px] font-mono font-bold">
                    <button
                      type="button"
                      onClick={() => setOrbitSpeed('cinematic')}
                      className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                        orbitSpeed === 'cinematic' ? 'bg-white text-black' : 'text-white/60'
                      }`}
                    >
                      CINEMATIC
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrbitSpeed('turbo')}
                      className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                        orbitSpeed === 'turbo' ? 'bg-white text-black' : 'text-white/60'
                      }`}
                    >
                      TURBO 60FPS
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeMode === 'exploded' && (
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/75 border border-white/15 backdrop-blur-xl">
                <Sliders size={14} className="text-lime-400" />
                <span className="text-xs font-mono text-white/80 uppercase">EXPLOSION DEPTH:</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={explosionDepth}
                  onChange={(e) => {
                    sound.playTick();
                    setExplosionDepth(Number(e.target.value));
                  }}
                  className="w-32 sm:w-44 h-1.5 rounded-lg bg-white/20 accent-lime-400 cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-lime-400 min-w-8">
                  {explosionDepth}%
                </span>
              </div>
            )}

            {activeMode === 'lighting' && (
              <div className="flex items-center gap-2 p-1 rounded-2xl bg-black/75 border border-white/15 backdrop-blur-xl">
                {(Object.keys(LIGHTING_CONFIGS) as LightingTheme[]).map((theme) => {
                  const cfg = LIGHTING_CONFIGS[theme];
                  const isSel = lightingTheme === theme;
                  return (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setLightingTheme(theme);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer border ${
                        isSel
                          ? 'bg-white text-black border-white shadow-md'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cfg.accent }}
                      />
                      <span>{theme}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {activeMode === 'scan' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-400/15 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>ACTIVE LASER TELEMETRY SCAN // 48-POINT MESH</span>
              </div>
            )}

            {/* Right: Drag Instruction Cue */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-white/50">
              <span>DRAG HORIZONTALLY TO SCRUB 360°</span>
            </div>
          </div>

          {/* =========================================================
              CENTER VISUAL VIEWPORT (DYNAMIC 3D SCENE)
             ========================================================= */}
          <div
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
            className={`relative my-8 w-full max-w-[680px] mx-auto aspect-square max-h-[460px] sm:max-h-[520px] flex items-center justify-center select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${mouseTilt.x * 0.4}deg) rotateX(${-mouseTilt.y * 0.4}deg)`,
              transition: isDragging ? 'none' : 'transform 200ms ease-out',
            }}
          >
            {/* MODE 1, 3, 4: PHOTO-REALISTIC 360° TURNTABLE SCENE */}
            {activeMode !== 'exploded' && (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={framePaths[currentFrame]}
                  alt="Nike Zoom Vomero 5 360 Rotation"
                  draggable={false}
                  className="w-full h-full object-contain pointer-events-none transition-all duration-75 select-none"
                  style={{
                    filter: currentTheme.filter,
                  }}
                />

                {/* MODE 3: CYBER LASER SCAN OVERLAY */}
                {activeMode === 'scan' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    {/* Vertical Sweeping Laser Beam */}
                    <div
                      className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#00F0FF] transition-all duration-75"
                      style={{
                        top: `${scanPulse}%`,
                      }}
                    />

                    {/* Cyber Grid Lines Overlay */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          'linear-gradient(to right, #00F0FF 1px, transparent 1px), linear-gradient(to bottom, #00F0FF 1px, transparent 1px)',
                        backgroundSize: '36px 36px',
                      }}
                    />

                    {/* Laser Targeting Hotspots */}
                    <div className="absolute top-[38%] left-[64%] p-2 rounded-xl bg-black/85 border border-cyan-400 text-[10px] font-mono text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)] animate-pulse">
                      <div>3D TPU CAGE LOCKDOWN</div>
                      <div className="text-[9px] text-white/70">TORSION: 9.8 / 10</div>
                    </div>

                    <div className="absolute top-[65%] left-[34%] p-2 rounded-xl bg-black/85 border border-cyan-400 text-[10px] font-mono text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)] animate-pulse">
                      <div>DUAL-CHAMBER ZOOM AIR</div>
                      <div className="text-[9px] text-white/70">PRESSURE: 20.0 PSI</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODE 2: 3D EXPLODED ANATOMY DECONSTRUCTION */}
            {activeMode === 'exploded' && (
              <div
                className="relative w-full h-full flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {explodedLayers.map((layer, idx) => {
                  const isHover = activeLayerIndex === idx;

                  return (
                    <div
                      key={layer.id}
                      onMouseEnter={() => {
                        sound.playTick();
                        setActiveLayerIndex(idx);
                      }}
                      onMouseLeave={() => setActiveLayerIndex(null)}
                      className="absolute inset-0 flex items-center justify-center transition-all duration-300 pointer-events-auto cursor-pointer group"
                      style={{
                        transform: `translateY(${layer.yOffset}px) translateZ(${layer.zOffset}px) rotate(${layer.rotation}deg)`,
                        zIndex: 20 + idx,
                        opacity: layer.opacity,
                      }}
                    >
                      <img
                        src={layer.src}
                        alt={layer.name}
                        draggable={false}
                        className={`w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] transition-all duration-300 ${
                          isHover ? 'scale-105 brightness-125' : 'group-hover:scale-102'
                        }`}
                      />

                      {/* Floating Spec Tooltip Pin */}
                      {isHover && (
                        <div
                          className="absolute -right-4 top-1/2 -translate-y-1/2 w-64 p-3.5 rounded-2xl bg-black/90 border border-lime-400/60 backdrop-blur-2xl shadow-2xl z-50 text-left animate-in fade-in zoom-in-95 pointer-events-none"
                          style={{
                            transform: `translateZ(60px)`,
                          }}
                        >
                          <div className="text-[10px] font-mono text-lime-400 font-bold uppercase mb-1">
                            {layer.name}
                          </div>
                          <p className="text-xs text-white/85 leading-relaxed mb-2 font-normal">
                            {layer.desc}
                          </p>
                          <div className="flex items-center justify-between pt-1.5 border-t border-white/10 text-[10px] font-mono text-white/60">
                            <span>WEIGHT: {layer.weight}</span>
                            <span className="text-lime-300 font-bold">{layer.tech}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* =========================================================
              BOTTOM CANVAS HUD CONTROLS
             ========================================================= */}
          <div className="relative z-30 space-y-4 pt-4 border-t border-white/10">
            {/* 5 Cinematic Camera Angle Quick-Jump Buttons */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-white/60 uppercase mb-2">
                <span className="flex items-center gap-1.5 text-lime-400">
                  <Zap size={12} />
                  <span>CINEMATIC CAMERA ANGLES</span>
                </span>
                <span>CLICK TO TARGET</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {CAMERA_PRESETS.map((preset) => {
                  const isCurrent = currentFrame === preset.frame;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                        isCurrent
                          ? 'bg-lime-400 text-black border-lime-400 font-bold shadow-lg scale-102'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div
                        className={`text-[10px] font-mono font-bold mb-0.5 ${
                          isCurrent ? 'text-black' : 'text-lime-400'
                        }`}
                      >
                        {preset.degrees}
                      </div>
                      <div className="text-xs font-bold uppercase truncate">{preset.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Final CTA Bar & Telemetry Strip */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-4 text-xs font-mono text-white/70">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-lime-400" />
                  <span>BEAVERTON INNOVATION ARCHIVE</span>
                </span>
                <span>•</span>
                <span className="text-white">NITROGEN ZOOM AIR 20 PSI</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playSuccess();
                  onAddToCart(
                    'NIKE ZOOM VOMERO 5',
                    'Kinetic Holodeck Edition',
                    210,
                    framePaths[currentFrame]
                  );
                }}
                className="group flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-white text-black font-extrabold uppercase shadow-2xl transition-all duration-300 hover:bg-lime-400 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white"
                style={{ fontFamily: "'Anton', sans-serif", fontSize: '16px' }}
              >
                <span>ADD TO BAG — {formatPrice(210)}</span>
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-black group-hover:text-lime-400 transition-colors">
                  <ArrowRight size={14} strokeWidth={2.5} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
