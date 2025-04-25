import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['xlsx', 'jspdf', 'jspdf-autotable'],
  },
  
  plugins: [react()],
  server: {
    host: true,
  },
});
