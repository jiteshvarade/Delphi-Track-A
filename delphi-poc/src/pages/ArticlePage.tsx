import { useParams } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const articles = useArticles()
  const article = articles.find((a) => a.id === (id ?? ''))

  if (!article) {
    return <div className="max-w-3xl mx-auto p-4">Article not found.</div>
  }
  
  const fullArticleHtml = `<h1>${article.title}</h1>${article.content}`

  return (
    <div className="max-w-3xl mx-auto p-4">
      <article
        className="prose lg:prose-xl mx-auto"
        dangerouslySetInnerHTML={{ __html: fullArticleHtml }}
      />
    </div>
  )
}
