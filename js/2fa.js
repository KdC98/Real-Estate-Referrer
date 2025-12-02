// =====================================================
// 2FA MODULE - Vérification SMS avec Spinner + Email Bienvenue
// Version: 2.4.1 - 2 décembre 2025
// CORRIGÉ: Logging amélioré pour debug email bienvenue
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

// =====================================================
// FONCTION ENVOI SMS VIA EDGE FUNCTION SUPABASE
// =====================================================
export async function send2FACode(phone, lang = 'fr', pendingSignupData = null) {
    console.log('📱 Sending 2FA code to:', phone);
    
    const supabase = window.supabase;
    const SUPABASE_URL = window.SUPABASE_URL;
    
    try {
        // ✅ ÉTAPE 1: Sauvegarder le pending signup
        if (pendingSignupData) {
            console.log('💾 Saving pending signup data...');
            
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 10);
            
            const { data: existing } = await supabase
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
                
                const newAttempts = lastAttempt > hourAgo ? existing.attempts + 1 : 1;
                
                const { error: updateError } = await supabase
                    .from('pending_signups')
                    .update({
                        email: pendingSignupData.email,
                        password: pendingSignupData.password,
                        name: pendingSignupData.name,
                        attempts: newAttempts,
                        last_attempt: new Date().toISOString(),
                        expires_at: expiresAt.toISOString()
                    })
                    .eq('id', existing.id);
                
                if (updateError) {
                    console.error('❌ Error updating pending signup:', updateError);
                } else {
                    console.log('✅ Pending signup updated');
                    window.pendingSignupId = existing.id;
                }
            } else {
                const { data: newPending, error: insertError } = await supabase
                    .from('pending_signups')
                    .insert({
                        phone: phone,
                        email: pendingSignupData.email,
                        password: pendingSignupData.password,
                        name: pendingSignupData.name,
                        attempts: 1,
                        last_attempt: new Date().toISOString(),
                        expires_at: expiresAt.toISOString()
                    })
                    .select()
                    .single();
                
                if (insertError) {
                    console.error('❌ Error creating pending signup:', insertError);
                } else {
                    console.log('✅ Pending signup saved with ID:', newPending.id);
                    window.pendingSignupId = newPending.id;
                }
            }
        }
        
        // ✅ ÉTAPE 2: Appeler l'Edge Function Supabase pour envoyer le SMS
        console.log('📞 Calling Edge Function send-2fa-code...');
        
        const response = await fetch(`${SUPABASE_URL}/functions/v1/send-2fa-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                phone: phone,
                language: lang
            })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            console.error('❌ SMS send error:', result);
            
            if (result.error && result.error.includes('wait')) {
                throw new Error(result.error);
            }
            if (result.error && result.error.includes('maximum')) {
                throw new Error(result.error);
            }
            
            throw new Error(result.error || 'Erreur envoi SMS');
        }
        
        console.log('✅ SMS code sent successfully');
        console.log('⏰ Code expires at:', result.expiresAt);
        return { success: true, expiresAt: result.expiresAt };
        
    } catch (error) {
        console.error('❌ Erreur send2FACode:', error);
        throw error;
    }
}

// =====================================================
// FONCTION VÉRIFICATION DU CODE - VIA BASE DE DONNÉES
// =====================================================
export async function verify2FACode(phone, code) {
    console.log('🔐 Verifying 2FA code for:', phone);
    
    const supabase = window.supabase;
    
    try {
        // ✅ Vérifier le code dans la table verification_codes
        console.log('🔍 Checking code in verification_codes table...');
        
        const { data: verificationData, error: verificationError } = await supabase
            .from('verification_codes')
            .select('*')
            .eq('phone', phone)
            .eq('code', code)
            .eq('verified', false)
            .gte('expires_at', new Date().toISOString())
            .maybeSingle();
        
        if (verificationError) {
            console.error('❌ Error checking verification code:', verificationError);
            return { success: false, error: 'Erreur de vérification' };
        }
        
        if (!verificationData) {
            console.error('❌ Code not found or expired');
            return { success: false, error: 'Code invalide ou expiré' };
        }
        
        console.log('✅ Code found and valid!');
        
        // Marquer le code comme vérifié
        await supabase
            .from('verification_codes')
            .update({ verified: true })
            .eq('id', verificationData.id);
        
        // Récupérer les données du pending signup
        const { data: pending, error: fetchError } = await supabase
            .from('pending_signups')
            .select('*')
            .eq('phone', phone)
            .maybeSingle();
        
        if (fetchError || !pending) {
            console.error('❌ Could not fetch pending signup:', fetchError);
            return { success: false, error: 'Données d\'inscription non trouvées' };
        }
        
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
// HANDLER 2FA SUBMIT - AVEC SPINNER + EMAIL BIENVENUE
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
    
    // =====================================================
    // ✅ FEEDBACK IMMÉDIAT - Griser le bouton TOUT DE SUITE
    // =====================================================
    const originalContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.style.cursor = 'wait';
    submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-900 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        ${i18next?.t('auth:two_factor.verifying') || 'Vérification...'}
    `;
    // =====================================================
    
    if (errorDiv) {
        errorDiv.classList.add('hidden');
    }
    
    const code = codeInput.value.trim();
    
    // Validation du format
    if (!/^\d{6}$/.test(code)) {
        // Restaurer le bouton si erreur de validation
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
        submitBtn.innerHTML = originalContent;
        
        if (errorDiv) {
            errorDiv.textContent = i18next?.t('auth:two_factor.code_format_error') || 'Le code doit contenir exactement 6 chiffres';
            errorDiv.classList.remove('hidden');
        }
        return;
    }
    
    try {
        const phone = window.tempPhone;
        
        if (!phone) {
            throw new Error('Numéro de téléphone non trouvé');
        }
        
        console.log('🔐 Verifying code for phone:', phone);
        
        // Vérifier le code dans la BDD
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
        
        // =====================================================
        // ✅ ENVOI EMAIL DE BIENVENUE (8 LANGUES) - LOGGING AMÉLIORÉ
        // =====================================================
        try {
            console.log('📧 ====== WELCOME EMAIL DEBUG ======');
            console.log('📧 pendingData.name:', pendingData.name);
            console.log('📧 pendingData.email:', pendingData.email);
            console.log('📧 window.SUPABASE_URL:', window.SUPABASE_URL);
            console.log('📧 window.SUPABASE_ANON_KEY exists:', !!window.SUPABASE_ANON_KEY);
            
            const currentLang = i18next?.language || 'fr';
            console.log('📧 currentLang:', currentLang);
            
            // Vérifier que les données sont présentes
            if (!pendingData.name || !pendingData.email) {
                console.error('❌ Missing data for welcome email:', { name: pendingData.name, email: pendingData.email });
                throw new Error('Missing name or email for welcome email');
            }
            
            const emailPayload = {
                userName: pendingData.name,
                userEmail: pendingData.email,
                language: currentLang
            };
            
            console.log('📧 Email payload:', JSON.stringify(emailPayload));
            
            const emailUrl = `${window.SUPABASE_URL}/functions/v1/send-welcome-email`;
            console.log('📧 Calling URL:', emailUrl);
            
            const emailResponse = await fetch(emailUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify(emailPayload)
            });
            
            console.log('📧 Response status:', emailResponse.status);
            console.log('📧 Response ok:', emailResponse.ok);
            
            const responseText = await emailResponse.text();
            console.log('📧 Response body:', responseText);
            
            if (emailResponse.ok) {
                console.log('✅ Welcome email sent successfully!');
            } else {
                console.error('❌ Welcome email failed with status:', emailResponse.status);
                console.error('❌ Error details:', responseText);
            }
            
            console.log('📧 ====== END WELCOME EMAIL DEBUG ======');
            
        } catch (emailError) {
            console.error('❌ Welcome email exception:', emailError);
            console.error('❌ Exception stack:', emailError.stack);
            // On continue quand même, l'email n'est pas bloquant
        }
        // =====================================================
        
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
        const successMessage = i18next?.t('auth:two_factor.success') || '✅ Compte créé avec succès !';
        alert(successMessage);
        
        // Auto-login
        console.log('🔐 Auto-login after verification...');
        const { data: loginData, error: loginError } = await window.supabase.auth.signInWithPassword({
            email: pendingData.email,
            password: pendingData.password
        });
        
        if (loginError) {
            console.error('❌ Auto-login failed:', loginError);
            if (window.showLogin) {
                window.showLogin();
            }
        } else {
            console.log('✅ Auto-login successful');
        }
        
    } catch (error) {
        console.error('❌ 2FA verification error:', error);
        
        // =====================================================
        // ✅ RESTAURER LE BOUTON EN CAS D'ERREUR
        // =====================================================
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
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

// =====================================================
// FONCTION RENVOYER LE CODE
// =====================================================
export async function resend2FACode() {
    console.log('🔄 Resending 2FA code...');
    
    const resendBtn = document.getElementById('resendBtn');
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
        
        // Renvoyer le code via Edge Function
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
