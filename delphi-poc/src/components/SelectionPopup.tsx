import React, { useState } from 'react'
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react'
import { callAgent } from '../utils/ai'
import { useLog } from '../context/LogContext'

interface SelectionPopupProps {
  range: Range | null
  selectedText: string
  onClose?: () => void
}

export default function SelectionPopup({ range, selectedText, onClose: _onClose }: SelectionPopupProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [canceled, setCanceled] = useState(false)
  const [controller, setController] = useState<AbortController | null>(null)
  const { addLog } = useLog()

  // Use virtual element positioning with the Range object
  // Prefer right side, but allow flipping to other sides if no space
  const { refs, floatingStyles } = useFloating({
    placement: 'right-start',
    strategy: 'fixed', // Use fixed positioning for better mobile scroll handling
    middleware: [
      offset(12), // Slightly more offset for better spacing
      flip({
        fallbackPlacements: ['right', 'left', 'top', 'bottom'],
      }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  })

  // Update virtual reference position based on the Range
  React.useLayoutEffect(() => {
    if (range) {
      refs.setReference({
        getBoundingClientRect: () => range.getBoundingClientRect(),
        getClientRects: () => range.getClientRects(),
      })
    }
  }, [refs, range])

  const handleAction = async (action: string) => {
    console.log('🔘 Button clicked! Action:', action)
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
      <div 
        ref={refs.setFloating}
        style={floatingStyles}
        className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl p-4 ring-1 ring-zinc-200 dark:ring-zinc-700 z-50"
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-zinc-700 dark:text-zinc-200">Canceled</p>
      </div>
    )
  }

  if (result) {
    return (
      <div 
        ref={refs.setFloating}
        style={floatingStyles}
        className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl p-4 ring-1 ring-zinc-200 dark:ring-zinc-700 max-w-xs z-50"
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-zinc-700 dark:text-zinc-200">{result}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div 
        ref={refs.setFloating}
        style={floatingStyles}
        className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl p-4 ring-1 ring-zinc-200 dark:ring-zinc-700 flex items-center gap-3 z-50"
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        <div className="animate-spin h-4 w-4 border-2 border-zinc-700 dark:border-zinc-200 border-t-transparent rounded-full"></div>
        <button
          onClick={handleCancel}
          onTouchEnd={(e) => {
            e.stopPropagation()
            e.preventDefault()
            handleCancel()
          }}
          className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div 
      ref={refs.setFloating}
      style={floatingStyles}
      className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl p-4 ring-1 ring-zinc-200 dark:ring-zinc-700 z-50 max-w-xs"
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
    >
      <blockquote className="border-l-4 border-indigo-300 dark:border-indigo-600 pl-3 italic text-zinc-600 dark:text-zinc-400 mb-3 text-sm">
        {selectedText}
      </blockquote>
      <div className="flex gap-2">
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
          className="p-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors"
        >
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
          className="p-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors"
        >
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
          className="p-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors"
        >
          Cite
        </button>
      </div>
    </div>
  )
}
