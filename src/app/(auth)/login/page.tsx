"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import HeaderAuth from "@/src/components/HeaderAuth"
import FooterAuth from "@/src/components/FooterAuth"
import SocialLogin from "@/src/components/SocialLogin";
import AuthSwitcher from '@/src/components/AuthSwitcher';
import { api } from "@/lib/userClient";
import Cookie from "js-cookie";

export default function AuthPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Form State (Hanya butuh email & password untuk login)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.email || !formData.password) {
      setErrorMessage("Mohon isi email dan kata sandi.");
      return;
    }

    setIsLoading(true);

    try {
      // Panggil endpoint login backend
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Ambil data role langsung dari struktur response.data.data
      const userRole = response.data.data?.role; 

     //ambil data dan simpan di cookie
      Cookie.set("email", response.data.data.email);
      Cookie.set("name", response.data.data.name);
  
      // Arahkan berdasarkan role yang didapat dari API
      switch (userRole?.toUpperCase()) {
        case "ADMIN":
          router.push("/admin/dashboard");
          break;
        case "USER":
          router.push("/home");
          break;
        default:
          // Fallback default jika role lain atau tidak terdefinisi
          router.push("/testing");
          break;
      }

    } catch (error: any) {
      console.error("Login failed:", error);
      setErrorMessage(
        error.response?.data?.message || "Email atau kata sandi salah."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-amber-500 selection:text-stone-950">
      <HeaderAuth />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 my-8">
        <div className="w-full max-w-md bg-stone-900 border border-stone-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-sm">
          
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Enter your credentials to access your private collection and orders 
            </p>
          </div>

          <AuthSwitcher mode="login" />

          <form onSubmit={handleSubmit} className="space-y-5">
           
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-stone-300 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-sm pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-amber-500 transition-colors placeholder:text-stone-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider text-stone-300 font-medium">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-amber-500 hover:underline font-light"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-sm pl-11 pr-11 py-3.5 rounded-xl focus:outline-none focus:border-amber-500 transition-colors placeholder:text-stone-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                className="rounded border-stone-800 bg-stone-950 text-amber-500 focus:ring-0 accent-amber-500"
              />
              <label htmlFor="remember" className="text-xs text-stone-400 font-light">
                Remember me on this device
              </label>
            </div>

            {/* Pesan Error */}
            {errorMessage && (
              <p className="text-xs text-red-400 text-center">{errorMessage}</p>
            )}
          
            <button
              disabled={isLoading}
              className="w-full bg-white text-stone-950 hover:bg-stone-200 disabled:opacity-60 font-medium py-4 rounded-xl text-xs tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 group mt-6"
            >
              <span>{isLoading ? "Signing in..." : "Login"}</span>
              {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-stone-900 px-3 text-stone-500 tracking-wider">
                Or Continue With
              </span>
            </div>
          </div>

          <SocialLogin />
        </div>
      </main>

      <FooterAuth />
    </div>
  );
}