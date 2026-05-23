// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ConfirmationProvider } from './context/ConfirmationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <ConfirmationProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConfirmationProvider>
    </ToastProvider>
  </StrictMode>,
)
