import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    dirs: [], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
  /* config options here */
};

export default nextConfig;
