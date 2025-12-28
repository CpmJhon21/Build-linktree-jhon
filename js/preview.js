// =============================================
// PIXELLINK BUILDER - Preview Page
// Apple-Raycast Style Preview Controller
// =============================================

class PreviewController {
    constructor() {
        this.state = null;
        this.elements = {};
        this.isLoading = false;
    }
    
    // Initialize preview page
    async init() {
        console.log('🚀 Initializing Preview Page...');
        
        // Cache elements
        this.cacheElements();
        
        // Load data from localStorage
        this.loadData();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Render preview
        await this.renderPreview();
        
        console.log('✅ Preview Page ready!');
    }
    
    // Cache DOM elements
    cacheElements() {
        this.elements = {
            previewContainer: document.getElementById('linktree-preview'),
            backButton: document.querySelector('.preview-back'),
            loadingIndicator: document.querySelector('.loading-indicator')
        };
    }
    
    // Load data from localStorage
    loadData() {
        try {
            const savedData = localStorage.getItem('pixellink_apple_v2');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.state = {
                    profile: data.profile || {},
                    template: data.template || 'pixel',
                    socials: data.socials || [],
                    links: data.links || [],
                    music: data.music || {},
                    version: data.version
                };
                return true;
            }
        } catch (error) {
            console.error('Failed to load preview data:', error);
        }
        
        // No data found
        this.state = null;
        return false;
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Back button
        if (this.elements.backButton) {
            this.elements.backButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleBackButton();
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || (e.key === 'b' && (e.metaKey || e.ctrlKey))) {
                e.preventDefault();
                this.handleBackButton();
            }
        });
        
        // Page visibility
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.loadData();
                this.renderPreview();
            }
        });
    }
    
    // Handle back button
    handleBackButton() {
        // Add fade out animation
        document.body.style.opacity = '0.8';
        document.body.style.transition = 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 300);
    }
    
    // Render preview with animation
    async renderPreview() {
        if (!this.elements.previewContainer) return;
        
        if (!this.state) {
            this.showNoDataMessage();
            return;
        }
        
        // Show loading state
        this.showLoading();
        
        // Generate preview HTML
        const html = this.generatePreviewHTML();
        
        // Create temporary container for crossfade animation
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const newContent = tempDiv.firstChild;
        
        // Add fade in animation
        newContent.style.opacity = '0';
        newContent.style.transform = 'translateY(20px)';
        
        // Replace content with animation
        this.elements.previewContainer.innerHTML = '';
        this.elements.previewContainer.appendChild(newContent);
        
        // Animate in
        setTimeout(() => {
            newContent.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            newContent.style.opacity = '1';
            newContent.style.transform = 'translateY(0)';
            
            // Hide loading
            this.hideLoading();
        }, 50);
        
        // Add interactivity to links
        this.addPreviewInteractivity();
    }
    
    // Generate preview HTML
    generatePreviewHTML() {
        const { profile, template, socials, links } = this.state;
        const filteredSocials = socials.filter(s => s.platform && s.platform.trim() !== '');
        const filteredLinks = links.filter(l => (l.text || l.url) && (l.text.trim() !== '' || l.url.trim() !== ''));
        
        // Template configuration
        const templateConfig = this.getTemplateConfig(template);
        
        // Platform icons
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
        
        // Generate social links HTML
        const socialLinksHTML = filteredSocials.length > 0 ? `
            <div class="social-links" style="
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 16px;
                margin-bottom: 40px;
            ">
                ${filteredSocials.map(social => {
                    const icon = platformIcons[social.platform] || 'fas fa-link';
                    return `
                        <a href="${social.url || '#'}" 
                           class="social-link"
                           style="
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                width: 56px;
                                height: 56px;
                                border-radius: 50%;
                                background: rgba(255, 255, 255, 0.1);
                                color: white;
                                font-size: 24px;
                                text-decoration: none;
                                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                                position: relative;
                                overflow: hidden;
                           "
                           onmouseenter="this.style.transform='translateY(-6px) scale(1.1)'; this.style.background='${templateConfig.color}';"
                           onmouseleave="this.style.transform='translateY(0) scale(1)'; this.style.background='rgba(255, 255, 255, 0.1)';"
                           target="_blank"
                           rel="noopener noreferrer">
                            <i class="${icon}"></i>
                            <span style="
                                position: absolute;
                                bottom: -24px;
                                left: 50%;
                                transform: translateX(-50%);
                                font-size: 11px;
                                opacity: 0;
                                transition: opacity 0.3s ease;
                                white-space: nowrap;
                                background: rgba(0,0,0,0.8);
                                padding: 2px 6px;
                                border-radius: 4px;
                                color: white;
                            ">${social.platform}</span>
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
                gap: 16px;
            ">
                ${filteredLinks.map((link, index) => `
                    <a href="${link.url || '#'}" 
                       class="link-btn"
                       style="
                            display: block;
                            padding: 18px 28px;
                            background: ${templateConfig.gradient};
                            color: ${template === 'pixel' ? '#0a0a1a' : 'white'};
                            text-decoration: none;
                            border-radius: 14px;
                            font-weight: 600;
                            font-size: 17px;
                            text-align: center;
                            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                            border: none;
                            position: relative;
                            overflow: hidden;
                       "
                       onmouseenter="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 32px rgba(0,0,0,0.3)';"
                       onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='none';"
                       target="_blank"
                       rel="noopener noreferrer">
                        ${link.text || 'Link'}
                        <span style="
                            position: absolute;
                            right: 16px;
                            top: 50%;
                            transform: translateY(-50%);
                            opacity: 0.7;
                            font-size: 14px;
                        ">
                            <i class="fas fa-external-link-alt"></i>
                        </span>
                    </a>
                `).join('')}
            </div>
        ` : '';
        
        return `
            <div class="preview-content" style="
                background: ${template === 'pixel' ? 'linear-gradient(135deg, #0a0a1a, #050510)' : 
                              template === 'cyber' ? 'linear-gradient(135deg, #0a0a1a, #050510)' : 
                              'linear-gradient(135deg, #000010, #0a0a1f)'};
                color: #f0f0ff;
                min-height: 100vh;
                padding: 60px 24px;
                font-family: 'Poppins', sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <div class="preview-card" style="
                    width: 100%;
                    max-width: 500px;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 28px;
                    padding: 48px 32px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    position: relative;
                    overflow: hidden;
                ">
                    <!-- Decorative elements -->
                    <div style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 4px;
                        background: ${templateConfig.gradient};
                    "></div>
                    
                    <div style="
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        color: rgba(255, 255, 255, 0.1);
                        font-size: 12px;
                        font-weight: 500;
                    ">
                        <i class="fas fa-link"></i> PixelLink
                    </div>
                    
                    ${profile.avatar ? `
                        <div style="text-align: center; margin-bottom: 32px;">
                            <img src="${profile.avatar}" 
                                 alt="${profile.name || 'Profile'}"
                                 style="
                                    width: 140px;
                                    height: 140px;
                                    border-radius: 50%;
                                    object-fit: cover;
                                    border: 4px solid ${templateConfig.color};
                                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                                    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                                 "
                                 onmouseenter="this.style.transform='scale(1.05) rotate(5deg)';"
                                 onmouseleave="this.style.transform='scale(1) rotate(0deg)';">
                        </div>
                    ` : `
                        <div style="
                            width: 140px;
                            height: 140px;
                            border-radius: 50%;
                            background: ${templateConfig.gradient};
                            margin: 0 auto 32px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-size: 48px;
                            border: 4px solid ${templateConfig.color};
                        ">
                            <i class="fas fa-user"></i>
                        </div>
                    `}
                    
                    <h1 style="
                        font-size: 32px;
                        font-weight: 700;
                        text-align: center;
                        margin-bottom: 16px;
                        color: ${templateConfig.color};
                        background: ${templateConfig.gradient};
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        letter-spacing: -0.5px;
                    ">
                        ${profile.name || 'Your Name'}
                    </h1>
                    
                    <p style="
                        text-align: center;
                        color: rgba(255, 255, 255, 0.8);
                        margin-bottom: 48px;
                        line-height: 1.7;
                        font-size: 17px;
                        padding: 0 20px;
                    ">
                        ${profile.bio || 'Short bio about yourself. Edit this in the builder to add your own bio.'}
                    </p>
                    
                    ${socialLinksHTML}
                    ${customLinksHTML}
                    
                    ${filteredSocials.length === 0 && filteredLinks.length === 0 ? `
                        <div style="
                            text-align: center;
                            padding: 48px 24px;
                            color: rgba(255, 255, 255, 0.4);
                            border: 2px dashed rgba(255, 255, 255, 0.15);
                            border-radius: 16px;
                            margin-top: 24px;
                            transition: all 0.3s ease;
                        "
                        onmouseenter="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.color='rgba(255,255,255,0.6)';"
                        onmouseleave="this.style.borderColor='rgba(255,255,255,0.15)'; this.style.color='rgba(255,255,255,0.4)';">
                            <i class="fas fa-plus-circle" style="font-size: 40px; margin-bottom: 16px;"></i>
                            <p style="margin: 0; font-size: 15px;">Add social links or custom links in the builder</p>
                        </div>
                    ` : ''}
                    
                    <div style="
                        margin-top: 48px;
                        padding-top: 32px;
                        border-top: 1px solid rgba(255, 255, 255, 0.1);
                        text-align: center;
                        color: rgba(255, 255, 255, 0.4);
                        font-size: 13px;
                    ">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <i class="fas fa-bolt" style="color: ${templateConfig.color};"></i>
                            <span>Built with PixelLink Builder</span>
                        </div>
                        <div style="margin-top: 8px; font-size: 11px;">
                            Preview Mode • ${templateConfig.name} Template
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Get template configuration
    getTemplateConfig(template) {
        const templates = {
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
        };
        
        return templates[template] || templates.pixel;
    }
    
    // Add interactivity to preview elements
    addPreviewInteractivity() {
        // Add tooltips to social links
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                const tooltip = e.target.querySelector('span');
                if (tooltip) {
                    tooltip.style.opacity = '1';
                    tooltip.style.bottom = '-30px';
                }
            });
            
            link.addEventListener('mouseleave', (e) => {
                const tooltip = e.target.querySelector('span');
                if (tooltip) {
                    tooltip.style.opacity = '0';
                    tooltip.style.bottom = '-24px';
                }
            });
        });
        
        // Add click animations to links
        const allLinks = document.querySelectorAll('a');
        allLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') === '#') {
                    e.preventDefault();
                    
                    // Shake animation for empty links
                    link.style.transform = 'translateX(4px)';
                    setTimeout(() => {
                        link.style.transform = 'translateX(-4px)';
                        setTimeout(() => {
                            link.style.transform = 'translateX(0)';
                        }, 50);
                    }, 50);
                }
            });
        });
    }
    
    // Show loading state
    showLoading() {
        this.isLoading = true;
        
        if (this.elements.previewContainer) {
            this.elements.previewContainer.style.opacity = '0.5';
            this.elements.previewContainer.style.filter = 'blur(4px)';
            this.elements.previewContainer.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        }
        
        // Create loading indicator if not exists
        if (!this.elements.loadingIndicator) {
            const loader = document.createElement('div');
            loader.className = 'loading-indicator';
            loader.innerHTML = `
                <div style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    z-index: 1000;
                ">
                    <div style="
                        width: 48px;
                        height: 48px;
                        border: 3px solid rgba(255,255,255,0.1);
                        border-top: 3px solid #0a84ff;
                        border-radius: 50%;
                        animation: spin 1s cubic-bezier(0.16, 1, 0.3, 1) infinite;
                        margin: 0 auto 16px;
                    "></div>
                    <div style="
                        color: rgba(255,255,255,0.7);
                        font-size: 14px;
                        font-weight: 500;
                    ">Loading Preview...</div>
                </div>
            `;
            document.body.appendChild(loader);
            this.elements.loadingIndicator = loader;
        } else {
            this.elements.loadingIndicator.style.display = 'block';
        }
        
        // Add CSS for spin animation
        if (!document.querySelector('#spin-animation')) {
            const style = document.createElement('style');
            style.id = 'spin-animation';
            style.textContent = `
                @keyframes spin {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Hide loading state
    hideLoading() {
        this.isLoading = false;
        
        if (this.elements.previewContainer) {
            this.elements.previewContainer.style.opacity = '1';
            this.elements.previewContainer.style.filter = 'blur(0)';
        }
        
        if (this.elements.loadingIndicator) {
            this.elements.loadingIndicator.style.display = 'none';
        }
    }
    
    // Show no data message
    showNoDataMessage() {
        if (!this.elements.previewContainer) return;
        
        this.elements.previewContainer.innerHTML = `
            <div style="
                text-align: center;
                padding: 80px 24px;
                max-width: 400px;
                margin: 0 auto;
            ">
                <div style="
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #0a84ff, #9c6ce9);
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 24px;
                    color: white;
                    font-size: 32px;
                    animation: pulse 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
                ">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                
                <h2 style="
                    font-size: 24px;
                    font-weight: 600;
                    margin-bottom: 12px;
                    color: rgba(255,255,255,0.9);
                ">
                    No Preview Data
                </h2>
                
                <p style="
                    color: rgba(255,255,255,0.6);
                    margin-bottom: 32px;
                    line-height: 1.6;
                ">
                    Please go back to the builder and create your Linktree first.
                </p>
                
                <a href="index.html" style="
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #0a84ff, #9c6ce9);
                    color: white;
                    text-decoration: none;
                    border-radius: 12px;
                    font-weight: 500;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                "
                onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(10,132,255,0.3)';"
                onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                    <i class="fas fa-arrow-left"></i>
                    <span>Go to Builder</span>
                </a>
            </div>
        `;
        
        // Add pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== INITIALIZE PREVIEW PAGE =====
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance
    window.previewController = new PreviewController();
    
    // Initialize with slight delay for smoother transition
    setTimeout(() => {
        window.previewController.init();
    }, 200);
    
    // Add fade in animation to page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===== GLOBAL EXPORTS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PreviewController
    };
}