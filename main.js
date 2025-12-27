// Linktree Builder Premium - Vanilla JavaScript
// Perbaikan: Template CSS diisolasi, tidak bocor ke builder
// Fitur baru: Upload foto profil ke Base64

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        imgMode: document.getElementById('img-mode'),
        imgUrl: document.getElementById('img-url'),
        imgUpload: document.getElementById('img-upload'),
        imgBase64: document.getElementById('img-base64'),
        uploadPreview: document.getElementById('upload-preview'),
        uploadStatus: document.getElementById('upload-status'),
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

    // Variabel untuk menyimpan data Base64
    let uploadedImageBase64 = '';

    // Template data dengan fetch URL ke CSS lokal
    const templates = {
        '1': {
            name: 'Pixel Modern',
            font: '"Press Start 2P", cursive',
            cssUrl: 'templates/template1.css'
        },
        '2': {
            name: 'Minimal Clean',
            font: '"Poppins", sans-serif',
            cssUrl: 'templates/template2.css'
        },
        '3': {
            name: 'Cyber Neon',
            font: '"Poppins", sans-serif',
            cssUrl: 'templates/template3.css'
        }
    };

    // Auto-detect icon berdasarkan URL
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

    // Initialize dynamic fields dan event listeners
    function initializeDynamicFields() {
        // Add media sosial field
        elements.addMedsosBtn.addEventListener('click', function() {
            addMedsosField();
        });

        // Add custom link field
        elements.addLinkBtn.addEventListener('click', function() {
            addLinkField();
        });

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

        // Upload file handler
        elements.imgUpload.addEventListener('change', handleImageUpload);

        // Upload preview click handler
        elements.uploadPreview.addEventListener('click', function() {
            elements.imgUpload.click();
        });

        // Set default values for demo
        setDefaultValues();
    }

    // Fungsi handle upload gambar ke Base64
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validasi ukuran file (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            elements.uploadStatus.textContent = 'File terlalu besar! Maksimal 2MB.';
            elements.uploadStatus.style.color = '#ff6b6b';
            return;
        }

        // Validasi tipe file
        if (!file.type.startsWith('image/')) {
            elements.uploadStatus.textContent = 'File harus berupa gambar!';
            elements.uploadStatus.style.color = '#ff6b6b';
            return;
        }

        elements.uploadStatus.textContent = 'Mengupload...';
        elements.uploadStatus.style.color = '#4cd964';

        const reader = new FileReader();
        
        reader.onload = function(e) {
            uploadedImageBase64 = e.target.result;
            elements.imgBase64.value = uploadedImageBase64;
            
            // Update preview
            elements.uploadPreview.innerHTML = `
                <img src="${uploadedImageBase64}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 2px solid #00dbde;">
                <span style="display: block; margin-top: 10px;">Gambar siap digunakan!</span>
            `;
            
            elements.uploadStatus.textContent = 'Upload berhasil!';
            elements.uploadStatus.style.color = '#4cd964';
        };
        
        reader.onerror = function() {
            elements.uploadStatus.textContent = 'Gagal membaca file!';
            elements.uploadStatus.style.color = '#ff6b6b';
        };
        
        reader.readAsDataURL(file);
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
        // Add default social media
        addMedsosField('github.com', 'https://github.com/username');
        addMedsosField('youtube.com', 'https://youtube.com/c/username');
        addMedsosField('instagram.com', 'https://instagram.com/username');
        
        // Add default links
        addLinkField('Portfolio', 'https://portfolio.example.com');
        addLinkField('Blog', 'https://blog.example.com');
        addLinkField('Projects', 'https://github.com/username?tab=repositories');
    }

    // Collect form data dengan support Base64
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
        
        // Tentukan sumber gambar (URL atau Base64)
        let imgSource = elements.imgUrl.value.trim();
        if (elements.imgMode.value === 'upload' && uploadedImageBase64) {
            imgSource = uploadedImageBase64;
        }
        
        return {
            img: imgSource || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
            nama: elements.nama.value.trim() || 'Your Name',
            deskripsi: elements.deskripsi.value.trim() || 'Your bio description',
            medsos: medsos,
            links: links,
            footer: elements.footer.value.trim() || '© 2024 Your Brand',
            template: elements.template.value
        };
    }

    // Fetch template CSS dari file lokal
    async function getTemplateCSS(templateId) {
        const template = templates[templateId];
        try {
            const response = await fetch(template.cssUrl);
            if (!response.ok) throw new Error('CSS tidak ditemukan');
            return await response.text();
        } catch (error) {
            console.error('Error loading template CSS:', error);
            // Fallback CSS jika gagal load
            return `/* Fallback CSS for Template ${templateId} */
            body { font-family: ${template.font}; background: #f0f0f0; }
            .linktree-container { background: white; padding: 20px; border-radius: 10px; }`;
        }
    }

    // Generate HTML untuk preview (menggunakan iframe srcdoc)
    async function generatePreviewHTML(data) {
        const template = templates[data.template];
        const templateCSS = await getTemplateCSS(data.template);
        
        // Generate social media buttons
        const medsosButtons = data.medsos.map(item => {
            const icon = autoDetectIcon(item.url);
            return `
                <a href="${item.url}" target="_blank" class="social-btn">
                    <i class="fab ${icon}"></i>
                </a>
            `;
        }).join('\n');
        
        // Generate custom links
        const customLinks = data.links.map(item => {
            return `
                <a href="${item.url}" target="_blank" class="link-btn">
                    <i class="fas ${item.icon}"></i>
                    <span>${item.text}</span>
                </a>
            `;
        }).join('\n');
        
        // Full HTML dengan CSS template di-inject ke dalam <style>
        const fullHTML = `
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${data.nama} - Linktree</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Press+Start+2P&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
                <style>
                    ${templateCSS}
                    
                    /* Base styles untuk iframe preview */
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
                        text-align: center;
                    }
                    
                    .profile-img {
                        width: 140px;
                        height: 140px;
                        border-radius: 50%;
                        object-fit: cover;
                        margin: 0 auto 24px;
                    }
                    
                    .profile-name {
                        font-size: 28px;
                        margin-bottom: 12px;
                        font-weight: 600;
                    }
                    
                    .profile-desc {
                        font-size: 16px;
                        color: #666;
                        margin-bottom: 40px;
                        line-height: 1.6;
                    }
                    
                    .social-links {
                        display: flex;
                        justify-content: center;
                        gap: 20px;
                        margin-bottom: 40px;
                        flex-wrap: wrap;
                    }
                    
                    .social-btn {
                        width: 56px;
                        height: 56px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-decoration: none;
                        font-size: 22px;
                        color: #333;
                        background: #f0f0f0;
                        transition: all 0.3s ease;
                    }
                    
                    .social-btn:hover {
                        transform: translateY(-4px);
                    }
                    
                    .links-container {
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                        margin-bottom: 40px;
                    }
                    
                    .link-btn {
                        padding: 20px 28px;
                        border-radius: 16px;
                        text-decoration: none;
                        font-size: 16px;
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 14px;
                        transition: all 0.3s ease;
                        background: #f0f0f0;
                        color: #333;
                    }
                    
                    .link-btn:hover {
                        transform: translateY(-4px);
                    }
                    
                    .link-btn i {
                        font-size: 20px;
                    }
                    
                    footer {
                        margin-top: 40px;
                        padding-top: 24px;
                        border-top: 1px solid rgba(0, 0, 0, 0.1);
                        font-size: 14px;
                        color: #666;
                    }
                    
                    @media (max-width: 480px) {
                        .linktree-container {
                            padding: 32px 24px;
                        }
                        
                        .profile-img {
                            width: 120px;
                            height: 120px;
                        }
                        
                        .profile-name {
                            font-size: 24px;
                        }
                        
                        .social-btn {
                            width: 52px;
                            height: 52px;
                        }
                        
                        .link-btn {
                            padding: 18px 24px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="linktree-container">
                    <img src="${data.img}" alt="${data.nama}" class="profile-img">
                    <h1 class="profile-name">${data.nama}</h1>
                    <p class="profile-desc">${data.deskripsi}</p>
                    
                    <div class="social-links">
                        ${medsosButtons}
                    </div>
                    
                    <div class="links-container">
                        ${customLinks}
                    </div>
                    
                    <footer>${data.footer}</footer>
                </div>
                
                <script>
                    // Tambahkan efek hover untuk preview
                    document.addEventListener('DOMContentLoaded', function() {
                        const buttons = document.querySelectorAll('.social-btn, .link-btn');
                        buttons.forEach(btn => {
                            btn.addEventListener('mouseenter', function() {
                                this.style.transform = 'translateY(-4px)';
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
        
        return fullHTML;
    }

    // Generate full HTML untuk download (dengan Linktree.init)
    async function generateFullHTML(data) {
        const template = templates[data.template];
        const templateCSS = await getTemplateCSS(data.template);
        
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
        
        const fullHTML = `<!DOCTYPE html>
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
        
        #linktree-app {
            width: 100%;
            max-width: 480px;
            margin: 0 auto;
        }
        
        .linktree-container {
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
                padding: 25px 20px !important;
            }
        }
    </style>
</head>
<body>
    <div id="linktree-app"></div>
    
    <!-- Linktree Builder JS -->
    <script src="https://cdn.jsdelivr.net/gh/hanzcode1/LinktreeBuilder@main/script.js"></script>
    <script>
        // Initialize Linktree dengan data
        Linktree.init({
            img: "${data.img.replace(/"/g, '\\"')}",
            nama: "${data.nama.replace(/"/g, '\\"')}",
            deskripsi: "${data.deskripsi.replace(/"/g, '\\"')}",
            medsos: ${JSON.stringify(medsosData)},
            links: ${JSON.stringify(linksData)},
            footer: "${data.footer.replace(/"/g, '\\"')}"
        });
        
        // Tambahkan efek hover
        document.addEventListener('DOMContentLoaded', function() {
            const buttons = document.querySelectorAll('.linktree-btn');
            buttons.forEach(btn => {
                btn.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-4px)';
                });
                
                btn.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
        });
    </script>
</body>
</html>`;
        
        return fullHTML;
    }

    // Preview button click handler (FIXED)
    elements.previewBtn.addEventListener('click', async function() {
        try {
            const data = collectFormData();
            
            // Show loading state
            elements.previewBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            elements.previewBtn.disabled = true;
            
            // Generate preview HTML
            const previewHTML = await generatePreviewHTML(data);
            
            // Update iframe dengan srcdoc (isolasi CSS)
            elements.previewFrame.srcdoc = previewHTML;
            elements.iframePlaceholder.style.display = 'none';
            elements.previewFrame.style.display = 'block';
            
            // Generate full HTML untuk download/copy
            const fullHTML = await generateFullHTML(data);
            window.generatedHTML = fullHTML; // Simpan ke global variable
            
            // Update code output
            elements.htmlOutput.textContent = fullHTML;
            
            // Enable copy and download buttons
            elements.copyBtn.disabled = false;
            elements.downloadBtn.disabled = false;
            
        } catch (error) {
            console.error('Error generating preview:', error);
            alert('Terjadi kesalahan saat generate preview. Coba lagi.');
        } finally {
            // Reset button state
            elements.previewBtn.innerHTML = '<i class="fas fa-eye"></i> Preview & Generate HTML';
            elements.previewBtn.disabled = false;
        }
    });

    // Copy HTML to clipboard
    elements.copyBtn.addEventListener('click', function() {
        if (!window.generatedHTML) {
            alert('Generate preview terlebih dahulu!');
            return;
        }
        
        navigator.clipboard.writeText(window.generatedHTML).then(() => {
            // Show copy success animation
            elements.copyOverlay.classList.add('show');
            setTimeout(() => {
                elements.copyOverlay.classList.remove('show');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            // Fallback method
            const textArea = document.createElement('textarea');
            textArea.value = window.generatedHTML;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            elements.copyOverlay.classList.add('show');
            setTimeout(() => {
                elements.copyOverlay.classList.remove('show');
            }, 2000);
        });
    });

    // Download HTML file
    elements.downloadBtn.addEventListener('click', function() {
        if (!window.generatedHTML) {
            alert('Generate preview terlebih dahulu!');
            return;
        }
        
        const data = collectFormData();
        const filename = `linktree-${data.nama.toLowerCase().replace(/\s+/g, '-')}.html`;
        
        const blob = new Blob([window.generatedHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Reset form
    elements.resetBtn.addEventListener('click', function() {
        if (confirm('Reset semua input ke nilai default?')) {
            elements.imgUrl.value = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop';
            elements.nama.value = 'John Doe';
            elements.deskripsi.value = 'Digital Creator | Web Developer | Tech Enthusiast';
            elements.footer.value = '© 2024 John Doe. All rights reserved.';
            
            // Reset photo upload
            uploadedImageBase64 = '';
            elements.imgBase64.value = '';
            elements.uploadPreview.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <span>Klik untuk memilih foto</span>
            `;
            elements.uploadStatus.textContent = '';
            
            // Reset to URL mode
            togglePhotoOption('url');
            
            // Clear dynamic containers
            elements.medsosContainer.innerHTML = '';
            elements.linksContainer.innerHTML = '';
            
            // Reset template
            document.querySelectorAll('.template-option').forEach(opt => {
                opt.classList.remove('active');
            });
            document.querySelector('.template-option[data-template="1"]').classList.add('active');
            elements.template.value = '1';
            
            // Reset preview
            elements.iframePlaceholder.style.display = 'flex';
            elements.previewFrame.style.display = 'none';
            elements.htmlOutput.textContent = '// HTML akan muncul di sini...';
            elements.copyBtn.disabled = true;
            elements.downloadBtn.disabled = true;
            
            // Set default values again
            setDefaultValues();
        }
    });

    // Initialize the application
    initializeDynamicFields();
});