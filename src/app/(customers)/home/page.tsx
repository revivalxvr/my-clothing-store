"use client";

import Home from "@/src/components/Home";
import ProductSection from "@/src/components/ProductSection";
import Blog from "@/src/components/Blog";
import Sustainability from "@/src/components/Sustainability";
import { useCart } from "@/src/context/CartContext";

export default function HomePage() {
  const { addToCart } = useCart();

  return (
    <div>
      <main>
        <Home />
        <Blog />
        {/* Cukup teruskan addToCart dari Context ke ProductSection */}
        <ProductSection onAddToCart={addToCart} />
        <Sustainability />
      </main>


    </div>
  );
}