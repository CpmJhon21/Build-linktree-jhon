// Linktree Builder Premium - Vanilla JavaScript
// Compatible with Netlify, Vercel, GitHub Pages, Replit

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        // Form inputs
        profileImg: document.getElementById('profile-img'),
        profileName: document.getElementById('profile-name'),
        profileDesc: document.getElementById('profile-desc'),
        footerText: document.getElementById('footer-text'),
        selectedTemplate: document.getElementById('selected-template'),
        
        // Containers
        socialContainer: document.getElementById('social-container'),
        linksContainer: document.getElementById('links-container'),
        
        // Buttons
        addSocialBtn: document.getElementById('add-social-btn'),
        addLinkBtn: document.getElementById('add-link-btn'),
        generateBtn: document.getElementById('generate-btn'),
        resetBtn: document.getElementById('reset-btn'),
        copyBtn: document.getElementById('copy-btn'),
        downloadBtn: document.getElementById('download-btn'),
        saveBtn: document.getElementById('save-btn'),
        loadBtn: document.getElementById('load-btn'),
        
        // Preview & Output
        previewFrame: document.getElementById('preview-frame'),
        previewPlaceholder: document.getElementById('preview-placeholder'),
        htmlOutput: document.getElementById('html-output'),
        copyFeedback: document.getElementById('copy-feedback'),
        fileSize: document.getElementById('file-size'),
        
        // Template CSS
        templateCSS: document.getElementById('template-css'),
        
        // Device preview
        deviceButtons: document.querySelectorAll('.device-btn')
    };

    // Template configurations
    const templates = {
        '1': {
            name: 'Pixel Modern',
            cssFile: 'templates/template1.css',
            description: 'Pixel art style with retro gaming aesthetics'
        },
        '2': {
            name: 'Minimal Clean',
            cssFile: 'templates/template2.css',
            description: 'Clean, elegant design with soft shadows'
        },
        '3': {
            name: 'Cyber Neon',
            cssFile: 'templates/template3.css',
            description: 'Futuristic neon glow with cyberpunk vibes'
        }
    };

    // Default social media platforms
    const socialPlatforms = [
        { value: 'youtube.com', label: 'YouTube', icon: 'fa-youtube' },
        { value: 'github.com', label: 'GitHub', icon: 'fa-github' },
        { value: 'instagram.com', label: 'Instagram', icon: 'fa-instagram' },
        { value: 'linkedin.com', label: 'LinkedIn', icon: 'fa-linkedin' },
        { value: 'twitter.com', label: 'Twitter / X', icon: 'fa-x-twitter' },
        { value: 'facebook.com', label: 'Facebook', icon: 'fa-facebook' },
        { value: 't.me', label: 'Telegram', icon: 'fa-telegram' },
        { value: 'discord.com', label: 'Discord', icon: 'fa-discord' },
        { value: 'spotify.com', label: 'Spotify', icon: 'fa-spotify' },
        { value: 'whatsapp', label: 'WhatsApp', icon: 'fa-whatsapp' },
        { value: 'tiktok.com', label: 'TikTok', icon: 'fa-tiktok' },
        { value: 'reddit.com', label: 'Reddit', icon: 'fa-reddit' },
        { value: 'twitch.tv', label: 'Twitch', icon: 'fa-twitch' },
        { value: 'snapchat.com', label: 'Snapchat', icon: 'fa-snapchat' },
        { value: 'pinterest.com', label: 'Pinterest', icon: 'fa-pinterest' },
        { value: 'medium.com', label: 'Medium', icon: 'fa-medium' }
    ];

    // Auto-detect icon function
    function autoDetectIcon(url, text = '') {
        const urlLower = url.toLowerCase();
        const textLower = text.toLowerCase();
        
        // Check for social media platforms
        if (urlLower.includes('youtube.com') || textLower.includes('youtube')) return 'fa-youtube';
        if (urlLower.includes('github.com') || textLower.includes('github')) return 'fa-github';
        if (urlLower.includes('instagram.com') || textLower.includes('instagram')) return 'fa-instagram';
        if (urlLower.includes('linkedin.com') || textLower.includes('linkedin')) return 'fa-linkedin';
        if (urlLower.includes('twitter.com') || urlLower.includes('x.com') || textLower.includes('twitter')) return 'fa-x-twitter';
        if (urlLower.includes('facebook.com') || textLower.includes('facebook')) return 'fa-facebook';
        if (urlLower.includes('t.me') || textLower.includes('telegram')) return 'fa-telegram';
        if (urlLower.includes('discord.com') || textLower.includes('discord')) return 'fa-discord';
        if (urlLower.includes('spotify.com') || textLower.includes('spotify')) return 'fa-spotify';
        if (urlLower.includes('whatsapp') || textLower.includes('whatsapp')) return 'fa-whatsapp';
        if (urlLower.includes('tiktok.com') || textLower.includes('tiktok')) return 'fa-tiktok';
        if (urlLower.includes('reddit.com') || textLower.includes('reddit')) return 'fa-reddit';
        if (urlLower.includes('twitch.tv') || textLower.includes('twitch')) return 'fa-twitch';
        if (urlLower.includes('snapchat.com') || textLower.includes('snapchat')) return 'fa-snapchat';
        if (urlLower.includes('pinterest.com') || textLower.includes('pinterest')) return 'fa-pinterest';
        if (urlLower.includes('medium.com') || textLower.includes('medium')) return 'fa-medium';
        if (urlLower.includes('dribbble.com') || textLower.includes('dribbble')) return 'fa-dribbble';
        if (urlLower.includes('behance.net') || textLower.includes('behance')) return 'fa-behance';
        if (urlLower.includes('dropbox.com') || textLower.includes('dropbox')) return 'fa-dropbox';
        if (urlLower.includes('slack.com') || textLower.includes('slack')) return 'fa-slack';
        if (urlLower.includes('figma.com') || textLower.includes('figma')) return 'fa-figma';
        
        // Check for file types
        if (urlLower.includes('.pdf') || textLower.includes('pdf')) return 'fa-file-pdf';
        if (urlLower.includes('.doc') || textLower.includes('word') || textLower.includes('document')) return 'fa-file-word';
        if (urlLower.includes('.xls') || textLower.includes('excel') || textLower.includes('spreadsheet')) return 'fa-file-excel';
        if (urlLower.includes('.zip') || urlLower.includes('.rar') || urlLower.includes('.tar') || textLower.includes('archive')) return 'fa-file-archive';
        if (urlLower.includes('.mp3') || urlLower.includes('.wav') || urlLower.includes('.flac') || textLower.includes('audio') || textLower.includes('music')) return 'fa-file-audio';
        if (urlLower.includes('.mp4') || urlLower.includes('.avi') || urlLower.includes('.mov') || textLower.includes('video')) return 'fa-file-video';
        
        // Check for specific services
        if (urlLower.includes('mailto:') || textLower.includes('email')) return 'fa-envelope';
        if (urlLower.includes('tel:') || textLower.includes('phone')) return 'fa-phone';
        if (urlLower.includes('maps.') || urlLower.includes('google.com/maps') || textLower.includes('map') || textLower.includes('location')) return 'fa-map-marker-alt';
        if (urlLower.includes('calendar.') || textLower.includes('calendar') || textLower.includes('schedule')) return 'fa-calendar';
        
        // Default icons for common patterns
        if (textLower.includes('portfolio') || textLower.includes('work') || textLower.includes('projects')) return 'fa-briefcase';
        if (textLower.includes('blog') || textLower.includes('article') || textLower.includes('write')) return 'fa-blog';
        if (textLower.includes('shop') || textLower.includes('store') || textLower.includes('buy') || textLower.includes('merch')) return 'fa-shopping-cart';
        if (textLower.includes('donate') || textLower.includes('support') || textLower.includes('tip') || textLower.includes('sponsor')) return 'fa-heart';
        if (textLower.includes('contact') || textLower.includes('message') || textLower.includes('reach')) return 'fa-comments';
        if (textLower.includes('resume') || textLower.includes('cv') || textLower.includes('curriculum')) return 'fa-file-alt';
        if (textLower.includes('newsletter') || textLower.includes('subscribe')) return 'fa-newspaper';
        if (textLower.includes('book') || textLower.includes('read')) return 'fa-book';
        if (textLower.includes('music') || textLower.includes('song') || textLower.includes('album')) return 'fa-music';
        if (textLower.includes('video') || textLower.includes('film') || textLower.includes('movie')) return 'fa-video';
        if (textLower.includes('photo') || textLower.includes('picture') || textLower.includes('gallery')) return 'fa-images';
        
        // Default link icon
        return 'fa-link';
    }

    // Initialize application
    function init() {
        setupEventListeners();
        loadTemplateOptions();
        loadDefaultData();
        loadSavedData();
        updateFileSize();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Template selection
        document.querySelectorAll('.template-option').forEach(option => {
            option.addEventListener('click', function() {
                selectTemplate(this.dataset.template);
            });
        });

        // Device preview buttons
        elements.deviceButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                elements.deviceButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                updatePreviewSize(this.dataset.device);
            });
        });

        // Add social media button
        elements.addSocialBtn.addEventListener('click', addSocialField);

        // Add custom link button
        elements.addLinkBtn.addEventListener('click', addLinkField);

        // Generate button
        elements.generateBtn.addEventListener('click', generatePreview);

        // Reset button
        elements.resetBtn.addEventListener('click', resetForm);

        // Copy button
        elements.copyBtn.addEventListener('click', copyHTMLToClipboard);

        // Download button
        elements.downloadBtn.addEventListener('click', downloadHTMLFile);

        // Save/Load buttons
        elements.saveBtn.addEventListener('click', saveToLocalStorage);
        elements.loadBtn.addEventListener('click', loadFromLocalStorage);

        // Export/Import data
        document.getElementById('export-data')?.addEventListener('click', exportData);
        document.getElementById('import-data')?.addEventListener('click', importData);

        // Form input changes
        ['profileImg', 'profileName', 'profileDesc', 'footerText'].forEach(id => {
            document.getElementById(id).addEventListener('input', updateFileSize);
        });

        // Debounced preview generation
        let previewTimeout;
        ['profileImg', 'profileName', 'profileDesc', 'footerText'].forEach(id => {
            document.getElementById(id).addEventListener('input', function() {
                clearTimeout(previewTimeout);
                previewTimeout = setTimeout(() => {
                    if (elements.previewFrame.style.display !== 'none') {
                        generatePreview();
                    }
                }, 500);
            });
        });
    }

    // Load template options
    function loadTemplateOptions() {
        const templateGrid = document.querySelector('.template-grid');
        if (!templateGrid) return;

        Object.keys(templates).forEach(templateId => {
            const template = templates[templateId];
            const option = templateGrid.querySelector(`[data-template="${templateId}"]`);
            if (option) {
                option.title = template.description;
            }
        });
    }

    // Select template
    function selectTemplate(templateId) {
        // Update UI
        document.querySelectorAll('.template-option').forEach(opt => {
            opt.classList.remove('active');
        });
        document.querySelector(`.template-option[data-template="${templateId}"]`).classList.add('active');
        elements.selectedTemplate.value = templateId;

        // Load template CSS
        elements.templateCSS.href = templates[templateId].cssFile;

        // Regenerate preview if already generated
        if (elements.previewFrame.style.display !== 'none') {
            generatePreview();
        }
    }

    // Add social media field
    function addSocialField(platform = '', url = '') {
        const socialItem = document.createElement('div');
        socialItem.className = 'dynamic-item';
        socialItem.innerHTML = `
            <select class="social-platform">
                <option value="">Select Platform</option>
                ${socialPlatforms.map(p => 
                    `<option value="${p.value}" ${platform === p.value ? 'selected' : ''}>${p.label}</option>`
                ).join('')}
            </select>
            <input type="url" class="social-url" placeholder="https://..." value="${url}">
            <button type="button" class="remove-btn">
                <i class="fas fa-times"></i>
            </button>
        `;

        elements.socialContainer.appendChild(socialItem);

        // Add event listener to remove button
        const removeBtn = socialItem.querySelector('.remove-btn');
        removeBtn.addEventListener('click', function() {
            socialItem.remove();
            updateFileSize();
        });

        // Add change listener for auto-completion
        const platformSelect = socialItem.querySelector('.social-platform');
        const urlInput = socialItem.querySelector('.social-url');
        
        platformSelect.addEventListener('change', function() {
            if (this.value && !urlInput.value) {
                urlInput.value = `https://${this.value}/yourusername`;
            }
            updateFileSize();
        });

        urlInput.addEventListener('input', updateFileSize);

        return socialItem;
    }

    // Add custom link field
    function addLinkField(text = '', url = '') {
        const linkItem = document.createElement('div');
        linkItem.className = 'dynamic-item';
        linkItem.innerHTML = `
            <input type="text" class="link-text" placeholder="Link text" value="${text}">
            <input type="url" class="link-url" placeholder="https://..." value="${url}">
            <button type="button" class="remove-btn">
                <i class="fas fa-times"></i>
            </button>
        `;

        elements.linksContainer.appendChild(linkItem);

        // Add event listener to remove button
        const removeBtn = linkItem.querySelector('.remove-btn');
        removeBtn.addEventListener('click', function() {
            linkItem.remove();
            updateFileSize();
        });

        // Add input listeners
        linkItem.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', updateFileSize);
        });

        return linkItem;
    }

    // Collect form data
    function collectFormData() {
        const socialData = [];
        const linksData = [];

        // Collect social media data
        elements.socialContainer.querySelectorAll('.dynamic-item').forEach(item => {
            const platform = item.querySelector('.social-platform').value;
            const url = item.querySelector('.social-url').value.trim();
            
            if (platform && url) {
                socialData.push({
                    platform: platform,
                    url: url
                });
            }
        });

        // Collect custom links data
        elements.linksContainer.querySelectorAll('.dynamic-item').forEach(item => {
            const text = item.querySelector('.link-text').value.trim();
            const url = item.querySelector('.link-url').value.trim();
            
            if (text && url) {
                const icon = autoDetectIcon(url, text);
                linksData.push({
                    text: text,
                    url: url,
                    icon: icon
                });
            }
        });

        return {
            img: elements.profileImg.value.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
            nama: elements.profileName.value.trim() || 'Your Name',
            deskripsi: elements.profileDesc.value.trim() || 'Your bio description here...',
            medsos: socialData,
            links: linksData,
            footer: elements.footerText.value.trim() || '© 2024 Your Brand',
            template: elements.selectedTemplate.value
        };
    }

    // Generate preview HTML
    function generatePreviewHTML(data) {
        const template = templates[data.template];
        
        // Generate social media HTML
        const socialHTML = data.medsos.map(item => {
            const icon = autoDetectIcon(item.url, item.platform);
            return `
                <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="social-link">
                    <i class="fab ${icon}"></i>
                </a>
            `;
        }).join('\n');

        // Generate links HTML
        const linksHTML = data.links.map(item => {
            return `
                <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="link-button">
                    <i class="fas ${item.icon}"></i>
                    <span>${item.text}</span>
                </a>
            `;
        }).join('\n');

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${data.nama} | Linktree</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Press+Start+2P&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hanzcode1/LinktreeBuilder@main/style.css">
                <link rel="stylesheet" href="${template.cssFile}">
                <style>
                    body {
                        margin: 0;
                        padding: 20px;
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-family: 'Poppins', sans-serif;
                    }
                    
                    .linktree-container {
                        width: 100%;
                        max-width: 480px;
                        animation: fadeIn 0.5s ease-out;
                    }
                    
                    .profile-img {
                        width: 120px;
                        height: 120px;
                        border-radius: 50%;
                        object-fit: cover;
                        margin: 0 auto 20px;
                        display: block;
                    }
                    
                    .profile-name {
                        text-align: center;
                        margin: 0 0 10px;
                        font-size: 1.8rem;
                    }
                    
                    .profile-desc {
                        text-align: center;
                        margin: 0 0 30px;
                        opacity: 0.8;
                        line-height: 1.6;
                    }
                    
                    .social-links {
                        display: flex;
                        justify-content: center;
                        gap: 15px;
                        margin: 0 0 30px;
                        flex-wrap: wrap;
                    }
                    
                    .social-link {
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
                        margin: 0 0 30px;
                    }
                    
                    .link-button {
                        padding: 15px 20px;
                        border-radius: 10px;
                        text-decoration: none;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        transition: all 0.3s ease;
                    }
                    
                    .link-button i {
                        width: 20px;
                        text-align: center;
                    }
                    
                    .footer {
                        text-align: center;
                        padding-top: 20px;
                        border-top: 1px solid rgba(255, 255, 255, 0.1);
                        font-size: 0.9rem;
                        opacity: 0.7;
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
                </style>
            </head>
            <body>
                <div class="linktree-container">
                    <img src="${data.img}" alt="${data.nama}" class="profile-img">
                    <h1 class="profile-name">${data.nama}</h1>
                    <p class="profile-desc">${data.deskripsi}</p>
                    
                    ${data.medsos.length > 0 ? `
                    <div class="social-links">
                        ${socialHTML}
                    </div>
                    ` : ''}
                    
                    ${data.links.length > 0 ? `
                    <div class="links-container">
                        ${linksHTML}
                    </div>
                    ` : ''}
                    
                    <div class="footer">
                        ${data.footer}
                    </div>
                </div>
                
                <script>
                    // Add hover effects
                    document.addEventListener('DOMContentLoaded', function() {
                        const links = document.querySelectorAll('.social-link, .link-button');
                        links.forEach(link => {
                            link.addEventListener('mouseenter', function() {
                                this.style.transform = 'translateY(-2px)';
                            });
                            
                            link.addEventListener('mouseleave', function() {
                                this.style.transform = 'translateY(0)';
                            });
                        });
                    });
                </script>
            </body>
            </html>
        `;
    }

    // Generate full HTML for download
    function generateFullHTML(data) {
        const template = templates[data.template];
        
        // Prepare data for Linktree.init
        const linktreeData = {
            img: data.img,
            nama: data.nama,
            deskripsi: data.deskripsi,
            medsos: data.medsos.map(item => ({
                platform: item.platform,
                url: item.url
            })),
            links: data.links.map(item => ({
                text: item.text,
                url: item.url,
                icon: item.icon
            })),
            footer: data.footer
        };

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.nama} | Linktree</title>
    <meta name="description" content="${data.deskripsi}">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Press+Start+2P&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- Linktree Builder CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hanzcode1/LinktreeBuilder@main/style.css">
    
    <!-- Template CSS -->
    <link rel="stylesheet" href="${template.cssFile}">
    
    <style>
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
            animation: fadeIn 0.8s ease-out;
        }
        
        #linktree-app {
            width: 100%;
            max-width: 480px;
            margin: 0 auto;
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
        
        /* Mobile Responsive */
        @media (max-width: 480px) {
            body {
                padding: 15px;
            }
        }
        
        @media (max-width: 320px) {
            body {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div id="linktree-app"></div>
    
    <!-- Linktree Builder JS -->
    <script src="https://cdn.jsdelivr.net/gh/hanzcode1/LinktreeBuilder@main/script.js"></script>
    <script>
        // Initialize Linktree with your data
        Linktree.init(${JSON.stringify(linktreeData, null, 2)});
        
        // Add interactive effects
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
            
            // Profile image hover effect
            const profileImg = document.querySelector('.profile-img');
            if (profileImg) {
                profileImg.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05)';
                });
                
                profileImg.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                });
            }
        });
    </script>
</body>
</html>`;
    }

    // Generate preview
    function generatePreview() {
        const data = collectFormData();
        
        // Generate preview HTML
        const previewHTML = generatePreviewHTML(data);
        
        // Update iframe
        elements.previewFrame.srcdoc = previewHTML;
        elements.previewPlaceholder.style.display = 'none';
        elements.previewFrame.style.display = 'block';
        
        // Generate full HTML for download/copy
        const fullHTML = generateFullHTML(data);
        elements.htmlOutput.textContent = fullHTML;
        
        // Enable buttons
        elements.copyBtn.disabled = false;
        elements.downloadBtn.disabled = false;
        
        // Update file size
        updateFileSize();
        
        // Show success message
        showToast('Preview generated successfully!', 'success');
    }

    // Copy HTML to clipboard
    async function copyHTMLToClipboard() {
        try {
            const html = elements.htmlOutput.textContent;
            await navigator.clipboard.writeText(html);
            
            // Show feedback
            elements.copyFeedback.classList.add('show');
            setTimeout(() => {
                elements.copyFeedback.classList.remove('show');
            }, 2000);
            
            showToast('HTML copied to clipboard!', 'success');
        } catch (err) {
            console.error('Failed to copy:', err);
            showToast('Failed to copy to clipboard', 'error');
        }
    }

    // Download HTML file
    function downloadHTMLFile() {
        const data = collectFormData();
        const html = elements.htmlOutput.textContent;
        const filename = `linktree-${data.nama.toLowerCase().replace(/\s+/g, '-')}.html`;
        
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('HTML file downloaded!', 'success');
    }

    // Update file size
    function updateFileSize() {
        const html = generateFullHTML(collectFormData());
        const sizeInBytes = new Blob([html]).size;
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);
        elements.fileSize.textContent = `${sizeInKB} KB`;
    }

    // Update preview size based on device
    function updatePreviewSize(device) {
        const wrapper = document.getElementById('preview-wrapper');
        switch(device) {
            case 'mobile':
                wrapper.style.maxWidth = '375px';
                wrapper.style.margin = '0 auto';
                break;
            case 'tablet':
                wrapper.style.maxWidth = '768px';
                wrapper.style.margin = '0 auto';
                break;
            default:
                wrapper.style.maxWidth = 'none';
                wrapper.style.margin = '0';
        }
    }

    // Reset form
    function resetForm() {
        if (confirm('Are you sure you want to reset all fields? This cannot be undone.')) {
            // Clear inputs
            elements.profileImg.value = '';
            elements.profileName.value = '';
            elements.profileDesc.value = '';
            elements.footerText.value = '';
            
            // Clear dynamic containers
            elements.socialContainer.innerHTML = '';
            elements.linksContainer.innerHTML = '';
            
            // Reset template
            selectTemplate('2');
            
            // Reset preview
            elements.previewPlaceholder.style.display = 'flex';
            elements.previewFrame.style.display = 'none';
            elements.htmlOutput.textContent = '// Your generated HTML will appear here...';
            elements.copyBtn.disabled = true;
            elements.downloadBtn.disabled = true;
            
            // Load default data
            loadDefaultData();
            
            showToast('Form reset successfully', 'info');
        }
    }

    // Load default data
    function loadDefaultData() {
        // Add default social media
        addSocialField('github.com', 'https://github.com/username');
        addSocialField('youtube.com', 'https://youtube.com/c/username');
        addSocialField('instagram.com', 'https://instagram.com/username');
        
        // Add default links
        addLinkField('Portfolio', 'https://portfolio.example.com');
        addLinkField('Blog', 'https://blog.example.com');
        addLinkField('Contact Me', 'mailto:hello@example.com');
    }

    // Save to localStorage
    function saveToLocalStorage() {
        const data = collectFormData();
        localStorage.setItem('linktreeBuilderData', JSON.stringify(data));
        showToast('Data saved to browser storage', 'success');
    }

    // Load from localStorage
    function loadFromLocalStorage() {
        const saved = localStorage.getItem('linktreeBuilderData');
        if (!saved) {
            showToast('No saved data found', 'info');
            return;
        }
        
        try {
            const data = JSON.parse(saved);
            
            // Load basic fields
            elements.profileImg.value = data.img || '';
            elements.profileName.value = data.nama || '';
            elements.profileDesc.value = data.deskripsi || '';
            elements.footerText.value = data.footer || '';
            
            // Clear dynamic containers
            elements.socialContainer.innerHTML = '';
            elements.linksContainer.innerHTML = '';
            
            // Load social media
            if (data.medsos && Array.isArray(data.medsos)) {
                data.medsos.forEach(item => {
                    addSocialField(item.platform, item.url);
                });
            }
            
            // Load custom links
            if (data.links && Array.isArray(data.links)) {
                data.links.forEach(item => {
                    addLinkField(item.text, item.url);
                });
            }
            
            // Load template
            if (data.template && templates[data.template]) {
                selectTemplate(data.template);
            }
            
            showToast('Data loaded from browser storage', 'success');
        } catch (err) {
            console.error('Failed to load saved data:', err);
            showToast('Failed to load saved data', 'error');
        }
    }

    // Export data as JSON
    function exportData() {
        const data = collectFormData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'linktree-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Data exported as JSON', 'success');
    }

    // Import data from JSON file
    function importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validate data structure
                    if (!data.nama || !Array.isArray(data.medsos) || !Array.isArray(data.links)) {
                        throw new Error('Invalid data format');
                    }
                    
                    // Load the data
                    elements.profileImg.value = data.img || '';
                    elements.profileName.value = data.nama || '';
                    elements.profileDesc.value = data.deskripsi || '';
                    elements.footerText.value = data.footer || '';
                    
                    // Clear dynamic containers
                    elements.socialContainer.innerHTML = '';
                    elements.linksContainer.innerHTML = '';
                    
                    // Load social media
                    data.medsos.forEach(item => {
                        addSocialField(item.platform, item.url);
                    });
                    
                    // Load custom links
                    data.links.forEach(item => {
                        addLinkField(item.text, item.url);
                    });
                    
                    // Load template
                    if (data.template && templates[data.template]) {
                        selectTemplate(data.template);
                    }
                    
                    showToast('Data imported successfully', 'success');
                } catch (err) {
                    console.error('Failed to import data:', err);
                    showToast('Failed to import data: Invalid format', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    // Show toast notification
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Initialize the application
    init();
});