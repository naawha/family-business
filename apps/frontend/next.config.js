/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@family-business/types', '@family-business/theme'],

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000',
  },

  async rewrites() {
    const apiTarget = process.env.API_INTERNAL_URL || 'http://localhost:3000'
    return [
      {
        source: '/api/:path*',
        destination: `${apiTarget}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
