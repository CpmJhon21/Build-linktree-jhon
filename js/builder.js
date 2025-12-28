// =============================================
// PIXELLINK BUILDER - Apple-Raycast Style
// Main Application Controller
// =============================================

// ===== APP CONFIGURATION =====
const APP_CONFIG = {
    version: '2.0.0',
    name: 'PixelLink Builder',
    localStorageKey: 'pixellink_apple_v2',
    previewUpdateDelay: 300,
    animations: {
        duration: {
            fast: 150,
            normal: 250,
            slow: 350,
            slower: 500
        },
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
    },
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
            name: 'Pixel Chiptune',
            url: 'https://assets.mixkit.co/music/preview/mixkit-game-show-suspense-waiting-667.mp3',
            icon: 'fas fa-gamepad'
        }
    },
    socialPlatforms: [
        { id: 'github', name: 'GitHub', icon: 'fab fa-github', color: '#333' },
        { id: 'instagram', name: 'Instagram', icon: 'fab fa-instagram', color: '#E1306C' },
        { id: 'twitter', name: 'Twitter / X', icon: 'fab fa-twitter', color: '#1DA1F2' },
        { id: 'youtube', name: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000' },
        { id: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0077B5' },
        { id: 'tiktok', name: 'TikTok', icon: 'fab fa-tiktok', color: '#000000' },
        { id: 'whatsapp', name: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366' },
        { id: 'telegram', name: 'Telegram', icon: 'fab fa-telegram', color: '#0088CC' },
        { id: 'discord', name: 'Discord', icon: 'fab fa-discord', color: '#5865F2' },
        { id: 'spotify', name: 'Spotify', icon: 'fab fa-spotify', color: '#1DB954' },
        { id: 'facebook', name: 'Facebook', icon: 'fab fa-facebook', color: '#1877F2' },
        { id: 'twitch', name: 'Twitch', icon: 'fab fa-twitch', color: '#9146FF' },
        { id: 'dribbble', name: 'Dribbble', icon: 'fab fa-dribbble', color: '#EA4C89' },
        { id: 'behance', name: 'Behance', icon: 'fab fa-behance', color: '#1769FF' },
        { id: 'reddit', name: 'Reddit', icon: 'fab fa-reddit', color: '#FF4500' }
    ]
};

// ===== APP STATE MANAGEMENT =====
class AppState {
    constructor() {
        this.profile = {
            name: '',
            bio: '',
            avatar: '',
            avatarType: 'url'
        };
        this.template = 'pixel';
        this.socials = [];
        this.links = [];
        this.music = {
            enabled: false,
            track: '',
            volume: 50
        };
        this.preview = {
            device: 'desktop',
            isLoading: false
        };
        this.ui = {
            toastQueue: [],
            tooltipVisible: false
        };
    }

    // Save to localStorage
    save() {
        try {
            const data = {
                profile: this.profile,
                template: this.template,
                socials: this.socials.filter(s => s.platform && s.platform.trim() !== ''),
                links: this.links.filter(l => (l.text || l.url) && (l.text.trim() !== '' || l.url.trim() !== '')),
                music: this.music,
                preview: this.preview,
                version: APP_CONFIG.version
            };
            localStorage.setItem(APP_CONFIG.localStorageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Failed to save state:', error);
            return false;
        }
    }

    // Load from localStorage
    load() {
        try {
            const saved = localStorage.getItem(APP_CONFIG.localStorageKey);
            if (saved) {
                const data = JSON.parse(saved);
                
                // Merge with current state
                Object.assign(this.profile, data.profile || {});
                this.template = data.template || 'pixel';
                this.socials = data.socials || [];
                this.links = data.links || [];
                Object.assign(this.music, data.music || {});
                Object.assign(this.preview, data.preview || {});
                
                return true;
            }
        } catch (error) {
            console.error('Failed to load state:', error);
        }
        return false;
    }

    // Reset to defaults
    reset() {
        this.profile = { name: '', bio: '', avatar: '', avatarType: 'url' };
        this.template = 'pixel';
        this.socials = [];
        this.links = [];
        this.music = { enabled: false, track: '', volume: 50 };
        this.preview = { device: 'desktop', isLoading: false };
        localStorage.removeItem(APP_CONFIG.localStorageKey);
        return true;
    }
}

// ===== ANIMATION CONTROLLER =====
class AnimationController {
    static animate(element, animation, duration = 300) {
        return new Promise((resolve) => {
            element.style.animation = `${animation} ${duration}ms ${APP_CONFIG.animations.easing}`;
            
            setTimeout(() => {
                element.style.animation = '';
                resolve();
            }, duration);
        });
    }

    static spring(element, property, from, to) {
        return new Promise((resolve) => {
            const startTime = performance.now();
            const duration = 500;
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Spring easing function
                const springProgress = 1 - Math.cos(progress * Math.PI * 2.5) * Math.exp(-progress * 5);
                
                const value = from + (to - from) * springProgress;
                element.style[property] = `${value}px`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }

    static stagger(selector, animation, staggerDelay = 50, duration = 300) {
        const elements = document.querySelectorAll(selector);
        const promises = [];
        
        elements.forEach((element, index) => {
            setTimeout(() => {
                promises.push(this.animate(element, animation, duration));
            }, index * staggerDelay);
        });
        
        return Promise.all(promises);
    }

    static crossfade(outElement, inElement, duration = 400) {
        return new Promise((resolve) => {
            outElement.style.opacity = '0.5';
            outElement.style.filter = 'blur(2px)';
            
            setTimeout(() => {
                outElement.style.display = 'none';
                inElement.style.display = 'block';
                inElement.style.opacity = '0';
                inElement.style.filter = 'blur(2px)';
                
                setTimeout(() => {
                    inElement.style.opacity = '1';
                    inElement.style.filter = 'blur(0)';
                    resolve();
                }, 20);
            }, duration / 2);
        });
    }
}

// ===== UI COMPONENTS =====
class Toast {
    static show(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container') || this.createContainer();
        const toast = document.createElement('div');
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="${icons[type]}"></i>
            <span>${message}</span>
        `;
        
        // Add spring animation
        toast.style.transform = 'translateX(100%)';
        container.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.transition = `transform ${APP_CONFIG.animations.duration.normal}ms ${APP_CONFIG.animations.easing}`;
        }, 10);
        
        // Auto remove
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, APP_CONFIG.animations.duration.normal);
        }, duration);
        
        return toast;
    }
    
    static createContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }
}

class Tooltip {
    static show(text, element) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        const tooltipHeight = tooltip.offsetHeight;
        const tooltipWidth = tooltip.offsetWidth;
        
        // Position above element
        let top = rect.top - tooltipHeight - 8;
        let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        
        // Adjust if tooltip would go off screen
        if (top < 10) top = rect.bottom + 8;
        if (left < 10) left = 10;
        if (left + tooltipWidth > window.innerWidth - 10) {
            left = window.innerWidth - tooltipWidth - 10;
        }
        
        tooltip.style.position = 'fixed';
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'scale(0.95) translateY(4px)';
        
        // Animate in
        setTimeout(() => {
            tooltip.style.transition = `all ${APP_CONFIG.animations.duration.normal}ms ${APP_CONFIG.animations.easing}`;
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'scale(1) translateY(0)';
        }, 10);
        
        return tooltip;
    }
    
    static hide(tooltip) {
        if (tooltip && tooltip.parentNode) {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'scale(0.95) translateY(4px)';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, APP_CONFIG.animations.duration.normal);
        }
    }
}

// ===== MAIN APPLICATION =====
class PixelLinkBuilder {
    constructor() {
        this.state = new AppState();
        this.elements = {};
        this.currentTooltip = null;
        this.isInitialized = false;
    }
    
    // Initialize application
    async init() {
        console.log('🚀 Initializing PixelLink Builder...');
        
        // Cache DOM elements
        this.cacheElements();
        
        // Load saved state
        this.state.load();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize UI
        await this.initUI();
        
        // Initial preview
        this.updatePreview();
        
        this.isInitialized = true;
        console.log('✅ PixelLink Builder ready!');
        
        // Show welcome message
        setTimeout(() => {
            Toast.show('Welcome to PixelLink Builder!', 'info');
        }, 1000);
    }
    
    // Cache DOM elements
    cacheElements() {
        this.elements = {
            // Profile
            nameInput: document.getElementById('name'),
            bioInput: document.getElementById('bio'),
            avatarUrl: document.getElementById('avatar'),
            
            // Avatar upload
            avatarUploadInput: document.getElementById('avatar-upload-input'),
            uploadArea: document.getElementById('upload-area'),
            previewUpload: document.getElementById('preview-upload'),
            uploadedImage: document.getElementById('uploaded-image'),
            removeUpload: document.getElementById('remove-upload'),
            
            // Template
            templateOptions: document.querySelectorAll('.template-option'),
            
            // Music
            musicToggle: document.getElementById('music-enabled'),
            musicOptions: document.getElementById('music-options'),
            musicSelect: document.getElementById('music-select'),
            volumeSlider: document.getElementById('volume'),
            volumeValue: document.getElementById('volume-value'),
            testMusicBtn: document.getElementById('test-music'),
            
            // Social Links
            socialsContainer: document.getElementById('socials-container'),
            addSocialBtn: document.getElementById('add-social'),
            
            // Custom Links
            linksContainer: document.getElementById('links-container'),
            addLinkBtn: document.getElementById('add-link'),
            
            // Preview
            previewWrapper: document.getElementById('preview-wrapper'),
            previewModeBtns: document.querySelectorAll('.preview-mode-btn'),
            refreshPreviewBtn: document.getElementById('refresh-preview'),
            
            // Export
            copyBtn: document.getElementById('copy-html'),
            downloadBtn: document.getElementById('download-html'),
            previewFullBtn: document.getElementById('preview-full'),
            
            // Actions
            resetBtn: document.getElementById('reset-all'),
            previewBtn: document.getElementById('preview-btn'),
            
            // Audio
            testAudio: document.getElementById('test-audio'),
            
            // Main container
            mainContainer: document.getElementById('main-container')
        };
    }
    
    // Initialize UI components
    async initUI() {
        // Hide loading screen and show main container
        const loading = document.getElementById('loading');
        if (loading && this.elements.mainContainer) {
            loading.style.display = 'none';
            this.elements.mainContainer.style.display = 'block';
        }
        
        // Animate container entrance
        if (this.elements.mainContainer) {
            await AnimationController.animate(
                this.elements.mainContainer,
                'fadeIn',
                APP_CONFIG.animations.duration.slower
            );
        }
        
        // Stagger form groups
        await AnimationController.stagger(
            '.form-group',
            'fadeSlideUp',
            50,
            APP_CONFIG.animations.duration.normal
        );
        
        // Update form fields from state
        this.updateFormFromState();
        
        // Setup tooltips
        this.setupTooltips();
    }
    
    // Update form fields from state
    updateFormFromState() {
        const { profile, template, music, preview } = this.state;
        const el = this.elements;
        
        // Profile
        if (el.nameInput) el.nameInput.value = profile.name || '';
        if (el.bioInput) el.bioInput.value = profile.bio || '';
        if (el.avatarUrl) el.avatarUrl.value = profile.avatarType === 'url' ? profile.avatar || '' : '';
        
        // Set avatar tabs
        this.handleAvatarTabSwitch(profile.avatarType || 'url');
        
        // Template
        if (el.templateOptions) {
            el.templateOptions.forEach(option => {
                option.classList.toggle('active', option.dataset.template === template);
            });
        }
        
        // Music
        if (el.musicToggle) el.musicToggle.checked = music.enabled;
        if (el.musicSelect) el.musicSelect.value = music.track || '';
        if (el.volumeSlider) el.volumeSlider.value = music.volume;
        if (el.volumeValue) el.volumeValue.textContent = `${music.volume}%`;
        
        if (music.enabled && el.musicOptions) {
            el.musicOptions.classList.remove('hidden');
        }
        
        // Preview device
        if (el.previewModeBtns) {
            el.previewModeBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.mode === preview.device);
            });
        }
        
        if (el.previewWrapper) {
            el.previewWrapper.classList.remove('desktop', 'mobile');
            el.previewWrapper.classList.add(preview.device);
        }
        
        // Load dynamic items
        this.loadDynamicItems();
    }
    
    // Setup event listeners
    setupEventListeners() {
        const el = this.elements;
        
        // Profile inputs
        if (el.nameInput) {
            el.nameInput.addEventListener('input', this.debounce((e) => {
                this.state.profile.name = e.target.value;
                this.state.save();
                this.updatePreview();
            }, APP_CONFIG.previewUpdateDelay));
        }
        
        if (el.bioInput) {
            el.bioInput.addEventListener('input', this.debounce((e) => {
                this.state.profile.bio = e.target.value;
                this.state.save();
                this.updatePreview();
            }, APP_CONFIG.previewUpdateDelay));
        }
        
        if (el.avatarUrl) {
            el.avatarUrl.addEventListener('input', this.debounce((e) => {
                if (this.state.profile.avatarType === 'url') {
                    this.state.profile.avatar = e.target.value;
                    this.state.save();
                    this.updatePreview();
                }
            }, APP_CONFIG.previewUpdateDelay));
        }
        
        // Avatar upload handling
        if (el.uploadArea) {
            el.uploadArea.addEventListener('click', () => {
                if (el.avatarUploadInput) {
                    el.avatarUploadInput.click();
                }
            });
        }
        
        if (el.avatarUploadInput) {
            el.avatarUploadInput.addEventListener('change', (e) => this.handleAvatarUpload(e));
        }
        
        if (el.removeUpload) {
            el.removeUpload.addEventListener('click', () => this.clearAvatar());
        }
        
        // Avatar tab switching
        document.querySelectorAll('.option-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const option = tab.dataset.option;
                this.handleAvatarTabSwitch(option);
            });
        });
        
        // Template selection
        if (el.templateOptions) {
            el.templateOptions.forEach(option => {
                option.addEventListener('click', () => this.handleTemplateSelect(option));
            });
        }
        
        // Music controls
        if (el.musicToggle) {
            el.musicToggle.addEventListener('change', (e) => this.handleMusicToggle(e));
        }
        
        if (el.musicSelect) {
            el.musicSelect.addEventListener('change', (e) => this.handleMusicSelect(e));
        }
        
        if (el.volumeSlider) {
            el.volumeSlider.addEventListener('input', (e) => this.handleVolumeChange(e));
        }
        
        if (el.testMusicBtn) {
            el.testMusicBtn.addEventListener('click', () => this.testMusic());
        }
        
        // Device tabs
        if (el.previewModeBtns) {
            el.previewModeBtns.forEach(btn => {
                btn.addEventListener('click', () => this.handleDeviceSwitch(btn));
            });
        }
        
        // Social links
        if (el.addSocialBtn) {
            el.addSocialBtn.addEventListener('click', () => this.addSocialItem());
        }
        
        // Custom links
        if (el.addLinkBtn) {
            el.addLinkBtn.addEventListener('click', () => this.addLinkItem());
        }
        
        // Export buttons
        if (el.copyBtn) {
            el.copyBtn.addEventListener('click', () => this.copyHTML());
        }
        
        if (el.downloadBtn) {
            el.downloadBtn.addEventListener('click', () => this.downloadHTML());
        }
        
        if (el.previewFullBtn) {
            el.previewFullBtn.addEventListener('click', () => this.openFullPreview());
        }
        
        if (el.previewBtn) {
            el.previewBtn.addEventListener('click', () => this.openFullPreview());
        }
        
        // Reset button
        if (el.resetBtn) {
            el.resetBtn.addEventListener('click', () => this.resetAll());
        }
        
        // Refresh preview
        if (el.refreshPreviewBtn) {
            el.refreshPreviewBtn.addEventListener('click', () => this.updatePreview());
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Prevent form submission
        document.addEventListener('submit', (e) => e.preventDefault());
    }
    
    // Setup tooltips
    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const text = e.target.dataset.tooltip;
                this.currentTooltip = Tooltip.show(text, e.target);
            });
            
            element.addEventListener('mouseleave', () => {
                if (this.currentTooltip) {
                    Tooltip.hide(this.currentTooltip);
                    this.currentTooltip = null;
                }
            });
        });
    }
    
    // ===== EVENT HANDLERS =====
    
    // Handle avatar tab switching
    handleAvatarTabSwitch(option) {
        // Update UI tabs
        document.querySelectorAll('.option-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.option === option);
        });
        
        // Show/hide content
        document.querySelectorAll('.option-content').forEach(content => {
            content.classList.toggle('hidden', content.id !== `avatar-${option}`);
        });
        
        // Update state
        this.state.profile.avatarType = option;
        this.state.save();
    }
    
    // Avatar upload handler
    async handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (file.size > 2 * 1024 * 1024) {
            Toast.show('File size must be less than 2MB', 'error');
            return;
        }
        
        try {
            const base64 = await this.readFileAsDataURL(file);
            this.state.profile.avatar = base64;
            this.state.profile.avatarType = 'upload';
            this.state.save();
            
            // Update preview
            this.updatePreview();
            
            // Show success
            Toast.show('Avatar uploaded successfully', 'success');
            
            // Update uploaded image preview
            if (this.elements.uploadedImage && this.elements.previewUpload) {
                this.elements.uploadedImage.src = base64;
                this.elements.previewUpload.classList.remove('hidden');
                this.elements.uploadArea.style.display = 'none';
            }
            
        } catch (error) {
            console.error('Avatar upload failed:', error);
            Toast.show('Failed to upload avatar', 'error');
        }
    }
    
    // Clear avatar
    clearAvatar() {
        this.state.profile.avatar = '';
        this.state.profile.avatarType = 'url';
        if (this.elements.avatarUrl) this.elements.avatarUrl.value = '';
        if (this.elements.avatarUploadInput) this.elements.avatarUploadInput.value = '';
        
        // Hide preview
        if (this.elements.previewUpload) {
            this.elements.previewUpload.classList.add('hidden');
        }
        if (this.elements.uploadArea) {
            this.elements.uploadArea.style.display = 'block';
        }
        
        this.state.save();
        this.updatePreview();
        Toast.show('Avatar cleared', 'info');
    }
    
    // Template selection handler
    async handleTemplateSelect(option) {
        const template = option.dataset.template;
        
        // Update UI
        this.elements.templateOptions.forEach(opt => {
            opt.classList.remove('active');
        });
        option.classList.add('active');
        
        // Spring animation on selected template
        await AnimationController.animate(
            option,
            'fadeSlideUp',
            APP_CONFIG.animations.duration.normal
        );
        
        // Update state and preview
        this.state.template = template;
        this.state.save();
        await this.updatePreview();
    }
    
    // Music toggle handler
    handleMusicToggle(event) {
        const enabled = event.target.checked;
        this.state.music.enabled = enabled;
        
        if (this.elements.musicOptions) {
            if (enabled) {
                this.elements.musicOptions.classList.remove('hidden');
                AnimationController.animate(
                    this.elements.musicOptions,
                    'fadeSlideUp',
                    APP_CONFIG.animations.duration.normal
                );
            } else {
                this.elements.musicOptions.classList.add('hidden');
            }
        }
        
        this.state.save();
        this.updatePreview();
    }
    
    // Music select handler
    handleMusicSelect(event) {
        this.state.music.track = event.target.value;
        this.state.save();
        this.updatePreview();
    }
    
    // Volume change handler
    handleVolumeChange(event) {
        const value = parseInt(event.target.value);
        this.state.music.volume = value;
        if (this.elements.volumeValue) {
            this.elements.volumeValue.textContent = `${value}%`;
        }
        this.state.save();
        this.updatePreview();
    }
    
    // Device switch handler
    async handleDeviceSwitch(tab) {
        const device = tab.dataset.mode;
        
        // Update UI
        this.elements.previewModeBtns.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Spring animation on tab
        await AnimationController.animate(
            tab,
            'fadeSlideUp',
            APP_CONFIG.animations.duration.fast
        );
        
        // Update device screen with morph animation
        this.state.preview.device = device;
        
        // Add scale animation
        if (this.elements.previewWrapper) {
            this.elements.previewWrapper.style.transform = 'scale(0.98)';
            this.elements.previewWrapper.classList.remove('desktop', 'mobile');
            this.elements.previewWrapper.classList.add(device);
            
            setTimeout(() => {
                this.elements.previewWrapper.style.transition = `transform ${APP_CONFIG.animations.duration.normal}ms ${APP_CONFIG.animations.easing}`;
                this.elements.previewWrapper.style.transform = 'scale(1)';
            }, 10);
        }
        
        this.state.save();
    }
    
    // Open full preview
    openFullPreview() {
        // Save current state
        this.state.save();
        
        // Open preview page
        window.open('preview.html', '_blank');
    }
    
    // ===== DYNAMIC ITEMS MANAGEMENT =====
    
    // Load dynamic items from state
    loadDynamicItems() {
        // Clear existing items in containers
        if (this.elements.socialsContainer) {
            const existingSocials = this.elements.socialsContainer.querySelectorAll('.social-item:not(:first-child)');
            existingSocials.forEach(item => item.remove());
        }
        
        if (this.elements.linksContainer) {
            const existingLinks = this.elements.linksContainer.querySelectorAll('.link-item:not(:first-child)');
            existingLinks.forEach(item => item.remove());
        }
        
        // Add social items from state
        if (this.state.socials.length > 0) {
            this.state.socials.forEach((social, index) => {
                if (index > 0) { // First one already exists
                    this.addSocialItem(social);
                } else {
                    // Update first item
                    const firstSocial = this.elements.socialsContainer.querySelector('.social-item');
                    if (firstSocial) {
                        const platformSelect = firstSocial.querySelector('.social-platform');
                        const urlInput = firstSocial.querySelector('.social-url');
                        if (platformSelect) platformSelect.value = social.platform || '';
                        if (urlInput) urlInput.value = social.url || '';
                    }
                }
            });
        }
        
        // Add link items from state
        if (this.state.links.length > 0) {
            this.state.links.forEach((link, index) => {
                if (index > 0) { // First one already exists
                    this.addLinkItem(link);
                } else {
                    // Update first item
                    const firstLink = this.elements.linksContainer.querySelector('.link-item');
                    if (firstLink) {
                        const textInput = firstLink.querySelector('.link-text');
                        const urlInput = firstLink.querySelector('.link-url');
                        if (textInput) textInput.value = link.text || '';
                        if (urlInput) urlInput.value = link.url || '';
                    }
                }
            });
        }
        
        // Setup event listeners for existing items
        this.setupDynamicItemsListeners();
    }
    
    // Setup event listeners for dynamic items
    setupDynamicItemsListeners() {
        // Social items
        document.querySelectorAll('.social-item').forEach((item, index) => {
            const platformSelect = item.querySelector('.social-platform');
            const urlInput = item.querySelector('.social-url');
            const removeBtn = item.querySelector('.remove-social');
            
            if (platformSelect) {
                platformSelect.addEventListener('change', () => {
                    this.updateSocialItem(index, platformSelect.value, urlInput.value);
                });
            }
            
            if (urlInput) {
                urlInput.addEventListener('input', this.debounce(() => {
                    this.updateSocialItem(index, platformSelect.value, urlInput.value);
                }, APP_CONFIG.previewUpdateDelay));
            }
            
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    this.removeSocialItem(index);
                });
            }
        });
        
        // Link items
        document.querySelectorAll('.link-item').forEach((item, index) => {
            const textInput = item.querySelector('.link-text');
            const urlInput = item.querySelector('.link-url');
            const removeBtn = item.querySelector('.remove-link');
            
            if (textInput) {
                textInput.addEventListener('input', this.debounce(() => {
                    this.updateLinkItem(index, textInput.value, urlInput.value);
                }, APP_CONFIG.previewUpdateDelay));
            }
            
            if (urlInput) {
                urlInput.addEventListener('input', this.debounce(() => {
                    this.updateLinkItem(index, textInput.value, urlInput.value);
                }, APP_CONFIG.previewUpdateDelay));
            }
            
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    this.removeLinkItem(index);
                });
            }
        });
    }
    
    // Add social item
    addSocialItem(data = null) {
        const container = this.elements.socialsContainer;
        if (!container) return;
        
        const index = container.querySelectorAll('.social-item').length;
        const firstItem = container.querySelector('.social-item');
        
        // Clone the first item as template
        const newItem = firstItem.cloneNode(true);
        newItem.dataset.index = index;
        
        // Clear values
        const platformSelect = newItem.querySelector('.social-platform');
        const urlInput = newItem.querySelector('.social-url');
        if (platformSelect) platformSelect.value = '';
        if (urlInput) urlInput.value = '';
        
        // Set data if provided
        if (data && platformSelect && urlInput) {
            platformSelect.value = data.platform || '';
            urlInput.value = data.url || '';
        }
        
        // Add event listeners
        const removeBtn = newItem.querySelector('.remove-social');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.removeSocialItem(index);
            });
        }
        
        if (platformSelect) {
            platformSelect.addEventListener('change', () => {
                this.updateSocialItem(index, platformSelect.value, urlInput.value);
            });
        }
        
        if (urlInput) {
            urlInput.addEventListener('input', this.debounce(() => {
                this.updateSocialItem(index, platformSelect.value, urlInput.value);
            }, APP_CONFIG.previewUpdateDelay));
        }
        
        // Add to container
        container.appendChild(newItem);
        
        // Animate in
        AnimationController.animate(newItem, 'fadeSlideUp', APP_CONFIG.animations.duration.normal);
        
        // Update state
        if (data) {
            this.state.socials[index] = data;
        } else {
            this.state.socials[index] = { platform: '', url: '' };
        }
        
        this.state.save();
        this.updatePreview();
        
        return newItem;
    }
    
    // Update social item
    updateSocialItem(index, platform, url) {
        if (!this.state.socials[index]) {
            this.state.socials[index] = { platform: '', url: '' };
        }
        
        this.state.socials[index].platform = platform || '';
        this.state.socials[index].url = url || '';
        this.state.save();
        this.updatePreview();
    }
    
    // Remove social item
    async removeSocialItem(index) {
        const items = document.querySelectorAll('.social-item');
        if (items.length <= 1) {
            // Shake animation for last item
            await AnimationController.animate(items[0], 'shake', APP_CONFIG.animations.duration.fast);
            Toast.show('At least one social link is required', 'warning');
            return;
        }
        
        const item = items[index];
        if (!item) return;
        
        // Animate out
        item.classList.add('removing');
        await AnimationController.animate(
            item,
            'slideOut',
            APP_CONFIG.animations.duration.normal
        );
        
        item.remove();
        
        // Update indices
        document.querySelectorAll('.social-item').forEach((el, i) => {
            el.dataset.index = i;
        });
        
        // Update state
        this.state.socials.splice(index, 1);
        this.state.save();
        this.updatePreview();
        
        Toast.show('Social link removed', 'info');
    }
    
    // Add link item
    addLinkItem(data = null) {
        const container = this.elements.linksContainer;
        if (!container) return;
        
        const index = container.querySelectorAll('.link-item').length;
        const firstItem = container.querySelector('.link-item');
        
        // Clone the first item as template
        const newItem = firstItem.cloneNode(true);
        newItem.dataset.index = index;
        
        // Clear values
        const textInput = newItem.querySelector('.link-text');
        const urlInput = newItem.querySelector('.link-url');
        if (textInput) textInput.value = '';
        if (urlInput) urlInput.value = '';
        
        // Set data if provided
        if (data && textInput && urlInput) {
            textInput.value = data.text || '';
            urlInput.value = data.url || '';
        }
        
        // Add event listeners
        const removeBtn = newItem.querySelector('.remove-link');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.removeLinkItem(index);
            });
        }
        
        if (textInput) {
            textInput.addEventListener('input', this.debounce(() => {
                this.updateLinkItem(index, textInput.value, urlInput.value);
            }, APP_CONFIG.previewUpdateDelay));
        }
        
        if (urlInput) {
            urlInput.addEventListener('input', this.debounce(() => {
                this.updateLinkItem(index, textInput.value, urlInput.value);
            }, APP_CONFIG.previewUpdateDelay));
        }
        
        // Add to container
        container.appendChild(newItem);
        
        // Animate in
        AnimationController.animate(newItem, 'fadeSlideUp', APP_CONFIG.animations.duration.normal);
        
        // Update state
        if (data) {
            this.state.links[index] = data;
        } else {
            this.state.links[index] = { text: '', url: '' };
        }
        
        this.state.save();
        this.updatePreview();
        
        return newItem;
    }
    
    // Update link item
    updateLinkItem(index, text, url) {
        if (!this.state.links[index]) {
            this.state.links[index] = { text: '', url: '' };
        }
        
        this.state.links[index].text = text || '';
        this.state.links[index].url = url || '';
        this.state.save();
        this.updatePreview();
    }
    
    // Remove link item
    async removeLinkItem(index) {
        const items = document.querySelectorAll('.link-item');
        if (items.length <= 1) {
            // Shake animation for last item
            await AnimationController.animate(items[0], 'shake', APP_CONFIG.animations.duration.fast);
            Toast.show('At least one link is required', 'warning');
            return;
        }
        
        const item = items[index];
        if (!item) return;
        
        // Animate out
        item.classList.add('removing');
        await AnimationController.animate(
            item,
            'slideOut',
            APP_CONFIG.animations.duration.normal
        );
        
        item.remove();
        
        // Update indices
        document.querySelectorAll('.link-item').forEach((el, i) => {
            el.dataset.index = i;
        });
        
        // Update state
        this.state.links.splice(index, 1);
        this.state.save();
        this.updatePreview();
        
        Toast.show('Link removed', 'info');
    }
    
    // ===== PREVIEW SYSTEM =====
    
    // Update preview
    async updatePreview() {
        const previewWrapper = this.elements.previewWrapper;
        if (!previewWrapper) return;
        
        // Show loading state
        const placeholder = previewWrapper.querySelector('.preview-placeholder');
        if (placeholder) {
            placeholder.style.opacity = '0.5';
        }
        
        // Small delay for smoothness
        await new Promise(resolve => setTimeout(resolve, APP_CONFIG.previewUpdateDelay));
        
        // Generate new preview
        const html = this.generatePreviewHTML();
        
        // Replace content with animation
        if (previewWrapper.children.length > 0 && previewWrapper.querySelector('.preview-content')) {
            // Crossfade animation
            const oldContent = previewWrapper.querySelector('.preview-content');
            const newDiv = document.createElement('div');
            newDiv.innerHTML = html;
            const newContent = newDiv.firstChild;
            
            await AnimationController.crossfade(oldContent, newContent, APP_CONFIG.animations.duration.normal);
            previewWrapper.innerHTML = '';
            previewWrapper.appendChild(newContent);
        } else {
            // First load
            previewWrapper.innerHTML = html;
            await AnimationController.animate(
                previewWrapper.querySelector('.preview-content'),
                'fadeSlideUp',
                APP_CONFIG.animations.duration.normal
            );
        }
        
        // Restore placeholder opacity
        if (placeholder) {
            placeholder.style.opacity = '1';
        }
    }
    
    // Generate preview HTML
    generatePreviewHTML() {
        const { profile, template, socials, links } = this.state;
        const filteredSocials = socials.filter(s => s.platform && s.platform.trim() !== '' && s.url && s.url.trim() !== '');
        const filteredLinks = links.filter(l => (l.text || l.url) && (l.text.trim() !== '' || l.url.trim() !== ''));
        
        // Template configuration
        const templateConfig = APP_CONFIG.templates[template];
        
        // Generate social links HTML
        const socialLinksHTML = filteredSocials.length > 0 ? `
            <div class="preview-socials" style="
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 12px;
                margin: 30px 0;
            ">
                ${filteredSocials.map(social => {
                    const platform = APP_CONFIG.socialPlatforms.find(p => p.id === social.platform);
                    return `
                        <a href="${social.url || '#'}" 
                           style="
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                width: 48px;
                                height: 48px;
                                border-radius: 50%;
                                background: rgba(255, 255, 255, 0.1);
                                color: white;
                                font-size: 20px;
                                text-decoration: none;
                                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                           "
                           onmouseover="this.style.transform='translateY(-4px)'; this.style.background='${templateConfig.color}';"
                           onmouseout="this.style.transform=''; this.style.background='';"
                           target="_blank">
                            <i class="${platform?.icon || 'fas fa-link'}"></i>
                        </a>
                    `;
                }).join('')}
            </div>
        ` : '';
        
        // Generate custom links HTML
        const customLinksHTML = filteredLinks.length > 0 ? `
            <div class="preview-links" style="
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin: 20px 0;
            ">
                ${filteredLinks.map(link => `
                    <a href="${link.url || '#'}" 
                       style="
                            display: block;
                            padding: 16px 24px;
                            background: ${templateConfig.gradient};
                            color: ${template === 'pixel' ? '#0a0a1a' : 'white'};
                            text-decoration: none;
                            border-radius: 12px;
                            font-weight: 600;
                            font-size: 16px;
                            text-align: center;
                            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                            border: none;
                       "
                       onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.2)';"
                       onmouseout="this.style.transform=''; this.style.boxShadow='';"
                       target="_blank">
                        ${link.text || 'Link'}
                    </a>
                `).join('')}
            </div>
        ` : '';
        
        // Check if there's any content
        const hasContent = profile.name || profile.bio || profile.avatar || filteredSocials.length > 0 || filteredLinks.length > 0;
        
        if (!hasContent) {
            return `
                <div class="preview-content">
                    <div class="preview-placeholder">
                        <i class="fas fa-cube"></i>
                        <p>Preview will appear here</p>
                        <p>Start filling the form to see your Linktree</p>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="preview-content" style="
                background: ${template === 'pixel' ? 'linear-gradient(135deg, #0a0a1a, #050510)' : 
                              template === 'cyber' ? 'linear-gradient(135deg, #0a0a1a, #050510)' : 
                              'linear-gradient(135deg, #000010, #0a0a1f)'};
                color: #f0f0ff;
                min-height: 500px;
                padding: 40px 24px;
                font-family: 'Poppins', sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 12px;
            ">
                <div style="
                    width: 100%;
                    max-width: 480px;
                    margin: 0 auto;
                ">
                    ${profile.avatar ? `
                        <div style="text-align: center; margin-bottom: 24px;">
                            <img src="${profile.avatar}" 
                                 alt="${profile.name || 'Profile'}"
                                 style="
                                    width: 120px;
                                    height: 120px;
                                    border-radius: 50%;
                                    object-fit: cover;
                                    border: 3px solid ${templateConfig.color};
                                    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
                                 ">
                        </div>
                    ` : ''}
                    
                    <h1 style="
                        font-size: 28px;
                        font-weight: 700;
                        text-align: center;
                        margin-bottom: 12px;
                        color: ${templateConfig.color};
                        background: ${templateConfig.gradient};
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    ">
                        ${profile.name || 'Your Name'}
                    </h1>
                    
                    ${profile.bio ? `
                        <p style="
                            text-align: center;
                            color: rgba(255, 255, 255, 0.8);
                            margin-bottom: 32px;
                            line-height: 1.6;
                            font-size: 16px;
                        ">
                            ${profile.bio}
                        </p>
                    ` : ''}
                    
                    ${socialLinksHTML}
                    ${customLinksHTML}
                </div>
            </div>
        `;
    }
    
    // ===== EXPORT FUNCTIONS =====
    
    // Copy HTML to clipboard
    async copyHTML() {
        try {
            // Use the HTMLGenerator from generate.js if available
            let html;
            if (window.HTMLGenerator) {
                const generator = new HTMLGenerator(APP_CONFIG);
                html = generator.generate(this.state);
            } else {
                // Fallback to simple generation
                html = this.generateExportHTML();
            }
            
            await navigator.clipboard.writeText(html);
            
            // Success animation
            const btn = this.elements.copyBtn;
            const originalHTML = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            btn.classList.add('btn-success');
            
            // Spring animation
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transition = `transform ${APP_CONFIG.animations.duration.fast}ms ${APP_CONFIG.animations.easing}`;
                btn.style.transform = 'scale(1)';
            }, 10);
            
            // Reset after delay
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('btn-success');
            }, 2000);
            
            Toast.show('HTML copied to clipboard!', 'success');
        } catch (error) {
            console.error('Copy failed:', error);
            Toast.show('Failed to copy HTML', 'error');
        }
    }
    
    // Download HTML file
    downloadHTML() {
        try {
            // Use the HTMLGenerator from generate.js if available
            let html;
            if (window.HTMLGenerator) {
                const generator = new HTMLGenerator(APP_CONFIG);
                html = generator.generate(this.state);
            } else {
                // Fallback to simple generation
                html = this.generateExportHTML();
            }
            
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `linktree-${this.state.profile.name || 'my'}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            Toast.show('HTML file downloaded!', 'success');
        } catch (error) {
            console.error('Download failed:', error);
            Toast.show('Failed to download HTML', 'error');
        }
    }
    
    // Generate export HTML (fallback)
    generateExportHTML() {
        const { profile, template } = this.state;
        const templateConfig = APP_CONFIG.templates[template];
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${profile.name || 'My Linktree'} - PixelLink</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
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
            background: ${template === 'pixel' ? 'linear-gradient(135deg, #0a0a1a, #050510)' : 
                          template === 'cyber' ? 'linear-gradient(135deg, #0a0a1a, #050510)' : 
                          'linear-gradient(135deg, #000010, #0a0a1f)'};
            color: #f0f0ff;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .linktree-container {
            width: 100%;
            max-width: 480px;
            text-align: center;
            animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 12px;
            background: ${templateConfig.gradient};
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .bio {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 40px;
            line-height: 1.6;
        }
        
        footer {
            margin-top: 40px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);
        }
    </style>
</head>
<body>
    <div class="linktree-container">
        <h1>${profile.name || 'Your Name'}</h1>
        
        <div class="bio">
            ${profile.bio || 'Short bio about yourself'}
        </div>
        
        <footer>
            Made with PixelLink Builder
        </footer>
    </div>
</body>
</html>`;
    }
    
    // ===== MUSIC TESTING =====
    
    async testMusic() {
        // Fix: Check if music is NOT enabled or track is NOT selected
        if (!this.state.music.enabled || !this.state.music.track) {
            Toast.show('Please enable music and select a track first', 'warning');
            return;
        }
        
        const track = APP_CONFIG.musicTracks[this.state.music.track];
        if (!track) {
            Toast.show('No track selected', 'warning');
            return;
        }
        
        const audio = this.elements.testAudio;
        if (!audio) {
            Toast.show('Audio element not found', 'error');
            return;
        }
        
        audio.src = track.url;
        audio.volume = this.state.music.volume / 100;
        
        try {
            await audio.play();
            Toast.show(`Playing ${track.name}`, 'success');
            
            // Add visual feedback
            const btn = this.elements.testMusicBtn;
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-pause"></i> Stop Test';
            btn.classList.add('btn-success');
            
            // Reset button when audio ends
            audio.onended = () => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('btn-success');
            };
            
            // Also reset on pause
            audio.onpause = () => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('btn-success');
            };
            
        } catch (error) {
            console.error('Music playback failed:', error);
            Toast.show('Click anywhere on page first, then try again', 'error');
        }
    }
    
    // ===== RESET FUNCTION =====
    
    async resetAll() {
        // Confirm reset
        if (!confirm('Are you sure you want to reset everything? This action cannot be undone.')) {
            return;
        }
        
        // Reset state
        this.state.reset();
        
        // Reset form fields
        if (this.elements.nameInput) this.elements.nameInput.value = '';
        if (this.elements.bioInput) this.elements.bioInput.value = '';
        if (this.elements.avatarUrl) this.elements.avatarUrl.value = '';
        
        // Reset avatar upload
        if (this.elements.avatarUploadInput) this.elements.avatarUploadInput.value = '';
        if (this.elements.previewUpload) this.elements.previewUpload.classList.add('hidden');
        if (this.elements.uploadArea) this.elements.uploadArea.style.display = 'block';
        
        // Reset avatar tabs
        this.handleAvatarTabSwitch('url');
        
        // Reset template
        if (this.elements.templateOptions) {
            this.elements.templateOptions.forEach(opt => {
                opt.classList.remove('active');
            });
            const pixelTemplate = document.querySelector('.template-option[data-template="pixel"]');
            if (pixelTemplate) pixelTemplate.classList.add('active');
        }
        
        // Reset music
        if (this.elements.musicToggle) this.elements.musicToggle.checked = false;
        if (this.elements.musicOptions) this.elements.musicOptions.classList.add('hidden');
        if (this.elements.musicSelect) this.elements.musicSelect.value = '';
        if (this.elements.volumeSlider) this.elements.volumeSlider.value = '50';
        if (this.elements.volumeValue) this.elements.volumeValue.textContent = '50%';
        
        // Reset device
        if (this.elements.previewModeBtns) {
            this.elements.previewModeBtns.forEach(btn => {
                btn.classList.remove('active');
            });
            const desktopBtn = document.querySelector('.preview-mode-btn[data-mode="desktop"]');
            if (desktopBtn) desktopBtn.classList.add('active');
        }
        
        if (this.elements.previewWrapper) {
            this.elements.previewWrapper.classList.remove('desktop', 'mobile');
            this.elements.previewWrapper.classList.add('desktop');
        }
        
        // Clear dynamic items
        this.loadDynamicItems();
        
        // Stop music
        if (this.elements.testAudio) {
            this.elements.testAudio.pause();
            this.elements.testAudio.currentTime = 0;
            this.elements.testAudio.src = '';
        }
        
        // Update preview
        await this.updatePreview();
        
        // Show success message
        Toast.show('All data has been reset!', 'success');
    }
    
    // ===== UTILITY FUNCTIONS =====
    
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Read file as data URL
    readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }
    
    // Handle keyboard shortcuts
    handleKeyboardShortcuts(event) {
        // Cmd/Ctrl + S to save
        if ((event.metaKey || event.ctrlKey) && event.key === 's') {
            event.preventDefault();
            this.state.save();
            Toast.show('Progress saved', 'success');
        }
        
        // Cmd/Ctrl + D to duplicate last item
        if ((event.metaKey || event.ctrlKey) && event.key === 'd') {
            event.preventDefault();
            this.duplicateLastItem();
        }
        
        // Escape to close tooltips
        if (event.key === 'Escape' && this.currentTooltip) {
            Tooltip.hide(this.currentTooltip);
            this.currentTooltip = null;
        }
    }
    
    // Duplicate last item
    duplicateLastItem() {
        const socialsCount = this.state.socials.length;
        const linksCount = this.state.links.length;
        
        if (socialsCount > 0) {
            const lastSocial = this.state.socials[socialsCount - 1];
            this.addSocialItem({...lastSocial});
            Toast.show('Last social link duplicated', 'info');
        } else if (linksCount > 0) {
            const lastLink = this.state.links[linksCount - 1];
            this.addLinkItem({...lastLink});
            Toast.show('Last link duplicated', 'info');
        } else {
            Toast.show('No items to duplicate', 'warning');
        }
    }
}

// ===== INITIALIZE APPLICATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance
    window.pixelLinkBuilder = new PixelLinkBuilder();
    
    // Initialize with animation
    setTimeout(() => {
        window.pixelLinkBuilder.init();
    }, 100);
});

// ===== GLOBAL EXPORTS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PixelLinkBuilder,
        AppState,
        AnimationController,
        Toast,
        Tooltip
    };
}