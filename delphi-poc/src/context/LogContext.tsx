import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface LogContextType {
  logs: string[]
  addLog: (message: string) => void
}

const LogContext = createContext<LogContextType | undefined>(undefined)

export function LogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<string[]>(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem('activity-logs')
    return stored ? JSON.parse(stored) : []
  })

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const newLog = `[${timestamp}] ${message}`
    setLogs((prev) => {
      const updated = [...prev, newLog]
      // Persist to localStorage
      localStorage.setItem('activity-logs', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <LogContext.Provider value={{ logs, addLog }}>
      {children}
    </LogContext.Provider>
  )
}

export function useLog() {
  const context = useContext(LogContext)
  if (!context) {
    throw new Error('useLog must be used within a LogProvider')
  }
  return context
}
