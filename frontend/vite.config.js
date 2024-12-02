import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill"; // Import Node polyfill plugin
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill"; // Import module polyfill plugin

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      buffer: "buffer", // Polyfill for buffer
      util: "util", // Polyfill for util
    },
  },
  define: {
    global: "globalThis", // Map global to globalThis
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
    include: ["buffer", "util"],
  },
});
