import { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';
import { CurrencyCode, CURRENCIES } from '../types/store';
import { sound } from '../utils/sound';

interface CustomizerSectionProps {
  currency: CurrencyCode;
  onAddCustomToCart: (config: {
    mesh: string;
    swoosh: string;
    midsole: string;
    outsole: string;
    laces: string;
    size: string;
    price: number;
  }) => void;
}

const COLOR_OPTIONS = [
  { name: 'Volt Lime', hex: '#D4FF00', filter: 'hue-rotate(0deg)' },
  { name: 'Electric Cyan', hex: '#00F0FF', filter: 'hue-rotate(120deg)' },
  { name: 'Hyper Orange', hex: '#FF5500', filter: 'hue-rotate(300deg)' },
  { name: 'Laser Magenta', hex: '#E024A5', filter: 'hue-rotate(240deg)' },
  { name: 'Titanium Silver', hex: '#E5E7EB', filter: 'saturate(0) brightness(1.2)' },
  { name: 'Stealth Black', hex: '#18181B', filter: 'saturate(0) brightness(0.6)' },
];

const ZONE_COORDINATES = {
  mesh: { x: 62, y: 44, label: '01 // UPPER MONOMESH' },
  swoosh: { x: 44, y: 47, label: '02 // NIKE SWOOSH ICON' },
  midsole: { x: 48, y: 65, label: '03 // CUSHLON MIDSOLE' },
  outsole: { x: 38, y: 72, label: '04 // WAFFLE OUTSOLE' },
  laces: { x: 60, y: 35, label: '05 // HIGH-TENSILE LACES' },
};

const SIZES = ['US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12'];

export default function CustomizerSection({ currency, onAddCustomToCart }: CustomizerSectionProps) {
  const [activeZone, setActiveZone] = useState<'mesh' | 'swoosh' | 'midsole' | 'outsole' | 'laces'>('mesh');
  const [selectedSize, setSelectedSize] = useState<string>('US 10');
  const [zones, setZones] = useState({
    mesh: COLOR_OPTIONS[0],
    swoosh: COLOR_OPTIONS[4],
    midsole: COLOR_OPTIONS[4],
    outsole: COLOR_OPTIONS[0],
    laces: COLOR_OPTIONS[5],
  });

  const currInfo = CURRENCIES[currency];
  const customPrice = 240;
  const formatPrice = (usd: number) => `${currInfo.symbol}${Math.round(usd * currInfo.rate)}`;

  const handleColorSelect = (color: typeof COLOR_OPTIONS[0]) => {
    sound.playClick();
    setZones((prev) => ({
      ...prev,
      [activeZone]: color,
    }));
  };

  const handleReset = () => {
    sound.playSwoosh();
    setZones({
      mesh: COLOR_OPTIONS[0],
      swoosh: COLOR_OPTIONS[4],
      midsole: COLOR_OPTIONS[4],
      outsole: COLOR_OPTIONS[0],
      laces: COLOR_OPTIONS[5],
    });
  };

  const zonesList = [
    { id: 'mesh', label: '01 // UPPER MONOMESH', val: zones.mesh },
    { id: 'swoosh', label: '02 // NIKE SWOOSH ICON', val: zones.swoosh },
    { id: 'midsole', label: '03 // CUSHLON MIDSOLE', val: zones.midsole },
    { id: 'outsole', label: '04 // WAFFLE OUTSOLE', val: zones.outsole },
    { id: 'laces', label: '05 // HIGH-TENSILE LACES', val: zones.laces },
  ] as const;

  const currentCoords = ZONE_COORDINATES[activeZone];

  return (
    <section
      id="customizer"
      className="relative py-24 sm:py-32 bg-[#09090b] text-white border-b border-white/10 select-none overflow-hidden"
    >
      {/* Dynamic Background Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: zones[activeZone].hex }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={15} className="text-lime-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-lime-400">
                NIKE BY YOU // BESPOKE LAB
              </span>
            </div>
            <h2
              className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              CUSTOMIZE YOUR VOMERO 5
            </h2>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer w-fit"
          >
            <RotateCcw size={13} />
            <span>RESET PRESET</span>
          </button>
        </div>

        {/* Studio Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Canvas: Live Interactive Render Preview */}
          <div className="lg:col-span-7 relative flex flex-col items-center justify-center min-h-[380px] sm:min-h-[500px] rounded-3xl bg-black/60 border border-white/15 p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
            {/* Live Render Graphic */}
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
              <img
                src="/views/view_1.png"
                alt="Custom Nike Vomero 5"
                className="w-full h-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)] transition-all duration-500"
                style={{
                  filter: `${zones.mesh.filter} drop-shadow(0 25px 35px rgba(0,0,0,0.6))`,
                }}
              />

              {/* Dynamic Target Reticle for Active Component Zone */}
              <div
                className="absolute pointer-events-none transition-all duration-500"
                style={{
                  left: `${currentCoords.x}%`,
                  top: `${currentCoords.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="relative flex items-center justify-center">
                  <span
                    className="absolute w-14 h-14 rounded-full border border-dashed animate-spin opacity-80"
                    style={{
                      borderColor: zones[activeZone].hex,
                      animationDuration: '5s',
                    }}
                  />
                  <span
                    className="w-4 h-4 rounded-full border-2 border-white shadow-xl"
                    style={{ backgroundColor: zones[activeZone].hex }}
                  />
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap px-2.5 py-1 rounded bg-black/90 border border-white/20 text-[10px] font-mono font-bold text-white shadow-xl">
                    {currentCoords.label.split(' // ')[1]} ({zones[activeZone].name})
                  </div>
                </div>
              </div>

              {/* Laser Dimension Overlay Lines */}
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-[10px] font-mono text-white/50 border-t border-white/15 pt-2">
                <span>BESPOKE BUILD ID: #TH-9021</span>
                <span>HAND-FINISHED IN OREGON LAB</span>
              </div>
            </div>
          </div>

          {/* Right Configurator Controls */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Zone Selector Tabs */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-white/60 uppercase tracking-wider mb-2">
                1. SELECT COMPONENT ZONE
              </div>
              <div className="flex flex-col gap-2">
                {zonesList.map((z) => {
                  const isActive = activeZone === z.id;
                  return (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setActiveZone(z.id);
                      }}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-white/10 border-white text-white shadow-lg'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-mono font-bold">{z.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-white/50">{z.val.name}</span>
                        <span
                          className="w-4 h-4 rounded-full border border-white/30"
                          style={{ backgroundColor: z.val.hex }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Swatch Palette */}
            <div>
              <div className="text-xs font-mono text-white/60 uppercase tracking-wider mb-2.5">
                2. CHOOSE MATERIAL & HUE
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {COLOR_OPTIONS.map((c) => {
                  const isCurrent = zones[activeZone].name === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleColorSelect(c)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-white text-black font-bold border-white shadow-lg scale-105'
                          : 'bg-white/5 text-white/80 border-white/10 hover:border-white/40'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/30 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-[11px] font-mono truncate">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector & Order CTA */}
            <div className="pt-4 border-t border-white/15">
              <div className="mb-3">
                <div className="text-[10px] font-mono text-white/70 mb-1.5 uppercase">
                  Select Size (US Men)
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {SIZES.map((sz) => {
                    const isSel = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setSelectedSize(sz);
                        }}
                        className={`py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                          isSel
                            ? 'bg-white text-black border-white shadow-md'
                            : 'bg-white/5 text-white/70 border-white/10 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        {sz.replace('US ', '')}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-white">
                    {formatPrice(customPrice)}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-lime-400/20 text-lime-300 border border-lime-400/30">
                    MADE TO ORDER
                  </span>
                </div>
                <span className="text-xs font-mono text-white/60">EST. SHIP: 5-7 DAYS</span>
              </div>

              <button
                type="button"
                onClick={() =>
                  onAddCustomToCart({
                    mesh: zones.mesh.name,
                    swoosh: zones.swoosh.name,
                    midsole: zones.midsole.name,
                    outsole: zones.outsole.name,
                    laces: zones.laces.name,
                    size: selectedSize,
                    price: customPrice,
                  })
                }
                className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase text-base tracking-wider hover:bg-lime-400 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-2xl flex items-center justify-center gap-2 cursor-pointer"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                <ShoppingBag size={18} />
                <span>ORDER BESPOKE PAIR — {formatPrice(customPrice)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

