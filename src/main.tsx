import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppKitProvider } from "./WalletContext.tsx"
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppKitProvider>
      <Toaster />
      <App />
    </AppKitProvider>
  </StrictMode>,
)
