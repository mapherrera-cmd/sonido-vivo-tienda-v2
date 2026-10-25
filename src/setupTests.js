// Se ejecuta antes de cada archivo de pruebas.

// Agrega comprobaciones para el DOM: toBeInTheDocument(), toHaveClass(), toBeDisabled()...
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Después de cada prueba dejamos todo limpio para que una prueba no afecte a la siguiente:
afterEach(() => {
  cleanup() // quita del DOM lo que renderizó la prueba
  vi.restoreAllMocks() // devuelve a la normalidad los vi.spyOn (localStorage, console...)
  localStorage.clear() // borra lo que la prueba guardó en localStorage
})
