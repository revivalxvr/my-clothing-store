'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/userClient';

import HeaderAuth from '@/src/components/HeaderAuth';
import FooterAuth from '@/src/components/FooterAuth';

export default function OtpPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. Proteksi Halaman: Cek apakah ada email pendaftaran tersimpan di session
  useEffect(() => {
    const savedEmail = sessionStorage.getItem('pending_registration_email');

    if (!savedEmail) {
      // Jika diakses langsung tanpa registrasi, tendang kembali ke register
      router.replace('/register');
    } else {
      setEmail(savedEmail);
      setIsInitializing(false);
    }
  }, [router]);

  // Handle Perubahan Input OTP per Kotak
  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);

    setOtp((previous) => {
      const next = [...previous];
      next[index] = digit;
      return next;
    });

    setError('');
    setSuccess('');

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Navigasi Keyboard Input (Backspace & Panah)
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Support Paste 6-Digit OTP Sekaligus
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedCode = e.clipboardData
      .getData('text')
      .replace(/[^0-9]/g, '')
      .slice(0, 6);

    if (!pastedCode) return;

    const digits = Array.from(
      { length: 6 },
      (_, index) => pastedCode[index] ?? ''
    );

    setOtp(digits);
    setError('');
    setSuccess('');

    const focusIndex = Math.min(pastedCode.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  // 2. Handle Submit Verifikasi OTP ke Backend
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Mohon masukkan 6 digit kode OTP dengan lengkap.');
      return;
    }

    setIsVerifying(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/auth/register/verify', {
        email: email,
        otp: otpCode,
      });

      // Bersihkan session storage setelah berhasil verifikasi
      sessionStorage.removeItem('pending_registration_email');

      alert('Verifikasi OTP berhasil! Mengarahkan ke halaman login...');
      router.push('/login');
    } catch (err: any) {
      console.error('OTP Verification failed:', err);
      setError(
        err.response?.data?.message ?? 'Verifikasi OTP gagal. Silakan coba lagi.'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Kembali ke Register Manual
  const handleBackToRegister = () => {
    sessionStorage.removeItem('pending_registration_email');
    router.push('/auth/register');
  };

  // Tampilan loading sementara saat mengecek sesi
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center text-stone-400 text-xs tracking-wider uppercase">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-amber-500 selection:text-stone-950">
      <HeaderAuth />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 my-8">
        <div className="w-full max-w-md bg-stone-900 border border-stone-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-sm text-center">
          {/* Ikon Keamanan */}
          <div className="w-16 h-16 bg-stone-950 border border-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>

          {/* Judul & Email Info */}
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white mb-2">
            Verification Code
          </h1>

          <p className="text-xs text-stone-400 font-light leading-relaxed mb-8">
            We have sent a 6-digit verification code to your email{' '}
            <span className="text-stone-200 font-medium break-all">
              {email}
            </span>
            . Please enter it below.
          </p>

          {/* Form OTP */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  aria-label={`Digit OTP ${index + 1}`}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  disabled={isVerifying}
                  className="w-11 h-12 sm:w-12 sm:h-14 bg-stone-950 border border-stone-800 text-stone-100 text-center text-lg sm:text-xl font-semibold rounded-xl focus:outline-none focus:border-amber-500 transition-colors shadow-inner disabled:opacity-50"
                />
              ))}
            </div>

            {/* Pesan Error & Sukses */}
            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            {success && (
              <p role="status" className="text-sm text-emerald-400">
                {success}
              </p>
            )}

            {/* Tombol Verifikasi */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-white text-stone-950 hover:bg-stone-200 disabled:opacity-60 disabled:cursor-not-allowed font-medium py-4 rounded-xl text-xs tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 group"
            >
              <span>{isVerifying ? 'Verifying...' : 'Verify Code'}</span>
              {!isVerifying && (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>

          {/* Tombol Kembali ke Register */}
          <button
            type="button"
            onClick={handleBackToRegister}
            disabled={isVerifying}
            className="mt-8 text-xs text-stone-400 hover:text-white transition-colors disabled:opacity-50 block mx-auto"
          >
            ← Back to registration
          </button>
        </div>
      </main>

      <FooterAuth />
    </div>
  );
}