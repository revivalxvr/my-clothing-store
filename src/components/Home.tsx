'use client';

import { Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <header className="relative bg-stone-900 text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-40 mix-blend-overlay">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1800"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 flex flex-col items-start justify-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs uppercase tracking-widest text-amber-300 mb-6 border border-white/10">
          <Sparkles className="w-3.5 h-3.5" />
          Autumn / Winter 2026 Collection
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif max-w-2xl leading-tight mb-6">
          Quiet Luxury, Crafted for Eternity.
        </h1>

        <p className="text-stone-300 text-base sm:text-lg max-w-xl mb-10 font-light leading-relaxed">
          Discover uncompromising quality with our sustainable,
          ethically sourced wardrobe essentials designed for
          modern elegance.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a
            href="#shop"
            className="bg-white text-stone-900 hover:bg-stone-100 px-8 py-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            Explore Collection
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#features"
            className="bg-transparent hover:bg-white/10 text-white border border-white/30 px-8 py-4 rounded-full font-medium text-sm flex items-center justify-center transition-all"
          >
            Our Philosophy
          </a>
        </div>
      </div>
    </header>
  );
}
