import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export so we can host on GitHub Pages.
  output: "export",
  // Live URL: https://geraldlol.github.io/snoot-boop/
  basePath: "/snoot-boop",
  assetPrefix: "/snoot-boop/",
  // GH Pages serves directories as foo/index.html, so trailing slashes keep links resolving.
  trailingSlash: true,
  // No image optimizer in static-export mode.
  images: { unoptimized: true },
};

export default nextConfig;
