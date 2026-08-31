import { useState } from 'react';
import { HelpCircle, Plus, Minus } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'SIZING & FIT',
    q: 'How does the Nike Zoom Vomero 5 fit compared to standard runners?',
    a: 'The Nike Zoom Vomero 5 fits 100% True to Size (TTS). The forefoot features an accommodating open-cell mesh with plenty of toe splay room. If you possess extra-wide feet or plan on pairing with thick athletic socks, we recommend ordering half a size up (+0.5).',
  },
  {
    category: 'AUTHENTICITY',
    q: 'How do you guarantee 100% shoe authenticity and provenance?',
    a: 'Every single pair in the TOONHUB Vault is sourced directly from Nike authorized lab allocations and verified by our in-house authentication specialists with NFC microchips, blacklight stitching audits, and serialized provenance cards.',
  },
  {
    category: 'SHIPPING & LOGISTICS',
    q: 'What are the global DHL Express shipping transit times?',
    a: 'All orders placed before 3:00 PM EST ship same-day via DHL Express Worldwide. Transit times are 2 Business Days to USA/Canada, 2-3 Business Days to Europe/UK, and 3-4 Business Days to Asia-Pacific. Tracking is sent immediately via SMS and Email.',
  },
  {
    category: 'RETURNS & EXCHANGES',
    q: 'What is your return and exchange policy?',
    a: 'We provide a 30-Day Hassle-Free Global Return Guarantee. Pairs must be in unworn, factory-laced condition with original shoe box and tags intact. Free return shipping labels are generated automatically inside your account portal.',
  },
  {
    category: 'CUSTOM ORDERS',
    q: 'How long does a "NIKE BY YOU // TOONHUB LAB" custom order take?',
    a: 'Custom bespoke builds are assembled and hand-finished in our Oregon customization workshop within 5-7 business days before shipping with prioritized DHL Express delivery.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="relative py-24 sm:py-32 bg-black text-white border-b border-white/10 select-none"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 mb-2">
            <HelpCircle size={15} className="text-lime-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-lime-400">
              CONCIERGE & FREQUENTLY ASKED QUESTIONS
            </span>
          </div>
          <h2
            className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            EVERYTHING YOU NEED TO KNOW
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#121212] border-lime-400/50 shadow-lg'
                    : 'bg-[#0a0a0a] border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-lime-300 w-fit">
                      {faq.category}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-white">
                      {faq.q}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-lime-400 shrink-0">
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-white/80 leading-relaxed font-normal border-t border-white/5 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
