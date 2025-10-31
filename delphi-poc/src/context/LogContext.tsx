import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export interface LogEntry {
  id: string
  timestamp: Date
  type: 'info' | 'success' | 'error' | 'warning'
  message: string
}

interface LogContextType {
  logs: LogEntry[]
  addLog: (message: string, type?: LogEntry['type']) => void
  clearLogs: () => void
}

const LogContext = createContext<LogContextType | undefined>(undefined)

export function LogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem('activity-logs')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        
        // Handle old string-based logs (migration)
        if (parsed.length > 0 && typeof parsed[0] === 'string') {
          console.log('Migrating old log format...')
          // Clear old logs and start fresh
          localStorage.removeItem('activity-logs')
          return []
        }
        
        // Convert timestamp strings back to Date objects
        return parsed.map((log: LogEntry) => ({
          ...log,
          type: log.type || 'info', // Provide default type for old logs
          timestamp: new Date(log.timestamp)
        }))
      } catch (error) {
        console.error('Error loading logs:', error)
        // Clear corrupted logs
        localStorage.removeItem('activity-logs')
        return []
      }
    }
    return []
  })

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type,
      message
    }
    setLogs((prev) => {
      const updated = [...prev, newLog]
      // Persist to localStorage
      localStorage.setItem('activity-logs', JSON.stringify(updated))
      return updated
    })
  }

  const clearLogs = () => {
    setLogs([])
    localStorage.removeItem('activity-logs')
  }

  return (
    <LogContext.Provider value={{ logs, addLog, clearLogs }}>
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
