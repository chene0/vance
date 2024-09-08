import {withSentryConfig} from "@sentry/nextjs";
import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    swcMinify: true,
    experimental: {
      esmExternals: true,
      serverComponentsExternalPackages: ['tesseract.js'],
      serverActions: {
        bodySizeLimit: '10mb',
    },
    },
    webpack(config, { isServer, dev }) {
      config.experiments = {
        asyncWebAssembly: true,
        layers: true
      };
  
      if (!dev && isServer) {
        config.output.webassemblyModuleFilename = 'chunks/[id].wasm';
        config.plugins.push(new WasmChunksFixPlugin());
      }
  
      return config;
    }
  };

class WasmChunksFixPlugin {
    apply(compiler) {
      compiler.hooks.thisCompilation.tap('WasmChunksFixPlugin', (compilation) => {
        compilation.hooks.processAssets.tap(
          { name: 'WasmChunksFixPlugin' },
          (assets) =>
            Object.entries(assets).forEach(([pathname, source]) => {
              if (!pathname.match(/\.wasm$/)) return;
              compilation.deleteAsset(pathname);
  
              const name = pathname.split('/')[1];
              const info = compilation.assetsInfo.get(pathname);
              compilation.emitAsset(name, source, info);
            })
        );
      });
    }
  }

export default nextConfig;

// export default withSentryConfig(nextConfig, {
//     excludeServerRoutes: [
//         '/app/lib/*',
//       ],

// // For all available options, see:
// // https://github.com/getsentry/sentry-webpack-plugin#options

// org: "ethan-chen",
// project: "javascript-nextjs",

// // Only print logs for uploading source maps in CI
// silent: !process.env.CI,

// // For all available options, see:
// // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// // Upload a larger set of source maps for prettier stack traces (increases build time)
// widenClientFileUpload: true,

// // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// // This can increase your server load as well as your hosting bill.
// // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// // side errors will fail.
// // tunnelRoute: "/monitoring",

// // Hides source maps from generated client bundles
// hideSourceMaps: true,

// // Automatically tree-shake Sentry logger statements to reduce bundle size
// disableLogger: true,

// // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// // See the following for more information:
// // https://docs.sentry.io/product/crons/
// // https://vercel.com/docs/cron-jobs
// automaticVercelMonitors: true,
// });
