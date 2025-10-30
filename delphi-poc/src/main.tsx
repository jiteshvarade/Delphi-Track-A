import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LogProvider } from './context/LogContext'
import HomePage from './pages/HomePage'
import ArticlePage from './pages/ArticlePage'
import LogsPage from './pages/LogsPage'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LogProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/logs" element={<LogsPage />} />
        </Routes>
      </BrowserRouter>
    </LogProvider>
  </StrictMode>,
)
