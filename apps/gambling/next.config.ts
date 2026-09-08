import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'objects.kaxmedia.com',
      },
      {
        protocol: 'https',
        hostname: 'www.gambling.com',
      },
      {
        protocol: 'https',
        hostname: 'objects2.kaxmedia.com',
      },
    ],
  },
}

export default nextConfig
