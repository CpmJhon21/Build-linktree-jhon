// =============================================
// PIXELLINK BUILDER - HTML Generator
// Apple-Raycast Style HTML Export Functions
// =============================================

class HTMLGenerator {
    constructor(config) {
        this.config = config || {
            templates: {
                pixel: {
                    name: 'Pixel Art',
                    color: '#00ff9d',
                    gradient: 'linear-gradient(135deg, #00ff9d, #00b8ff)'
                },
                cyber: {
                    name: 'Cyber Neon',
                    color: '#ff00ff',
                    gradient: 'linear-gradient(135deg, #ff00ff, #00f3ff)'
                },
                dark: {
                    name: 'Dark Futuristic',
                    color: '#0033ff',
                    gradient: 'linear-gradient(135deg, #0033ff, #9c6ce9)'
                }
            },
            musicTracks: {
                cyber: {
                    name: 'Cyber Synth',
                    url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                    icon: 'fas fa-bolt'
                },
                ambient: {
                    name: 'Futuristic Ambient',
                    url: 'https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3',
                    icon: 'fas fa-moon'
                },
                chill: {
                    name: 'Chill Beats',
                    url: 'https://assets.mixkit.co/music/preview/mixkit-game-show-suspense-waiting-667.mp3',
                    icon: 'fas fa-gamepad'
                }
            }
        };
    }
    
    // Generate complete HTML for export
    generate(state) {
        const {
            profile = {},
            template = 'pixel',
            socials = [],
            links = [],
            music = {}
        } = state;
        
        // Filter valid items
        const filteredSocials = this.filterSocials(socials);
        const filteredLinks = this.filterLinks(links);
        
        // Get template config
        const templateConfig = this.config.templates[template] || this.config.templates.pixel;
        
        // Generate the HTML
        return this.createHTML({
            profile,
            template,
            templateConfig,
            socials: filteredSocials,
            links: filteredLinks,
            music
        });
    }
    
    // Filter socials
    filterSocials(socials) {
        return socials.filter(s => 
            s && 
            s.platform && 
            s.platform.trim() !== '' && 
            s.url && 
            s.url.trim() !== ''
        );
    }
    
    // Filter links
    filterLinks(links) {
        return links.filter(l => 
            l && 
            ((l.text && l.text.trim() !== '') || (l.url && l.url.trim() !== '')) &&
            l.url && 
            l.url.trim() !== ''
        );
    }
    
    // Create the complete HTML document
    createHTML(data) {
        const {
            profile,
            template,
            templateConfig,
            socials,
            links,
            music
        } = data;
        
        const musicTrack = this.config.musicTracks[music.track];
        const hasMusic = music.enabled && musicTrack;
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(profile.name || 'My Linktree')} • PixelLink</title>
    <meta name="description" content="${this.escapeHtml(profile.bio || 'Personal link page created with PixelLink Builder')}">
    <meta name="author" content="PixelLink Builder">
    
    <!-- Open Graph / Social Meta Tags -->
    <meta property="og:title" content="${this.escapeHtml(profile.name || 'My Linktree')}">
    <meta property="og:description" content="${this.escapeHtml(profile.bio || 'Personal link page created with PixelLink Builder')}">
    <meta property="og:type" content="website">
    ${profile.avatar ? `<meta property="og:image" content="${this.escapeHtml(profile.avatar)}">` : ''}
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Favicon -->
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔗</text></svg>">
    
    <style>
        /* ===== RESET & BASE STYLES ===== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        :root {
            --color-primary: ${templateConfig.color};
            --gradient-primary: ${templateConfig.gradient};
            --color-bg: ${template === 'pixel' ? '#0a0a1a' : template === 'cyber' ? '#0a0a1a' : '#000010'};
            --color-bg-secondary: ${template === 'pixel' ? '#050510' : template === 'cyber' ? '#050510' : '#0a0a1f'};
            --color-text: #f0f0ff;
            --color-text-secondary: rgba(255, 255, 255, 0.7);
            --color-border: rgba(255, 255, 255, 0.1);
            
            --radius-sm: 8px;
            --radius-md: 12px;
            --radius-lg: 16px;
            --radius-xl: 24px;
            --radius-full: 9999px;
            
            --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
            --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.15);
            --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.2);
            --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.25);
            
            --transition-fast: 0.15s cubic-bezier(0.16, 1, 0.3, 1);
            --transition-normal: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            --transition-slow: 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, var(--color-bg), var(--color-bg-secondary));
            color: var(--color-text);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            line-height: 1.6;
            position: relative;
            overflow-x: hidden;
        }
        
        /* Noise texture overlay */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E");
            pointer-events: none;
            z-index: -1;
        }
        
        /* ===== LINKTREE CONTAINER ===== */
        .linktree-container {
            width: 100%;
            max-width: 500px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-xl);
            padding: 48px 32px;
            text-align: center;
            animation: containerEnter var(--transition-slow) cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: var(--shadow-xl);
            position: relative;
            overflow: hidden;
        }
        
        .linktree-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--gradient-primary);
            border-radius: var(--radius-xl) var(--radius-xl) 0 0;
        }
        
        @keyframes containerEnter {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        /* ===== PROFILE SECTION ===== */
        .avatar-container {
            margin-bottom: 32px;
            animation: fadeInUp var(--transition-slow) cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }
        
        .avatar {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid var(--color-primary);
            box-shadow: var(--shadow-lg);
            transition: transform var(--transition-normal);
        }
        
        .avatar:hover {
            transform: scale(1.05) rotate(5deg);
        }
        
        .default-avatar {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            background: var(--gradient-primary);
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 48px;
            border: 4px solid var(--color-primary);
            transition: transform var(--transition-normal);
        }
        
        .default-avatar:hover {
            transform: scale(1.05);
        }
        
        .name {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 12px;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: fadeInUp var(--transition-slow) cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
            letter-spacing: -0.5px;
        }
        
        .bio {
            color: var(--color-text-secondary);
            margin-bottom: 48px;
            font-size: 17px;
            line-height: 1.7;
            animation: fadeInUp var(--transition-slow) cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
            padding: 0 16px;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* ===== SOCIAL LINKS ===== */
        .social-links {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 16px;
            margin-bottom: 48px;
            animation: fadeInUp var(--transition-slow) cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
        }
        
        .social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            color: var(--color-text);
            font-size: 24px;
            text-decoration: none;
            transition: all var(--transition-normal);
            position: relative;
            overflow: hidden;
        }
        
        .social-link:hover {
            transform: translateY(-6px) scale(1.1);
            background: var(--color-primary);
            color: #000;
            box-shadow: var(--shadow-lg);
        }
        
        .social-link::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 5px;
            height: 5px;
            background: rgba(255, 255, 255, 0.3);
            opacity: 0;
            border-radius: 50%;
            transform: scale(1, 1) translate(-50%, -50%);
            transform-origin: 50% 50%;
        }
        
        .social-link:active::after {
            animation: ripple 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes ripple {
            0% {
                transform: scale(0, 0);
                opacity: 0.5;
            }
            20% {
                transform: scale(25, 25);
                opacity: 0.3;
            }
            100% {
                opacity: 0;
                transform: scale(40, 40);
            }
        }
        
        /* ===== CUSTOM LINKS ===== */
        .links-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: ${hasMusic ? '32px' : '0'};
            animation: fadeInUp var(--transition-slow) cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
        }
        
        .link-btn {
            display: block;
            padding: 18px 28px;
            background: var(--gradient-primary);
            color: ${template === 'pixel' ? '#0a0a1a' : 'white'};
            text-decoration: none;
            border-radius: var(--radius-lg);
            font-weight: 600;
            font-size: 17px;
            text-align: center;
            transition: all var(--transition-normal);
            border: none;
            position: relative;
            overflow: hidden;
        }
        
        .link-btn:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
        }
        
        .link-btn:active {
            transform: translateY(-2px);
        }
        
        .link-btn::after {
            content: '↗';
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0.7;
            font-size: 14px;
        }
        
        /* ===== MUSIC CONTROLS ===== */
        .music-controls {
            margin-top: 48px;
            padding-top: 32px;
            border-top: 1px solid var(--color-border);
            animation: fadeInUp var(--transition-slow) cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
        }
        
        .music-toggle {
            background: none;
            border: none;
            color: var(--color-primary);
            font-size: 28px;
            cursor: pointer;
            padding: 12px;
            border-radius: 50%;
            transition: all var(--transition-normal);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 56px;
            height: 56px;
            background: rgba(255, 255, 255, 0.05);
        }
        
        .music-toggle:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: scale(1.1);
        }
        
        .music-toggle:active {
            transform: scale(0.95);
        }
        
        .volume-control {
            display: inline-flex;
            align-items: center;
            gap: 16px;
            margin-left: 16px;
            vertical-align: middle;
        }
        
        .volume-slider {
            width: 100px;
            height: 6px;
            -webkit-appearance: none;
            appearance: none;
            background: rgba(255, 255, 255, 0.1);
            border-radius: var(--radius-full);
            outline: none;
            cursor: pointer;
        }
        
        .volume-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--color-primary);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: var(--shadow-sm);
            transition: all var(--transition-fast);
        }
        
        .volume-slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
        }
        
        .volume-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--color-primary);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: var(--shadow-sm);
            transition: all var(--transition-fast);
        }
        
        .volume-slider::-moz-range-thumb:hover {
            transform: scale(1.1);
        }
        
        /* ===== FOOTER ===== */
        .footer {
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid var(--color-border);
            color: var(--color-text-secondary);
            font-size: 13px;
            animation: fadeInUp var(--transition-slow) cubic-bezier(0.16, 1, 0.3, 1) 0.7s both;
        }
        
        .footer-brand {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 8px;
        }
        
        .footer-brand i {
            color: var(--color-primary);
        }
        
        .footer-meta {
            font-size: 11px;
            opacity: 0.6;
        }
        
        /* ===== RESPONSIVE DESIGN ===== */
        @media (max-width: 600px) {
            body {
                padding: 16px;
            }
            
            .linktree-container {
                padding: 40px 24px;
                border-radius: var(--radius-lg);
            }
            
            .avatar,
            .default-avatar {
                width: 120px;
                height: 120px;
            }
            
            .name {
                font-size: 28px;
            }
            
            .bio {
                font-size: 16px;
                padding: 0;
            }
            
            .social-link {
                width: 52px;
                height: 52px;
                font-size: 22px;
            }
            
            .link-btn {
                padding: 16px 24px;
                font-size: 16px;
            }
            
            .music-controls {
                display: flex;
                flex-direction: column;
                gap: 16px;
                align-items: center;
            }
            
            .volume-control {
                margin-left: 0;
            }
        }
        
        @media (max-width: 400px) {
            .linktree-container {
                padding: 32px 20px;
            }
            
            .avatar,
            .default-avatar {
                width: 100px;
                height: 100px;
            }
            
            .name {
                font-size: 24px;
            }
            
            .bio {
                font-size: 15px;
            }
            
            .social-links {
                gap: 12px;
            }
            
            .social-link {
                width: 48px;
                height: 48px;
                font-size: 20px;
            }
            
            .link-btn {
                padding: 14px 20px;
                font-size: 15px;
            }
        }
        
        /* ===== ACCESSIBILITY ===== */
        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
        
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        /* ===== SCROLLBAR STYLING ===== */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
            border-radius: var(--radius-full);
        }
        
        ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: var(--radius-full);
            transition: background var(--transition-fast);
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body>
    <div class="linktree-container">
        <!-- Profile Section -->
        <div class="profile-section">
            ${profile.avatar ? `
                <div class="avatar-container">
                    <img src="${this.escapeHtml(profile.avatar)}" 
                         alt="${this.escapeHtml(profile.name || 'Profile picture')}" 
                         class="avatar">
                </div>
            ` : `
                <div class="avatar-container">
                    <div class="default-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                </div>
            `}
            
            <h1 class="name">${this.escapeHtml(profile.name || 'Your Name')}</h1>
            <p class="bio">${this.escapeHtml(profile.bio || 'Short bio about yourself')}</p>
        </div>
        
        <!-- Social Links -->
        ${socials.length > 0 ? `
        <div class="social-links">
            ${socials.map(social => this.generateSocialLink(social)).join('')}
        </div>
        ` : ''}
        
        <!-- Custom Links -->
        ${links.length > 0 ? `
        <div class="links-container">
            ${links.map(link => this.generateCustomLink(link, template)).join('')}
        </div>
        ` : ''}
        
        <!-- Music Controls -->
        ${hasMusic ? `
        <div class="music-controls">
            <button class="music-toggle" id="music-toggle" aria-label="Toggle music">
                <i class="fas fa-play"></i>
            </button>
            <div class="volume-control">
                <input type="range" class="volume-slider" id="volume-control" 
                       min="0" max="100" value="${music.volume}" 
                       aria-label="Volume control">
            </div>
        </div>
        ` : ''}
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-brand">
                <i class="fas fa-bolt"></i>
                <span>Built with PixelLink</span>
            </div>
            <div class="footer-meta">
                ${templateConfig.name} Template • Responsive Design
            </div>
        </div>
    </div>
    
    <!-- Background Music -->
    ${hasMusic ? `
    <audio id="background-music" loop preload="auto">
        <source src="${this.escapeHtml(musicTrack.url)}" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>
    
    <script>
        // Music player functionality
        (function() {
            const music = document.getElementById('background-music');
            const toggleBtn = document.getElementById('music-toggle');
            const volumeControl = document.getElementById('volume-control');
            
            if (!music || !toggleBtn) return;
            
            // Set initial volume
            music.volume = ${music.volume / 100};
            
            // Toggle playback
            toggleBtn.addEventListener('click', function() {
                if (music.paused) {
                    music.play();
                    toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    toggleBtn.setAttribute('aria-label', 'Pause music');
                } else {
                    music.pause();
                    toggleBtn.innerHTML = '<i class="fas fa-play"></i>';
                    toggleBtn.setAttribute('aria-label', 'Play music');
                }
            });
            
            // Volume control
            if (volumeControl) {
                volumeControl.addEventListener('input', function() {
                    music.volume = this.value / 100;
                    localStorage.setItem('pixellink_volume', this.value);
                });
                
                // Load saved volume
                const savedVolume = localStorage.getItem('pixellink_volume');
                if (savedVolume) {
                    volumeControl.value = savedVolume;
                    music.volume = savedVolume / 100;
                }
            }
            
            // Auto-play with user interaction (for browser autoplay policies)
            const tryAutoplay = () => {
                music.muted = true;
                const playPromise = music.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        // Successfully started playing
                        music.muted = false;
                        toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
                        toggleBtn.setAttribute('aria-label', 'Pause music');
                        
                        // Remove the interaction listener
                        document.removeEventListener('click', tryAutoplay);
                        document.removeEventListener('keydown', tryAutoplay);
                        document.removeEventListener('touchstart', tryAutoplay);
                    }).catch(error => {
                        console.log('Autoplay prevented:', error);
                        // Keep listeners for later interaction
                    });
                }
            };
            
            // Try autoplay on various user interactions
            document.addEventListener('click', tryAutoplay, { once: true });
            document.addEventListener('keydown', tryAutoplay, { once: true });
            document.addEventListener('touchstart', tryAutoplay, { once: true });
            
            // Fallback: try autoplay after a short delay
            setTimeout(tryAutoplay, 1000);
        })();
    </script>
    ` : ''}
    
    <script>
        // Add hover effects and interactivity
        (function() {
            // Add ripple effect to social links
            document.querySelectorAll('.social-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    // Only create ripple if link is valid
                    if (this.getAttribute('href') && this.getAttribute('href') !== '#') {
                        const rect = this.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        const ripple = document.createElement('span');
                        ripple.style.position = 'absolute';
                        ripple.style.borderRadius = '50%';
                        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                        ripple.style.transform = 'scale(0)';
                        ripple.style.animation = 'ripple 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                        
                        const size = Math.max(rect.width, rect.height);
                        ripple.style.width = ripple.style.height = size + 'px';
                        ripple.style.left = x - size / 2 + 'px';
                        ripple.style.top = y - size / 2 + 'px';
                        
                        this.appendChild(ripple);
                        
                        setTimeout(() => {
                            if (ripple.parentNode) {
                                ripple.parentNode.removeChild(ripple);
                            }
                        }, 600);
                    }
                });
            });
            
            // Add click animation to buttons
            document.querySelectorAll('.link-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    this.style.transform = 'translateY(-2px) scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                });
            });
            
            // Add keyboard navigation support
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    // Focus management for accessibility
                    document.activeElement.blur();
                }
            });
            
            // Prevent invalid links from navigating
            document.querySelectorAll('a[href="#"]').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Shake animation for empty links
                    this.style.transform = 'translateX(4px)';
                    setTimeout(() => {
                        this.style.transform = 'translateX(-4px)';
                        setTimeout(() => {
                            this.style.transform = '';
                        }, 50);
                    }, 50);
                });
            });
        })();
    </script>
</body>
</html>`;
    }
    
    // Generate social link HTML
    generateSocialLink(social) {
        const platformIcons = {
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
            twitch: 'fab fa-twitch',
            dribbble: 'fab fa-dribbble',
            behance: 'fab fa-behance',
            reddit: 'fab fa-reddit'
        };
        
        const icon = platformIcons[social.platform] || 'fas fa-link';
        const platformName = social.platform.charAt(0).toUpperCase() + social.platform.slice(1);
        
        return `
            <a href="${this.escapeHtml(social.url)}" 
               class="social-link" 
               target="_blank" 
               rel="noopener noreferrer"
               aria-label="${this.escapeHtml(platformName)}">
                <i class="${icon}"></i>
                <span class="sr-only">${this.escapeHtml(platformName)}</span>
            </a>
        `;
    }
    
    // Generate custom link HTML
    generateCustomLink(link, template) {
        const text = link.text || 'Link';
        const isPixelTemplate = template === 'pixel';
        
        return `
            <a href="${this.escapeHtml(link.url)}" 
               class="link-btn" 
               target="_blank" 
               rel="noopener noreferrer"
               aria-label="${this.escapeHtml(text)}">
                ${this.escapeHtml(text)}
            </a>
        `;
    }
    
    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Validate state before generation
    validateState(state) {
        const errors = [];
        
        if (!state) {
            errors.push('No data provided');
            return { isValid: false, errors };
        }
        
        if (state.profile?.avatar) {
            try {
                new URL(state.profile.avatar);
            } catch (e) {
                // Check if it's a data URL
                if (!state.profile.avatar.startsWith('data:')) {
                    errors.push('Invalid avatar URL');
                }
            }
        }
        
        // Validate social URLs
        state.socials?.forEach((social, index) => {
            if (social.url && social.url !== '#') {
                try {
                    new URL(social.url);
                } catch (e) {
                    errors.push(`Invalid URL for social link ${index + 1}`);
                }
            }
        });
        
        // Validate custom URLs
        state.links?.forEach((link, index) => {
            if (link.url && link.url !== '#') {
                try {
                    new URL(link.url);
                } catch (e) {
                    errors.push(`Invalid URL for link ${index + 1}`);
                }
            }
        });
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

// ===== GLOBAL EXPORTS =====
if (typeof window !== 'undefined') {
    window.HTMLGenerator = HTMLGenerator;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HTMLGenerator
    };
}