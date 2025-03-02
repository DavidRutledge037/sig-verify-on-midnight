/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    // Ignore example files during build
    config.module.rules.push({
      test: /config\/examples\/.*/,
      loader: 'ignore-loader'
    });
    return config;
  },
}

export default nextConfig
