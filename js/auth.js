// ============================================
// AUTHENTIFICATION & GESTION UTILISATEURS
// Real Estate Referrer - Dubai
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
            alert('Erreur lors du chargement du profil: ' + error.message);
            return false;
        }

        let profile = data;
        if (!profile) {
            console.log('📝 Profile does not exist, creating it...');
            const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .upsert([{
                    id: targetUser.id,
                    name: targetUser.user_metadata?.name || targetUser.email.split('@')[0],
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
                alert('Erreur lors de la création du profil: ' + insertError.message);
                return false;
            }

            profile = newProfile;
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
        alert('Exception lors du chargement du profil: ' + err.message);
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

            // 2FA désactivé - connexion directe
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

// OAuth - Afficher popup d'avertissement
export function showOAuthWarning(provider) {
    const i18next = window.i18next;
    const modal = document.getElementById('oauthWarningModal');
    const providerName = provider === 'google' ? 'Google' : 'Apple';
    const currentLang = i18next.language || 'fr';
    
    const translations = {
        fr: {
            security_info: "Information de sécurité",
            redirect_message: "Vous allez être redirigé vers",
            normal_secure: "C'est normal et sécurisé",
            will_return: "Vous reviendrez ici après connexion",
            continue_btn: "Continuer",
            cancel_btn: "Annuler"
        },
        en: {
            security_info: "Security Information",
            redirect_message: "You will be redirected to",
            normal_secure: "This is normal and secure",
            will_return: "You will return here after sign in",
            continue_btn: "Continue",
            cancel_btn: "Cancel"
        }
    };
    
    const trans = translations[currentLang] || translations['fr'];
    
    modal.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-gray-800 rounded-xl p-8 max-w-md w-full border-2 border-yellow-500">
                <div class="text-center mb-6">
                    <div class="text-5xl mb-4">⚠️</div>
                    <h3 class="text-2xl font-bold mb-4">${trans.security_info}</h3>
                </div>
                
                <p class="text-gray-300 mb-6 leading-relaxed">
                    ${trans.redirect_message} ${providerName}.
                </p>
                
                <p class="text-gray-300 mb-6">
                    <span class="text-green-400 font-semibold">✓ ${trans.normal_secure}</span><br>
                    ${trans.will_return}
                </p>
                
                <div class="flex gap-4">
                    <button 
                        onclick="window.proceedWithOAuth('${provider}')" 
                        class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition"
                    >
                        ${trans.continue_btn}
                    </button>
                    <button 
                        onclick="window.closeOAuthWarning()" 
                        class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition"
                    >
                        ${trans.cancel_btn}
                    </button>
                </div>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
}

export function closeOAuthWarning() {
    const modal = document.getElementById('oauthWarningModal');
    modal.classList.add('hidden');
    modal.innerHTML = '';
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
    showOAuthWarning('google');
}

// Connexion Apple
export async function signInWithApple() {
    showOAuthWarning('apple');
}

// Déconnexion
export async function logout() {
    const supabase = window.supabase;
    console.log('🚪 Logout called');
    
    try {
        console.log('🔓 Signing out from Supabase...');
        
        supabase.auth.signOut();
        
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
