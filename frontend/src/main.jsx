import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/config'; // Import i18n configuration
import AppRoutes from './AppRoutes'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes />
    <Toaster position="top-right" />
  </StrictMode>,
)
