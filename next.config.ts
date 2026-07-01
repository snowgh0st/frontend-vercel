import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://my-crud-fastapi-d3dyd7gqddarehdh.centralus-01.azurewebsites.net/api/:path*',
      },
    ];
  },
};

export default nextConfig;
