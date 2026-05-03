export default function ProductCard({ product }) {
  const {
    title,
    description,
    price,
    discountPercentage,
    rating,
    reviews,
    thumbnail,
    brand,
    category,
  } = product;

  const discountedPrice = discountPercentage
    ? (price * (1 - discountPercentage / 100)).toFixed(2)
    : price.toFixed(2);

  return (
    <article className="product-card group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-accent dark:border-slate-800 dark:bg-slate-950">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-slate-400">
            No image
          </div>
        )}

        <div className="absolute left-3 top-3 flex gap-2">
          {category && (
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-800 shadow-sm backdrop-blur dark:bg-slate-950/90 dark:text-slate-100">
              {category}
            </span>
          )}
        </div>

        {discountPercentage > 0 && (
          <div className="absolute right-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-rose-900/20">
            {Math.round(discountPercentage)}% off
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            {brand && (
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">
                {brand}
              </p>
            )}
            <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-950 dark:text-white">
              {title}
            </h3>
          </div>
        </div>

        <p className="line-clamp-3 min-h-16 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {description}
        </p>

        {rating && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <div className="flex items-center" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(rating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'}>
                  ★
                </span>
              ))}
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {rating.toFixed(1)}
            </span>
            {reviews && (
              <span className="text-slate-500 dark:text-slate-500">
                ({reviews})
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Price
              </p>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-black text-slate-950 dark:text-white">
                  ${discountedPrice}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-sm font-medium text-slate-400 line-through">
                    ${price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-accent focus:outline-none focus:ring-4 focus:ring-accent-light dark:bg-white dark:text-slate-950 dark:hover:bg-teal-200">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l2.2 11.4A2 2 0 0 0 9.16 16H17a2 2 0 0 0 1.94-1.52L21 6H6m4 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
