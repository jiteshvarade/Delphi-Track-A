import { useState } from 'react'
import { callAgent } from '../utils/ai'
import { useLog } from '../context/LogContext'

interface SelectionPopupProps {
  range: Range | null
  selectedText: string
  onClose?: () => void
}

export default function SelectionPopup({ selectedText, onClose }: SelectionPopupProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [canceled, setCanceled] = useState(false)
  const [controller, setController] = useState<AbortController | null>(null)
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const { addLog } = useLog()

  const handleAction = async (action: string) => {
    console.log('🔘 Button clicked! Action:', action)
    const actionName = action.charAt(0).toUpperCase() + action.slice(1)
    addLog(`User triggered ${actionName} on: "${selectedText.slice(0, 50)}${selectedText.length > 50 ? '...' : ''}"`, 'info')
    
    setActiveAction(action)
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
      addLog(`${actionName} action succeeded`, 'success')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setCanceled(true)
        addLog(`${actionName} action canceled by user`, 'warning')
      } else {
        setResult('Error occurred')
        addLog(`${actionName} action failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
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

  const getActionTitle = () => {
    if (!activeAction) return 'AI Assistant'
    return activeAction.charAt(0).toUpperCase() + activeAction.slice(1)
  }

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div 
        className="fixed top-0 right-0 bottom-0 w-full md:w-96 bg-white dark:bg-zinc-900 shadow-2xl z-50 flex flex-col border-l border-zinc-200 dark:border-zinc-800"
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {getActionTitle()}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Close panel"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-1 p-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction('explain')
            }}
            onTouchEnd={(e) => {
              e.stopPropagation()
              e.preventDefault()
              handleAction('explain')
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeAction === 'explain'
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Explain
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction('rephrase')
            }}
            onTouchEnd={(e) => {
              e.stopPropagation()
              e.preventDefault()
              handleAction('rephrase')
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeAction === 'rephrase'
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Rephrase
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction('cite')
            }}
            onTouchEnd={(e) => {
              e.stopPropagation()
              e.preventDefault()
              handleAction('cite')
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeAction === 'cite'
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Cite
          </button>
        </div>

        {/* Selected Text Display */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Selected Text</p>
          <blockquote className="text-sm text-zinc-700 dark:text-zinc-300 italic border-l-3 border-indigo-400 dark:border-indigo-600 pl-3 max-h-32 overflow-y-auto">
            {selectedText}
          </blockquote>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
              <div className="animate-spin h-5 w-5 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Processing...</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">Analyzing your selected text</p>
              </div>
              <button
                onClick={handleCancel}
                onTouchEnd={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  handleCancel()
                }}
                className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                title="Cancel"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {canceled && (
            <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Action Canceled</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">The operation was canceled by user</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-sm font-medium">Complete</span>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{result}</p>
              </div>
            </div>
          )}

          {!loading && !result && !canceled && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Select an action above</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">Choose Explain, Rephrase, or Cite</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
