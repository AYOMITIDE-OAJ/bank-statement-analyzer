/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "@anthropic-ai/sdk"],
  },
};

export default config;
