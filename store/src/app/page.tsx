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
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-gray-900 max-w-4xl leading-tight">
            Elevate your everyday <br/><span className="text-indigo-600">essentials.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 font-medium">
            Discover our meticulously crafted collection designed for modern living. Uncompromising quality meets timeless design.
          </p>
          <Link href="#collection" className="bg-gray-900 text-white font-semibold py-4 px-10 rounded-full hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-1">
            Shop Collection
          </Link>
        </div>
      </section>

      {/* Products Grid */}
      <section id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Featured Collection</h2>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl">
            <p className="text-gray-500 font-medium">No products currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {products.map((product: any) => (
              <Link href={`/product/${product.itemCode}`} key={product.itemCode} className="group flex flex-col cursor-pointer">
                <div className="aspect-[4/5] w-full relative mb-6 rounded-2xl overflow-hidden bg-gray-50">
                  <Image 
                    src={`/images/${product.itemCode}.png`}
                    alt={product.itemName}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col flex-1 px-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {product.itemName}
                    </h3>
                    <p className="text-lg font-bold text-gray-900 ml-4">${product.standardRate.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{product.itemGroup}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
