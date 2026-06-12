'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartIcon() {
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const itemCount = items.reduce((total, item) => total + item.qty, 0);

  return (
    <Link href="/cart" className="relative text-gray-500 hover:text-gray-900 transition-colors">
      <ShoppingBag className="w-6 h-6" />
      {mounted && itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
