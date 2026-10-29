import React, { useState } from 'react';
import {
  ShoppingBag,
  Volume2,
  VolumeX,
  Search,
  Globe,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { CurrencyCode, CURRENCIES } from '../types/store';

import { sound } from '../utils/sound';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  currency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  isMuted: boolean;
  onToggleSound: () => void;
}

export default function Navbar({
  cartCount,
  onOpenCart,
  currency,
  onCurrencyChange,
  isMuted,
  onToggleSound,
}: NavbarProps) {
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: '3D HERO', href: '#hero' },
    { label: '3D SPATIAL LAB', href: '#spatial-lab' },
    { label: 'LAB SPECS', href: '#specs' },
    { label: 'SS-26 VAULT', href: '#vault' },
    { label: 'CUSTOM STUDIO', href: '#customizer' },
    { label: 'EDITORIAL', href: '#lookbook' },
    { label: 'REVIEWS', href: '#reviews' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    sound.playClick();
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 inset-x-0 z-40 bg-black/65 backdrop-blur-2xl border-b border-white/10 text-white transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-4">
          <a
            href="#hero"
            onClick={(e) => handleScrollTo(e, '#hero')}
            className="flex flex-col group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span
                className="text-lg sm:text-2xl font-black uppercase tracking-tight text-white group-hover:text-lime-400 transition-colors"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                TOONHUB
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase bg-white/10 text-white border border-white/20">
                NIKE LAB
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-white/50 hidden sm:block">
              PRECISION KINETIC RUNNING
            </span>
          </a>
        </div>

        {/* Center Navigation Links */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-xs font-mono font-bold uppercase tracking-wider text-white/70 hover:text-white hover:text-lime-300 transition-colors relative py-1 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-lime-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right Utility Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-white/90 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Globe size={13} className="text-lime-400" />
              <span>{currency}</span>
              <ChevronDown size={12} className="opacity-60" />
            </button>

            {isCurrencyOpen && (
              <div
                className="absolute right-0 mt-2 w-32 rounded-xl bg-black/95 border border-white/20 backdrop-blur-xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95"
              >
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => {
                      onCurrencyChange(code);
                      setIsCurrencyOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between cursor-pointer transition-colors ${
                      currency === code
                        ? 'bg-lime-400 text-black font-bold'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{code}</span>
                    <span className="opacity-60">{CURRENCIES[code].symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            aria-label="Toggle Sound"
            className="w-9 h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Search Trigger */}
          <a
            href="#vault"
            onClick={(e) => handleScrollTo(e, '#vault')}
            aria-label="Search Vault"
            className="w-9 h-9 rounded-full bg-white/5 border border-white/15 hidden sm:flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Search size={15} />
          </a>

          {/* Cart Drawer Trigger Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="group relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-lime-400 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer ml-1"
          >
            <ShoppingBag size={15} className="transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline font-mono">BAG</span>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-black text-white text-[10px] font-mono group-hover:bg-black">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden px-6 py-5 bg-black/95 border-b border-white/15 backdrop-blur-3xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-sm font-mono font-bold uppercase tracking-wider text-white/80 hover:text-lime-300 py-2 border-b border-white/10"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
