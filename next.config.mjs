/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      // Enable tree shaking and minification
      config.optimization = {
        ...config.optimization,
        minimize: true,
        moduleIds: 'deterministic',
      }
    }
    return config
  },
};

export default nextConfig;
