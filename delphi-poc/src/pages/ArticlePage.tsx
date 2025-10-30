import { useParams } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import { useHeadings } from '../hooks/useHeadings'
import ReadingTrail from '../components/ReadingTrail'

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

  if (!article) {
    return <div className="max-w-3xl mx-auto p-4">Article not found.</div>
  }
  
  const contentWithIds = addIdsToHeadings(article.content)
  const fullArticleHtml = `<h1>${article.title}</h1>${contentWithIds}`
  const headings = useHeadings(article.content)

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-4 gap-8 mt-8">
        <article
          className="prose lg:prose-xl col-span-3"
          dangerouslySetInnerHTML={{ __html: fullArticleHtml }}
        />
        <div className="col-span-1">
          <ReadingTrail headings={headings} />
        </div>
      </div>
    </div>
  )
}
