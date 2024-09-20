/** @type {import('next').NextConfig} */

import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["typeorm"],
    serverMinification: false,
  },
  output: "standalone",
  webpack: (config, { isServer }) => {
    config.optimization.minimizer[1] = (compiler) => {
      new CssMinimizerPlugin().apply(compiler);
    };

    return config;
  },
};

export default nextConfig;
