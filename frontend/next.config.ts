import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */  images: {
    // simple allow‑list (good enough for Google avatars and Gravatar)
    domains: ['lh3.googleusercontent.com', 's.gravatar.com'],
  }

};

export default nextConfig;
