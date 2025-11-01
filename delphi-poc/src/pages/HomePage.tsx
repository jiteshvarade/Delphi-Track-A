import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'

export default function HomePage() {
  const articles = useArticles()

  // Scroll to top when homepage loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 py-24 md:py-32">
          <div className="text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-zinc-900 rounded-full text-gray-700 dark:text-zinc-300 text-sm font-medium border border-gray-200 dark:border-zinc-800">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>AI-Powered Reading</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
              Read Smarter with
              <br />
              <span className="text-gray-500 dark:text-gray-400">AI Assistance</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Enhance your reading with instant explanations, smart rephrasing, 
              and citation generation—powered by Google Gemini.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
              <a
                href="#articles"
                className="group px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <span>Start Reading</span>
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="#how-it-works"
                className="px-6 py-3 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg font-medium border border-gray-300 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-white transition-colors"
              >
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto pt-16 border-t border-gray-200 dark:border-zinc-800 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Free</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">3</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Actions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">∞</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Offline</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-3">
              Features
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Everything you need for enhanced reading
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 transition-colors">
              <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Instant Explanations</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Select text and get clear explanations for complex concepts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 transition-colors">
              <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Smart Rephrasing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Rewrite complex sentences into clear, concise language.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 transition-colors">
              <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Auto Citations</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Generate citations in APA, MLA, and Chicago formats instantly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 transition-colors">
              <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Reading Trail</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Navigate articles with an interactive table of contents.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 transition-colors">
              <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Dark Mode</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Easy on the eyes with a clean dark theme for night reading.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 transition-colors">
              <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Responsive Design</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Works perfectly on all devices, from phone to desktop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-3">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Three simple steps to enhanced reading
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col">
              <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select Text</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Highlight any text in an article that you want to understand better.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col">
              <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Choose Action</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Click Explain, Rephrase, or Cite. The AI assistant appears instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col">
              <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Get Results</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Receive AI-powered insights in seconds with streaming responses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="py-24 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-3">
              Featured Articles
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Start reading and try the AI assistant
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                className="group block p-6 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-zinc-900 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-700 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 dark:text-gray-600 group-hover:text-gray-700 dark:group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                  {article.snippet}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Start reading with AI-powered assistance. It's free.
          </p>
          <a
            href="#articles"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <span>Get Started</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  )
}
