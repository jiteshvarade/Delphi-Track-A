import { describe, it, expect } from 'vitest'
import {
  generateTemplateExplanation,
  generateTemplateRephrase,
  generateTemplateCitation
} from './templateFallbacks'

describe('Template Fallbacks (Model-OFF Mode)', () => {
  const sampleText = 'React is a JavaScript library for building user interfaces.'
  const longText = 'React is a popular JavaScript library developed by Facebook. '.repeat(20)

  describe('generateTemplateExplanation', () => {
    it('should generate explanation template with correct structure', () => {
      const result = generateTemplateExplanation(sampleText)
      
      expect(result).toBeDefined()
      expect(result.content).toContain('Understanding This Text')
      expect(result.content).toContain('Analysis:')
      expect(result.content).toContain('Key reading strategies:')
      expect(result.metadata.isTemplate).toBe(true)
      expect(result.metadata.action).toBe('explain')
    })

    it('should detect text complexity based on word count', () => {
      const shortText = 'Hello world'
      const result = generateTemplateExplanation(shortText)
      
      expect(result.content).toContain('simple passage')
    })

    it('should truncate long text in preview', () => {
      const result = generateTemplateExplanation(longText)
      
      // Should have ellipsis for long text
      expect(result.content).toContain('...')
    })

    it('should include timestamp in metadata', () => {
      const before = Date.now()
      const result = generateTemplateExplanation(sampleText)
      const after = Date.now()
      
      expect(result.metadata.timestamp).toBeGreaterThanOrEqual(before)
      expect(result.metadata.timestamp).toBeLessThanOrEqual(after)
    })
  })

  describe('generateTemplateRephrase', () => {
    it('should generate rephrase template with original and simplified versions', () => {
      const result = generateTemplateRephrase(sampleText)
      
      expect(result.content).toContain('Rephrased Version')
      expect(result.content).toContain('Original:')
      expect(result.content).toContain('Simplified:')
      expect(result.metadata.isTemplate).toBe(true)
      expect(result.metadata.action).toBe('rephrase')
    })

    it('should remove intensifier words', () => {
      const textWithIntensifiers = 'This is a very good and really important concept.'
      const result = generateTemplateRephrase(textWithIntensifiers)
      
      // Original should still have them
      expect(result.content).toContain(textWithIntensifiers)
      // Simplified should remove them
      expect(result.content).toContain('This is a good and important concept.')
    })

    it('should include simplification suggestions', () => {
      const result = generateTemplateRephrase(sampleText)
      
      expect(result.content).toContain('Suggestions for further improvement:')
      expect(result.content).toContain('Use active voice')
      expect(result.content).toContain('Common patterns to simplify:')
    })
  })

  describe('generateTemplateCitation', () => {
    it('should generate citation templates for all major styles', () => {
      const result = generateTemplateCitation(sampleText)
      
      expect(result.content).toContain('Citation Formats')
      expect(result.content).toContain('APA Style')
      expect(result.content).toContain('MLA Style')
      expect(result.content).toContain('Chicago Style')
      expect(result.metadata.isTemplate).toBe(true)
      expect(result.metadata.action).toBe('cite')
    })

    it('should include current year in citation examples', () => {
      const currentYear = new Date().getFullYear()
      const result = generateTemplateCitation(sampleText)
      
      expect(result.content).toContain(currentYear.toString())
    })

    it('should truncate long quotes in citation', () => {
      const result = generateTemplateCitation(longText)
      
      // Should truncate at 200 chars
      expect(result.content).toContain('...')
    })

    it('should include formatted date', () => {
      const result = generateTemplateCitation(sampleText)
      
      // Should have month name, not number
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December']
      const hasMonth = months.some(month => result.content.includes(month))
      expect(hasMonth).toBe(true)
    })
  })

  describe('Text type detection', () => {
    it('should detect code snippets', () => {
      const codeText = 'function hello() { const name = "World"; return name; }'
      const result = generateTemplateExplanation(codeText)
      
      expect(result.content).toContain('Code snippet')
    })

    it('should detect academic text', () => {
      const academicText = 'Therefore, we can conclude that the hypothesis is valid. However, further research is needed.'
      const result = generateTemplateExplanation(academicText)
      
      expect(result.content).toContain('Academic/formal text')
    })

    it('should detect questions', () => {
      const questionText = 'What is React? How does it work?'
      const result = generateTemplateExplanation(questionText)
      
      expect(result.content).toContain('Question or dialogue')
    })
  })
})
