// ✅ FONCTION CORRIGÉE : Vérifier code ET créer le compte
export async function verify2FACode(code, phone) {
    const supabase = window.supabase;
    
    try {
        console.log('🔍 Verifying 2FA code for phone:', phone);
        console.log('🔢 Code entered:', code);
        
        // 1. Chercher le code dans verification_codes (en texte brut)
        const { data: verificationData, error: verifyError } = await supabase
            .from('verification_codes')
            .select('*')
            .eq('phone', phone)
            .eq('code', code)  // ✅ Comparaison directe en texte brut
            .eq('used', false)
            .eq('verified', false)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        
        if (verifyError || !verificationData) {
            console.log('❌ Code not found or invalid');
            console.log('Error details:', verifyError);
            
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
        
        console.log('✅ Code validated:', verificationData);
        
        // 2. Récupérer le pending_signup
        const { data: pendingSignup, error: pendingError } = await supabase
            .from('pending_signups')
            .select('*')
            .eq('phone', phone)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        
        if (pendingError || !pendingSignup) {
            console.error('❌ Pending signup not found');
            return { success: false, error: 'Données d\'inscription non trouvées' };
        }
        
        console.log('✅ Pending signup found:', pendingSignup.email);
        
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
            throw signUpError;
        }
        
        console.log('✅ Account created successfully');
        const userId = signUpData.user.id;
        
        // 4. Créer le profil
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
        
        // 5. Marquer le code comme utilisé
        await supabase
            .from('verification_codes')
            .update({ 
                used: true,
                verified: true,
                user_id: userId
            })
            .eq('id', verificationData.id);
        
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
