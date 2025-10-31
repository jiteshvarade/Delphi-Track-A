import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFloating, offset, flip, shift } from '@floating-ui/react'
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
  
  const [showPopup, setShowPopup] = useState(false)

  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    middleware: [offset(10), flip(), shift({ padding: 8 })],
  })

  if (!article) {
    return <div className="max-w-3xl mx-auto p-4">Article not found.</div>
  }
  
  const contentWithIds = addIdsToHeadings(article.content)
  const fullArticleHtml = `<h1>${article.title}</h1>${contentWithIds}`
  const headings = useHeadings(article.content)

  const handleMouseUp = () => {
    const selection = window.getSelection()
    const selectedText = selection?.toString().trim()

    if (selectedText && selectedText.length > 0) {
      const range = selection!.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      
      // Use refs.setPositionReference for virtual element
      refs.setPositionReference({
        getBoundingClientRect: () => rect,
      })
      setShowPopup(true)
    } else {
      setShowPopup(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 relative">
      {headings.length > 2 ? (
        // Two-column layout with sidebar
        <div className="grid grid-cols-4 gap-8 mt-8 mb-[75vh]">
          <article
            className="prose lg:prose-xl prose-zinc dark:prose-invert col-span-3"
            dangerouslySetInnerHTML={{ __html: fullArticleHtml }}
            onMouseUp={handleMouseUp}
          />
          <div className="col-span-1 sticky top-8 z-10">
            <ReadingTrail headings={headings} />
          </div>
        </div>
      ) : (
        // Single-column centered layout
        <div className="mt-8">
          <article
            className="prose lg:prose-xl prose-zinc dark:prose-invert mx-auto"
            dangerouslySetInnerHTML={{ __html: fullArticleHtml }}
            onMouseUp={handleMouseUp}
          />
        </div>
      )}
      
      {showPopup && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="z-50"
        >
          <SelectionPopup onClose={() => setShowPopup(false)} />
        </div>
      )}
    </div>
  )
}
