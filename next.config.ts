import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static page generation for PWA
  output: 'export',
  
  // Allow image domains
  images: {
    unoptimized: true, // Required for static export
  },
  
  // Disable server-side features for static export
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
