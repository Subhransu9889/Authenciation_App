import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [catData, setCatData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCat = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('https://api.freeapi.app/api/v1/public/cats/cat/random')
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.data) {
        setCatData(data.data)
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch cat data')
      setCatData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCat()
  }, [])

  return (
    <div className="cat-viewer-container">
      <h1>Random Cat Viewer</h1>
      
      <div className="cat-display">
        {loading && <div className="loading">Loading...</div>}
        
        {error && <div className="error">❌ {error}</div>}
        
        {catData && !loading && (
          <div className="cat-content">
            <img 
              src={catData.image} 
              alt="Random cat" 
              className="cat-image"
            />
            {catData.breeds && catData.breeds.length > 0 && (
              <div className="cat-info">
                <p><strong>Breed:</strong> {catData.breeds[0].name}</p>
                {catData.breeds[0].temperament && (
                  <p><strong>Temperament:</strong> {catData.breeds[0].temperament}</p>
                )}
              </div>
            )}
          </div>
        )}
        
        {!catData && !loading && !error && (
          <div className="empty-state">
            <p>No cat loaded yet</p>
          </div>
        )}
      </div>

      <button 
        onClick={fetchCat} 
        disabled={loading}
        className="fetch-button"
      >
        {loading ? 'Loading...' : 'Get Random Cat 🐱'}
      </button>
    </div>
  )
}

export default App
