// ============================================
// AUTHENTIFICATION 2FA (SMS)
// Real Estate Referrer - Dubai
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

// Envoyer un code 2FA par SMS
export async function send2FACode(userId, language = 'fr', phone = null) {
    const supabase = window.supabase;
    const SUPABASE_URL = window.SUPABASE_URL || 'https://cgizcgwhwxswvoodqver.supabase.co';
    const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY;
    
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

// Vérifier un code 2FA
export async function verify2FACode(code, tempUserId, tempUserProfile) {
    const supabase = window.supabase;
    
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
        
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', signInData.user.id)
            .single();
        
        // Mettre à jour les variables globales
        if (window.setCurrentUser) window.setCurrentUser(signInData.user);
        if (window.setUserProfile) window.setUserProfile(profileData);
        if (window.setIs2FAMode) window.setIs2FAMode(false);
        if (window.setTempUserId) window.setTempUserId(null);
        if (window.setTempUserProfile) window.setTempUserProfile(null);
        if (window.setIsSignupInProgress) window.setIsSignupInProgress(false);
        
        console.log('✅ Session restored');
        
        return true;
    } catch (error) {
        console.error('Erreur verify2FACode:', error);
        if (window.setIsSignupInProgress) window.setIsSignupInProgress(false);
        return false;
    }
}

// Gérer la soumission du formulaire 2FA
export async function handle2FASubmit(event) {
    event.preventDefault();
    
    const code = document.getElementById('code2fa').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const codeInput = document.getElementById('code2fa');
    
    // Validation du format
    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
        alert('Le code doit contenir exactement 6 chiffres');
        return;
    }
    
    // Désactiver le bouton pendant la vérification
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Vérification...';
    }
    if (codeInput) {
        codeInput.disabled = true;
    }
    
    try {
        console.log('🔍 Verifying 2FA code...');
        
        const tempUserId = window.tempUserId;
        const tempUserProfile = window.tempUserProfile;
        
        const isValid = await verify2FACode(code, tempUserId, tempUserProfile);
        
        if (isValid) {
            console.log('✅ 2FA code validated successfully');
            // Le render sera appelé automatiquement par verify2FACode
            if (window.render) window.render();
        } else {
            console.error('❌ 2FA code validation failed');
            alert('Code invalide ou expiré. Veuillez réessayer.');
            
            // Réactiver les champs
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = window.i18next?.t('auth:two_factor.verify_button') || 'Vérifier';
            }
            if (codeInput) {
                codeInput.disabled = false;
                codeInput.value = '';
                codeInput.focus();
            }
        }
    } catch (error) {
        console.error('❌ Error during 2FA verification:', error);
        alert('Erreur lors de la vérification. Veuillez réessayer.');
        
        // Réactiver les champs
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = window.i18next?.t('auth:two_factor.verify_button') || 'Vérifier';
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
    const tempUserId = window.tempUserId;
    const tempUserProfile = window.tempUserProfile;
    const i18next = window.i18next;
    
    if (tempUserId && tempUserProfile?.phone) {
        const currentLang = i18next?.language || 'fr';
        const success = await send2FACode(tempUserId, currentLang, tempUserProfile.phone);
        if (success) {
            alert(i18next?.t('auth:two_factor.code_sent') || 'Code envoyé !');
        }
    } else {
        console.error('❌ No tempUserId or phone available for resend');
        alert('Impossible de renvoyer le code. Veuillez recommencer l\'inscription.');
    }
}
