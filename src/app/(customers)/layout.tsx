"use client";

import { useState, useEffect } from "react";
import NavbarLoggedIn from "@/src/components/customers/navbar/NavbarCustomers";
import CartDrawer, { type CartItem } from "@/src/components/CartDrawer";
import { CartProvider } from "@/src/context/CartContext";
import Footer from "@/src/components/Footer";
import { cartApi } from "@/lib/cartClient";
import { checkoutApi } from "@/lib/checkoutClient";
import { api } from "@/lib/userClient";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Sparkles } from "lucide-react";
import { Product } from "@/src/components/ProductSection";

// Deklarasi global agar TypeScript mengenali objek `window.snap` dari Midtrans
declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState("");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // Muat script Midtrans Snap secara global untuk semua halaman customer
  useEffect(() => {
    const clientKey = process.env.MIDTRANS_CLIENT_KEY || "";
    const scriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Fetch Cart secara global di layout agar jumlah badge di navbar selalu sinkron
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartApi.get("/cart");
        const result = response.data || response;
        const items = Array.isArray(result) ? result : result.data || [];

        const formattedItems = items.map((item: any) => ({
          id: item.product_id,
          name: item.product_name,
          price: Number(item.price || 0),
          qty: Number(item.quantity || 1),
          image: item.image || "",
          stock: item.stock,
          sub_total: item.sub_total,
        }));

        setCart(formattedItems);
        setSelectedItemIds(formattedItems.map((item: CartItem) => item.id));
      } catch (error) {
        console.error("Gagal mengambil data keranjang:", error);
      }
    };

    fetchCart();
  }, []);

  // Handler centang/uncentang item individual
  const handleToggleSelectItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  // Handler centang/uncentang semua item sekaligus
  const handleToggleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedItemIds(cart.map((item) => item.id));
    } else {
      setSelectedItemIds([]);
    }
  };

  // Handler hapus item dari keranjang
  const handleRemoveItem = async (productId: string) => {
    try {
      await cartApi.delete(`/cart/${productId}`);
      setCart((prev) => prev.filter((item) => item.id !== productId));
      setSelectedItemIds((prev) => prev.filter((id) => id !== productId));
      showNotification("Produk berhasil dihapus dari keranjang");
    } catch (error) {
      console.error("Gagal menghapus item:", error);
      showNotification("Gagal menghapus produk dari keranjang");
    }
  };

  // Handler Checkout Global
  const handleCheckout = async () => {
    try {
      const selectedCartItems = cart.filter((item) =>
        selectedItemIds.includes(item.id),
      );

      if (selectedCartItems.length === 0) {
        showNotification("Pilih minimal satu barang untuk checkout!");
        return;
      }

      const grossAmount = selectedCartItems.reduce(
        (sum, item) => sum + item.price * item.qty,
        0,
      );

      const orderPayload = {
        order: { gross_amount: grossAmount },
        product_orders: selectedCartItems.map((item) => ({
          product_id: item.id,
          quantity: item.qty,
          price: item.price,
        })),
      };

      const response = await checkoutApi.post("/orders", orderPayload);
      const responseData = response.data || response;
      const snapToken = responseData.data?.token;

      if (!snapToken) {
        throw new Error("Snap token tidak ditemukan dari server");
      }

      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: function (result) {
            showNotification("Pembayaran berhasil!");
            setCart((prev) =>
              prev.filter((item) => !selectedItemIds.includes(item.id)),
            );
            setSelectedItemIds([]);
            setIsCartOpen(false);
          },
          onPending: function (result) {
            showNotification("Menunggu pembayaran selesai...");
            setCart((prev) =>
              prev.filter((item) => !selectedItemIds.includes(item.id)),
            );
            setSelectedItemIds([]);
            setIsCartOpen(false);
          },
          onError: function (result) {
            showNotification("Pembayaran gagal!");
          },
          onClose: function () {
            showNotification("Popup pembayaran ditutup.");
          },
        });
      }
    } catch (error) {
      console.error("Gagal melakukan checkout:", error);
      showNotification("Checkout gagal, silakan coba lagi.");
    }
  };

  // Handler Logout Global
  const handleLogout = async () => {
    try {
      await api.delete("/auth/logout");
      Cookies.remove("name");
      Cookies.remove("email");
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");

      showNotification("Berhasil keluar dari akun.");
      sessionStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      console.error("Gagal melakukan logout:", error);
      showNotification("Gagal logout, silakan coba lagi.");
    }
  };

  const handleAddToCart = async (product: Product, quantity: number = 1) => {
    try {
      await cartApi.post("/cart", {
        product_id: product.id,
        quantity: quantity,
      });

      // Update state cart secara real-time di layout tanpa reload!
      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, qty: item.qty + quantity }
              : item,
          );
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            qty: quantity,
            image: product.image,
            stock: product.stock,
          },
        ];
      });

      // Otomatis tandai item yang baru ditambahkan
      setSelectedItemIds((prev) =>
        prev.includes(product.id) ? prev : [...prev, product.id],
      );

      // Tampilkan notifikasi toast di layout!
      showNotification(`Added ${quantity}x ${product.name} to cart`);
    } catch (error) {
      console.error("Gagal menambahkan produk ke keranjang:", error);
      showNotification("Gagal menambahkan produk ke keranjang");
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-stone-900 selection:text-white">
      {/* Global Notification Banner */}
      <CartProvider value={{ addToCart: handleAddToCart }}>
        <div>
          {/* Banner Notifikasi */}
          {notification && (
            <div className="fixed top-20 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in border border-stone-800">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-medium">{notification}</span>
            </div>
          )}
        </div>

        {/* Navbar Global */}
        <NavbarLoggedIn
          cart={cart}
          activeTab="preview"
          onOpenCart={() => setIsCartOpen(true)}
          onToggleActiveTab={() => {}}
          onLogout={handleLogout}
        />

        {/* Halaman Konten (Children) */}
        <main>{children}</main>

        {/* Cart Drawer Global */}
        <CartDrawer
          isOpen={isCartOpen}
          cart={cart}
          selectedItemIds={selectedItemIds}
          onToggleSelectItem={handleToggleSelectItem}
          onToggleSelectAll={handleToggleSelectAll}
          onRemoveItem={handleRemoveItem}
          onClose={() => setIsCartOpen(false)}
          onCheckout={handleCheckout}
        />
      </CartProvider>

      <Footer
        onSubscribe={() =>
          showNotification("Successfully subscribed to newsletter!")
        }
      />
    </div>
  );
}
