import React, { useState } from 'react';
import {
  ArrowRight,
  Flame,
  CheckCircle,
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="relative bg-[#050505] text-white border-t border-white/10 select-none overflow-hidden pt-20 pb-12">
      {/* Top VIP Drop Pass Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-20">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#141414] via-[#1a1a1a] to-[#141414] border border-white/15 p-8 sm:p-14 overflow-hidden shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={15} className="text-lime-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-lime-400">
                  SECRET DROP PASS MEMBERSHIP
                </span>
              </div>
              <h3
                className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-3"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                UNLOCK SS-26 VAULT ACCESS
              </h3>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed max-w-lg">
                Join 18,000+ verified sneakerheads. Receive SMS allocation notifications 15 minutes before public global release. Zero spam. 100% priority.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="p-4 rounded-2xl bg-lime-400/20 border border-lime-400/40 text-lime-300 flex items-center gap-2.5 font-mono text-xs">
                  <CheckCircle size={18} className="text-lime-400" />
                  <span>VIP DROP PASS ACTIVATED // CHECK YOUR EMAIL</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL ADDRESS"
                    className="flex-1 px-4 py-3.5 rounded-2xl bg-black/60 border border-white/20 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-lime-400 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-wider hover:bg-lime-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    style={{ fontFamily: "'Anton', sans-serif", fontSize: '15px' }}
                  >
                    <span>CLAIM PASS</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-10 pb-16 border-b border-white/10 text-xs font-mono">
        <div>
          <div className="text-white font-bold uppercase mb-4 tracking-wider text-sm">
            COLLECTION VAULT
          </div>
          <ul className="space-y-2.5 text-white/60">
            <li><a href="#vault" className="hover:text-lime-400 transition-colors">Volt Matrix Edition</a></li>
            <li><a href="#vault" className="hover:text-lime-400 transition-colors">Triple Obsidian Cyber</a></li>
            <li><a href="#vault" className="hover:text-lime-400 transition-colors">Solar Amber Edition</a></li>
            <li><a href="#vault" className="hover:text-lime-400 transition-colors">Titanium Platinum</a></li>
            <li><a href="#vault" className="hover:text-lime-400 transition-colors">Glitch Neon Aqua</a></li>
            <li><a href="#vault" className="hover:text-lime-400 transition-colors">Midnight Stealth Core</a></li>
          </ul>
        </div>

        <div>
          <div className="text-white font-bold uppercase mb-4 tracking-wider text-sm">
            INNOVATION LAB
          </div>
          <ul className="space-y-2.5 text-white/60">
            <li><a href="#specs" className="hover:text-lime-400 transition-colors">Zoom Air Dual Pods</a></li>
            <li><a href="#specs" className="hover:text-lime-400 transition-colors">3D TPU Lattice Matrix</a></li>
            <li><a href="#specs" className="hover:text-lime-400 transition-colors">Monomesh Airflow CFM</a></li>
            <li><a href="#specs" className="hover:text-lime-400 transition-colors">BRS 1000 Carbon Outsole</a></li>
            <li><a href="#customizer" className="hover:text-lime-400 transition-colors">Nike By You Bespoke</a></li>
          </ul>
        </div>

        <div>
          <div className="text-white font-bold uppercase mb-4 tracking-wider text-sm">
            CONCIERGE & SUPPORT
          </div>
          <ul className="space-y-2.5 text-white/60">
            <li><a href="#faq" className="hover:text-lime-400 transition-colors">Sizing & Fit Advice</a></li>
            <li><a href="#faq" className="hover:text-lime-400 transition-colors">Authenticity Guarantee</a></li>
            <li><a href="#faq" className="hover:text-lime-400 transition-colors">DHL 2-Day Express Track</a></li>
            <li><a href="#faq" className="hover:text-lime-400 transition-colors">30-Day Global Returns</a></li>
            <li><a href="#faq" className="hover:text-lime-400 transition-colors">B2B & Wholesale Inquiries</a></li>
          </ul>
        </div>

        <div>
          <div className="text-white font-bold uppercase mb-4 tracking-wider text-sm">
            GLOBAL LAB LOCATIONS
          </div>
          <ul className="space-y-2.5 text-white/60">
            <li>BEAVERTON // OREGON LAB</li>
            <li>SHIBUYA // TOKYO DESIGN STUDIO</li>
            <li>MITTE // BERLIN EXPERIMENTAL</li>
            <li>SOHO // NEW YORK POP-UP</li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Payment Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-white/50">
        <div>
          © 2026 TOONHUB // NIKE LAB. ALL RIGHTS RESERVED. POWERED BY SHOPIFY PLUS.
        </div>

        <div className="flex items-center gap-4 text-white/70">
          <span className="hover:text-white cursor-pointer">PRIVACY POLICY</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer">TERMS OF SERVICE</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer">AUTHENTICITY CERTIFICATE</span>
        </div>
      </div>
    </footer>
  );
}
