import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import { useHeadings } from '../hooks/useHeadings'
import ReadingTrail from '../components/ReadingTrail'
import SelectionPopup from '../components/SelectionPopup'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function addIdsToHeadings(content: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(content, 'text/html')
  
  const headings = doc.querySelectorAll('h2, h3')
  headings.forEach((heading) => {
    const text = heading.textContent || ''
    const id = slugify(text)
    heading.setAttribute('id', id)
  })
  
  return doc.body.innerHTML
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const articles = useArticles()
  const article = articles.find((a) => a.id === (id ?? ''))
  
  const [selectionRange, setSelectionRange] = useState<Range | null>(null)
  const [selectedText, setSelectedText] = useState<string>('')
  const articleRef = useRef<HTMLElement>(null)

  if (!article) {
    return <div className="max-w-3xl mx-auto p-4">Article not found.</div>
  }
  
  const contentWithIds = addIdsToHeadings(article.content)
  const fullArticleHtml = `<h1>${article.title}</h1>${contentWithIds}`
  const headings = useHeadings(article.content)

  const handleMouseUp = () => {
    const selection = window.getSelection()

    // If nothing is selected (just a click)
    if (!selection || selection.isCollapsed) {
      // HIDE the popup
      setSelectionRange(null)
      setSelectedText('')
      return
    }

    const range = selection.getRangeAt(0)
    const text = selection.toString().trim()
    
    // Check if the selection is inside our article
    if (articleRef.current && articleRef.current.contains(range.commonAncestorContainer)) {
      // SHOW the popup (set range and text)
      setSelectionRange(range)
      setSelectedText(text)
    } else {
      // HIDE the popup (it's outside the article)
      setSelectionRange(null)
      setSelectedText('')
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 relative" onMouseUp={handleMouseUp} onTouchEnd={handleMouseUp}>
      {headings.length > 2 ? (
        // Two-column layout with sidebar (desktop only, single column on mobile)
        <div className="md:grid md:grid-cols-4 gap-8 mt-8 mb-[75vh]">
          <article
            ref={articleRef}
            className="prose lg:prose-xl prose-zinc dark:prose-invert md:col-span-3"
            dangerouslySetInnerHTML={{ __html: fullArticleHtml }}
          />
          <div className="hidden md:block md:col-span-1 md:sticky top-8 z-10">
            <ReadingTrail headings={headings} />
          </div>
        </div>
      ) : (
        // Single-column centered layout
        <div className="mt-8">
          <article
            ref={articleRef}
            className="prose lg:prose-xl prose-zinc dark:prose-invert mx-auto"
            dangerouslySetInnerHTML={{ __html: fullArticleHtml }}
          />
        </div>
      )}
      
      {selectionRange && (
        <SelectionPopup 
          range={selectionRange}
          selectedText={selectedText}
          onClose={() => {
            setSelectionRange(null)
            setSelectedText('')
          }} 
        />
      )}
    </div>
  )
}
