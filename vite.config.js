import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // expose to phone
    port: 5174,       // fixed port
    strictPort: true  // don't auto change port
  }
});