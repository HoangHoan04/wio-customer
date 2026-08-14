import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@base-ui/react"],
  },
  async rewrites() {
    return [
      {
        source: "/thiep/:slug",
        destination: "/invitation/:slug",
      },
      {
        source: "/mau-thiep",
        destination: "/templates",
      },
      {
        source: "/thiep-cua-toi",
        destination: "/my-templates",
      },
      {
        source: "/sua/:id",
        destination: "/edit/:id",
      },
      {
        source: "/tao/:cardType/:themeCode",
        destination: "/create/:themeCode?cardType=:cardType",
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/icons/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
