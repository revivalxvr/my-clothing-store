'use client';

import { RefreshCw, ShieldCheck, Truck } from "lucide-react";

export default function Blog()  {
    return(
          <section className="bg-white border-b border-stone-200 py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-stone-100 rounded-2xl text-stone-800">
                          <Truck className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-900">Complimentary Global Shipping</h3>
                          <p className="text-xs text-stone-500 mt-0.5">On orders over $150 worldwide.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-stone-100 rounded-2xl text-stone-800">
                          <RefreshCw className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-900">Seamless 30-Day Returns</h3>
                          <p className="text-xs text-stone-500 mt-0.5">Hassle-free exchanges and returns.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-stone-100 rounded-2xl text-stone-800">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-stone-900">Ethically & Sustainably Sourced</h3>
                          <p className="text-xs text-stone-500 mt-0.5">100% certified organic fibers.</p>
                        </div>
                      </div>
                    </div>
                  </section>
    )
};