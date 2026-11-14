import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('../backend', import.meta.url)), 'API_PORT');
  return {
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: { proxy: { "/api": { target: `http://127.0.0.1:${env.API_PORT || 4000}` } } },
  };
});
