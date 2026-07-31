import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ivveffqevilqviigsdat.supabase.co",
        pathname: "/storage/v1/object/public/artworks/**",
      },
    ],
  },
};

export default nextConfig;