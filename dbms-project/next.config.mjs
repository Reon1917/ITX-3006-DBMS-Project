/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "net": false,
      "tls": false,
      "fs": false,
      "path": false,
      "zlib": false,
      "crypto": false,
      "@azure/app-configuration": false,
      "@azure/identity": false,
      "@azure/keyvault-secrets": false,
      "child_process": false,
      "stream": false,
      "constants": false
    };
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['oracledb']
  }
};

export default nextConfig;
