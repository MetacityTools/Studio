/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["typeorm"],
  },
  output: "standalone",
};

export default nextConfig;
