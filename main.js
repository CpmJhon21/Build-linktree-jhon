/**
 * Linktree Builder Premium - Simple & Working Version
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Linktree Builder - Starting...');
    
    // DOM Elements
    const img = document.getElementById('img');
    const nama = document.getElementById('nama');
    const deskripsi = document.getElementById('deskripsi');
    const footer = document.getElementById('footer');
    const template = document.getElementById('template');
    
    const medsosContainer = document.getElementById('medsos-container');
    const linksContainer = document.getElementById('links-container');
    
    const addMedsosBtn = document.getElementById('add-medsos');
    const addLinkBtn = document.getElementById('add-link');
    const previewBtn = document.getElementById('preview-btn');
    const resetBtn = document.getElementById('reset-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    
    const previewFrame = document.getElementById('preview-frame');
    const htmlOutput = document.getElementById('html-output');
    const iframePlaceholder = document.getElementById('iframe-placeholder');
    const copyOverlay = document.getElementById('copy-overlay');
    
    // State
    let hasPreview = false;
    
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
    
    // ================ FUNGSI UTAMA ================
    
    // Fungsi tambah media sosial - SIMPLE VERSION
    function addMedsosField(platform = '', url = '') {
        console.log('Adding social media field...');
        
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
                <option value="tiktok">TikTok</option>
            </select>
            <input type="text" class="url-input" placeholder="username atau link" value="${url}">
            <button type="button" class="btn-remove"><i class="fas fa-times"></i></button>
        `;
        
        medsosContainer.appendChild(div);
        
        if (platform) {
            div.querySelector('.platform-select').value = platform;
        }
        
        // Event listener untuk tombol hapus
        const removeBtn = div.querySelector('.btn-remove');
        removeBtn.addEventListener('click', function() {
            console.log('Removing social media field');
            div.remove();
        });
        
        return div;
    }
    
    // Fungsi tambah link - SIMPLE VERSION
    function addLinkField(text = '', url = '') {
        console.log('Adding link field...');
        
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <input type="text" class="link-text" placeholder="Nama link" value="${text}">
            <input type="text" class="link-url" placeholder="https://example.com" value="${url}">
            <button type="button" class="btn-remove"><i class="fas fa-times"></i></button>
        `;
        
        linksContainer.appendChild(div);
        
        // Event listener untuk tombol hapus
        const removeBtn = div.querySelector('.btn-remove');
        removeBtn.addEventListener('click', function() {
            console.log('Removing link field');
            div.remove();
        });
        
        return div;
    }
    
    // Fungsi collect data
    function collectFormData() {
        const medsos = [];
        const links = [];
        
        // Collect media sosial
        medsosContainer.querySelectorAll('.dynamic-item').forEach(item => {
            const platform = item.querySelector('.platform-select').value;
            const url = item.querySelector('.url-input').value.trim();
            
            if (platform && url) {
                // Format URL
                let formattedUrl = url;
                if (!url.startsWith('http')) {
                    formattedUrl = 'https://' + url;
                }
                
                medsos.push({
                    platform: platform,
                    url: formattedUrl
                });
            }
        });
        
        // Collect custom links
        linksContainer.querySelectorAll('.dynamic-item').forEach(item => {
            const text = item.querySelector('.link-text').value.trim();
            const url = item.querySelector('.link-url').value.trim();
            
            if (text && url) {
                // Format URL
                let formattedUrl = url;
                if (!url.startsWith('http')) {
                    formattedUrl = 'https://' + url;
                }
                
                links.push({
                    text: text,
                    url: formattedUrl,
                    icon: getIconFromUrl(formattedUrl, text)
                });
            }
        });
        
        return {
            img: img.value.trim(),
            nama: nama.value.trim(),
            deskripsi: deskripsi.value.trim(),
            medsos: medsos,
            links: links,
            footer: footer.value.trim(),
            template: template.value || '1'
        };
    }
    
    // Helper function untuk icon
    function getIconFromUrl(url, text) {
        const urlLower = url.toLowerCase();
        const textLower = text.toLowerCase();
        
        if (urlLower.includes('youtube')) return 'fa-youtube';
        if (urlLower.includes('github')) return 'fa-github';
        if (urlLower.includes('instagram')) return 'fa-instagram';
        if (urlLower.includes('linkedin')) return 'fa-linkedin';
        if (urlLower.includes('twitter') || urlLower.includes('x.com')) return 'fa-x-twitter';
        if (urlLower.includes('facebook')) return 'fa-facebook';
        if (urlLower.includes('t.me') || textLower.includes('telegram')) return 'fa-telegram';
        if (urlLower.includes('discord')) return 'fa-discord';
        if (urlLower.includes('spotify')) return 'fa-spotify';
        if (urlLower.includes('tiktok')) return 'fa-tiktok';
        
        return 'fa-link';
    }
    
    // Generate preview HTML
    function generatePreviewHTML(data) {
        const templateData = templates[data.template] || templates['1'];
        
        // Social media buttons
        let medsosButtons = '';
        data.medsos.forEach(item => {
            const icon = getIconFromUrl(item.url, item.platform);
            medsosButtons += `
                <a href="${item.url}" target="_blank" class="linktree-btn medsos-btn">
                    <i class="fab ${icon}"></i>
                </a>
            `;
        });
        
        // Custom links
        let customLinks = '';
        data.links.forEach(item => {
            customLinks += `
                <a href="${item.url}" target="_blank" class="linktree-btn custom-link">
                    <i class="fas ${item.icon}"></i>
                    ${item.text}
                </a>
            `;
        });
        
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
        ${templateData.style}
        
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
            font-family: ${templateData.font};
        }
        
        .linktree-container {
            max-width: 480px;
            width: 100%;
            padding: 40px;
            border-radius: 24px;
            text-align: center;
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
</body>
</html>`;
    }
    
    // Generate full HTML untuk download
    function generateFullHTML(data) {
        const templateData = templates[data.template] || templates['1'];
        
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
        ${templateData.style}
        
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
            font-family: ${templateData.font};
        }
        
        .linktree-container {
            max-width: 480px;
            width: 100%;
            padding: 40px;
            border-radius: 24px;
            text-align: center;
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
    </script>
</body>
</html>`;
    }
    
    // ================ EVENT HANDLERS ================
    
    // Preview button handler
    function handlePreview() {
        console.log('Preview button clicked');
        
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
        previewFrame.srcdoc = previewHTML;
        iframePlaceholder.style.display = 'none';
        previewFrame.style.display = 'block';
        
        // Update code output
        htmlOutput.textContent = fullHTML;
        
        // Enable buttons
        copyBtn.disabled = false;
        downloadBtn.disabled = false;
        
        // Update state
        hasPreview = true;
    }
    
    // Reset button handler
    function handleReset() {
        console.log('Reset button clicked');
        
        if (!confirm('Reset semua input? Semua data akan dihapus.')) {
            return;
        }
        
        // Clear all inputs
        img.value = '';
        nama.value = '';
        deskripsi.value = '';
        footer.value = '';
        
        // Clear dynamic containers
        medsosContainer.innerHTML = '';
        linksContainer.innerHTML = '';
        
        // Reset template
        document.querySelectorAll('.template-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector('.template-option[data-template="1"]').classList.add('active');
        template.value = '1';
        
        // Reset preview
        iframePlaceholder.style.display = 'flex';
        previewFrame.style.display = 'none';
        previewFrame.srcdoc = '';
        
        // Reset code output
        htmlOutput.textContent = '// HTML akan muncul di sini...';
        
        // Disable buttons
        copyBtn.disabled = true;
        downloadBtn.disabled = true;
        
        // Reset state
        hasPreview = false;
        
        // Add empty fields
        addMedsosField();
        addLinkField();
        
        console.log('Form reset complete');
    }
    
    // Copy button handler
    function handleCopy() {
        console.log('Copy button clicked');
        
        const html = htmlOutput.textContent;
        
        navigator.clipboard.writeText(html).then(() => {
            copyOverlay.classList.add('show');
            setTimeout(() => {
                copyOverlay.classList.remove('show');
            }, 2000);
            console.log('HTML copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Gagal menyalin. Silakan copy manual dari text area.');
        });
    }
    
    // Download button handler
    function handleDownload() {
        console.log('Download button clicked');
        
        const html = htmlOutput.textContent;
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
        
        console.log('File downloaded:', filename);
    }
    
    // Template selector handler
    function initTemplateSelector() {
        console.log('Initializing template selector...');
        
        const templateOptions = document.querySelectorAll('.template-option');
        templateOptions.forEach(option => {
            option.addEventListener('click', function() {
                console.log('Template selected:', this.dataset.template);
                
                // Remove active class from all
                templateOptions.forEach(opt => {
                    opt.classList.remove('active');
                });
                
                // Add active class to clicked
                this.classList.add('active');
                
                // Update hidden input
                template.value = this.dataset.template;
            });
        });
    }
    
    // ================ INITIALIZATION ================
    
    function initialize() {
        console.log('Initializing Linktree Builder...');
        
        // Setup event listeners
        addMedsosBtn.addEventListener('click', function() {
            console.log('Add social media button clicked');
            addMedsosField();
        });
        
        addLinkBtn.addEventListener('click', function() {
            console.log('Add link button clicked');
            addLinkField();
        });
        
        previewBtn.addEventListener('click', handlePreview);
        resetBtn.addEventListener('click', handleReset);
        copyBtn.addEventListener('click', handleCopy);
        downloadBtn.addEventListener('click', handleDownload);
        
        // Initialize template selector
        initTemplateSelector();
        
        // Start with empty form
        handleReset();
        
        console.log('Linktree Builder initialized successfully!');
    }
    
    // Start the application
    initialize();
});
