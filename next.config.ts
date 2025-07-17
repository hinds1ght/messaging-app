import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // temporary
    ignoreDuringBuilds: true,
  },
  typescript: {
    // temporary
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
