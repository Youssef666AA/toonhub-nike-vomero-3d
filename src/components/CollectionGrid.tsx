import { useState } from 'react';
import {
  ShoppingBag,
  Flame,
} from 'lucide-react';
import { ProductColorway, CurrencyCode, CURRENCIES } from '../types/store';

export const PRODUCTS: ProductColorway[] = [
  {
    id: 'vomero-volt',
    name: 'NIKE ZOOM VOMERO 5',
    edition: 'VOLT MATRIX EDITION',
    tag: 'HERO DROP // 01',
    price: 210,
    retailPrice: 260,
    stockStatus: 'LOW_STOCK',
    stockCount: 4,
    src: '/views/view_1.png',
    bgGradient: 'from-[#2d5535] to-[#122416]',
    accentColor: '#D4FF00',
    hex: '#D4FF00',
    releaseDate: 'SS-26 VAULT',
    specs: {
      cushion: 'Zoom Air Dual-Pod',
      weight: '286g',
      drop: '10.0mm',
      tech: 'TPU Ribbed Cage',
    },
  },
  {
    id: 'vomero-obsidian',
    name: 'NIKE ZOOM VOMERO 5',
    edition: 'TRIPLE OBSIDIAN CYBER',
    tag: 'CYBER LAB DROP // 02',
    price: 210,
    retailPrice: 260,
    stockStatus: 'IN_STOCK',
    stockCount: 18,
    src: '/views/colorway_obsidian.png',
    bgGradient: 'from-[#0b2545] to-[#040f1d]',
    accentColor: '#00F0FF',
    hex: '#00F0FF',
    releaseDate: 'SS-26 VAULT',
    specs: {
      cushion: 'Zoom Air Dual-Pod',
      weight: '286g',
      drop: '10.0mm',
      tech: 'Glow Swoosh Matrix',
    },
  },
  {
    id: 'vomero-solar',
    name: 'NIKE ZOOM VOMERO 5',
    edition: 'SOLAR AMBER EDITION',
    tag: 'LIMITED RUN // 03',
    price: 225,
    retailPrice: 280,
    stockStatus: 'LOW_STOCK',
    stockCount: 3,
    src: '/views/colorway_solar.png',
    bgGradient: 'from-[#521c08] to-[#1e0701]',
    accentColor: '#FF5500',
    hex: '#FF5500',
    releaseDate: 'SS-26 VAULT',
    specs: {
      cushion: 'Zoom Air Dual-Pod',
      weight: '288g',
      drop: '10.0mm',
      tech: 'Infrared Thermal Mesh',
    },
  },
  {
    id: 'vomero-platinum',
    name: 'NIKE ZOOM VOMERO 5',
    edition: 'TITANIUM PLATINUM',
    tag: 'PREMIUM LUXE // 04',
    price: 210,
    retailPrice: 250,
    stockStatus: 'IN_STOCK',
    stockCount: 22,
    src: '/views/colorway_platinum.png',
    bgGradient: 'from-[#2e3440] to-[#12161f]',
    accentColor: '#E5E7EB',
    hex: '#FFFFFF',
    releaseDate: 'SS-26 VAULT',
    specs: {
      cushion: 'Zoom Air Dual-Pod',
      weight: '284g',
      drop: '10.0mm',
      tech: 'Chrome Metallic Cage',
    },
  },
  {
    id: 'vomero-aqua',
    name: 'NIKE ZOOM VOMERO 5',
    edition: 'GLITCH NEON AQUA',
    tag: 'VAULT EXCLUSIVE // 05',
    price: 230,
    retailPrice: 290,
    stockStatus: 'VAULT_EXCLUSIVE',
    stockCount: 2,
    src: '/views/colorway_aqua.png',
    bgGradient: 'from-[#2a0e4e] to-[#0d031c]',
    accentColor: '#2DD4BF',
    hex: '#2DD4BF',
    releaseDate: 'SS-26 VAULT',
    specs: {
      cushion: 'Zoom Air Dual-Pod',
      weight: '286g',
      drop: '10.0mm',
      tech: 'Glitch Chromatic Upper',
    },
  },
  {
    id: 'vomero-stealth',
    name: 'NIKE ZOOM VOMERO 5',
    edition: 'MIDNIGHT STEALTH CORE',
    tag: 'BLACKOUT SERIES // 06',
    price: 210,
    retailPrice: 260,
    stockStatus: 'IN_STOCK',
    stockCount: 15,
    src: '/views/colorway_stealth.png',
    bgGradient: 'from-[#1a1a1a] to-[#050505]',
    accentColor: '#52525B',
    hex: '#18181B',
    releaseDate: 'SS-26 VAULT',
    specs: {
      cushion: 'Zoom Air Dual-Pod',
      weight: '285g',
      drop: '10.0mm',
      tech: 'Carbon Fiber Weave',
    },
  },
];

const AVAILABLE_SIZES = ['US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12'];

interface CollectionGridProps {
  currency: CurrencyCode;
  onAddToCart: (product: ProductColorway, size: string) => void;
}

export default function CollectionGrid({ currency, onAddToCart }: CollectionGridProps) {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(() =>
    PRODUCTS.reduce((acc, p) => ({ ...acc, [p.id]: 'US 10' }), {})
  );
  const [filter, setFilter] = useState<'ALL' | 'IN_STOCK' | 'EXCLUSIVE'>('ALL');

  const currInfo = CURRENCIES[currency];

  const formatPrice = (usd: number) => {
    const val = Math.round(usd * currInfo.rate);
    return `${currInfo.symbol}${val}`;
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    if (filter === 'IN_STOCK') return p.stockStatus === 'IN_STOCK' || p.stockStatus === 'LOW_STOCK';
    if (filter === 'EXCLUSIVE') return p.stockStatus === 'VAULT_EXCLUSIVE';
    return true;
  });

  return (
    <section
      id="vault"
      className="relative py-24 sm:py-32 bg-black text-white border-b border-white/10 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame size={15} className="text-lime-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-lime-400">
                THE SS-26 VAULT COLLECTION
              </span>
            </div>
            <h2
              className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              CHOOSE YOUR COLORWAY
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/5 border border-white/15">
            {(['ALL', 'IN_STOCK', 'EXCLUSIVE'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
                  filter === f
                    ? 'bg-white text-black font-extrabold shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* 6-Card Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const currentSize = selectedSizes[product.id] || 'US 10';

            return (
              <div
                key={product.id}
                className="group relative rounded-3xl bg-[#0c0c0c] border border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden flex flex-col justify-between shadow-2xl hover:shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
              >
                {/* Top Card Showcase Image Area */}
                <div
                  className={`relative h-64 sm:h-72 w-full bg-gradient-to-b ${product.bgGradient} p-6 flex items-center justify-center overflow-hidden`}
                >
                  {/* Subtle Grid Pattern Overlay */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                      backgroundSize: '20px 20px',
                    }}
                  />

                  {/* Stock Status Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border backdrop-blur-md flex items-center gap-1.5 ${
                        product.stockStatus === 'LOW_STOCK'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : product.stockStatus === 'VAULT_EXCLUSIVE'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-lime-500/20 text-lime-300 border-lime-500/40'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {product.stockStatus === 'LOW_STOCK'
                        ? `LOW STOCK // ${product.stockCount} LEFT`
                        : product.stockStatus.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Tag */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="text-[10px] font-mono text-white/60 uppercase">
                      {product.tag}
                    </span>
                  </div>

                  {/* High-Resolution Floating Sneaker */}
                  <img
                    src={product.src}
                    alt={product.edition}
                    className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  />
                </div>

                {/* Bottom Card Content & Controls */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
                        {product.name}
                      </span>
                      <span className="text-[11px] font-mono text-white/50">
                        {product.specs.weight}
                      </span>
                    </div>

                    <h3
                      className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-2"
                      style={{ fontFamily: "'Anton', sans-serif" }}
                    >
                      {product.edition}
                    </h3>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2.5 mb-4">
                      <span className="text-xl font-bold font-mono text-white">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs font-mono text-white/40 line-through">
                        {formatPrice(product.retailPrice)}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-lime-400/20 text-lime-300 border border-lime-400/30">
                        SAVE 20%
                      </span>
                    </div>

                    {/* Size Selector */}
                    <div className="mb-6">
                      <div className="text-[10px] font-mono text-white/70 mb-1.5 uppercase">
                        Select Size (US Men)
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {AVAILABLE_SIZES.map((sz) => {
                          const isSel = currentSize === sz;
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={() =>
                                setSelectedSizes((prev) => ({
                                  ...prev,
                                  [product.id]: sz,
                                }))
                              }
                              className={`py-1 rounded-lg text-[10px] font-mono font-bold transition-all duration-200 cursor-pointer border ${
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
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    type="button"
                    onClick={() => onAddToCart(product, currentSize)}
                    className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl bg-white text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-300 hover:bg-lime-400 hover:scale-[1.02] active:scale-95 shadow-xl cursor-pointer"
                    style={{ fontFamily: "'Anton', sans-serif", fontSize: '15px' }}
                  >
                    <ShoppingBag size={15} />
                    <span>ADD TO BAG — {formatPrice(product.price)}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
