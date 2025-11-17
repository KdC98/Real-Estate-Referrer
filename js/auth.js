// ============================================
// AUTHENTIFICATION & GESTION UTILISATEURS
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

// Envoyer code 2FA via SMS
export async function send2FACode(supabase, SUPABASE_URL, SUPABASE_ANON_KEY, userId, language = 'fr', phone = null) {
    try {
        console.log('📱 Sending 2FA code via SMS for user:', userId, 'language:', language);
        
        // 1. Générer un code à 6 chiffres
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('🔢 Generated code:', code);
        
        // 2. Hasher le code pour le stocker en base
        const encoder = new TextEncoder();
        const data = encoder.encode(code);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const codeHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        // 3. Sauvegarder le code hashé dans verification_codes
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes
        
        const { error: insertError } = await supabase
            .from('verification_codes')
            .insert([{
                user_id: userId,
                code_hash: codeHash,
                expires_at: expiresAt,
                used: false,
                attempts: 0
            }]);
        
        if (insertError) {
            console.error('❌ Error saving verification code:', insertError);
            throw new Error('Erreur de sauvegarde du code');
        }
        
        console.log('✅ Verification code saved to database');
        
        // 4. Vérifier que le numéro de téléphone est fourni
        if (!phone) {
            console.error('❌ No phone number provided');
            throw new Error('Numéro de téléphone manquant');
        }

        console.log('📞 User phone:', phone);
        
        // 5. Envoyer le code via SMS (Twilio)
        const response = await fetch(`${SUPABASE_URL}/functions/v1/send-2fa-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ 
                phone: phone,
                code: code
            })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            console.error('❌ SMS send error:', result);
            throw new Error(result.error || 'Erreur envoi SMS');
        }
        
        console.log('✅ SMS code sent successfully via Twilio');
        return true;
        
    } catch (error) {
        console.error('❌ Erreur send2FACode:', error);
        alert('Erreur lors de l\'envoi du code de vérification. Veuillez réessayer.');
        return false;
    }
}

// Vérifier code 2FA
export async function verify2FACode(supabase, code) {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(code);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const codeHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        const { data: codes, error } = await supabase
            .from('verification_codes')
            .select('*')
            .eq('user_id', tempUserId)
            .eq('code_hash', codeHash)
            .eq('used', false)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1);
        
        if (error) throw error;
        
        if (!codes || codes.length === 0) {
            console.log('❌ Code not found or invalid');
            
            const { data: currentCodes } = await supabase
                .from('verification_codes')
                .select('id, attempts')
                .eq('user_id', tempUserId)
                .eq('used', false)
                .order('created_at', { ascending: false })
                .limit(1);
            
            if (currentCodes && currentCodes.length > 0) {
                await supabase
                    .from('verification_codes')
                    .update({ attempts: currentCodes[0].attempts + 1 })
                    .eq('id', currentCodes[0].id);
            }
            
            return false;
        }
        
        const { error: markError } = await supabase
            .from('verification_codes')
            .update({ used: true })
            .eq('id', codes[0].id);
        
        if (markError) throw markError;
        
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ phone_verified: true })
            .eq('id', tempUserId);
        
        if (updateError) {
            console.error('❌ Error updating phone_verified:', updateError);
        }
        console.log('✅ Phone marked as verified');
        console.log('✅ 2FA code validated, reconnecting user...');
        
        if (!tempUserProfile || !tempUserProfile.email || !window.tempPassword) {
            throw new Error('Données de connexion manquantes');
        }
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: tempUserProfile.email,
            password: window.tempPassword
        });
        
        if (signInError) {
            console.error('❌ Error signing in after 2FA:', signInError);
            throw signInError;
        }
        
        console.log('✅ User signed in successfully after 2FA');
        
        delete window.tempPassword;
        
        setIsSignupInProgress(false);
        console.log('🔓 Signup complete - unblocking renders');
        
        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', signInData.user.id)
            .single();
        
        setCurrentUser(signInData.user);
        setIs2FAMode(false);
        setTempUserId(null);
        setTempUserProfile(null);
        
        console.log('✅ Session restored, currentUser:', currentUser);
        
        return true;
    } catch (error) {
        console.error('Erreur verify2FACode:', error);
        setIsSignupInProgress(false);
        return false;
    }
}

// OAuth - Afficher popup d'avertissement
export function showOAuthWarning(provider, oauthTranslations, i18next) {
    const modal = document.getElementById('oauthWarningModal');
    const providerName = provider === 'google' ? 'Google' : 'Apple';
    const currentLang = i18next.language || 'fr';
    const trans = oauthTranslations[currentLang] || oauthTranslations['fr'];
    
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

export async function proceedWithOAuth(supabase, provider) {
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

// Charger le profil utilisateur
export async function loadUserProfile(supabase, user = null) {
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

        // Cas erreur « classique »
        if (error && error.code !== 'PGRST116') {
            console.error('❌ Error loading profile:', error);
            alert('Erreur lors du chargement du profil: ' + error.message);
            return false;
        }

        // Cas « aucune ligne trouvée »
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

// Déconnexion
export async function logout(supabase) {
    console.log('🚪 Logout called');
    
    try {
        console.log('🔓 Signing out from Supabase...');
        
        supabase.auth.signOut(); // Pas de await !
        
        console.log('🧹 Cleaning ALL session data...');
        localStorage.clear();
        sessionStorage.clear();
        
        // Réinitialiser les variables globales
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
        
        // Même en cas d'erreur, forcer la déconnexion
        console.log('🚨 Forcing logout despite error...');
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = window.location.origin;
    }
}
