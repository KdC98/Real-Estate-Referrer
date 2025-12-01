/**
 * Crisp Chat - Configuration multilingue
 * Real Estate Referrer
 * Version 1.0.0
 */

// Configuration Crisp
window.$crisp = [];
window.CRISP_WEBSITE_ID = "3fc5eae0-c8f6-4c08-98e9-8f83cc5712e2";

// Charger le script Crisp
(function() {
    const d = document;
    const s = d.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = 1;
    d.getElementsByTagName("head")[0].appendChild(s);
})();

// Mapping des langues RER vers les codes Crisp
const CRISP_LOCALE_MAP = {
    'fr': 'fr',
    'en': 'en',
    'ar': 'ar',
    'ru': 'ru',
    'hi': 'hi',
    'ur': 'ur',
    'zh': 'zh',
    'tl': 'tl'
};

// Messages de bienvenue personnalisés par langue
const WELCOME_MESSAGES = {
    'fr': 'Bonjour ! Comment puis-je vous aider ?',
    'en': 'Hello! How can I help you?',
    'ar': 'مرحباً! كيف يمكنني مساعدتك؟',
    'ru': 'Здравствуйте! Как я могу вам помочь?',
    'hi': 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूं?',
    'ur': 'السلام علیکم! میں آپ کی کیسے مدد کر سکتا ہوں؟',
    'zh': '您好！我能为您提供什么帮助？',
    'tl': 'Kumusta! Paano kita matutulungan?'
};

/**
 * Configure Crisp avec la langue de l'utilisateur
 */
function configureCrispLanguage() {
    // Récupérer la langue depuis localStorage ou défaut 'fr'
    const userLang = localStorage.getItem('language') || 'fr';
    const crispLocale = CRISP_LOCALE_MAP[userLang] || 'en';
    
    // Attendre que Crisp soit chargé
    if (window.$crisp && window.$crisp.push) {
        // Définir la langue de l'interface Crisp
        window.$crisp.push(["set", "session:locale", [crispLocale]]);
        
        // Définir les données de session (utile pour le support)
        window.$crisp.push(["set", "session:data", [
            ["preferred_language", userLang],
            ["app_version", "2.3.0"],
            ["platform", "Real Estate Referrer"]
        ]]);
    }
}

/**
 * Met à jour la langue Crisp quand l'utilisateur change de langue
 */
function updateCrispLanguage(newLang) {
    const crispLocale = CRISP_LOCALE_MAP[newLang] || 'en';
    
    if (window.$crisp && window.$crisp.push) {
        window.$crisp.push(["set", "session:locale", [crispLocale]]);
        window.$crisp.push(["set", "session:data", [
            ["preferred_language", newLang]
        ]]);
    }
}

/**
 * Définir les informations utilisateur dans Crisp
 */
function setCrispUser(email, name, phone) {
    if (window.$crisp && window.$crisp.push) {
        if (email) {
            window.$crisp.push(["set", "user:email", [email]]);
        }
        if (name) {
            window.$crisp.push(["set", "user:nickname", [name]]);
        }
        if (phone) {
            window.$crisp.push(["set", "user:phone", [phone]]);
        }
    }
}

/**
 * Ajouter un tag de segment (utile pour le support)
 */
function addCrispSegment(segment) {
    if (window.$crisp && window.$crisp.push) {
        window.$crisp.push(["set", "session:segments", [[segment]]]);
    }
}

// Initialiser Crisp quand le DOM est prêt
document.addEventListener('DOMContentLoaded', function() {
    // Attendre un peu que Crisp soit complètement chargé
    setTimeout(configureCrispLanguage, 1000);
});

// Écouter les changements de langue
window.addEventListener('languageChanged', function(e) {
    if (e.detail && e.detail.language) {
        updateCrispLanguage(e.detail.language);
    }
});

// Exporter les fonctions pour utilisation externe
window.CrispHelper = {
    updateLanguage: updateCrispLanguage,
    setUser: setCrispUser,
    addSegment: addCrispSegment,
    configure: configureCrispLanguage
};
