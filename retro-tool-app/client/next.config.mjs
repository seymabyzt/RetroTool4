/** @type {import('next').NextConfig} */
const nextConfig = {  reactStrictMode: true,
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
    async rewrites() {
      return [
        {
          source: '/server.ts',
          destination: 'https://retro-tool4.vercel.app',
        },
      ];
    },
  };;

export default nextConfig;
