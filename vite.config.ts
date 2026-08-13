import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'lucide-icons': ['lucide-react'],
          'pdf-exporter': ['jspdf', 'html2canvas'],
          'qr-confetti': ['qrcode.react', 'canvas-confetti']
        }
      }
    }
  }
});
