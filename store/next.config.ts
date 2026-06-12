import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore
  allowedDevOrigins: ['*.trycloudflare.com', 'localhost:3000', '*.loca.lt'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*' // Proxy to Backend
      },
      {
        source: '/admin',
        destination: 'http://localhost:5173/admin/' // Proxy to Admin Vite app
      },
      {
        source: '/admin/:path*',
        destination: 'http://localhost:5173/admin/:path*' // Proxy to Admin Vite app
      }
    ]
  }
};

export default nextConfig;
