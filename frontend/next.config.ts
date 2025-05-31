import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // simple allow‑list (good enough for Google avatars)
    domains: ['lh3.googleusercontent.com'],
  }

};

export default nextConfig;
