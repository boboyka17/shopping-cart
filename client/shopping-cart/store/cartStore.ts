"use client";

import { create } from "zustand";
import type { Products, CartItem } from "@/models/Products";

interface CartState {
  items: CartItem[];
  addToCart: (product: Products) => void;
  updateQuantity: (productsId: number, quantity: number) => void;
  removeFromCart: (productsId: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],

  addToCart: (product) =>
    set((state) => {
      if (product.quantity <= 0) return state;

      const existing = state.items.find(
        (item) => item.product.productsId === product.productsId,
      );

      if (existing) {
        if (existing.cartQuantity >= product.quantity) return state;

        return {
          items: state.items.map((item) =>
            item.product.productsId === product.productsId
              ? {
                  ...item,
                  cartQuantity: Math.min(
                    item.cartQuantity + 1,
                    product.quantity,
                  ),
                }
              : item,
          ),
        };
      }

      return {
        items: [...state.items, { product, cartQuantity: 1 }],
      };
    }),

  updateQuantity: (productsId, quantity) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.product.productsId === productsId
            ? {
                ...item,
                cartQuantity: Math.min(
                  Math.max(1, quantity),
                  item.product.quantity,
                ),
              }
            : item,
        )
        .filter((item) => item.product.quantity > 0),
    })),

  removeFromCart: (productsId) =>
    set((state) => ({
      items: state.items.filter(
        (item) => item.product.productsId !== productsId,
      ),
    })),

  clearCart: () => set({ items: [] }),
}));
