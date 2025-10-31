import { Link } from 'react-router-dom'
import DarkModeToggle from './DarkModeToggle'

export default function Header() {
  return (
    <nav className="h-16 p-4 bg-zinc-50 dark:bg-zinc-900 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          Delphi Reader
        </Link>
        <DarkModeToggle />
      </div>
    </nav>
  )
}
