// ============================================
// POINT D'ENTRÉE PRINCIPAL DE L'APPLICATION
// ============================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { initTranslations, changeLanguage, oauthTranslations } from './translations.js';
import { 
    setCurrentUser, 
    setUserProfile, 
    setIs2FAMode,
    setIsPasswordRecoveryMode,
    send2FACode,
    verify2FACode,
    loadUserProfile,
    logout,
    showOAuthWarning,
    closeOAuthWarning,
    proceedWithOAuth
} from './auth.js';
import { 
    validateName, 
    validatePhone, 
    validateEmail, 
    validatePassword, 
    validateConfirmPassword,
    checkFormValidity 
} from './validation.js';
import { 
    toggleMobileMenu, 
    togglePasswordVisibility, 
    prefillTestData,
    downloadContractTemplate,
    checkPhoneExists,
    getQueryParams
} from './utils.js';
import { 
    showAddLeadForm, 
    handleAddLeadForm,
    updateLeadStatus, 
    markAsSold 
} from './leads.js';
import { loadDashboardContent, handleContractUpload } from './dashboard.js';

// ============================================
// INITIALISATION
// ============================================

(async () => {
    // Initialiser i18next
    await initTranslations();
    
    // Créer le client Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.supabase = supabase;
    
    // Variables globales de navigation
    let currentPage = 'landing';
    window.currentPage = 'landing';
    
    // Détecter le paramètre ?signed=... au chargement
    let contractJustSigned = false;
    const params = getQueryParams();
    if (params.signed) {
        console.log('🎉 Paramètre ?signed détecté au chargement:', params.signed);
        contractJustSigned = true;
        window.contractJustSigned = true;
        window.history.replaceState({}, '', window.location.pathname);
    }
    
    // Vérifier si on arrive avec ?action=signup
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'signup') {
        currentPage = 'auth-signup';
        window.currentPage = 'auth-signup';
    }
    
    // ============================================
    // FONCTIONS DE NAVIGATION
    // ============================================
    
    window.showLogin = () => {
        console.log('🔐 showLogin called');
        currentPage = 'auth-login';
        window.currentPage = 'auth-login';
        render();
    };
    
    window.showSignup = () => {
        console.log('📝 showSignup called');
        currentPage = 'auth-signup';
        window.currentPage = 'auth-signup';
        render();
    };
    
    window.showReset = () => {
        console.log('🔑 showReset called');
        currentPage = 'auth-reset';
        window.currentPage = 'auth-reset';
        render();
    };
    
    window.backToHome = () => {
        console.log('🏠 backToHome called');
        currentPage = 'landing';
        window.currentPage = 'landing';
        setIsPasswordRecoveryMode(false);
        render();
    };
    
    // ============================================
    // EXPOSER LES FONCTIONS GLOBALEMENT
    // ============================================
    
    window.changeLanguage = changeLanguage;
    window.logout = () => logout(supabase);
    window.toggleMobileMenu = toggleMobileMenu;
    window.togglePasswordVisibility = togglePasswordVisibility;
    window.prefillTestData = prefillTestData;
    window.downloadContractTemplate = () => downloadContractTemplate(supabase);
    
    // Validation
    window.validateName = validateName;
    window.validatePhone = validatePhone;
    window.validateEmail = validateEmail;
    window.validatePassword = validatePassword;
    window.validateConfirmPassword = validateConfirmPassword;
    window.checkFormValidity = checkFormValidity;
    
    // Leads
    window.showAddLeadForm = showAddLeadForm;
    window.updateLeadStatus = (leadId, status) => updateLeadStatus(supabase, leadId, status, () => loadDashboardContent(supabase));
    window.markAsSold = (leadId) => markAsSold(supabase, leadId, () => loadDashboardContent(supabase));
    
    // OAuth
    window.signInWithGoogle = () => showOAuthWarning('google', oauthTranslations, i18next);
    window.signInWithApple = () => showOAuthWarning('apple', oauthTranslations, i18next);
    window.closeOAuthWarning = closeOAuthWarning;
    window.proceedWithOAuth = (provider) => proceedWithOAuth(supabase, provider);
    
    // 2FA
    window.handle2FASubmit = async (event) => {
        event.preventDefault();
        const code = document.getElementById('code2fa').value;
        const isValid = await verify2FACode(supabase, code);
        if (isValid) {
            render();
        } else {
            alert('Code invalide ou expiré');
        }
    };
    
    window.resend2FACode = async () => {
        // À implémenter avec tempUserId
        alert('Code renvoyé !');
    };
    
    // ============================================
    // FONCTION RENDER (SIMPLIFIÉE)
    // ============================================
    
    async function render() {
        console.log('🎨 RENDER called, currentPage:', currentPage);
        
        // Le HTML reste dans index.html
        // On attache juste les event listeners ici
        
        if (currentPage === 'dashboard') {
            await loadDashboardContent(supabase);
            handleContractUpload(supabase, SUPABASE_URL, render);
            handleAddLeadForm(supabase, () => loadDashboardContent(supabase));
        }
    }
    
    window.render = render;
    
    // ============================================
    // GESTION AUTH STATE
    // ============================================
    
    supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔔 Auth state changed:', event);
        
        const user = session?.user || null;
        setCurrentUser(user);
        
        if (user) {
            console.log('👤 User authenticated, loading profile...');
            const profileLoaded = await loadUserProfile(supabase, user);
            
            if (profileLoaded) {
                currentPage = 'dashboard';
                window.currentPage = 'dashboard';
            }
        }
        
        render();
    });
    
    // ============================================
    // CHARGEMENT INITIAL
    // ============================================
    
    console.log('🔍 Getting initial session...');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
        setCurrentUser(session.user);
        await loadUserProfile(supabase, session.user);
        currentPage = 'dashboard';
        window.currentPage = 'dashboard';
    }
    
    render();
})();
