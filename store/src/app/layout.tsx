import type { Metadata } from 'next';
import StoreProvider from '@/app/StoreProvider';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import CartIcon from '@/components/CartIcon';
import NavUser from '@/components/NavUser';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aura Store — Premium Lifestyle Essentials',
  description: 'Discover our meticulously crafted collection designed for modern living.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 min-h-screen flex flex-col antialiased selection:bg-indigo-100`}>
        <StoreProvider>
          <CartProvider>
            <header className="bg-white/70 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] transition-all">
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                  <Link href="/" className="text-2xl font-black tracking-tight text-slate-900 hover:opacity-85 transition-opacity">
                    AURA<span className="text-indigo-600 font-extrabold">.</span>
                  </Link>
                  <nav className="hidden md:flex space-x-8">
                    <Link href="/" className="relative text-slate-600 hover:text-indigo-600 transition-colors font-semibold text-sm tracking-wide py-2 group">
                      Shop
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link href="/account" className="relative text-slate-600 hover:text-indigo-600 transition-colors font-semibold text-sm tracking-wide py-2 group">
                      My Account
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </nav>
                  <div className="flex items-center space-x-6">
                    <NavUser />
                    <CartIcon />
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1 w-full bg-slate-50/30">{children}</main>
            <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-16 mt-auto">
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-slate-800 pb-12">
                  <div>
                    <span className="text-2xl font-black tracking-tight text-white">
                      AURA<span className="text-indigo-500 font-extrabold">.</span>
                    </span>
                    <p className="text-slate-400 text-sm mt-2 font-medium">
                      Curating premium lifestyle essentials with uncompromising quality.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-start md:justify-center gap-x-8 gap-y-3 text-sm">
                    <Link href="/login" className="hover:text-white transition-colors">Login</Link>
                    <Link href="/signup" className="hover:text-white transition-colors">Create Account</Link>
                    <Link href="/cart" className="hover:text-white transition-colors">Cart</Link>
                    <a href="http://localhost:3000/admin" className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">Admin Portal</a>
                  </div>
                  <div className="text-start md:text-end text-sm text-slate-500">
                    <p>&copy; 2026 Aura Design Co.</p>
                    <p className="mt-1 text-xs">All rights reserved.</p>
                  </div>
                </div>
                <div className="mt-8 flex justify-between items-center text-xs text-slate-500">
                  <span>Designed for modern living.</span>
                  <span className="flex items-center gap-1">
                    Secure Payments 
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  </span>
                </div>
              </div>
            </footer>
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}