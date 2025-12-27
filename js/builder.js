// Main Builder Application
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
    }, 500);
    
    // Initialize application
    initApp();
    
    // Initialize Linktree Builder
    Linktree.init({
        container: '#preview-wrapper',
        template: 'pixel',
        musicEnabled: false,
        onUpdate: updatePreview
    });
});

// Application State
const appState = {
    profile: {
        name: '',
        bio: '',
        avatar: '',
        avatarType: 'url' // 'url' or 'upload'
    },
    template: 'pixel',
    music: {
        enabled: false,
        track: '',
        volume: 50
    },
    socials: [],
    links: [],
    settings: {
        previewMode: 'desktop'
    }
};

// Initialize Application
function initApp() {
    // Load saved data from localStorage
    loadFromLocalStorage();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initial preview update
    updatePreview();
}

// Event Listeners Setup
function setupEventListeners() {
    // Profile inputs
    document.getElementById('name').addEventListener('input', function() {
        appState.profile.name = this.value;
        saveToLocalStorage();
        updatePreview();
    });
    
    document.getElementById('bio').addEventListener('input', function() {
        appState.profile.bio = this.value;
        saveToLocalStorage();
        updatePreview();
    });
    
    document.getElementById('avatar').addEventListener('input', function() {
        if (appState.profile.avatarType === 'url') {
            appState.profile.avatar = this.value;
            saveToLocalStorage();
            updatePreview();
        }
    });
    
    // Avatar option tabs
    document.querySelectorAll('.option-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const option = this.dataset.option;
            
            // Update UI
            document.querySelectorAll('.option-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.option-content').forEach(c => c.classList.add('hidden'));
            document.getElementById(`avatar-${option}`).classList.remove('hidden');
            
            // Update state
            appState.profile.avatarType = option;
            
            // Clear avatar if switching
            if (option === 'url') {
                document.getElementById('avatar').value = appState.profile.avatar || '';
                document.getElementById('avatar-upload-input').value = '';
                document.getElementById('preview-upload').classList.add('hidden');
            } else {
                appState.profile.avatar = '';
                document.getElementById('avatar').value = '';
            }
            
            saveToLocalStorage();
            updatePreview();
        });
    });
    
    // Avatar upload
    const uploadInput = document.getElementById('avatar-upload-input');
    const uploadArea = document.getElementById('upload-area');
    const previewUpload = document.getElementById('preview-upload');
    const uploadedImage = document.getElementById('uploaded-image');
    const removeUpload = document.getElementById('remove-upload');
    
    uploadArea.addEventListener('click', () => uploadInput.click());
    
    uploadInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64 = event.target.result;
            appState.profile.avatar = base64;
            uploadedImage.src = base64;
            previewUpload.classList.remove('hidden');
            saveToLocalStorage();
            updatePreview();
        };
        reader.readAsDataURL(file);
    });
    
    removeUpload.addEventListener('click', function() {
        appState.profile.avatar = '';
        uploadInput.value = '';
        previewUpload.classList.add('hidden');
        saveToLocalStorage();
        updatePreview();
    });
    
    // Template selection
    document.querySelectorAll('.template-option').forEach(option => {
        option.addEventListener('click', function() {
            const template = this.dataset.template;
            
            // Update UI
            document.querySelectorAll('.template-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            
            // Update state
            appState.template = template;
            
            // Update Linktree instance
            Linktree.setTemplate(template);
            
            saveToLocalStorage();
            updatePreview();
        });
    });
    
    // Music controls
    const musicEnabled = document.getElementById('music-enabled');
    const musicOptions = document.getElementById('music-options');
    const musicSelect = document.getElementById('music-select');
    const volumeSlider = document.getElementById('volume');
    const volumeValue = document.getElementById('volume-value');
    const testMusicBtn = document.getElementById('test-music');
    
    musicEnabled.addEventListener('change', function() {
        appState.music.enabled = this.checked;
        
        if (this.checked) {
            musicOptions.classList.remove('hidden');
        } else {
            musicOptions.classList.add('hidden');
        }
        
        saveToLocalStorage();
        updatePreview();
    });
    
    musicSelect.addEventListener('change', function() {
        appState.music.track = this.value;
        saveToLocalStorage();
        updatePreview();
    });
    
    volumeSlider.addEventListener('input', function() {
        const value = this.value;
        appState.music.volume = parseInt(value);
        volumeValue.textContent = `${value}%`;
        saveToLocalStorage();
        updatePreview();
    });
    
    testMusicBtn.addEventListener('click', function() {
        if (!appState.music.enabled || !appState.music.track) {
            alert('Please enable music and select a track first');
            return;
        }
        
        // Get audio URL based on track
        let audioUrl = '';
        switch(appState.music.track) {
            case 'cyber':
                audioUrl = 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3';
                break;
            case 'futuristic':
                audioUrl = 'https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3';
                break;
            case 'pixel':
                audioUrl = 'https://assets.mixkit.co/music/preview/mixkit-game-show-suspense-waiting-667.mp3';
                break;
        }
        
        if (audioUrl) {
            const audio = document.getElementById('test-audio');
            audio.src = audioUrl;
            audio.volume = appState.music.volume / 100;
            audio.play().catch(e => {
                console.log('Audio play failed:', e);
                alert('Please click "Enable Sound" button first, or your browser may block autoplay.');
            });
        }
    });
    
    // Social links
    const socialsContainer = document.getElementById('socials-container');
    const addSocialBtn = document.getElementById('add-social');
    
    addSocialBtn.addEventListener('click', addSocialItem);
    
    // Initial social item
    addSocialItem();
    
    // Custom links
    const linksContainer = document.getElementById('links-container');
    const addLinkBtn = document.getElementById('add-link');
    
    addLinkBtn.addEventListener('click', addLinkItem);
    
    // Initial link item
    addLinkItem();
    
    // Preview controls
    document.querySelectorAll('.preview-mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.dataset.mode;
            
            // Update UI
            document.querySelectorAll('.preview-mode-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update preview wrapper
            const wrapper = document.getElementById('preview-wrapper');
            wrapper.className = 'preview-wrapper';
            if (mode === 'mobile') {
                wrapper.classList.add('mobile');
            }
            
            appState.settings.previewMode = mode;
            saveToLocalStorage();
        });
    });
    
    document.getElementById('refresh-preview').addEventListener('click', updatePreview);
    
    // Export buttons
    document.getElementById('copy-html').addEventListener('click', copyHTML);
    document.getElementById('download-html').addEventListener('click', downloadHTML);
    document.getElementById('preview-full').addEventListener('click', previewFullscreen);
    document.getElementById('preview-btn').addEventListener('click', previewFullscreen);
    
    // Reset button
    document.getElementById('reset-all').addEventListener('click', resetAll);
}

// Social Links Management
function addSocialItem(index = null) {
    const container = document.getElementById('socials-container');
    
    if (index === null) {
        index = container.children.length;
    }
    
    const socialItem = document.createElement('div');
    socialItem.className = 'social-item';
    socialItem.dataset.index = index;
    
    socialItem.innerHTML = `
        <div class="social-header">
            <select class="pixel-input social-platform">
                <option value="">Select Platform</option>
                <option value="github">GitHub</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter / X</option>
                <option value="youtube">YouTube</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
                <option value="discord">Discord</option>
                <option value="spotify">Spotify</option>
                <option value="facebook">Facebook</option>
                <option value="twitch">Twitch</option>
            </select>
            <button type="button" class="btn-icon remove-social">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <input type="text" class="pixel-input social-url" placeholder="https://example.com/username">
    `;
    
    container.appendChild(socialItem);
    
    // Add event listeners for new item
    const platformSelect = socialItem.querySelector('.social-platform');
    const urlInput = socialItem.querySelector('.social-url');
    const removeBtn = socialItem.querySelector('.remove-social');
    
    platformSelect.addEventListener('change', function() {
        updateSocialItem(index, platformSelect.value, urlInput.value);
    });
    
    urlInput.addEventListener('input', function() {
        updateSocialItem(index, platformSelect.value, urlInput.value);
    });
    
    removeBtn.addEventListener('click', function() {
        if (container.children.length > 1) {
            socialItem.remove();
            updateSocialsArray();
            updatePreview();
        }
    });
    
    // Initialize from state if available
    if (appState.socials[index]) {
        platformSelect.value = appState.socials[index].platform;
        urlInput.value = appState.socials[index].url || '';
    }
    
    updateSocialItem(index, platformSelect.value, urlInput.value);
}

function updateSocialItem(index, platform, url) {
    if (!platform) return;
    
    appState.socials[index] = {
        platform: platform,
        url: url || ''
    };
    
    saveToLocalStorage();
    updatePreview();
}

function updateSocialsArray() {
    const socialItems = document.querySelectorAll('.social-item');
    appState.socials = [];
    
    socialItems.forEach((item, index) => {
        const platform = item.querySelector('.social-platform').value;
        const url = item.querySelector('.social-url').value;
        
        if (platform) {
            appState.socials[index] = {
                platform: platform,
                url: url || ''
            };
        }
    });
}

// Custom Links Management
function addLinkItem(index = null) {
    const container = document.getElementById('links-container');
    
    if (index === null) {
        index = container.children.length;
    }
    
    const linkItem = document.createElement('div');
    linkItem.className = 'link-item';
    linkItem.dataset.index = index;
    
    linkItem.innerHTML = `
        <div class="link-header">
            <input type="text" class="pixel-input link-text" placeholder="Link Text">
            <button type="button" class="btn-icon remove-link">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <input type="text" class="pixel-input link-url" placeholder="https://example.com">
    `;
    
    container.appendChild(linkItem);
    
    // Add event listeners for new item
    const textInput = linkItem.querySelector('.link-text');
    const urlInput = linkItem.querySelector('.link-url');
    const removeBtn = linkItem.querySelector('.remove-link');
    
    textInput.addEventListener('input', function() {
        updateLinkItem(index, textInput.value, urlInput.value);
    });
    
    urlInput.addEventListener('input', function() {
        updateLinkItem(index, textInput.value, urlInput.value);
    });
    
    removeBtn.addEventListener('click', function() {
        if (container.children.length > 1) {
            linkItem.remove();
            updateLinksArray();
            updatePreview();
        }
    });
    
    // Initialize from state if available
    if (appState.links[index]) {
        textInput.value = appState.links[index].text || '';
        urlInput.value = appState.links[index].url || '';
    }
    
    updateLinkItem(index, textInput.value, urlInput.value);
}

function updateLinkItem(index, text, url) {
    if (!text && !url) return;
    
    appState.links[index] = {
        text: text || '',
        url: url || ''
    };
    
    saveToLocalStorage();
    updatePreview();
}

function updateLinksArray() {
    const linkItems = document.querySelectorAll('.link-item');
    appState.links = [];
    
    linkItems.forEach((item, index) => {
        const text = item.querySelector('.link-text').value;
        const url = item.querySelector('.link-url').value;
        
        if (text || url) {
            appState.links[index] = {
                text: text || '',
                url: url || ''
            };
        }
    });
}

// Update Preview
function updatePreview() {
    // Update socials and links arrays
    updateSocialsArray();
    updateLinksArray();
    
    // Filter out empty items
    const filteredSocials = appState.socials.filter(s => s && s.platform);
    const filteredLinks = appState.links.filter(l => l && (l.text || l.url));
    
    // Update Linktree instance
    Linktree.update({
        profile: {
            name: appState.profile.name || 'Your Name',
            bio: appState.profile.bio || 'Short bio about yourself',
            avatar: appState.profile.avatar || 'https://via.placeholder.com/150'
        },
        socials: filteredSocials,
        links: filteredLinks,
        music: {
            enabled: appState.music.enabled,
            track: appState.music.track,
            volume: appState.music.volume
        }
    });
}

// Export Functions
function copyHTML() {
    const html = generateHTML();
    
    navigator.clipboard.writeText(html).then(() => {
        alert('HTML copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy HTML. Please try again.');
    });
}

function downloadHTML() {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mylinktree.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function previewFullscreen() {
    // Save current state to localStorage for preview page
    localStorage.setItem('linktreePreviewData', JSON.stringify(appState));
    
    // Open preview page
    window.open('preview.html', '_blank');
}

// Generate HTML for export
function generateHTML() {
    const filteredSocials = appState.socials.filter(s => s && s.platform);
    const filteredLinks = appState.links.filter(l => l && (l.text || l.url));
    
    // Platform icons mapping
    const iconMap = {
        github: 'fab fa-github',
        instagram: 'fab fa-instagram',
        twitter: 'fab fa-twitter',
        youtube: 'fab fa-youtube',
        linkedin: 'fab fa-linkedin',
        tiktok: 'fab fa-tiktok',
        whatsapp: 'fab fa-whatsapp',
        telegram: 'fab fa-telegram',
        discord: 'fab fa-discord',
        spotify: 'fab fa-spotify',
        facebook: 'fab fa-facebook',
        twitch: 'fab fa-twitch'
    };
    
    // Get music URL
    let musicUrl = '';
    if (appState.music.enabled && appState.music.track) {
        switch(appState.music.track) {
            case 'cyber':
                musicUrl = 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3';
                break;
            case 'futuristic':
                musicUrl = 'https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3';
                break;
            case 'pixel':
                musicUrl = 'https://assets.mixkit.co/music/preview/mixkit-game-show-suspense-waiting-667.mp3';
                break;
        }
    }
    
    // Template styles
    const templateStyles = {
        pixel: `
            .linktree-container {
                background: linear-gradient(135deg, #0a0a1a, #050510);
                color: #f0f0ff;
                border: 3px solid #00ff9d;
                box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.5);
            }
            .linktree-btn {
                background-color: #00ff9d;
                color: #0a0a1a;
                border: 2px solid #00ff9d;
                box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.5);
            }
            .linktree-btn:hover {
                background-color: #00b8ff;
                transform: translateY(-2px);
                box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.5);
            }
        `,
        cyber: `
            .linktree-container {
                background: linear-gradient(135deg, #0a0a1a, #050510);
                color: #f0f0ff;
                border: 2px solid transparent;
                border-image: linear-gradient(45deg, #00f3ff, #ff00ff) 1;
                box-shadow: 0 0 20px rgba(0, 243, 255, 0.3),
                            inset 0 0 20px rgba(255, 0, 255, 0.1);
            }
            .linktree-btn {
                background: linear-gradient(45deg, #00f3ff, #ff00ff);
                color: #0a0a1a;
                border: none;
                box-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
            }
            .linktree-btn:hover {
                box-shadow: 0 0 20px rgba(255, 0, 255, 0.7);
                transform: scale(1.05);
            }
        `,
        dark: `
            .linktree-container {
                background: linear-gradient(135deg, #000010, #0a0a1f);
                color: #f0f0ff;
                border: 2px solid #0033ff;
                box-shadow: 0 0 30px rgba(0, 51, 255, 0.3);
            }
            .linktree-btn {
                background-color: transparent;
                color: #00f3ff;
                border: 2px solid #0033ff;
                position: relative;
                overflow: hidden;
            }
            .linktree-btn:hover {
                background-color: rgba(0, 51, 255, 0.1);
                box-shadow: 0 0 15px rgba(0, 51, 255, 0.5);
                text-shadow: 0 0 10px rgba(0, 243, 255, 0.7);
            }
        `
    };
    
    const html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appState.profile.name || 'My Linktree'}</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #050510;
            color: #f0f0ff;
            line-height: 1.6;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(0, 255, 157, 0.05) 0%, transparent 20%),
                radial-gradient(circle at 90% 80%, rgba(0, 184, 255, 0.05) 0%, transparent 20%);
        }
        
        .linktree-container {
            width: 100%;
            max-width: 480px;
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            ${templateStyles[appState.template]}
            transition: all 0.3s ease;
        }
        
        .avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            margin: 0 auto 20px;
            border: 3px solid;
            border-color: ${appState.template === 'pixel' ? '#00ff9d' : appState.template === 'cyber' ? '#00f3ff' : '#0033ff'};
        }
        
        h1 {
            font-family: 'Press Start 2P', cursive;
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: ${appState.template === 'pixel' ? '#00ff9d' : appState.template === 'cyber' ? '#00f3ff' : '#00f3ff'};
        }
        
        .bio {
            margin-bottom: 30px;
            color: #b0b0d0;
            font-size: 1rem;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #1a1a2e;
            color: #f0f0ff;
            font-size: 1.2rem;
            transition: all 0.3s ease;
            text-decoration: none;
        }
        
        .social-link:hover {
            transform: translateY(-5px);
            background-color: ${appState.template === 'pixel' ? '#00ff9d' : appState.template === 'cyber' ? '#ff00ff' : '#0033ff'};
            color: #0a0a1a;
        }
        
        .links-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .linktree-btn {
            display: block;
            padding: 15px 20px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            text-align: center;
        }
        
        .music-controls {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #3a3a4a;
        }
        
        .music-toggle {
            background: none;
            border: none;
            color: ${appState.template === 'pixel' ? '#00ff9d' : appState.template === 'cyber' ? '#ff00ff' : '#00f3ff'};
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .music-toggle:hover {
            transform: scale(1.2);
        }
        
        footer {
            margin-top: 30px;
            font-size: 0.8rem;
            color: #3a3a4a;
        }
        
        /* Responsive Design */
        @media (max-width: 767px) {
            .linktree-container {
                padding: 20px;
                max-width: 100%;
            }
            
            h1 {
                font-size: 1.2rem;
            }
            
            .avatar {
                width: 100px;
                height: 100px;
            }
            
            .linktree-btn {
                padding: 12px 15px;
            }
        }
        
        @media (min-width: 768px) and (max-width: 1023px) {
            .linktree-container {
                max-width: 500px;
            }
        }
    </style>
</head>
<body>
    <div class="linktree-container">
        ${appState.profile.avatar ? `<img src="${appState.profile.avatar}" alt="${appState.profile.name}" class="avatar">` : ''}
        
        <h1>${appState.profile.name || 'Your Name'}</h1>
        
        <div class="bio">
            ${appState.profile.bio || 'Short bio about yourself'}
        </div>
        
        ${filteredSocials.length > 0 ? `
        <div class="social-links">
            ${filteredSocials.map(social => `
                <a href="${social.url || '#'}" class="social-link" target="_blank" rel="noopener noreferrer">
                    <i class="${iconMap[social.platform] || 'fas fa-link'}"></i>
                </a>
            `).join('')}
        </div>
        ` : ''}
        
        ${filteredLinks.length > 0 ? `
        <div class="links-container">
            ${filteredLinks.map(link => `
                <a href="${link.url || '#'}" class="linktree-btn" target="_blank" rel="noopener noreferrer">
                    ${link.text || 'Link'}
                </a>
            `).join('')}
        </div>
        ` : ''}
        
        ${musicUrl ? `
        <div class="music-controls">
            <button class="music-toggle" id="music-toggle">
                <i class="fas fa-play"></i>
            </button>
            <input type="range" id="volume-control" min="0" max="100" value="${appState.music.volume}" style="width: 100px; margin-left: 15px;">
        </div>
        ` : ''}
        
        <footer>
            Created with PixelLink Builder
        </footer>
    </div>
    
    ${musicUrl ? `
    <audio id="background-music" loop preload="auto">
        <source src="${musicUrl}" type="audio/mpeg">
    </audio>
    
    <script>
        const music = document.getElementById('background-music');
        const toggleBtn = document.getElementById('music-toggle');
        const volumeControl = document.getElementById('volume-control');
        
        // Set initial volume
        music.volume = ${appState.music.volume / 100};
        
        // Music toggle
        toggleBtn.addEventListener('click', function() {
            if (music.paused) {
                music.play();
                toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                music.pause();
                toggleBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
        
        // Volume control
        volumeControl.addEventListener('input', function() {
            music.volume = this.value / 100;
        });
        
        // Try to autoplay (muted first)
        music.muted = true;
        const playPromise = music.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Autoplay started, unmute if user interacts
                document.addEventListener('click', function unmute() {
                    music.muted = false;
                    toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    document.removeEventListener('click', unmute);
                }, { once: true });
            }).catch(() => {
                // Autoplay was prevented
                console.log('Autoplay prevented');
            });
        }
    </script>
    ` : ''}
    
    <script>
        // Add hover effects
        document.querySelectorAll('.linktree-btn, .social-link').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = this.classList.contains('linktree-btn') 
                    ? 'translateY(-3px)' 
                    : 'translateY(-5px)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    </script>
</body>
</html>`;
    
    return html;
}

// Reset All
function resetAll() {
    if (!confirm('Are you sure you want to reset everything? This cannot be undone.')) {
        return;
    }
    
    // Clear localStorage
    localStorage.clear();
    
    // Reset app state
    appState.profile = {
        name: '',
        bio: '',
        avatar: '',
        avatarType: 'url'
    };
    
    appState.template = 'pixel';
    appState.music = {
        enabled: false,
        track: '',
        volume: 50
    };
    
    appState.socials = [];
    appState.links = [];
    
    // Reset form inputs
    document.getElementById('name').value = '';
    document.getElementById('bio').value = '';
    document.getElementById('avatar').value = '';
    document.getElementById('avatar-upload-input').value = '';
    document.getElementById('preview-upload').classList.add('hidden');
    
    // Reset template selection
    document.querySelectorAll('.template-option').forEach(o => o.classList.remove('active'));
    document.querySelector('.template-option[data-template="pixel"]').classList.add('active');
    
    // Reset music controls
    document.getElementById('music-enabled').checked = false;
    document.getElementById('music-options').classList.add('hidden');
    document.getElementById('music-select').value = '';
    document.getElementById('volume').value = '50';
    document.getElementById('volume-value').textContent = '50%';
    
    // Clear socials and links containers
    const socialsContainer = document.getElementById('socials-container');
    const linksContainer = document.getElementById('links-container');
    
    // Remove all but first item
    while (socialsContainer.children.length > 1) {
        socialsContainer.removeChild(socialsContainer.lastChild);
    }
    
    while (linksContainer.children.length > 1) {
        linksContainer.removeChild(linksContainer.lastChild);
    }
    
    // Reset first items
    socialsContainer.querySelector('.social-platform').value = '';
    socialsContainer.querySelector('.social-url').value = '';
    
    linksContainer.querySelector('.link-text').value = '';
    linksContainer.querySelector('.link-url').value = '';
    
    // Stop any playing music
    const audio = document.getElementById('test-audio');
    audio.pause();
    audio.currentTime = 0;
    
    // Update preview
    updatePreview();
    
    alert('All data has been reset!');
}

// Local Storage Functions
function saveToLocalStorage() {
    localStorage.setItem('linktreeBuilderData', JSON.stringify(appState));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('linktreeBuilderData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            Object.assign(appState, data);
            
            // Update form inputs from saved state
            document.getElementById('name').value = appState.profile.name || '';
            document.getElementById('bio').value = appState.profile.bio || '';
            
            // Update avatar
            if (appState.profile.avatarType === 'url') {
                document.querySelector('.option-tab[data-option="url"]').click();
                document.getElementById('avatar').value = appState.profile.avatar || '';
            } else if (appState.profile.avatar) {
                document.querySelector('.option-tab[data-option="upload"]').click();
                document.getElementById('uploaded-image').src = appState.profile.avatar;
                document.getElementById('preview-upload').classList.remove('hidden');
            }
            
            // Update template
            document.querySelectorAll('.template-option').forEach(o => o.classList.remove('active'));
            const templateOption = document.querySelector(`.template-option[data-template="${appState.template}"]`);
            if (templateOption) {
                templateOption.classList.add('active');
                Linktree.setTemplate(appState.template);
            }
            
            // Update music
            document.getElementById('music-enabled').checked = appState.music.enabled;
            if (appState.music.enabled) {
                document.getElementById('music-options').classList.remove('hidden');
            }
            document.getElementById('music-select').value = appState.music.track || '';
            document.getElementById('volume').value = appState.music.volume;
            document.getElementById('volume-value').textContent = `${appState.music.volume}%`;
            
            // Update preview mode
            if (appState.settings.previewMode === 'mobile') {
                document.querySelector('.preview-mode-btn[data-mode="mobile"]').click();
            }
            
        } catch (e) {
            console.error('Failed to load saved data:', e);
        }
    }
}