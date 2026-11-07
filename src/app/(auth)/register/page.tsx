"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { api } from "@/lib/userClient";

import HeaderAuth from "@/src/components/HeaderAuth";
import FooterAuth from "@/src/components/FooterAuth";
import SocialLogin from "@/src/components/SocialLogin";
import AuthSwitcher from "@/src/components/AuthSwitcher";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Konfirmasi kata sandi tidak cocok!");
      return;
    }

    if (!formData.agreeTerms) {
      alert("Silakan setujui Terms of Service dan Privacy Policy.");
      return;
    }

    try {
      // 1. Panggil API register di backend
      await api.post("/auth/register", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      // Bersihkan form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
      });

      // 2. Simpan email pendaftaran ke sessionStorage sebagai proteksi halaman OTP
      sessionStorage.setItem("pending_registration_email", formData.email);

      // 3. Arahkan pengguna ke halaman khusus OTP
      router.push("/register/otp");
    } catch (error: any) {
      console.error("Registration failed:", error);
      alert(
        error.response?.data?.message || "Registrasi gagal, silakan coba lagi."
      );
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-amber-500 selection:text-stone-950">
      <HeaderAuth />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 my-8">
        <div className="w-full max-w-md bg-stone-900 border border-stone-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white mb-2">
              Create Account
            </h1>

            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Join the Atelier membership for exclusive releases and personalized recommendations.
            </p>
          </div>

          <AuthSwitcher mode="register" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-stone-300 font-medium">
                Full Name
              </label>

              <div className="relative">
                <User className="w-4 h-4 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="fullName"
                  required
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Jane Doe"
                  className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-sm pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-amber-500 transition-colors placeholder:text-stone-600"
                />
              </div>
            </div>

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
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-sm pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-amber-500 transition-colors placeholder:text-stone-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-stone-300 font-medium">
                Password
              </label>

              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-sm pl-11 pr-11 py-3.5 rounded-xl focus:outline-none focus:border-amber-500 transition-colors placeholder:text-stone-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
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

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-stone-300 font-medium">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-sm pl-11 pr-11 py-3.5 rounded-xl focus:outline-none focus:border-amber-500 transition-colors placeholder:text-stone-600"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                name="agreeTerms"
                required
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="mt-0.5 rounded border-stone-800 bg-stone-950 accent-amber-500"
              />

              <label
                htmlFor="terms"
                className="text-xs text-stone-400 font-light leading-snug"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-stone-200 underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-stone-200 underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-stone-950 hover:bg-stone-200 font-medium py-4 rounded-xl text-xs tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 group mt-6"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-800" />
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