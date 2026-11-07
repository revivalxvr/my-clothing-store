"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  ShoppingBag,
  ArrowLeft
} from "lucide-react";
import { checkoutApi } from "@/lib/checkoutClient";
import Link from "next/link";


interface ProductOrder {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  created_at: string;
}

interface Order {
  id: string;
  user_id: string;
  gross_amount: number;
  status: "PAID" | "PENDING" | "CANCELLED" | "EXPIRED";
  payment_method: string;
  payment_url: string;
  created_at: string;
  updated_at: string;
  items: ProductOrder[];
}

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await checkoutApi.get("orders", {
          withCredentials: true,
        });

        if (response.data && response.data.data) {
          setOrders(response.data.data);
        }
      } catch (err: any) {
        console.error("Failed to fetch orders:", err);
        setError("Gagal memuat riwayat pesanan. Silakan coba beberapa saat lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-mono font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Paid
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-mono font-medium">
            <Clock className="w-3.5 h-3.5" /> Awaiting Payment
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-widest bg-zinc-100 text-zinc-600 border border-zinc-200 rounded-full font-mono font-medium">
            <XCircle className="w-3.5 h-3.5" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Navigation / Back Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors font-mono"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        {/* Header Section */}
        <header className="border-b border-zinc-200 pb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-medium mb-1 font-mono">
            ATELIER Luxury Essentials
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-zinc-900 uppercase">
            Orders Archive
          </h1>
          <p className="text-sm text-zinc-500 mt-2">
            Review and track your curated acquisitions.
          </p>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-24">
            <div className="inline-block w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mb-3"></div>
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-mono">Loading acquisitions...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md font-mono">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-24 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
            <ShoppingBag className="w-10 h-10 mx-auto text-zinc-300 mb-3 stroke-[1.5]" />
            <p className="text-zinc-600 font-serif text-lg">No acquisitions found</p>
            <p className="text-xs text-zinc-400 font-mono mt-1">Your order history is currently empty.</p>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm hover:border-zinc-300 transition-all duration-200"
              >
                {/* Order Header */}
                <div className="p-5 bg-zinc-50/70 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-zinc-900 font-semibold tracking-wider">
                        #{order.id}
                      </span>
                      {renderStatusBadge(order.status)}
                    </div>
                    <p className="text-xs text-zinc-400 font-mono">
                      Placed on {formatDate(order.created_at)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono">
                      Total Amount
                    </p>
                    <p className="text-lg font-serif text-zinc-900 font-medium">
                      {formatIDR(order.gross_amount)}
                    </p>
                  </div>
                </div>

                {/* Order Items (Product List) */}
                <div className="p-5 divide-y divide-zinc-100">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        {/* Product Image menggunakan tag img standar */}
                        <div className="w-16 h-16 bg-zinc-100 rounded-lg border border-zinc-200 overflow-hidden relative shrink-0">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">
                              No Img
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors">
                            {item.product_name}
                          </h4>
                          <p className="text-xs text-zinc-400 font-mono mt-1">
                            Ref ID: {item.product_id.substring(0, 12)}...
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-mono text-zinc-900">
                          {formatIDR(item.price)}
                        </p>
                        <p className="text-xs text-zinc-400 font-mono mt-0.5">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer & Actions */}
                <div className="px-5 py-4 bg-zinc-50/50 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-zinc-500 font-mono">
                    <CreditCard className="w-4 h-4 text-zinc-400" />
                    <span>Method: {order.payment_method.replace("_", " ").toUpperCase()}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {order.status === "PENDING" && order.payment_url && (
                      <a
                        href={order.payment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-md transition-colors tracking-wide uppercase text-[11px]"
                      >
                        Complete Payment <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button className="inline-flex items-center gap-1 text-zinc-600 hover:text-zinc-900 transition-colors uppercase tracking-wider font-medium text-[11px]">
                      View Receipt <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}