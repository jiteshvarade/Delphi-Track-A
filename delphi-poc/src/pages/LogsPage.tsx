import { useLog } from '../context/LogContext'

export default function LogsPage() {
  const { logs } = useLog()

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Activity Logs</h1>
        
        {logs.length === 0 ? (
          <p className="text-gray-600">No logs yet.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log, index) => (
              <li
                key={index}
                className="bg-white p-3 rounded shadow-sm border border-gray-200 text-sm text-gray-700 font-mono"
              >
                {log}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
