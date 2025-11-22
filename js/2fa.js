// ============================================
// AUTHENTIFICATION 2FA (SMS)
// Real Estate Referrer - Dubai
// Version 3.0 - Flux standard WhatsApp/Telegram
// Date: 22 novembre 2025
// ============================================

// Vérifier si un numéro de téléphone existe déjà
export async function checkPhoneExists(phone) {
    const supabase = window.supabase;
    
    try {
        // Nettoyer le numéro (enlever espaces, tirets, etc.)
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        
        const { data, error } = await supabase
            .from('profiles')
            .select('id, name')
            .eq('phone', cleanPhone)
            .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
            console.error('Error checking phone:', error);
            return { exists: false, error: error.message };
        }
        
        return { exists: !!data, userName: data?.name };
    } catch (err) {
        console.error('Exception checking phone:', err);
        return { exists: false, error: err.message };
    }
}

// ✅ NOUVELLE FONCTION : Envoyer un code 2FA SANS créer de compte (signup)
export async function send2FACode(phone, language = 'fr', pendingSignupData = null) {
    const SUPABASE_URL = window.SUPABASE_URL || 'https://cgizcgwhwxswvoodqver.supabase.co';
    
    try {
        console.log('📱 Sending 2FA code via SMS to:', phone, 'language:', language);
        
        // ✅ Si c'est pour une inscription, sauvegarder les données temporaires
        if (pendingSignupData) {
            const supabase = window.supabase;
            const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes
            
            console.log('💾 Saving pending signup data...');
            const { data, error } = await supabase
                .from('pending_signups')
                .insert([{
                    email: pendingSignupData.email,
                    password: pendingSignupData.password, // Hash côté client
                    name: pendingSignupData.name,
                    phone: phone,
                    expires_at: expiresAt
                }])
                .select()
                .single();
            
            if (error) {
                console.error('❌ Error saving pending signup:', error);
                throw new Error('Erreur de sauvegarde des données d\'inscription');
            }
            
            console.log('✅ Pending signup saved with ID:', data.id);
            window.pendingSignupId = data.id;
        }
        
        // ✅ Appel de la fonction Edge (publique, pas de JWT requis)
        console.log('📞 Calling Edge Function send-2fa-code...');
        const response = await fetch(`${SUPABASE_URL}/functions/v1/send-2fa-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // ✅ PAS de Authorization Bearer - fonction publique
            },
            body: JSON.stringify({ 
                phone: phone,
                language: language
            })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            console.error('❌ SMS send error:', result);
            
            // Gestion des erreurs de rate limiting
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
        throw error; // Propager l'erreur pour gestion dans index.html
    }
}

// ✅ NOUVELLE FONCTION : Vérifier code ET créer le compte
export async function verify2FACode(code, phone) {
    const supabase = window.supabase;
    
    try {
        console.log('🔍 Verifying 2FA code for phone:', phone);
        
        // 1. Récupérer le pending_signup et vérifier le code
        const { data: verificationData, error: verifyError } = await supabase
            .from('verification_codes')
            .select('*, pending_signups!inner(*)')
            .eq('phone', phone)
            .eq('code', code)
            .eq('used', false)
            .eq('verified', false)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        
        if (verifyError || !verificationData) {
            console.log('❌ Code not found or invalid');
            
            // Incrémenter le compteur de tentatives
            const { data: currentCodes } = await supabase
                .from('verification_codes')
                .select('id, attempts')
                .eq('phone', phone)
                .eq('used', false)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            
            if (currentCodes) {
                await supabase
                    .from('verification_codes')
                    .update({ attempts: (currentCodes.attempts || 0) + 1 })
                    .eq('id', currentCodes.id);
            }
            
            return { success: false, error: 'Code invalide ou expiré' };
        }
        
        console.log('✅ Code validated, pending signup found');
        const pendingSignup = verificationData.pending_signups;
        
        // 2. Créer le compte Supabase
        console.log('📝 Creating Supabase account...');
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: pendingSignup.email,
            password: pendingSignup.password,
            options: {
                data: { 
                    name: pendingSignup.name, 
                    phone: phone 
                }
            }
        });
        
        if (signUpError) {
            console.error('❌ Error creating account:', signUpError);
            throw signUpError;
        }
        
        console.log('✅ Account created successfully');
        const userId = signUpData.user.id;
        
        // 3. Créer le profil
        console.log('📝 Creating user profile...');
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                name: pendingSignup.name,
                phone: phone,
                email: pendingSignup.email,
                role: 'referrer',
                contract_status: 'pending',
                phone_verified: true // ✅ Téléphone déjà vérifié
            }, { onConflict: 'id' });
        
        if (profileError && profileError.code !== '23505') {
            console.error('❌ Error creating profile:', profileError);
            throw profileError;
        }
        
        console.log('✅ Profile created');
        
        // 4. Marquer le code comme utilisé
        await supabase
            .from('verification_codes')
            .update({ 
                used: true,
                verified: true,
                user_id: userId
            })
            .eq('id', verificationData.id);
        
        console.log('✅ Verification code marked as used');
        
        // 5. Supprimer le pending_signup
        await supabase
            .from('pending_signups')
            .delete()
            .eq('id', pendingSignup.id);
        
        console.log('✅ Pending signup cleaned up');
        
        // 6. Connexion automatique
        console.log('🔐 Auto-login after verification...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: pendingSignup.email,
            password: pendingSignup.password
        });
        
        if (signInError) {
            console.error('❌ Error during auto-login:', signInError);
            throw signInError;
        }
        
        console.log('✅ User signed in successfully after 2FA');
        
        return { 
            success: true, 
            user: signInData.user,
            session: signInData.session
        };
        
    } catch (error) {
        console.error('❌ Error verify2FACode:', error);
        return { 
            success: false, 
            error: error.message || 'Erreur lors de la vérification'
        };
    }
}

// Gérer la soumission du formulaire 2FA
export async function handle2FASubmit(event) {
    event.preventDefault();
    
    const code = document.getElementById('code2fa').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const codeInput = document.getElementById('code2fa');
    const i18next = window.i18next;
    
    // Validation du format
    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
        alert(i18next?.t('auth:two_factor.invalid_code') || 'Le code doit contenir exactement 6 chiffres');
        return;
    }
    
    // Désactiver le bouton pendant la vérification
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = i18next?.t('auth:two_factor.verifying') || 'Vérification...';
    }
    if (codeInput) {
        codeInput.disabled = true;
    }
    
    try {
        console.log('🔍 Verifying 2FA code...');
        
        const tempPhone = window.tempPhone;
        
        if (!tempPhone) {
            throw new Error('Numéro de téléphone manquant');
        }
        
        const result = await verify2FACode(code, tempPhone);
        
        if (result.success) {
            console.log('✅ 2FA code validated successfully, account created');
            
            // Nettoyer les variables temporaires
            delete window.tempPhone;
            delete window.pendingSignupId;
            if (window.setIs2FAMode) window.setIs2FAMode(false);
            
            // Le onAuthStateChange va gérer la suite automatiquement
            alert(i18next?.t('auth:two_factor.success') || '✅ Compte créé avec succès !');
            
        } else {
            console.error('❌ 2FA code validation failed:', result.error);
            alert(result.error || (i18next?.t('auth:two_factor.invalid_or_expired') || 'Code invalide ou expiré. Veuillez réessayer.'));
            
            // Réactiver les champs
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = i18next?.t('auth:two_factor.verify_button') || 'Vérifier';
            }
            if (codeInput) {
                codeInput.disabled = false;
                codeInput.value = '';
                codeInput.focus();
            }
        }
    } catch (error) {
        console.error('❌ Error during 2FA verification:', error);
        alert(i18next?.t('auth:two_factor.error') || 'Erreur lors de la vérification. Veuillez réessayer.');
        
        // Réactiver les champs
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = i18next?.t('auth:two_factor.verify_button') || 'Vérifier';
        }
        if (codeInput) {
            codeInput.disabled = false;
            codeInput.value = '';
            codeInput.focus();
        }
    }
}

// Renvoyer le code 2FA
export async function resend2FACode() {
    const tempPhone = window.tempPhone;
    const i18next = window.i18next;
    
    if (!tempPhone) {
        console.error('❌ No phone available for resend');
        alert(i18next?.t('auth:two_factor.no_phone') || 'Impossible de renvoyer le code. Veuillez recommencer l\'inscription.');
        return;
    }
    
    try {
        const currentLang = i18next?.language || 'fr';
        const result = await send2FACode(tempPhone, currentLang);
        
        if (result.success) {
            alert(i18next?.t('auth:two_factor.code_sent') || '✅ Code envoyé !');
        }
    } catch (error) {
        console.error('❌ Error resending code:', error);
        
        // Messages d'erreur spécifiques pour le rate limiting
        if (error.message.includes('wait')) {
            alert(error.message);
        } else if (error.message.includes('maximum')) {
            alert(error.message);
        } else {
            alert(i18next?.t('auth:two_factor.resend_error') || 'Erreur lors du renvoi du code. Veuillez réessayer.');
        }
    }
}
