import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// React, React DOM (incl. react-dom/client + scheduler) and React Router change rarely:
// keep them in one long-lived vendor chunk, separate from the app code.
const VENDOR_PACKAGES = /[\/]node_modules[\/](react|react-dom|scheduler|react-router|react-router-dom|cookie|set-cookie-parser)[\/]/;

export default defineConfig(({ isSsrBuild }) => ({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  base: '/',
  // Build date for time-based content (next-litter banner, copyright year): see utils/litters.ts.
  // scripts/build.mjs sets BUILD_DATE once, so the client and SSR builds always agree.
  define: {
    __BUILD_DATE__: JSON.stringify(process.env.BUILD_DATE ?? new Date().toISOString().slice(0, 10)),
  },
  build: isSsrBuild
    ? {
        // Build-time only bundle used by scripts/prerender.mjs; lives outside dist/ so it is never deployed.
        outDir: 'dist-ssr',
        emptyOutDir: true,
        copyPublicDir: false,
      }
    : {
        // Lets the prerender step add <link rel="modulepreload"> for each page's chunk.
        // scripts/prerender.mjs deletes dist/.vite afterwards.
        manifest: true,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (VENDOR_PACKAGES.test(id)) return 'react-vendor';
            },
          },
        },
      },
}));
