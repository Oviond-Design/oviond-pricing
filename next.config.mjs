/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  transpilePackages: ["@radix-ui/react-tabs", "@radix-ui/react-slider"],
  experimental: {
    optimizeCss: true
  }
};

export default nextConfig;
