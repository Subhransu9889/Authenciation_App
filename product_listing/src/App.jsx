import { useEffect, useMemo, useState } from 'react';
import './App.css';
import ProductCard from './components/ProductCard';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const API_ENDPOINT = 'https://api.freeapi.app/api/v1/public/randomproducts';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_ENDPOINT);
        const data = await response.json();

        if (data.success && data.data?.data) {
          setProducts(data.data.data);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError('Error fetching products: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const visibleProducts = products.filter(
      (product) =>
        product.title.toLowerCase().includes(normalizedSearch) ||
        product.description?.toLowerCase().includes(normalizedSearch) ||
        product.brand?.toLowerCase().includes(normalizedSearch) ||
        product.category?.toLowerCase().includes(normalizedSearch)
    );

    return [...visibleProducts].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.discountPercentage || 0) - (a.discountPercentage || 0);
    });
  }, [products, searchTerm, sortBy]);

  const averageRating = products.length
    ? products.reduce((total, product) => total + (product.rating || 0), 0) / products.length
    : 0;

  const maxDiscount = products.reduce(
    (highest, product) => Math.max(highest, product.discountPercentage || 0),
    0
  );

  return (
    <div className="product-shell w-full px-4 py-5 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="hero-panel overflow-hidden rounded-2xl px-5 py-7 text-white shadow-2xl shadow-slate-900/15 sm:px-8 lg:px-10">
          <nav className="mb-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-white text-slate-950 shadow-lg shadow-black/10">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7h-3V6a5 5 0 0 0-10 0v1H4l1 13h14l1-13ZM9 7V6a3 3 0 0 1 6 0v1" />
                </svg>
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-teal-100">
                Chai Store
              </span>
            </div>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-teal-50 backdrop-blur">
              Fresh finds daily
            </span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_21rem] lg:items-end">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-teal-200">
                Product Listing
              </p>
              <h1 className="m-0 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                Discover deals that feel handpicked.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                Browse a polished catalog of everyday essentials, trending tech, beauty picks, and home upgrades.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">
              <div>
                <p className="text-2xl font-bold text-white">{products.length}</p>
                <p className="text-xs text-slate-300">Items</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{averageRating.toFixed(1)}</p>
                <p className="text-xs text-slate-300">Avg rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{Math.round(maxDiscount)}%</p>
                <p className="text-xs text-slate-300">Top offer</p>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-lg shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-black/20">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
            <label className="relative block">
              <span className="sr-only">Search products</span>
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
                placeholder="Search by product, brand, or category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-base text-slate-900 outline-none transition focus:border-accent focus:ring-4 focus:ring-accent-light dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </label>

            <label className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <span>Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-semibold text-slate-900 outline-none dark:text-white"
              >
                <option value="featured">Best deals</option>
                <option value="rating">Top rated</option>
                <option value="price-low">Price low</option>
                <option value="price-high">Price high</option>
              </select>
            </label>

            <div className="flex h-12 items-center justify-between gap-3 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <span>{filteredProducts.length} shown</span>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-accent transition hover:text-teal-900 dark:hover:text-teal-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        <main>
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-5 h-48 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
                  <div className="mb-3 h-5 rounded bg-slate-200 dark:bg-slate-800"></div>
                  <div className="mb-2 h-4 rounded bg-slate-200 dark:bg-slate-800"></div>
                  <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800"></div>
                </div>
              ))}
            </div>
          )}

          {error && !loading && (
            <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-lg shadow-rose-100/70 dark:border-rose-900/70 dark:bg-rose-950/30 dark:shadow-black/20">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-200">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-bold text-rose-950 dark:text-rose-100">Products could not load</h2>
              <p className="mb-5 text-sm text-rose-700 dark:text-rose-200">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && products.length > 0 && (
            <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20">
              <h2 className="mb-2 text-xl font-bold text-slate-950 dark:text-white">No matches found</h2>
              <p className="mb-5 text-slate-600 dark:text-slate-400">
                Nothing matched "{searchTerm}". Try a shorter search or clear the filter.
              </p>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Clear Search
              </button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-950">
              <p className="text-slate-600 dark:text-slate-400">
                No products available
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
