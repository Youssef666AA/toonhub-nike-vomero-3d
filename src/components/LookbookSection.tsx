import { useState } from 'react';
import { Camera, Plus, ArrowUpRight } from 'lucide-react';
import { CurrencyCode, CURRENCIES } from '../types/store';

interface LookbookSectionProps {
  currency: CurrencyCode;
  onQuickShop: (colorwayId: string) => void;
}

export default function LookbookSection({ currency, onQuickShop }: LookbookSectionProps) {
  const [activePin, setActivePin] = useState<number | null>(null);

  const currInfo = CURRENCIES[currency];
  const formatPrice = (usd: number) => `${currInfo.symbol}${Math.round(usd * currInfo.rate)}`;

  const editorialLooks = [
    {
      id: 1,
      title: 'SHIBUYA AFTER DARK // SS-26 CAMPAIGN',
      location: 'TOKYO, JP',
      image: '/editorial/editorial_1.jpg',
      photographer: 'KENJI SATO',
      shoe: 'NIKE ZOOM VOMERO 5 "VOLT MATRIX"',
      price: 210,
      pin: { x: 42, y: 88 },
      outfit: [
        'Cyber Techwear Windbreaker Jacket',
        'Tactical Cargo Utility Pant',
        'Nike Zoom Vomero 5 "Volt Matrix"',
      ],
    },
  ];

  return (
    <section
      id="lookbook"
      className="relative py-24 sm:py-32 bg-black text-white border-b border-white/10 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Camera size={15} className="text-lime-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-lime-400">
                STREETWEAR & PERFORMANCE EDITORIAL
              </span>
            </div>
            <h2
              className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              SPATIAL LOOKBOOK // 01
            </h2>
          </div>

          <div className="text-xs font-mono text-white/60">
            LOCATION: SHIBUYA, TOKYO • PHOTOGRAPHY: 35MM LEICA M11
          </div>
        </div>

        {/* Editorial Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Large Editorial Image */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl group">
            <img
              src={editorialLooks[0].image}
              alt="Tokyo Streetwear Lookbook"
              className="w-full h-[520px] sm:h-[680px] object-cover object-center filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Subtle Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Interactive "Shop The Look" Pulsing Pin */}
            <div
              className="absolute z-30"
              style={{
                left: `${editorialLooks[0].pin.x}%`,
                top: `${editorialLooks[0].pin.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <button
                type="button"
                onClick={() => setActivePin(activePin === 1 ? null : 1)}
                className="relative group w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              >
                <span className="absolute inset-0 rounded-full bg-lime-400/40 animate-ping" />
                <span className="relative w-8 h-8 rounded-full bg-lime-400 text-black flex items-center justify-center font-bold shadow-2xl border-2 border-white hover:scale-110 transition-transform">
                  <Plus size={16} strokeWidth={3} />
                </span>
              </button>

              {/* Pin Tooltip Card */}
              {activePin === 1 && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 p-4 rounded-2xl bg-black/90 backdrop-blur-2xl border border-white/20 shadow-2xl z-40 text-left animate-in fade-in zoom-in-95">
                  <div className="text-[10px] font-mono text-lime-400 uppercase font-bold mb-1">
                    FEATURED SILHOUETTE
                  </div>
                  <div className="text-xs font-bold text-white mb-2">
                    {editorialLooks[0].shoe}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-xs font-mono font-bold text-white">
                      {formatPrice(editorialLooks[0].price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onQuickShop('vomero-volt')}
                      className="text-[10px] font-mono font-bold uppercase text-lime-400 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      SHOP SNEAKER <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-white/80 pointer-events-none">
              <span>{editorialLooks[0].title}</span>
              <span className="hidden sm:inline">SS-26 ARCHIVE</span>
            </div>
          </div>

          {/* Right Column: Editorial Notes & Outfit Deconstruction */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div className="p-7 rounded-3xl bg-[#0e0e0e] border border-white/10 space-y-4">
              <div className="text-xs font-mono text-lime-400 uppercase font-bold tracking-wider">
                EDITORIAL BREAKDOWN
              </div>
              <h3
                className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                URBAN KINETIC MOTION
              </h3>
              <p className="text-xs text-white/80 leading-relaxed font-normal">
                Shot on location amidst Shibuya’s neon-soaked labyrinth, the Vomero 5 transitions seamlessly from high-mileage road running into aggressive cyberpunk streetwear silhouettes.
              </p>
            </div>

            {/* Outfit Itemized List */}
            <div className="p-7 rounded-3xl bg-[#0e0e0e] border border-white/10 space-y-3">
              <div className="text-xs font-mono text-white/60 uppercase tracking-wider mb-2">
                FIT DECONSTRUCTION
              </div>
              {editorialLooks[0].outfit.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 border-b border-white/10 text-xs font-mono text-white/90"
                >
                  <span>{item}</span>
                  <span className="text-[10px] text-lime-400 font-bold">0{idx + 1}</span>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <a
              href="#vault"
              className="w-full py-4 rounded-2xl bg-white text-black font-extrabold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:bg-lime-400 transition-all cursor-pointer shadow-xl"
              style={{ fontFamily: "'Anton', sans-serif", fontSize: '15px' }}
            >
              <span>EXPLORE ALL COLORWAYS</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
