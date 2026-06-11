import type { NextConfig } from "next";

// When running in GitHub Codespaces, the app is served behind a proxy at
// https://<codespace-name>-3000.app.github.dev. Next.js blocks Server Actions
// whose Origin doesn't match the host ("Invalid Server Actions request").
//
// Wildcard origins (e.g. "*.app.github.dev") are not reliably matched in some
// Next.js versions, so we also compute the EXACT Codespaces origin from the
// environment variables Codespaces sets automatically. Exact matches always work.
const allowedOrigins = [
  "localhost:3000",
  "*.app.github.dev",
  "*.github.dev",
  "*.githubpreview.dev",
];

const codespaceName = process.env.CODESPACE_NAME;
const forwardingDomain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN; // "app.github.dev"
if (codespaceName && forwardingDomain) {
  // Exact public host for the forwarded port 3000.
  allowedOrigins.push(`${codespaceName}-3000.${forwardingDomain}`);
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
};

export default nextConfig;
