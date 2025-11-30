// =====================================================
// 2FA MODULE - Vérification SMS avec Spinner
// Version: 2.3.1 - 30 novembre 2025
// =====================================================

// Fonction pour vérifier si un numéro de téléphone existe déjà
export async function checkPhoneExists(phone) {
    console.log('🔍 Checking if phone exists:', phone);
    
    try {
        const { data, error } = await window.supabase
            .from('profiles')
            .select('id, name')
            .eq('phone', phone)
            .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
            console.error('❌ Error checking phone:', error);
            return { exists: false };
        }
        
        if (data) {
            console.log('⚠️ Phone already exists for user:', data.name);
            return { exists: true, userName: data.name };
        }
        
        console.log('✅ Phone is available');
        return { exists: false };
    } catch (err) {
        console.error('❌ Exception checking phone:', err);
        return { exists: false };
    }
}

// Fonction pour envoyer le code 2FA via Itooki
export async function send2FACode(phone, lang = 'fr', pendingSignupData = null) {
    console.log('📱 Sending 2FA code to:', phone);
    
    // Messages selon la langue
    const messages = {
        fr: 'Votre code de vérification Real Estate Referrer est: ',
        en: 'Your Real Estate Referrer verification code is: ',
        ar: 'رمز التحقق الخاص بك هو: ',
        ru: 'Ваш код подтверждения: ',
        hi: 'आपका सत्यापन कोड है: ',
        ur: 'آپ کا تصدیقی کوڈ ہے: ',
        zh: '您的验证码是: ',
        tl: 'Ang iyong verification code ay: '
    };
    
    const message = messages[lang] || messages['fr'];
    
    // Générer un code à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 Generated code:', code);
    
    try {
        // Sauvegarder le pending signup avec le code
        if (pendingSignupData) {
            console.log('💾 Saving pending signup data...');
            
            // Vérifier si un pending signup existe déjà pour ce téléphone
            const { data: existing } = await window.supabase
                .from('pending_signups')
                .select('id, attempts, last_attempt')
                .eq('phone', phone)
                .maybeSingle();
            
            if (existing) {
                // Vérifier le rate limiting (max 5 tentatives par heure)
                const lastAttempt = new Date(existing.last_attempt);
                const now = new Date();
                const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
                
                if (lastAttempt > hourAgo && existing.attempts >= 5) {
                    const waitMinutes = Math.ceil((lastAttempt.getTime() + 60 * 60 * 1000 - now.getTime()) / 60000);
                    throw new Error(`Trop de tentatives. Veuillez attendre ${waitMinutes} minutes.`);
                }
                
                // Reset les tentatives si plus d'une heure
                const newAttempts = lastAttempt > hourAgo ? existing.attempts + 1 : 1;
                
                // Mettre à jour le pending signup existant
                const { error: updateError } = await window.supabase
                    .from('pending_signups')
                    .update({
                        email: pendingSignupData.email,
                        password: pendingSignupData.password,
                        name: pendingSignupData.name,
                        verification_code: code,
                        attempts: newAttempts,
                        last_attempt: new Date().toISOString(),
                        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min
                    })
                    .eq('id', existing.id);
                
                if (updateError) {
                    console.error('❌ Error updating pending signup:', updateError);
                    throw updateError;
                }
                
                window.pendingSignupId = existing.id;
            } else {
                // Créer un nouveau pending signup
                const { data: newPending, error: insertError } = await window.supabase
                    .from('pending_signups')
                    .insert({
                        phone: phone,
                        email: pendingSignupData.email,
                        password: pendingSignupData.password,
                        name: pendingSignupData.name,
                        verification_code: code,
                        attempts: 1,
                        last_attempt: new Date().toISOString(),
                        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min
                    })
                    .select()
                    .single();
                
                if (insertError) {
                    console.error('❌ Error creating pending signup:', insertError);
                    throw insertError;
                }
                
                window.pendingSignupId = newPending.id;
            }
            
            console.log('✅ Pending signup saved/updated');
        }
        
        // Appeler l'API Itooki pour envoyer le SMS
        const itookiUrl = 'https://www.itooki.fr/http.php';
        const params = new URLSearchParams({
            email: 'karyne.declercq@icloud.com',
            pass: 'Paris97440',
            numero: phone.replace('+', ''),
            message: message + code,
            expediteur: 'RealEstate'
        });
        
        console.log('📤 Sending SMS via Itooki...');
        const response = await fetch(`${itookiUrl}?${params.toString()}`);
        const result = await response.text();
        console.log('📥 Itooki response:', result);
        
        if (result.includes('KO') || result.includes('error')) {
            throw new Error('Erreur lors de l\'envoi du SMS');
        }
        
        console.log('✅ SMS sent successfully');
        return { success: true, code: code };
        
    } catch (error) {
        console.error('❌ Error sending 2FA code:', error);
        throw error;
    }
}

// Fonction pour vérifier le code 2FA
export async function verify2FACode(phone, code) {
    console.log('🔐 Verifying 2FA code for:', phone);
    
    try {
        // Récupérer le pending signup
        const { data: pending, error } = await window.supabase
            .from('pending_signups')
            .select('*')
            .eq('phone', phone)
            .maybeSingle();
        
        if (error) {
            console.error('❌ Error fetching pending signup:', error);
            return { success: false, error: 'Erreur de vérification' };
        }
        
        if (!pending) {
            console.error('❌ No pending signup found for phone:', phone);
            return { success: false, error: 'Aucune inscription en attente' };
        }
        
        // Vérifier l'expiration
        if (new Date(pending.expires_at) < new Date()) {
            console.error('❌ Code expired');
            return { success: false, error: 'Code expiré. Veuillez en demander un nouveau.' };
        }
        
        // Vérifier le code
        if (pending.verification_code !== code) {
            console.error('❌ Invalid code');
            return { success: false, error: 'Code invalide' };
        }
        
        console.log('✅ Code verified successfully');
        return { 
            success: true, 
            pendingData: pending 
        };
        
    } catch (error) {
        console.error('❌ Exception verifying code:', error);
        return { success: false, error: error.message };
    }
}

// =====================================================
// HANDLER 2FA SUBMIT - AVEC SPINNER
// =====================================================
export async function handle2FASubmit(e) {
    e.preventDefault();
    console.log('📱 2FA form submitted');
    
    const codeInput = document.getElementById('code2fa');
    const errorDiv = document.getElementById('error2fa');
    const submitBtn = document.getElementById('verify2faBtn');
    
    if (!codeInput || !submitBtn) {
        console.error('❌ Required elements not found');
        return;
    }
    
    const code = codeInput.value.trim();
    
    // Validation du format
    if (!/^\d{6}$/.test(code)) {
        if (errorDiv) {
            errorDiv.textContent = i18next?.t('auth:two_factor.code_format_error') || 'Le code doit contenir exactement 6 chiffres';
            errorDiv.classList.remove('hidden');
        }
        return;
    }
    
    // =====================================================
    // ✅ SPINNER - DÉBUT
    // =====================================================
    const originalContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        ${i18next?.t('auth:two_factor.verifying') || 'Vérification...'}
    `;
    // =====================================================
    // ✅ SPINNER - FIN
    // =====================================================
    
    if (errorDiv) {
        errorDiv.classList.add('hidden');
    }
    
    try {
        const phone = window.tempPhone;
        
        if (!phone) {
            throw new Error('Numéro de téléphone non trouvé');
        }
        
        console.log('🔐 Verifying code for phone:', phone);
        
        // Vérifier le code
        const verifyResult = await verify2FACode(phone, code);
        
        if (!verifyResult.success) {
            throw new Error(verifyResult.error || 'Code invalide ou expiré');
        }
        
        console.log('✅ Code verified, creating account...');
        
        const pendingData = verifyResult.pendingData;
        
        // Créer le compte Supabase
        const { data: signUpData, error: signUpError } = await window.supabase.auth.signUp({
            email: pendingData.email,
            password: pendingData.password,
            options: {
                data: {
                    name: pendingData.name,
                    phone: phone
                },
                emailRedirectTo: window.location.origin
            }
        });
        
        if (signUpError) {
            console.error('❌ Signup error:', signUpError);
            throw signUpError;
        }
        
        console.log('✅ Account created successfully:', signUpData);
        
        // Mettre à jour le profil avec phone_verified = true
        if (signUpData.user) {
            const { error: profileError } = await window.supabase
                .from('profiles')
                .upsert({
                    id: signUpData.user.id,
                    name: pendingData.name,
                    phone: phone,
                    email: pendingData.email,
                    role: 'referrer',
                    phone_verified: true,
                    contract_status: 'pending'
                }, { onConflict: 'id' });
            
            if (profileError) {
                console.error('❌ Profile update error:', profileError);
            } else {
                console.log('✅ Profile updated with phone_verified = true');
            }
        }
        
        // Supprimer le pending signup
        await window.supabase
            .from('pending_signups')
            .delete()
            .eq('phone', phone);
        
        console.log('✅ Pending signup deleted');
        
        // Reset le mode 2FA
        if (window.setIs2FAMode) {
            window.setIs2FAMode(false);
        }
        window.is2FAMode = false;
        window.tempPhone = null;
        window.pendingSignupId = null;
        
        // =====================================================
        // ✅ MESSAGE DE SUCCÈS TRADUIT
        // =====================================================
        const successMessage = i18next?.t('auth:two_factor.account_created') || '✅ Compte créé avec succès !';
        alert(successMessage);
        
        // Auto-login
        console.log('🔐 Auto-login after verification...');
        const { data: loginData, error: loginError } = await window.supabase.auth.signInWithPassword({
            email: pendingData.email,
            password: pendingData.password
        });
        
        if (loginError) {
            console.error('❌ Auto-login failed:', loginError);
            // Rediriger vers la page de connexion
            if (window.showLogin) {
                window.showLogin();
            }
        } else {
            console.log('✅ Auto-login successful');
            // Le onAuthStateChange va gérer la suite
        }
        
    } catch (error) {
        console.error('❌ 2FA verification error:', error);
        
        // =====================================================
        // ✅ RESTAURER LE BOUTON EN CAS D'ERREUR
        // =====================================================
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
        
        if (errorDiv) {
            let errorMessage = error.message;
            
            if (error.message.includes('Invalid') || error.message.includes('invalide')) {
                errorMessage = i18next?.t('auth:two_factor.invalid_or_expired') || 'Code invalide ou expiré. Veuillez réessayer.';
            } else if (error.message.includes('User already registered')) {
                errorMessage = 'Cet email est déjà utilisé';
            }
            
            errorDiv.textContent = errorMessage;
            errorDiv.classList.remove('hidden');
        }
    }
}

// Fonction pour renvoyer le code 2FA
export async function resend2FACode() {
    console.log('🔄 Resending 2FA code...');
    
    const resendBtn = document.querySelector('[onclick*="resend2FACode"]') || document.getElementById('resendBtn');
    const originalText = resendBtn?.textContent || 'Renvoyer le code';
    
    try {
        const phone = window.tempPhone;
        
        if (!phone) {
            throw new Error(i18next?.t('auth:two_factor.no_phone') || 'Impossible de renvoyer le code. Veuillez recommencer l\'inscription.');
        }
        
        // Désactiver le bouton
        if (resendBtn) {
            resendBtn.disabled = true;
            resendBtn.textContent = i18next?.t('auth:two_factor.sending') || 'Envoi...';
        }
        
        const currentLang = i18next?.language || 'fr';
        
        // Récupérer les données du pending signup
        const { data: pending } = await window.supabase
            .from('pending_signups')
            .select('*')
            .eq('phone', phone)
            .maybeSingle();
        
        if (!pending) {
            throw new Error('Données d\'inscription non trouvées. Veuillez recommencer.');
        }
        
        // Renvoyer le code
        const result = await send2FACode(phone, currentLang, {
            email: pending.email,
            password: pending.password,
            name: pending.name
        });
        
        if (result.success) {
            alert(i18next?.t('auth:two_factor.code_sent') || '✅ Code envoyé !');
        }
        
    } catch (error) {
        console.error('❌ Error resending code:', error);
        
        // Messages d'erreur spécifiques pour le rate limiting
        if (error.message.includes('wait') || error.message.includes('attendre')) {
            alert(error.message);
        } else if (error.message.includes('maximum')) {
            alert(error.message);
        } else {
            alert(i18next?.t('auth:two_factor.resend_error') || 'Erreur lors du renvoi du code. Veuillez réessayer.');
        }
    } finally {
        // Réactiver le bouton
        if (resendBtn) {
            resendBtn.disabled = false;
            resendBtn.textContent = originalText;
        }
    }
}

// Exposer les fonctions globalement
window.send2FACode = send2FACode;
window.verify2FACode = verify2FACode;
window.handle2FASubmit = handle2FASubmit;
window.resend2FACode = resend2FACode;
window.checkPhoneExists = checkPhoneExists;
