import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Rotate3D,
  Check,
  Plus,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import TechSpecsSection from './components/TechSpecsSection';
import CollectionGrid from './components/CollectionGrid';
import CustomizerSection from './components/CustomizerSection';
import LookbookSection from './components/LookbookSection';
import ReviewsSection from './components/ReviewsSection';
import FaqSection from './components/FaqSection';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import { sound } from './utils/sound';
import {
  CurrencyCode,
  CURRENCIES,
  ProductColorway,
  CartItem,
} from './types/store';

interface ShoeView {
  id: string;
  code: string;
  name: string;
  tag: string;
  title: string;
  degrees: string;
  desc: string;
  src: string;
  bg: string;
  accent: string;
  hotspots: {
    x: number;
    y: number;
    title: string;
    detail: string;
  }[];
  spec: {
    cushion: string;
    weight: string;
    drop: string;
    matrix: string;
  };
}

const VIEWS: ShoeView[] = [
  {
    id: 'side',
    code: '01',
    name: '45° HERO PROFILE',
    tag: 'AERODYNAMIC SILHOUETTE',
    title: 'NIKE ZOOM VOMERO 5',
    degrees: '045°',
    desc: 'Precision-engineered layered mesh upper coupled with synthetic geometric cage architecture and responsive dual-chamber Zoom Air cushioning.',
    src: '/views/view_1.png',
    bg: '#4A9356', // Athletic forest volt green
    accent: '#D4FF00',
    hotspots: [
      {
        x: 48,
        y: 42,
        title: '3D CAGE MATRIX',
        detail: 'Laser-cut TPU midfoot ribs provide targeted lateral stabilization and ventilation.',
      },
      {
        x: 78,
        y: 35,
        title: 'GEOMETRIC HEEL CUP',
        detail: 'Molded architectural heel counter locks foot into place during explosive cuts.',
      },
      {
        x: 32,
        y: 68,
        title: 'ZOOM AIR SOLE',
        detail: 'Dual pressurized air units return 85% energy under high-impact footstrike.',
      },
    ],
    spec: {
      cushion: 'Zoom Air Dual-Pod',
      weight: '286g (US 10)',
      drop: '10.0 mm',
      matrix: 'TPU Ribbed Cage',
    },
  },
  {
    id: 'front',
    code: '02',
    name: 'TOP AERO PERSPECTIVE',
    tag: '3D LOCKDOWN VIEW',
    title: 'DYNAMIC ANATOMICAL FIT',
    degrees: '180°',
    desc: 'Anatomical dual-density forefoot flex channels integrated with high-tensile reflective webbing for precision lockdown during multi-directional movement.',
    src: '/views/view_2.png',
    bg: '#2563EB', // Ultra-luxe electric royal blue
    accent: '#38BDF8',
    hotspots: [
      {
        x: 52,
        y: 32,
        title: 'REFLECTIVE 3M TONGUE',
        detail: 'High-visibility 3M Scotchlite webbing with cushioned anatomical tongue pad.',
      },
      {
        x: 38,
        y: 58,
        title: 'OPEN-CELL MESH',
        detail: 'Engineered multi-gauge knit optimizes breathability across high-heat zones.',
      },
    ],
    spec: {
      cushion: 'Cushlon Foam Core',
      weight: '286g (US 10)',
      drop: '10.0 mm',
      matrix: 'Anatomical Webbing',
    },
  },
  {
    id: 'outsole',
    code: '03',
    name: 'OUTSOLE 3D MATRIX',
    tag: 'TRACTION & TREAD',
    title: 'WAFFLE TRACTION 360',
    degrees: '315°',
    desc: 'High-abrasion BRS 1000 carbon rubber outsole with segmented crash pad and decoupled heel geometry for buttery smooth heel-to-toe transitions.',
    src: '/views/view_3.png',
    bg: '#DC442C', // Dynamic hyper crimson
    accent: '#FDE047',
    hotspots: [
      {
        x: 65,
        y: 30,
        title: 'WAFFLE LUG MATRIX',
        detail: 'Multi-directional rubber lugs engineered for wet and dry pavement grip.',
      },
      {
        x: 35,
        y: 65,
        title: 'CRASH PAD DECOUPLING',
        detail: 'Segmented grooves absorb initial impact shock smoothly through gait cycle.',
      },
    ],
    spec: {
      cushion: 'BRS 1000 Rubber',
      weight: '286g (US 10)',
      drop: '10.0 mm',
      matrix: 'Decoupled Flex Grooves',
    },
  },
];

const SIZES = ['US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12'];

const grainDataUri =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E\")";

export default function App() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string>('US 10');
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  // Global Shopify Store State
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'initial-1',
      productId: 'vomero-volt',
      title: 'NIKE ZOOM VOMERO 5',
      colorway: 'Volt Matrix Edition',
      size: 'US 10',
      price: 210,
      src: '/views/view_1.png',
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  // Mouse Parallax Physics
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<number>(0);
  const [dragDelta, setDragDelta] = useState<number>(0);
  const lastScrollTime = useRef<number>(0);

  // Preload images
  useEffect(() => {
    VIEWS.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
  }, []);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation between 3D views
  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (isAnimating) return;
      sound.playSwoosh();
      setIsAnimating(true);
      setActiveHotspot(null);
      setActiveIndex((prev) => {
        if (direction === 'next') return (prev + 1) % VIEWS.length;
        return (prev - 1 + VIEWS.length) % VIEWS.length;
      });
      setTimeout(() => {
        setIsAnimating(false);
      }, 850);
    },
    [isAnimating]
  );

  // Wheel interaction: Only allow quick cycling when explicitly hovering, otherwise allow natural scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const heroEl = document.getElementById('hero');
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      const inHero = rect.top >= -50 && rect.bottom >= window.innerHeight * 0.85;

      // Only cycle views if user is explicitly inside the top hero without scrolling down deeply
      if (!inHero || window.scrollY > 80) return;

      const now = Date.now();
      if (now - lastScrollTime.current < 900) return;

      // If user scrolls horizontally on trackpad, rotate
      if (Math.abs(e.deltaX) > 40) {
        lastScrollTime.current = now;
        if (e.deltaX > 0) {
          navigate('next');
        } else {
          navigate('prev');
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [navigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        navigate('next');
      } else if (e.key === 'ArrowLeft') {
        navigate('prev');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Mouse Parallax & Drag handling
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 24;
    const y = (clientY / window.innerHeight - 0.5) * 24;
    setMousePos({ x, y });

    if (isDragging) {
      setDragDelta(clientX - dragStart);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a, .no-drag, input')) return;
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragDelta(0);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDelta < -60) {
      navigate('next');
    } else if (dragDelta > 60) {
      navigate('prev');
    }
    setDragDelta(0);
  };

  // Touch Swipe Handlers for mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, a, .no-drag, input')) return;
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    setDragDelta(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      setDragDelta(e.touches[0].clientX - dragStart);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDelta < -45) {
      navigate('next');
    } else if (dragDelta > 45) {
      navigate('prev');
    }
    setDragDelta(0);
  };

  // Sound Toggle handler
  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  // Cart Operations
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  const handleAddHeroToCart = () => {
    sound.playSuccess();
    const newItem: CartItem = {
      id: `hero-${Date.now()}`,
      productId: 'vomero-volt',
      title: 'NIKE ZOOM VOMERO 5',
      colorway: 'Volt Matrix Edition',
      size: selectedSize,
      price: 210,
      src: '/views/view_1.png',
      quantity: 1,
    };
    setCartItems((prev) => [...prev, newItem]);
    triggerToast(`Nike Zoom Vomero 5 (${selectedSize}) added to bag`);
    setIsCartOpen(true);
  };


  const handleAddCollectionToCart = (product: ProductColorway, size: string) => {
    sound.playSuccess();
    const newItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      title: product.name,
      colorway: product.edition,
      size: size,
      price: product.price,
      src: product.src,
      quantity: 1,
    };
    setCartItems((prev) => [...prev, newItem]);
    triggerToast(`${product.edition} (${size}) added to bag`);
    setIsCartOpen(true);
  };

  const handleAddCustomToCart = (config: {
    mesh: string;
    swoosh: string;
    midsole: string;
    outsole: string;
    laces: string;
    size: string;
    price: number;
  }) => {
    sound.playSuccess();
    const newItem: CartItem = {
      id: `custom-${Date.now()}`,
      productId: 'vomero-bespoke',
      title: 'NIKE BY YOU // VOMERO 5',
      colorway: `Bespoke (${config.mesh} / ${config.swoosh})`,
      size: config.size,
      price: config.price,
      src: '/views/view_1.png',
      quantity: 1,
      isCustom: true,
      customConfig: config,
    };
    setCartItems((prev) => [...prev, newItem]);
    triggerToast(`Bespoke Vomero 5 (${config.size}) added to bag`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const nextQty = it.quantity + delta;
            return nextQty > 0 ? { ...it, quantity: nextQty } : null;
          }
          return it;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
  };

  const currentView = VIEWS[activeIndex];
  const currInfo = CURRENCIES[currency];
  const formatPrice = (usd: number) => `${currInfo.symbol}${Math.round(usd * currInfo.rate)}`;

  // Specific 3D pose per view with enlarged model presence & generous margins
  const getViewPose = (index: number) => {
    const isCurrent = index === activeIndex;
    const isPrev = index === (activeIndex - 1 + VIEWS.length) % VIEWS.length;
    const isNext = index === (activeIndex + 1) % VIEWS.length;

    if (isCurrent) {
      if (index === 0) {
        return {
          left: isMobile ? '50%' : '45%',
          top: isMobile ? '43%' : '41%',
          transform: `translate(-50%, -50%) rotateX(${-mousePos.y * 0.35}deg) rotateY(${
            mousePos.x * 0.35
          }deg) scale(${isMobile ? 1.22 : 1.4})`,
          opacity: 1,
          zIndex: 30,
          filter: 'drop-shadow(0 30px 45px rgba(0, 0, 0, 0.4))',
        };
      } else if (index === 1) {
        return {
          left: '50%',
          top: isMobile ? '43%' : '42%',
          transform: `translate(-50%, -50%) rotateX(${-mousePos.y * 0.35}deg) rotateY(${
            mousePos.x * 0.35
          }deg) scale(${isMobile ? 1.16 : 1.34})`,
          opacity: 1,
          zIndex: 30,
          filter: 'drop-shadow(0 30px 45px rgba(0, 0, 0, 0.4))',
        };
      } else {
        return {
          left: isMobile ? '50%' : '51%',
          top: isMobile ? '43%' : '41%',
          transform: `translate(-50%, -50%) rotateX(${-mousePos.y * 0.35}deg) rotateY(${
            mousePos.x * 0.35
          }deg) scale(${isMobile ? 1.2 : 1.36})`,
          opacity: 1,
          zIndex: 30,
          filter: 'drop-shadow(0 30px 45px rgba(0, 0, 0, 0.4))',
        };
      }
    }

    if (isPrev) {
      return {
        left: isMobile ? '6%' : '11%',
        top: isMobile ? '50%' : '52%',
        transform: `translate(-50%, -50%) scale(${isMobile ? 0.48 : 0.62}) rotate(-25deg)`,
        opacity: 0.3,
        zIndex: 10,
        filter: 'blur(3px) drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))',
      };
    }

    if (isNext) {
      return {
        left: isMobile ? '94%' : '89%',
        top: isMobile ? '50%' : '52%',
        transform: `translate(-50%, -50%) scale(${isMobile ? 0.48 : 0.62}) rotate(25deg)`,
        opacity: 0.3,
        zIndex: 10,
        filter: 'blur(3px) drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))',
      };
    }

    return {
      left: '50%',
      top: '75%',
      transform: 'translate(-50%, -50%) scale(0.25)',
      opacity: 0,
      zIndex: 5,
      filter: 'blur(8px)',
    };
  };

  return (
    <div className="w-full min-h-screen bg-black text-white selection:bg-lime-400 selection:text-black">
      {/* 1. Global Announcement Ticker */}
      <AnnouncementBar />

      {/* 2. Luxury Glassmorphic Navigation Bar */}
      <Navbar
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        currency={currency}
        onCurrencyChange={setCurrency}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
      />

      {/* 3. Hero Section (Full Viewport 3D Cinematic Showcase) */}
      <section
        id="hero"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full h-[calc(100vh-80px)] min-h-[640px] max-h-[960px] overflow-hidden select-none cursor-grab active:cursor-grabbing text-white"
        style={{
          backgroundColor: currentView.bg,
          transition: 'background-color 850ms cubic-bezier(0.35, 0, 0.25, 1)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Grain Texture Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: 0.35,
            backgroundImage: grainDataUri,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Dynamic Ambient Light Spotlights */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700"
          style={{
            zIndex: 1,
            background: `radial-gradient(circle at 50% 42%, rgba(255,255,255,0.42) 0%, transparent 62%), radial-gradient(circle at ${
              50 + mousePos.x * 0.8
            }% ${40 + mousePos.y * 0.8}%, rgba(255,255,255,0.2) 0%, transparent 45%)`,
          }}
        />

        {/* Giant Ghost Typography "3D SHAPE" */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none uppercase transition-transform duration-300 ease-out"
          style={{
            zIndex: 2,
            top: isMobile ? '16%' : '17%',
            transform: `translateY(${mousePos.y * -0.2}px)`,
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(90px, 28vw, 380px)',
            fontWeight: 900,
            color: '#ffffff',
            opacity: 1,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
            textShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          3D SHAPE
        </div>

        {/* 3D View Switcher (Desktop) */}
        <div className="hidden md:flex absolute top-6 inset-x-0 justify-center pointer-events-auto z-[60] no-drag">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/25 backdrop-blur-xl border border-white/20 shadow-2xl">
            {VIEWS.map((view, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => {
                    if (!isAnimating && activeIndex !== idx) {
                      setIsAnimating(true);
                      setActiveHotspot(null);
                      setActiveIndex(idx);
                      setTimeout(() => setIsAnimating(false), 850);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-white text-black shadow-lg scale-100 font-extrabold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-[10px] opacity-60 font-mono">{view.code}</span>
                  <span>{view.name}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 3D Canvas with Parallax & Hotspots */}
        <div className="absolute inset-0 pointer-events-none z-[20]">
          {VIEWS.map((item, index) => {
            const pose = getViewPose(index);
            const isCurrent = index === activeIndex;

            return (
              <div
                key={item.id}
                className="absolute transition-all ease-out flex items-center justify-center pointer-events-none"
                style={{
                  ...pose,
                  width: isMobile ? '86vw' : '54vw',
                  maxWidth: '680px',
                  maxHeight: isMobile ? '55vh' : '65vh',
                  aspectRatio: '1 / 1',
                  transition: isDragging
                    ? 'none'
                    : 'all 850ms cubic-bezier(0.35, 0, 0.25, 1)',
                  willChange: 'transform, opacity, filter, left, top',
                }}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  draggable={false}
                  className="w-full h-full object-contain pointer-events-none select-none"
                />

                {/* Hotspot Pins */}
                {isCurrent && (
                  <div className="absolute inset-0 pointer-events-auto no-drag">
                    {item.hotspots.map((spot, spotIdx) => {
                      const isOpen = activeHotspot === spotIdx;
                      return (
                        <div
                          key={spot.title}
                          className="absolute z-40 transition-transform duration-300"
                          style={{
                            left: `${spot.x}%`,
                            top: `${spot.y}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setActiveHotspot(isOpen ? null : spotIdx)}
                            aria-label={spot.title}
                            className="relative group w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300"
                          >
                            <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
                            <span
                              className={`relative w-6 h-6 rounded-full flex items-center justify-center text-black border-2 border-white backdrop-blur-md shadow-2xl transition-transform duration-300 ${
                                isOpen
                                  ? 'bg-lime-400 scale-110 rotate-45'
                                  : 'bg-white/90 hover:scale-110'
                              }`}
                            >
                              <Plus size={14} strokeWidth={3} />
                            </span>
                          </button>

                          {isOpen && (
                            <div className="absolute left-10 top-1/2 -translate-y-1/2 w-64 p-3.5 rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/25 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-200 z-50 pointer-events-auto">
                              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/15">
                                <span className="text-[10px] font-mono uppercase text-lime-400 font-bold tracking-widest flex items-center gap-1">
                                  <Zap size={11} />
                                  {spot.title}
                                </span>
                                <span className="text-[9px] font-mono text-white/50">
                                  TECH // 0{spotIdx + 1}
                                </span>
                              </div>
                              <p className="text-xs text-white/90 leading-relaxed font-normal">
                                {spot.detail}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile View Switcher */}
        <div className="md:hidden absolute top-4 inset-x-0 flex justify-center items-center gap-1.5 px-4 pointer-events-auto z-[60] no-drag">
          {VIEWS.map((view, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={view.id}
                onClick={() => {
                  if (!isAnimating && activeIndex !== idx) {
                    setIsAnimating(true);
                    setActiveHotspot(null);
                    setActiveIndex(idx);
                    setTimeout(() => setIsAnimating(false), 850);
                  }
                }}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border ${
                  isActive
                    ? 'bg-white text-black border-white shadow-lg font-extrabold'
                    : 'bg-black/30 text-white/80 border-white/20'
                }`}
              >
                {view.name}
              </button>
            );
          })}
        </div>

        {/* Bottom Left: Product Info & Size Selector */}
        <div className="absolute bottom-5 sm:bottom-10 left-4 sm:left-10 pointer-events-auto z-[60] max-w-[360px] sm:max-w-[420px] no-drag">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest bg-black/30 border border-white/20 text-lime-300">
              {currentView.tag}
            </span>
            <span className="text-xs font-mono text-white/70">
              ROTATION: {currentView.degrees}
            </span>
          </div>

          <h1
            className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white mb-1 drop-shadow"
            style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.01em' }}
          >
            NIKE ZOOM VOMERO 5
          </h1>

          <div className="flex items-baseline gap-3 mb-2.5 sm:mb-3">
            <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">
              {formatPrice(210)}
            </span>
            <span className="text-xs text-white/50 line-through font-mono">
              {formatPrice(260)}
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-lime-400 text-black font-mono">
              SAVE 20%
            </span>
          </div>

          <p className="hidden sm:block text-xs text-white/85 leading-relaxed mb-3 font-normal drop-shadow">
            {currentView.desc}
          </p>

          <div className="mb-3.5 sm:mb-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-white/80 mb-1.5">
              <span>SELECT SIZE (US MEN)</span>
              <a href="#faq" className="text-lime-300 underline cursor-pointer text-[10px]">
                SIZE GUIDE
              </a>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {SIZES.map((sz) => {
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-lg scale-105'
                        : 'bg-black/25 text-white/80 border-white/20 hover:border-white/60 hover:text-white'
                    }`}
                  >
                    {sz.replace('US ', '')}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate('prev')}
              aria-label="Previous 3D Angle"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/25 backdrop-blur-md border-2 border-white/80 flex items-center justify-center text-white cursor-pointer transition-all duration-150 hover:scale-110 hover:bg-white/20 active:scale-95 shadow-xl"
            >
              <ArrowLeft size={20} strokeWidth={2.5} color="#ffffff" />
            </button>
            <button
              type="button"
              onClick={() => navigate('next')}
              aria-label="Next 3D Angle"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/25 backdrop-blur-md border-2 border-white/80 flex items-center justify-center text-white cursor-pointer transition-all duration-150 hover:scale-110 hover:bg-white/20 active:scale-95 shadow-xl"
            >
              <ArrowRight size={20} strokeWidth={2.5} color="#ffffff" />
            </button>

            <div className="flex items-center gap-2 ml-1 text-xs font-mono text-white/90">
              <span className="font-bold text-white">0{activeIndex + 1}</span>
              <span className="text-white/40">/</span>
              <span className="text-white/60">03 VIEWS</span>
            </div>
          </div>
        </div>

        {/* Bottom Right: CTA & Dial */}
        <div className="absolute bottom-5 sm:bottom-10 right-4 sm:right-10 pointer-events-auto z-[60] flex flex-col items-end gap-3 sm:gap-4 no-drag">
          <div className="hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-black/25 backdrop-blur-xl border border-white/20 text-right">
            <Rotate3D
              size={18}
              className="text-lime-300 animate-spin"
              style={{ animationDuration: '8s' }}
            />
            <div>
              <div className="text-[10px] font-mono text-white/60 uppercase">
                Interactive Camera
              </div>
              <div className="text-xs font-mono font-bold text-white tracking-wider">
                {currentView.degrees} • {currentView.name}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddHeroToCart}
            className="group relative flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white text-black font-extrabold uppercase shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white hover:shadow-[0_0_35px_rgba(255,255,255,0.4)]"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(18px, 3vw, 32px)',
              letterSpacing: '0.02em',
              lineHeight: 1,
            }}
          >
            <span>ADD TO CART — {formatPrice(210)}</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black flex items-center justify-center text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-lime-400 group-hover:text-black">
              <ArrowRight size={18} strokeWidth={2.5} />
            </div>
          </button>

          <div className="hidden sm:flex items-center gap-4 text-[11px] font-mono text-white/75">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-lime-300" /> 100% AUTHENTIC GUARANTEE
            </span>
            <span>•</span>
            <span>FREE EXPRESS 2-DAY SHIPPING</span>
          </div>
        </div>

      </section>

      {/* 4. Section 2: Exploded 3D Anatomy & Innovation Lab Telemetry */}
      <TechSpecsSection />

      {/* 6. Section 4: The SS-26 Vault Collection Matrix */}
      <CollectionGrid
        currency={currency}
        onAddToCart={handleAddCollectionToCart}
      />

      {/* 7. Section 5: Nike By You Customizer Studio */}
      <CustomizerSection
        currency={currency}
        onAddCustomToCart={handleAddCustomToCart}
      />

      {/* 8. Section 6: Tokyo Shibuya Streetwear Lookbook */}
      <LookbookSection
        currency={currency}
        onQuickShop={(colorwayId) => {
          sound.playClick();
          const el = document.getElementById('vault');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          triggerToast(`Viewing ${colorwayId.replace('-', ' ').toUpperCase()} in SS-26 Vault`);
        }}
      />

      {/* 8. Section 6: Verified Buyer Reviews & Performance Ratings */}
      <ReviewsSection />

      {/* 9. Section 7: Concierge Sizing & Logistics FAQ */}
      <FaqSection />

      {/* 10. Section 8: Luxury Flagship Footer */}
      <Footer />

      {/* 11. Sliding Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        currency={currency}
      />

      {/* 12. Global Toast Notification */}
      {showToast && (
        <div className="fixed top-20 sm:top-24 right-4 sm:right-10 z-[200] flex items-center gap-3 p-4 rounded-2xl bg-black/95 text-white border border-white/30 backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-10 h-10 rounded-xl bg-lime-400 flex items-center justify-center text-black font-black">
            <Check size={20} strokeWidth={3} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-lime-300">
              ADDED TO YOUR BAG
            </div>
            <div className="text-xs font-medium text-white/90">{toastMessage}</div>
          </div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="ml-2 text-white/60 hover:text-white text-xs font-mono px-2 py-1 rounded-md bg-white/10"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
