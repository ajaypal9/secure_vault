import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from './providers'
import { App } from './App'
import './styles/globals.css'

const el = document.getElementById('root')
if (!el) throw new Error('#root element not found')

createRoot(el).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
)
