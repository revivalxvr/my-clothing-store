"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import Navbar from "@/src/components/Navbar";
import Home from "@/src/components/Home";
import ProductSection from "@/src/components/ProductSection";
import CartDrawer, { type CartItem } from "@/src/components/CartDrawer";
import Blog from "@/src/components/Blog";
import Sustainability from "@/src/components/Sustainability";
import Footer from "@/src/components/Footer";

export default function App() {
  const [activeTab, setActiveTab] = useState("preview");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState("");



  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showNotification(`Added ${product.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-stone-900 selection:text-white">
      {}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in border border-stone-800">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}
      <Navbar
        cart={cart}
        activeTab={activeTab as "preview"}
        onOpenCart={() => setIsCartOpen(true)}
        onToggleActiveTab={() => {}}
      />

      <main>
        <Home />
        <Blog />
        <ProductSection onAddToCart={addToCart} />
        <Sustainability />
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          showNotification("Proceeding to secure checkout...");
          setIsCartOpen(false);
        }}
      />

      <Footer
        onSubscribe={() =>
          showNotification("Successfully subscribed to newsletter!")
        }
      />
    </div>
  );
}
