import QuoteCard from './QuoteCard'

export default function QuoteGrid({ quotes }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {quotes.map((quote, index) => (
        <QuoteCard key={quote.id || index} quote={quote} />
      ))}
    </div>
  )
}
