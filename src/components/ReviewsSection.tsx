import { useState } from 'react';
import { Star, CheckCircle, ShieldCheck } from 'lucide-react';
import { ReviewItem } from '../types/store';

const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'MARCUS V.',
    handle: '@kicks_collector_ny',
    location: 'NEW YORK, USA',
    verified: true,
    rating: 5,
    date: '2 DAYS AGO',
    headline: 'THE BEST RETRO-TECH RUNNER ON THE MARKET',
    content:
      'The dual Zoom Air units provide unreal rebound on NYC asphalt. The 3D ribbed cage lockdown gives supreme lateral stability, and the Volt Matrix colorway is even more electric in person. 10/10.',
    shoeColorway: 'Volt Matrix Edition',
    sizeBought: 'US 10.5',
    metrics: { comfort: 10, fit: 'True to Size', support: 9.8 },
  },
  {
    id: 'rev-2',
    author: 'ELENA ROSTOVA',
    handle: '@elena_berlin',
    location: 'BERLIN, GERMANY',
    verified: true,
    rating: 5,
    date: '1 WEEK AGO',
    headline: 'UNMATCHED ALL-DAY COMFORT & HIGH-HEAT AESTHETICS',
    content:
      'I walk 15,000+ steps daily in Berlin. The open-cell monomesh upper keeps feet completely dry and cool even after 10 hours. The packaging, delivery speed, and 3D visualizer experience on this store was world-class.',
    shoeColorway: 'Titanium Platinum',
    sizeBought: 'US 8',
    metrics: { comfort: 9.9, fit: 'True to Size', support: 9.9 },
  },
  {
    id: 'rev-3',
    author: 'TAKUYA S.',
    handle: '@tokyo_stride',
    location: 'TOKYO, JAPAN',
    verified: true,
    rating: 5,
    date: '2 WEEKS AGO',
    headline: 'CYBERPUNK MASTERPIECE WITH LEGIT PERFORMANCE',
    content:
      'The Triple Obsidian Cyber glow swoosh under street lamps looks unbelievable. Segmented waffle outsole makes heel transitions smoother than any modern carbon plate shoe. Fast 2-day international shipping too!',
    shoeColorway: 'Triple Obsidian Cyber',
    sizeBought: 'US 9.5',
    metrics: { comfort: 9.8, fit: 'True to Size', support: 10 },
  },
];

export default function ReviewsSection() {
  const [selectedTag, setSelectedTag] = useState<string>('ALL');

  const tags = ['ALL', 'COMFORT', 'FIT & SIZING', 'DURABILITY', 'STYLING'];

  const filteredReviews = selectedTag === 'ALL'
    ? REVIEWS
    : REVIEWS.filter(() => true);

  return (
    <section
      id="reviews"
      className="relative py-24 sm:py-32 bg-[#0a0a0a] text-white border-b border-white/10 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={15} className="text-lime-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-lime-400">
                VERIFIED COLLECTOR EXPERIENCES
              </span>
            </div>
            <h2
              className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              4.98 / 5.0 RATED BY RUNNERS
            </h2>
          </div>

          <div className="flex items-center gap-1 text-lime-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="#D4FF00" />
            ))}
            <span className="text-sm font-mono font-bold text-white ml-2">
              (1,248 VERIFIED REVIEWS)
            </span>
          </div>
        </div>

        {/* Aggregate Ratings Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xs font-mono text-white/60 uppercase mb-1">CUSHIONING & IMPACT</div>
            <div className="text-3xl font-black text-white font-mono mb-2">9.9 / 10</div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-lime-400 rounded-full" style={{ width: '99%' }} />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xs font-mono text-white/60 uppercase mb-1">LATERAL ARCH SUPPORT</div>
            <div className="text-3xl font-black text-white font-mono mb-2">9.8 / 10</div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-lime-400 rounded-full" style={{ width: '98%' }} />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xs font-mono text-white/60 uppercase mb-1">BREATHABILITY & AIRFLOW</div>
            <div className="text-3xl font-black text-white font-mono mb-2">9.9 / 10</div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-lime-400 rounded-full" style={{ width: '99%' }} />
            </div>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTag(t)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase transition-colors cursor-pointer border ${
                selectedTag === t
                  ? 'bg-lime-400 text-black border-lime-400'
                  : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Individual Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-7 rounded-3xl bg-[#0f0f0f] border border-white/10 flex flex-col justify-between hover:border-white/25 transition-all shadow-xl"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-lime-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#D4FF00" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-white/40">{rev.date}</span>
                </div>

                <h4 className="text-base font-bold text-white mb-2 leading-snug">
                  "{rev.headline}"
                </h4>

                <p className="text-xs text-white/75 leading-relaxed mb-6 font-normal">
                  {rev.content}
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    {rev.author}
                    {rev.verified && <CheckCircle size={13} className="text-lime-400" />}
                  </span>
                  <span className="text-[10px] font-mono text-white/50">{rev.location}</span>
                </div>
                <div className="text-[10px] font-mono text-lime-300">
                  PURCHASED: {rev.shoeColorway} ({rev.sizeBought})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
