/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    reactStrictMode: true,
    webpack: (config) => {
        config.externals = [...config.externals, "canvas", "jsdom"];
        return config;
    },
};

export default nextConfig;
