import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
       
        port: "",
        pathname: "/**", // Allow any pathname
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
       
        port: "",
        pathname: "/**", // Allow any pathname
      },
    ],
  },
};

export default nextConfig;