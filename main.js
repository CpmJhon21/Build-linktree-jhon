// DOM Elements
const elements = {
    // Form inputs
    bannerText: document.getElementById('bannerText'),
    subBanner: document.getElementById('subBanner'),
    img: document.getElementById('img'),
    nama: document.getElementById('nama'),
    deskripsi: document.getElementById('deskripsi'),
    tickerText: document.getElementById('tickerText'),
    footer: document.getElementById('footer'),
    template: document.getElementById('template'),
    
    // Ticker elements
    tickerTypeRadios: document.querySelectorAll('input[name="tickerType"]'),
    staticTickerContainer: document.getElementById('static-ticker-container'),
    digitalTickerContainer: document.getElementById('digital-ticker-container'),
    timezone: document.getElementById('timezone'),
    
    // Dynamic containers
    noticeContainer: document.getElementById('notice-container'),
    medsosCheckboxContainer: document.getElementById('medsos-checkbox-container'),
    medsosContainer: document.getElementById('medsos-container'),
    linksContainer: document.getElementById('links-container'),
    
    // Buttons
    addNoticeBtn: document.getElementById('add-notice'),
    addMedsosCheckboxBtn: document.getElementById('add-medsos-checkbox'),
    addMedsosBtn: document.getElementById('add-medsos'),
    addLinkBtn: document.getElementById('add-link'),
    previewBtn: document.getElementById('preview-btn'),
    resetBtn: document.getElementById('reset-btn'),
    copyBtn: document.getElementById('copy-btn'),
    downloadBtn: document.getElementById('download-btn'),
    
    // Preview elements
    iframePlaceholder: document.getElementById('iframe-placeholder'),
    previewFrame: document.getElementById('preview-frame'),
    htmlOutput: document.getElementById('html-output'),
    copyOverlay: document.getElementById('copy-overlay'),
    
    // Template selector
    templateOptions: document.querySelectorAll('.template-option'),
    
    // Form actions
    formActions: document.querySelector('.form-actions')
};

// State management
let state = {
    notices: [],
    medsosCheckbox: [],
    medsos: [],
    links: []
};

// Initialize the application
function init() {
    setupEventListeners();
    loadFromLocalStorage();
    updateUI();
    setupDefaultItems();
}

// Event Listeners Setup
function setupEventListeners() {
    // Ticker type change
    elements.tickerTypeRadios.forEach(radio => {
        radio.addEventListener('change', handleTickerTypeChange);
    });
    
    // Add item buttons
    elements.addNoticeBtn.addEventListener('click', () => addDynamicItem('notice'));
    elements.addMedsosCheckboxBtn.addEventListener('click', () => addDynamicItem('medsosCheckbox'));
    elements.addMedsosBtn.addEventListener('click', () => addDynamicItem('medsos'));
    elements.addLinkBtn.addEventListener('click', () => addDynamicItem('link'));
    
    // Main action buttons
    elements.previewBtn.addEventListener('click', generatePreview);
    elements.resetBtn.addEventListener('click', resetForm);
    elements.copyBtn.addEventListener('click', copyHTML);
    elements.downloadBtn.addEventListener('click', downloadHTML);
    
    // Template selection
    elements.templateOptions.forEach(option => {
        option.addEventListener('click', handleTemplateSelect);
    });
    
    // Auto-save on input
    const inputs = [
        elements.bannerText,
        elements.subBanner,
        elements.img,
        elements.nama,
        elements.deskripsi,
        elements.tickerText,
        elements.footer
    ];
    
    inputs.forEach(input => {
        input.addEventListener('input', saveToLocalStorage);
    });
    
    elements.timezone.addEventListener('change', saveToLocalStorage);
}

// Ticker Type Handler
function handleTickerTypeChange(e) {
    const type = e.target.value;
    
    // Hide all containers
    elements.staticTickerContainer.classList.remove('active');
    elements.digitalTickerContainer.classList.remove('active');
    
    // Show selected container
    if (type === 'static') {
        elements.staticTickerContainer.classList.add('active');
    } else if (type === 'digital') {
        elements.digitalTickerContainer.classList.add('active');
    }
    
    saveToLocalStorage();
}

// Template Selection Handler
function handleTemplateSelect(e) {
    const target = e.currentTarget;
    const template = target.dataset.template;
    
    // Remove active class from all options
    elements.templateOptions.forEach(option => {
        option.classList.remove('active');
    });
    
    // Add active class to selected option
    target.classList.add('active');
    
    // Update hidden input
    elements.template.value = template;
    
    saveToLocalStorage();
    updateUI();
}

// Dynamic Item Management
function addDynamicItem(type) {
    const item = createDynamicItem(type);
    
    switch(type) {
        case 'notice':
            state.notices.push(item);
            break;
        case 'medsosCheckbox':
            state.medsosCheckbox.push(item);
            break;
        case 'medsos':
            state.medsos.push(item);
            break;
        case 'link':
            state.links.push(item);
            break;
    }
    
    renderDynamicItems();
    saveToLocalStorage();
}

function createDynamicItem(type) {
    const baseItem = {
        id: Date.now() + Math.random(),
        title: '',
        content: ''
    };
    
    switch(type) {
        case 'notice':
            return {
                ...baseItem,
                title: 'Informasi Penting',
                content: 'Website GRATIS 100%'
            };
        case 'medsosCheckbox':
            return {
                ...baseItem,
                title: 'Telegram',
                content: 'https://t.me/username',
                checked: true
            };
        case 'medsos':
            return {
                ...baseItem,
                title: 'Instagram',
                content: 'https://instagram.com/username'
            };
        case 'link':
            return {
                ...baseItem,
                title: 'Website Saya',
                content: 'https://example.com'
            };
    }
    
    return baseItem;
}

function renderDynamicItems() {
    renderItems(state.notices, elements.noticeContainer, 'notice');
    renderItems(state.medsosCheckbox, elements.medsosCheckboxContainer, 'medsosCheckbox');
    renderItems(state.medsos, elements.medsosContainer, 'medsos');
    renderItems(state.links, elements.linksContainer, 'link');
}

function renderItems(items, container, type) {
    container.innerHTML = '';
    
    items.forEach((item, index) => {
        const itemElement = createItemElement(item, index, type);
        container.appendChild(itemElement);
    });
}

function createItemElement(item, index, type) {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.dataset.id = item.id;
    
    let contentHTML = '';
    
    switch(type) {
        case 'notice':
            contentHTML = `
                <div class="dynamic-item-header">
                    <span class="dynamic-item-title">${item.title}</span>
                    <button class="remove-btn" data-type="notice" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="dynamic-item-content">
                    <input type="text" 
                           class="notice-title" 
                           value="${item.title}" 
                           placeholder="Judul Informasi"
                           data-index="${index}">
                    <input type="text" 
                           class="notice-content" 
                           value="${item.content}" 
                           placeholder="Konten Informasi"
                           data-index="${index}">
                </div>
            `;
            break;
            
        case 'medsosCheckbox':
            contentHTML = `
                <div class="dynamic-item-header">
                    <span class="dynamic-item-title">${item.title}</span>
                    <button class="remove-btn" data-type="medsosCheckbox" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="dynamic-item-content">
                    <div class="stylish-checkbox">
                        <input type="checkbox" id="checkbox-${item.id}" 
                               ${item.checked ? 'checked' : ''} 
                               data-index="${index}">
                        <label for="checkbox-${item.id}" class="checkbox-label">
                            <span class="checkbox-custom"></span>
                            <input type="text" 
                                   class="medsos-title" 
                                   value="${item.title}" 
                                   placeholder="Nama Platform"
                                   data-index="${index}">
                        </label>
                    </div>
                    <input type="text" 
                           class="medsos-content" 
                           value="${item.content}" 
                           placeholder="URL atau username"
                           data-index="${index}">
                </div>
            `;
            break;
            
        case 'medsos':
        case 'link':
            contentHTML = `
                <div class="dynamic-item-header">
                    <span class="dynamic-item-title">${item.title}</span>
                    <button class="remove-btn" data-type="${type}" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="dynamic-item-content">
                    <input type="text" 
                           class="${type}-title" 
                           value="${item.title}" 
                           placeholder="${type === 'medsos' ? 'Nama Platform' : 'Judul Link'}"
                           data-index="${index}">
                    <input type="text" 
                           class="${type}-content" 
                           value="${item.content}" 
                           placeholder="${type === 'medsos' ? 'URL atau username' : 'URL link'}"
                           data-index="${index}">
                </div>
            `;
            break;
    }
    
    div.innerHTML = contentHTML;
    
    // Add event listeners
    const removeBtn = div.querySelector('.remove-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', handleRemoveItem);
    }
    
    // Add input listeners for auto-save
    const inputs = div.querySelectorAll('input[type="text"], input[type="checkbox"]');
    inputs.forEach(input => {
        input.addEventListener('input', handleItemUpdate);
        input.addEventListener('change', handleItemUpdate);
    });
    
    return div;
}

function handleRemoveItem(e) {
    const type = e.currentTarget.dataset.type;
    const index = parseInt(e.currentTarget.dataset.index);
    
    switch(type) {
        case 'notice':
            state.notices.splice(index, 1);
            break;
        case 'medsosCheckbox':
            state.medsosCheckbox.splice(index, 1);
            break;
        case 'medsos':
            state.medsos.splice(index, 1);
            break;
        case 'link':
            state.links.splice(index, 1);
            break;
    }
    
    renderDynamicItems();
    saveToLocalStorage();
}

function handleItemUpdate(e) {
    const input = e.target;
    const type = getItemTypeFromClass(input.className);
    const index = parseInt(input.dataset.index);
    
    if (isNaN(index) || !type) return;
    
    let item;
    switch(type) {
        case 'notice':
            item = state.notices[index];
            if (input.classList.contains('notice-title')) {
                item.title = input.value;
            } else {
                item.content = input.value;
            }
            break;
        case 'medsosCheckbox':
            item = state.medsosCheckbox[index];
            if (input.classList.contains('medsos-title')) {
                item.title = input.value;
            } else if (input.classList.contains('medsos-content')) {
                item.content = input.value;
            } else if (input.type === 'checkbox') {
                item.checked = input.checked;
            }
            break;
        case 'medsos':
            item = state.medsos[index];
            if (input.classList.contains('medsos-title')) {
                item.title = input.value;
            } else {
                item.content = input.value;
            }
            break;
        case 'link':
            item = state.links[index];
            if (input.classList.contains('link-title')) {
                item.title = input.value;
            } else {
                item.content = input.value;
            }
            break;
    }
    
    saveToLocalStorage();
}

function getItemTypeFromClass(className) {
    if (className.includes('notice')) return 'notice';
    if (className.includes('medsos')) return className.includes('checkbox') ? 'medsosCheckbox' : 'medsos';
    if (className.includes('link')) return 'link';
    return null;
}

// Setup Default Items
function setupDefaultItems() {
    if (state.notices.length === 0) {
        state.notices.push({
            id: 1,
            title: 'Informasi Penting',
            content: 'Website GRATIS 100%'
        });
    }
    
    if (state.medsosCheckbox.length === 0) {
        state.medsosCheckbox.push({
            id: 2,
            title: 'Telegram',
            content: 'https://t.me/username',
            checked: true
        });
    }
    
    if (state.medsos.length === 0) {
        state.medsos.push({
            id: 3,
            title: 'Instagram',
            content: 'https://instagram.com/username'
        });
    }
    
    if (state.links.length === 0) {
        state.links.push({
            id: 4,
            title: 'Website Saya',
            content: 'https://example.com'
        });
    }
    
    renderDynamicItems();
}

// Generate Preview
function generatePreview() {
    const htmlContent = generateHTML();
    
    // Show preview
    elements.iframePlaceholder.style.display = 'none';
    elements.previewFrame.srcdoc = htmlContent;
    
    // Update HTML output
    elements.htmlOutput.textContent = htmlContent;
    
    // Enable copy and download buttons
    elements.copyBtn.disabled = false;
    elements.downloadBtn.disabled = false;
    
    // Update UI
    updateUI();
}

function generateHTML() {
    const tickerType = document.querySelector('input[name="tickerType"]:checked').value;
    const timezone = elements.timezone.value;
    const template = elements.template.value;
    
    let tickerHTML = '';
    let tickerScript = '';
    
    // Generate ticker based on type
    if (tickerType === 'static') {
        const tickerText = elements.tickerText.value || '2 | : 13 : 22';
        tickerHTML = `<div class="ticker static-ticker">${tickerText}</div>`;
    } else if (tickerType === 'digital') {
        tickerHTML = `<div class="ticker digital-ticker" data-timezone="${timezone}" id="digitalClock">00:00:00</div>`;
        tickerScript = `
            <script>
                function updateDigitalClock() {
                    const clock = document.getElementById('digitalClock');
                    const timezone = clock.dataset.timezone;
                    
                    let options = {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    };
                    
                    let time;
                    if (timezone === 'local') {
                        time = new Date();
                    } else {
                        time = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
                    }
                    
                    const hours = String(time.getHours()).padStart(2, '0');
                    const minutes = String(time.getMinutes()).padStart(2, '0');
                    const seconds = String(time.getSeconds()).padStart(2, '0');
                    
                    clock.textContent = \`\${hours}:\${minutes}:\${seconds}\`;
                }
                
                setInterval(updateDigitalClock, 1000);
                updateDigitalClock();
            </script>
        `;
    }
    
    // Generate social media with checkboxes
    let medsosCheckboxHTML = '';
    if (state.medsosCheckbox.length > 0) {
        medsosCheckboxHTML = '<div class="social-checkboxes">';
        state.medsosCheckbox.forEach(item => {
            medsosCheckboxHTML += `
                <div class="social-checkbox-item">
                    <input type="checkbox" id="cb-${item.id}" ${item.checked ? 'checked' : ''} disabled>
                    <label for="cb-${item.id}">
                        <span class="checkbox-icon">✓</span>
                        ${item.title}
                    </label>
                    <span class="social-url">${item.content}</span>
                </div>
            `;
        });
        medsosCheckboxHTML += '</div>';
    }
    
    // Generate regular social media
    let medsosHTML = '';
    if (state.medsos.length > 0) {
        medsosHTML = '<div class="social-links">';
        state.medsos.forEach(item => {
            medsosHTML += `
                <a href="${item.content}" class="social-link" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-${item.title.toLowerCase()}"></i>
                    ${item.title}
                </a>
            `;
        });
        medsosHTML += '</div>';
    }
    
    // Generate links
    let linksHTML = '';
    if (state.links.length > 0) {
        linksHTML = '<div class="custom-links">';
        state.links.forEach(item => {
            linksHTML += `
                <a href="${item.content}" class="custom-link" target="_blank" rel="noopener noreferrer">
                    ${item.title}
                </a>
            `;
        });
        linksHTML += '</div>';
    }
    
    // Generate notices
    let noticesHTML = '';
    if (state.notices.length > 0) {
        noticesHTML = '<div class="notices">';
        state.notices.forEach(item => {
            noticesHTML += `
                <div class="notice">
                    <strong>${item.title}:</strong> ${item.content}
                </div>
            `;
        });
        noticesHTML += '</div>';
    }
    
    // Get template styles
    const templateStyles = getTemplateStyles(template);
    
    // Generate full HTML
    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${elements.nama.value || 'Linktree'} - ${elements.bannerText.value || 'Portfolio'}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        ${templateStyles}
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
            padding: 20px;
            min-height: 100vh;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
            padding: 30px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .banner {
            font-size: 2.5rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .sub-banner {
            color: #666;
            font-size: 1rem;
            margin-bottom: 20px;
        }
        
        .profile-section {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .profile-img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid #4361ee;
            margin: 0 auto 20px;
        }
        
        .name {
            font-size: 1.8rem;
            font-weight: 600;
            margin-bottom: 10px;
            color: #333;
        }
        
        .bio {
            color: #666;
            font-size: 1rem;
            max-width: 500px;
            margin: 0 auto;
        }
        
        .ticker-section {
            background: #4361ee;
            color: white;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
            font-family: monospace;
            font-size: 1.2rem;
            letter-spacing: 2px;
        }
        
        .notices {
            background: #fff3cd;
            border: 2px solid #ffeaa7;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 20px;
        }
        
        .notice {
            margin-bottom: 10px;
        }
        
        .notice:last-child {
            margin-bottom: 0;
        }
        
        .notice strong {
            color: #d35400;
        }
        
        .social-checkboxes {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            border: 2px solid #e9ecef;
        }
        
        .social-checkbox-item {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
            padding: 10px;
            background: white;
            border-radius: 8px;
            border: 1px solid #dee2e6;
        }
        
        .social-checkbox-item:last-child {
            margin-bottom: 0;
        }
        
        .social-checkbox-item input[type="checkbox"] {
            width: 20px;
            height: 20px;
            cursor: not-allowed;
        }
        
        .social-checkbox-item label {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            font-weight: 500;
        }
        
        .checkbox-icon {
            width: 20px;
            height: 20px;
            background: #28a745;
            color: white;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }
        
        .social-url {
            color: #666;
            font-size: 0.9rem;
            font-family: monospace;
        }
        
        .social-links {
            display: grid;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .social-link {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background: linear-gradient(45deg, #4361ee, #3a0ca3);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            transition: transform 0.3s ease;
        }
        
        .social-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
        }
        
        .social-link i {
            font-size: 1.2rem;
            width: 30px;
        }
        
        .custom-links {
            display: grid;
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .custom-link {
            display: block;
            padding: 15px;
            background: #f8f9fa;
            color: #333;
            text-decoration: none;
            border-radius: 10px;
            text-align: center;
            border: 2px solid #e9ecef;
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .custom-link:hover {
            background: #4361ee;
            color: white;
            border-color: #4361ee;
        }
        
        .footer {
            text-align: center;
            color: #666;
            font-size: 0.9rem;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
        }
        
        @media (max-width: 480px) {
            .container {
                padding: 20px;
                border-radius: 15px;
            }
            
            .banner {
                font-size: 2rem;
            }
            
            .profile-img {
                width: 100px;
                height: 100px;
            }
            
            .name {
                font-size: 1.5rem;
            }
            
            .social-checkbox-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
            
            .social-url {
                font-size: 0.8rem;
                word-break: break-all;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1 class="banner">${elements.bannerText.value || 'Linktree'}</h1>
            <p class="sub-banner">${elements.subBanner.value || 'Personal Portfolio'}</p>
        </header>
        
        <div class="profile-section">
            ${elements.img.value ? `<img src="${elements.img.value}" alt="Profile" class="profile-img">` : ''}
            <h2 class="name">${elements.nama.value || 'Your Name'}</h2>
            <p class="bio">${elements.deskripsi.value || 'Personal description goes here...'}</p>
        </div>
        
        ${tickerType !== 'none' ? `<div class="ticker-section">${tickerHTML}</div>` : ''}
        
        ${noticesHTML}
        
        ${medsosCheckboxHTML}
        
        ${medsosHTML}
        
        ${linksHTML}
        
        <footer class="footer">
            <p>${elements.footer.value || '© 2024 Your Brand'}</p>
        </footer>
    </div>
    
    ${tickerScript}
</body>
</html>`;
}

function getTemplateStyles(template) {
    const styles = {
        1: `
            .social-link { background: linear-gradient(45deg, #4361ee, #3a0ca3); }
            .ticker-section { background: #4361ee; }
            .notice { background: #fff3cd; border-color: #ffeaa7; }
        `,
        2: `
            .social-link { background: linear-gradient(45deg, #28a745, #20c997); }
            .ticker-section { background: #28a745; }
            .notice { background: #d1ecf1; border-color: #bee5eb; }
            .container { border: 2px solid #28a745; }
        `,
        3: `
            .social-link { background: linear-gradient(45deg, #f72585, #7209b7); }
            .ticker-section { background: linear-gradient(45deg, #f72585, #7209b7); }
            .notice { background: #0d0d0d; border-color: #f72585; color: #fff; }
            body { background: #0d0d0d; }
            .container { background: #1a1a1a; color: #fff; border: 2px solid #f72585; }
            .banner, .name { color: #fff; }
            .sub-banner, .bio, .footer { color: #ccc; }
            .social-checkbox-item { background: #2d2d2d; border-color: #444; color: #fff; }
            .custom-link { background: #2d2d2d; border-color: #444; color: #fff; }
            .custom-link:hover { background: #f72585; }
        `
    };
    
    return styles[template] || styles[1];
}

// Copy HTML to Clipboard
function copyHTML() {
    const html = elements.htmlOutput.textContent;
    navigator.clipboard.writeText(html).then(() => {
        showCopyFeedback();
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function showCopyFeedback() {
    elements.copyOverlay.classList.add('show');
    setTimeout(() => {
        elements.copyOverlay.classList.remove('show');
    }, 2000);
}

// Download HTML
function downloadHTML() {
    const html = elements.htmlOutput.textContent;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'linktree.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Reset Form
function resetForm() {
    if (!confirm('Apakah Anda yakin ingin mereset semua data?')) return;
    
    // Reset form inputs
    elements.bannerText.value = '';
    elements.subBanner.value = '';
    elements.img.value = '';
    elements.nama.value = '';
    elements.deskripsi.value = '';
    elements.tickerText.value = '2 | : 13 : 22';
    elements.footer.value = '';
    
    // Reset ticker
    document.querySelector('input[name="tickerType"][value="static"]').checked = true;
    elements.staticTickerContainer.classList.add('active');
    elements.digitalTickerContainer.classList.remove('active');
    elements.timezone.value = 'local';
    
    // Reset template
    elements.templateOptions.forEach(option => option.classList.remove('active'));
    elements.templateOptions[0].classList.add('active');
    elements.template.value = '1';
    
    // Reset state
    state = {
        notices: [],
        medsosCheckbox: [],
        medsos: [],
        links: []
    };
    
    // Reset preview
    elements.iframePlaceholder.style.display = 'flex';
    elements.previewFrame.srcdoc = '';
    elements.htmlOutput.textContent = '// HTML akan muncul di sini...';
    elements.copyBtn.disabled = true;
    elements.downloadBtn.disabled = true;
    
    // Setup default items
    setupDefaultItems();
    
    // Clear localStorage
    localStorage.clear();
    
    updateUI();
}

// Local Storage Management
function saveToLocalStorage() {
    const data = {
        bannerText: elements.bannerText.value,
        subBanner: elements.subBanner.value,
        img: elements.img.value,
        nama: elements.nama.value,
        deskripsi: elements.deskripsi.value,
        tickerText: elements.tickerText.value,
        footer: elements.footer.value,
        tickerType: document.querySelector('input[name="tickerType"]:checked').value,
        timezone: elements.timezone.value,
        template: elements.template.value,
        state: state
    };
    
    localStorage.setItem('linktreeBuilder', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('linktreeBuilder');
    if (!saved) return;
    
    try {
        const data = JSON.parse(saved);
        
        // Load form values
        elements.bannerText.value = data.bannerText || '';
        elements.subBanner.value = data.subBanner || '';
        elements.img.value = data.img || '';
        elements.nama.value = data.nama || '';
        elements.deskripsi.value = data.deskripsi || '';
        elements.tickerText.value = data.tickerText || '2 | : 13 : 22';
        elements.footer.value = data.footer || '';
        
        // Load ticker settings
        if (data.tickerType) {
            document.querySelector(`input[name="tickerType"][value="${data.tickerType}"]`).checked = true;
            handleTickerTypeChange({ target: document.querySelector(`input[name="tickerType"][value="${data.tickerType}"]`) });
        }
        
        if (data.timezone) {
            elements.timezone.value = data.timezone;
        }
        
        // Load template
        if (data.template) {
            elements.template.value = data.template;
            elements.templateOptions.forEach(option => {
                option.classList.remove('active');
                if (option.dataset.template === data.template) {
                    option.classList.add('active');
                }
            });
        }
        
        // Load state
        if (data.state) {
            state = data.state;
            renderDynamicItems();
        }
        
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

// Update UI
function updateUI() {
    // Update form actions position
    const hasContent = elements.bannerText.value || 
                      elements.nama.value || 
                      state.notices.length > 0 ||
                      state.medsos.length > 0 ||
                      state.links.length > 0;
    
    if (hasContent) {
        elements.previewBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Update Preview & HTML';
    } else {
        elements.previewBtn.innerHTML = '<i class="fas fa-eye"></i> Preview & Generate HTML';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
