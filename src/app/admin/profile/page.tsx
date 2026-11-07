"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, ShieldCheck, Package, LogOut, ArrowRight, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/userClient";
import Cookies from "js-cookie";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Contoh mengambil data profil user yang sedang login dari backend (Opsional jika Anda sudah punya endpoint /auth/me)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Sesuaikan endpoint ini dengan backend Go Fiber Anda jika ada (misal: /auth/me atau /users/profile)
        const response = await api.get("/profile"); 
        setUser(response.data.data);
      } catch (error) {
        console.error("Gagal memuat profil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      // Panggil endpoint logout backend untuk menghapus cookie HTTPOnly
      await api.delete("/auth/logout");
      Cookies.remove("email");
      Cookies.remove("name");
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      // Bersihkan session storage / state lokal lalu arahkan ke login
      sessionStorage.clear();
      router.push("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center">
        <p className="text-xs uppercase tracking-widest text-stone-500 animate-pulse">Loading collection...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-amber-500 selection:text-stone-950">
      
      {/* Konten Utama Profile */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 my-10">
        
        {/* Header Section */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-800 pb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white mb-1">
              My Profile
            </h1>
            <p className="text-xs text-stone-400 font-light">
              Manage your personal details, privacy, and account security.
            </p>
          </div>
          <button
            onClick={() => router.push("/orders")}
            className="inline-flex items-center justify-center gap-2 bg-stone-900 border border-stone-800 hover:border-amber-500/50 px-5 py-3 rounded-xl text-xs uppercase tracking-wider text-stone-300 transition-all"
          >
            <Package className="w-4 h-4 text-amber-500" />
            <span>Riwayat Pesanan</span>
          </button>
        </div>

        {/* Grid Informasi Akun */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card Ringkasan Avatar / Info Singkat */}
          <div className="bg-stone-900 border border-stone-800/80 rounded-3xl p-6 text-center flex flex-col items-center justify-center shadow-xl">
            <div className="w-20 h-20 rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center text-amber-500 mb-4 shadow-inner">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-sm font-medium text-white mb-1">
              {user?.name || "Valued Customer"}
            </h2>
            <p className="text-xs text-stone-500 font-light mb-4">
              {user?.email || "customer@example.com"}
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <ShieldCheck className="w-3 h-3" />
              Verified Member
            </span>
          </div>

          {/* Card Detail Informasi */}
          <div className="md:col-span-2 bg-stone-900 border border-stone-800/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="text-xs uppercase tracking-wider text-stone-400 font-medium border-b border-stone-800 pb-3">
              Personal Information
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-stone-800/50">
                <span className="text-xs text-stone-500 uppercase tracking-wider">Full Name</span>
                <span className="text-stone-200 font-medium">{user?.name || "-"}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-stone-800/50">
                <span className="text-xs text-stone-500 uppercase tracking-wider">Email Address</span>
                <span className="text-stone-200 font-medium">{user?.email || "-"}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-stone-800/50">
                <span className="text-xs text-stone-500 uppercase tracking-wider">Account Role</span>
                <span className="text-amber-500 font-medium uppercase text-xs">{user?.role || "Customer"}</span>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLogout}
                className="w-full bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-900/40 font-medium py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}