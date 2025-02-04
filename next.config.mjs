/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    if (isServer) {
      config.externals = [...(config.externals || []), "@napi-rs/snappy", "snappy"];
    }

    config.module.rules.push({
      test: /\.node$/,
      loader: "ignore-loader",
    });

    return config;
  },
};

export default nextConfig;
