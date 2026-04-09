import { createContext, useContext, useState } from 'react'

const SettingsContext = createContext({})

export function SettingsProvider({ children }) {
  const [industriesEnabled, setIndustriesEnabled] = useState({
    food: true,
    electronics: true,
    pharma: true,
  })
  
  // 0.8 = relaxed, 1.0 = normal, 1.2 = strict
  const [sensitivity, setSensitivity] = useState(1.0)
  
  const [alertsEnabled, setAlertsEnabled] = useState(true)

  const toggleIndustry = (id) => {
    setIndustriesEnabled(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <SettingsContext.Provider value={{
      industriesEnabled, toggleIndustry,
      sensitivity, setSensitivity,
      alertsEnabled, setAlertsEnabled
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
