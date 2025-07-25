import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"], // Tetap pertahankan jika diperlukan
  },
  server: {
    port: 5174, // Ini memastikan frontend Anda berjalan di http://localhost:5174
    proxy: {
      // Semua permintaan yang dimulai dengan '/api' akan diteruskan ke backend Anda.
      // Ini berlaku untuk GET, POST, PUT, DELETE, dll.
      "/api": {
        target: "https://kreatifana-backend-production-2d4c.up.railway.app", // Diubah ke URL backend Railway Anda
        changeOrigin: true, // Penting untuk menghindari masalah CORS di sisi backend proxy
        rewrite: (path) => path.replace(/^\/api/, "/api"), // Memastikan path '/api' tetap ada
        secure: true, // Gunakan true karena URL Railway adalah HTTPS
      },
    },
  },
});
