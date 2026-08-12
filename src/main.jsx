import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initTelegramWebApp } from './utils/telegramWebApp.js'

// Initialize Telegram Mini App — disables vertical swipes so scrolling
// inside the app never accidentally minimizes or closes it.
initTelegramWebApp();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
