'use-client';

export default function HeaderAuth() {
    return (
        <header className="p-6 md:p-8 flex items-center justify-between border-b border-stone-800/60">
        <a
          href="/"
          className="font-serif text-2xl tracking-widest font-bold uppercase text-stone-100"
        >
          ATELIER<span className="text-amber-500">.</span>
        </a>
        <span className="text-xs tracking-widest uppercase text-stone-400 font-light hidden sm:inline-block">
          Quiet Luxury Essentials
        </span>
      </header>
    )
}