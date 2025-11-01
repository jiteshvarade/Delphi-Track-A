import type { Heading } from '../hooks/useHeadings'

interface ReadingTrailProps {
  headings: Heading[]
}

export default function ReadingTrail({ headings }: ReadingTrailProps) {
  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-lg p-3 lg:p-4 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
      <h2 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-3 lg:mb-4">In this article</h2>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id} className={heading.level === 3 ? 'pl-3 lg:pl-4' : ''}>
              <a
                href={`#${heading.id}`}
                className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white block transition-colors leading-relaxed"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
