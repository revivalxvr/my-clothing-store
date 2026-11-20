
'use client';

import Link from 'next/link';

type AuthSwitcherProps = {
  mode: 'login' | 'register';
};

export default function AuthSwitcher({ mode }: AuthSwitcherProps) {
  return (
    <div className="grid grid-cols-2 p-1 bg-stone-100 dark:bg-stone-950 rounded-2xl mb-8 border border-stone-200 dark:border-stone-800 transition-colors">
      <Link
        href="/login"
        className={`py-2.5 text-center text-xs font-medium tracking-wider uppercase rounded-xl transition-all ${
          mode === 'login'
            ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-md'
            : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
        }`}
      >
        Sign In
      </Link>

      <Link
        href="/register"
        className={`py-2.5 text-center text-xs font-medium tracking-wider uppercase rounded-xl transition-all ${
          mode === 'register'
            ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-md'
            : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
        }`}
      >
        Register
      </Link>
    </div>
  );
}
