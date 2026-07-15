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
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-20">
      <div>
        <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all border border-slate-200 bg-white px-5 py-2.5 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Back to Collection
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Image Container */}
        <div className="aspect-[4/5] relative bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.015)] sticky top-28 group">
          <Image
            src={`/images/${product.itemCode}.png`}
            alt={product.itemName}
            fill
            className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
            unoptimized
          />
          <div className="absolute top-6 left-6 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest text-slate-100 border border-slate-800">
            {product.itemGroup.toUpperCase()}
          </div>
        </div>

        {/* Details Column */}
        <div className="flex flex-col py-4 space-y-8">
          <div>
            <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3">{product.itemCode}</p>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.15]">{product.itemName}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-3 bg-slate-50/50 self-start px-4 py-2 rounded-2xl border border-slate-100">
            <div className="flex text-amber-400 gap-0.5">
              {[1,2,3,4,5].map(i => <Star key={i} size={15} fill={i <= 4 ? 'currentColor' : 'none'} className="stroke-[2.5]" />)}
            </div>
            <span className="text-xs text-slate-500 font-bold">(4.0) · 128 Reviews</span>
          </div>

          <div className="flex items-baseline gap-3">
            <p className="text-4xl lg:text-5xl font-black text-slate-950">${product.standardRate.toFixed(2)}</p>
            {product.taxRate > 0 && (
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">+{product.taxRate}% Tax</span>
            )}
          </div>

          <p className="text-base text-slate-600 leading-relaxed font-medium">
            {product.description || 'Premium quality product designed for modern living. Crafted with care and built to last.'}
          </p>

          {/* Specs Table */}
          <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50/30 rounded-3xl border border-slate-100 text-xs font-semibold">
            <div>
              <p className="text-slate-400 uppercase tracking-wider mb-1">Unit of Measure</p>
              <p className="text-sm font-extrabold text-slate-950">{product.stockUom}</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase tracking-wider mb-1">Category</p>
              <p className="text-sm font-extrabold text-slate-950">{product.itemGroup}</p>
            </div>
            {product.weight && (
              <div>
                <p className="text-slate-400 uppercase tracking-wider mb-1">Weight</p>
                <p className="text-sm font-extrabold text-slate-950">{product.weight} kg</p>
              </div>
            )}
            <div>
              <p className="text-slate-400 uppercase tracking-wider mb-1">Availability</p>
              <p className="text-sm font-extrabold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                In Stock
              </p>
            </div>
          </div>

          <AddToCartButton product={product} />

          <div className="space-y-3.5 text-xs text-slate-500 bg-slate-50/40 p-6 rounded-3xl border border-slate-100/60 font-semibold">
            <div className="flex items-center"><span className="text-emerald-600 mr-2.5 font-bold">✓</span> Free express shipping on orders over $150</div>
            <div className="flex items-center"><span className="text-emerald-600 mr-2.5 font-bold">✓</span> 30-day hassle-free returns & replacement</div>
            <div className="flex items-center"><span className="text-emerald-600 mr-2.5 font-bold">✓</span> Secure checkouts processed instantly</div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="border-t border-slate-100 pt-20">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">You may also like</h2>
            <div className="h-px bg-slate-100 flex-1 mx-8 hidden sm:block"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {related.map((rp: any) => (
              <Link href={`/product/${rp.itemCode}`} key={rp.itemCode} className="group flex flex-col bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.005)] hover:shadow-[0_15px_30px_rgba(99,102,241,0.04)] hover:border-indigo-100 transition-all duration-300">
                <div className="aspect-square relative bg-slate-50 rounded-2xl overflow-hidden mb-4 shadow-inner">
                  <Image src={`/images/${rp.itemCode}.png`} alt={rp.itemName} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                </div>
                <div className="px-1">
                  <h3 className="font-extrabold text-slate-950 group-hover:text-indigo-600 transition-colors line-clamp-1 text-sm">{rp.itemName}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="font-black text-slate-950 text-sm">${rp.standardRate.toFixed(2)}</p>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{rp.itemGroup}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
