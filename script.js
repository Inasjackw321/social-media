// Social Media App - Main JavaScript with Google Auth

class SocialMediaApp {
    constructor() {
        this.currentUser = null;
        this.posts = JSON.parse(localStorage.getItem('posts')) || [];
        this.videos = JSON.parse(localStorage.getItem('videos')) || [];
        this.currentFilter = 'all';
        this.currentVideoFilter = 'all';
        this.currentSection = 'posts';
        this.init();
    }

    init() {
        this.checkAuth();
        this.initGoogleSignIn();
    }

    // Google Sign-In Integration
    initGoogleSignIn() {
        window.handleCredentialResponse = (response) => {
            this.handleGoogleSignIn(response);
        };

        // Initialize Google Sign-In button
        if (window.google) {
            google.accounts.id.initialize({
                client_id: '415975643615-8rk7tehocfghjr2v3np4oacd06ka8q3k.apps.googleusercontent.com',
                callback: this.handleGoogleSignIn.bind(this)
            });

            google.accounts.id.renderButton(
                document.getElementById('googleSignInBtn'),
                {
                    theme: 'filled_blue',
                    size: 'large',
                    width: 280,
                    text: 'signin_with'
                }
            );
        }
    }

    handleGoogleSignIn(response) {
        try {
            // Decode JWT token to get user info
            const payload = this.parseJwt(response.credential);

            this.currentUser = {
                id: payload.sub,
                name: payload.name,
                email: payload.email,
                picture: payload.picture
            };

            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.showMainApp();
        } catch (error) {
            console.error('Error signing in:', error);
            alert('Failed to sign in. Please try again.');
        }
    }

    parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    checkAuth() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showMainApp();
        }
    }

    showMainApp() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        this.updateUserInfo();
        this.renderPosts();
        this.renderVideos();
        this.attachEventListeners();
    }

    updateUserInfo() {
        document.getElementById('currentUser').textContent = this.currentUser.name;
        document.getElementById('userAvatar').src = this.currentUser.picture;
        document.getElementById('postUserAvatar').src = this.currentUser.picture;
    }

    attachEventListeners() {
        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchSection(e.target.dataset.section);
            });
        });

        // Sign out
        document.getElementById('signOutBtn').addEventListener('click', () => this.signOut());

        // Post button
        document.getElementById('postBtn').addEventListener('click', () => this.createPost());

        // Enter key in post input
        document.getElementById('postInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.createPost();
            }
        });

        // Video button
        document.getElementById('videoBtn').addEventListener('click', () => this.createVideo());

        // Filter buttons for posts
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Filter buttons for videos
        document.querySelectorAll('[data-video-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setVideoFilter(e.target.dataset.videoFilter);
            });
        });

        // Video modal close
        document.getElementById('closeVideoModal').addEventListener('click', () => {
            this.closeVideoModal();
        });

        // Close video modal on outside click
        document.getElementById('videoModal').addEventListener('click', (e) => {
            if (e.target.id === 'videoModal') {
                this.closeVideoModal();
            }
        });
    }

    switchSection(section) {
        this.currentSection = section;

        // Update tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.section === section) {
                tab.classList.add('active');
            }
        });

        // Update sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });

        if (section === 'posts') {
            document.getElementById('postsSection').classList.add('active');
        } else if (section === 'videos') {
            document.getElementById('videosSection').classList.add('active');
        }
    }

    signOut() {
        if (confirm('Are you sure you want to sign out?')) {
            localStorage.removeItem('currentUser');
            this.currentUser = null;
            document.getElementById('mainApp').style.display = 'none';
            document.getElementById('loginScreen').style.display = 'flex';
            if (window.google) {
                google.accounts.id.disableAutoSelect();
            }
        }
    }

    // ENGAGEMENT ALGORITHM
    calculateEngagementScore(item) {
        const now = Date.now();
        const ageInHours = (now - new Date(item.timestamp).getTime()) / (1000 * 60 * 60);

        // Engagement metrics
        const likes = item.likes ? item.likes.length : 0;
        const comments = item.comments ? item.comments.length : 0;

        // Algorithm: newer posts get boosted, engagement adds to score
        // Time decay: posts lose 10% score per hour
        const timeDecay = Math.exp(-0.1 * ageInHours);
        const engagementBoost = (likes * 2) + (comments * 3); // Comments worth more

        return (engagementBoost + 10) * timeDecay; // Base score of 10
    }

    sortByEngagement(items) {
        return items.sort((a, b) => {
            return this.calculateEngagementScore(b) - this.calculateEngagementScore(a);
        });
    }

    // POSTS
    createPost() {
        const input = document.getElementById('postInput');
        const content = input.value.trim();

        if (!content) {
            return;
        }

        const post = {
            id: Date.now(),
            userId: this.currentUser.id,
            username: this.currentUser.name,
            userPicture: this.currentUser.picture,
            content: content,
            timestamp: new Date().toISOString(),
            likes: [],
            comments: []
        };

        this.posts.unshift(post);
        this.savePosts();
        input.value = '';
        this.renderPosts();
    }

    deletePost(postId) {
        if (confirm('Are you sure you want to delete this post?')) {
            this.posts = this.posts.filter(post => post.id !== postId);
            this.savePosts();
            this.renderPosts();
        }
    }

    toggleLike(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const likeIndex = post.likes.indexOf(this.currentUser.id);

        if (likeIndex > -1) {
            post.likes.splice(likeIndex, 1);
        } else {
            post.likes.push(this.currentUser.id);
        }

        this.savePosts();
        this.renderPosts();
    }

    addComment(postId, commentText) {
        const post = this.posts.find(p => p.id === postId);
        if (!post || !commentText.trim()) return;

        const comment = {
            id: Date.now(),
            userId: this.currentUser.id,
            username: this.currentUser.name,
            userPicture: this.currentUser.picture,
            text: commentText.trim(),
            timestamp: new Date().toISOString()
        };

        post.comments.push(comment);
        this.savePosts();
        this.renderPosts();
    }

    setFilter(filter) {
        this.currentFilter = filter;

        // Update active button
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        this.renderPosts();
    }

    getFilteredPosts() {
        let filtered;
        switch (this.currentFilter) {
            case 'my':
                filtered = this.posts.filter(post => post.userId === this.currentUser.id);
                break;
            case 'liked':
                filtered = this.posts.filter(post => post.likes.includes(this.currentUser.id));
                break;
            default:
                filtered = [...this.posts];
        }

        // Apply engagement algorithm for "all" filter (trending)
        if (this.currentFilter === 'all') {
            return this.sortByEngagement(filtered);
        }

        return filtered;
    }

    renderPosts() {
        const feed = document.getElementById('postsFeed');
        const emptyState = document.getElementById('emptyState');
        const filteredPosts = this.getFilteredPosts();

        if (filteredPosts.length === 0) {
            feed.innerHTML = '';
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');
        feed.innerHTML = filteredPosts.map(post => this.renderPost(post)).join('');

        // Attach event listeners to dynamically created elements
        filteredPosts.forEach(post => {
            const likeBtn = document.querySelector(`[data-post-id="${post.id}"][data-action="like"]`);
            if (likeBtn) {
                likeBtn.addEventListener('click', () => this.toggleLike(post.id));
            }

            const commentBtn = document.querySelector(`[data-post-id="${post.id}"][data-action="comment"]`);
            if (commentBtn) {
                commentBtn.addEventListener('click', () => this.toggleComments(post.id));
            }

            const deleteBtn = document.querySelector(`[data-post-id="${post.id}"][data-action="delete"]`);
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deletePost(post.id));
            }

            const commentInput = document.querySelector(`#commentInput-${post.id}`);
            if (commentInput) {
                commentInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.addComment(post.id, e.target.value);
                        e.target.value = '';
                    }
                });
            }
        });
    }

    toggleComments(postId) {
        const commentsSection = document.querySelector(`#comments-${postId}`);
        if (commentsSection) {
            commentsSection.style.display =
                commentsSection.style.display === 'none' ? 'block' : 'none';
        }
    }

    renderPost(post) {
        const isLiked = post.likes.includes(this.currentUser.id);
        const isOwnPost = post.userId === this.currentUser.id;
        const timeAgo = this.getTimeAgo(post.timestamp);

        return `
            <div class="post-card">
                <div class="post-header">
                    <img src="${post.userPicture}" alt="${this.escapeHtml(post.username)}" class="post-user-avatar-img">
                    <div class="post-user-info">
                        <div class="post-username">${this.escapeHtml(post.username)}</div>
                        <div class="post-time">${timeAgo}</div>
                    </div>
                    ${isOwnPost ? `
                        <button class="post-delete-btn" data-post-id="${post.id}" data-action="delete" title="Delete post">
                            🗑️
                        </button>
                    ` : ''}
                </div>
                <div class="post-content">${this.escapeHtml(post.content)}</div>
                <div class="post-actions">
                    <button class="post-action-btn ${isLiked ? 'liked' : ''}"
                            data-post-id="${post.id}"
                            data-action="like">
                        ${isLiked ? '❤️' : '🤍'}
                        <span>${post.likes.length > 0 ? post.likes.length : ''} ${post.likes.length === 1 ? 'Like' : 'Likes'}</span>
                    </button>
                    <button class="post-action-btn ${post.comments.length > 0 ? 'commented' : ''}"
                            data-post-id="${post.id}"
                            data-action="comment">
                        💬
                        <span>${post.comments.length > 0 ? post.comments.length : ''} ${post.comments.length === 1 ? 'Comment' : 'Comments'}</span>
                    </button>
                </div>
                <div class="comments-section" id="comments-${post.id}" style="display: none;">
                    ${post.comments.map(comment => this.renderComment(comment)).join('')}
                    <div class="comment-input-container">
                        <img src="${this.currentUser.picture}" alt="You" class="comment-avatar-small">
                        <input
                            type="text"
                            class="comment-input"
                            id="commentInput-${post.id}"
                            placeholder="Write a comment..."
                        >
                    </div>
                </div>
            </div>
        `;
    }

    renderComment(comment) {
        return `
            <div class="comment">
                <img src="${comment.userPicture}" alt="${this.escapeHtml(comment.username)}" class="comment-avatar-small">
                <div class="comment-content">
                    <div class="comment-username">${this.escapeHtml(comment.username)}</div>
                    <div class="comment-text">${this.escapeHtml(comment.text)}</div>
                </div>
            </div>
        `;
    }

    // VIDEOS
    createVideo() {
        const urlInput = document.getElementById('videoUrlInput');
        const descInput = document.getElementById('videoDescInput');
        const url = urlInput.value.trim();
        const description = descInput.value.trim();

        if (!url) {
            alert('Please enter a video URL');
            return;
        }

        const video = {
            id: Date.now(),
            userId: this.currentUser.id,
            username: this.currentUser.name,
            userPicture: this.currentUser.picture,
            url: url,
            description: description || 'No description',
            timestamp: new Date().toISOString(),
            likes: [],
            views: 0
        };

        this.videos.unshift(video);
        this.saveVideos();
        urlInput.value = '';
        descInput.value = '';
        this.renderVideos();
    }

    setVideoFilter(filter) {
        this.currentVideoFilter = filter;

        // Update active button
        document.querySelectorAll('[data-video-filter]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.videoFilter === filter) {
                btn.classList.add('active');
            }
        });

        this.renderVideos();
    }

    getFilteredVideos() {
        let filtered;
        switch (this.currentVideoFilter) {
            case 'my':
                filtered = this.videos.filter(video => video.userId === this.currentUser.id);
                break;
            case 'liked':
                filtered = this.videos.filter(video => video.likes.includes(this.currentUser.id));
                break;
            default:
                filtered = [...this.videos];
        }

        // Apply engagement algorithm for trending
        if (this.currentVideoFilter === 'all') {
            return this.sortByEngagement(filtered);
        }

        return filtered;
    }

    renderVideos() {
        const feed = document.getElementById('videosFeed');
        const emptyState = document.getElementById('videosEmptyState');
        const filteredVideos = this.getFilteredVideos();

        if (filteredVideos.length === 0) {
            feed.innerHTML = '';
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');
        feed.innerHTML = filteredVideos.map(video => this.renderVideoCard(video)).join('');

        // Attach click listeners
        filteredVideos.forEach(video => {
            const card = document.querySelector(`[data-video-id="${video.id}"]`);
            if (card) {
                card.addEventListener('click', () => this.openVideoModal(video));
            }
        });
    }

    renderVideoCard(video) {
        const thumbnail = this.getVideoThumbnail(video.url);
        const timeAgo = this.getTimeAgo(video.timestamp);

        return `
            <div class="video-card" data-video-id="${video.id}">
                <div class="video-thumbnail">
                    ${thumbnail ? `<img src="${thumbnail}" alt="Thumbnail">` : '🎬'}
                </div>
                <div class="video-info">
                    <div class="video-user">
                        <img src="${video.userPicture}" alt="${this.escapeHtml(video.username)}" class="video-user-avatar">
                        <span class="video-username">${this.escapeHtml(video.username)}</span>
                    </div>
                    <div class="video-description">${this.escapeHtml(video.description)}</div>
                    <div class="video-stats">
                        <span>❤️ ${video.likes.length}</span>
                        <span>👁️ ${video.views}</span>
                        <span>${timeAgo}</span>
                    </div>
                </div>
            </div>
        `;
    }

    getVideoThumbnail(url) {
        // YouTube
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        if (youtubeMatch) {
            return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
        }

        // Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) {
            return null; // Vimeo requires API call for thumbnail
        }

        return null;
    }

    getEmbedUrl(url) {
        // YouTube
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }

        // Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }

        // Direct video URL
        if (url.match(/\.(mp4|webm|ogg)$/i)) {
            return url;
        }

        return url;
    }

    openVideoModal(video) {
        // Increment views
        video.views++;
        this.saveVideos();

        const modal = document.getElementById('videoModal');
        const playerContainer = document.getElementById('videoPlayerContainer');
        const embedUrl = this.getEmbedUrl(video.url);

        // Clear previous content
        playerContainer.innerHTML = '';

        // Create player
        if (video.url.match(/\.(mp4|webm|ogg)$/i)) {
            playerContainer.innerHTML = `
                <video controls autoplay>
                    <source src="${embedUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
        } else {
            playerContainer.innerHTML = `
                <iframe
                    src="${embedUrl}"
                    frameborder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowfullscreen>
                </iframe>
            `;
        }

        // Update modal info
        document.getElementById('videoModalAvatar').src = video.userPicture;
        document.getElementById('videoModalUsername').textContent = video.username;
        document.getElementById('videoModalTime').textContent = this.getTimeAgo(video.timestamp);
        document.getElementById('videoModalDesc').textContent = video.description;

        const isLiked = video.likes.includes(this.currentUser.id);
        const likeIcon = document.getElementById('videoModalLikeIcon');
        const likeCount = document.getElementById('videoModalLikeCount');
        const likeBtn = document.getElementById('videoModalLikeBtn');

        likeIcon.textContent = isLiked ? '❤️' : '🤍';
        likeCount.textContent = video.likes.length;
        likeBtn.className = `video-action-btn ${isLiked ? 'liked' : ''}`;

        // Remove old listener and add new one
        const newLikeBtn = likeBtn.cloneNode(true);
        likeBtn.parentNode.replaceChild(newLikeBtn, likeBtn);

        newLikeBtn.addEventListener('click', () => {
            const likeIndex = video.likes.indexOf(this.currentUser.id);
            if (likeIndex > -1) {
                video.likes.splice(likeIndex, 1);
            } else {
                video.likes.push(this.currentUser.id);
            }
            this.saveVideos();

            const newIsLiked = video.likes.includes(this.currentUser.id);
            document.getElementById('videoModalLikeIcon').textContent = newIsLiked ? '❤️' : '🤍';
            document.getElementById('videoModalLikeCount').textContent = video.likes.length;
            newLikeBtn.className = `video-action-btn ${newIsLiked ? 'liked' : ''}`;

            this.renderVideos();
        });

        modal.classList.add('show');
    }

    closeVideoModal() {
        const modal = document.getElementById('videoModal');
        const playerContainer = document.getElementById('videoPlayerContainer');
        playerContainer.innerHTML = '';
        modal.classList.remove('show');
    }

    // UTILITIES
    getTimeAgo(timestamp) {
        const now = new Date();
        const postTime = new Date(timestamp);
        const seconds = Math.floor((now - postTime) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

        return postTime.toLocaleDateString();
    }

    savePosts() {
        localStorage.setItem('posts', JSON.stringify(this.posts));
    }

    saveVideos() {
        localStorage.setItem('videos', JSON.stringify(this.videos));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SocialMediaApp();
});
