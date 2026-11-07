'use-client';


export default function Sustainability() {
    return (
          <section id="features" className="bg-stone-100 py-24 border-y border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Our Commitment</span>
                <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-2 mb-6">Designed to last a lifetime, not just a season.</h2>
                <p className="text-stone-600 font-light leading-relaxed mb-6">
                  We reject fast fashion in favor of conscious craftsmanship. Every piece in our collection is meticulously constructed using traceable organic fibers, artisan weaving techniques, and zero-waste patterns.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-stone-200">
                  <div>
                    <h4 className="text-2xl font-serif font-bold text-stone-900">100%</h4>
                    <p className="text-xs text-stone-500 mt-1">Certified Organic Materials</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-serif font-bold text-stone-900">Zero</h4>
                    <p className="text-xs text-stone-500 mt-1">Single-Use Plastic Packaging</p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000" 
                  alt="Atelier workshop" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
    );
}
    