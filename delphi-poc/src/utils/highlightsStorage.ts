// Highlights Storage - Persists user's highlighted text with notes

export interface Highlight {
  id: string
  articleId: string
  text: string
  note: string
  color: 'yellow' | 'green' | 'blue' | 'pink'
  timestamp: number
}

const STORAGE_KEY = 'article_highlights'

export class HighlightsStorage {
  getHighlights(articleId?: string): Highlight[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []
      
      const all: Highlight[] = JSON.parse(stored)
      return articleId ? all.filter(h => h.articleId === articleId) : all
    } catch (error) {
      console.error('Failed to load highlights:', error)
      return []
    }
  }

  saveHighlight(highlight: Omit<Highlight, 'id' | 'timestamp'>): Highlight {
    const newHighlight: Highlight = {
      ...highlight,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    }

    const highlights = this.getHighlights()
    highlights.push(newHighlight)
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(highlights))
      return newHighlight
    } catch (error) {
      console.error('Failed to save highlight:', error)
      throw error
    }
  }

  deleteHighlight(id: string): void {
    const highlights = this.getHighlights().filter(h => h.id !== id)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(highlights))
    } catch (error) {
      console.error('Failed to delete highlight:', error)
      throw error
    }
  }

  updateHighlight(id: string, updates: Partial<Omit<Highlight, 'id' | 'timestamp'>>): void {
    const highlights = this.getHighlights()
    const index = highlights.findIndex(h => h.id === id)
    
    if (index !== -1) {
      highlights[index] = { ...highlights[index], ...updates }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(highlights))
      } catch (error) {
        console.error('Failed to update highlight:', error)
        throw error
      }
    }
  }

  getAllArticlesWithHighlights(): string[] {
    const highlights = this.getHighlights()
    return Array.from(new Set(highlights.map(h => h.articleId)))
  }
}

export const highlightsStorage = new HighlightsStorage()
