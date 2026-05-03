import { useState, useEffect } from 'react'
import './App.css'
import QuoteGrid from './components/QuoteGrid'

function App() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  async function fetchQuotes() {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('https://api.freeapi.app/api/v1/public/quotes')
      if (!response.ok) throw new Error('Failed to fetch quotes')
      const result = await response.json()
      // API returns { statusCode, data: { data: [...quotes] }, message, success }
      const quotesArray = result?.data?.data || []
      setQuotes(Array.isArray(quotesArray) ? quotesArray : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(fetchQuotes, 0)

    return () => window.clearTimeout(timer)
  }, [])

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredQuotes = quotes.filter((quote) =>
    (quote.content || '').toLowerCase().includes(normalizedSearch) ||
    (quote.author || '').toLowerCase().includes(normalizedSearch)
  )

  const featuredQuote = filteredQuotes[0]

  return (
    <div className="quote-shell min-h-screen text-slate-950">
      <header className="quote-hero relative overflow-hidden text-white">
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_24rem] lg:items-end lg:px-8 lg:py-10">
          <div>
            <nav className="mb-16 flex items-center justify-between gap-4 sm:mb-20">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-primary-800 shadow-xl shadow-black/20">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M7 16h10M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7l-4 3V6a2 2 0 0 1 2-2Z" />
                  </svg>
                </div>
                <span className="text-sm font-bold uppercase tracking-wider text-indigo-100">
                  Quote Library
                </span>
              </div>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-indigo-50 backdrop-blur">
                {quotes.length || '--'} collected
              </span>
            </nav>

            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-amber-200">
              Daily perspective
            </p>
            <h1 className="m-0 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Find the line that stays with you.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
              Search thoughtful quotes by author or idea, then copy the ones worth keeping close.
            </p>
          </div>

          <aside className="quote-feature rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl shadow-black/15 backdrop-blur-md">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-indigo-200">
              Featured
            </p>
            <p className="font-serif text-2xl leading-snug text-white">
              {`"${featuredQuote?.content || 'Great thoughts arrive quietly. Make room for them.'}"`}
            </p>
            <p className="mt-5 text-sm font-bold uppercase tracking-wide text-amber-200">
              {featuredQuote?.author?.replace(', type.text', '') || 'Unknown Author'}
            </p>
          </aside>
        </div>
      </header>

      <main className="relative mx-auto -mt-10 max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <section className="search-panel rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-300/30 backdrop-blur">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="relative block">
              <span className="sr-only">Search quotes</span>
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
              </svg>
              <input
                type="text"
                placeholder="Search by quote text or author"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-base text-slate-950 outline-none transition focus:border-primary-700 focus:ring-4 focus:ring-primary-100"
              />
            </label>

            <div className="flex h-12 items-center justify-between gap-4 rounded-xl bg-slate-100 px-4 text-sm font-bold text-slate-700">
              <span>{filteredQuotes.length} shown</span>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-primary-700 transition hover:text-accent-dark"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {error && (
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-lg shadow-rose-100/70">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-rose-100 text-rose-700">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-bold text-rose-950">Quotes could not load</h2>
            <p className="mb-5 text-sm text-rose-700">{error}</p>
            <button
              onClick={fetchQuotes}
              className="rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Try Again
            </button>
          </div>
        )}

        {loading && (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-200/60">
                <div className="mb-6 h-8 w-10 rounded bg-slate-200"></div>
                <div className="mb-3 h-5 rounded bg-slate-200"></div>
                <div className="mb-3 h-5 rounded bg-slate-200"></div>
                <div className="h-5 w-2/3 rounded bg-slate-200"></div>
                <div className="mt-10 h-11 rounded-xl bg-slate-200"></div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredQuotes.length > 0 && (
          <section className="mt-10">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-500">
                Showing {filteredQuotes.length} of {quotes.length} quotes
              </p>
              <p className="text-sm text-slate-500">
                Tap a card action to copy the full quote.
              </p>
            </div>
            <QuoteGrid quotes={filteredQuotes} />
          </section>
        )}

        {!loading && filteredQuotes.length === 0 && quotes.length > 0 && (
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-lg shadow-slate-200/60">
            <svg className="mx-auto mb-4 h-14 w-14 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h5m-5 4h8M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7l-4 3V6a2 2 0 0 1 2-2Z" />
            </svg>
            <h2 className="mb-2 text-xl font-bold text-slate-950">No matches found</h2>
            <p className="mb-5 text-slate-600">
              {`Nothing matched "${searchTerm}". Try an author name or a shorter phrase.`}
            </p>
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="rounded-xl bg-primary-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
            >
              Clear Search
            </button>
          </div>
        )}

        {!loading && quotes.length === 0 && !error && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-slate-600">No quotes available</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
