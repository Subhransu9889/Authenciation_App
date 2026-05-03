# YouTube Video Listing Interface

A modern, responsive YouTube-style video listing application built with React and Vite. Fetches and displays video data from the FreeAPI YouTube videos endpoint.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
cd youtube_list
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:5174](http://localhost:5174) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

## ✨ Features

- **Video Grid Layout**: Responsive grid that adapts to different screen sizes
- **Video Cards**: Display video thumbnails with metadata
  - Video title (2-line truncation)
  - Channel name
  - View count (formatted as K/M)
  - Upload date (relative time)
  - Video description preview
- **Interactive UI**: 
  - Hover effects on video cards
  - Play button overlay on thumbnail hover
  - Click to watch on YouTube (opens in new tab)
- **State Management**:
  - Loading spinner while fetching
  - Error handling with user-friendly messages
  - Empty state display
- **Responsive Design**:
  - Desktop: 3-4 columns
  - Tablet: 2-3 columns
  - Mobile: 1-2 columns
- **Dark Mode**: Built-in support for system dark mode preference

## 🏗️ Project Structure

```
youtube_list/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   └── VideoCard.jsx   # Individual video card component
│   ├── styles/
│   │   └── VideoCard.css   # VideoCard component styles
│   ├── App.jsx             # Main application component
│   ├── App.css             # App layout and grid styles
│   ├── index.css           # Global styles and variables
│   └── main.jsx            # React entry point
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
└── eslint.config.js        # ESLint rules
```

## 🎨 Design Highlights

### Color Scheme
- Light Mode:
  - Text: `#6b6375`
  - Text (headings): `#08060d`
  - Background: `#fff`
  - Accent: `#aa3bff`
  - Border: `#e5e4e7`

- Dark Mode:
  - Text: `#9ca3af`
  - Text (headings): `#f3f4f6`
  - Background: `#16171d`
  - Accent: `#c084fc`
  - Border: `#2e303a`

### Typography
- Font: System UI, Segoe UI, Roboto
- Heading Font: System UI, Segoe UI, Roboto
- Monospace: UI Monospace, Consolas

### Spacing & Effects
- Card gap: 20px (desktop), 16px (tablet), 12px (mobile)
- Smooth transitions and hover effects
- Drop shadow on card interaction
- Smooth scale animations on thumbnails

## 📡 API Integration

### Endpoint
```
https://api.freeapi.app/api/v1/public/youtube/videos
```

### Response Structure
```javascript
{
  statusCode: 200,
  data: {
    page: 1,
    limit: 10,
    totalPages: 16,
    data: [
      {
        items: {
          id: "video_id",
          snippet: {
            title: "Video Title",
            channelTitle: "Channel Name",
            description: "Video description",
            publishedAt: "2023-07-19T13:16:33Z",
            thumbnails: {
              medium: { url: "..." },
              default: { url: "..." }
            }
          },
          statistics: {
            viewCount: "1000000"
          }
        }
      }
    ]
  }
}
```

## 🔧 Components

### App.jsx
Main application component that:
- Fetches videos from the API
- Manages loading, error, and success states
- Renders the video grid and UI states

### VideoCard.jsx
Reusable component that displays:
- Video thumbnail with play button overlay
- Video title, channel name, and metadata
- Click handler to open video on YouTube

## 📊 Performance

- **Build Size**:
  - CSS: 5.0 kB (gzip: 1.63 kB)
  - JS: 193.41 kB (gzip: 61.11 kB)
  - HTML: 0.46 kB (gzip: 0.29 kB)

- **Web Vitals**:
  - FCP: ~150-370ms
  - LCP: ~300-700ms
  - FID: <5ms
  - TBT: 0ms

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
1. Build: `npm run build`
2. Drag & drop `dist` folder to netlify.com

### GitHub Pages
1. Build: `npm run build`
2. Push `dist` to gh-pages branch

### Traditional Hosting
1. Build: `npm run build`
2. Upload `dist` folder to web server
3. Configure server for SPA (serve index.html for all routes)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🎯 Usage Examples

### Fetching Videos
The `App.jsx` component automatically fetches videos on mount:
```javascript
useEffect(() => {
  const fetchVideos = async () => {
    const response = await fetch('https://api.freeapi.app/api/v1/public/youtube/videos')
    const result = await response.json()
    // Process and set videos
  }
  fetchVideos()
}, [])
```

### Video Card Props
```javascript
<VideoCard 
  video={{
    _id: "unique-id",
    title: "Video Title",
    channelName: "Channel Name",
    thumbnail: "image-url",
    views: 1000000,
    publishedAt: "2023-07-19T13:16:33Z",
    description: "Description",
    videoUrl: "https://youtube.com/watch?v=...",
    duration: "10:30"
  }}
/>
```

## 🛠️ Development Tools

### Linting
```bash
npm run lint
```

### Browser Support
- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## 🐛 Troubleshooting

### Videos Not Loading
1. Check browser console for network errors
2. Verify API endpoint is accessible
3. Check if CORS is properly configured

### Build Issues
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use
```bash
npm run dev -- --port 3000
```

## 📝 License
MIT

## 🔗 Links
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [FreeAPI](https://freeapi.app)

---

Built with ❤️ using React + Vite
