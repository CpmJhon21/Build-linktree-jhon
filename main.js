// Linktree Builder Premium - Vanilla JavaScript
// 100% Static - No Backend - Client Side Only

// Global State
const state = {
    profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop", // Default image
    currentTemplate: "1",
    generatedHTML: "",
    isUploadActive: false,
    uploadedImageBase64: null,
    medsosItems: [],
    linkItems: []
};

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        // Photo inputs
        imgUrl: document.getElementById('img-url'),
        imgUpload: document.getElementById('img-upload'),
        uploadPreview: document.getElementById('upload-preview'),
        uploadStatus: document.getElementById('upload-status'),
        urlToggle: document.querySelector('.option-toggle[data-option="url"]'),
        uploadToggle: document.querySelector('.option-toggle[data-option="upload"]'),
        
        // Form inputs
        nama: document.getElementById('nama'),
        deskripsi: document.getElementById('deskripsi'),
        footer: document.getElementById('footer'),
        template: document.getElementById('template'),
        
        // Dynamic containers
        medsosContainer: document.getElementById('medsos-container'),
        linksContainer: document.getElementById('links-container'),
        
        // Buttons
        addMedsosBtn: document.getElementById('add-medsos'),
        addLinkBtn: document.getElementById('add-link'),
        previewBtn: document.getElementById('preview-btn'),
        resetBtn: document.getElementById('reset-btn'),
        copyBtn: document.getElementById('copy-btn'),
        downloadBtn: document.getElementById('download-btn'),
        
        // Preview elements
        previewFrame: document.getElementById('preview-frame'),
        htmlOutput: document.getElementById('html-output'),
        iframePlaceholder: document.getElementById('iframe-placeholder'),
        copyOverlay: document.getElementById('copy-overlay'),
        previewMode: document.getElementById('preview-mode'),
        iframeContainer: document.querySelector('.iframe-container')
    };

    // Initialize application
    initApp();

    // Template configuration
    const templates = {
        '1': {
            name: 'Pixel Modern',
            font: '"Press Start 2P", cursive',
            cssFile: './templates/template1.css'
        },
        '2': {
            name: 'Minimal Clean',
            font: '"Poppins", sans-serif',
            cssFile: './templates/template2.css'
        },
        '3': {
            name: 'Cyber Neon',
            font: '"Poppins", sans-serif',
            cssFile: './templates/template3.css'
        }
    };

    // Auto-detect icon based on URL or text
    function autoDetectIcon(url, text = '') {
        const urlLower = url.toLowerCase();
        const textLower = text.toLowerCase();
        
        // Mapping untuk platform populer
        const iconMap = {
            'youtube.com': 'fa-youtube',
            'youtu.be': 'fa-youtube',
            'github.com': 'fa-github',
            'instagram.com': 'fa-instagram',
            'linkedin.com': 'fa-linkedin',
            'twitter.com': 'fa-x-twitter',
            'x.com': 'fa-x-twitter',
            'facebook.com': 'fa-facebook',
            'fb.com': 'fa-facebook',
            't.me': 'fa-telegram',
            'telegram.org': 'fa-telegram',
            'discord.com': 'fa-discord',
            'discord.gg': 'fa-discord',
            'spotify.com': 'fa-spotify',
            'open.spotify.com': 'fa-spotify',
            'whatsapp.com': 'fa-whatsapp',
            'wa.me': 'fa-whatsapp',
            'tiktok.com': 'fa-tiktok',
            'reddit.com': 'fa-reddit',
            'twitch.tv': 'fa-twitch',
            'snapchat.com': 'fa-snapchat',
            'pinterest.com': 'fa-pinterest',
            'medium.com': 'fa-medium',
            'dribbble.com': 'fa-dribbble',
            'behance.net': 'fa-behance',
            'producthunt.com': 'fa-product-hunt'
        };
        
        // Cek berdasarkan URL
        for (const [domain, icon] of Object.entries(iconMap)) {
            if (urlLower.includes(domain)) {
                return icon;
            }
        }
        
        // Cek berdasarkan text
        const textMap = {
            'youtube': 'fa-youtube',
            'github': 'fa-github',
            'instagram': 'fa-instagram',
            'linkedin': 'fa-linkedin',
            'twitter': 'fa-x-twitter',
            'facebook': 'fa-facebook',
            'telegram': 'fa-telegram',
            'discord': 'fa-discord',
            'spotify': 'fa-spotify',
            'whatsapp': 'fa-whatsapp',
            'tiktok': 'fa-tiktok',
            'reddit': 'fa-reddit',
            'twitch': 'fa-twitch',
            'snapchat': 'fa-snapchat',
            'portfolio': 'fa-briefcase',
            'blog': 'fa-blog',
            'website': 'fa-globe',
            'email': 'fa-envelope',
            'cv': 'fa-file-alt',
            'resume': 'fa-file-pdf',
            'project': 'fa-code',
            'store': 'fa-store',
            'shop': 'fa-shopping-cart',
            'donate': 'fa-heart',
            'support': 'fa-handshake'
        };
        
        for (const [keyword, icon] of Object.entries(textMap)) {
            if (textLower.includes(keyword)) {
                return icon;
            }
        }
        
        return 'fa-link'; // Default icon
    }

    // Initialize application
    function initApp() {
        setupEventListeners();
        loadDefaultValues();
        updatePreviewMode();
    }

    // Setup all event listeners
    function setupEventListeners() {
        // Photo toggle
        elements.urlToggle.addEventListener('click', () => togglePhotoOption('url'));
        elements.uploadToggle.addEventListener('click', () => togglePhotoOption('upload'));
        
        // URL input change
        elements.imgUrl.addEventListener('input', function() {
            if (!state.isUploadActive) {
                state.profileImage = this.value || state.profileImage;
                clearUpload();
            }
        });
        
        // File upload
        elements.imgUpload.addEventListener('change', handleImageUpload);
        elements.uploadPreview.addEventListener('click', () => elements.imgUpload.click());
        
        // Dynamic field buttons
        elements.addMedsosBtn.addEventListener('click', addMedsosField);
        elements.addLinkBtn.addEventListener('click', addLinkField);
        
        // Template selector
        document.querySelectorAll('.template-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.template-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                this.classList.add('active');
                state.currentTemplate = this.dataset.template;
                elements.template.value = state.currentTemplate;
            });
        });
        
        // Preview mode selector
        elements.previewMode.addEventListener('change', updatePreviewMode);
        
        // Main buttons
        elements.previewBtn.addEventListener('click', handlePreviewGenerate);
        elements.resetBtn.addEventListener('click', handleReset);
        elements.copyBtn.addEventListener('click', handleCopyHTML);
        elements.downloadBtn.addEventListener('click', handleDownloadHTML);
    }

    // Toggle photo option
    function togglePhotoOption(option) {
        const urlInput = document.querySelector('.url-input');
        const uploadInput = document.querySelector('.upload-input');
        
        if (option === 'url') {
            elements.urlToggle.classList.add('active');
            elements.uploadToggle.classList.remove('active');
            urlInput.classList.add('active');
            uploadInput.classList.remove('active');
            state.isUploadActive = false;
            
            // Jika URL input kosong, gunakan default
            if (!elements.imgUrl.value.trim()) {
                elements.imgUrl.value = state.profileImage;
            }
        } else {
            elements.urlToggle.classList.remove('active');
            elements.uploadToggle.classList.add('active');
            urlInput.classList.remove('active');
            uploadInput.classList.add('active');
            state.isUploadActive = true;
        }
    }

    // Handle image upload
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showUploadStatus('File terlalu besar! Maksimal 2MB.', 'error');
            return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showUploadStatus('File harus berupa gambar!', 'error');
            return;
        }
        
        showUploadStatus('Mengupload...', 'uploading');
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            state.uploadedImageBase64 = e.target.result;
            state.profileImage = state.uploadedImageBase64;
            
            // Update preview
            elements.uploadPreview.innerHTML = `
                <img src="${state.uploadedImageBase64}" 
                     style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 2px solid #00dbde;">
                <span style="display: block; margin-top: 10px;">Gambar siap digunakan!</span>
            `;
            
            showUploadStatus('Upload berhasil!', 'success');
            
            // Clear URL input
            elements.imgUrl.value = '';
        };
        
        reader.onerror = function() {
            showUploadStatus('Gagal membaca file!', 'error');
        };
        
        reader.readAsDataURL(file);
    }
    
    // Show upload status
    function showUploadStatus(message, type = 'info') {
        elements.uploadStatus.textContent = message;
        elements.uploadStatus.className = 'upload-status';
        if (type === 'error') {
            elements.uploadStatus.classList.add('error');
        } else if (type === 'success') {
            elements.uploadStatus.style.color = '#4cd964';
        } else if (type === 'uploading') {
            elements.uploadStatus.style.color = '#ffa500';
        }
    }
    
    // Clear upload data
    function clearUpload() {
        elements.imgUpload.value = '';
        state.uploadedImageBase64 = null;
        elements.uploadPreview.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <span>Klik untuk memilih foto (Max 2MB)</span>
        `;
        elements.uploadStatus.textContent = '';
    }

    // Add media sosial field
    function addMedsosField(platform = '', url = '') {
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <select class="platform-select">
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
            <input type="text" class="url-input" placeholder="URL lengkap (https://...)" value="${url}">
            <button type="button" class="btn-remove"><i class="fas fa-times"></i></button>
        `;
        
        if (platform) {
            div.querySelector('.platform-select').value = platform;
        }
        
        elements.medsosContainer.appendChild(div);
        
        // Add remove functionality
        const removeBtn = div.querySelector('.btn-remove');
        removeBtn.addEventListener('click', function() {
            div.remove();
        });
    }

    // Add custom link field
    function addLinkField(text = '', url = '') {
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <input type="text" class="link-text" placeholder="Teks Link" value="${text}">
            <input type="text" class="link-url" placeholder="URL tujuan" value="${url}">
            <button type="button" class="btn-remove"><i class="fas fa-times"></i></button>
        `;
        
        elements.linksContainer.appendChild(div);
        
        // Add remove functionality
        const removeBtn = div.querySelector('.btn-remove');
        removeBtn.addEventListener('click', function() {
            div.remove();
        });
    }

    // Load default values
    function loadDefaultValues() {
        // Add default social media
        addMedsosField('github.com', 'https://github.com/username');
        addMedsosField('youtube.com', 'https://youtube.com/c/username');
        addMedsosField('instagram.com', 'https://instagram.com/username');
        
        // Add default links
        addLinkField('Portfolio', 'https://portfolio.example.com');
        addLinkField('Blog', 'https://blog.example.com');
        addLinkField('Projects', 'https://github.com/username?tab=repositories');
    }

    // Collect data from form
    function collectFormData() {
        const medsos = [];
        const links = [];
        
        // Collect media sosial
        elements.medsosContainer.querySelectorAll('.dynamic-item').forEach(item => {
            const platform = item.querySelector('.platform-select').value;
            const url = item.querySelector('.url-input').value.trim();
            
            if (platform && url) {
                medsos.push({
                    platform: platform,
                    url: url
                });
            }
        });
        
        // Collect custom links
        elements.linksContainer.querySelectorAll('.dynamic-item').forEach(item => {
            const text = item.querySelector('.link-text').value.trim();
            const url = item.querySelector('.link-url').value.trim();
            
            if (text && url) {
                const icon = autoDetectIcon(url, text);
                links.push({
                    text: text,
                    url: url,
                    icon: icon
                });
            }
        });
        
        // Determine image source
        let imgSource = state.profileImage;
        if (state.isUploadActive && state.uploadedImageBase64) {
            imgSource = state.uploadedImageBase64;
        } else if (elements.imgUrl.value.trim()) {
            imgSource = elements.imgUrl.value.trim();
        }
        
        return {
            img: imgSource,
            nama: elements.nama.value.trim() || 'Your Name',
            deskripsi: elements.deskripsi.value.trim() || 'Your bio description',
            medsos: medsos,
            links: links,
            footer: elements.footer.value.trim() || '© 2024 Your Brand',
            template: state.currentTemplate
        };
    }

    // Fetch template CSS
    async function getTemplateCSS(templateId) {
        const template = templates[templateId];
        try {
            const response = await fetch(template.cssFile);
            if (!response.ok) throw new Error('CSS not found');
            return await response.text();
        } catch (error) {
            console.error('Error loading template CSS:', error);
            // Fallback CSS
            return `/* Fallback CSS for Template ${templateId} */
            body { font-family: ${template.font}; background: #f0f0f0; color: #333; }
            .linktree-container { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .profile-img { width: 120px; height: 120px; border-radius: 50%; margin: 0 auto 20px; }
            .linktree-btn { background: #007bff; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: block; margin: 10px 0; }`;
        }
    }

    // Generate preview HTML for iframe
    async function generatePreviewHTML(data) {
        const template = templates[data.template];
        const templateCSS = await getTemplateCSS(data.template);
        
        // Generate social media buttons
        const medsosButtons = data.medsos.map(item => {
            const icon = autoDetectIcon(item.url);
            return `
                <a href="${item.url}" target="_blank" class="linktree-btn medsos-btn">
                    <i class="fab ${icon}"></i>
                </a>
            `;
        }).join('\n');
        
        // Generate custom links
        const customLinks = data.links.map(item => {
            return `
                <a href="${item.url}" target="_blank" class="linktree-btn custom-link">
                    <i class="fas ${item.icon}"></i>
                    ${item.text}
                </a>
            `;
        }).join('\n');
        
        // Full HTML with injected CSS
        return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.nama} - Linktree</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Press+Start+2P&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hanzcode1/LinktreeBuilder@main/style.css">
    <style>
        ${templateCSS}
        
        /* Additional responsive styles for preview */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            min-height: 100vh; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            padding: 20px;
            font-family: ${template.font};
        }
        #linktree-app { width: 100%; max-width: 480px; margin: 0 auto; }
        .linktree-container { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
            .linktree-container { padding: 25px 20px !important; }
        }
    </style>
</head>
<body>
    <div id="linktree-app"></div>
    
    <script src="https://cdn.jsdelivr.net/gh/hanzcode1/LinktreeBuilder@main/script.js"></script>
    <script>
        // Initialize Linktree
        Linktree.init({
            img: "${data.img.replace(/"/g, '\\"')}",
            nama: "${data.nama.replace(/"/g, '\\"')}",
            deskripsi: "${data.deskripsi.replace(/"/g, '\\"')}",
            medsos: ${JSON.stringify(data.medsos)},
            links: ${JSON.stringify(data.links)},
            footer: "${data.footer.replace(/"/g, '\\"')}"
        });
        
        // Add hover effects
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

    // Generate full HTML for download
    async function generateFullHTML(data) {
        const template = templates[data.template];
        const templateCSS = await getTemplateCSS(data.template);
        
        return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.nama} - Linktree</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Press+Start+2P&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- Linktree Builder CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hanzcode1/LinktreeBuilder@main/style.css">
    <style>
        ${templateCSS}
        
        /* Base styles */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            font-family: ${template.font};
        }
        #linktree-app {
            width: 100%;
            max-width: 480px;
            margin: 0 auto;
        }
        .linktree-container {
            animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
            .linktree-container { padding: 25px 20px !important; }
            body { padding: 15px; }
        }
        @media (max-width: 375px) {
            body { padding: 10px; }
        }
    </style>
</head>
<body>
    <div id="linktree-app"></div>
    
    <!-- Linktree Builder JS -->
    <script src="https://cdn.jsdelivr.net/gh/hanzcode1/LinktreeBuilder@main/script.js"></script>
    <script>
        // Initialize Linktree with data
        Linktree.init({
            img: "${data.img.replace(/"/g, '\\"')}",
            nama: "${data.nama.replace(/"/g, '\\"')}",
            deskripsi: "${data.deskripsi.replace(/"/g, '\\"')}",
            medsos: ${JSON.stringify(data.medsos)},
            links: ${JSON.stringify(data.links)},
            footer: "${data.footer.replace(/"/g, '\\"')}"
        });
        
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
        });
    </script>
</body>
</html>`;
    }

    // Handle preview and generate
    async function handlePreviewGenerate() {
        try {
            // Show loading
            elements.previewBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            elements.previewBtn.disabled = true;
            
            // Collect data
            const formData = collectFormData();
            
            // Generate preview HTML
            const previewHTML = await generatePreviewHTML(formData);
            
            // Update iframe
            elements.previewFrame.srcdoc = previewHTML;
            elements.iframePlaceholder.style.display = 'none';
            elements.previewFrame.style.display = 'block';
            
            // Generate full HTML for download
            state.generatedHTML = await generateFullHTML(formData);
            
            // Update output
            elements.htmlOutput.textContent = state.generatedHTML;
            
            // Enable buttons
            elements.copyBtn.disabled = false;
            elements.downloadBtn.disabled = false;
            
            // Scroll to preview
            elements.previewFrame.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        } catch (error) {
            console.error('Error generating preview:', error);
            alert('Terjadi kesalahan saat generate preview. Silakan coba lagi.');
        } finally {
            // Reset button
            elements.previewBtn.innerHTML = '<i class="fas fa-eye"></i> Preview & Generate HTML';
            elements.previewBtn.disabled = false;
        }
    }

    // Handle reset
    function handleReset() {
        if (!confirm('Reset semua input ke nilai default?')) return;
        
        // Reset form inputs
        elements.nama.value = 'John Doe';
        elements.deskripsi.value = 'Digital Creator | Web Developer | Tech Enthusiast';
        elements.footer.value = '© 2024 John Doe. All rights reserved.';
        elements.imgUrl.value = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop';
        
        // Reset photo state
        clearUpload();
        togglePhotoOption('url');
        state.profileImage = elements.imgUrl.value;
        state.uploadedImageBase64 = null;
        state.isUploadActive = false;
        
        // Reset template
        document.querySelectorAll('.template-option').forEach(opt => {
            opt.classList.remove('active');
        });
        document.querySelector('.template-option[data-template="1"]').classList.add('active');
        state.currentTemplate = '1';
        elements.template.value = '1';
        
        // Clear dynamic containers
        elements.medsosContainer.innerHTML = '';
        elements.linksContainer.innerHTML = '';
        
        // Reset preview
        elements.iframePlaceholder.style.display = 'flex';
        elements.previewFrame.style.display = 'none';
        elements.previewFrame.srcdoc = '';
        elements.htmlOutput.textContent = '// HTML akan muncul di sini...';
        
        // Disable buttons
        elements.copyBtn.disabled = true;
        elements.downloadBtn.disabled = true;
        
        // Reset preview mode
        elements.previewMode.value = 'auto';
        updatePreviewMode();
        
        // Reset global state
        state.generatedHTML = '';
        
        // Reload default values
        loadDefaultValues();
        
        // Show success message
        showToast('Form telah direset ke nilai default!');
    }

    // Handle copy HTML
    function handleCopyHTML() {
        if (!state.generatedHTML) {
            showToast('Generate preview terlebih dahulu!', 'error');
            return;
        }
        
        navigator.clipboard.writeText(state.generatedHTML).then(() => {
            // Show copy success
            elements.copyOverlay.classList.add('show');
            setTimeout(() => {
                elements.copyOverlay.classList.remove('show');
            }, 2000);
            
            showToast('HTML berhasil disalin ke clipboard!');
        }).catch(err => {
            console.error('Copy failed:', err);
            // Fallback method
            const textArea = document.createElement('textarea');
            textArea.value = state.generatedHTML;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            elements.copyOverlay.classList.add('show');
            setTimeout(() => {
                elements.copyOverlay.classList.remove('show');
            }, 2000);
            
            showToast('HTML berhasil disalin!');
        });
    }

    // Handle download HTML
    function handleDownloadHTML() {
        if (!state.generatedHTML) {
            showToast('Generate preview terlebih dahulu!', 'error');
            return;
        }
        
        const data = collectFormData();
        const filename = `linktree-${data.nama.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`;
        
        const blob = new Blob([state.generatedHTML], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast(`File ${filename} berhasil didownload!`);
    }

    // Update preview mode
    function updatePreviewMode() {
        const mode = elements.previewMode.value;
        elements.iframeContainer.setAttribute('data-mode', mode);
        
        // Update iframe width based on mode
        if (mode === 'auto') {
            elements.previewFrame.style.width = '100%';
        } else if (mode === 'desktop') {
            elements.previewFrame.style.width = '100%';
        } else if (mode === 'tablet') {
            elements.previewFrame.style.width = '768px';
        } else if (mode === 'mobile') {
            elements.previewFrame.style.width = '375px';
        }
    }

    // Show toast message
    function showToast(message, type = 'success') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-message');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast-message ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff6b6b' : '#4cd964'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
        
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
});