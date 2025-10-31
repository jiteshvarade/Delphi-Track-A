import { useLog } from '../context/LogContext'

export default function LogsPage() {
  const { logs } = useLog()

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Activity Logs</h1>
        
        {logs.length === 0 ? (
          <p className="text-gray-600">No logs yet.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log, index) => (
              <li key={index}>
                <div className="bg-white dark:bg-zinc-800 p-3 rounded shadow-sm border border-gray-200 dark:border-zinc-700">
                  <p className="text-sm font-mono text-zinc-700 dark:text-zinc-300">{log}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
