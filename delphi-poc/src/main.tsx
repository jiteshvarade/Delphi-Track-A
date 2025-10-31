import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { LogProvider } from './context/LogContext'
import './index.css'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const ArticlePage = lazy(() => import('./pages/ArticlePage'))
const LogsPage = lazy(() => import('./pages/LogsPage'))

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin h-8 w-8 border-3 border-indigo-600 border-t-transparent rounded-full"></div>
  </div>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LogProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/article/:id" element={<ArticlePage />} />
              <Route path="/logs" element={<LogsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </LogProvider>
  </StrictMode>,
)
