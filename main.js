// Linktree Builder Premium - Simplified Fixed Version
document.addEventListener('DOMContentLoaded', function() {
    console.log('Linktree Builder - Starting initialization');
    
    // DOM Elements dengan validasi
    const elements = {};
    const elementIds = [
        'img', 'nama', 'deskripsi', 'footer', 'template',
        'medsos-container', 'links-container', 'add-medsos', 'add-link',
        'preview-btn', 'reset-btn', 'copy-btn', 'download-btn',
        'preview-frame', 'html-output', 'iframe-placeholder', 'copy-overlay'
    ];
    
    elementIds.forEach(id => {
        elements[id] = document.getElementById(id);
        if (!elements[id]) {
            console.error(`Element with ID "${id}" not found!`);
        }
    });
    
    // Template Data (sama seperti sebelumnya)
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
    
    // Fungsi untuk auto-detect icon
    function autoDetectIcon(url, text = '') {
        const urlLower = url.toLowerCase();
        const textLower = text.toLowerCase();
        
        const iconMap = {
            'youtube': 'fa-youtube',
            'github': 'fa-github',
            'instagram': 'fa-instagram',
            'linkedin': 'fa-linkedin',
            'twitter': 'fa-x-twitter',
            'x.com': 'fa-x-twitter',
            'facebook': 'fa-facebook',
            't.me': 'fa-telegram',
            'discord': 'fa-discord',
            'spotify': 'fa-spotify',
            'whatsapp': 'fa-whatsapp',
            'tiktok': 'fa-tiktok',
            'reddit': 'fa-reddit',
            'twitch': 'fa-twitch',
            'snapchat': 'fa-snapchat'
        };
        
        for (const [keyword, icon] of Object.entries(iconMap)) {
            if (urlLower.includes(keyword) || textLower.includes(keyword)) {
                return icon;
            }
        }
        
        return 'fa-link';
    }
    
    // Inisialisasi aplikasi
    function initializeApp() {
        console.log('Initializing app...');
        
        // Set default values
        setDefaultValues();
        
        // Setup event listeners
        setupEventListeners();
        
        console.log('App initialized successfully');
    }
    
    // Set default values
    function setDefaultValues() {
        console.log('Setting default values');
        
        // Set nilai default untuk input utama
        elements.img.value = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop';
        elements.nama.value = 'John Doe';
        elements.deskripsi.value = 'Digital Creator | Web Developer | Tech Enthusiast';
        elements.footer.value = '© 2024 Your Brand. All rights reserved.';
        elements.template.value = '1';
        
        // Kosongkan container dinamis
        elements['medsos-container'].innerHTML = '';
        elements['links-container'].innerHTML = '';
        
        // Tambahkan default social media
        addMedsosField('github.com', 'https://github.com/username');
        addMedsosField('instagram.com', 'https://instagram.com/username');
        addMedsosField('linkedin.com', 'https://linkedin.com/in/username');
        
        // Tambahkan default links
        addLinkField('Portfolio', 'https://portfolio.example.com');
        addLinkField('Blog', 'https://blog.example.com');
        addLinkField('Projects', 'https://github.com/username?tab=repositories');
        
        // Set template selector active state
        document.querySelectorAll('.template-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.template === '1') {
                option.classList.add('active');
            }
        });
    }
    
    // Tambah field media sosial
    function addMedsosField(platform = '', url = '') {
        const container = elements['medsos-container'];
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
            <input type="text" class="url-input" placeholder="URL lengkap (https://...)" value="${url}" autocomplete="off">
            <button type="button" class="btn-remove"><i class="fas fa-times"></i></button>
        `;
        
        container.appendChild(div);
        
        if (platform) {
            div.querySelector('.platform-select').value = platform;
        }
        
        // Tambahkan event listener untuk remove button
        div.querySelector('.btn-remove').addEventListener('click', () => div.remove());
    }
    
    // Tambah field link custom
    function addLinkField(text = '', url = '') {
        const container = elements['links-container'];
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <input type="text" class="link-text" placeholder="Teks Link" value="${text}" autocomplete="off">
            <input type="text" class="link-url" placeholder="URL tujuan" value="${url}" autocomplete="off">
            <button type="button" class="btn-remove"><i class="fas fa-times"></i></button>
        `;
        
        container.appendChild(div);
        
        // Tambahkan event listener untuk remove button
        div.querySelector('.btn-remove').addEventListener('click', () => div.remove());
    }
    
    // Setup semua event listeners
    function setupEventListeners() {
        console.log('Setting up event listeners');
        
        // Add media sosial button
        elements['add-medsos'].addEventListener('click', () => addMedsosField());
        
        // Add link button
        elements['add-link'].addEventListener('click', () => addLinkField());
        
        // Template selector
        document.querySelectorAll('.template-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.template-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                this.classList.add('active');
                elements.template.value = this.dataset.template;
                
                // Jika preview sudah aktif, update
                if (elements['preview-frame'].style.display === 'block') {
                    generatePreview();
                }
            });
        });
        
        // Preview button
        elements['preview-btn'].addEventListener('click', generatePreview);
        
        // Reset button
        elements['reset-btn'].addEventListener('click', resetForm);
        
        // Copy button
        elements['copy-btn'].addEventListener('click', copyHTML);
        
        // Download button
        elements['download-btn'].addEventListener('click', downloadHTML);
    }
    
    // Kumpulkan data dari form
    function collectFormData() {
        const medsos = [];
        const links = [];
        
        // Kumpulkan media sosial
        elements['medsos-container'].querySelectorAll('.dynamic-item').forEach(item => {
            const platform = item.querySelector('.platform-select').value;
            const url = item.querySelector('.url-input').value.trim();
            
            if (platform && url) {
                medsos.push({ platform, url });
            }
        });
        
        // Kumpulkan custom links
        elements['links-container'].querySelectorAll('.dynamic-item').forEach(item => {
            const text = item.querySelector('.link-text').value.trim();
            const url = item.querySelector('.link-url').value.trim();
            
            if (text && url) {
                const icon = autoDetectIcon(url, text);
                links.push({ text, url, icon });
            }
        });
        
        return {
            img: elements.img.value.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
            nama: elements.nama.value.trim() || 'Your Name',
            deskripsi: elements.deskripsi.value.trim() || 'Your bio description',
            medsos: medsos,
            links: links,
            footer: elements.footer.value.trim() || '© 2024 Your Brand',
            template: elements.template.value || '1'
        };
    }
    
    // Generate preview HTML
    function generatePreviewHTML(data) {
        const template = templates[data.template] || templates['1'];
        
        // Generate social media buttons
        const medsosButtons = data.medsos.map(item => {
            const icon = autoDetectIcon(item.url);
            return `<a href="${item.url}" target="_blank" class="linktree-btn medsos-btn"><i class="fab ${icon}"></i></a>`;
        }).join('\n');
        
        // Generate custom links
        const customLinks = data.links.map(item => {
            return `<a href="${item.url}" target="_blank" class="linktree-btn custom-link"><i class="fas ${item.icon}"></i>${item.text}</a>`;
        }).join('\n');
        
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.nama} - Linktree</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Press+Start+2P&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        ${template.style}
        * { margin: 0; padding: 0; box-sizing: border-box; }
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
        }
        .custom-link i { font-size: 1.1rem; }
        .footer-text {
            font-size: 0.9rem;
            opacity: 0.7;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
            .linktree-container { padding: 25px 20px; }
            .profile-name { font-size: 1.5rem; }
        }
    </style>
</head>
<body>
    <div class="linktree-container">
        <img src="${data.img}" alt="${data.nama}" class="profile-img">
        <h1 class="profile-name">${data.nama}</h1>
        <p class="profile-bio">${data.deskripsi}</p>
        
        <div class="social-links">
            ${medsosButtons}
        </div>
        
        <div class="links-container">
            ${customLinks}
        </div>
        
        <p class="footer-text">${data.footer}</p>
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
    
    // Generate full HTML untuk download
    function generateFullHTML(data) {
        const template = templates[data.template] || templates['1'];
        
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
    <title>${data.nama} - Linktree</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Press+Start+2P&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hanzcode1/LinktreeBuilder@main/style.css">
    <style>
        ${template.style}
        * { margin: 0; padding: 0; box-sizing: border-box; }
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
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
            .linktree-container { padding: 25px 20px; }
        }
    </style>
</head>
<body>
    <div id="linktree-app"></div>
    
    <script src="https://cdn.jsdelivr.net/gh/hanzcode1/LinktreeBuilder@main/script.js"></script>
    <script>
        Linktree.init({
            img: "${data.img}",
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
    
    // Fungsi generate preview
    function generatePreview() {
        console.log('Generating preview...');
        const data = collectFormData();
        
        // Update iframe
        const previewHTML = generatePreviewHTML(data);
        elements['preview-frame'].srcdoc = previewHTML;
        elements['iframe-placeholder'].style.display = 'none';
        elements['preview-frame'].style.display = 'block';
        
        // Update code output
        const fullHTML = generateFullHTML(data);
        elements['html-output'].textContent = fullHTML;
        
        // Enable buttons
        elements['copy-btn'].disabled = false;
        elements['download-btn'].disabled = false;
        
        console.log('Preview generated');
    }
    
    // Fungsi reset form
    function resetForm() {
        if (confirm('Reset semua input ke nilai default?')) {
            console.log('Resetting form...');
            
            // Reset semua input
            elements.img.value = '';
            elements.nama.value = '';
            elements.deskripsi.value = '';
            elements.footer.value = '';
            elements.template.value = '1';
            
            // Kosongkan container dinamis
            elements['medsos-container'].innerHTML = '';
            elements['links-container'].innerHTML = '';
            
            // Reset preview
            elements['iframe-placeholder'].style.display = 'flex';
            elements['preview-frame'].style.display = 'none';
            elements['preview-frame'].srcdoc = '';
            
            // Reset code output
            elements['html-output'].textContent = '// HTML akan muncul di sini...';
            elements['copy-btn'].disabled = true;
            elements['download-btn'].disabled = true;
            
            // Set template selector
            document.querySelectorAll('.template-option').forEach(option => {
                option.classList.remove('active');
                if (option.dataset.template === '1') {
                    option.classList.add('active');
                }
            });
            
            // Set default values
            setTimeout(setDefaultValues, 50);
            
            console.log('Form reset complete');
        }
    }
    
    // Fungsi copy HTML
    function copyHTML() {
        const html = elements['html-output'].textContent;
        navigator.clipboard.writeText(html).then(() => {
            elements['copy-overlay'].classList.add('show');
            setTimeout(() => {
                elements['copy-overlay'].classList.remove('show');
            }, 2000);
            console.log('HTML copied to clipboard');
        }).catch(err => {
            console.error('Copy failed:', err);
            alert('Gagal menyalin ke clipboard. Silakan copy manual.');
        });
    }
    
    // Fungsi download HTML
    function downloadHTML() {
        const html = elements['html-output'].textContent;
        const data = collectFormData();
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
        
        console.log('File downloaded:', filename);
    }
    
    // Initialize the app
    initializeApp();
});