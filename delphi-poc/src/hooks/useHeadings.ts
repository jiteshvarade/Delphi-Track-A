export interface Heading {
  id: string
  text: string
  level: number
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function useHeadings(content: string): Heading[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(content, 'text/html')
  
  const headings: Heading[] = []
  const elements = doc.querySelectorAll('h2, h3')
  
  elements.forEach((element) => {
    const text = element.textContent || ''
    const level = element.tagName.toLowerCase() === 'h2' ? 2 : 3
    const id = slugify(text)
    
    headings.push({ id, text, level })
  })
  
  return headings
}
