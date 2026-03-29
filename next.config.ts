import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static page generation for deployment
  output: 'export',
  
  // Allow unoptimized images for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
