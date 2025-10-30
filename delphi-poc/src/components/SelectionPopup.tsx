import { useState } from 'react'
import { callAgent } from '../utils/ai'

interface SelectionPopupProps {
  onClose?: () => void
}

export default function SelectionPopup({ onClose }: SelectionPopupProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [canceled, setCanceled] = useState(false)
  const [controller, setController] = useState<AbortController | null>(null)

  const handleAction = async (action: string) => {
    setLoading(true)
    setCanceled(false)
    setResult(null)

    const abortController = new AbortController()
    setController(abortController)

    try {
      const response = await callAgent({ signal: abortController.signal })
      setResult(response)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setCanceled(true)
      } else {
        setResult('Error occurred')
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
      <div className="bg-gray-800 rounded-lg p-3 shadow-lg max-w-xs">
        <p className="text-sm text-white">{result}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-3 shadow-lg flex items-center gap-3">
        <p className="text-sm text-white">Loading...</p>
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
        className="px-3 py-1 text-sm text-white hover:bg-gray-700 rounded transition-colors"
      >
        Explain
      </button>
      <button
        onClick={() => handleAction('rephrase')}
        className="px-3 py-1 text-sm text-white hover:bg-gray-700 rounded transition-colors"
      >
        Rephrase
      </button>
      <button
        onClick={() => handleAction('cite')}
        className="px-3 py-1 text-sm text-white hover:bg-gray-700 rounded transition-colors"
      >
        Cite
      </button>
    </div>
  )
}
