 'use client';

type FooterProps = {
  onSubscribe: () => void;
};

export default function Footer({ onSubscribe }: FooterProps) {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div className="space-y-4">
          <h3 className="text-2xl font-serif font-bold text-white tracking-widest">
            ATELIER
          </h3>
          <p className="text-xs text-stone-400 font-light leading-relaxed">
            Quiet luxury essentials crafted with meticulous attention to detail and sustainable materials for the modern wardrobe.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs font-light">
            <li>
              <a href="#shop" className="hover:text-white transition-colors">
                New Arrivals
              </a>
            </li>
            <li>
              <a href="#shop" className="hover:text-white transition-colors">
                Best Sellers
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-white transition-colors">
                Sustainability
              </a>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Customer Care
          </h4>
          <ul className="space-y-2 text-xs font-light">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Shipping &amp; Delivery
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Exchanges &amp; Returns
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Care Instructions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Contact Atelier
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Newsletter
          </h4>
          <p className="text-xs text-stone-400 font-light mb-4">
            Subscribe to receive private collection access and seasonal updates.
          </p>

          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
              className="bg-stone-800 border border-stone-700 text-xs px-4 py-3 rounded-l-xl w-full focus:outline-none text-white"
            />

            <button
              type="button"
              onClick={onSubscribe}
              className="bg-white text-stone-900 px-5 rounded-r-xl text-xs font-semibold hover:bg-stone-100 transition-colors"
            >
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
        <p>&copy; 2026 ATELIER Studio. All rights reserved.</p>

        <div className="flex gap-6 mt-4 sm:mt-0">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}