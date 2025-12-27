// Preview Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Load Linktree data from localStorage
    const savedData = localStorage.getItem('linktreeBuilderData');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            renderLinktreePreview(data);
        } catch (e) {
            console.error('Failed to load preview data:', e);
            showError();
        }
    } else {
        showError();
    }
});

function renderLinktreePreview(data) {
    const container = document.getElementById('linktree-preview');
    
    // Filter out empty items
    const filteredSocials = data.socials.filter(s => s && s.platform);
    const filteredLinks = data.links.filter(l => l && (l.text || l.url));
    
    // Platform icons mapping
    const iconMap = {
        github: 'fab fa-github',
        instagram: 'fab fa-instagram',
        twitter: 'fab fa-twitter',
        youtube: 'fab fa-youtube',
        linkedin: 'fab fa-linkedin',
        tiktok: 'fab fa-tiktok',
        whatsapp: 'fab fa-whatsapp',
        telegram: 'fab fa-telegram',
        discord: 'fab fa-discord',
        spotify: 'fab fa-spotify',
        facebook: 'fab fa-facebook',
        twitch: 'fab fa-twitch'
    };
    
    // Template styles
    const templateStyles = {
        pixel: {
            container: 'background: linear-gradient(135deg, #0a0a1a, #050510); border: 3px solid #00ff9d; box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.5);',
            btn: 'background-color: #00ff9d; color: #0a0a1a; border: 2px solid #00ff9d; box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.5);',
            primaryColor: '#00ff9d'
        },
        cyber: {
            container: 'background: linear-gradient(135deg, #0a0a1a, #050510); border: 2px solid transparent; border-image: linear-gradient(45deg, #00f3ff, #ff00ff) 1; box-shadow: 0 0 20px rgba(0, 243, 255, 0.3), inset 0 0 20px rgba(255, 0, 255, 0.1);',
            btn: 'background: linear-gradient(45deg, #00f3ff, #ff00ff); color: #0a0a1a; border: none; box-shadow: 0 0 10px rgba(0, 243, 255, 0.5);',
            primaryColor: '#00f3ff'
        },
        dark: {
            container: 'background: linear-gradient(135deg, #000010, #0a0a1f); border: 2px solid #0033ff; box-shadow: 0 0 30px rgba(0, 51, 255, 0.3);',
            btn: 'background-color: transparent; color: #00f3ff; border: 2px solid #0033ff;',
            primaryColor: '#00f3ff'
        }
    };
    
    const template = data.template || 'pixel';
    const style = templateStyles[template];
    
    const html = `
        <div class="linktree-preview-container" style="${style.container} border-radius: 20px; padding: 30px; text-align: center; max-width: 480px; width: 100%; margin: 0 auto;">
            ${data.profile.avatar ? `
                <img src="${data.profile.avatar}" alt="${data.profile.name}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 0 auto 20px; border: 3px solid ${style.primaryColor};">
            ` : ''}
            
            <h1 style="font-family: \'Press Start 2P\', cursive; font-size: 1.5rem; margin-bottom: 10px; color: ${style.primaryColor};">${data.profile.name || 'Your Name'}</h1>
            
            <div style="margin-bottom: 30px; color: #b0b0d0; font-size: 1rem;">
                ${data.profile.bio || 'Short bio about yourself'}
            </div>
            
            ${filteredSocials.length > 0 ? `
            <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 15px; margin-bottom: 30px;">
                ${filteredSocials.map(social => `
                    <a href="${social.url || '#'}" target="_blank" rel="noopener noreferrer" 
                       style="display: inline-flex; align-items: center; justify-content: center; width: 50px; height: 50px; border-radius: 50%; background-color: #1a1a2e; color: #f0f0ff; font-size: 1.2rem; transition: all 0.3s ease; text-decoration: none;">
                        <i class="${iconMap[social.platform] || 'fas fa-link'}"></i>
                    </a>
                `).join('')}
            </div>
            ` : ''}
            
            ${filteredLinks.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 15px;">
                ${filteredLinks.map(link => `
                    <a href="${link.url || '#'}" target="_blank" rel="noopener noreferrer" 
                       style="display: block; padding: 15px 20px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 1rem; transition: all 0.3s ease; text-align: center; ${style.btn}">
                        ${link.text || 'Link'}
                    </a>
                `).join('')}
            </div>
            ` : ''}
            
            <footer style="margin-top: 30px; font-size: 0.8rem; color: #3a3a4a;">
                Created with PixelLink Builder | Preview Mode
            </footer>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Add hover effects
    setTimeout(() => {
        const buttons = container.querySelectorAll('a[style*="background-color"]');
        const socialLinks = container.querySelectorAll('a[style*="width: 50px"]');
        
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                if (template === 'pixel') {
                    this.style.transform = 'translateY(-3px)';
                    this.style.boxShadow = '6px 6px 0px rgba(0, 0, 0, 0.5)';
                    this.style.backgroundColor = '#00b8ff';
                } else if (template === 'cyber') {
                    this.style.transform = 'scale(1.05)';
                    this.style.boxShadow = '0 0 20px rgba(255, 0, 255, 0.7)';
                } else if (template === 'dark') {
                    this.style.backgroundColor = 'rgba(0, 51, 255, 0.1)';
                    this.style.boxShadow = '0 0 15px rgba(0, 51, 255, 0.5)';
                    this.style.textShadow = '0 0 10px rgba(0, 243, 255, 0.7)';
                }
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
                this.style.backgroundColor = '';
                this.style.textShadow = '';
                
                if (template === 'pixel') {
                    this.style.backgroundColor = '#00ff9d';
                    this.style.boxShadow = '4px 4px 0px rgba(0, 0, 0, 0.5)';
                } else if (template === 'cyber') {
                    this.style.boxShadow = '0 0 10px rgba(0, 243, 255, 0.5)';
                }
            });
        });
        
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.backgroundColor = style.primaryColor;
                this.style.color = '#0a0a1a';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.backgroundColor = '#1a1a2e';
                this.style.color = '#f0f0ff';
            });
        });
    }, 100);
}

function showError() {
    const container = document.getElementById('linktree-preview');
    container.innerHTML = `
        <div style="text-align: center; color: #ff5555;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <h3>No Linktree Data Found</h3>
            <p>Please go back to the builder and create your Linktree first.</p>
            <a href="index.html" style="display: inline-block; margin-top: 1rem; padding: 10px 20px; background-color: #00ff9d; color: #0a0a1a; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Go to Builder
            </a>
        </div>
    `;
}