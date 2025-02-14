/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  trailingSlash: true,
  images: {
    domains: [],
  },

  experimental: {
    esmExternals: "loose",
    serverComponentsExternalPackages: ["mongoose"],
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "utf-8-validate": false,
        bufferutil: false,
        canvas: false,
      };
    }
    config.experiments = {
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    };

    return config;
  },

  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
};

module.exports = nextConfig;
