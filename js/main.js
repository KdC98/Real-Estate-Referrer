// ============================================
// POINT D'ENTRÉE PRINCIPAL DE L'APPLICATION
// Version: 3.6.0 - Fix re-renders et stabilité
// Date: 3 décembre 2025
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
    
    // ============================================
    // PROTECTION CONTRE LES RE-RENDERS MULTIPLES
    // ============================================
    let isInitialized = false;
    let isRendering = false;
    let lastRenderedPage = null;
    let lastUserId = null;
    
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
    
    // OAuth
    window.signInWithGoogle = signInWithGoogle;
    window.signInWithApple = signInWithApple;
    window.closeOAuthWarning = closeOAuthWarning;
    window.proceedWithOAuth = proceedWithOAuth;
    
    // ============================================
    // FONCTION RENDER - AVEC PROTECTION
    // ============================================
    
    async function render(force = false) {
        // Protection contre les appels simultanés
        if (isRendering && !force) {
            console.log('⏳ Render already in progress, skipping...');
            return;
        }
        
        // Protection contre les renders identiques
        if (lastRenderedPage === currentPage && !force) {
            console.log('⏭️ Same page, skipping render:', currentPage);
            return;
        }
        
        isRendering = true;
        console.log('🎨 RENDER called, currentPage:', currentPage);
        
        try {
            if (currentPage === 'dashboard') {
                await loadDashboardContent();
                handleContractUpload(supabase, SUPABASE_URL, render);
                handleAddLeadForm(supabase, () => loadDashboardContent());
            }
            
            lastRenderedPage = currentPage;
        } catch (error) {
            console.error('❌ Render error:', error);
        } finally {
            isRendering = false;
        }
    }
    
    window.render = render;
    
    // Fonction pour forcer un refresh du dashboard
    window.refreshDashboard = async () => {
        if (currentPage === 'dashboard') {
            await loadDashboardContent();
        }
    };
    
    // ============================================
    // GESTION AUTH STATE - OPTIMISÉE
    // ============================================
    
    supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔔 Auth state changed:', event, session?.user?.email);
        
        const user = session?.user || null;
        const userId = user?.id || null;
        
        // Ignorer les événements INITIAL_SESSION si déjà initialisé avec le même user
        if (event === 'INITIAL_SESSION' && isInitialized && userId === lastUserId) {
            console.log('⏭️ Skipping duplicate INITIAL_SESSION for same user');
            return;
        }
        
        // Ignorer TOKEN_REFRESHED si on est déjà sur le dashboard
        if (event === 'TOKEN_REFRESHED' && currentPage === 'dashboard') {
            console.log('⏭️ Skipping TOKEN_REFRESHED, already on dashboard');
            return;
        }
        
        setCurrentUser(user);
        
        if (user) {
            // Éviter de recharger le profil pour le même utilisateur
            if (userId === lastUserId && isInitialized && currentPage === 'dashboard') {
                console.log('⏭️ Same user, already on dashboard, skipping reload');
                return;
            }
            
            console.log('👤 User authenticated:', user.email);
            console.log('📝 Loading profile...');
            
            try {
                const profileLoaded = await loadUserProfile(user);
                
                if (profileLoaded) {
                    console.log('✅ Profile loaded, showing dashboard');
                    currentPage = 'dashboard';
                    window.currentPage = 'dashboard';
                    lastUserId = userId;
                    isInitialized = true;
                } else {
                    console.error('❌ Failed to load profile');
                }
            } catch (error) {
                console.error('❌ Error loading profile:', error);
            }
        } else {
            console.log('👤 No user, showing landing');
            currentPage = 'landing';
            window.currentPage = 'landing';
            lastUserId = null;
        }
        
        // Forcer le render après un changement d'état auth
        await render(true);
    });
    
    // ============================================
    // CHARGEMENT INITIAL
    // ============================================
    
    console.log('🔍 Getting initial session...');
    
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.warn('⚠️ Session error (ignoring):', error.message);
            // Ne pas bloquer l'app, continuer sans session
        }
        
        if (session?.user) {
            console.log('✅ Found existing session for:', session.user.email);
            setCurrentUser(session.user);
            
            try {
                const profileLoaded = await loadUserProfile(session.user);
                if (profileLoaded) {
                    currentPage = 'dashboard';
                    window.currentPage = 'dashboard';
                    lastUserId = session.user.id;
                    isInitialized = true;
                }
            } catch (error) {
                console.error('❌ Error loading initial profile:', error);
            }
        } else {
            console.log('ℹ️ No existing session');
        }
    } catch (error) {
        console.error('❌ Critical error getting session:', error);
    }
    
    // Premier render
    await render(true);
    
    console.log('🚀 Application initialized successfully');
})();
