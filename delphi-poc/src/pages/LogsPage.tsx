import { useState, useMemo } from 'react'
import { useLog } from '../context/LogContext'
import type { LogEntry } from '../context/LogContext'

export default function LogsPage() {
  const { logs, clearLogs } = useLog()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<LogEntry['type'] | 'all'>('all')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'hour'>('all')

  // Filter logs based on search, type, and date
  const filteredLogs = useMemo(() => {
    let filtered = [...logs].reverse() // Show newest first

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(log => log.type === typeFilter)
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      filtered = filtered.filter(log => {
        const logTime = new Date(log.timestamp)
        if (dateFilter === 'today') {
          return logTime.toDateString() === now.toDateString()
        } else if (dateFilter === 'hour') {
          return now.getTime() - logTime.getTime() < 3600000 // 1 hour
        }
        return true
      })
    }

    return filtered
  }, [logs, searchQuery, typeFilter, dateFilter])

  const getTypeStyles = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
      case 'error':
        return 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
      default:
        return 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    }
  }

  const getTypeBadge = (type: LogEntry['type']) => {
    const badge = type.toUpperCase()
    return (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded ${getTypeStyles(type)}`}>
        {badge}
      </span>
    )
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Activity Logs
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
              {logs.length !== filteredLogs.length && ` (${logs.length} total)`}
            </p>
          </div>
          <button
            onClick={clearLogs}
            disabled={logs.length === 0}
            className="mt-4 md:mt-0 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 border border-red-300 dark:border-red-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear All Logs
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as LogEntry['type'] | 'all')}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              >
                <option value="all">All Types</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Time Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'hour')}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="hour">Last Hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logs List */}
        {filteredLogs.length === 0 ? (
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-12 text-center">
            <div className="text-zinc-400 dark:text-zinc-500 mb-2">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {logs.length === 0 ? 'No logs yet' : 'No logs match your filters'}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
              {logs.length === 0 ? 'Start interacting with the app to see activity logs' : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Timestamp */}
                  <div className="flex-shrink-0 text-right min-w-[100px]">
                    <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      {formatTime(log.timestamp)}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-500">
                      {formatDate(log.timestamp)}
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="flex-shrink-0 pt-0.5">
                    {getTypeBadge(log.type)}
                  </div>

                  {/* Message */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 break-words">
                      {log.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
