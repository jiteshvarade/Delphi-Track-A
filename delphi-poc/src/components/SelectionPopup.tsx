import { useState, useEffect } from 'react'
import { marked } from 'marked'
import { aiService, type AIProvider, type UsageStats } from '../services/aiService'
import { useLog } from '../context/LogContext'
import { useToast } from '../context/ToastContext'
import { generateTemplateExplanation, generateTemplateRephrase, generateTemplateCitation } from '../utils/templateFallbacks'

// Configure marked for better output
marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true, // GitHub flavored markdown
})

interface SelectionPopupProps {
  range: Range | null
  selectedText: string
  onClose?: () => void
  onOpenHighlights?: () => void
  highlightCount?: number
}

export default function SelectionPopup({ selectedText, onClose, onOpenHighlights, highlightCount = 0 }: SelectionPopupProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [streaming, setStreaming] = useState(false)
  const [canceled, setCanceled] = useState(false)
  const [controller, setController] = useState<AbortController | null>(null)
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [thinkingMessage, setThinkingMessage] = useState<string>('')
  const [modelEnabled, setModelEnabled] = useState(() => {
    const saved = localStorage.getItem('modelEnabled')
    return saved !== null ? saved === 'true' : true
  })
  const provider: AIProvider = 'gemini' // Only Gemini supported
  const { addLog } = useLog()
  const { showToast } = useToast()

  useEffect(() => {
    localStorage.setItem('modelEnabled', modelEnabled.toString())
  }, [modelEnabled])

  const handleAction = async (action: string) => {
    const actionName = action.charAt(0).toUpperCase() + action.slice(1)
    addLog(`User triggered ${actionName} on: "${selectedText.slice(0, 50)}${selectedText.length > 50 ? '...' : ''}"`, 'info')
    
    setActiveAction(action)
    setLoading(true)
    setCanceled(false)
    setResult('')
    setUsageStats(null)

    // Model-OFF mode: Use template fallbacks
    if (!modelEnabled) {
      addLog(`${actionName} action using template fallback (Model OFF)`, 'info')
      setLoading(true)
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const template = action === 'explain' 
        ? generateTemplateExplanation(selectedText)
        : action === 'rephrase'
        ? generateTemplateRephrase(selectedText)
        : generateTemplateCitation(selectedText)
      
      setResult(template.content)
      setUsageStats({
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        estimatedCost: 0,
        duration: 800
      })
      setLoading(false)
      addLog(`${actionName} template generated`, 'success')
      return
    }
    
    // Check if AI provider is available
    if (!aiService.isProviderAvailable(provider)) {
      setResult('⚠️ AI provider not configured. Please add your API key to .env.local')
      addLog('AI provider not configured', 'error')
      setLoading(false)
      return
    }

    setStreaming(true)

    const abortController = new AbortController()
    setController(abortController)

    // Build prompt based on action
    const prompts = {
      explain: `Explain the following text in simple terms:\n\n"${selectedText}"`,
      rephrase: `Rephrase the following text to be clearer and more concise:\n\n"${selectedText}"`,
      cite: `Create a proper citation for the following text:\n\n"${selectedText}"`,
    }

    const prompt = prompts[action as keyof typeof prompts] || prompts.explain

    try {
      await aiService.streamCompletion(
        prompt,
        {
          provider: 'gemini',
          model: 'gemini-2.5-flash-preview-05-20',
          temperature: 0.7,
          maxTokens: 500,
        },
        {
          onThinking: (message) => {
            setThinkingMessage(message)
          },
          onToken: (token) => {
            setThinkingMessage('')
            setResult((prev) => prev + token)
          },
          onComplete: (fullText, stats) => {
            setThinkingMessage('')
            setResult(fullText)
            setUsageStats(stats)
            setStreaming(false)
            setLoading(false)
            addLog(`${actionName} action completed (${stats.totalTokens} tokens, $${stats.estimatedCost.toFixed(4)})`, 'success')
          },
          onError: (error) => {
            setStreaming(false)
            setLoading(false)
            setThinkingMessage('')
            
            // Only show canceled if it was actually aborted
            if (error.name === 'AbortError') {
              setCanceled(true)
              setResult('') // Clear any partial result
            } else {
              // Show toast notification instead of inline error
              showToast(error.message, 'error')
              setResult('') // Clear result on error
            }
            addLog(`AI error: ${error.message}`, 'error')
          },
        },
        abortController.signal
      )
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setCanceled(true)
        addLog(`${actionName} action canceled by user`, 'warning')
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        showToast(errorMessage, 'error')
        setResult('') // Clear result on error
        addLog(`${actionName} action failed: ${errorMessage}`, 'error')
      }
      setLoading(false)
      setStreaming(false)
      setController(null)
    }
  }

  const handleCancel = () => {
    if (controller) {
      controller.abort()
      setController(null)
      setStreaming(false)
      setLoading(false)
      setResult('') // Clear any partial result
      setCanceled(true)
      setThinkingMessage('')
      addLog('User canceled AI action', 'info')
    }
  }

  const getActionTitle = () => {
    if (!activeAction) return 'AI Assistant'
    return activeAction.charAt(0).toUpperCase() + activeAction.slice(1)
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Side Panel - Full screen on mobile, sidebar on desktop */}
      <div 
        data-selection-popup="true"
        className="fixed inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto w-full md:w-[480px] max-h-[85vh] md:max-h-full bg-white dark:bg-black shadow-2xl border-t md:border-t-0 md:border-l border-gray-200 dark:border-zinc-800 flex flex-col z-50 rounded-t-2xl md:rounded-none animate-in slide-in-from-bottom md:slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-12 h-1 bg-zinc-300 dark:bg-zinc-600 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-900 dark:bg-white rounded-lg">
                <svg className="w-5 h-5 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">{getActionTitle()}</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {modelEnabled ? 'Gemini AI • Free' : 'Template Mode'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              title="Close"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Model Toggle */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">AI Model:</span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">
                {modelEnabled ? 'ON' : 'OFF'}
              </span>
            </div>
            <button
              onClick={() => setModelEnabled(!modelEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
                modelEnabled ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-zinc-700'
              }`}
              aria-label="Toggle AI Model"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                  modelEnabled ? 'bg-white dark:bg-black translate-x-6' : 'bg-gray-500 dark:bg-gray-400 translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:flex gap-2 p-3 md:p-4 border-b border-gray-200 dark:border-zinc-800">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction('explain')
            }}
            disabled={loading}
            className={`flex-1 px-3 md:px-4 py-2.5 rounded-lg font-medium text-xs md:text-sm transition-all ${
              activeAction === 'explain'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                : 'bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 border border-gray-300 dark:border-zinc-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Explain
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction('rephrase')
            }}
            disabled={loading}
            className={`flex-1 px-3 md:px-4 py-2.5 rounded-lg font-medium text-xs md:text-sm transition-all ${
              activeAction === 'rephrase'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                : 'bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 border border-gray-300 dark:border-zinc-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Rephrase
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction('cite')
            }}
            disabled={loading}
            className={`flex-1 px-3 md:px-4 py-2.5 rounded-lg font-medium text-xs md:text-sm transition-all ${
              activeAction === 'cite'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                : 'bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 border border-gray-300 dark:border-zinc-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Cite
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenHighlights?.()
            }}
            disabled={loading}
            className="flex-1 px-3 md:px-4 py-2.5 rounded-lg font-medium text-xs md:text-sm transition-all bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2 relative">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>Highlight</span>
              {highlightCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {highlightCount}
                </span>
              )}
            </span>
          </button>
        </div>

        {/* Selected Text Display */}
        <div className="px-3 md:px-4 py-2.5 md:py-3 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Selected Text
          </p>
          <div className="text-sm text-gray-900 dark:text-white italic border-l-2 border-gray-400 dark:border-gray-600 pl-3 line-clamp-3">
            {selectedText}
          </div>
        </div>

        {/* Content Area - Single scroll container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white dark:bg-black">
          {loading && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800">
              <div className="animate-spin h-5 w-5 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {thinkingMessage || 'Processing...'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  {thinkingMessage ? 'Gemini AI' : 'Analyzing your text'}
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs font-medium text-gray-900 dark:text-white bg-white dark:bg-black border border-gray-300 dark:border-zinc-700 rounded hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {canceled && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Action Canceled</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Operation canceled</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Status Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  {streaming ? (
                    <>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-900 dark:bg-white rounded-full animate-pulse"></span>
                        <span className="w-1.5 h-1.5 bg-gray-900 dark:bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-900 dark:bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">Streaming...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Complete</span>
                    </>
                  )}
                </div>
                
                {/* Usage Stats */}
                {usageStats && !streaming && (
                  <div className="flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-zinc-700">
                    {modelEnabled ? (
                      <>
                        <span title="Total tokens">{usageStats.totalTokens} tokens</span>
                        <span>•</span>
                        <span title="Estimated cost" className="font-medium">FREE</span>
                        <span>•</span>
                        <span title="Response time">{(usageStats.duration / 1000).toFixed(1)}s</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-medium">Template</span>
                        <span>•</span>
                        <span title="Response time">{(usageStats.duration / 1000).toFixed(1)}s</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* AI Response */}
              <div 
                className="prose prose-sm dark:prose-invert max-w-none 
                  prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-white
                  prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                  prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                  prose-ul:my-3 prose-li:my-1.5 prose-li:text-gray-700 dark:prose-li:text-gray-300
                  prose-ol:my-3 prose-code:text-gray-900 dark:prose-code:text-white
                  prose-code:bg-gray-100 dark:prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-gray-300 dark:prose-code:border-zinc-700"
                dangerouslySetInnerHTML={{ 
                  __html: marked.parse(result) + (streaming ? '<span class="inline-block w-0.5 h-4 ml-1 bg-gray-900 dark:bg-white animate-pulse"></span>' : '')
                }}
              />
            </div>
          )}

          {!loading && !result && !canceled && (
            <div className="text-center py-16">
              <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 dark:bg-zinc-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-700 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Select an action above</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Choose Explain, Rephrase, or Cite</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
