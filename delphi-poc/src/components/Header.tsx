import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import DarkModeToggle from './DarkModeToggle'
import { useArticles } from '../hooks/useArticles'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [articlesDropdownOpen, setArticlesDropdownOpen] = useState(false)
  const location = useLocation()
  const articles = useArticles()

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const navLinks = [
    { path: '/', label: 'Articles', hasDropdown: true },
    { path: '/logs', label: 'Logs', hasDropdown: false },
  ]

  return (
    <nav className="sticky top-0 z-50 h-16 bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-xl font-bold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          Delphi Reader
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <div
              key={link.path}
              className="relative"
              onMouseEnter={() => link.hasDropdown && setArticlesDropdownOpen(true)}
              onMouseLeave={() => link.hasDropdown && setArticlesDropdownOpen(false)}
            >
              <Link
                to={link.path}
                className={`text-sm font-medium transition-colors flex items-center gap-1 py-2 ${
                  isActive(link.path)
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.label}
                {link.hasDropdown && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </Link>

              {/* Articles Dropdown */}
              {link.hasDropdown && articlesDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-80 z-50">
                  <div className="bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="p-2 max-h-96 overflow-y-auto">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        All Articles
                      </div>
                      {articles.map((article) => (
                        <Link
                          key={article.id}
                          to={`/article/${article.id}`}
                          onClick={() => setArticlesDropdownOpen(false)}
                          className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded transition-colors"
                        >
                          <div className="font-medium line-clamp-1">{article.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                            {article.snippet}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="ml-2">
            <DarkModeToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <DarkModeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-black max-h-[70vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <div key={link.path}>
                {link.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => setArticlesDropdownOpen(!articlesDropdownOpen)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                        isActive(link.path)
                          ? 'bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{link.label}</span>
                      <svg 
                        className={`w-5 h-5 transition-transform ${articlesDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {articlesDropdownOpen && (
                      <div className="mt-1 ml-3 space-y-1">
                        {articles.map((article) => (
                          <Link
                            key={article.id}
                            to={`/article/${article.id}`}
                            onClick={() => {
                              setMobileMenuOpen(false)
                              setArticlesDropdownOpen(false)
                            }}
                            className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded transition-colors"
                          >
                            <div className="font-medium line-clamp-1">{article.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                              {article.snippet}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
