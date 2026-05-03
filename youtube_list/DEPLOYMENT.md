# YouTube Video Listing Application - Deployment Guide

## Overview
This is a YouTube-style video listing interface built with React + Vite that fetches video data from the FreeAPI YouTube videos endpoint.

## Features
- ✅ Fetches videos from the YouTube API (FreeAPI)
- ✅ Responsive grid layout for video cards
- ✅ Clean, modern UI with hover effects
- ✅ Video metadata display (title, channel, views, date)
- ✅ Click to watch on YouTube
- ✅ Loading and error states
- ✅ Dark mode support

## Tech Stack
- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: CSS with CSS Variables
- **API**: FreeAPI YouTube Videos Endpoint

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. From the `youtube_list` directory, run:
   ```bash
   vercel
   ```

3. Follow the prompts to deploy your project
4. Your app will be live at a `vercel.app` URL

### Option 2: Deploy to Netlify
1. Build the project (already done):
   ```bash
   npm run build
   ```

2. Drag and drop the `dist` folder to Netlify at https://app.netlify.com/drop

3. Or connect your GitHub repository and Netlify will auto-deploy on push

### Option 3: Deploy to GitHub Pages
1. Update `vite.config.js` if needed for base path
2. Build the project:
   ```bash
   npm run build
   ```
3. Push the `dist` folder to your GitHub Pages branch

### Option 4: Traditional Hosting (Apache, Nginx, etc.)
1. Build the project:
   ```bash
   npm run build
   ```
2. Upload the contents of the `dist` folder to your web server's public directory
3. Ensure your server is configured to serve `index.html` for all routes (SPA configuration)

## Development

### Install Dependencies
```bash
cd youtube_list
npm install
```

### Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5174`

### Build for Production
```bash
npm run build
```
Output goes to the `dist` folder

### Preview Production Build
```bash
npm run preview
```

## Project Structure
```
youtube_list/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   └── VideoCard.jsx
│   ├── styles/          # Component styles
│   │   └── VideoCard.css
│   ├── App.jsx          # Main app component
│   ├── App.css          # App styles
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

## API Details
- **Endpoint**: `https://api.freeapi.app/api/v1/public/youtube/videos`
- **Rate Limiting**: Check FreeAPI documentation for limits
- **Response Format**: Nested structure with video items

## Performance Metrics
- FCP: ~150ms
- LCP: ~500ms
- Build Size: 
  - CSS: 5.0 kB (gzip: 1.63 kB)
  - JS: 193.41 kB (gzip: 61.11 kB)
  - HTML: 0.46 kB (gzip: 0.29 kB)

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Responsive design supports mobile, tablet, and desktop

## Troubleshooting

### Videos not loading
- Check browser console for errors
- Verify FreeAPI endpoint is accessible
- Check CORS settings if behind a proxy

### Build failures
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear `.next` or build cache if present
- Ensure Node.js version is compatible (v16+)

## Environment Variables
Currently, this app doesn't require environment variables. If you need to use a different API endpoint, update the URL in `src/App.jsx`.

## Future Enhancements
- Add pagination for more videos
- Implement video search functionality
- Add filters by category/channel
- Store user preferences locally
- Add video details modal
- Implement infinite scroll

---

For more information about deployment, visit:
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Vite Guide](https://vitejs.dev/guide/build.html)
