"use client";

import { useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

export interface CartState {
  storeId: string;
  items: CartItem[];
}

const STORAGE_KEY = "catalogger-cart";

const getCartFromStorage = (): CartState | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
};

const saveCartToStorage = (cart: CartState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    // Dispatch a custom event specifically so components stay magically synced across tabs/files
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
  }
};

export function useCart(currentStoreId: string) {
  const [cart, setCart] = useState<CartState>({ storeId: currentStoreId, items: [] });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initial sync
    const stored = getCartFromStorage();
    if (stored) {
      if (stored.storeId !== currentStoreId) {
        // RULE: If storeId changes -> CLEAR cart safely
        const emptyCart = { storeId: currentStoreId, items: [] };
        setCart(emptyCart);
        saveCartToStorage(emptyCart);
      } else {
        setCart(stored);
      }
    } else {
      const emptyCart = { storeId: currentStoreId, items: [] };
      setCart(emptyCart);
      saveCartToStorage(emptyCart);
    }

    // Listener for cross-component sync
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<CartState>;
      if (customEvent.detail && customEvent.detail.storeId === currentStoreId) {
        setCart(customEvent.detail);
      }
    };

    window.addEventListener('cart-updated', listener);
    return () => window.removeEventListener('cart-updated', listener);
  }, [currentStoreId]);

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    if (!product.productId || product.price === undefined) return; // Edge Case: Invalid product

    const prev = getCartFromStorage() || { storeId: currentStoreId, items: [] };
    
    // Safety check again right before updating
    if (prev.storeId !== currentStoreId) {
      prev.items = [];
    }

    const existingIndex = prev.items.findIndex(i => i.productId === product.productId);
    let newItems = [...prev.items];

    if (existingIndex >= 0) {
      newItems[existingIndex].quantity += 1;
    } else {
      newItems.push({ ...product, quantity: 1 });
    }

    const newState = { storeId: currentStoreId, items: newItems };
    setCart(newState);
    saveCartToStorage(newState);
  };

  const removeFromCart = (productId: string) => {
    const prev = getCartFromStorage() || { storeId: currentStoreId, items: [] };
    const newState = {
      storeId: currentStoreId,
      items: prev.items.filter(i => i.productId !== productId)
    };
    setCart(newState);
    saveCartToStorage(newState);
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty < 1) {
      removeFromCart(productId);
      return;
    }

    const prev = getCartFromStorage() || { storeId: currentStoreId, items: [] };
    const newState = {
      storeId: currentStoreId,
      items: prev.items.map(i => i.productId === productId ? { ...i, quantity: qty } : i)
    };
    setCart(newState);
    saveCartToStorage(newState);
  };

  const clearCart = () => {
    const newState = { storeId: currentStoreId, items: [] };
    setCart(newState);
    saveCartToStorage(newState);
  };

  const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    mounted,
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
}
