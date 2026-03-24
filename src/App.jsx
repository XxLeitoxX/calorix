import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CalorieProvider } from './context/CalorieContext'

const HomePage = lazy(() => import('./pages/HomePage'))
const FoodPage = lazy(() => import('./pages/FoodPage'))
const SEOPage = lazy(() => import('./pages/SEOPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage'))
const CookiesPage = lazy(() => import('./pages/CookiesPage'))

function App() {
  return (
    <CalorieProvider>
      <Suspense fallback={<div className="min-h-screen bg-calorix-bg" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/food/:slug" element={<FoodPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/:slug" element={<SEOPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </CalorieProvider>
  )
}

export default App
