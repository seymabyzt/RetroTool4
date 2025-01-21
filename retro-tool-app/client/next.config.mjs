/** @type {import('next').NextConfig} */
const nextConfig = {  
  reactStrictMode: false,
    transpilePackages: [
      "antd",
      "rc-util",
      "@babel/runtime",
      "@ant-design/icons",
      "@ant-design/icons-svg",
      "rc-pagination",
      "rc-picker",
      "rc-tree",
      "rc-table",
    ],
    webpack: (config) => {
      config.cache = false;
      return config;
    },
  };

export default nextConfig;
