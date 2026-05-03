import { useState, useEffect } from 'react'
import './App.css'
import VideoCard from './components/VideoCard'

function App() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://api.freeapi.app/api/v1/public/youtube/videos')
        if (!response.ok) {
          throw new Error('Failed to fetch videos')
        }
        const result = await response.json()
        
        // Parse the nested structure from the API
        const videoList = result.data?.data || []
        const formattedVideos = videoList.map((item) => {
          const snippet = item.items?.snippet || {}
          const statistics = item.items?.statistics || {}
          
          return {
            _id: item.items?.id || Math.random().toString(),
            title: snippet.title || 'Untitled',
            channelName: snippet.channelTitle || 'Unknown Channel',
            thumbnail: snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url,
            views: parseInt(statistics.viewCount) || 0,
            publishedAt: snippet.publishedAt,
            description: snippet.description || '',
            videoUrl: `https://www.youtube.com/watch?v=${item.items?.id}`,
            duration: '',
          }
        })
        
        setVideos(formattedVideos)
        setError(null)
      } catch (err) {
        setError(err.message || 'An error occurred while fetching videos')
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <span className="eyebrow">FreeAPI collection</span>
          <h1>Video Library</h1>
          <p>Fresh videos, clean cards, and quick access to watch on YouTube.</p>
        </div>

        <div className="header-stats" aria-label="Library stats">
          <span>{loading ? '...' : videos.length}</span>
          <small>videos loaded</small>
        </div>
      </header>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading videos...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <strong>Unable to load videos</strong>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && videos.length > 0 && (
        <div className="videos-grid">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="empty-state">
          <p>No videos found</p>
        </div>
      )}
    </div>
  )
}

export default App
