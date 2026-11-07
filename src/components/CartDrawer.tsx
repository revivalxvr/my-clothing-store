'use client';

import { ArrowRight, ShoppingBag, X, Trash2 } from 'lucide-react';
import type { Product } from '@/src/components/ProductSection';

export type CartItem = Product & {
  qty: number;
};

type CartDrawerProps = {
  isOpen: boolean;
  cart: CartItem[];
  selectedItemIds: string[];
  onToggleSelectItem: (id: string) => void;
  onToggleSelectAll: (selectAll: boolean) => void;
  onRemoveItem: (id: string) => void; // <-- Tambahkan tipe props ini
  onClose: () => void;
  onCheckout: () => void;
};

export default function CartDrawer({
  isOpen,
  cart,
  selectedItemIds,
  onToggleSelectItem,
  onToggleSelectAll,
  onRemoveItem, // <-- Tangkap props ini
  onClose,
  onCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const subtotal = cart
    .filter((item) => selectedItemIds.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.qty, 0);

  const isAllSelected = cart.length > 0 && selectedItemIds.length === cart.length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Your Shopping Bag ({totalItems})
            </h3>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close shopping cart"
              className="p-2 text-stone-400 hover:text-stone-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Select All Bar */}
          {cart.length > 0 && (
            <div className="px-6 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs font-medium text-stone-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                />
                Select All Items ({selectedItemIds.length}/{cart.length})
              </label>
            </div>
          )}

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-stone-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">
                  Your shopping bag is empty.
                </p>
              </div>
            ) : (
              cart.map((item) => {
                const isSelected = selectedItemIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`flex gap-3 items-center p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-stone-50/80 border-stone-900/30 shadow-sm"
                        : "bg-white border-stone-200 opacity-60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectItem(item.id)}
                      className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900 cursor-pointer"
                    />

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded-xl"
                    />

                    <div className="flex-1">
                      <h4 className="font-serif text-sm font-medium text-stone-900">
                        {item.name}
                      </h4>

                      <p className="text-xs text-stone-500 mt-0.5">
                        Rp{item.price.toLocaleString("id-ID")} × {item.qty}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="font-semibold text-sm text-stone-900">
                        Rp{(item.price * item.qty).toLocaleString("id-ID")}
                      </span>

                      {/* Tombol Hapus Item */}
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id as string)}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Subtotal and checkout */}
          <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
            <div className="flex items-center justify-between text-base font-semibold text-stone-900">
              <span>Subtotal ({selectedItemIds.length} items selected)</span>
              <span>Rp{subtotal.toLocaleString("id-ID")}</span>
            </div>

            <button
              type="button"
              onClick={onCheckout}
              disabled={selectedItemIds.length === 0}
              className="w-full bg-stone-900 text-white hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed py-4 rounded-xl font-medium text-xs tracking-wider uppercase shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}