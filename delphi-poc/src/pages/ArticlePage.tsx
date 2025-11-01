import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import { useHeadings } from '../hooks/useHeadings'
import ReadingTrail from '../components/ReadingTrail'
import MobileTableOfContents from '../components/MobileTableOfContents'
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
  const navigate = useNavigate()
  const articles = useArticles()
  const article = articles.find((a) => a.id === (id ?? ''))
  
  const [selectionRange, setSelectionRange] = useState<Range | null>(null)
  const [selectedText, setSelectedText] = useState<string>('')
  const articleRef = useRef<HTMLElement>(null)

  // Scroll to top when article loads or changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!article) {
    return <div className="max-w-3xl mx-auto p-4">Article not found.</div>
  }
  
  const contentWithIds = addIdsToHeadings(article.content)
  const fullArticleHtml = `<h1>${article.title}</h1>${contentWithIds}`
  const headings = useHeadings(article.content)

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    // Don't close popup if clicking inside the SelectionPopup
    const target = e.target as HTMLElement
    if (target.closest('[data-selection-popup="true"]')) {
      return
    }

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
      // Small delay to allow mobile browsers to complete auto-scrolling
      setTimeout(() => {
        // SHOW the popup (set range and text)
        setSelectionRange(range)
        setSelectedText(text)
      }, 100)
    } else {
      // HIDE the popup (it's outside the article)
      setSelectionRange(null)
      setSelectedText('')
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 relative" onMouseUp={handleMouseUp} onTouchEnd={handleMouseUp}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:shadow-md transition-all"
        aria-label="Go back to articles"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Back to Articles
      </button>

      {headings.length > 2 ? (
        // Two-column layout with sidebar (laptops and up, including MacBooks)
        // Reading Trail on left, Article on right (like Google Docs)
        <div className="lg:grid lg:grid-cols-[220px_1fr] xl:grid-cols-[260px_1fr] gap-6 lg:gap-8 mt-8 mb-[75vh]">
          <div className="hidden lg:block lg:sticky top-8 z-10">
            <ReadingTrail headings={headings} />
          </div>
          <article
            ref={articleRef}
            className="prose lg:prose-lg xl:prose-xl prose-zinc dark:prose-invert [-webkit-touch-callout:none] max-w-none"
            dangerouslySetInnerHTML={{ __html: fullArticleHtml }}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      ) : (
        // Single-column centered layout
        <div className="mt-8">
          <article
            ref={articleRef}
            className="prose lg:prose-xl prose-zinc dark:prose-invert mx-auto [-webkit-touch-callout:none]"
            dangerouslySetInnerHTML={{ __html: fullArticleHtml }}
            onContextMenu={(e) => e.preventDefault()}
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
      
      {/* Mobile Table of Contents - Only shown when there are enough headings */}
      {headings.length > 2 && <MobileTableOfContents headings={headings} />}
    </div>
  )
}
