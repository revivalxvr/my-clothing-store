'use client';

import { RefreshCw, ShieldCheck, Truck } from "lucide-react";

export default function Blog()  {
    return(
          <section className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 py-10 transition-colors">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-800 dark:text-stone-200">
                          <Truck className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-900 dark:text-white">Complimentary Global Shipping</h3>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">On orders over $150 worldwide.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-800 dark:text-stone-200">
                          <RefreshCw className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-900 dark:text-white">Seamless 30-Day Returns</h3>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Hassle-free exchanges and returns.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-800 dark:text-stone-200">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-900 dark:text-white">Ethically & Sustainably Sourced</h3>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">100% certified organic fibers.</p>
                        </div>
                      </div>
                    </div>
                  </section>
    )
};