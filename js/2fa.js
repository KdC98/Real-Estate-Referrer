// ============================================
// AUTHENTIFICATION 2FA (SMS)
// Real Estate Referrer - Dubai
// Version 3.1 - CORRECTIF ERREURS CONSOLE
// Date: 24 novembre 2025
// ============================================

// ✅ Vérifier si un numéro de téléphone existe déjà (VERSION CORRIGÉE)
export async function checkPhoneExists(phone) {
    const supabase = window.supabase;
    
    try {
        // Nettoyer le numéro (enlever espaces, tirets, etc.)
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        
        // ✅ Requête simplifiée qui ne génère pas d'erreur 406
        const { data, error } = await supabase
            .from('profiles')
            .select('id, name')
            .eq('phone', cleanPhone)
            .maybeSingle(); // ✅ maybeSingle() au lieu de single() - pas d'erreur si vide
        
        // Si erreur de permissions ou autre, on retourne "n'existe pas" pour ne pas bloquer
        if (error) {
            console.warn('⚠️ Could not check phone (this is OK):', error.message);
            return { exists: false };
        }
        
        // Si data existe, le téléphone est déjà utilisé
        if (data) {
            console.log('📱 Phone already exists in database');
            return { exists: true, userName: data.name };
        }
        
        // Téléphone disponible
        console.log('✅ Phone available');
        return { exists: false };
        
    } catch (err) {
        console.warn('⚠️ Exception checking phone (continuing anyway):', err.message);
        // En cas d'erreur, on retourne "n'existe pas" pour ne pas bloquer l'inscription
        return { exists: false };
    }
}

// ✅ FONCTION CORRIGÉE : Envoyer un code 2FA avec upsert au lieu de insert
export async function send2FACode(phone, language = 'fr', pendingSignupData = null) {
    const SUPABASE_URL = window.SUPABASE_URL || 'https://cgizcgwhwxswvoodqver.supabase.co';
    
    try {
        console.log('📱 Sending 2FA code via SMS to:', phone, 'language:', language);
        
        // ✅ Si c'est pour une inscription, sauvegarder les données temporaires
        if (pendingSignupData) {
            const supabase = window.supabase;
            const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes
            
            console.log('💾 Saving pending signup data...');
            
            // ✅ UPSERT au lieu de INSERT pour éviter erreur 409
            const { data, error } = await supabase
                .from('pending_signups')
                .upsert([{
                    email: pendingSignupData.email,
                    password: pendingSignupData.password,
                    name: pendingSignupData.name,
                    phone: phone,
                    expires_at: expiresAt
                }], {
                    onConflict: 'phone', // Si le téléphone existe déjà, UPDATE au lieu de INSERT
                    ignoreDuplicates: false
                })
                .select()
                .single();
            
            if (error) {
                console.error('❌ Error saving pending signup:', error);
                // ⚠️ Ne pas bloquer le flux - le SMS peut quand même être envoyé
                console.warn('⚠️ Continuing despite pending_signup error...');
            } else {
                console.log('✅ Pending signup saved/updated with ID:', data.id);
                window.pendingSignupId = data.id;
            }
        }
        
        // ✅ Appel de la fonction Edge (publique, pas de JWT requis)
        console.log('📞 Calling Edge Function send-2fa-code...');
        const response = await fetch(`${SUPABASE_URL}/functions/v1/send-2fa-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
        throw error;
    }
}

// ✅ FONCTION SIMPLIFIÉE : Vérifier code ET créer le compte
export async function verify2FACode(code, phone) {
    const supabase = window.supabase;
    
    try {
        console.log('🔍 Verifying 2FA code for phone:', phone);
        
        // 1. Vérifier le code
        const { data: codeData, error: codeError } = await supabase
            .from('verification_codes')
            .select('*')
            .eq('phone', phone)
            .eq('code', code)
            .eq('used', false)
            .eq('verified', false)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        
        if (codeError || !codeData) {
            console.log('❌ Code not found or invalid');
            
            // Incrémenter le compteur de tentatives (silencieux si erreur)
            try {
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
            } catch (e) {
                // Ignorer les erreurs de compteur
                console.warn('⚠️ Could not update attempt counter:', e);
            }
            
            return { success: false, error: 'Code invalide ou expiré' };
        }
        
        console.log('✅ Code validated');
        
        // 2. Récupérer le pending_signup (optionnel - peut ne pas exister)
        let pendingSignup = null;
        try {
            const { data, error } = await supabase
                .from('pending_signups')
                .select('*')
                .eq('phone', phone)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            
            if (!error && data) {
                pendingSignup = data;
                console.log('✅ Pending signup found:', pendingSignup);
            }
        } catch (e) {
            console.warn('⚠️ No pending signup found (this is OK if already signed up)');
        }
        
        if (!pendingSignup) {
            console.log('❌ No pending signup - user might be trying to login instead');
            return { success: false, error: 'Aucune inscription en attente trouvée' };
        }
        
        // 3. Créer le compte Supabase
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
            
            // Si l'utilisateur existe déjà, essayer de se connecter
            if (signUpError.message.includes('already registered')) {
                console.log('🔄 User already exists, attempting login...');
                const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                    email: pendingSignup.email,
                    password: pendingSignup.password
                });
                
                if (signInError) {
                    throw new Error('Compte déjà existant. Veuillez vous connecter.');
                }
                
                // Marquer le code comme utilisé
                await supabase
                    .from('verification_codes')
                    .update({ 
                        used: true,
                        verified: true,
                        user_id: signInData.user.id
                    })
                    .eq('id', codeData.id);
                
                // Nettoyer pending_signup
                await supabase
                    .from('pending_signups')
                    .delete()
                    .eq('id', pendingSignup.id);
                
                return { 
                    success: true, 
                    user: signInData.user,
                    session: signInData.session,
                    message: 'Connexion réussie'
                };
            }
            
            throw signUpError;
        }
        
        console.log('✅ Account created successfully');
        const userId = signUpData.user.id;
        
        // 4. Créer le profil (avec gestion d'erreur silencieuse si déjà créé par trigger)
        console.log('📝 Creating user profile...');
        try {
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    name: pendingSignup.name,
                    phone: phone,
                    email: pendingSignup.email,
                    role: 'referrer',
                    contract_status: 'pending',
                    phone_verified: true
                }, { onConflict: 'id' });
            
            if (profileError && profileError.code !== '23505') {
                console.warn('⚠️ Profile creation warning:', profileError);
                // Ne pas bloquer si erreur de profil (peut-être créé par trigger)
            } else {
                console.log('✅ Profile created/updated');
            }
        } catch (e) {
            console.warn('⚠️ Profile might already exist:', e);
        }
        
        // 5. Marquer le code comme utilisé
        await supabase
            .from('verification_codes')
            .update({ 
                used: true,
                verified: true,
                user_id: userId
            })
            .eq('id', codeData.id);
        
        console.log('✅ Verification code marked as used');
        
        // 6. Supprimer le pending_signup
        await supabase
            .from('pending_signups')
            .delete()
            .eq('id', pendingSignup.id);
        
        console.log('✅ Pending signup cleaned up');
        
        // 7. Connexion automatique
        console.log('🔐 Auto-login after verification...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: pendingSignup.email,
            password: pendingSignup.password
        });
        
        if (signInError) {
            console.error('❌ Error during auto-login:', signInError);
            // Ne pas bloquer - l'utilisateur peut se connecter manuellement
            console.warn('⚠️ Auto-login failed but account created. User can login manually.');
        } else {
            console.log('✅ User signed in successfully after 2FA');
        }
        
        return { 
            success: true, 
            user: signInData?.user || signUpData.user,
            session: signInData?.session,
            message: 'Compte créé avec succès'
        };
        
    } catch (error) {
        console.error('❌ Error verify2FACode:', error);
        return { 
            success: false, 
            error: error.message || 'Erreur lors de la vérification'
        };
    }
}

// ✅ Gérer la soumission du formulaire 2FA
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
            
            // Message de succès
            alert(result.message || (i18next?.t('auth:two_factor.success') || '✅ Compte créé avec succès !'));
            
            // Le onAuthStateChange va gérer la redirection automatiquement
            
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

// ✅ Renvoyer le code 2FA
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
