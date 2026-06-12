'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface CartItem {
  itemCode: string;
  itemName: string;
  qty: number;
  rate: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemCode: string) => void;
  updateQuantity: (itemCode: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Simple persistence
  useEffect(() => {
    const saved = localStorage.getItem('d2c_cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('d2c_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems(current => {
      const existing = current.find(i => i.itemCode === newItem.itemCode);
      if (existing) {
        return current.map(i => i.itemCode === newItem.itemCode ? { ...i, qty: i.qty + newItem.qty } : i);
      }
      return [...current, newItem];
    });
  };

  const removeFromCart = (itemCode: string) => {
    setItems(current => current.filter(i => i.itemCode !== itemCode));
  };

  const updateQuantity = (itemCode: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemCode);
      return;
    }
    setItems(current => current.map(i => i.itemCode === itemCode ? { ...i, qty } : i));
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((total, item) => total + (item.rate * item.qty), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
