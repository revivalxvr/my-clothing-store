"use client";

import { createContext, useContext } from "react";
import { type Product } from "@/src/components/ProductSection";

type CartContextType = {
  addToCart: (product: Product, quantity?: number) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = CartContext.Provider;

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};