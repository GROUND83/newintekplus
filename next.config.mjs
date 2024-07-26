import { hostname } from "os";

/** @type {import('next').NextConfig} */
// const ContentSecurityPolicy = `
//   default-src 'self';
//   script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app www.googletagmanager.com  mail.google.com;
//   style-src 'self' 'unsafe-inline';
//   img-src * blob: data:;
//   media-src 'none';
//   connect-src *;
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
//   {
//     key: "Referrer-Policy",
//     value: "strict-origin-when-cross-origin",
//   },
//   // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
//   {
//     key: "X-Frame-Options",
//     value: "DENY",
//   },
//   // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
//   {
//     key: "X-Content-Type-Options",
//     value: "nosniff",
//   },
//   // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
//   {
//     key: "X-DNS-Prefetch-Control",
//     value: "on",
//   },
//   // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
//   {
//     key: "Strict-Transport-Security",
//     value: "max-age=31536000; includeSubDomains",
//   },
//   // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
//   {
//     key: "Permissions-Policy",
//     value: "camera=(), microphone=(), geolocation=()",
//   },
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
};

export default nextConfig;
