import { hostname } from "os";

/** @type {import('next').NextConfig} */
// const ContentSecurityPolicy = `
//   default-src 'self';
//   script-src "self"
//   style-src 'self' ;
//   img-src * blob: data:;
//   media-src 'none';
//   connect-src "self";
//   font-src 'self';
//   frame-src giscus.app
// `;
// const securityHeaders = [
//   // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
//   {
//     key: "Content-Security-Policy",
//     value: ContentSecurityPolicy.replace(/\n/g, ""),
//   },
//   // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy

//   // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
// ];
const nextConfig = {
  reactStrictMode: false,
  images: {
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      { hostname: "imagedelivery.net" },
      { hostname: "k.kakaocdn.net" },
      { hostname: "phinf.pstatic.net" },
      { hostname: "intekpluss3.s3-ap-northeast-2.amazonaws.com" },
      { hostname: "dapi.kakao.com" },
      { hostname: "www.privacy.go.kr" },
      { hostname: "newintekplus.vercel.app" },
    ],
  },
  // experimental: {
  //   esmExternals: "loose", // <-- add this
  //   serverComponentsExternalPackages: ["mongoose"], // <-- and this
  // },
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: securityHeaders,
  //     },
  //   ];
  // },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
