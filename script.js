// Social Media App - Main JavaScript

class SocialMediaApp {
    constructor() {
        this.currentUser = localStorage.getItem('currentUser') || 'Guest User';
        this.posts = JSON.parse(localStorage.getItem('posts')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.updateCurrentUser();
        this.renderPosts();
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Post button
        document.getElementById('postBtn').addEventListener('click', () => this.createPost());

        // Enter key in post input
        document.getElementById('postInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.createPost();
            }
        });

        // Change user button
        document.getElementById('changeUserBtn').addEventListener('click', () => this.showUserModal());

        // Modal buttons
        document.getElementById('saveUserBtn').addEventListener('click', () => this.saveUsername());
        document.getElementById('cancelBtn').addEventListener('click', () => this.hideUserModal());

        // Close modal on outside click
        document.getElementById('userModal').addEventListener('click', (e) => {
            if (e.target.id === 'userModal') {
                this.hideUserModal();
            }
        });

        // Enter key in username input
        document.getElementById('usernameInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveUsername();
            }
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
    }

    createPost() {
        const input = document.getElementById('postInput');
        const content = input.value.trim();

        if (!content) {
            return;
        }

        const post = {
            id: Date.now(),
            username: this.currentUser,
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

        const likeIndex = post.likes.indexOf(this.currentUser);

        if (likeIndex > -1) {
            post.likes.splice(likeIndex, 1);
        } else {
            post.likes.push(this.currentUser);
        }

        this.savePosts();
        this.renderPosts();
    }

    addComment(postId, commentText) {
        const post = this.posts.find(p => p.id === postId);
        if (!post || !commentText.trim()) return;

        const comment = {
            id: Date.now(),
            username: this.currentUser,
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
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        this.renderPosts();
    }

    getFilteredPosts() {
        switch (this.currentFilter) {
            case 'my':
                return this.posts.filter(post => post.username === this.currentUser);
            case 'liked':
                return this.posts.filter(post => post.likes.includes(this.currentUser));
            default:
                return this.posts;
        }
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
            // Like button
            const likeBtn = document.querySelector(`[data-post-id="${post.id}"][data-action="like"]`);
            if (likeBtn) {
                likeBtn.addEventListener('click', () => this.toggleLike(post.id));
            }

            // Comment button (toggle comments)
            const commentBtn = document.querySelector(`[data-post-id="${post.id}"][data-action="comment"]`);
            if (commentBtn) {
                commentBtn.addEventListener('click', () => this.toggleComments(post.id));
            }

            // Delete button
            const deleteBtn = document.querySelector(`[data-post-id="${post.id}"][data-action="delete"]`);
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deletePost(post.id));
            }

            // Comment input
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
        const isLiked = post.likes.includes(this.currentUser);
        const isOwnPost = post.username === this.currentUser;
        const timeAgo = this.getTimeAgo(post.timestamp);

        return `
            <div class="post-card">
                <div class="post-header">
                    <div class="post-user-avatar">👤</div>
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
                        <div class="comment-avatar-small">👤</div>
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
                <div class="comment-avatar">👤</div>
                <div class="comment-content">
                    <div class="comment-username">${this.escapeHtml(comment.username)}</div>
                    <div class="comment-text">${this.escapeHtml(comment.text)}</div>
                </div>
            </div>
        `;
    }

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

    showUserModal() {
        const modal = document.getElementById('userModal');
        const input = document.getElementById('usernameInput');
        input.value = this.currentUser;
        modal.classList.add('show');
        input.focus();
    }

    hideUserModal() {
        document.getElementById('userModal').classList.remove('show');
    }

    saveUsername() {
        const input = document.getElementById('usernameInput');
        const username = input.value.trim();

        if (username && username.length > 0) {
            this.currentUser = username;
            localStorage.setItem('currentUser', username);
            this.updateCurrentUser();
            this.hideUserModal();
        }
    }

    updateCurrentUser() {
        document.getElementById('currentUser').textContent = this.currentUser;
    }

    savePosts() {
        localStorage.setItem('posts', JSON.stringify(this.posts));
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
