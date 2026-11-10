import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@react-pdf/renderer', 'playwright'],
  turbopack: {},
}

export default nextConfig
