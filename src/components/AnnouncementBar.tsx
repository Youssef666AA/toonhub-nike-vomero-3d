import { Zap, ShieldCheck, Truck, Flame } from 'lucide-react';

export default function AnnouncementBar() {
  const items = [
    { icon: Flame, text: 'SS-26 TOONHUB DROP LIVE // LIMITED ALLOCATION' },
    { icon: Truck, text: 'FREE WORLDWIDE 2-DAY DHL EXPRESS ON ORDERS OVER $200' },
    { icon: ShieldCheck, text: '100% AUTHENTICATED & SERIAL NUMBER VERIFIED' },
    { icon: Zap, text: 'ENERGY RETURN ZOOM AIR DUAL-POD ARCHITECTURE' },
    { icon: Flame, text: 'GLOBAL DROP 01 // ONLY 24 PAIRS REMAINING IN VAULT' },
  ];

  return (
    <aside
      aria-label="Store Announcement Ticker"
      className="relative z-50 w-full overflow-hidden bg-black py-2.5 border-b border-white/10 text-white select-none"
    >
      <div className="flex w-max animate-[marquee_25s_linear_infinite] items-center gap-12 whitespace-nowrap text-[11px] font-mono font-bold tracking-[0.2em] uppercase">
        {[...items, ...items, ...items].map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center gap-2.5 opacity-90 hover:opacity-100 transition-opacity">
              <Icon size={13} className="text-lime-400 shrink-0" />
              <span>{item.text}</span>
              <span className="text-white/30 text-xs mx-3">/</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
