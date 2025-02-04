/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config, { isServer }) {
      // Ignore the snappy binary files in the client-side build
      config.module.rules.push({
        test: /snappy\.win32-x64-msvc\.node$/,
        use: 'ignore-loader',
      });
      return config;
    },
  };
  
  export default nextConfig;
  