import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 0;

async function getProducts() {
  try {
    const res = await fetch('http://localhost:3000/api/inventory/items?d2c=true');
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="space-y-20 pb-32">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-36 md:py-48 bg-dot-pattern">
        {/* Ambient Gradient Glows */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-600/20 blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-violet-600/15 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-indigo-400 mb-8 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Introducing Aura Autumn Collection
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight max-w-4xl leading-[1.1] text-glow">
            Elevate your everyday <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300">
              essentials.
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Discover our meticulously crafted collection designed for modern living. Uncompromising quality meets timeless architectural design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link href="#collection" className="glow-btn bg-white text-slate-950 font-bold py-4 px-10 rounded-full hover:bg-slate-50 transition-colors shadow-lg shadow-white/5 text-sm tracking-wide">
              Shop Collection
            </Link>
            <Link href="/account" className="text-slate-300 hover:text-white font-semibold text-sm transition-colors py-2 px-4 flex items-center gap-1 group">
              My Profile
              <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Diagonal border accent */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50/30 to-transparent"></div>
      </section>

      {/* Products Grid */}
      <section id="collection" className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Curated Items</div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Featured Collection</h2>
          </div>
          <div className="h-px bg-slate-200 flex-1 mx-8 hidden md:block"></div>
          <div className="text-sm text-slate-500 font-semibold">{products.length} Items Available</div>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-slate-500 font-medium">No products currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {products.map((product: any) => (
              <Link href={`/product/${product.itemCode}`} key={product.itemCode} className="group flex flex-col cursor-pointer bg-white p-4 rounded-3xl border border-slate-100/80 shadow-[0_4px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.06)] hover:border-indigo-100 transition-all duration-300">
                <div className="aspect-[4/5] w-full relative mb-6 rounded-2xl overflow-hidden bg-slate-50 shadow-inner">
                  <Image 
                    src={`/images/${product.itemCode}.png`}
                    alt={product.itemName}
                    fill
                    className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    unoptimized
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider text-slate-200 border border-slate-800">
                    {product.itemGroup.toUpperCase()}
                  </div>
                </div>
                <div className="flex flex-col flex-1 px-2 pb-2">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="text-lg font-extrabold text-slate-950 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {product.itemName}
                    </h3>
                    <p className="text-lg font-black text-slate-950">${product.standardRate.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500 font-medium mt-auto">
                    <span>Code: {product.itemCode}</span>
                    <span className="text-indigo-600 font-bold group-hover:underline flex items-center gap-1">
                      View Details <span>&rarr;</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
