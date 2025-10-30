import type { Heading } from '../hooks/useHeadings'

interface ReadingTrailProps {
  headings: Heading[]
}

export default function ReadingTrail({ headings }: ReadingTrailProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 sticky top-8 self-start w-64">
      <h2 className="text-lg font-bold text-gray-900 mb-4">On this page</h2>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id} className={heading.level === 3 ? 'pl-4' : ''}>
              <a
                href={`#${heading.id}`}
                className="text-sm text-gray-600 hover:text-gray-900 block"
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
