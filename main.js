/**
 * Linktree Builder Premium
 * Vanilla JavaScript Implementation
 * @version 2.0.0
 */

(function() {
    'use strict';
    
    // ==================== CONFIGURATION ====================
    const CONFIG = {
        DEFAULT_IMAGE: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
        DEFAULT_NAME: 'John Doe',
        DEFAULT_BIO: 'Digital Creator | Web Developer | Tech Enthusiast',
        DEFAULT_FOOTER: '© 2024 Your Brand. All rights reserved.',
        DEFAULT_TEMPLATE: '1'
    };
    
    // ==================== STATE MANAGEMENT ====================
    let state = {
        isLoading: false,
        currentTemplate: CONFIG.DEFAULT_TEMPLATE,
        hasPreview: false
    };
    
    // ==================== DOM ELEMENTS ====================
    const elements = {};
    
    // ==================== TEMPLATES DATA ====================
    const templates = {
        '1': {
            name: 'Pixel Modern',
            font: '"Press Start 2P", cursive',
            style: `
                body {
                    background: linear-gradient(45deg, #2b2b2b, #4a4a4a);
                    font-family: "Press Start 2P", cursive;
                }
                .linktree-container {
                    border: 4px solid #00ff88;
                    box-shadow: 0 0 20px #00ff88;
                }
                .linktree-btn {
                    background: #2b2b2b;
                    border: 2px solid #00ff88;
                    color: #00ff88;
                }
                .linktree-btn:hover {
                    background: #00ff88;
                    color: #2b2b2b;
                    transform: translateY(-2px);
                }
            `
        },
        '2': {
            name: 'Minimal Clean',
            font: '"Poppins", sans-serif',
            style: `
                body {
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    font-family: "Poppins", sans-serif;
                    color: #333;
                }
                .linktree-container {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }
                .linktree-btn {
                    background: white;
                    border: 1px solid #ddd;
                    color: #333;
                    transition: all 0.3s ease;
                }
                .linktree-btn:hover {
                    border-color: #667eea;
                    color: #667eea;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
            `
        },
        '3': {
            name: 'Cyber Neon',
            font: '"Poppins", sans-serif',
            style: `
                body {
                    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                    font-family: "Poppins", sans-serif;
                    color: white;
                }
                .linktree-container {
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(10px);
                    border: 2px solid #00dbde;
                    box-shadow: 0 0 30px rgba(0, 219, 222, 0.5);
                }
                .linktree-btn {
                    background: rgba(0, 219, 222, 0.1);
                    border: 2px solid #00dbde;
                    color: white;
                    position: relative;
                    overflow: hidden;
                }
                .linktree-btn:hover {
                    background: rgba(0, 219, 222, 0.3);
                    transform: translateY(-2px);
                    box-shadow: 0 0 20px rgba(0, 219, 222, 0.5);
                }
                .linktree-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: 0.5s;
                }
                .linktree-btn:hover::before {
                    left: 100%;
                }
            `
        }
    };
    
    // ==================== UTILITY FUNCTIONS ====================
    
    /**
     * Auto-detect icon based on URL or text
     * @param {string} url - The URL to check
     * @param {string} text - The text to check
     * @returns {string} Font Awesome icon class
     */
    function autoDetectIcon(url, text = '') {
        const urlLower = url.toLowerCase();
        const textLower = text.toLowerCase();
        
        const iconMap = [
            { keywords: ['youtube.com', 'youtube'], icon: 'fa-youtube' },
            { keywords: ['github.com', 'github'], icon: 'fa-github' },
            { keywords: ['instagram.com', 'instagram'], icon: 'fa-instagram' },
            { keywords: ['linkedin.com', 'linkedin'], icon: 'fa-linkedin' },
            { keywords: ['twitter.com', 'x.com', 'twitter'], icon: 'fa-x-twitter' },
            { keywords: ['facebook.com', 'facebook'], icon: 'fa-facebook' },
            { keywords: ['t.me', 'telegram'], icon: 'fa-telegram' },
            { keywords: ['discord.com', 'discord'], icon: 'fa-discord' },
            { keywords: ['spotify.com', 'spotify'], icon: 'fa-spotify' },
            { keywords: ['whatsapp', 'wa.me'], icon: 'fa-whatsapp' },
            { keywords: ['tiktok.com', 'tiktok'], icon: 'fa-tiktok' },
            { keywords: ['reddit.com', 'reddit'], icon: 'fa-reddit' },
            { keywords: ['twitch.tv', 'twitch'], icon: 'fa-twitch' },
            { keywords: ['snapchat.com', 'snapchat'], icon: 'fa-snapchat' }
        ];
        
        for (const { keywords, icon } of iconMap) {
            for (const keyword of keywords) {
                if (urlLower.includes(keyword) || textLower.includes(keyword)) {
                    return icon;
                }
            }
        }
        
        return 'fa-link';
    }
    
    /**
     * Sanitize string for HTML output
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string
     */
    function sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    /**
     * Validate URL
     * @param {string} url - URL to validate
     * @returns {boolean} True if valid URL
     */
    function isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
    
    /**
     * Show loading state
     * @param {boolean} show - Whether to show loading
     */
    function setLoading(show) {
        state.isLoading = show;
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (show) {
                button.classList.add('loading');
                button.disabled = true;
            } else {
                button.classList.remove('loading');
                button.disabled = false;
            }
        });
    }
    
    // ==================== DOM OPERATIONS ====================
    
    /**
     * Initialize DOM elements
     */
    function initElements() {
        const ids = [
            'img', 'nama', 'deskripsi', 'footer', 'template',
            'medsos-container', 'links-container', 'add-medsos', 'add-link',
            'preview-btn', 'reset-btn', 'copy-btn', 'download-btn',
            'preview-frame', 'html-output', 'iframe-placeholder', 'copy-overlay'
        ];
        
        ids.forEach(id => {
            elements[id] = document.getElementById(id);
            if (!elements[id]) {
                console.warn(`Element with ID "${id}" not found`);
            }
        });
    }
    
    /**
     * Add social media field
     * @param {string} platform - Platform value
     * @param {string} url - URL value
     */
    function addMedsosField(platform = '', url = '') {
        const container = elements['medsos-container'];
        if (!container) return;
        
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <select class="platform-select" autocomplete="off">
                <option value="">Pilih Platform</option>
                <option value="youtube.com">YouTube</option>
                <option value="instagram.com">Instagram</option>
                <option value="github.com">GitHub</option>
                <option value="linkedin.com">LinkedIn</option>
                <option value="twitter.com">Twitter / X</option>
                <option value="facebook.com">Facebook</option>
                <option value="t.me">Telegram</option>
                <option value="discord.com">Discord</option>
                <option value="spotify.com">Spotify</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="tiktok.com">TikTok</option>
            </select>
            <input type="url" class="url-input" placeholder="https://example.com" value="${sanitizeHTML(url)}" autocomplete="off">
            <button type="button" class="btn-remove" aria-label="Hapus item"><i class="fas fa-times"></i></button>
        `;
        
        container.appendChild(div);
        
        if (platform) {
            const select = div.querySelector('.platform-select');
            select.value = platform;
        }
        
        // Add event listeners
        div.querySelector('.btn-remove').addEventListener('click', () => {
            div.remove();
            if (state.hasPreview) {
                updatePreview();
            }
        });
        
        // Auto-fill URL based on platform selection
        const platformSelect = div.querySelector('.platform-select');
        const urlInput = div.querySelector('.url-input');
        
        platformSelect.addEventListener('change', function() {
            if (!urlInput.value && this.value) {
                urlInput.value = `https://${this.value}/username`;
            }
            if (state.hasPreview) {
                updatePreview();
            }
        });
        
        urlInput.addEventListener('input', () => {
            if (state.hasPreview) {
                updatePreview();
            }
        });
    }
    
    /**
     * Add custom link field
     * @param {string} text - Link text
     * @param {string} url - Link URL
     */
    function addLinkField(text = '', url = '') {
        const container = elements['links-container'];
        if (!container) return;
        
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <input type="text" class="link-text" placeholder="Teks Link" value="${sanitizeHTML(text)}" autocomplete="off">
            <input type="url" class="link-url" placeholder="https://example.com" value="${sanitizeHTML(url)}" autocomplete="off">
            <button type="button" class="btn-remove" aria-label="Hapus item"><i class="fas fa-times"></i></button>
        `;
        
        container.appendChild(div);
        
        // Add event listeners
        div.querySelector('.btn-remove').addEventListener('click', () => {
            div.remove();
            if (state.hasPreview) {
                updatePreview();
            }
        });
        
        const textInput = div.querySelector('.link-text');
        const urlInput = div.querySelector('.link-url');
        
        textInput.addEventListener('input', () => {
            if (state.hasPreview) {
                updatePreview();
            }
        });
        
        urlInput.addEventListener('input', () => {
            if (state.hasPreview) {
                updatePreview();
            }
        });
    }
    
    // ==================== DATA COLLECTION ====================
    
    /**
     * Collect form data
     * @returns {Object} Form data
     */
    function collectFormData() {
        const medsos = [];
        const links = [];
        
        // Collect social media
        const medsosItems = elements['medsos-container'].querySelectorAll('.dynamic-item');
        medsosItems.forEach(item => {
            const platform = item.querySelector('.platform-select').value;
            const url = item.querySelector('.url-input').value.trim();
            
            if (platform && url && isValidURL(url)) {
                medsos.push({
                    platform: platform,
                    url: url
                });
            }
        });
        
        // Collect custom links
        const linksItems = elements['links-container'].querySelectorAll('.dynamic-item');
        linksItems.forEach(item => {
            const text = item.querySelector('.link-text').value.trim();
            const url = item.querySelector('.link-url').value.trim();
            
            if (text && url && isValidURL(url)) {
                links.push({
                    text: text,
                    url: url,
                    icon: autoDetectIcon(url, text)
                });
            }
        });
        
        return {
            img: elements.img.value.trim() || CONFIG.DEFAULT_IMAGE,
            nama: elements.nama.value.trim() || CONFIG.DEFAULT_NAME,
            deskripsi: elements.deskripsi.value.trim() || CONFIG.DEFAULT_BIO,
            medsos: medsos,
            links: links,
            footer: elements.footer.value.trim() || CONFIG.DEFAULT_FOOTER,
            template: elements.template.value || CONFIG.DEFAULT_TEMPLATE
        };
    }
    
    // ==================== HTML GENERATION ====================
    
    /**
     * Generate preview HTML
     * @param {Object} data - Form data
     * @returns {string} HTML string
     */
    function generatePreviewHTML(data) {
        const template = templates[data.template] || templates[CONFIG.DEFAULT_TEMPLATE];
        
        // Generate social media buttons
        const medsosButtons = data.medsos.map(item => {
            const icon = autoDetectIcon(item.url);
            return `
                <a href="${sanitizeHTML(item.url)}" target="_blank" class="linktree-btn medsos-btn" rel="noopener noreferrer">
                    <i class="fab ${icon}"></i>
                </a>
            `;
        }).join('\n');
        
        // Generate custom links
        const customLinks = data.links.map(item => {
            return `
                <a href="${sanitizeHTML(item.url)}" target="_blank" class="linktree-btn custom-link" rel="noopener noreferrer">
                    <i class="fas ${item.icon}"></i>
                    <span>${sanitizeHTML(item.text)}</span>
                </a>
            `;
        }).join('\n');
        
        return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${sanitizeHTML(data.nama)} - Linktree</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Press+Start+2P&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        ${template.style}
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            font-family: ${template.font};
            transition: all 0.3s ease;
        }
        
        .linktree-container {
            max-width: 480px;
            width: 100%;
            padding: 40px;
            border-radius: 24px;
            text-align: center;
            animation: fadeIn 0.8s ease-out;
        }
        
        .profile-img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid rgba(255, 255, 255, 0.2);
            margin: 0 auto 20px;
            transition: transform 0.3s ease;
        }
        
        .profile-img:hover {
            transform: scale(1.05);
        }
        
        .profile-name {
            font-size: 1.8rem;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .profile-bio {
            font-size: 1rem;
            opacity: 0.9;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        
        .medsos-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        
        .links-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .linktree-btn {
            padding: 18px 24px;
            border-radius: 12px;
            text-decoration: none;
            font-size: 1rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            transition: all 0.3s ease;
        }
        
        .custom-link i {
            font-size: 1.1rem;
        }
        
        .footer-text {
            font-size: 0.9rem;
            opacity: 0.7;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
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
        
        @media (max-width: 480px) {
            .linktree-container {
                padding: 25px 20px;
            }
            
            .profile-name {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="linktree-container">
        <img src="${sanitizeHTML(data.img)}" alt="${sanitizeHTML(data.nama)}" class="profile-img" crossorigin="anonymous">
        <h1 class="profile-name">${sanitizeHTML(data.nama)}</h1>
        <p class="profile-bio">${sanitizeHTML(data.deskripsi)}</p>
        
        <div class="social-links">
            ${medsosButtons}
        </div>
        
        <div class="links-container">
            ${customLinks}
        </div>
        
        <p class="footer-text">${sanitizeHTML(data.footer)}</p>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const buttons = document.querySelectorAll('.linktree-btn');
            buttons.forEach(btn => {
                btn.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-3px)';
                });
                
                btn.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
        });
    </script>
</body>
</html>`;
    }
    
    /**
     * Generate full HTML for download
     * @param {Object} data - Form data
     * @returns {string} HTML string
     */
    function generateFullHTML(data) {
        const template = templates[data.template] || templates[CONFIG.DEFAULT_TEMPLATE];
        
        const medsosData = data.medsos.map(item => ({
            platform: item.platform,
            url: item.url
        }));
        
        const linksData = data.links.map(item => ({
            text: item.text,
            url: item.url,
            icon: autoDetectIcon(item.url, item.text)
        }));
        
        return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${sanitizeHTML(data.nama)} - Linktree</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Press+Start+2P&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hanzcode1/LinktreeBuilder@main/style.css">
    <style>
        ${template.style}
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            font-family: ${template.font};
        }
        
        .linktree-container {
            max-width: 480px;
            width: 100%;
            padding: 40px;
            border-radius: 24px;
            text-align: center;
            animation: fadeIn 0.8s ease-out;
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
        
        @media (max-width: 480px) {
            .linktree-container {
                padding: 25px 20px;
            }
        }
    </style>
</head>
<body>
    <div id="linktree-app"></div>
    
    <script src="https://cdn.jsdelivr.net/gh/hanzcode1/LinktreeBuilder@main/script.js"></script>
    <script>
        Linktree.init({
            img: "${sanitizeHTML(data.img)}",
            nama: "${data.nama.replace(/"/g, '\\"')}",
            deskripsi: "${data.deskripsi.replace(/"/g, '\\"')}",
            medsos: ${JSON.stringify(medsosData)},
            links: ${JSON.stringify(linksData)},
            footer: "${data.footer.replace(/"/g, '\\"')}"
        });
        
        document.addEventListener('DOMContentLoaded', function() {
            const buttons = document.querySelectorAll('.linktree-btn');
            buttons.forEach(btn => {
                btn.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-3px)';
                });
                
                btn.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
        });
    </script>
</body>
</html>`;
    }
    
    // ==================== PREVIEW FUNCTIONS ====================
    
    /**
     * Update preview
     */
    function updatePreview() {
        if (!state.hasPreview) return;
        
        const data = collectFormData();
        const previewHTML = generatePreviewHTML(data);
        const fullHTML = generateFullHTML(data);
        
        elements['preview-frame'].srcdoc = previewHTML;
        elements['html-output'].textContent = fullHTML;
    }
    
    /**
     * Generate preview
     */
    function generatePreview() {
        setLoading(true);
        
        setTimeout(() => {
            const data = collectFormData();
            const previewHTML = generatePreviewHTML(data);
            const fullHTML = generateFullHTML(data);
            
            // Update iframe
            elements['preview-frame'].srcdoc = previewHTML;
            elements['iframe-placeholder'].style.display = 'none';
            elements['preview-frame'].style.display = 'block';
            
            // Update code output
            elements['html-output'].textContent = fullHTML;
            
            // Enable copy and download buttons
            elements['copy-btn'].disabled = false;
            elements['download-btn'].disabled = false;
            
            // Update state
            state.hasPreview = true;
            state.currentTemplate = data.template;
            
            // Scroll to preview
            elements['preview-frame'].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
            
            setLoading(false);
        }, 300);
    }
    
    // ==================== FORM RESET ====================
    
    /**
     * Reset form to default values
     */
    function resetForm() {
        if (!confirm('Reset semua input ke nilai default?')) {
            return;
        }
        
        // Clear main inputs
        elements.img.value = '';
        elements.nama.value = '';
        elements.deskripsi.value = '';
        elements.footer.value = '';
        
        // Clear dynamic containers
        elements['medsos-container'].innerHTML = '';
        elements['links-container'].innerHTML = '';
        
        // Reset template selector
        document.querySelectorAll('.template-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.template === CONFIG.DEFAULT_TEMPLATE) {
                option.classList.add('active');
            }
        });
        elements.template.value = CONFIG.DEFAULT_TEMPLATE;
        
        // Reset preview
        elements['iframe-placeholder'].style.display = 'flex';
        elements['preview-frame'].style.display = 'none';
        elements['preview-frame'].srcdoc = '';
        
        // Reset code output
        elements['html-output'].textContent = '// HTML akan muncul di sini...';
        elements['copy-btn'].disabled = true;
        elements['download-btn'].disabled = true;
        
        // Reset state
        state.hasPreview = false;
        state.currentTemplate = CONFIG.DEFAULT_TEMPLATE;
        
        // Set default values
        setTimeout(() => {
            setDefaultValues();
        }, 50);
    }
    
    /**
     * Set default values
     */
    function setDefaultValues() {
        elements.img.value = CONFIG.DEFAULT_IMAGE;
        elements.nama.value = CONFIG.DEFAULT_NAME;
        elements.deskripsi.value = CONFIG.DEFAULT_BIO;
        elements.footer.value = CONFIG.DEFAULT_FOOTER;
        elements.template.value = CONFIG.DEFAULT_TEMPLATE;
        
        // Add default social media
        addMedsosField('github.com', 'https://github.com/username');
        addMedsosField('instagram.com', 'https://instagram.com/username');
        addMedsosField('linkedin.com', 'https://linkedin.com/in/username');
        
        // Add default links
        addLinkField('Portfolio', 'https://portfolio.example.com');
        addLinkField('Blog', 'https://blog.example.com');
        addLinkField('Projects', 'https://github.com/username?tab=repositories');
    }
    
    // ==================== COPY & DOWNLOAD ====================
    
    /**
     * Copy HTML to clipboard
     */
    async function copyHTML() {
        const html = elements['html-output'].textContent;
        
        try {
            await navigator.clipboard.writeText(html);
            
            // Show success message
            elements['copy-overlay'].classList.add('show');
            setTimeout(() => {
                elements['copy-overlay'].classList.remove('show');
            }, 2000);
            
            console.log('HTML copied to clipboard');
        } catch (err) {
            console.error('Failed to copy:', err);
            
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = html;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                elements['copy-overlay'].classList.add('show');
                setTimeout(() => {
                    elements['copy-overlay'].classList.remove('show');
                }, 2000);
            } catch (fallbackErr) {
                console.error('Fallback copy failed:', fallbackErr);
                alert('Gagal menyalin ke clipboard. Silakan copy manual dari text area.');
            }
            
            document.body.removeChild(textArea);
        }
    }
    
    /**
     * Download HTML file
     */
    function downloadHTML() {
        const html = elements['html-output'].textContent;
        const data = collectFormData();
        const filename = `linktree-${data.nama.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`;
        
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('HTML file downloaded:', filename);
    }
    
    // ==================== EVENT LISTENERS ====================
    
    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Add media sosial button
        if (elements['add-medsos']) {
            elements['add-medsos'].addEventListener('click', () => addMedsosField());
        }
        
        // Add link button
        if (elements['add-link']) {
            elements['add-link'].addEventListener('click', () => addLinkField());
        }
        
        // Template selector
        document.querySelectorAll('.template-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.template-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                this.classList.add('active');
                elements.template.value = this.dataset.template;
                
                if (state.hasPreview) {
                    updatePreview();
                }
            });
        });
        
        // Main inputs for real-time updates
        ['img', 'nama', 'deskripsi', 'footer'].forEach(id => {
            if (elements[id]) {
                elements[id].addEventListener('input', () => {
                    if (state.hasPreview) {
                        updatePreview();
                    }
                });
            }
        });
        
        // Preview button
        if (elements['preview-btn']) {
            elements['preview-btn'].addEventListener('click', generatePreview);
        }
        
        // Reset button
        if (elements['reset-btn']) {
            elements['reset-btn'].addEventListener('click', resetForm);
        }
        
        // Copy button
        if (elements['copy-btn']) {
            elements['copy-btn'].addEventListener('click', copyHTML);
        }
        
        // Download button
        if (elements['download-btn']) {
            elements['download-btn'].addEventListener('click', downloadHTML);
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                generatePreview();
            }
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                resetForm();
            }
        });
    }
    
    // ==================== INITIALIZATION ====================
    
    /**
     * Initialize application
     */
    function init() {
        console.log('Linktree Builder Premium initializing...');
        
        // Initialize DOM elements
        initElements();
        
        // Set default values
        setDefaultValues();
        
        // Setup event listeners
        setupEventListeners();
        
        // Add CSS for dynamic items
        const style = document.createElement('style');
        style.textContent = `
            .dynamic-item select,
            .dynamic-item input {
                margin: 0;
            }
            
            .dynamic-item .btn-remove {
                margin: 0;
                align-self: center;
            }
        `;
        document.head.appendChild(style);
        
        console.log('Linktree Builder Premium initialized successfully');
    }
    
    // ==================== ENTRY POINT ====================
    
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export public API
    window.LinktreeBuilder = {
        generatePreview,
        resetForm,
        copyHTML,
        downloadHTML,
        getState: () => ({ ...state }),
        getConfig: () => ({ ...CONFIG })
    };
})();