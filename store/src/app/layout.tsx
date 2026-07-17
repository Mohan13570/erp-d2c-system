import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import CartIcon from '@/components/CartIcon'
import NavUser from '@/components/NavUser'
import { CartProvider } from '@/context/CartContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lizome Store — Premium Lifestyle Essentials',
  description: 'Discover our meticulously crafted collection designed for modern living.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 min-h-screen flex flex-col antialiased selection:bg-indigo-100`}>
        <CartProvider>
          <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-20 items-center">
                <Link href="/" className="text-2xl font-black tracking-tighter">
                  LIZOME<span className="text-indigo-600">.</span>
                </Link>
                <nav className="hidden md:flex space-x-10">
                  <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors font-semibold text-sm tracking-wide">Shop</Link>
                  <Link href="/account" className="text-gray-500 hover:text-gray-900 transition-colors font-semibold text-sm tracking-wide">My Account</Link>
                </nav>
                <div className="flex items-center space-x-5">
                  <NavUser />
                  <CartIcon />
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 w-full">
            {children}
          </main>
          <footer className="bg-gray-50 border-t border-gray-100 py-16 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <span className="text-2xl font-black tracking-tighter">LIZOME<span className="text-indigo-600">.</span></span>
                  <p className="text-gray-400 text-sm mt-1">Premium lifestyle essentials.</p>
                </div>
                <div className="flex space-x-8 text-sm text-gray-400">
                  <Link href="/login" className="hover:text-gray-600 transition-colors">Login</Link>
                  <Link href="/signup" className="hover:text-gray-600 transition-colors">Create Account</Link>
                  <Link href="/cart" className="hover:text-gray-600 transition-colors">Cart</Link>
                  <a href="http://localhost:5173/admin/login" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors">Admin / Employee Portal</a>
                </div>
                <p className="text-gray-400 text-sm">&copy; 2026 Lizome Design.</p>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}
