// This file contains functions for generating the final HTML
// Note: Most functions are already included in builder.js
// This is kept for modularity and future expansion

// Generate HTML from app state
function generateLinktreeHTML(state) {
    // This is a simplified version of the generateHTML function from builder.js
    // Used when we need to generate HTML outside the main builder context
    
    const filteredSocials = state.socials.filter(s => s && s.platform);
    const filteredLinks = state.links.filter(l => l && (l.text || l.url));
    
    // Get music URL if enabled
    let musicUrl = '';
    if (state.music.enabled && state.music.track) {
        switch(state.music.track) {
            case 'cyber':
                musicUrl = 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3';
                break;
            case 'futuristic':
                musicUrl = 'https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3';
                break;
            case 'pixel':
                musicUrl = 'https://assets.mixkit.co/music/preview/mixkit-game-show-suspense-waiting-667.mp3';
                break;
        }
    }
    
    // Return the HTML string
    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${state.profile.name || 'My Linktree'}</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        /* CSS will be inserted here based on template */
    </style>
</head>
<body>
    <!-- Linktree content will be inserted here -->
</body>
</html>`;
}

// Extract data from form for external use
function getLinktreeData() {
    return {
        profile: appState.profile,
        template: appState.template,
        music: appState.music,
        socials: appState.socials.filter(s => s && s.platform),
        links: appState.links.filter(l => l && (l.text || l.url))
    };
}

// Validate data before export
function validateExportData(data) {
    const errors = [];
    
    if (!data.profile.name) {
        errors.push('Display name is required');
    }
    
    if (data.links.length === 0) {
        errors.push('At least one link is required');
    }
    
    // Validate URLs
    data.links.forEach((link, index) => {
        if (link.url && !isValidURL(link.url)) {
            errors.push(`Link ${index + 1} has an invalid URL`);
        }
    });
    
    data.socials.forEach((social, index) => {
        if (social.url && !isValidURL(social.url)) {
            errors.push(`Social link ${index + 1} has an invalid URL`);
        }
    });
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}