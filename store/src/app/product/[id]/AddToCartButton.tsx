'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({
      itemCode: product.itemCode,
      itemName: product.itemName,
      qty: 1,
      rate: product.standardRate,
      image: `/images/${product.itemCode}.png`
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAdd}
      className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all duration-300 ${
        added 
          ? 'bg-emerald-500 text-white' 
          : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg hover:shadow-indigo-600/30'
      }`}
    >
      {added ? (
        'Added to Cart!'
      ) : (
        <>
          <ShoppingBag className="w-5 h-5 mr-2" /> Add to Cart
        </>
      )}
    </button>
  );
}
