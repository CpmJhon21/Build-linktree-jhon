/**
 * Linktree Builder Premium
 * Final Working Version
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Linktree Builder Starting...');
    
    // ==================== DOM ELEMENTS ====================
    const elements = {
        img: document.getElementById('img'),
        nama: document.getElementById('nama'),
        deskripsi: document.getElementById('deskripsi'),
        footer: document.getElementById('footer'),
        template: document.getElementById('template'),
        medsosContainer: document.getElementById('medsos-container'),
        linksContainer: document.getElementById('links-container'),
        addMedsosBtn: document.getElementById('add-medsos'),
        addLinkBtn: document.getElementById('add-link'),
        previewBtn: document.getElementById('preview-btn'),
        resetBtn: document.getElementById('reset-btn'),
        copyBtn: document.getElementById('copy-btn'),
        downloadBtn: document.getElementById('download-btn'),
        previewFrame: document.getElementById('preview-frame'),
        htmlOutput: document.getElementById('html-output'),
        iframePlaceholder: document.getElementById('iframe-placeholder'),
        copyOverlay: document.getElementById('copy-overlay')
    };
    
    // Debug: Check if elements exist
    console.log('✅ Elements found:', Object.keys(elements).filter(key => elements[key] !== null).length);
    
    // ==================== TEMPLATES ====================
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
            `
        }
    };
    
    // ==================== ICON DETECTION ====================
    function detectIcon(url, platform = '', text = '') {
        const str = (url + ' ' + platform + ' ' + text).toLowerCase();
        
        const iconMap = {
            'youtube': 'fa-youtube',
            'github': 'fa-github',
            'instagram': 'fa-instagram',
            'linkedin': 'fa-linkedin',
            'twitter': 'fa-x-twitter',
            'x.com': 'fa-x-twitter',
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
            'website': 'fa-globe',
            'blog': 'fa-blog',
            'store': 'fa-store',
            'shop': 'fa-shopping-bag',
            'donate': 'fa-heart',
            'support': 'fa-hand-holding-heart',
            'email': 'fa-envelope',
            'mail': 'fa-envelope',
            'calendar': 'fa-calendar',
            'event': 'fa-calendar-alt',
            'file': 'fa-file',
            'document': 'fa-file-alt',
            'download': 'fa-download',
            'video': 'fa-video',
            'music': 'fa-music',
            'podcast': 'fa-podcast',
            'book': 'fa-book',
            'newsletter': 'fa-newspaper'
        };
        
        for (const [keyword, icon] of Object.entries(iconMap)) {
            if (str.includes(keyword)) {
                return icon;
            }
        }
        
        return 'fa-link';
    }
    
    // ==================== URL FORMATTING ====================
    function formatURL(url, platform = '') {
        if (!url) return '';
        
        url = url.trim();
        
        // Jika sudah ada http:// atau https://, biarkan
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        
        // Jika hanya username (tanpa . dan tanpa /)
        if (!url.includes('.') && !url.includes('/') && !url.includes('@')) {
            if (platform) {
                // Special cases
                if (platform === 'whatsapp') {
                    return `https://wa.me/${url.replace(/\D/g, '')}`;
                }
                if (platform === 'telegram') {
                    return `https://t.me/${url.replace('@', '')}`;
                }
                return `https://${platform}.com/${url}`;
            }
            return `https://${url}.com`;
        }
        
        // Jika dimulai dengan @
        if (url.startsWith('@')) {
            if (platform) {
                return `https://${platform}.com/${url.substring(1)}`;
            }
            return `https://instagram.com/${url.substring(1)}`; // Default to Instagram
        }
        
        // Jika ada www. tapi tanpa https://
        if (url.startsWith('www.')) {
            return 'https://' + url;
        }
        
        // Jika ada domain tapi tanpa protokol
        if (url.includes('.') && !url.includes('://')) {
            return 'https://' + url;
        }
        
        return url;
    }
    
    // ==================== DYNAMIC FIELDS ====================
    
    // Add Social Media Field
    function addMedsosField(platform = '', url = '') {
        console.log('➕ Adding social media field');
        
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <select class="platform-select">
                <option value="">Pilih Platform</option>
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                <option value="github">GitHub</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter/X</option>
                <option value="facebook">Facebook</option>
                <option value="telegram">Telegram</option>
                <option value="discord">Discord</option>
                <option value="spotify">Spotify</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="tiktok">TikTok</option>
                <option value="reddit">Reddit</option>
                <option value="twitch">Twitch</option>
                <option value="snapchat">Snapchat</option>
            </select>
            <input type="text" class="url-input" placeholder="username atau URL" value="${url || ''}">
            <button type="button" class="btn-remove"><i class="fas fa-times"></i></button>
        `;
        
        elements.medsosContainer.appendChild(div);
        
        if (platform) {
            div.querySelector('.platform-select').value = platform;
        }
        
        // Setup event listeners
        const removeBtn = div.querySelector('.btn-remove');
        removeBtn.addEventListener('click', function() {
            div.remove();
        });
        
        // Auto-update placeholder
        const select = div.querySelector('.platform-select');
        const input = div.querySelector('.url-input');
        
        select.addEventListener('change', function() {
            if (this.value === 'whatsapp') {
                input.placeholder = '628123456789 (nomor WhatsApp)';
            } else if (this.value === 'telegram') {
                input.placeholder = '@username';
            } else if (this.value) {
                input.placeholder = `${this.value}.com/username`;
            } else {
                input.placeholder = 'username atau URL';
            }
        });
        
        return div;
    }
    
    // Add Custom Link Field
    function addLinkField(platform = '', text = '', url = '') {
        console.log('🔗 Adding custom link field');
        
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <select class="link-platform-select">
                <option value="">Pilih Tipe</option>
                <option value="website">Website/Blog</option>
                <option value="portfolio">Portfolio</option>
                <option value="store">Online Store</option>
                <option value="donate">Donasi/Support</option>
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                <option value="github">GitHub</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter/X</option>
                <option value="facebook">Facebook</option>
                <option value="telegram">Telegram</option>
                <option value="discord">Discord</option>
                <option value="spotify">Spotify</option>
                <option value="tiktok">TikTok</option>
                <option value="reddit">Reddit</option>
                <option value="twitch">Twitch</option>
                <option value="email">Email</option>
                <option value="calendar">Kalender</option>
                <option value="file">File/Dokumen</option>
                <option value="other">Lainnya</option>
            </select>
            <input type="text" class="link-text" placeholder="Nama link" value="${text || ''}">
            <input type="text" class="link-url" placeholder="https://example.com" value="${url || ''}">
            <button type="button" class="btn-remove"><i class="fas fa-times"></i></button>
        `;
        
        elements.linksContainer.appendChild(div);
        
        if (platform) {
            div.querySelector('.link-platform-select').value = platform;
        }
        
        // Setup event listeners
        const removeBtn = div.querySelector('.btn-remove');
        removeBtn.addEventListener('click', function() {
            div.remove();
        });
        
        // Auto-fill text based on platform
        const platformSelect = div.querySelector('.link-platform-select');
        const textInput = div.querySelector('.link-text');
        const urlInput = div.querySelector('.link-url');
        
        platformSelect.addEventListener('change', function() {
            const platform = this.value;
            
            // Auto-fill text
            if (platform && !textInput.value) {
                const textMap = {
                    'website': 'Website Saya',
                    'portfolio': 'Portfolio',
                    'store': 'Toko Online',
                    'donate': 'Dukung Saya',
                    'youtube': 'YouTube Channel',
                    'instagram': 'Instagram',
                    'github': 'GitHub',
                    'linkedin': 'LinkedIn',
                    'twitter': 'Twitter/X',
                    'facebook': 'Facebook',
                    'telegram': 'Telegram',
                    'discord': 'Discord',
                    'spotify': 'Spotify',
                    'tiktok': 'TikTok',
                    'reddit': 'Reddit',
                    'twitch': 'Twitch',
                    'email': 'Email Saya',
                    'calendar': 'Kalender',
                    'file': 'Dokumen',
                    'other': 'Link Lainnya'
                };
                
                if (textMap[platform]) {
                    textInput.value = textMap[platform];
                }
            }
            
            // Auto-update placeholder
            if (platform === 'email') {
                urlInput.placeholder = 'email@example.com';
            } else if (platform === 'website' || platform === 'portfolio' || platform === 'store') {
                urlInput.placeholder = 'https://example.com';
            } else if (platform && platform !== 'other' && platform !== 'donate') {
                urlInput.placeholder = `https://${platform}.com/username`;
            } else {
                urlInput.placeholder = 'https://example.com';
            }
        });
        
        return div;
    }
    
    // ==================== DATA COLLECTION ====================
    function collectFormData() {
        const medsos = [];
        const links = [];
        
        // Collect social media
        elements.medsosContainer.querySelectorAll('.dynamic-item').forEach(item => {
            const platform = item.querySelector('.platform-select').value;
            const url = item.querySelector('.url-input').value.trim();
            
            if (platform && url) {
                const formattedUrl = formatURL(url, platform);
                medsos.push({
                    platform: platform,
                    url: formattedUrl,
                    icon: detectIcon(formattedUrl, platform)
                });
            }
        });
        
        // Collect custom links
        elements.linksContainer.querySelectorAll('.dynamic-item').forEach(item => {
            const platform = item.querySelector('.link-platform-select').value;
            const text = item.querySelector('.link-text').value.trim();
            const url = item.querySelector('.link-url').value.trim();
            
            if (text && url) {
                const formattedUrl = formatURL(url, platform);
                links.push({
                    platform: platform,
                    text: text,
                    url: formattedUrl,
                    icon: detectIcon(formattedUrl, platform, text)
                });
            }
        });
        
        return {
            img: elements.img.value.trim(),
            nama: elements.nama.value.trim(),
            deskripsi: elements.deskripsi.value.trim(),
            medsos: medsos,
            links: links,
            footer: elements.footer.value.trim(),
            template: elements.template.value || '1'
        };
    }
    
    // ==================== HTML GENERATION ====================
    function generatePreviewHTML(data) {
        const template = templates[data.template] || templates['1'];
        
        // Social media buttons
        let medsosHTML = '';
        if (data.medsos.length > 0) {
            medsosHTML = '<div class="social-links">';
            data.medsos.forEach(item => {
                medsosHTML += `
                    <a href="${item.url}" target="_blank" class="linktree-btn medsos-btn" rel="noopener noreferrer">
                        <i class="fab ${item.icon}"></i>
                    </a>
                `;
            });
            medsosHTML += '</div>';
        }
        
        // Custom links
        let linksHTML = '';
        if (data.links.length > 0) {
            linksHTML = '<div class="links-container">';
            data.links.forEach(item => {
                linksHTML += `
                    <a href="${item.url}" target="_blank" class="linktree-btn custom-link" rel="noopener noreferrer">
                        <i class="fas ${item.icon}"></i>
                        <span>${item.text}</span>
                    </a>
                `;
            });
            linksHTML += '</div>';
        }
        
        return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.nama || 'Linktree'} - Linktree</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
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
            cursor: pointer;
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
        ${data.img ? `<img src="${data.img}" alt="${data.nama || 'Profile'}" class="profile-img">` : ''}
        ${data.nama ? `<h1 class="profile-name">${data.nama}</h1>` : ''}
        ${data.deskripsi ? `<p class="profile-bio">${data.deskripsi}</p>` : ''}
        
        ${medsosHTML}
        ${linksHTML}
        
        ${data.footer ? `<p class="footer-text">${data.footer}</p>` : ''}
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
    
    function generateFullHTML(data) {
        const template = templates[data.template] || templates['1'];
        
        const fallbackImg = data.img || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop';
        const fallbackName = data.nama || 'Your Name';
        const fallbackBio = data.deskripsi || 'Your bio description';
        const fallbackFooter = data.footer || '© 2024 Your Brand';
        
        return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fallbackName} - Linktree</title>
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
            img: "${fallbackImg}",
            nama: "${fallbackName.replace(/"/g, '\\"')}",
            deskripsi: "${fallbackBio.replace(/"/g, '\\"')}",
            medsos: ${JSON.stringify(data.medsos)},
            links: ${JSON.stringify(data.links)},
            footer: "${fallbackFooter.replace(/"/g, '\\"')}"
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
    
    // ==================== EVENT HANDLERS ====================
    function handlePreview() {
        console.log('👁️ Generating preview...');
        
        const data = collectFormData();
        
        // Validation
        if (!data.nama || !data.deskripsi) {
            alert('⚠️ Harap isi Nama dan Deskripsi terlebih dahulu');
            return;
        }
        
        if (data.medsos.length === 0 && data.links.length === 0) {
            alert('🔗 Tambahkan minimal satu link (media sosial atau custom link)');
            return;
        }
        
        // Generate preview
        const previewHTML = generatePreviewHTML(data);
        const fullHTML = generateFullHTML(data);
        
        // Update iframe
        elements.previewFrame.srcdoc = previewHTML;
        elements.iframePlaceholder.style.display = 'none';
        elements.previewFrame.style.display = 'block';
        
        // Update code output
        elements.htmlOutput.textContent = fullHTML;
        
        // Enable buttons
        elements.copyBtn.disabled = false;
        elements.downloadBtn.disabled = false;
        
        console.log('✅ Preview generated successfully');
    }
    
    function handleReset() {
        console.log('🔄 Resetting form...');
        
        if (!confirm('Reset semua input? Semua data akan dihapus.')) {
            return;
        }
        
        // Clear all inputs
        elements.img.value = '';
        elements.nama.value = '';
        elements.deskripsi.value = '';
        elements.footer.value = '';
        
        // Clear dynamic containers
        elements.medsosContainer.innerHTML = '';
        elements.linksContainer.innerHTML = '';
        
        // Reset template selector
        document.querySelectorAll('.template-option').forEach(option => {
            option.classList.remove('active');
        });
        const defaultTemplate = document.querySelector('.template-option[data-template="1"]');
        if (defaultTemplate) {
            defaultTemplate.classList.add('active');
        }
        elements.template.value = '1';
        
        // Reset preview
        elements.iframePlaceholder.style.display = 'flex';
        elements.previewFrame.style.display = 'none';
        elements.previewFrame.srcdoc = '';
        
        // Reset code output
        elements.htmlOutput.textContent = '// HTML akan muncul di sini...';
        
        // Disable buttons
        elements.copyBtn.disabled = true;
        elements.downloadBtn.disabled = true;
        
        // Add empty fields
        setTimeout(() => {
            addMedsosField();
            addLinkField();
        }, 100);
        
        console.log('✅ Form reset complete');
    }
    
    async function handleCopy() {
        console.log('📋 Copying HTML to clipboard...');
        
        const html = elements.htmlOutput.textContent;
        
        try {
            await navigator.clipboard.writeText(html);
            elements.copyOverlay.classList.add('show');
            setTimeout(() => {
                elements.copyOverlay.classList.remove('show');
            }, 2000);
            console.log('✅ HTML copied to clipboard');
        } catch (err) {
            console.error('❌ Failed to copy:', err);
            
            // Fallback method
            const textArea = document.createElement('textarea');
            textArea.value = html;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                elements.copyOverlay.classList.add('show');
                setTimeout(() => {
                    elements.copyOverlay.classList.remove('show');
                }, 2000);
            } catch (fallbackErr) {
                console.error('❌ Fallback copy failed:', fallbackErr);
                alert('Gagal menyalin. Silakan copy manual dari text area.');
            }
            
            document.body.removeChild(textArea);
        }
    }
    
    function handleDownload() {
        console.log('💾 Downloading HTML file...');
        
        const html = elements.htmlOutput.textContent;
        const data = collectFormData();
        const filename = `linktree-${data.nama.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'my-linktree'}.html`;
        
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ File downloaded:', filename);
    }
    
    // ==================== INITIALIZATION ====================
    function initialize() {
        console.log('⚡ Initializing Linktree Builder...');
        
        // Setup event listeners
        elements.addMedsosBtn.addEventListener('click', () => addMedsosField());
        elements.addLinkBtn.addEventListener('click', () => addLinkField());
        elements.previewBtn.addEventListener('click', handlePreview);
        elements.resetBtn.addEventListener('click', handleReset);
        elements.copyBtn.addEventListener('click', handleCopy);
        elements.downloadBtn.addEventListener('click', handleDownload);
        
        // Template selector
        document.querySelectorAll('.template-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.template-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                this.classList.add('active');
                elements.template.value = this.dataset.template;
            });
        });
        
        // Start with empty form
        handleReset();
        
        console.log('🎉 Linktree Builder initialized successfully!');
    }
    
    // Start the application
    initialize();
});
