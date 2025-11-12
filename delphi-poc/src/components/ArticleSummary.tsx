import { useState } from 'react'
import { marked } from 'marked'
import { aiService } from '../services/aiService'
import { useToast } from '../context/ToastContext'

interface ArticleSummaryProps {
  articleTitle: string
  articleContent: string
}

export default function ArticleSummary({ articleTitle, articleContent }: ArticleSummaryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const generateSummary = async () => {
    if (summary) {
      setIsOpen(!isOpen)
      return
    }

    setLoading(true)
    setIsOpen(true)

    // Extract plain text from HTML (remove tags for better summarization)
    const plainText = articleContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const textToSummarize = plainText.slice(0, 3000) // Limit to ~3000 chars
    
    const prompt = `Summarize the following article in 3-5 key bullet points. Be concise and capture the main ideas:

Title: ${articleTitle}

Content:
${textToSummarize}

Provide a brief summary with key takeaways.`

    try {
      let fullSummary = ''
      
      await aiService.streamCompletion(
        prompt,
        {
          provider: 'gemini',
          model: 'gemini-2.5-flash-preview-05-20',
          temperature: 0.5,
          maxTokens: 300,
        },
        {
          onThinking: () => {},
          onToken: (token: string) => {
            fullSummary += token
            setSummary(fullSummary)
          },
          onComplete: (text: string) => {
            setSummary(text)
            setLoading(false)
          },
          onError: (err: Error) => {
            showToast(err.message, 'error')
            setLoading(false)
          },
        }
      )
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to generate summary', 'error')
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      {/* Header Button */}
      <button
        onClick={generateSummary}
        disabled={loading}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {loading ? 'Generating Summary...' : summary ? 'Article Summary' : 'Summarize Article'}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {loading ? 'AI is analyzing the article' : summary ? 'Click to toggle' : 'Get key points with AI'}
            </p>
          </div>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${isOpen && summary ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Summary Content */}
      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-zinc-800">
          {loading && (
            <div className="mt-4 flex items-center gap-3 p-4 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-zinc-800">
              <div className="animate-spin h-5 w-5 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Analyzing article and generating summary...</p>
            </div>
          )}

          {summary && !loading && (
            <div 
              className="mt-4 prose prose-sm dark:prose-invert max-w-none
                prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-white
                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                prose-strong:text-gray-900 dark:prose-strong:text-white
                prose-ul:my-2 prose-li:my-1 prose-li:text-gray-700 dark:prose-li:text-gray-300
                prose-li:marker:text-gray-500 dark:prose-li:marker:text-gray-400"
              dangerouslySetInnerHTML={{ __html: marked.parse(summary) }}
            />
          )}
        </div>
      )}
    </div>
  )
}
