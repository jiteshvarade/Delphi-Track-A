import { useState } from 'react'
import { callAgent } from '../utils/ai'
import { useLog } from '../context/LogContext'

interface SelectionPopupProps {
  onClose?: () => void
}

export default function SelectionPopup({ onClose }: SelectionPopupProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [canceled, setCanceled] = useState(false)
  const [controller, setController] = useState<AbortController | null>(null)
  const { addLog } = useLog()

  const handleAction = async (action: string) => {
    const actionName = action.charAt(0).toUpperCase() + action.slice(1)
    addLog(`User triggered ${actionName}`)
    
    setLoading(true)
    setCanceled(false)
    setResult(null)

    const abortController = new AbortController()
    setController(abortController)

    try {
      const response = await callAgent({ 
        signal: abortController.signal,
        action: action
      })
      setResult(response)
      addLog(`${actionName} action succeeded`)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setCanceled(true)
        addLog(`${actionName} action canceled`)
      } else {
        setResult('Error occurred')
        addLog(`${actionName} action failed`)
      }
    } finally {
      setLoading(false)
      setController(null)
    }
  }

  const handleCancel = () => {
    if (controller) {
      controller.abort()
    }
  }

  if (canceled) {
    return (
      <div className="bg-gray-800 rounded-lg p-3 shadow-lg">
        <p className="text-sm text-white">Canceled</p>
      </div>
    )
  }

  if (result) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg max-w-xs">
        <p className="p-2 text-sm text-gray-200">{result}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-3 shadow-lg flex items-center gap-3">
        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
        <button
          onClick={handleCancel}
          className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-2 flex gap-2 shadow-lg">
      <button
        onClick={() => handleAction('explain')}
        className="p-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors"
      >
        Explain
      </button>
      <button
        onClick={() => handleAction('rephrase')}
        className="p-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors"
      >
        Rephrase
      </button>
      <button
        onClick={() => handleAction('cite')}
        className="p-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors"
      >
        Cite
      </button>
    </div>
  )
}
