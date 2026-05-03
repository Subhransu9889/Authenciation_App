import '../styles/VideoCard.css'

function VideoCard({ video }) {
  const handleVideoClick = () => {
    if (video.videoUrl) {
      window.open(video.videoUrl, '_blank')
    }
  }

  const formatViews = (views) => {
    if (!views) return '0'
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M'
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K'
    return views.toString()
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  return (
    <article className="video-card">
      <button
        className="video-thumbnail"
        type="button"
        onClick={handleVideoClick}
        aria-label={`Watch ${video.title} on YouTube`}
      >
        <img
          src={video.thumbnail || 'https://via.placeholder.com/320x180?text=No+Image'}
          alt={video.title}
          className="thumbnail-image"
        />
        {video.duration && <div className="video-duration">{video.duration}</div>}
        <div className="play-overlay">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="play-icon"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </button>

      <div className="video-content">
        <h3 className="video-title" title={video.title}>
          {video.title}
        </h3>

        <p className="video-channel">
          <span className="channel-avatar" aria-hidden="true">
            {(video.channelName || 'U').charAt(0).toUpperCase()}
          </span>
          {video.channelName || 'Unknown Channel'}
        </p>

        <div className="video-meta">
          <span className="meta-item">{formatViews(video.views)} views</span>
          <span className="meta-separator">•</span>
          <span className="meta-item">{formatDate(video.publishedAt)}</span>
        </div>

        {video.description && (
          <p className="video-description">{video.description}</p>
        )}
      </div>
    </article>
  )
}

export default VideoCard
