import { useState, useEffect } from 'react'
import './App.css'

const createJoke = (data) => {
  const jokeData = data.data.data[0]
  return {
    id: jokeData.id,
    title: jokeData.content.substring(0, 50) + (jokeData.content.length > 50 ? '...' : ''),
    content: jokeData.content,
    author: 'Anonymous',
    category: jokeData.categories?.[0] || 'General'
  }
}

const requestJoke = async () => {
  const response = await fetch('https://api.freeapi.app/api/v1/public/randomjokes')
  if (!response.ok) throw new Error('Failed to fetch joke')

  const data = await response.json()
  if (!data.success || !data.data?.data?.length) {
    throw new Error('No joke found')
  }

  return createJoke(data)
}

function App() {
  const [joke, setJoke] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let shouldUpdate = true

    const loadInitialJoke = async () => {
      try {
        const nextJoke = await requestJoke()
        if (shouldUpdate) {
          setJoke(nextJoke)
          setError(null)
        }
      } catch (err) {
        if (shouldUpdate) {
          setError(err.message || 'Something went wrong')
        }
      } finally {
        if (shouldUpdate) {
          setLoading(false)
        }
      }
    }

    loadInitialJoke()

    return () => {
      shouldUpdate = false
    }
  }, [])

  const fetchJoke = async () => {
    setLoading(true)
    setError(null)
    try {
      setJoke(await requestJoke())
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = () => {
    if (!joke) return
    
    const isFavorited = favorites.some(fav => fav.id === joke.id)
    if (isFavorited) {
      setFavorites(favorites.filter(fav => fav.id !== joke.id))
    } else {
      setFavorites([...favorites, joke])
    }
  }

  const isFavorited = joke && favorites.some(fav => fav.id === joke.id)

  const copyToClipboard = () => {
    if (!joke) return
    const text = `${joke.title}\n${joke.content}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <main className="jokes-container">
      <header className="jokes-header">
        <span className="eyebrow">Random Joke Desk</span>
        <h1>Joke Viewer</h1>
        <p>Pull a fresh joke, save the keepers, and keep the good ones close.</p>
      </header>

      <div className="jokes-content">
        {!showFavorites ? (
          <>
            {loading && !joke && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Fetching a hilarious joke...</p>
              </div>
            )}

            {error && !joke && (
              <div className="error-state">
                <p>❌ {error}</p>
                <button onClick={fetchJoke} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            )}

            {joke && (
              <div className="joke-card">
                <div className="joke-header">
                  <span className="joke-category">{joke.category || 'General'}</span>
                  <span className="joke-meta">{favorites.length} saved</span>
                </div>
                <div className="quote-mark" aria-hidden="true">"</div>
                <p className="joke-content">{joke.content}</p>
                <div className="joke-footer-row">
                  <p className="joke-author">Told by {joke.author || 'Anonymous'}</p>
                  {isFavorited && <span className="favorite-badge">Saved</span>}
                </div>
              </div>
            )}

            <div className="jokes-actions">
              <button 
                onClick={fetchJoke} 
                disabled={loading}
                className="btn btn-primary"
              >
                <span aria-hidden="true">{loading ? '...' : '↻'}</span>
                {loading ? 'Loading' : 'Next Joke'}
              </button>
              <button 
                onClick={copyToClipboard}
                disabled={!joke || loading}
                className="btn btn-secondary"
              >
                <span aria-hidden="true">{copied ? '✓' : '□'}</span>
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button 
                onClick={toggleFavorite}
                disabled={!joke || loading}
                className={`btn btn-secondary ${isFavorited ? 'favorite-btn-active' : ''}`}
              >
                <span aria-hidden="true">{isFavorited ? '★' : '☆'}</span>
                {isFavorited ? 'Saved' : 'Save'}
              </button>
              {favorites.length > 0 && (
                <button 
                  onClick={() => setShowFavorites(true)}
                  className="btn btn-secondary"
                >
                  <span aria-hidden="true">▤</span>
                  Favorites ({favorites.length})
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="favorites-header">
              <h2>Your Favorite Jokes ({favorites.length})</h2>
              <button 
                onClick={() => setShowFavorites(false)}
                className="btn btn-secondary"
              >
                <span aria-hidden="true">←</span>
                Back to Jokes
              </button>
            </div>

            {favorites.length === 0 ? (
              <div className="empty-state">
                <p>No favorite jokes yet. Start favoriting!</p>
              </div>
            ) : (
              <div className="favorites-list">
                {favorites.map((fav) => (
                  <div key={fav.id} className="joke-card">
                    <div className="joke-header">
                      <span className="joke-category">{fav.category || 'General'}</span>
                      <button 
                        onClick={() => setFavorites(favorites.filter(f => f.id !== fav.id))}
                        className="btn-remove"
                        aria-label="Remove favorite"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="joke-content">{fav.content}</p>
                    <p className="joke-author">Told by {fav.author || 'Anonymous'}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <footer className="jokes-footer">
        <p>Powered by Random Jokes API</p>
      </footer>
    </main>
  )
}

export default App
