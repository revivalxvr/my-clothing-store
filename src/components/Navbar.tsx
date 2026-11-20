'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from 'next-themes';

type CartItem = {
  id: number;
  qty: number;
};

type NavbarProps = {
  cart: CartItem[];
  activeTab: 'preview';
  onOpenCart: () => void;
  onToggleActiveTab: () => void;
};

export default function Navbar({
  cart,
  activeTab,
  onOpenCart,
  onToggleActiveTab,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Mencegah hydration mismatch pada next-themes
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <a
            href="/"
            className="text-2xl font-serif tracking-widest font-bold text-stone-900 dark:text-white"
          >
            ATELIER
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-300">
            <a href="#shop" className="hover:text-stone-900 dark:hover:text-white transition-colors">
              New Arrivals
            </a>
            <a href="#shop" className="hover:text-stone-900 dark:hover:text-white transition-colors">
              Collections
            </a>
            <a href="#features" className="hover:text-stone-900 dark:hover:text-white transition-colors">
              Sustainability
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-stone-100 dark:bg-stone-800 rounded-full px-4 py-2 border border-stone-200 dark:border-stone-700 w-64">
            <Search className="w-4 h-4 text-stone-400 mr-2" />
            <input
              type="text"
              placeholder="Search garments..."
              className="bg-transparent text-xs w-full focus:outline-none text-stone-800 dark:text-stone-100 placeholder:text-stone-400"
            />
          </div>
   
          <button
            onClick={() => {
                window.location.href = '/login';
            }}
            className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 px-5 py-2.5 rounded-full text-xs font-semibold transition-colors"
          >
            Login
          </button>

          {/* Tombol Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Theme"
              className="relative p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 transition-colors text-stone-800 dark:text-stone-200"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-stone-800" />
              )}
            </button>
          )}

          <button
            onClick={onOpenCart}
            aria-label="Open shopping cart"
            className="relative p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 transition-colors text-stone-800 dark:text-stone-200"
          >
            <ShoppingBag className="w-5 h-5" />

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-6 py-4 space-y-3">
          <a
            href="#shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-stone-700 dark:text-stone-200 font-medium"
          >
            New Arrivals
          </a>
          <a
            href="#shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-stone-700 dark:text-stone-200 font-medium"
          >
            Collections
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-stone-700 dark:text-stone-200 font-medium"
          >
            Sustainability
          </a>
        </div>
      )}
    </nav>
  );
}