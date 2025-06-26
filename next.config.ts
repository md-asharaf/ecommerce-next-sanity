import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.sanity.io",
            },
            {
                protocol: "https",
                hostname: "images.pexels.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname:"encrypted-tbn0.gstatic.com"
            },
            {
                protocol: "https",
                hostname: "source.unsplash.com",
            }
        ],
    },
    allowedDevOrigins: ["*.ngrok-free.app"],
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
