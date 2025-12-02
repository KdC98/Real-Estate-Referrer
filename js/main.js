// ============================================
// POINT D'ENTRÉE PRINCIPAL DE L'APPLICATION
// Version: 3.5.0 - Fix OAuth
// ============================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { initTranslations, changeLanguage } from './translations.js';
import { 
    setCurrentUser, 
    setUserProfile, 
    setIsPasswordRecoveryMode,
    loadUserProfile,
    logout,
    signInWithGoogle,
    signInWithApple,
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
    window.logout = logout;
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
    window.updateLeadStatus = (leadId, status) => updateLeadStatus(supabase, leadId, status, () => loadDashboardContent());
    window.markAsSold = (leadId) => markAsSold(supabase, leadId, () => loadDashboardContent());
    
    // OAuth - IMPORTANT: utiliser les fonctions de auth.js directement
    window.signInWithGoogle = signInWithGoogle;
    window.signInWithApple = signInWithApple;
    window.closeOAuthWarning = closeOAuthWarning;
    window.proceedWithOAuth = proceedWithOAuth;
    
    // ============================================
    // FONCTION RENDER
    // ============================================
    
    async function render() {
        console.log('🎨 RENDER called, currentPage:', currentPage);
        
        if (currentPage === 'dashboard') {
            await loadDashboardContent();
            handleContractUpload(supabase, SUPABASE_URL, render);
            handleAddLeadForm(supabase, () => loadDashboardContent());
        }
    }
    
    window.render = render;
    
    // ============================================
    // GESTION AUTH STATE - CORRIGÉ POUR OAUTH
    // ============================================
    
    supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔔 Auth state changed:', event, session?.user?.email);
        
        const user = session?.user || null;
        setCurrentUser(user);
        
        if (user) {
            console.log('👤 User authenticated:', user.email);
            console.log('📝 Loading profile...');
            
            // IMPORTANT: loadUserProfile utilise window.supabase
            const profileLoaded = await loadUserProfile(user);
            
            if (profileLoaded) {
                console.log('✅ Profile loaded, showing dashboard');
                currentPage = 'dashboard';
                window.currentPage = 'dashboard';
            } else {
                console.error('❌ Failed to load profile');
            }
        } else {
            console.log('👤 No user, showing landing');
            currentPage = 'landing';
            window.currentPage = 'landing';
        }
        
        render();
    });
    
    // ============================================
    // CHARGEMENT INITIAL
    // ============================================
    
    console.log('🔍 Getting initial session...');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
        console.log('✅ Found existing session for:', session.user.email);
        setCurrentUser(session.user);
        const profileLoaded = await loadUserProfile(session.user);
        if (profileLoaded) {
            currentPage = 'dashboard';
            window.currentPage = 'dashboard';
        }
    } else {
        console.log('ℹ️ No existing session');
    }
    
    render();
})();
