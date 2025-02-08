/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
      canvas: "commonjs canvas",
    });
    config.experiments = {
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
      // importAsync: true,
    };
    // config.infrastructureLogging = { debug: /PackFileCache/ };
    return config;
  },
  experimental: {
    esmExternals: "loose",
  }, //required o make Konva and konva-react work
};

export default nextConfig;
