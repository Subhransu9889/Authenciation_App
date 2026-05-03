import { useState } from 'react'

export default function QuoteCard({ quote }) {
  const [copied, setCopied] = useState(false)
  const author = quote.author?.replace(', type.text', '') || 'Unknown Author'

  const copyToClipboard = async () => {
    const text = `"${quote.content}" - ${author}`

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <article className="quote-card group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:border-primary-200">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-700">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7.2 6.4c-2.1 1.6-3.2 3.6-3.2 6.1 0 2.7 1.6 4.6 3.9 4.6 1.8 0 3.1-1.2 3.1-3 0-1.7-1.1-2.8-2.8-2.8-.4 0-.8.1-1.1.2.2-1.4 1.1-2.6 2.7-3.8L7.2 6.4Zm9 0c-2.1 1.6-3.2 3.6-3.2 6.1 0 2.7 1.6 4.6 3.9 4.6 1.8 0 3.1-1.2 3.1-3 0-1.7-1.1-2.8-2.8-2.8-.4 0-.8.1-1.1.2.2-1.4 1.1-2.6 2.7-3.8l-2.6-1.3Z" />
          </svg>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
          Insight
        </span>
      </div>

      <p className="mb-7 flex-1 font-serif text-xl leading-8 text-slate-900">
        {quote.content}
      </p>

      <div className="mb-5 border-t border-slate-100 pt-5">
        <p className="text-sm font-bold uppercase tracking-wide text-primary-700">
          {author}
        </p>
      </div>

      <button
        type="button"
        onClick={copyToClipboard}
        className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-primary-100 ${
          copied
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-slate-950 text-white hover:bg-primary-700'
        }`}
      >
        {copied ? (
          <>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Quote
          </>
        )}
      </button>
    </article>
  )
}
