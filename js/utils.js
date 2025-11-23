// ============================================
// FONCTIONS UTILITAIRES
// Real Estate Referrer - Dubai
// ============================================

// Lire les paramètres d'URL
export function getQueryParams() {
    const params = {};
    const search = window.location.search.substring(1);
    if (!search) return params;
    
    for (const part of search.split('&')) {
        const [key, value] = part.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
    return params;
}

// Toggle menu mobile
export function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const icon = document.getElementById('menuIcon');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        icon.textContent = '✕';
    } else {
        menu.classList.add('hidden');
        icon.textContent = '☰';
    }
}

// Pré-remplir données de test
export function prefillTestData() {
    if (document.getElementById('name')) {
        document.getElementById('name').value = 'Test User';
        document.getElementById('countryCode').value = '+33';
        document.getElementById('phone').value = '612345678';
        document.getElementById('email').value = 'test@example.com';
        document.getElementById('password').value = 'Test1234!';
        document.getElementById('confirmPassword').value = 'Test1234!';
        
        // Déclencher les validations
        if (window.validateName) window.validateName();
        if (window.validatePhone) window.validatePhone();
        if (window.validateEmail) window.validateEmail();
        if (window.validatePassword) window.validatePassword();
        if (window.validateConfirmPassword) window.validateConfirmPassword();
        
        console.log('✅ Données de test pré-remplies');
    }
}

// Télécharger le template de contrat
export async function downloadContractTemplate() {
    const supabase = window.supabase;
    
    try {
        console.log('📥 Downloading contract template...');
        const { data, error } = await supabase.storage
            .from('contracts')
            .getPublicUrl('contract_template_en.pdf');
        
        if (error) {
            console.error('❌ Error getting template URL:', error);
            alert('Error downloading contract. Please contact support.');
            return;
        }
        
        console.log('✅ Template URL:', data.publicUrl);
        window.open(data.publicUrl, '_blank');
    } catch (error) {
        console.error('❌ Exception downloading template:', error);
        alert('Error downloading: ' + error.message);
    }
}

// Vérifier si un numéro de téléphone existe déjà
export async function checkPhoneExists(phone) {
    const supabase = window.supabase;
    
    try {
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        
        const { data, error } = await supabase
            .from('profiles')
            .select('id, name')
            .eq('phone', cleanPhone)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            console.error('Error checking phone:', error);
            return { exists: false, error: error.message };
        }
        
        return { exists: !!data, userName: data?.name };
    } catch (err) {
        console.error('Exception checking phone:', err);
        return { exists: false, error: err.message };
    }
}

// ✅ CORRECTION: Navigation helpers with proper page state management
export function showLogin() {
    console.log('🔐 showLogin called');
    // Change BOTH local and window currentPage
    if (window.setCurrentPage) {
        window.setCurrentPage('auth-login');
    } else {
        // Fallback si setCurrentPage n'existe pas encore
        window.currentPage = 'auth-login';
    }
    if (window.render) {
        window.render();
    }
}

export function showSignup() {
    console.log('📝 showSignup called');
    // Change BOTH local and window currentPage
    if (window.setCurrentPage) {
        window.setCurrentPage('auth-signup');
    } else {
        // Fallback si setCurrentPage n'existe pas encore
        window.currentPage = 'auth-signup';
    }
    if (window.render) {
        window.render();
    }
    
    // ✅ Attacher la validation du mot de passe après le rendu
    setTimeout(() => {
        if (window.VALIDATION && window.VALIDATION.attachPasswordValidation) {
            window.VALIDATION.attachPasswordValidation();
            console.log('✅ Password validation attached');
        }
    }, 100);
}

export function showReset() {
    console.log('🔑 showReset called');
    // Change BOTH local and window currentPage
    if (window.setCurrentPage) {
        window.setCurrentPage('auth-reset');
    } else {
        // Fallback si setCurrentPage n'existe pas encore
        window.currentPage = 'auth-reset';
    }
    if (window.render) {
        window.render();
    }
}

export function backToHome() {
    console.log('🏠 backToHome called');
    // Change BOTH local and window currentPage
    if (window.setCurrentPage) {
        window.setCurrentPage('landing');
    } else {
        // Fallback si setCurrentPage n'existe pas encore
        window.currentPage = 'landing';
    }
    window.location.hash = '';
    if (window.render) {
        window.render();
    }
}

// Détecter le paramètre ?signed=true au chargement
export function detectSignedParamOnLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    const signed = urlParams.get('signed');
    
    if (signed === 'true') {
        window.contractJustSigned = true;
        console.log('✅ Contract signed parameter detected');
        
        // Nettoyer l'URL
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }
}
