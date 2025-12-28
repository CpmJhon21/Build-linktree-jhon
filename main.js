// Linktree Builder Premium - Vanilla JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
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

    // Template Data
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

    // Auto-detect icon based on URL
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
        if (urlLower.includes('whatsapp') || textLower.includes('whatsapp')) return 'fa-whatsapp';
        if (urlLower.includes('tiktok.com') || textLower.includes('tiktok')) return 'fa-tiktok';
        if (urlLower.includes('reddit.com') || textLower.includes('reddit')) return 'fa-reddit';
        if (urlLower.includes('twitch.tv') || textLower.includes('twitch')) return 'fa-twitch';
        if (urlLower.includes('snapchat.com') || textLower.includes('snapchat')) return 'fa-snapchat';
        
        return 'fa-link';
    }

    // Initialize dynamic fields
    function initializeDynamicFields() {
    // ... kode sebelumnya ...
    
    // Force reflow untuk menghindari rendering issues
    setTimeout(() => {
        document.querySelectorAll('.template-option').forEach(option => {
            option.style.opacity = '1';
            option.style.transform = 'translateY(0)';
        });
        
        // Reset semua containers
        elements.medsosContainer.style.opacity = '1';
        elements.linksContainer.style.opacity = '1';
    }, 100);
}

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

        // Set default values for demo
        setDefaultValues();
    }

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

    function setDefaultValues() {
        elements.img.value = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop';
        elements.nama.value = 'John Doe';
        elements.deskripsi.value = 'Digital Creator | Web Developer | Tech Enthusiast';
        elements.footer.value = '© 2024 Your Brand. All rights reserved.';
        
        // Add default social media
        addMedsosField('github.com', 'https://github.com/username');
        addMedsosField('instagram.com', 'https://instagram.com/username');
        addMedsosField('linkedin.com', 'https://linkedin.com/in/username');
        
        // Add default links
        addLinkField('Portfolio', 'https://portfolio.example.com');
        addLinkField('Blog', 'https://blog.example.com');
        addLinkField('Projects', 'https://github.com/username?tab=repositories');
    }

    // Clean default values for reset
    function setCleanDefaultValues() {
        elements.img.value = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop';
        elements.nama.value = 'John Doe';
        elements.deskripsi.value = 'Digital Creator | Web Developer | Tech Enthusiast';
        elements.footer.value = '© 2024 Your Brand. All rights reserved.';
        
        // Add clean social media defaults
        addMedsosField('github.com', 'https://github.com/username');
        addMedsosField('instagram.com', 'https://instagram.com/username');
        addMedsosField('linkedin.com', 'https://linkedin.com/in/username');
        
        // Add clean link defaults
        addLinkField('Portfolio', 'https://portfolio.example.com');
        addLinkField('Blog', 'https://blog.example.com');
    }

    // Collect form data
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
        
        return {
            img: elements.img.value.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
            nama: elements.nama.value.trim() || 'Your Name',
            deskripsi: elements.deskripsi.value.trim() || 'Your bio description',
            medsos: medsos,
            links: links,
            footer: elements.footer.value.trim() || '© 2024 Your Brand',
            template: elements.template.value
        };
    }

    // Generate HTML for preview
    function generatePreviewHTML(data) {
        const template = templates[data.template] || templates['1'];
        
        if (!template) {
            console.error('Template not found:', data.template);
            return '<html><body><h1>Error: Template tidak ditemukan</h1></body></html>';
        }
        
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
                <title>${data.nama} - Linktree</title>
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
            </html>
        `;
    }

    // Generate full HTML for download
    function generateFullHTML(data) {
        const template = templates[data.template] || templates['1'];
        
        // Prepare social media data for Linktree.init
        const medsosData = data.medsos.map(item => ({
            platform: item.platform,
            url: item.url
        }));
        
        // Prepare links data for Linktree.init
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
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Press+Start+2P&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- Linktree Builder CSS -->
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
    
    <!-- Linktree Builder JS -->
    <script src="https://cdn.jsdelivr.net/gh/hanzcode1/LinktreeBuilder@main/script.js"></script>
    <script>
        // Initialize Linktree with your data
        Linktree.init({
            img: "${data.img}",
            nama: "${data.nama.replace(/"/g, '\\"')}",
            deskripsi: "${data.deskripsi.replace(/"/g, '\\"')}",
            medsos: ${JSON.stringify(medsosData)},
            links: ${JSON.stringify(linksData)},
            footer: "${data.footer.replace(/"/g, '\\"')}"
        });
        
        // Add custom animations
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

    // Preview button click - PERBAIKAN
    elements.previewBtn.addEventListener('click', function() {
        const data = collectFormData();
        const previewHTML = generatePreviewHTML(data);
        const fullHTML = generateFullHTML(data);
        
        // Update iframe
        elements.previewFrame.srcdoc = previewHTML;
        elements.iframePlaceholder.style.display = 'none';
        elements.previewFrame.style.display = 'block';
        
        // Update code output
        elements.htmlOutput.textContent = fullHTML;
        elements.htmlOutput.innerHTML = fullHTML;
        
        // Tambahkan styling untuk code output
        elements.htmlOutput.style.whiteSpace = 'pre-wrap';
        elements.htmlOutput.style.wordBreak = 'break-word';
        
        // Enable copy and download buttons
        elements.copyBtn.disabled = false;
        elements.downloadBtn.disabled = false;
        
        // Scroll ke preview
        elements.previewFrame.scrollIntoView({ behavior: 'smooth' });
    });

    // Copy HTML to clipboard
    elements.copyBtn.addEventListener('click', function() {
        const html = elements.htmlOutput.textContent;
        
        navigator.clipboard.writeText(html).then(() => {
            // Show copy success animation
            elements.copyOverlay.classList.add('show');
            setTimeout(() => {
                elements.copyOverlay.classList.remove('show');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Gagal menyalin ke clipboard. Silakan copy manual dari text area.');
        });
    });

    // Download HTML file
    elements.downloadBtn.addEventListener('click', function() {
        const html = elements.htmlOutput.textContent;
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
    });

    // Reset form - PERBAIKAN
    elements.resetBtn.addEventListener('click', function() {
        if (confirm('Reset semua input ke nilai default?')) {
            // Reset semua input fields
            elements.img.value = '';
            elements.nama.value = '';
            elements.deskripsi.value = '';
            elements.footer.value = '';
            
            // Clear dynamic containers
            elements.medsosContainer.innerHTML = '';
            elements.linksContainer.innerHTML = '';
            
            // Reset template selector
            document.querySelectorAll('.template-option').forEach(opt => {
                opt.classList.remove('active');
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
            elements.copyBtn.disabled = true;
            elements.downloadBtn.disabled = true;
            
            // Reset dengan default yang lebih clean
            setTimeout(() => {
                setCleanDefaultValues();
            }, 100);
        }
    });

    // Initialize the application
    initializeDynamicFields();
});