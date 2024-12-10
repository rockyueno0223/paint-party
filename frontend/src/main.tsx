import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from '@/context/UserProvider.tsx'
import { CanvasHistoryProvider } from '@/context/CanvasHistoryProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <CanvasHistoryProvider>
        <App />
      </CanvasHistoryProvider>
    </UserProvider>
  </StrictMode>,
)