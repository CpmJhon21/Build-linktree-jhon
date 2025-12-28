/**
 * Linktree Builder Premium
 * Clean and Simple Implementation
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Linktree Builder Premium - Loading...');
    
    // DOM Elements
    const elements = {
        // Form elements
        img: document.getElementById('img'),
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
        copyOverlay: document.getElementById('copy-overlay')
    };
    
    // State
    let state = {
        hasPreview: false,
        currentTemplate: '1'
    };
    
    // Templates
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
    
    // Utility Functions
    function autoDetectIcon(url, text = '') {
        const urlLower = url.toLowerCase();
        const textLower = text.toLowerCase();
        
        if (urlLower.includes('youtube.com') || textLower.includes('youtube')) return 'fa-youtube';
        if (urlLower.includes('github.com') || textLower.includes('github')) return 'fa-github';
        if (urlLower.includes('instagram.com') || textLower.includes('instagram')) return 'fa-instagram';
        if (urlLower.includes('linkedin.com') || textLower.includes('linkedin')) return 'fa-linkedin';
        if (urlLower.includes('twitter.com') || urlLower.includes('x.com') || textLower.includes('twitter')) return 'fa-x-twitter';
        if (urlLower.includes('facebook.com') || textLower.includes('facebook')) return 'fa-facebook';
        if (urlLower.includes('t.me') || textLower.includes('telegram')) return 'fa-telegram';
        if (urlLower.includes('discord.com') || textLower.includes('discord')) return 'fa-discord';
        if (urlLower.includes('spotify.com') || textLower.includes('spotify')) return 'fa-spotify';
        
        return 'fa-link';
    }
    
    function formatURL(url) {
        if (!url) return '';
        
        // Trim dan lowercase
        url = url.trim().toLowerCase();
        
        // Jika sudah https://, biarkan
        if (url.startsWith('https://')) return url;
        
        // Jika http://, ganti ke https://
        if (url.startsWith('http://')) return 'https://' + url.substring(7);
        
        // Jika tidak ada protokol
        if (!url.includes('://')) {
            // Jika ada www.
            if (url.startsWith('www.')) return 'https://' + url;
            
            // Jika ada titik (domain)
            if (url.includes('.')) return 'https://www.' + url;
            
            // Jika hanya username
            return 'https://www.' + url + '.com';
        }
        
        return url;
    }
    
    function validateURL(url) {
        if (!url) return false;
        
        // Basic validation
        try {
            const formatted = formatURL(url);
            new URL(formatted);
            return true;
        } catch {
            return false;
        }
    }
    
    // Dynamic Fields Functions
    function addMedsosField(platform = '', url = '') {
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <select class="platform-select" autocomplete="off">
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
                <option value="tiktok">TikTok</option>
            </select>
            <input type="text" class="url-input" placeholder="username atau link" value="${url || ''}" autocomplete="off">
            <button type="button" class="btn-remove"><i class="fas fa-times"></i></button>
        `;
        
        elements.medsosContainer.appendChild(div);
        
        // Set platform if provided
        if (platform) {
            div.querySelector('.platform-select').value = platform;
        }
        
        // Add event listeners
        const removeBtn = div.querySelector('.btn-remove');
        removeBtn.addEventListener('click', function() {
            div.remove();
        });
        
        // Update placeholder based on platform
        const platformSelect = div.querySelector('.platform-select');
        const urlInput = div.querySelector('.url-input');
        
        platformSelect.addEventListener('change', function() {
            if (this.value) {
                urlInput.placeholder = `${this.value}.com/username`;
            } else {
                urlInput.placeholder = 'username atau link';
            }
        });
    }
    
    function addLinkField(text = '', url = '') {
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <input type="text" class="link-text" placeholder="Nama link" value="${text || ''}" autocomplete="off">
            <input type="text" class="link-url" placeholder="https://example.com" value="${url || ''}" autocomplete="off">
            <button type="button" class="btn-remove"><i class="fas fa-times"></i></button>
        `;
        
        elements.linksContainer.appendChild(div);
        
        // Add event listener
        const removeBtn = div.querySelector('.btn-remove');
        removeBtn.addEventListener('click', function() {
            div.remove();
        });
    }
    
    // Data Collection
    function collectFormData() {
        const medsos = [];
        const links = [];
        
        // Collect social media
        elements.medsosContainer.querySelectorAll('.dynamic-item').forEach(item => {
            const platform = item.querySelector('.platform-select').value;
            const url = item.querySelector('.url-input').value.trim();
            
            if (platform && url) {
                medsos.push({
                    platform: platform,
                    url: formatURL(url)
                });
            }
        });
        
        // Collect custom links
        elements.linksContainer.querySelectorAll('.dynamic-item').forEach(item => {
            const text = item.querySelector('.link-text').value.trim();
            const url = item.querySelector('.link-url').value.trim();
            
            if (text && url) {
                links.push({
                    text: text,
                    url: formatURL(url),
                    icon: autoDetectIcon(url, text)
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
    
    // HTML Generation
    function generatePreviewHTML(data) {
        const template = templates[data.template] || templates['1'];
        
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
        
        return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.nama || 'Linktree'} - Linktree</title>
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
        
        ${medsosButtons ? `<div class="social-links">${medsosButtons}</div>` : ''}
        ${customLinks ? `<div class="links-container">${customLinks}</div>` : ''}
        
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
        
        const medsosData = data.medsos.map(item => ({
            platform: item.platform,
            url: item.url
        }));
        
        const linksData = data.links.map(item => ({
            text: item.text,
            url: item.url,
            icon: autoDetectIcon(item.url, item.text)
        }));
        
        // Fallback values
        const fallbackImg = data.img || 'https://via.placeholder.com/400x400/2b2b2b/ffffff?text=Profile';
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
            medsos: ${JSON.stringify(medsosData)},
            links: ${JSON.stringify(linksData)},
            footer: "${fallbackFooter.replace(/"/g, '\\"')}"
        });
    </script>
</body>
</html>`;
    }
    
    // Event Handlers
    function handlePreview() {
        const data = collectFormData();
        
        // Validasi minimal
        if (!data.nama || !data.deskripsi) {
            alert('Harap isi Nama dan Deskripsi terlebih dahulu');
            return;
        }
        
        if (data.medsos.length === 0 && data.links.length === 0) {
            alert('Tambahkan minimal satu link (media sosial atau custom link)');
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
        
        // Update state
        state.hasPreview = true;
        state.currentTemplate = data.template;
    }
    
    function handleReset() {
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
        
        // Reset template
        document.querySelectorAll('.template-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector('.template-option[data-template="1"]').classList.add('active');
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
        
        // Reset state
        state.hasPreview = false;
        state.currentTemplate = '1';
        
        // Add empty fields
        addMedsosField();
        addLinkField();
    }
    
    function handleCopy() {
        const html = elements.htmlOutput.textContent;
        
        navigator.clipboard.writeText(html).then(() => {
            elements.copyOverlay.classList.add('show');
            setTimeout(() => {
                elements.copyOverlay.classList.remove('show');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Gagal menyalin. Silakan copy manual dari text area.');
        });
    }
    
    function handleDownload() {
        const html = elements.htmlOutput.textContent;
        const data = collectFormData();
        const filename = `linktree-${data.nama.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'linktree'}.html`;
        
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Initialize
    function initialize() {
        console.log('Linktree Builder Premium - Initializing...');
        
        // Add event listeners
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
        
        console.log('Linktree Builder Premium - Ready!');
    }
    
    // Start the application
    initialize();
});
