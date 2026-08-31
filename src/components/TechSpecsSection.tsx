import { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

interface TechLayer {
  id: string;
  number: string;
  name: string;
  category: string;
  description: string;
  highlight: string;
  telemetry: {
    label: string;
    value: string;
    percent: number;
  }[];
  features: string[];
}

const TECH_LAYERS: TechLayer[] = [
  {
    id: 'cushion',
    number: '01',
    name: 'DUAL-CHAMBER ZOOM AIR PODS',
    category: 'IMPACT DISSIPATION & KINETIC RETURN',
    description:
      'Independently pressurized tensile air chambers positioned in the forefoot and heel. High-tenacity synthetic micro-fibers prevent blowout while returning 85% kinetic rebound under heavy footstrike.',
    highlight: '85% Kinetic Energy Return Rate',
    telemetry: [
      { label: 'Energy Return Efficiency', value: '85.4%', percent: 85 },
      { label: 'Impact Dissipation Force', value: '1,420 N', percent: 92 },
      { label: 'Air Pod Pressure Level', value: '20 PSI', percent: 78 },
    ],
    features: [
      'Dual decoupled pressurized Zoom Air units',
      'Cushlon dual-density carrier midsole foam',
      'Zero-compression fatigue rated for 800+ kilometers',
    ],
  },
  {
    id: 'cage',
    number: '02',
    name: '3D LASER-CUT TPU MIDFOOT MATRIX',
    category: 'LATERAL LOCKDOWN & TORSIONAL RIGIDITY',
    description:
      'Parametrically modeled ribbed lattice architecture extending from the eyestay to the heel counter. Locks the midfoot during lateral cutting motions while allowing unrestricted longitudinal flex.',
    highlight: 'Parametric Geometric Rib Stabilization',
    telemetry: [
      { label: 'Torsional Rigidity Index', value: '9.8 / 10', percent: 98 },
      { label: 'Lateral Shift Resistance', value: '380 N', percent: 88 },
      { label: 'Structural Weight Mass', value: '34 grams', percent: 30 },
    ],
    features: [
      '3D molded geometric ventilation ribs',
      'Rigid heel cup counter with zero slip tolerance',
      'Integrated dynamic lacing pass-through eyelets',
    ],
  },
  {
    id: 'upper',
    number: '03',
    name: 'ENGINEERED OPEN-CELL MONOMESH',
    category: 'AERODYNAMIC THERMAL VENTILATION',
    description:
      'Variable-density micro-woven upper engineered to expel trapped moisture and ambient heat. Reinforced with high-tensile synthetic underlays for structured dimensional stability without added mass.',
    highlight: 'Continuous CFM Airflow Circulation',
    telemetry: [
      { label: 'Air Permeability Rate', value: '42.5 CFM', percent: 94 },
      { label: 'Tensile Burst Strength', value: '280 kPa', percent: 86 },
      { label: '3M Scotchlite Reflectivity', value: '550 CD/LX', percent: 90 },
    ],
    features: [
      'High-visibility 3M reflective tongue spine',
      'Dual-zone padded collar prevents Achilles irritation',
      'Recycled polymer high-gauge yarn matrix',
    ],
  },
  {
    id: 'outsole',
    number: '04',
    name: 'BRS 1000 CARBON WAFFLE TREAD',
    category: 'MULTI-SURFACE MULTI-AXIS TRACTION',
    description:
      'High-abrasion carbon rubber compound molded with classic waffle lugs and segmented crash pads. Decoupled heel grooves transition shockwave energy smoothly into forward propulsion.',
    highlight: 'Wet & Dry Asphalt Friction Coefficient 0.94',
    telemetry: [
      { label: 'Grip Friction Coefficient', value: '0.94 μ', percent: 95 },
      { label: 'Rubber Abrasion Resistance', value: 'DIN 65', percent: 89 },
      { label: 'Flex Groove Articulation', value: '18 Degrees', percent: 82 },
    ],
    features: [
      'Segmented crash pad with lateral flex grooves',
      'High-wear BRS 1000 carbon rubber on heel strike',
      'Waffle geometry optimized for road & light trail',
    ],
  },
];

export default function TechSpecsSection() {
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const activeLayer = TECH_LAYERS[activeLayerIndex];

  return (
    <section
      id="specs"
      className="relative py-20 sm:py-28 bg-[#0a0a0a] text-white border-t border-b border-white/10 overflow-hidden select-none"
    >
      {/* Background Blueprint Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-lime-400">
                INNOVATION LAB // ANATOMICAL DECONSTRUCTION
              </span>
            </div>
            <h2
              className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              EXPLODED 3D ARCHITECTURE
            </h2>
          </div>

          <p className="text-xs sm:text-sm font-mono text-white/70 max-w-md leading-relaxed">
            Deconstructed component engineering telemetry. Every millimeter calibrated for kinetic efficiency, thermal regulation, and structural lockdown.
          </p>
        </div>

        {/* Interactive Layer Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {TECH_LAYERS.map((layer, idx) => {
            const isSelected = idx === activeLayerIndex;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveLayerIndex(idx)}
                className={`p-4 rounded-2xl text-left transition-all duration-300 cursor-pointer border ${
                  isSelected
                    ? 'bg-lime-400/10 border-lime-400 text-white shadow-[0_0_25px_rgba(212,255,0,0.15)]'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/25 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isSelected ? 'text-lime-400' : 'text-white/40'
                    }`}
                  >
                    LAYER // {layer.number}
                  </span>
                  {isSelected && <Zap size={14} className="text-lime-400" />}
                </div>
                <div className="text-xs sm:text-sm font-bold uppercase tracking-tight leading-tight line-clamp-1">
                  {layer.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Interactive Anatomy Display Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 rounded-3xl bg-black/60 border border-white/15 backdrop-blur-2xl shadow-2xl">
          {/* Left Column: Visual Center & Interactive Cutout Spotlight */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[340px] sm:min-h-[420px] rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-6 overflow-hidden">
            {/* Ambient Radial Spotlight */}
            <div className="absolute inset-0 bg-radial from-lime-400/20 via-transparent to-transparent opacity-50 blur-3xl pointer-events-none" />

            {/* Central Graphic */}
            <img
              src={
                activeLayerIndex === 0
                  ? '/views/view_1.png'
                  : activeLayerIndex === 1
                  ? '/views/view_2.png'
                  : activeLayerIndex === 2
                  ? '/views/view_1.png'
                  : '/views/view_3.png'
              }
              alt={activeLayer.name}
              className="relative z-10 w-full max-w-[420px] object-contain transition-all duration-700 hover:scale-105"
            />

            {/* Overlay Status Badge */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-xl bg-black/80 border border-white/15 backdrop-blur-xl z-20">
              <span className="text-[10px] font-mono uppercase text-lime-400 font-bold flex items-center gap-1.5">
                <Cpu size={12} />
                LAB CALIBRATION: VERIFIED
              </span>
              <span className="text-[10px] font-mono text-white/70">{activeLayer.highlight}</span>
            </div>
          </div>

          {/* Right Column: In-depth Technical Telemetry & Specifications */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest bg-lime-400/20 text-lime-300 border border-lime-400/30">
                  {activeLayer.category}
                </span>
              </div>

              <h3
                className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-3"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                {activeLayer.name}
              </h3>

              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal mb-6">
                {activeLayer.description}
              </p>

              {/* Telemetry Progress Gauges */}
              <div className="space-y-4 mb-6">
                {activeLayer.telemetry.map((metric) => (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="text-white/70">{metric.label}</span>
                      <span className="text-lime-300 font-bold">{metric.value}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${metric.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bullet Feature List */}
            <div className="pt-5 border-t border-white/10 space-y-2.5">
              {activeLayer.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-white/90 font-mono">
                  <CheckCircle2 size={14} className="text-lime-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
