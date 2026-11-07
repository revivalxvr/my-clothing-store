'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/src/components/admin/AdminSidebar';
import Cookies from "js-cookie";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [name, setName] = useState<string | null>(null);

    useEffect(() => {
      const name = Cookies.get("name") || null;
      setName(name);
    }, []);

  return (
    <div className="min-h-screen bg-[#050505] font-sans antialiased text-[#E5E5E5] flex">
      {/* Sidebar ATELIER */}
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'pl-20' : 'pl-72'
        }`}
      >
        {/* Header Bagian Atas (Tetap Statis) */}
        <header className="h-20 border-b border-[#222222] bg-[#0A0A0A]/90 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-xs uppercase tracking-[0.25em] text-[#FFFFFF] font-medium">
              Hello, {name}
            </h1>
            <p className="text-[10px] tracking-[0.15em] text-[#666666]">
              CONTROL PANEL &bull; PORTFOLIO DEMO
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] px-3 py-1 bg-[#141414] border border-[#222222] text-[#D4AF37]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
              ONLINE
            </span>
          </div>
        </header>

        {/* Isi Konten Halaman Admin */}
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}