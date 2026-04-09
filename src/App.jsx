import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import { fetchLiveData } from "./services/dataService";

export default function App() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}