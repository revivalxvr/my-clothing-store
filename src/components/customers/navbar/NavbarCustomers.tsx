'use client';

import { useEffect, useState, useRef } from 'react';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import Cookies from "js-cookie";

type CartItem = {
  id: string | number;
  qty: number;
};

type UserType = {
  name: string;
  email?: string;
  avatarUrl?: string;
};

type NavbarProps = {
  cart: CartItem[];
  activeTab: 'preview';
  user?: UserType;
  onOpenCart: () => void;
  onToggleActiveTab: () => void;
  onLogout?: () => void;
};

export default function NavbarLoggedIn({
  cart,
  activeTab,
  user = { name: 'Guest' },
  onOpenCart,
  onToggleActiveTab,
  onLogout,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  // Ref untuk mendeteksi klik di luar dropdown profil
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cookieName = Cookies.get("name") || null;
    setName(cookieName);

    const cookieEmail = Cookies.get("email") || null;
    setEmail(cookieEmail);
  }, []);

  // Tutup dropdown otomatis jika pengguna mengklik di luar elemen dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  // Menentukan data user final (prioritas dari cookie, lalu prop, lalu fallback)
  const currentName = name || user.name;
  const currentEmail = email || user.email;

  const cartCount = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-600 hover:text-stone-900"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <a
            href="#"
            className="text-2xl font-serif tracking-widest font-bold text-stone-900"
          >
            ATELIER
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <a href="#shop" className="hover:text-stone-900 transition-colors">
              New Arrivals
            </a>
            <a href="#shop" className="hover:text-stone-900 transition-colors">
              Collections
            </a>
            <a href="#features" className="hover:text-stone-900 transition-colors">
              Sustainability
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* <div className="hidden sm:flex items-center bg-stone-100 rounded-full px-4 py-2 border border-stone-200 w-64">
            <Search className="w-4 h-4 text-stone-400 mr-2" />
            <input
              type="text"
              placeholder="Search garments..."
              className="bg-transparent text-xs w-full focus:outline-none text-stone-800"
            />
          </div> */}

          {/* User Profile Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-2 rounded-full transition-colors text-xs font-medium"
            >
              <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={currentName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <span className="hidden sm:inline font-semibold max-w-[100px] truncate">
                {currentName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
            </button>

            {/* Dropdown Menu ketika profil diklik */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-stone-100">
                  <p className="text-xs font-semibold text-stone-900 truncate">
                    {currentName}
                  </p>
                  {currentEmail && (
                    <p className="text-[10px] text-stone-500 truncate">
                      {currentEmail}
                    </p>
                  )}
                </div>
                <a
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  My Account
                </a>
                <a
                  href="/orders"
                  className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  My Orders
                </a>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onOpenCart}
            aria-label="Open shopping cart"
            className="relative p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-stone-800"
          >
            <ShoppingBag className="w-5 h-5" />

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-stone-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-6 py-4 space-y-3">
          <a
            href="#shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-stone-700 font-medium"
          >
            New Arrivals
          </a>
          <a
            href="#shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-stone-700 font-medium"
          >
            Collections
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-stone-700 font-medium"
          >
            Sustainability
          </a>
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-800">
              Logged in as {currentName}
            </span>
            <button
              onClick={onLogout}
              className="text-xs text-red-600 font-medium hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}