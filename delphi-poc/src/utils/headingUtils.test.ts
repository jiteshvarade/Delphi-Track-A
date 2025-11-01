import { describe, it, expect } from 'vitest'

describe('Text Utilities', () => {
  describe('slugify function logic', () => {
    // Testing the slugify logic that's used in ArticlePage
    function slugify(text: string): string {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    it('should convert text to lowercase', () => {
      expect(slugify('HELLO WORLD')).toBe('hello-world')
    })

    it('should replace spaces with hyphens', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })

    it('should remove special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world')
    })

    it('should handle multiple consecutive spaces', () => {
      expect(slugify('Hello    World')).toBe('hello-world')
    })

    it('should remove leading and trailing hyphens', () => {
      expect(slugify(' Hello World ')).toBe('hello-world')
    })

    it('should handle ampersands', () => {
      expect(slugify('Using & Understanding')).toBe('using-understanding')
    })

    it('should handle complex strings', () => {
      expect(slugify('Complex! Heading: With (Symbols)')).toBe('complex-heading-with-symbols')
    })
  })

  describe('text selection utilities', () => {
    it('should handle empty strings', () => {
      const text = ''
      expect(text.trim()).toBe('')
      expect(text.length).toBe(0)
    })

    it('should trim whitespace', () => {
      const text = '  Hello World  '
      expect(text.trim()).toBe('Hello World')
    })

    it('should count words correctly', () => {
      const text = 'React is a JavaScript library'
      const wordCount = text.split(/\s+/).length
      expect(wordCount).toBe(5)
    })
  })
})
