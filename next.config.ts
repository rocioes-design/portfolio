import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Work page used to live at /lab (formerly "Design Lab"); keep old links working.
  async redirects() {
    return [{ source: "/lab", destination: "/work", permanent: true }];
  },
};

export default nextConfig;
