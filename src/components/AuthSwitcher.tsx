'use client';

import Link from 'next/link';

type AuthSwitcherProps = {
  mode: 'login' | 'register';
};

export default function AuthSwitcher({ mode }: AuthSwitcherProps) {
  return (
    <div className="grid grid-cols-2 p-1 bg-stone-950 rounded-2xl mb-8 border border-stone-800">
      <Link
        href="/login"
        className={`py-2.5 text-center text-xs font-medium tracking-wider uppercase rounded-xl transition-all ${
          mode === 'login'
            ? 'bg-stone-800 text-white shadow-md'
            : 'text-stone-400 hover:text-white'
        }`}
      >
        Sign In
      </Link>

      <Link
        href="/register"
        className={`py-2.5 text-center text-xs font-medium tracking-wider uppercase rounded-xl transition-all ${
          mode === 'register'
            ? 'bg-stone-800 text-white shadow-md'
            : 'text-stone-400 hover:text-white'
        }`}
      >
        Register
      </Link>
    </div>
  );
}
