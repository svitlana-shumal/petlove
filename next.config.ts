import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['ftp.goit.study'],
  },
};

export default nextConfig;
