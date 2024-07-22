/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      { hostname: "imagedelivery.net" },
      { hostname: "k.kakaocdn.net" },
      { hostname: "phinf.pstatic.net" },
      { hostname: "finefarming-new.vercel.app" },
      { hostname: "finefarming-pq31y3od4-wonchangkims-projects.vercel.app" },
      { hostname: "dapi.kakao.com" },
      { hostname: "www.privacy.go.kr" },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
