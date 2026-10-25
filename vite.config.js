import react from '@vitejs/plugin-react'
// "defineConfig" se importa desde vitest/config para poder usar el bloque "test"
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // jsdom simula un navegador (DOM y localStorage) dentro de Node
    environment: 'jsdom',
    // describe, it, expect, vi disponibles sin importarlos (igual los importamos para que sea explícito)
    globals: true,
    // archivo que se ejecuta antes de cada archivo de pruebas
    setupFiles: './src/setupTests.js',
    // dónde buscar las pruebas
    include: ['src/**/*.test.{js,jsx}'],
    // Las pruebas que dibujan toda la app (rutas + formularios) pueden tardar más de 5 s en equipos lentos
    testTimeout: 20000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'], // "text" sale en la consola, "html" crea la carpeta coverage/
      include: ['src/**/*.{js,jsx}'],
      // No medimos el arranque de la app, la configuración de pruebas ni las pruebas mismas
      exclude: ['src/main.jsx', 'src/setupTests.js', 'src/testUtils/**', 'src/**/*.test.{js,jsx}'],
    },
  },
})
