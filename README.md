# SimpleSocial - Social Media Platform with Google Auth

A feature-rich social media application with Google authentication, engagement-based algorithm, and short video support. Built with vanilla HTML, CSS, and JavaScript - perfect for GitHub Pages!

## Features

### Authentication
- **Google Sign-In**: Secure login with your Google account
- **User Profiles**: Automatic profile setup with name and avatar from Google
- **Session Persistence**: Stay logged in across browser sessions

### Posts
- **Create Posts**: Share your thoughts with the community
- **Like Posts**: Show appreciation with a simple click
- **Comment on Posts**: Engage in conversations
- **Delete Posts**: Remove your own posts
- **Smart Feed**: Posts sorted by an engagement-based algorithm

### Videos
- **Short Video Section**: Share YouTube, Vimeo, or direct video URLs
- **Video Grid**: Beautiful grid layout for browsing videos
- **Full-Screen Player**: Watch videos in an immersive modal
- **Video Stats**: Track likes and views
- **Auto Thumbnails**: Automatic thumbnail generation for YouTube videos

### Engagement Algorithm
The app features a custom engagement algorithm that:
- Ranks content based on likes, comments, and recency
- Uses exponential time decay (10% per hour)
- Weighs comments more heavily than likes (3x vs 2x)
- Shows trending content first in the "Trending" filter

### Design
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean interface with smooth animations
- **Tab Navigation**: Easy switching between Posts and Videos
- **Filter Options**: Trending, My Posts/Videos, and Liked content

## Live Demo

Visit the live application at: `https://[your-username].github.io/social-media/`

## Setup Instructions

### 1. Get Google OAuth Credentials

To enable Google Sign-In, you need to create OAuth credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen
6. For **Authorized JavaScript origins**, add:
   - `http://localhost:8000` (for local testing)
   - `https://[your-username].github.io` (for GitHub Pages)
7. Copy your **Client ID**

### 2. Configure the Application

1. Open `index.html` and replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID:
   ```html
   <meta name="google-signin-client_id" content="YOUR_CLIENT_ID_HERE.apps.googleusercontent.com">
   ```

2. Open `script.js` and replace the Client ID in the `initGoogleSignIn()` method:
   ```javascript
   client_id: 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com',
   ```

### 3. Running Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/[your-username]/social-media.git
   cd social-media
   ```

2. Start a local server:
   ```bash
   python -m http.server 8000
   # or
   npx http-server -p 8000
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### 4. Deploy to GitHub Pages

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Deploy SimpleSocial"
   git push origin main
   ```

2. Enable GitHub Pages:
   - Go to repository **Settings** → **Pages**
   - Select the branch (usually `main`)
   - Click **Save**

3. Your site will be live at:
   ```
   https://[your-username].github.io/social-media/
   ```

## How to Use

### Getting Started
1. **Sign In**: Click the "Sign in with Google" button
2. **Authorize**: Allow SimpleSocial to access your basic profile info
3. **Start Sharing**: You're ready to post and share videos!

### Creating Posts
1. Click on the **Posts** tab
2. Type your message in the text area
3. Click **Post** or press `Enter`

### Sharing Videos
1. Click on the **Videos** tab
2. Paste a YouTube, Vimeo, or direct video URL
3. Add a description (optional)
4. Click **Post Video**

Supported video formats:
- YouTube: `https://youtube.com/watch?v=...` or `https://youtu.be/...`
- Vimeo: `https://vimeo.com/...`
- Direct links: `.mp4`, `.webm`, `.ogg` files

### Interacting with Content
- **Like**: Click the heart icon
- **Comment**: Click the comment icon, type, and press `Enter`
- **Watch Video**: Click any video card to open the full-screen player
- **Filter**: Use Trending, My Posts/Videos, or Liked filters
- **Delete**: Click the trash icon on your own posts

## Technology Stack

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript**: ES6+ with class-based architecture
- **Google Sign-In API**: OAuth 2.0 authentication
- **LocalStorage API**: Client-side data persistence

## Engagement Algorithm

The feed uses a smart algorithm to surface engaging content:

```
Engagement Score = (Base Score + Engagement Boost) × Time Decay

Where:
- Base Score = 10
- Engagement Boost = (Likes × 2) + (Comments × 3)
- Time Decay = e^(-0.1 × hours_since_post)
```

This ensures:
- New posts get initial visibility
- Engaging content rises to the top
- Comments are valued more than likes
- Old content gradually fades

## Data Storage

All data is stored in your browser's localStorage:
- **User Profile**: Name, email, avatar (from Google)
- **Posts**: Content, likes, comments, timestamps
- **Videos**: URLs, descriptions, likes, views
- **Privacy**: No data is sent to external servers

Note: Data is local to your browser and device. Clearing browser data will delete all posts and videos.

## Browser Compatibility

Works on all modern browsers with:
- ES6+ JavaScript support
- CSS Grid and Flexbox
- LocalStorage API
- Google Sign-In API

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security & Privacy

- **OAuth 2.0**: Secure authentication via Google
- **No Backend**: All data stays in your browser
- **XSS Protection**: HTML escaping on all user inputs
- **HTTPS Only**: Google Sign-In requires HTTPS in production

## Future Enhancements

Potential features for future versions:
- Image/GIF upload support
- Video upload (not just URLs)
- Real-time updates with WebSockets
- Backend integration (Firebase, Supabase)
- Push notifications
- Dark mode
- Hashtag and mention support
- Search functionality
- User profiles and followers
- Direct messaging

## Troubleshooting

### Google Sign-In not working
- Verify your Client ID is correct
- Check Authorized JavaScript origins in Google Cloud Console
- Ensure you're accessing via the correct domain (localhost or GitHub Pages URL)
- Clear browser cache and try again

### Videos not playing
- Verify the URL format is correct
- Some videos may have embedding disabled by the uploader
- Try a different video source

### Data disappeared
- Check if browser data/cookies were cleared
- Data is specific to each browser and device
- Consider exporting data regularly (future feature)

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Author

Built with vanilla JavaScript - no frameworks, just clean code!

---

Made with ❤️ for the web
