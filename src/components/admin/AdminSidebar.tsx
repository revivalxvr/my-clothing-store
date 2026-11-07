"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Palette,
  Settings,
  LogOut,
  Gem,
  ChevronLeft,
  ChevronRight,
  FolderTree, // Icon untuk Categories
  User, // Icon untuk Pop-up Account
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { api } from "@/lib/userClient";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Collections", href: "/admin/collections", icon: Palette },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Clientele", href: "/admin/clients", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export default function AdminSidebar({
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // State & Ref untuk Pop-up Menu Profile
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const email = Cookies.get("email") || null;
    setEmail(email);

    const name = Cookies.get("name") || null;
    setName(name);
  }, []);

  // Effect untuk menutup menu pop-up ketika mengklik di luar area profil
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await api.delete("/auth/logout");
      Cookies.remove("email");
      Cookies.remove("name");
      router.push("/login");
    } catch (error) {
      console.error("Logout gagal:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 bg-[#0A0A0A] text-[#E5E5E5] flex flex-col border-r border-[#222222] select-none transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Brand Header */}
      <div
        className={`p-5 border-b border-[#222222] flex items-center h-20 ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex-shrink-0 flex items-center justify-center text-[#D4AF37]">
            <Gem size={18} />
          </div>
          {!isCollapsed && (
            <div className="whitespace-nowrap transition-opacity duration-300">
              <span className="block font-serif tracking-[0.2em] text-base text-[#FFFFFF]">
                ASSENTILAS
              </span>
              <span className="block text-[9px] tracking-[0.25em] uppercase text-[#888888] font-sans">
                Atelier
              </span>
            </div>
          )}
        </div>

        {/* Tombol Toggle Buka/Tutup di dalam Sidebar */}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-[#141414] border border-[#333333] text-[#888888] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[10px] tracking-[0.2em] uppercase text-[#666666] font-medium whitespace-nowrap">
            Main Menu
          </div>
        )}

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group relative flex items-center h-11 px-3.5 rounded-sm text-xs tracking-[0.1em] transition-all duration-200 ${
                isActive
                  ? "bg-[#141414] text-[#D4AF37] font-medium border-l-2 border-[#D4AF37]"
                  : "text-[#999999] hover:text-[#FFFFFF] hover:bg-[#111111]"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <Icon
                size={18}
                className={`flex-shrink-0 transition-colors duration-200 ${
                  isActive
                    ? "text-[#D4AF37]"
                    : "text-[#666666] group-hover:text-[#FFFFFF]"
                }`}
              />

              {!isCollapsed ? (
                <span className="ml-3.5 whitespace-nowrap truncate">
                  {item.name}
                </span>
              ) : (
                /* Tooltip Label Saat Sidebar Dikecilkan */
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#1A1A1A] text-[#FFFFFF] text-xs tracking-wider rounded border border-[#333333] shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-3 border-t border-[#222222] bg-[#070707] relative" ref={menuRef}>
        
        {/* Pop-up Menu Account */}
        {isMenuOpen && (
          <div
            className={`absolute bottom-full mb-2 bg-[#141414] border border-[#222222] rounded shadow-2xl p-1 z-50 animate-in fade-in slide-in-from-bottom-2 ${
              isCollapsed ? "left-3 w-40" : "left-3 right-3"
            }`}
          >
            <Link
              href="/admin/profile"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded text-xs text-[#E5E5E5] hover:text-[#D4AF37] hover:bg-[#1A1A1A] transition-colors"
            >
              <User size={15} className="text-[#D4AF37]" />
              <span className="tracking-[0.1em]">Account</span>
            </Link>
          </div>
        )}

        {/* Profil Trigger Button */}
        <div
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className={`flex items-center py-2 rounded-lg hover:bg-[#141414] transition-colors cursor-pointer group ${
            isCollapsed ? "justify-center" : "px-2 gap-3"
          }`}
          title={isCollapsed ? "Account Menu" : undefined}
        >
          <div className="w-8 h-8 rounded-full bg-[#222222] flex-shrink-0 flex items-center justify-center text-xs font-serif text-[#D4AF37] border border-[#333333] group-hover:border-[#D4AF37]/50 transition-colors">
            RX
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap text-left">
              <p className="text-xs text-[#FFFFFF] group-hover:text-[#D4AF37] capitalize tracking-wider truncate transition-colors">
                {name ?? "...has been logout"}
              </p>
              <p className="text-[9px] text-[#777777] lowercase tracking-widest truncate">
                {email ?? "...has been logout"}
              </p>
            </div>
          )}
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`w-full flex items-center h-9 mt-1 rounded text-xs tracking-[0.1em] text-[#888888] hover:text-[#ff4d4d] hover:bg-[#141414] transition-colors disabled:opacity-50 ${
            isCollapsed ? "justify-center" : "px-2.5 gap-3"
          }`}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!isCollapsed && (
            <span>{isLoggingOut ? "Logging out..." : "Sign Out"}</span>
          )}
        </button>
      </div>
    </aside>
  );
}