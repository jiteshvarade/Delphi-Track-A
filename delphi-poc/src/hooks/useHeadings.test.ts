/* @vitest-environment jsdom */
import { describe, it, expect } from 'vitest'
import { useHeadings } from './useHeadings'

describe('useHeadings', () => {
  it('returns an empty array for empty content', () => {
    const result = useHeadings('')
    expect(result).toEqual([])
  })

  it('finds all h2 and h3 tags with correct levels', () => {
    const html = `
      <h1>Title</h1>
      <h2>Section One</h2>
      <p>Body</p>
      <h3>Sub A</h3>
      <h2>Section Two</h2>
      <h3>Sub B</h3>
    `
    const result = useHeadings(html)

    // Should include exactly the h2 and h3 elements (4 total)
    expect(result.length).toBe(4)

    // Order preserved as they appear in the document
    expect(result[0].text).toBe('Section One')
    expect(result[0].level).toBe(2)

    expect(result[1].text).toBe('Sub A')
    expect(result[1].level).toBe(3)

    expect(result[2].text).toBe('Section Two')
    expect(result[2].level).toBe(2)

    expect(result[3].text).toBe('Sub B')
    expect(result[3].level).toBe(3)
  })

  it("creates a slugified id for headings (e.g., 'Notable features' -> 'notable-features')", () => {
    const html = `<h2>Notable features</h2>`
    const result = useHeadings(html)

    expect(result.length).toBe(1)
    expect(result[0].text).toBe('Notable features')
    expect(result[0].id).toBe('notable-features')
  })
})
