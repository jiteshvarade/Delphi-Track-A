import { Link } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'

export default function HomePage() {
  const articles = useArticles()

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen relative">
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-zinc-100 mb-8">Articles</h1>
        <div className="space-y-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.id}`}
              className="block p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-200 dark:border-zinc-700"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{article.title}</h2>
              <p className="text-base text-gray-600 dark:text-zinc-400 mt-1">{article.snippet}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
