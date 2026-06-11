import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Allow Server Actions when the app is served behind the GitHub Codespaces
    // proxy (https://*.app.github.dev). Without this, login fails with
    // "Invalid Server Actions request" because the Origin doesn't match the host.
    serverActions: {
      allowedOrigins: ["*.app.github.dev"],
    },
  },
};

export default nextConfig;
