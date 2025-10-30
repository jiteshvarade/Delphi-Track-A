import { Link } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'

export default function HomePage() {
  const articles = useArticles()

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Articles</h1>
      <div className="space-y-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/article/${article.id}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-gray-900">{article.title}</h2>
            <p className="text-base text-gray-600 mt-1">{article.snippet}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
