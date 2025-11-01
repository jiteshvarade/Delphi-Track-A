/**
 * AI Service - Gemini Only (Free Tier)
 */

export type AIProvider = 'gemini'
export type AIModel = 'gemini-2.5-flash-preview-05-20'

export interface AIConfig {
  provider: AIProvider
  model: AIModel
  temperature?: number
  maxTokens?: number
}

export interface StreamCallbacks {
  onToken: (token: string) => void
  onComplete: (fullText: string, stats: UsageStats) => void
  onError: (error: Error) => void
  onThinking?: (message: string) => void
}

export interface UsageStats {
  inputTokens: number
  outputTokens: number
  totalTokens: number
  estimatedCost: number
  duration: number
}

class AIService {
  /**
   * Stream AI response from Gemini
   */
  async streamCompletion(
    prompt: string,
    _config: AIConfig,  // Unused - Gemini uses fixed configuration
    callbacks: StreamCallbacks,
    signal?: AbortSignal
  ): Promise<void> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('Gemini API key not configured')
    }

    const startTime = Date.now()
    let fullText = ''
    let inputTokens = 0
    let outputTokens = 0

    try {
      // Show thinking indicator
      callbacks.onThinking?.('Understanding your request...')
      await new Promise(resolve => setTimeout(resolve, 500))

      callbacks.onThinking?.('Analyzing context...')
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          }),
          signal // Pass abort signal to fetch
        }
      )

      // Check if aborted during fetch
      if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError')
      }

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Gemini API error (${response.status}): ${errorData}`)
      }

      callbacks.onThinking?.('Generating response...')
      const data = await response.json()

      // Check if aborted after receiving response
      if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError')
      }

      // Extract and format text
      if (data.candidates && data.candidates[0]?.content?.parts) {
        let text = data.candidates[0].content.parts.map((p: any) => p.text).join('')
        
        // Clean up formatting - remove excessive line breaks
        text = text.replace(/\n{3,}/g, '\n\n').trim()
        
        // Stream word by word for smooth effect
        const words = text.split(/(\s+)/)
        for (const word of words) {
          if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
          
          fullText += word
          callbacks.onToken(word)
          await new Promise(resolve => setTimeout(resolve, 20))
        }

        // Get token counts
        if (data.usageMetadata) {
          inputTokens = data.usageMetadata.promptTokenCount || 0
          outputTokens = data.usageMetadata.candidatesTokenCount || 0
        }
      }

      const duration = Date.now() - startTime
      callbacks.onComplete(fullText, {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
        estimatedCost: 0,
        duration,
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error
      }
      callbacks.onError(error instanceof Error ? error : new Error('Unknown error'))
    }
  }

  /**
   * Check if Gemini is available
   */
  isProviderAvailable(provider: AIProvider): boolean {
    return provider === 'gemini' && !!import.meta.env.VITE_GEMINI_API_KEY
  }

  /**
   * Get available providers (only Gemini)
   */
  getAvailableProviders(): AIProvider[] {
    return import.meta.env.VITE_GEMINI_API_KEY ? ['gemini'] : []
  }
}

export const aiService = new AIService()
