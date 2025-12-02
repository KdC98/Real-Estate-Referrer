// ============================================
// AUTHENTIFICATION & GESTION UTILISATEURS
// Real Estate Referrer - Dubai
// Version: 3.5.0 - Fix OAuth callback
// ============================================

import { MAX_PROFILE_LOAD_ATTEMPTS } from './config.js';

// Variables globales d'authentification
export let currentUser = null;
export let userProfile = null;
export let is2FAMode = false;
export let isPasswordRecoveryMode = false;
export let isSignupInProgress = false;
export let tempUserId = null;
export let tempUserProfile = null;
export let profileLoadAttempts = 0;

// Setters pour les variables globales
export function setCurrentUser(user) {
    currentUser = user;
    window.currentUser = user;
}

export function setUserProfile(profile) {
    userProfile = profile;
    window.userProfile = profile;
}

export function setIs2FAMode(value) {
    is2FAMode = value;
}

export function setIsPasswordRecoveryMode(value) {
    isPasswordRecoveryMode = value;
}

export function setIsSignupInProgress(value) {
    isSignupInProgress = value;
}

export function setTempUserId(id) {
    tempUserId = id;
}

export function setTempUserProfile(profile) {
    tempUserProfile = profile;
}

export function setProfileLoadAttempts(value) {
    profileLoadAttempts = value;
}

// Charger le profil utilisateur
export async function loadUserProfile(user = null) {
    const supabase = window.supabase;
    const targetUser = user || currentUser;
    console.log('🔍 loadUserProfile called for user:', targetUser?.id);

    if (!targetUser || !targetUser.id) {
        console.error('❌ No user provided to loadUserProfile');
        return false;
    }

    try {
        console.log('🔍 Fetching profile from Supabase for:', targetUser.id);

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', targetUser.id)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            console.error('❌ Error loading profile:', error);
            return false;
        }

        let profile = data;
        if (!profile) {
            console.log('📝 Profile does not exist, creating it...');
            
            // Extraire le nom depuis les metadata OAuth
            const userName = targetUser.user_metadata?.full_name || 
                           targetUser.user_metadata?.name || 
                           targetUser.email?.split('@')[0] || 
                           '';
            
            const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .upsert([{
                    id: targetUser.id,
                    name: userName,
                    phone: targetUser.user_metadata?.phone || '',
                    email: targetUser.email,
                    role: 'referrer',
                    contract_status: 'pending',
                    phone_verified: false
                }], { onConflict: 'id' })
                .select()
                .single();

            if (insertError) {
                console.error('❌ Error creating profile:', insertError);
                return false;
            }

            profile = newProfile;
            console.log('✅ Profile created:', profile);
        }

        console.log('✅ Profile data retrieved:', profile);

        if (profile && profile.contract_status) {
            profile.contract_status = profile.contract_status.trim().replace(/\*+/g, '');
        }

        setUserProfile(profile);
        console.log('✅ userProfile set:', userProfile);
        return true;

    } catch (err) {
        console.error('❌ Exception loading profile:', err);
        return false;
    }
}

// Gérer l'authentification (signup/login)
export async function handleAuth(mode) {
    const supabase = window.supabase;
    const i18next = window.i18next;
    
    console.log(`🔐 handleAuth called with mode: ${mode}`);
    
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value;
    
    if (!email || !password) {
        alert(i18next.t('auth:errors.fill_all_fields'));
        return;
    }

    if (mode === 'signup') {
        const name = document.getElementById('name')?.value.trim();
        const countryCode = document.getElementById('countryCode')?.value;
        const phone = document.getElementById('phone')?.value.trim();
        const confirmPassword = document.getElementById('confirmPassword')?.value;

        if (!name || !phone || !confirmPassword) {
            alert(i18next.t('auth:errors.fill_all_fields'));
            return;
        }

        if (password !== confirmPassword) {
            alert(i18next.t('auth:errors.passwords_no_match'));
            return;
        }

        const fullPhone = countryCode + phone;

        try {
            setIsSignupInProgress(true);
            console.log('🔒 Blocking renders during signup process');

            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        name: name,
                        phone: fullPhone
                    }
                }
            });

            if (error) throw error;

            console.log('✅ User created:', data.user);

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .upsert([{
                    id: data.user.id,
                    name: name,
                    phone: fullPhone,
                    email: email,
                    role: 'referrer',
                    contract_status: 'pending',
                    phone_verified: false
                }], { onConflict: 'id' })
                .select()
                .single();

            if (profileError) throw profileError;

            console.log('✅ Profile created/updated:', profileData);

            setTempUserId(data.user.id);
            setTempUserProfile(profileData);

            // Connexion directe
            console.log('✅ Signup complete - signing in user...');
            
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (signInError) throw signInError;

            setCurrentUser(signInData.user);
            setUserProfile(profileData);
            setIsSignupInProgress(false);
            
            console.log('✅ User signed in successfully');
            alert(i18next.t('auth:success.signup_success'));

        } catch (error) {
            console.error('❌ Signup error:', error);
            setIsSignupInProgress(false);
            alert(i18next.t('auth:errors.signup_error') + error.message);
        }

    } else if (mode === 'login') {
        try {
            console.log('🔐 Attempting login...');
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            console.log('✅ Login successful:', data.user);
            setCurrentUser(data.user);

            const profileLoaded = await loadUserProfile(data.user);
            
            if (!profileLoaded) {
                console.error('❌ Failed to load profile after login');
            }

        } catch (error) {
            console.error('❌ Login error:', error);
            alert(i18next.t('auth:errors.login_error') + error.message);
        }
    }
}

// Réinitialisation du mot de passe
export async function handleReset() {
    const supabase = window.supabase;
    const i18next = window.i18next;
    
    const email = document.getElementById('resetEmail')?.value.trim();
    
    if (!email) {
        alert(i18next.t('auth:errors.enter_email'));
        return;
    }

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password.html`
        });

        if (error) throw error;

        alert(i18next.t('auth:success.reset_email_sent'));
        window.showLogin();

    } catch (error) {
        console.error('❌ Password reset error:', error);
        alert(i18next.t('auth:errors.reset_error') + error.message);
    }
}

// Changement de mot de passe
export async function handleChangePassword() {
    const supabase = window.supabase;
    const i18next = window.i18next;
    
    const newPassword = document.getElementById('newPassword')?.value;
    const confirmPassword = document.getElementById('confirmNewPassword')?.value;

    if (!newPassword || !confirmPassword) {
        alert(i18next.t('auth:errors.fill_all_fields'));
        return;
    }

    if (newPassword !== confirmPassword) {
        alert(i18next.t('auth:errors.passwords_no_match'));
        return;
    }

    if (newPassword.length < 6) {
        alert(i18next.t('auth:errors.password_min_6'));
        return;
    }

    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;

        alert(i18next.t('auth:success.password_changed'));

        await supabase.auth.signOut();
        window.location.href = '/';

    } catch (error) {
        console.error('❌ Change password error:', error);
        alert(i18next.t('auth:errors.change_password_error') + error.message);
    }
}

// ============================================
// OAUTH - Google & Apple
// ============================================

export function closeOAuthWarning() {
    const modal = document.getElementById('oauthWarningModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.innerHTML = '';
    }
}

export async function proceedWithOAuth(provider) {
    const supabase = window.supabase;
    closeOAuthWarning();
    
    try {
        console.log(`🔐 Starting ${provider} Sign In...`);
        
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: window.location.origin
            }
        });
        
        if (error) throw error;
        console.log(`✅ ${provider} redirect initiated`);
    } catch (error) {
        console.error(`❌ ${provider} Sign In error:`, error);
        alert(`Erreur lors de la connexion avec ${provider}: ` + error.message);
    }
}

// Connexion Google
export async function signInWithGoogle() {
    const i18next = window.i18next;
    const modal = document.getElementById('oauthWarningModal');
    const currentLang = (i18next?.language || 'fr').substring(0, 2);
    
    const translations = {
        fr: {
            title: "Information de sécurité",
            message: "Vous allez être redirigé vers notre service d'authentification sécurisé (Supabase) pour vous connecter avec Google.",
            safe: "C'est normal et sécurisé.",
            return: "Vous reviendrez automatiquement sur notre site après connexion.",
            continue: "Continuer",
            cancel: "Annuler"
        },
        en: {
            title: "Security Information",
            message: "You will be redirected to our secure authentication service (Supabase) to sign in with Google.",
            safe: "This is normal and secure.",
            return: "You will automatically return to our site after signing in.",
            continue: "Continue",
            cancel: "Cancel"
        }
    };
    
    const t = translations[currentLang] || translations['fr'];
    
    modal.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-gray-800 rounded-xl p-8 max-w-md w-full border-2 border-yellow-500">
                <div class="text-center mb-6">
                    <div class="text-5xl mb-4">⚠️</div>
                    <h3 class="text-2xl font-bold text-yellow-400">${t.title}</h3>
                </div>
                
                <p class="text-gray-300 mb-4">${t.message}</p>
                
                <p class="text-gray-300 mb-6">
                    <span class="text-green-400 font-semibold">✓ ${t.safe}</span><br>
                    ${t.return}
                </p>
                
                <div class="flex gap-4">
                    <button onclick="window.proceedWithOAuth('google')" class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition">
                        ${t.continue}
                    </button>
                    <button onclick="window.closeOAuthWarning()" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition">
                        ${t.cancel}
                    </button>
                </div>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
}

// Connexion Apple
export async function signInWithApple() {
    const i18next = window.i18next;
    const modal = document.getElementById('oauthWarningModal');
    const currentLang = (i18next?.language || 'fr').substring(0, 2);
    
    const translations = {
        fr: {
            title: "Information de sécurité",
            message: "Vous allez être redirigé vers notre service d'authentification sécurisé (Supabase) pour vous connecter avec Apple.",
            safe: "C'est normal et sécurisé.",
            return: "Vous reviendrez automatiquement sur notre site après connexion.",
            continue: "Continuer",
            cancel: "Annuler"
        },
        en: {
            title: "Security Information",
            message: "You will be redirected to our secure authentication service (Supabase) to sign in with Apple.",
            safe: "This is normal and secure.",
            return: "You will automatically return to our site after signing in.",
            continue: "Continue",
            cancel: "Cancel"
        }
    };
    
    const t = translations[currentLang] || translations['fr'];
    
    modal.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-gray-800 rounded-xl p-8 max-w-md w-full border-2 border-yellow-500">
                <div class="text-center mb-6">
                    <div class="text-5xl mb-4">⚠️</div>
                    <h3 class="text-2xl font-bold text-yellow-400">${t.title}</h3>
                </div>
                
                <p class="text-gray-300 mb-4">${t.message}</p>
                
                <p class="text-gray-300 mb-6">
                    <span class="text-green-400 font-semibold">✓ ${t.safe}</span><br>
                    ${t.return}
                </p>
                
                <div class="flex gap-4">
                    <button onclick="window.proceedWithOAuth('apple')" class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition">
                        ${t.continue}
                    </button>
                    <button onclick="window.closeOAuthWarning()" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition">
                        ${t.cancel}
                    </button>
                </div>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
}

// Déconnexion
export async function logout() {
    const supabase = window.supabase;
    console.log('🚪 Logout called');
    
    try {
        console.log('🔓 Signing out from Supabase...');
        
        await supabase.auth.signOut();
        
        console.log('🧹 Cleaning ALL session data...');
        localStorage.clear();
        sessionStorage.clear();
        
        setCurrentUser(null);
        setUserProfile(null);
        setIsPasswordRecoveryMode(false);
        setIs2FAMode(false);
        setTempUserId(null);
        setTempUserProfile(null);
        
        console.log('✅ Local state cleaned');
        console.log('🔄 Reloading page NOW...');
        window.location.href = window.location.origin;
        
    } catch (error) {
        console.error('❌ Logout exception:', error);
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = window.location.origin;
    }
}

// ============================================
// EXPOSER GLOBALEMENT
// ============================================
window.proceedWithOAuth = proceedWithOAuth;
window.closeOAuthWarning = closeOAuthWarning;
window.signInWithGoogle = signInWithGoogle;
window.signInWithApple = signInWithApple;
window.logout = logout;
