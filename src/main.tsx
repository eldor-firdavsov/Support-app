import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './index.css'

// Initialize Telegram Mini App
const initTelegram = () => {
  const twa = (window as any).Telegram?.WebApp;
  if (twa) {
    twa.ready();
    twa.expand();
  }
};

initTelegram();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
