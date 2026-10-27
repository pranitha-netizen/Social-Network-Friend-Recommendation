import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { handleApiRequest } from './src/server/apiHandler.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function graphApiPlugin(): Plugin {
  return {
    name: 'graph-api-server-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/api')) {
          const handled = handleApiRequest(req, res);
          if (handled) return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [graphApiPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
