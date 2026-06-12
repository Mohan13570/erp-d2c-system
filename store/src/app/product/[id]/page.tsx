import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';
import AddToCartButton from './AddToCartButton';

async function getProduct(itemCode: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/inventory/items/${encodeURIComponent(itemCode)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getAllProducts() {
  try {
    const res = await fetch('http://localhost:3000/api/inventory/items?d2c=true', { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// Next.js 15 requires params to be awaited
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  const allProducts = await getAllProducts();
  const related = allProducts.filter((p: any) => p.itemCode !== id).slice(0, 3);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <Link href="/" className="text-indigo-600 hover:underline">Return to Store</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collection
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Image */}
        <div className="aspect-[4/5] relative bg-gray-50 rounded-3xl overflow-hidden shadow-sm sticky top-28">
          <Image
            src={`/images/${product.itemCode}.png`}
            alt={product.itemName}
            fill
            className="object-cover object-center hover:scale-105 transition-transform duration-700"
            unoptimized
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-indigo-600 shadow-sm">
            {product.itemGroup}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col py-4 space-y-6">
          <div>
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-2">{product.itemCode}</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">{product.itemName}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex text-amber-400">
              {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= 4 ? 'currentColor' : 'none'} />)}
            </div>
            <span className="text-sm text-gray-500 font-medium">(4.0) · 128 reviews</span>
          </div>

          <div className="flex items-baseline space-x-3">
            <p className="text-4xl font-bold text-gray-900">${product.standardRate.toFixed(2)}</p>
            {product.taxRate > 0 && (
              <span className="text-sm text-gray-500">+ {product.taxRate}% tax</span>
            )}
          </div>

          <p className="text-lg text-gray-600 leading-relaxed">
            {product.description || 'Premium quality product designed for modern living. Crafted with care and built to last.'}
          </p>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100 text-sm">
            <div><p className="text-gray-500 mb-1">Unit of Measure</p><p className="font-semibold text-gray-900">{product.stockUom}</p></div>
            <div><p className="text-gray-500 mb-1">Category</p><p className="font-semibold text-gray-900">{product.itemGroup}</p></div>
            {product.weight && <div><p className="text-gray-500 mb-1">Weight</p><p className="font-semibold text-gray-900">{product.weight} kg</p></div>}
            <div><p className="text-gray-500 mb-1">Availability</p><p className="font-semibold text-emerald-600">✓ In Stock</p></div>
          </div>

          <AddToCartButton product={product} />

          <div className="space-y-3 text-sm text-gray-500 bg-gray-50 p-5 rounded-2xl">
            <div className="flex items-center"><span className="text-emerald-500 mr-2">✓</span> Free express shipping on orders over $150</div>
            <div className="flex items-center"><span className="text-emerald-500 mr-2">✓</span> 30-day hassle-free returns</div>
            <div className="flex items-center"><span className="text-emerald-500 mr-2">✓</span> Secure checkout via Stripe</div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {related.map((rp: any) => (
              <Link href={`/product/${rp.itemCode}`} key={rp.itemCode} className="group flex flex-col">
                <div className="aspect-square relative bg-gray-50 rounded-2xl overflow-hidden mb-4">
                  <Image src={`/images/${rp.itemCode}.png`} alt={rp.itemName} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{rp.itemName}</h3>
                <p className="font-bold text-gray-900 mt-1">${rp.standardRate.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
