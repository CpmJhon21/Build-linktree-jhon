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
            name: 'Chill Beats',
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
            nameInput: document.getElementById('name-input'),
            bioInput: document.getElementById('bio-input'),
            avatarUrl: document.getElementById('avatar-url'),
            avatarUpload: document.getElementById('avatar-upload'),
            clearAvatar: document.getElementById('clear-avatar'),
            
            // Template
            templateOptions: document.querySelectorAll('.template-option'),
            
            // Music
            musicToggle: document.getElementById('music-toggle'),
            musicOptions: document.getElementById('music-options'),
            musicSelect: document.getElementById('music-select'),
            volumeSlider: document.getElementById('volume-slider'),
            volumeValue: document.getElementById('volume-value'),
            testMusicBtn: document.getElementById('test-music-btn'),
            
            // Social Links
            socialsList: document.getElementById('socials-list'),
            addSocialBtn: document.getElementById('add-social-btn'),
            
            // Custom Links
            linksList: document.getElementById('links-list'),
            addLinkBtn: document.getElementById('add-link-btn'),
            
            // Preview
            deviceTabs: document.querySelectorAll('.device-tab'),
            deviceScreen: document.getElementById('device-screen'),
            previewContent: document.getElementById('preview-content'),
            skeletonLoader: document.getElementById('skeleton-loader'),
            
            // Export
            copyBtn: document.getElementById('copy-html-btn'),
            downloadBtn: document.getElementById('download-btn'),
            exportBtn: document.getElementById('export-btn'),
            
            // Actions
            resetBtn: document.getElementById('reset-btn'),
            
            // Audio
            testAudio: document.getElementById('test-audio')
        };
    }
    
    // Initialize UI components
    async initUI() {
        // Animate container entrance
        await AnimationController.animate(
            document.querySelector('.app-container'),
            'containerEnter',
            APP_CONFIG.animations.duration.slower
        );
        
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
        
        // Template
        if (el.templateOptions) {
            el.templateOptions.forEach(option => {
                option.classList.toggle('selected', option.dataset.template === template);
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
        if (el.deviceTabs) {
            el.deviceTabs.forEach(tab => {
                tab.classList.toggle('active', tab.dataset.device === preview.device);
            });
        }
        
        if (el.deviceScreen) {
            el.deviceScreen.className = 'device-screen';
            el.deviceScreen.classList.add(preview.device);
        }
        
        // Load dynamic items
        this.loadDynamicItems();
    }
    
    // Setup event listeners
    setupEventListeners() {
        const el = this.elements;
        
        // Profile inputs
        el.nameInput?.addEventListener('input', this.debounce((e) => {
            this.state.profile.name = e.target.value;
            this.state.save();
            this.updatePreview();
        }, APP_CONFIG.previewUpdateDelay));
        
        el.bioInput?.addEventListener('input', this.debounce((e) => {
            this.state.profile.bio = e.target.value;
            this.state.save();
            this.updatePreview();
        }, APP_CONFIG.previewUpdateDelay));
        
        el.avatarUrl?.addEventListener('input', this.debounce((e) => {
            if (this.state.profile.avatarType === 'url') {
                this.state.profile.avatar = e.target.value;
                this.state.save();
                this.updatePreview();
            }
        }, APP_CONFIG.previewUpdateDelay));
        
        el.avatarUpload?.addEventListener('change', (e) => this.handleAvatarUpload(e));
        el.clearAvatar?.addEventListener('click', () => this.clearAvatar());
        
        // Template selection
        el.templateOptions?.forEach(option => {
            option.addEventListener('click', () => this.handleTemplateSelect(option));
        });
        
        // Music controls
        el.musicToggle?.addEventListener('change', (e) => this.handleMusicToggle(e));
        el.musicSelect?.addEventListener('change', (e) => this.handleMusicSelect(e));
        el.volumeSlider?.addEventListener('input', (e) => this.handleVolumeChange(e));
        el.testMusicBtn?.addEventListener('click', () => this.testMusic());
        
        // Device tabs
        el.deviceTabs?.forEach(tab => {
            tab.addEventListener('click', () => this.handleDeviceSwitch(tab));
        });
        
        // Social links
        el.addSocialBtn?.addEventListener('click', () => this.addSocialItem());
        
        // Custom links
        el.addLinkBtn?.addEventListener('click', () => this.addLinkItem());
        
        // Export buttons
        el.copyBtn?.addEventListener('click', () => this.copyHTML());
        el.downloadBtn?.addEventListener('click', () => this.downloadHTML());
        el.exportBtn?.addEventListener('click', () => this.downloadHTML());
        
        // Reset button
        el.resetBtn?.addEventListener('click', () => this.resetAll());
        
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
            
            // Add spring animation to avatar preview
            const previewImg = document.querySelector('.avatar-preview img');
            if (previewImg) {
                previewImg.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    previewImg.style.transition = `transform ${APP_CONFIG.animations.duration.normal}ms ${APP_CONFIG.animations.easing}`;
                    previewImg.style.transform = 'scale(1)';
                }, 100);
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
        this.elements.avatarUrl.value = '';
        this.elements.avatarUpload.value = '';
        this.state.save();
        this.updatePreview();
        Toast.show('Avatar cleared', 'info');
    }
    
    // Template selection handler
    async handleTemplateSelect(option) {
        const template = option.dataset.template;
        
        // Update UI with animation
        this.elements.templateOptions.forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
        
        // Spring animation on selected template
        await AnimationController.animate(
            option,
            'fadeSlideUp',
            APP_CONFIG.animations.duration.normal
        );
        
        // Update state and preview with crossfade
        this.state.template = template;
        this.state.save();
        await this.updatePreviewWithTransition();
    }
    
    // Music toggle handler
    handleMusicToggle(event) {
        const enabled = event.target.checked;
        this.state.music.enabled = enabled;
        
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
        this.elements.volumeValue.textContent = `${value}%`;
        this.state.save();
        this.updatePreview();
    }
    
    // Device switch handler
    async handleDeviceSwitch(tab) {
        const device = tab.dataset.device;
        
        // Update UI
        this.elements.deviceTabs.forEach(t => t.classList.remove('active'));
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
        this.elements.deviceScreen.style.transform = 'scale(0.98)';
        this.elements.deviceScreen.classList.remove('desktop', 'mobile');
        this.elements.deviceScreen.classList.add(device);
        
        setTimeout(() => {
            this.elements.deviceScreen.style.transition = `transform ${APP_CONFIG.animations.duration.normal}ms ${APP_CONFIG.animations.easing}`;
            this.elements.deviceScreen.style.transform = 'scale(1)';
        }, 10);
        
        this.state.save();
    }
    
    // ===== DYNAMIC ITEMS MANAGEMENT =====
    
    // Load dynamic items from state
    loadDynamicItems() {
        // Clear existing items
        while (this.elements.socialsList.firstChild) {
            this.elements.socialsList.removeChild(this.elements.socialsList.firstChild);
        }
        while (this.elements.linksList.firstChild) {
            this.elements.linksList.removeChild(this.elements.linksList.firstChild);
        }
        
        // Add social items
        if (this.state.socials.length > 0) {
            this.state.socials.forEach(social => {
                this.addSocialItem(social);
            });
        } else {
            this.addSocialItem();
        }
        
        // Add link items
        if (this.state.links.length > 0) {
            this.state.links.forEach(link => {
                this.addLinkItem(link);
            });
        } else {
            this.addLinkItem();
        }
    }
    
    // Add social item
    addSocialItem(data = null) {
        const container = this.elements.socialsList;
        const index = container.children.length;
        
        const item = document.createElement('div');
        item.className = 'dynamic-item';
        item.dataset.index = index;
        
        const platforms = APP_CONFIG.socialPlatforms.map(p => 
            `<option value="${p.id}">${p.name}</option>`
        ).join('');
        
        item.innerHTML = `
            <div class="dynamic-item-header">
                <div class="input-wrapper flex-1">
                    <select class="input-field select-field social-platform" data-tooltip="Select social platform">
                        <option value="">Select Platform</option>
                        ${platforms}
                    </select>
                </div>
                <button class="btn btn-icon remove-btn" data-tooltip="Remove this link">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="input-wrapper">
                <input type="text" class="input-field social-url" 
                       placeholder="https://example.com/username"
                       data-tooltip="Enter your profile URL">
            </div>
        `;
        
        container.appendChild(item);
        
        // Set data if provided
        if (data) {
            item.querySelector('.social-platform').value = data.platform || '';
            item.querySelector('.social-url').value = data.url || '';
        }
        
        // Add event listeners
        const platformSelect = item.querySelector('.social-platform');
        const urlInput = item.querySelector('.social-url');
        const removeBtn = item.querySelector('.remove-btn');
        
        platformSelect.addEventListener('change', () => {
            this.updateSocialItem(index, platformSelect.value, urlInput.value);
        });
        
        urlInput.addEventListener('input', this.debounce(() => {
            this.updateSocialItem(index, platformSelect.value, urlInput.value);
        }, APP_CONFIG.previewUpdateDelay));
        
        removeBtn.addEventListener('click', () => {
            this.removeSocialItem(index);
        });
        
        // Animate in with spring effect
        AnimationController.animate(item, 'slideIn', APP_CONFIG.animations.duration.normal);
        
        // Update state
        if (data) {
            this.state.socials[index] = data;
        } else {
            this.state.socials[index] = { platform: '', url: '' };
        }
        
        this.state.save();
        this.updatePreview();
        
        // Scroll to new item with smooth behavior
        setTimeout(() => {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
        return item;
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
        const item = document.querySelector(`#socials-list .dynamic-item[data-index="${index}"]`);
        
        if (item && this.state.socials.length > 1) {
            // Animate out
            item.classList.add('removing');
            
            await AnimationController.animate(
                item,
                'slideOut',
                APP_CONFIG.animations.duration.normal
            );
            
            item.remove();
            
            // Update indices
            document.querySelectorAll('#socials-list .dynamic-item').forEach((el, i) => {
                el.dataset.index = i;
            });
            
            // Update state
            this.state.socials.splice(index, 1);
            this.state.save();
            this.updatePreview();
            
            Toast.show('Social link removed', 'info');
        } else {
            // Shake animation for last item
            if (item) {
                await AnimationController.animate(item, 'shake', APP_CONFIG.animations.duration.fast);
                Toast.show('At least one social link is required', 'warning');
            }
        }
    }
    
    // Add link item
    addLinkItem(data = null) {
        const container = this.elements.linksList;
        const index = container.children.length;
        
        const item = document.createElement('div');
        item.className = 'dynamic-item';
        item.dataset.index = index;
        
        item.innerHTML = `
            <div class="dynamic-item-header">
                <div class="input-wrapper flex-1">
                    <input type="text" class="input-field link-text" 
                           placeholder="Link text (e.g., Portfolio)"
                           data-tooltip="Enter link display text">
                </div>
                <button class="btn btn-icon remove-btn" data-tooltip="Remove this link">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="input-wrapper">
                <input type="text" class="input-field link-url" 
                       placeholder="https://example.com"
                       data-tooltip="Enter destination URL">
            </div>
        `;
        
        container.appendChild(item);
        
        // Set data if provided
        if (data) {
            item.querySelector('.link-text').value = data.text || '';
            item.querySelector('.link-url').value = data.url || '';
        }
        
        // Add event listeners
        const textInput = item.querySelector('.link-text');
        const urlInput = item.querySelector('.link-url');
        const removeBtn = item.querySelector('.remove-btn');
        
        textInput.addEventListener('input', this.debounce(() => {
            this.updateLinkItem(index, textInput.value, urlInput.value);
        }, APP_CONFIG.previewUpdateDelay));
        
        urlInput.addEventListener('input', this.debounce(() => {
            this.updateLinkItem(index, textInput.value, urlInput.value);
        }, APP_CONFIG.previewUpdateDelay));
        
        removeBtn.addEventListener('click', () => {
            this.removeLinkItem(index);
        });
        
        // Animate in
        AnimationController.animate(item, 'slideIn', APP_CONFIG.animations.duration.normal);
        
        // Update state
        if (data) {
            this.state.links[index] = data;
        } else {
            this.state.links[index] = { text: '', url: '' };
        }
        
        this.state.save();
        this.updatePreview();
        
        // Scroll to new item
        setTimeout(() => {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
        return item;
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
        const item = document.querySelector(`#links-list .dynamic-item[data-index="${index}"]`);
        
        if (item && this.state.links.length > 1) {
            // Animate out
            item.classList.add('removing');
            
            await AnimationController.animate(
                item,
                'slideOut',
                APP_CONFIG.animations.duration.normal
            );
            
            item.remove();
            
            // Update indices
            document.querySelectorAll('#links-list .dynamic-item').forEach((el, i) => {
                el.dataset.index = i;
            });
            
            // Update state
            this.state.links.splice(index, 1);
            this.state.save();
            this.updatePreview();
            
            Toast.show('Link removed', 'info');
        } else {
            // Shake animation for last item
            if (item) {
                await AnimationController.animate(item, 'shake', APP_CONFIG.animations.duration.fast);
                Toast.show('At least one link is required', 'warning');
            }
        }
    }
    
    // ===== PREVIEW SYSTEM =====
    
    // Update preview with smooth transition
    async updatePreviewWithTransition() {
        const previewContent = this.elements.previewContent;
        const skeletonLoader = this.elements.skeletonLoader;
        
        // Show loading state
        previewContent.classList.add('loading');
        skeletonLoader.style.display = 'block';
        
        // Wait for transition
        await new Promise(resolve => setTimeout(resolve, APP_CONFIG.animations.duration.slow));
        
        // Generate new preview
        const html = this.generatePreviewHTML();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Crossfade animation
        await AnimationController.crossfade(
            previewContent,
            tempDiv.firstChild,
            APP_CONFIG.animations.duration.slow
        );
        
        // Replace content
        previewContent.innerHTML = html;
        previewContent.classList.remove('loading');
        skeletonLoader.style.display = 'none';
        
        // Add fade in animation
        await AnimationController.animate(
            previewContent,
            'fadeSlideUp',
            APP_CONFIG.animations.duration.normal
        );
    }
    
    // Update preview
    async updatePreview() {
        const previewContent = this.elements.previewContent;
        const skeletonLoader = this.elements.skeletonLoader;
        
        // Show loading state
        this.state.preview.isLoading = true;
        previewContent.classList.add('loading');
        skeletonLoader.style.display = 'block';
        
        // Small delay for smoothness
        await new Promise(resolve => setTimeout(resolve, APP_CONFIG.previewUpdateDelay));
        
        // Generate new preview
        const html = this.generatePreviewHTML();
        previewContent.innerHTML = html;
        
        // Hide loader and show content
        skeletonLoader.style.display = 'none';
        previewContent.classList.remove('loading');
        
        // Add fade in animation
        await AnimationController.animate(
            previewContent,
            'fadeSlideUp',
            APP_CONFIG.animations.duration.normal
        );
        
        this.state.preview.isLoading = false;
    }
    
    // Generate preview HTML
    generatePreviewHTML() {
        const { profile, template, socials, links } = this.state;
        const filteredSocials = socials.filter(s => s.platform && s.platform.trim() !== '');
        const filteredLinks = links.filter(l => (l.text || l.url) && (l.text.trim() !== '' || l.url.trim() !== ''));
        
        // Template configuration
        const templateConfig = APP_CONFIG.templates[template];
        
        // Platform icons
        const iconMap = {};
        APP_CONFIG.socialPlatforms.forEach(platform => {
            iconMap[platform.id] = platform.icon;
        });
        
        // Generate social links HTML
        const socialLinksHTML = filteredSocials.length > 0 ? `
            <div class="social-links" style="
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 12px;
                margin-bottom: 32px;
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
                                transition: all 0.3s ${APP_CONFIG.animations.easing};
                           "
                           onmouseover="this.style.transform='translateY(-4px)'; this.style.background='${templateConfig.color}';"
                           onmouseout="this.style.transform=''; this.style.background='';">
                            <i class="${platform?.icon || 'fas fa-link'}"></i>
                        </a>
                    `;
                }).join('')}
            </div>
        ` : '';
        
        // Generate custom links HTML
        const customLinksHTML = filteredLinks.length > 0 ? `
            <div class="links-container" style="
                display: flex;
                flex-direction: column;
                gap: 12px;
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
                            transition: all 0.3s ${APP_CONFIG.animations.easing};
                            border: none;
                       "
                       onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.2)';"
                       onmouseout="this.style.transform=''; this.style.boxShadow='';">
                        ${link.text || 'Link'}
                    </a>
                `).join('')}
            </div>
        ` : '';
        
        return `
            <div style="
                background: ${template === 'pixel' ? 'linear-gradient(135deg, #0a0a1a, #050510)' : 
                              template === 'cyber' ? 'linear-gradient(135deg, #0a0a1a, #050510)' : 
                              'linear-gradient(135deg, #000010, #0a0a1f)'};
                color: #f0f0ff;
                min-height: 100%;
                padding: 40px 24px;
                font-family: 'Poppins', sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
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
                    
                    <p style="
                        text-align: center;
                        color: rgba(255, 255, 255, 0.8);
                        margin-bottom: 32px;
                        line-height: 1.6;
                        font-size: 16px;
                    ">
                        ${profile.bio || 'Short bio about yourself'}
                    </p>
                    
                    ${socialLinksHTML}
                    ${customLinksHTML}
                    
                    ${filteredSocials.length === 0 && filteredLinks.length === 0 ? `
                        <div style="
                            text-align: center;
                            padding: 40px;
                            color: rgba(255, 255, 255, 0.5);
                            border: 2px dashed rgba(255, 255, 255, 0.1);
                            border-radius: 12px;
                            margin-top: 20px;
                        ">
                            <i class="fas fa-plus-circle" style="font-size: 32px; margin-bottom: 12px;"></i>
                            <p style="margin: 0; font-size: 14px;">Add social links or custom links</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    // ===== EXPORT FUNCTIONS =====
    
    // Copy HTML to clipboard
    async copyHTML() {
        try {
            const html = this.generateExportHTML();
            await navigator.clipboard.writeText(html);
            
            // Success animation
            const btn = this.elements.copyBtn;
            const originalHTML = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
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
            const html = this.generateExportHTML();
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
    
    // Generate export HTML
    generateExportHTML() {
        const { profile, template, socials, links, music } = this.state;
        const filteredSocials = socials.filter(s => s.platform && s.platform.trim() !== '');
        const filteredLinks = links.filter(l => (l.text || l.url) && (l.text.trim() !== '' || l.url.trim() !== ''));
        
        const templateConfig = APP_CONFIG.templates[template];
        const musicTrack = APP_CONFIG.musicTracks[music.track];
        
        // Platform icons mapping for export
        const iconMap = {};
        APP_CONFIG.socialPlatforms.forEach(platform => {
            iconMap[platform.id] = platform.icon;
        });
        
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
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 40px 24px;
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
        
        .avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            margin: 0 auto 24px;
            border: 3px solid ${templateConfig.color};
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
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
        
        .social-links {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 40px;
        }
        
        .social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            color: #f0f0ff;
            font-size: 20px;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .social-link:hover {
            transform: translateY(-4px);
            background: ${templateConfig.color};
            color: #000;
        }
        
        .links-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .link-btn {
            display: block;
            padding: 16px 24px;
            background: ${templateConfig.gradient};
            color: ${template === 'pixel' ? '#0a0a1a' : 'white'};
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            border: none;
        }
        
        .link-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }
        
        .music-controls {
            margin-top: 32px;
            padding-top: 32px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .music-toggle {
            background: none;
            border: none;
            color: ${templateConfig.color};
            font-size: 24px;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .music-toggle:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: scale(1.1);
        }
        
        footer {
            margin-top: 40px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);
        }
        
        @media (max-width: 480px) {
            .linktree-container {
                padding: 32px 20px;
            }
            
            .avatar {
                width: 100px;
                height: 100px;
            }
            
            h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="linktree-container">
        ${profile.avatar ? `<img src="${profile.avatar}" alt="${profile.name || 'Profile'}" class="avatar">` : ''}
        
        <h1>${profile.name || 'Your Name'}</h1>
        
        <div class="bio">
            ${profile.bio || 'Short bio about yourself'}
        </div>
        
        ${filteredSocials.length > 0 ? `
        <div class="social-links">
            ${filteredSocials.map(social => {
                const platform = APP_CONFIG.socialPlatforms.find(p => p.id === social.platform);
                return `
                    <a href="${social.url || '#'}" class="social-link" target="_blank" rel="noopener">
                        <i class="${platform?.icon || 'fas fa-link'}"></i>
                    </a>
                `;
            }).join('')}
        </div>
        ` : ''}
        
        ${filteredLinks.length > 0 ? `
        <div class="links-container">
            ${filteredLinks.map(link => `
                <a href="${link.url || '#'}" class="link-btn" target="_blank" rel="noopener">
                    ${link.text || 'Link'}
                </a>
            `).join('')}
        </div>
        ` : ''}
        
        ${music.enabled && musicTrack ? `
        <div class="music-controls">
            <button class="music-toggle" id="music-toggle" aria-label="Toggle music">
                <i class="fas fa-play"></i>
            </button>
            <input type="range" id="volume-control" min="0" max="100" value="${music.volume}" 
                   style="width: 100px; margin-left: 16px; vertical-align: middle;">
        </div>
        ` : ''}
        
        <footer>
            Made with PixelLink Builder
        </footer>
    </div>
    
    ${music.enabled && musicTrack ? `
    <audio id="background-music" loop preload="auto">
        <source src="${musicTrack.url}" type="audio/mpeg">
    </audio>
    
    <script>
        const music = document.getElementById('background-music');
        const toggleBtn = document.getElementById('music-toggle');
        const volumeControl = document.getElementById('volume-control');
        
        // Set initial volume
        music.volume = ${music.volume / 100};
        
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
                // Autoplay started, unmute on user interaction
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
        document.querySelectorAll('.social-link, .link-btn').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = this.classList.contains('social-link') 
                    ? 'translateY(-4px)' 
                    : 'translateY(-2px)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    </script>
</body>
</html>`;
    }
    
    // ===== MUSIC TESTING =====
    
    async testMusic() {
        if (!this.state.music.enabled || !this.state.music.track) {
            Toast.show('Please enable music and select a track first', 'warning');
            return;
        }
        
        const track = APP_CONFIG.musicTracks[this.state.music.track];
        if (!track) return;
        
        const audio = this.elements.testAudio;
        audio.src = track.url;
        audio.volume = this.state.music.volume / 100;
        
        try {
            await audio.play();
            Toast.show(`Playing ${track.name}`, 'success');
            
            // Add visual feedback
            this.elements.testMusicBtn.innerHTML = '<i class="fas fa-pause"></i><span>Playing...</span>';
            this.elements.testMusicBtn.classList.add('btn-success');
            
            // Reset button after track ends
            audio.onended = () => {
                this.elements.testMusicBtn.innerHTML = '<i class="fas fa-play"></i><span>Test Music</span>';
                this.elements.testMusicBtn.classList.remove('btn-success');
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
        this.elements.nameInput.value = '';
        this.elements.bioInput.value = '';
        this.elements.avatarUrl.value = '';
        this.elements.avatarUpload.value = '';
        
        // Reset template
        this.elements.templateOptions.forEach(opt => {
            opt.classList.remove('selected');
        });
        document.querySelector('.template-option[data-template="pixel"]').classList.add('selected');
        
        // Reset music
        this.elements.musicToggle.checked = false;
        this.elements.musicOptions.classList.add('hidden');
        this.elements.musicSelect.value = '';
        this.elements.volumeSlider.value = '50';
        this.elements.volumeValue.textContent = '50%';
        
        // Reset device
        this.elements.deviceTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector('.device-tab[data-device="desktop"]').classList.add('active');
        this.elements.deviceScreen.className = 'device-screen desktop';
        
        // Clear dynamic items
        this.loadDynamicItems();
        
        // Stop music
        this.elements.testAudio.pause();
        this.elements.testAudio.currentTime = 0;
        
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