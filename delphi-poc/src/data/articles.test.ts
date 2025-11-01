import { describe, it, expect } from 'vitest'
import { useArticles, type Article } from '../hooks/useArticles'

describe('Articles Data', () => {
  const articles = useArticles()

  it('should have at least one article', () => {
    expect(articles.length).toBeGreaterThan(0)
  })

  it('all articles should have required fields', () => {
    articles.forEach((article: Article) => {
      expect(article).toHaveProperty('id')
      expect(article).toHaveProperty('title')
      expect(article).toHaveProperty('snippet')
      expect(article).toHaveProperty('content')
    })
  })

  it('article IDs should be unique', () => {
    const ids = articles.map((a: Article) => a.id)
    const uniqueIds = new Set(ids)
    
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('IDs should be strings', () => {
    articles.forEach((article: Article) => {
      expect(typeof article.id).toBe('string')
      expect(article.id.length).toBeGreaterThan(0)
    })
  })

  it('titles should not be empty', () => {
    articles.forEach((article: Article) => {
      expect(article.title.length).toBeGreaterThan(0)
      expect(article.title.trim()).not.toBe('')
    })
  })

  it('content should not be empty', () => {
    articles.forEach((article: Article) => {
      expect(article.content.length).toBeGreaterThan(0)
      expect(article.content.trim()).not.toBe('')
    })
  })

  it('should have proper HTML structure in content', () => {
    articles.forEach((article: Article) => {
      // Should have at least one paragraph or heading
      const hasContent = article.content.includes('<p>') || 
                        article.content.includes('<h2>') ||
                        article.content.includes('<h3>')
      expect(hasContent).toBe(true)
    })
  })

  it('snippets should be shorter than content', () => {
    articles.forEach((article: Article) => {
      expect(article.snippet.length).toBeLessThan(article.content.length)
    })
  })
})
