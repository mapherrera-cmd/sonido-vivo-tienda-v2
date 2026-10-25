import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CarritoProvider } from './context/CarritoProvider.jsx'
import { SesionProvider } from './context/SesionProvider.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter activa la navegación sin recargar la página */}
    <BrowserRouter>
      {/* Sesión y carrito quedan disponibles para toda la aplicación */}
      <SesionProvider>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </SesionProvider>
    </BrowserRouter>
  </StrictMode>,
)
