# YourSocial - It's what's happening

A modern social media platform with Twitter-style UI, Google authentication, engagement algorithm, and video sharing. Built with vanilla HTML, CSS, and JavaScript - perfect for GitHub Pages!

## Features

### Design
- **Twitter-Inspired UI**: Clean, modern interface with dark theme
- **Responsive Layout**: Three-column layout on desktop, optimized for mobile
- **Smooth Animations**: Fade-in effects and smooth transitions
- **Left Sidebar**: Navigation with Home and Videos sections
- **Trends Sidebar**: What's happening (visible on larger screens)

### Authentication
- **Google Sign-In**: Secure OAuth 2.0 authentication
- **Profile Integration**: Automatic profile setup with name and avatar
- **Session Persistence**: Stay logged in across sessions

### Social Features
- **Create Posts**: Share thoughts with "What is happening?!" composer
- **Like Posts**: Heart/unlike posts with visual feedback
- **Comment System**: Threaded replies on posts
- **Delete Posts**: Remove your own content
- **Smart Feed**: Engagement-based algorithm ranks content

### Videos
- **Video Section**: Dedicated tab for short-form video content
- **Grid Layout**: 2-column grid on desktop, single column on mobile
- **Supported Platforms**: YouTube, Vimeo, and direct video URLs
- **Video Stats**: Track views and likes
- **Full-Screen Player**: Immersive video viewing experience

### Engagement Algorithm
Smart feed ranking based on:
- **Time Decay**: Posts lose 10% engagement per hour (exponential)
- **Weighted Metrics**: Comments (3x) valued more than likes (2x)
- **Trending First**: "For you" feed shows most engaging recent content
- **Base Score**: All content gets initial visibility

**Formula:**
```
Score = (10 + Likes×2 + Comments×3) × e^(-0.1 × hours)
```

## Live Demo

Visit: `https://[your-username].github.io/social-media/`

## Setup Instructions

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Navigate to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add **Authorized JavaScript origins**:
   - `http://localhost:8000` (local testing)
   - `https://[your-username].github.io` (GitHub Pages)
7. Copy your **Client ID**

### 2. Configure Application

**Update `index.html` (line 10):**
```html
<meta name="google-signin-client_id" content="YOUR_CLIENT_ID_HERE.apps.googleusercontent.com">
```

**Update `script.js` (line 28):**
```javascript
client_id: 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com',
```

### 3. Run Locally

```bash
# Clone repository
git clone https://github.com/[your-username]/social-media.git
cd social-media

# Start local server
python -m http.server 8000
# or
npx http-server -p 8000

# Open browser
open http://localhost:8000
```

### 4. Deploy to GitHub Pages

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy YourSocial"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Repository Settings → Pages
   - Source: Select `main` branch
   - Click Save

3. **Access Your Site:**
   ```
   https://[your-username].github.io/social-media/
   ```

## How to Use

### Getting Started
1. Sign in with Google account
2. Grant profile access permissions
3. Start posting and sharing videos!

### Creating Posts
1. Click in the "What is happening?!" composer
2. Type your message
3. Press "Post" or `Enter`

### Sharing Videos
1. Click "Videos" in left sidebar
2. Paste video URL (YouTube, Vimeo, or direct)
3. Add description
4. Click "Post"

**Supported formats:**
- YouTube: `youtube.com/watch?v=...` or `youtu.be/...`
- Vimeo: `vimeo.com/...`
- Direct: `.mp4`, `.webm`, `.ogg` files

### Interacting
- **Like**: Click heart icon on posts
- **Comment**: Click comment icon, type reply, press Enter
- **Watch Video**: Click video card for full-screen player
- **Switch Feeds**: Use "For you", "Your posts", "Liked" tabs
- **Delete**: Click × on your own posts

## UI Components

### Left Sidebar
- Logo
- Home navigation
- Videos navigation
- User profile with sign out

### Main Feed
- Sticky header with section title
- Tab bar for filtering
- Compose area for posts/videos
- Feed with infinite scroll potential
- Empty states

### Right Sidebar (Desktop)
- Trending widget
- "What's happening" section
- Expandable on larger screens

## Technology Stack

- **HTML5**: Semantic markup, SVG icons
- **CSS3**: Grid, Flexbox, CSS Variables, animations
- **JavaScript ES6+**: Classes, arrow functions, template literals
- **Google Sign-In API**: OAuth 2.0
- **LocalStorage**: Client-side persistence

## Color Scheme

```css
--twitter-blue: #1d9bf0
--bg-primary: #000000 (pure black)
--bg-secondary: #16181c (dark gray)
--text-primary: #e7e9ea (off-white)
--text-secondary: #71767b (gray)
--border-color: #2f3336
```

## Data Storage

All data stored in browser localStorage:
- **User Profile**: Google account info
- **Posts**: Content, likes, comments, timestamps
- **Videos**: URLs, descriptions, engagement stats
- **Privacy**: No external server communication

**Note**: Clearing browser data deletes all content

## Browser Support

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires:
- ES6+ JavaScript
- CSS Grid/Flexbox
- LocalStorage
- Google Sign-In API

## Responsive Breakpoints

- **Desktop (1024px+)**: Three-column layout
- **Tablet (768-1023px)**: Two-column, collapsed sidebar
- **Mobile (<768px)**: Single column, icon-only sidebar
- **Small (<500px)**: No sidebar, full-width feed

## Performance

- **Lazy Loading**: Videos load on demand
- **CSS Animations**: GPU-accelerated transitions
- **Event Delegation**: Efficient DOM event handling
- **Local Storage**: Fast client-side data access

## Security

- **OAuth 2.0**: Secure Google authentication
- **XSS Protection**: HTML escaping on all inputs
- **No Backend**: Zero server-side vulnerabilities
- **HTTPS Required**: Google Sign-In enforces HTTPS in production

## Future Enhancements

- Image upload and display
- GIF support
- Emoji picker
- Video upload (not just URLs)
- Real-time updates (WebSockets)
- Backend integration (Firebase/Supabase)
- Push notifications
- Hashtags and mentions
- Search functionality
- User profiles and following
- Direct messaging
- Tweet threads
- Polls

## Troubleshooting

### Google Sign-In Issues
- Verify Client ID is correct
- Check authorized origins in Google Console
- Ensure correct domain (localhost or GitHub Pages URL)
- Clear browser cache

### Videos Not Playing
- Check URL format
- Some content may have embedding disabled
- Try different video source
- Open browser console for errors

### Data Loss
- Data tied to browser/device
- Clearing cookies/storage deletes data
- Export/import feature coming soon

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## License

MIT License - Open source and free to use

## Credits

Built with vanilla JavaScript - no frameworks, just clean code!

Inspired by Twitter/X's clean, modern interface.

---

**YourSocial** - It's what's happening · Made with ❤️ for the web
