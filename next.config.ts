import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve images as static files — the Vercel Hobby team's image-optimization
  // quota is exhausted, so /_next/image returns 402. Source JPEGs are
  // pre-sized to 1200px for the web instead.
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
